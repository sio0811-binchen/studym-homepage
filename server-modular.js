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
 */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

// Database
import { initDatabase, query } from './backend/utils/database.js';

// Middleware
import { globalErrorHandler, notFoundHandler } from './backend/middleware/errorHandler.js';

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

// ========== 에러 처리 ==========
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ========== SPA Fallback (API 라우트 이후) ==========
app.get('*', (req, res) => {
    // API 요청이 아닌 경우에만 SPA fallback
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
});

// ========== 서버 시작 ==========
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log('========================================');
        console.log(`StudyM Server running on port ${PORT}`);
        console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'In-Memory Fallback'}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('========================================');
    });
});

export default app;
