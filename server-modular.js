/**
 * StudyM Modular Server
 *
 * 기존 server.js (1072줄)를 모듈화한 새 진입점
 *
 * 보안 개선사항:
 * - API 키 기본값 제거
 * - 환경변수만 사용
 * - 중복 라우트 제거
 * - 통합 에러 처리
 *
 * ============================================================================
 * ⚠️ 중요: Express 미들웨어 순서 가이드라인
 * ============================================================================
 *
 * Express는 미들웨어를 위에서 아래로 순차적으로 실행합니다.
 * 잘못된 순서는 SPA 라우팅 404 오류를 발생시킬 수 있습니다.
 *
 * 올바른 순서:
 * 1. 기본 미들웨어 (cors, json, static 등)
 * 2. API 라우트 (/api/*)
 * 3. 정적 파일 서빙 (express.static)
 * 4. 레거시 리다이렉트
 * 5. SPA Fallback (app.get('*'))  ← 반드시 에러 핸들러 앞에!
 * 6. 에러 핸들러 (notFoundHandler, globalErrorHandler)
 *
 * ❌ 절대 하지 말 것:
 * - notFoundHandler를 SPA fallback 앞에 배치
 * - SPA fallback 없이 에러 핸들러만 등록
 *
 * 참고: 2026-03-12 SPA 라우팅 404 버그 수정 이력
 * ============================================================================
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Database
import { initDatabase, query } from './backend/utils/database.js';

// Middleware
import { globalErrorHandler, notFoundHandler } from './backend/middleware/errorHandler.js';
import { injectSEOMeta, injectBlogPostMeta } from './backend/middleware/seoPrerender.js';

// Routes
import blogRoutes from './backend/routes/blog.js';
import consultationRoutes from './backend/routes/consultations.js';
import paymentRoutes from './backend/routes/payments.js';
import franchiseRoutes from './backend/routes/franchise.js';
import smsRoutes from './backend/routes/sms.js';
import seoRoutes from './backend/routes/seo.js';
import healthRoutes from './backend/routes/health.js';
import wordpressRoutes from './backend/routes/wordpress.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ========== 미들웨어 ==========
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== www → non-www 301 리다이렉트 (SEO 표준 도메인 통일) ==========
app.use((req, res, next) => {
    const host = req.hostname || req.headers.host;
    if (host && host.startsWith('www.')) {
        const nonWwwHost = host.replace(/^www\./, '');
        return res.redirect(301, `https://${nonWwwHost}${req.originalUrl}`);
    }
    next();
});

// ========== 데이터베이스 초기화 ==========
async function setupDatabase() {
    try {
        initDatabase();

        // 테이블 생성
        await query(`
            CREATE TABLE IF NOT EXISTS consultations (
                id SERIAL PRIMARY KEY,
                student_name VARCHAR(100),
                student_school VARCHAR(200),
                student_grade VARCHAR(50),
                parent_name VARCHAR(100),
                parent_phone VARCHAR(20),
                consultation_date TIMESTAMP,
                status VARCHAR(20) DEFAULT 'PENDING',
                memo TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS franchise_inquiries (
                id SERIAL PRIMARY KEY,
                applicant_name VARCHAR(100),
                phone VARCHAR(20),
                email VARCHAR(100),
                region VARCHAR(100),
                budget VARCHAR(50),
                has_property BOOLEAN DEFAULT FALSE,
                status VARCHAR(20) DEFAULT 'NEW',
                lead_grade VARCHAR(20) DEFAULT 'HOT',
                memo TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(100) UNIQUE,
                student_name VARCHAR(100),
                student_phone VARCHAR(20),
                parent_phone VARCHAR(20),
                product_type VARCHAR(50),
                amount INTEGER,
                discount_amount INTEGER DEFAULT 0,
                discount_note VARCHAR(200),
                status VARCHAR(20) DEFAULT 'PENDING',
                manual_note TEXT,
                payment_token VARCHAR(100),
                payment_key VARCHAR(200),
                receipt_url VARCHAR(500),
                canceled_amount INTEGER DEFAULT 0,
                paid_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                category VARCHAR(100),
                excerpt TEXT,
                content TEXT NOT NULL,
                author VARCHAR(100) DEFAULT 'Study M 교육연구소',
                read_time VARCHAR(20),
                tags TEXT,
                thumbnail VARCHAR(500),
                status VARCHAR(20) DEFAULT 'published',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Migration: 기존 테이블에 컬럼 추가
        await query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_key VARCHAR(200)`);
        await query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(500)`);
        await query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS canceled_amount INTEGER DEFAULT 0`);
        await query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published'`);

        console.log('Database tables initialized');
    } catch (error) {
        console.error('Database initialization error:', error.message);
        console.log('Running in fallback mode');
    }
}

// ========== API 라우트 ==========

// Health Check
app.use('/api/health', healthRoutes);

// SEO (Sitemap, RSS)
app.use('/', seoRoutes);

// Blog API
app.use('/api/blog', blogRoutes);

// WordPress Proxy
app.use('/api/wp', wordpressRoutes);

// Consultations
app.use('/api/consultations', consultationRoutes);

// Payments
app.use('/api/payments', paymentRoutes);
app.use('/api/payment-confirm', paymentRoutes); // 결제 승인은 payments 라우트 사용
app.use('/api/payment-links', paymentRoutes);   // 결제 링크도 payments 라우트 사용

// Franchise
app.use('/api/franchise', franchiseRoutes);
app.use('/api/franchise-inquiries', franchiseRoutes);

// SMS
app.use('/api/sms', smsRoutes);

// ========== 테스트 결제 (심사용) ==========
app.post('/api/payments/test_init', async (req, res) => {
    try {
        const { student_name, student_phone, amount } = req.body;
        const order_id = `test_${Date.now()}`;
        const payment_token = `pay_test_${Date.now()}`;

        const result = await query(
            `INSERT INTO payments
             (order_id, student_name, student_phone, parent_phone, product_type, amount, payment_token, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
             RETURNING *`,
            [order_id, student_name, student_phone, '000-0000-0000', 'TEST_PRODUCT', amount || 1000, payment_token]
        );

        res.status(201).json({
            order_id,
            payment_link: {
                token: payment_token,
                url: `${process.env.BASE_URL || 'https://studym.co.kr'}/pay/${payment_token}`
            }
        });
    } catch (error) {
        console.error('테스트 결제 생성 오류:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========== 정적 파일 서빙 ==========
app.use(express.static(path.join(__dirname, 'dist')));

// ========== 레거시 URL 301 리다이렉트 (Google Search Console 중복 페이지 해결) ==========
app.get('/columns', (req, res) => res.redirect(301, '/blog'));
app.get('/column/:slug', (req, res) => res.redirect(301, `/blog/${req.params.slug}`));
app.get('/programs/deep-focus-term', (req, res) => res.redirect(301, '/programs/standard'));

// ========== SPA Fallback (API 라우트 이후, 에러 처리 이전) ==========
// React Router를 위한 클라이언트 사이드 라우팅 지원
// ✅ SEO 개선: 경로별 메타 태그를 서버에서 주입하여 Googlebot 대응
//
// ⚠️ 가이드라인: 이 블록은 반드시 notFoundHandler/globalErrorHandler 앞에 위치해야 합니다!
// 참고: 2026-03-12 버그 - 에러 핸들러가 앞에 있어 SPA 라우트가 404 반환

// index.html 템플릿을 메모리에 캐시 (매 요청마다 파일 읽기 방지)
let cachedIndexHtml = null;
function getIndexHtml() {
    if (!cachedIndexHtml) {
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        if (fs.existsSync(indexPath)) {
            cachedIndexHtml = fs.readFileSync(indexPath, 'utf8');
        }
    }
    return cachedIndexHtml;
}

app.get('*', async (req, res, next) => {
    // API 요청은 404 핸들러로 전달
    if (req.path.startsWith('/api/')) {
        return next();
    }

    const html = getIndexHtml();

    // 파일 존재 확인
    if (!html) {
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        console.error(`[SPA Fallback] index.html not found at: ${indexPath}`);
        console.error(`[SPA Fallback] __dirname: ${__dirname}`);
        console.error(`[SPA Fallback] Files in dist: ${fs.existsSync(path.join(__dirname, 'dist')) ? fs.readdirSync(path.join(__dirname, 'dist')).join(', ') : 'dist not found'}`);
        return res.status(500).json({
            error: '서버 설정 오류: 앱 파일을 찾을 수 없습니다.',
            code: 'SERVER_CONFIG_ERROR'
        });
    }

    // ✅ SEO: 블로그 상세 페이지는 DB에서 포스트 정보를 조회하여 메타 태그 주입
    const blogSlugMatch = req.path.match(/^\/blog\/([^\/]+)$/);
    if (blogSlugMatch) {
        try {
            const slug = blogSlugMatch[1];
            const result = await query(
                `SELECT title, excerpt, slug, thumbnail FROM blogs WHERE slug = $1 AND status = 'published' LIMIT 1`,
                [slug]
            );
            if (result.rows.length > 0) {
                const seoHtml = injectBlogPostMeta(html, result.rows[0]);
                res.set('Content-Type', 'text/html');
                return res.send(seoHtml);
            }
        } catch (e) {
            console.warn('[SEO] Blog post lookup failed:', e.message);
        }
    }

    // ✅ SEO: 정적 페이지는 경로별 메타 매핑으로 주입
    const seoHtml = injectSEOMeta(html, req.path);
    res.set('Content-Type', 'text/html');
    res.send(seoHtml);
});

// ========== API 에러 처리 ==========
// ⚠️ 가이드라인: 이 핸들러들은 반드시 SPA fallback 뒤에 위치해야 합니다!
// SPA fallback이 없으면 모든 라우트가 404로 처리됩니다.
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ========== SPA 라우팅 검증 (가이드레일) ==========
function validateSpaRouting() {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    const issues = [];

    // 1. index.html 존재 확인
    if (!fs.existsSync(indexPath)) {
        issues.push('index.html not found in dist/');
    }

    // 2. dist 폴더 확인
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
        issues.push('dist/ folder not found - run `npm run build` first');
    }

    // 3. 라우트 스택 검증 (SPA fallback이 에러 핸들러 앞에 있는지)
    const routeStack = app._router?.stack || [];
    let spaFallbackIndex = -1;
    let errorHandlerIndex = -1;

    routeStack.forEach((layer, index) => {
        if (layer.route?.path === '*' && layer.route.methods.get) {
            spaFallbackIndex = index;
        }
        // notFoundHandler는 4개 인자를 받는 미들웨어
        if (layer.handle?.length === 4 && layer.handle.name === 'notFoundHandler') {
            errorHandlerIndex = index;
        }
    });

    if (spaFallbackIndex !== -1 && errorHandlerIndex !== -1) {
        if (spaFallbackIndex > errorHandlerIndex) {
            issues.push(`CRITICAL: SPA fallback (index ${spaFallbackIndex}) is AFTER error handler (index ${errorHandlerIndex})`);
        }
    }

    return {
        valid: issues.length === 0,
        issues,
        indexPath: fs.existsSync(indexPath) ? indexPath : null,
        spaFallbackIndex,
        errorHandlerIndex
    };
}

// ========== 서버 시작 ==========
setupDatabase().then(() => {
    // SPA 라우팅 검증 (가이드레일)
    const validation = validateSpaRouting();

    console.log('========================================');
    console.log('🔍 SPA Routing Validation');
    console.log('========================================');

    if (validation.valid) {
        console.log('✅ SPA routing configuration: VALID');
        console.log(`   index.html: ${validation.indexPath}`);
        console.log(`   SPA Fallback position: ${validation.spaFallbackIndex}`);
        console.log(`   Error Handler position: ${validation.errorHandlerIndex}`);
    } else {
        console.error('❌ SPA routing configuration: INVALID');
        validation.issues.forEach((issue, i) => {
            console.error(`   ${i + 1}. ${issue}`);
        });
        console.error('');
        console.error('⚠️  SPA routes will return 404! Fix the issues above.');
    }

    app.listen(PORT, () => {
        console.log('========================================');
        console.log(`StudyM Server running on port ${PORT}`);
        console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'In-Memory Fallback'}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`SPA Fallback: ${validation.valid ? '✅ ENABLED' : '❌ DISABLED'}`);
        console.log('========================================');
    });
});

export default app;
