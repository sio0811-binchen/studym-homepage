/**
 * SEO 라우트 (Sitemap, RSS)
 */

import { Router } from 'express';
import { query } from '../utils/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

const BASE_URL = process.env.BASE_URL || 'https://studym.co.kr';

/**
 * GET /sitemap.xml
 * SEO 사이트맵
 */
router.get('/sitemap.xml', asyncHandler(async (req, res) => {
    // 블로그 글 목록 조회
    let blogPosts = [];
    try {
        const result = await query(
            `SELECT slug, updated_at FROM blogs WHERE status = 'published' ORDER BY updated_at DESC`
        );
        blogPosts = result.rows;
    } catch (e) {
        // 테이블이 없으면 무시
        console.warn('블로그 테이블 조회 실패:', e.message);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 정적 페이지 (App.tsx의 실제 라우트와 일치해야 함)
    const staticPages = [
        { path: '', changefreq: 'weekly', priority: '1.0' },
        { path: '/story', changefreq: 'monthly', priority: '0.8' },
        { path: '/diagnosis', changefreq: 'monthly', priority: '0.8' },
        { path: '/blog', changefreq: 'daily', priority: '0.9' },
        { path: '/programs/standard', changefreq: 'monthly', priority: '0.7' },
        { path: '/programs/weekly', changefreq: 'monthly', priority: '0.7' },
        { path: '/programs/winter-school', changefreq: 'monthly', priority: '0.7' },
        { path: '/franchise', changefreq: 'monthly', priority: '0.7' },
        { path: '/branches', changefreq: 'monthly', priority: '0.7' },
        { path: '/locations', changefreq: 'monthly', priority: '0.7' },
        { path: '/about', changefreq: 'monthly', priority: '0.6' },
        { path: '/features', changefreq: 'monthly', priority: '0.6' },
        { path: '/manual', changefreq: 'yearly', priority: '0.4' },
        { path: '/privacy', changefreq: 'yearly', priority: '0.3' }
    ];

    staticPages.forEach(page => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    // 블로그 동적 페이지
    blogPosts.forEach(post => {
        const lastmod = post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
}));

/**
 * GET /rss.xml
 * RSS 피드
 */
router.get('/rss.xml', asyncHandler(async (req, res) => {
    // 블로그 글 목록 조회
    let blogPosts = [];
    try {
        const result = await query(
            `SELECT title, slug, excerpt, author, created_at
             FROM blogs
             WHERE status = 'published'
             ORDER BY created_at DESC
             LIMIT 50`
        );
        blogPosts = result.rows;
    } catch (e) {
        console.warn('블로그 테이블 조회 실패:', e.message);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
    xml += '<rss version="2.0">\n';
    xml += '<channel>\n';
    xml += '  <title>Study M 교육연구소 칼럼</title>\n';
    xml += `  <link>${BASE_URL}/blog</link>\n`;
    xml += '  <description>Study M의 학부모 맞춤형 전문 교육 가이드</description>\n';
    xml += '  <language>ko</language>\n';

    blogPosts.forEach(post => {
        const pubDate = post.created_at ? new Date(post.created_at).toUTCString() : new Date().toUTCString();
        xml += '  <item>\n';
        xml += `    <title><![CDATA[${post.title || '제목 없음'}]]></title>\n`;
        xml += `    <link>${BASE_URL}/blog/${post.slug}</link>\n`;
        xml += `    <description><![CDATA[${post.excerpt || ''}]]></description>\n`;
        xml += `    <pubDate>${pubDate}</pubDate>\n`;
        xml += `    <author>${post.author || 'Study M 교육연구소'}</author>\n`;
        xml += '  </item>\n';
    });

    xml += '</channel>\n';
    xml += '</rss>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
}));

export default router;
