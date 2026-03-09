/**
 * WordPress REST API 프록시 라우트
 *
 * WordPress 블로그를 프론트엔드에서 사용하기 위한 프록시
 */

import { Router } from 'express';
import { asyncHandler, Errors } from '../middleware/errorHandler.js';
import { query } from '../utils/database.js';

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
 * GET /api/wp/posts
 * WordPress 포스트 목록
 */
router.get('/posts', asyncHandler(async (req, res) => {
    const { per_page = 100, page = 1 } = req.query;

    try {
        const categories = await getWpCategories();
        const wpRes = await fetch(`${WP_API}/posts?per_page=${per_page}&page=${page}&_embed`);

        if (!wpRes.ok) {
            throw new Error(`WP API Error: ${wpRes.status}`);
        }

        const posts = await wpRes.json();
        const result = posts.map(p => wpToFrontend(p, categories));

        res.json(result);
    } catch (error) {
        console.error('WP 포스트 목록 조회 오류:', error);

        // Fallback: PostgreSQL
        try {
            const pgResult = await query(
                `SELECT id, title, slug, category, excerpt, author,
                        read_time as "readTime", tags, thumbnail,
                        to_char(created_at, 'YYYY-MM-DD') as date
                 FROM blogs
                 WHERE status = 'published'
                 ORDER BY created_at DESC
                 LIMIT $1`,
                [per_page]
            );
            res.json(pgResult.rows);
        } catch (pgErr) {
            throw Errors.Internal('블로그 목록을 불러올 수 없습니다.');
        }
    }
}));

/**
 * GET /api/wp/posts/:slug
 * WordPress 포스트 상세
 */
router.get('/posts/:slug', asyncHandler(async (req, res) => {
    const { slug } = req.params;

    try {
        const categories = await getWpCategories();
        const wpRes = await fetch(`${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed`);

        if (!wpRes.ok) {
            throw new Error(`WP API Error: ${wpRes.status}`);
        }

        const posts = await wpRes.json();

        if (posts.length === 0) {
            throw Errors.NotFound('블로그 글');
        }

        res.json(wpToFrontend(posts[0], categories));
    } catch (error) {
        if (error.code === 'NOT_FOUND') {
            throw error;
        }

        console.error('WP 포스트 상세 조회 오류:', error);

        // Fallback: PostgreSQL
        try {
            const pgResult = await query(
                `SELECT id, title, slug, category, excerpt, content, author,
                        read_time as "readTime", tags, thumbnail,
                        to_char(created_at, 'YYYY-MM-DD') as date
                 FROM blogs
                 WHERE slug = $1 AND status = 'published'`,
                [slug]
            );

            if (pgResult.rows.length === 0) {
                throw Errors.NotFound('블로그 글');
            }

            res.json(pgResult.rows[0]);
        } catch (pgErr) {
            if (pgErr.code === 'NOT_FOUND') {
                throw pgErr;
            }
            throw Errors.Internal('블로그 글을 불러올 수 없습니다.');
        }
    }
}));

export default router;
