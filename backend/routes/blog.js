/**
 * 블로그 API 라우트
 *
 * WordPress REST API 프록시 + PostgreSQL Fallback
 */

import { Router } from 'express';
import { query } from '../utils/database.js';
import { requireAdmin, optionalAdmin } from '../middleware/auth.js';
import { asyncHandler, Errors } from '../middleware/errorHandler.js';

const router = Router();

const WP_API = process.env.WORDPRESS_API_URL || 'https://wordpress-production-63d7.up.railway.app/wp-json/wp/v2';

// WP 카테고리 캐시
let wpCategoryCache = {};
let wpCategoryCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5분

/**
 * WordPress 카테고리 조회
 */
async function getWpCategories() {
    const now = Date.now();
    if (Object.keys(wpCategoryCache).length > 0 && (now - wpCategoryCacheTime) < CACHE_TTL) {
        return wpCategoryCache;
    }

    try {
        const res = await fetch(`${WP_API}/categories?per_page=100`);
        const cats = await res.json();
        wpCategoryCache = {};
        cats.forEach(c => { wpCategoryCache[c.id] = c.name; });
        wpCategoryCacheTime = now;
    } catch (e) {
        console.error('WP 카테고리 로드 실패:', e);
    }
    return wpCategoryCache;
}

/**
 * WordPress 포스트를 프론트엔드 포맷으로 변환
 */
function wpToFrontend(post, categories) {
    const catName = post.categories && post.categories[0]
        ? (categories[post.categories[0]] || '교육 입시')
        : '교육 입시';

    const featured = post._embedded?.['wp:featuredmedia']?.[0];
    const thumbnail = featured ? featured.source_url : '';

    const tagNames = post._embedded?.['wp:term']?.[1]
        ? post._embedded['wp:term'][1].map(t => t.name)
        : [];

    const excerptText = (post.excerpt?.rendered || '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .substring(0, 200);

    return {
        id: String(post.id),
        title: post.title?.rendered || '',
        slug: post.slug || '',
        category: catName,
        excerpt: excerptText,
        content: post.content?.rendered || '',
        author: 'Study M 교육연구소',
        tags: tagNames,
        thumbnail: thumbnail,
        date: post.date ? post.date.split('T')[0] : ''
    };
}

/**
 * GET /api/blog/
 * 블로그 글 목록 조회 (WordPress 우선, PostgreSQL Fallback)
 */
router.get('/', optionalAdmin, asyncHandler(async (req, res) => {
    try {
        // WordPress 시도
        const categories = await getWpCategories();
        const wpRes = await fetch(`${WP_API}/posts?per_page=100&_embed`);

        if (wpRes.ok) {
            const posts = await wpRes.json();
            const result = posts.map(p => wpToFrontend(p, categories));
            return res.json(result);
        }
    } catch (error) {
        console.error('WP 블로그 목록 조회 오류:', error.message);
    }

    // Fallback: PostgreSQL
    const result = await query(
        `SELECT id, title, slug, category, excerpt, author,
                read_time as "readTime", tags, thumbnail,
                to_char(created_at, 'YYYY-MM-DD') as date
         FROM blogs
         WHERE status = 'published'
         ORDER BY created_at DESC`
    );
    res.json(result.rows);
}));

/**
 * GET /api/blog/:slug
 * 블로그 글 상세 조회 (WordPress 우선, PostgreSQL Fallback)
 */
router.get('/:slug', asyncHandler(async (req, res) => {
    const { slug } = req.params;

    try {
        // WordPress 시도
        const categories = await getWpCategories();
        const wpRes = await fetch(`${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed`);

        if (wpRes.ok) {
            const posts = await wpRes.json();
            if (posts.length > 0) {
                return res.json(wpToFrontend(posts[0], categories));
            }
        }
    } catch (error) {
        console.error('WP 블로그 상세 조회 오류:', error.message);
    }

    // Fallback: PostgreSQL
    const result = await query(
        `SELECT id, title, slug, category, excerpt, content, author,
                read_time as "readTime", tags, thumbnail,
                to_char(created_at, 'YYYY-MM-DD') as date
         FROM blogs
         WHERE slug = $1 AND status = 'published'`,
        [slug]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('블로그 글');
    }

    res.json(result.rows[0]);
}));

/**
 * POST /api/blog/
 * 블로그 글 생성 (관리자)
 */
router.post('/', requireAdmin, asyncHandler(async (req, res) => {
    const { title, slug, category, excerpt, content, author, read_time, tags, thumbnail, date } = req.body;

    if (!title || !slug || !content) {
        throw Errors.BadRequest('필수 필드 누락 (title, slug, content)');
    }

    // tags 배열을 JSON 문자열로 변환
    let tagsJson = tags;
    if (Array.isArray(tags)) {
        tagsJson = JSON.stringify(tags);
    }

    const result = await query(
        `INSERT INTO blogs (title, slug, category, excerpt, content, author, read_time, tags, thumbnail, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, NOW()))
         RETURNING *`,
        [title, slug, category, excerpt, content, author || 'Study M 교육연구소', read_time, tagsJson, thumbnail, date ? new Date(date) : null]
    );

    res.status(201).json({ message: 'Success', data: result.rows[0] });
}));

/**
 * DELETE /api/blog/:slug
 * 블로그 글 삭제 (관리자)
 */
router.delete('/:slug', requireAdmin, asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const result = await query(
        `DELETE FROM blogs WHERE slug = $1 RETURNING *`,
        [slug]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('블로그 글');
    }

    res.status(204).send();
}));

/**
 * POST /api/admin/delete-blogs
 * 블로그 글 일괄 삭제 (관리자)
 */
router.post('/admin/delete-blogs', requireAdmin, asyncHandler(async (req, res) => {
    const { slugs } = req.body;

    if (!Array.isArray(slugs) || slugs.length === 0) {
        throw Errors.BadRequest('slugs 배열이 필요합니다.');
    }

    const results = [];
    for (const slug of slugs) {
        const r = await query(`DELETE FROM blogs WHERE slug = $1 RETURNING slug`, [slug]);
        results.push({ slug, deleted: r.rowCount > 0 });
    }

    res.json({ message: 'Bulk delete complete', results });
}));

export default router;
