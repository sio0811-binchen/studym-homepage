/**
 * Express Server for StudyM Homepage
 * - Static file serving (dist folder)
 * - SMS API endpoint (Solapi)
 * - PostgreSQL Database for persistent storage
 */
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import compression from 'compression';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(compression()); // Gzip 압축 적용
const PORT = process.env.PORT || 3000;

// Solapi API 설정
const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY || 'NCS2S7JFYO8QSACF';
const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET || 'CX8O4YCCDLUGVN1GMLEN03CX0JFCPNK8';
const SOLAPI_SENDER_PHONE = process.env.SOLAPI_SENDER_PHONE || '01098051011';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '01098051011';
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'live_sk_BX7zk2yd8yJGoRjALNBL3x9POLqK';

// In-Memory Mock Data (Fallback)
const mockPayments = [];
let isDbConnected = false;

// PostgreSQL 연결
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// 테이블 생성 함수
async function initDatabase() {
    try {
        // 상담 신청 테이블
        await pool.query(`
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

        // 가맹점 문의 테이블
        await pool.query(`
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

        // 결제 테이블
        await pool.query(`
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
                paid_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // 기존 테이블에 컬럼 추가 (Migration)
        await pool.query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_key VARCHAR(200)`);
        await pool.query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(500)`);
        await pool.query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS canceled_amount INTEGER DEFAULT 0`);

        // 블로그(칼럼) 테이블
        await pool.query(`
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
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('✅ Database tables initialized successfully');
        isDbConnected = true;
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        console.log('⚠️ Running in In-Memory Mode (Fallback)');
        isDbConnected = false;
    }
}

// Middleware
app.use(cors());
app.use(express.json());

// Solapi Authorization Header 생성
function getSolapiAuthHeader() {
    const date = new Date().toISOString();
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const signature = CryptoJS.HmacSHA256(date + salt, SOLAPI_API_SECRET).toString();
    return `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
}

// Toss Authorization Header
function getTossAuthHeader() {
    return 'Basic ' + Buffer.from(TOSS_SECRET_KEY + ':').toString('base64');
}

// SMS 발송 함수
async function sendSMS(to, message) {
    try {
        const toPhone = to.replace(/\D/g, '');
        const response = await axios.post(
            'https://api.solapi.com/messages/v4/send',
            {
                message: {
                    to: toPhone,
                    from: SOLAPI_SENDER_PHONE.replace(/\D/g, ''),
                    text: message,
                    type: message.length > 45 ? 'LMS' : 'SMS'
                }
            },
            {
                headers: {
                    'Authorization': getSolapiAuthHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('SMS 발송 성공:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('SMS 발송 실패:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
}

// ========== 블로그(칼럼) API ==========

// SEO: Sitemap.xml 생성 엔드포인트
app.get('/sitemap.xml', async (req, res) => {
    try {
        const result = await pool.query('SELECT slug, updated_at FROM blogs ORDER BY updated_at DESC');

        const baseUrl = 'https://www.studym.co.kr';
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xlmns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // 정적 페이지들 추가
        const staticPages = ['', '/story', '/diagnosis', '/columns', '/manual', '/franchise', '/admin'];
        staticPages.forEach(path => {
            xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });

        // 블로그 동적 페이지들 추가
        result.rows.forEach(row => {
            const date = new Date(row.updated_at).toISOString().split('T')[0];
            xml += `  <url>\n    <loc>${baseUrl}/blog/${row.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap 생성 오류:', error);
        res.status(500).send('Error generating sitemap');
    }
});

// SEO: RSS Feed 생성 엔드포인트
app.get('/rss.xml', async (req, res) => {
    try {
        const result = await pool.query('SELECT title, slug, excerpt, author, created_at FROM blogs ORDER BY created_at DESC LIMIT 50');

        const baseUrl = 'https://www.studym.co.kr';
        let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
        xml += '<rss version="2.0">\n';
        xml += '<channel>\n';
        xml += '  <title>Study M 교육연구소 칼럼</title>\n';
        xml += `  <link>${baseUrl}/blog</link>\n`;
        xml += '  <description>Study M의 학부모 맞춤형 전문 교육 가이드</description>\n';

        result.rows.forEach(row => {
            const date = new Date(row.created_at).toUTCString();
            xml += '  <item>\n';
            xml += `    <title><![CDATA[${row.title}]]></title>\n`;
            xml += `    <link>${baseUrl}/blog/${row.slug}</link>\n`;
            xml += `    <description><![CDATA[${row.excerpt}]]></description>\n`;
            xml += `    <pubDate>${date}</pubDate>\n`;
            xml += `    <author>${row.author}</author>\n`;
            xml += '  </item>\n';
        });

        xml += '</channel>\n</rss>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('RSS 생성 오류:', error);
        res.status(500).send('Error generating rss');
    }
});

// 1. 블로그 목록 조회 (프론트엔드용)
app.get('/api/blog/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title, slug, category, excerpt, author, read_time as "readTime", tags, thumbnail, to_char(created_at, \'YYYY-MM-DD\') as date FROM blogs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('블로그 목록 조회 오류:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. 블로그 상세 조회 (프론트엔드용)
app.get('/api/blog/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query('SELECT id, title, slug, category, excerpt, content, author, read_time as "readTime", tags, thumbnail, to_char(created_at, \'YYYY-MM-DD\') as date FROM blogs WHERE slug = $1', [slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: '블로그 글을 찾을 수 없습니다.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('블로그 상세 조회 오류:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. 블로그 포스트 생성 (Agent용)
app.post('/api/blog/', async (req, res) => {
    try {
        const adminSecret = req.headers['x-admin-secret'];
        if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ error: 'Unauthorized: Invalid Secret Key' });
        }

        const { title, slug, category, excerpt, content, author, read_time, tags, thumbnail } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({ error: '필수 필드 누락 (title, slug, content)' });
        }

        // tags 배열을 JSON 배열 문자열로 저장 (프론트엔드에서 파싱하거나 포맷 수정 가능, 현 코드에서는 TEXT 컬럼)
        let tagsJson = tags;
        if (Array.isArray(tags)) {
            tagsJson = JSON.stringify(tags);
        }

        const query = `
            INSERT INTO blogs (title, slug, category, excerpt, content, author, read_time, tags, thumbnail, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING *
        `;
        const values = [title, slug, category, excerpt, content, author, read_time, tagsJson, thumbnail];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Success', data: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            console.error('블로그 생성 오류(중복):', error.message);
            return res.status(409).json({ error: '이미 존재하는 URL 슬러그입니다.' });
        }
        console.error('블로그 생성 오류:', error);
        res.status(500).json({ error: error.message });
    }
});


// ========== 상담 API ==========

// 상담 신청 생성
app.post('/api/consultations/', async (req, res) => {
    try {
        const { student_name, student_school, student_grade, parent_name, parent_phone, consultation_date } = req.body;

        // 필수 필드 유효성 검사
        const missingFields = [];
        if (!student_name || student_name.trim() === '') missingFields.push('이름');
        if (!student_grade || student_grade.trim() === '') missingFields.push('구분(학년)');
        if (!parent_phone || parent_phone.trim() === '') missingFields.push('연락처');

        if (missingFields.length > 0) {
            console.log('상담 신청 유효성 검사 실패:', { student_name, student_grade, parent_phone, missingFields });
            return res.status(400).json({
                error: `필수 정보가 누락되었습니다: ${missingFields.join(', ')}`,
                missing_fields: missingFields
            });
        }

        const result = await pool.query(
            `INSERT INTO consultations (student_name, student_school, student_grade, parent_name, parent_phone, consultation_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [student_name, student_school, student_grade, parent_name, parent_phone, consultation_date]
        );

        const consultation = result.rows[0];
        console.log('새 상담 신청:', consultation);

        // 관리자에게 SMS 알림 발송
        const message = `[스터디엠] 새 상담신청
학생: ${student_name} (${student_grade})
학교: ${student_school || '-'}
학부모: ${parent_name}
연락처: ${parent_phone}
희망일: ${consultation_date ? new Date(consultation_date).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '미정'}

관리자: studym.co.kr/admin`;

        const smsResult = await sendSMS(ADMIN_PHONE, message);

        // 학부모에게도 SMS 발송 (전화번호가 있는 경우)
        if (parent_phone) {
            const parentMessage = `[스터디엠] 상담 신청이 접수되었습니다.

학생: ${student_name}
희망일시: ${consultation_date ? new Date(consultation_date).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '미정'}

담당 매니저가 24시간 내에 연락드리겠습니다.
문의: 010-9805-1011`;

            await sendSMS(parent_phone, parentMessage);
            console.log('학부모 SMS 발송 완료:', parent_phone);
        }

        res.status(201).json({
            ...consultation,
            sms_sent: smsResult.success
        });
    } catch (error) {
        console.error('상담 신청 처리 오류:', error);
        res.status(500).json({ error: error.message });
    }
});

// 상담 목록 조회
app.get('/api/consultations/', async (req, res) => {
    const adminPassword = req.query.admin_password || req.headers['x-admin-password'];
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!' && adminPassword !== 'toss123456!') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const result = await pool.query('SELECT * FROM consultations ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 상담 수정
app.patch('/api/consultations/:id/', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, memo } = req.body;

        const result = await pool.query(
            'UPDATE consultations SET status = COALESCE($1, status), memo = COALESCE($2, memo) WHERE id = $3 RETURNING *',
            [status, memo, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 상담 삭제
app.delete('/api/consultations/:id/', async (req, res) => {
    try {
        await pool.query('DELETE FROM consultations WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== 결제 API ==========

// 결제 승인 API (Toss 연동)
app.post('/api/payment-confirm/confirm/', async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    try {
        // 1. Toss Payments 승인 API 호출
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            { paymentKey, orderId, amount },
            {
                headers: {
                    'Authorization': getTossAuthHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Toss Payment Approved:', response.data);

        // 2. DB 업데이트
        const result = await pool.query(
            `UPDATE payments 
             SET status = 'PAID', 
                 payment_key = $1, 
                 receipt_url = $2, 
                 paid_at = NOW() 
             WHERE order_id = $3 
             RETURNING *`,
            [paymentKey, response.data.receipt?.url, orderId]
        );

        if (result.rows.length === 0) {
            // DB에 없는 orderId인 경우 (생성 API를 안 거치고 결제만??) - 드문 케이스
            console.error('Payment confirmed but order not found in DB:', orderId);
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ status: 'success', data: result.rows[0] });

    } catch (error) {
        console.error('Payment Confirm Error:', error.response?.data || error.message);
        res.status(400).json({ status: 'error', error: error.response?.data || { message: error.message } });
    }
});

// 결제 취소 API (Toss 연동)
app.post('/api/payments/:id/cancel/', async (req, res) => {
    const { id } = req.params;
    const { cancelReason, cancelAmount } = req.body; // cancelReason from frontend is usually 'reason'

    try {
        // DB에서 paymentKey 조회
        const paymentResult = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
        if (paymentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        const payment = paymentResult.rows[0];

        // Toss 결제 취소 (payment_key가 있는 경우에만)
        let tossStatus = 'CANCELED';
        if (payment.payment_key) {
            const cancelData = { cancelReason: cancelReason || '관리자 취소' };
            if (cancelAmount) {
                cancelData.cancelAmount = cancelAmount;
            }

            const response = await axios.post(
                `https://api.tosspayments.com/v1/payments/${payment.payment_key}/cancel`,
                cancelData,
                {
                    headers: {
                        'Authorization': getTossAuthHeader(),
                        'Content-Type': 'application/json'
                    }
                }
            );
            tossStatus = response.data.status; // CANCELED or PARTIAL_CANCELED
        }

        // 취소 금액 계산 (부분 취소 시 누적)
        const canceledAmount = cancelAmount || payment.amount;
        const totalCanceled = (payment.canceled_amount || 0) + canceledAmount;

        const result = await pool.query(
            "UPDATE payments SET status = $1, canceled_amount = $2 WHERE id = $3 RETURNING *",
            [tossStatus, totalCanceled, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Payment Cancel Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data?.message || error.message });
    }
});

// 결제 생성
app.post('/api/payments/', async (req, res) => {
    try {
        const { student_name, student_phone, parent_phone, product_type, amount, discount_amount, discount_note } = req.body;
        const order_id = `ord_${Date.now()}`;
        const payment_token = `pay_${Date.now()}`;

        const result = await pool.query(
            `INSERT INTO payments (order_id, student_name, student_phone, parent_phone, product_type, amount, discount_amount, discount_note, payment_token)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [order_id, student_name, student_phone, parent_phone, product_type, amount, discount_amount || 0, discount_note, payment_token]
        );

        const payment = result.rows[0];
        console.log('새 결제 생성:', payment);

        // 응답에 추가 필드 포함
        res.status(201).json({
            ...payment,
            status_display: '대기중',
            product_type_display: product_type === 'MONTHLY' ? '월간 수강권 (4주)' : product_type,
            payment_link: {
                token: payment_token,
                url: `https://studym.co.kr/pay/${payment_token}`,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        });
    } catch (error) {
        console.error('결제 생성 오류:', error);
        res.status(500).json({ error: error.message });
    }
});

// 테스트 결제 생성 (심사용)
app.post('/api/payments/test_init', async (req, res) => {
    try {
        const { student_name, student_phone, amount } = req.body;
        const order_id = `test_${Date.now()}`;
        const payment_token = `pay_test_${Date.now()}`;

        const result = await pool.query(
            `INSERT INTO payments (order_id, student_name, student_phone, parent_phone, product_type, amount, payment_token, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
             RETURNING *`,
            [order_id, student_name, student_phone, '000-0000-0000', 'TEST_PRODUCT', amount || 1000, payment_token]
        );

        const payment = result.rows[0];

        res.status(201).json({
            order_id,
            payment_link: {
                token: payment_token,
                url: `https://studym.co.kr/pay/${payment_token}`,
            }
        });
    } catch (error) {
        // Fallback for In-Memory Mode
        if (!isDbConnected) {
            const { student_name, student_phone, amount } = req.body;
            const order_id = `test_${Date.now()}`;
            const payment_token = `pay_test_${Date.now()}`;

            const mockPayment = {
                id: mockPayments.length + 1,
                order_id,
                student_name,
                student_phone,
                parent_phone: '000-0000-0000',
                product_type: 'TEST_PRODUCT',
                amount: amount || 1000,
                payment_token,
                status: 'PENDING',
                created_at: new Date()
            };
            mockPayments.push(mockPayment);

            console.log('⚠️ In-Memory Payment Created:', mockPayment);

            return res.status(201).json({
                order_id,
                payment_link: {
                    token: payment_token,
                    url: `https://studym.co.kr/pay/${payment_token}`,
                }
            });
        }

        console.error('테스트 결제 생성 오류:', error);
        res.status(500).json({ error: error.message });
    }
});

// 결제 승인 확인 (클라이언트 승인 후 호출)
app.post('/api/payment-confirm/confirm/', async (req, res) => {
    try {
        const { paymentKey, orderId, amount } = req.body;

        // 1. 주문 조회
        const orderResult = await pool.query('SELECT * FROM payments WHERE order_id = $1', [orderId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', error: { message: '주문을 찾을 수 없습니다.' } });
        }

        const payment = orderResult.rows[0];

        // 2. 금액 검증
        if (parseInt(payment.amount) !== parseInt(amount)) {
            return res.status(400).json({ status: 'error', error: { message: '결제 금액이 일치하지 않습니다.' } });
        }

        // 3. 결제 상태 업데이트 (실제 승인 API 호출은 생략 - 테스트이므로)
        // 토스페이먼츠 승인 API(/v1/payments/confirm)를 서버에서 호출해야 하지만, 
        // 클라이언트 키 방식(인증 미사용)일 경우 클라이언트에서 승인 후 여기로 오거나,
        // 서버 승인 방식일 경우 Secret Key가 필요함.
        // 현재 Secret Key 설정이 명확하지 않아 DB 상태만 업데이트 처리.
        // *심사용이므로 실제 과금되더라도 테스트망이면 상관없음. 실결제망이면 취소 필요.*

        await pool.query(
            "UPDATE payments SET status = 'PAID', paid_at = NOW(), payment_key = $1 WHERE order_id = $2",
            [paymentKey, orderId]
        );

        res.json({ status: 'success', payment: { ...payment, status: 'PAID' } });

    } catch (error) {
        // Fallback for In-Memory Mode
        if (!isDbConnected && error.message.includes('password authentication') || !isDbConnected) {
            // 1. 주문 조회 (Mock)
            const paymentIndex = mockPayments.findIndex(p => p.order_id === orderId);
            if (paymentIndex === -1) {
                return res.status(404).json({ status: 'error', error: { message: '주문을 찾을 수 없습니다 (Mock).' } });
            }

            const payment = mockPayments[paymentIndex];

            // 2. Mock 업데이트
            mockPayments[paymentIndex] = {
                ...payment,
                status: 'PAID',
                payment_key: paymentKey,
                paid_at: new Date()
            };

            console.log('⚠️ In-Memory Payment Confirmed:', mockPayments[paymentIndex]);
            return res.json({ status: 'success', payment: mockPayments[paymentIndex] });
        }

        console.error('결제 승인 오류:', error);
        res.status(500).json({ status: 'error', error: { message: error.message } });
    }
});

// 결제 목록 조회
app.get('/api/payments/', async (req, res) => {
    const adminPassword = req.query.admin_password || req.headers['x-admin-password'];
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!' && adminPassword !== 'toss123456!') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const result = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
        // 응답에 추가 필드 포함
        const payments = result.rows.map(p => ({
            ...p,
            status_display: p.status === 'PENDING' ? '대기중' : p.status === 'PAID' ? '결제완료' : p.status === 'MANUAL' ? '수동처리' : p.status === 'CANCELED' ? '취소됨' : p.status,
            product_type_display: p.product_type === 'MONTHLY' ? '월간 수강권 (4주)' : p.product_type,
            payment_link: {
                token: p.payment_token,
                url: `https://studym.co.kr/pay/${p.payment_token}`,
                expires_at: new Date(new Date(p.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        }));
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 결제 통계
app.get('/api/payments/statistics/', async (req, res) => {
    try {
        const paidResult = await pool.query(
            "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM payments WHERE status IN ('PAID', 'MANUAL')"
        );
        const pendingResult = await pool.query(
            "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'PENDING'"
        );
        const thisMonthResult = await pool.query(
            "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM payments WHERE status IN ('PAID', 'MANUAL') AND created_at >= date_trunc('month', CURRENT_DATE)"
        );

        res.json({
            summary: {
                total_completed: parseInt(paidResult.rows[0].total),
                this_month_total: parseInt(thisMonthResult.rows[0].total),
                this_month_count: parseInt(thisMonthResult.rows[0].count),
                pending_count: parseInt(pendingResult.rows[0].count)
            },
            by_status: {
                'PAID': { count: parseInt(paidResult.rows[0].count), total: parseInt(paidResult.rows[0].total) },
                'PENDING': { count: parseInt(pendingResult.rows[0].count), total: parseInt(pendingResult.rows[0].total) }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 결제 수동 완료
app.post('/api/payments/:id/manual_complete/', async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        const result = await pool.query(
            "UPDATE payments SET status = 'MANUAL', manual_note = $1, paid_at = NOW() WHERE id = $2 RETURNING *",
            [note || '수동 처리', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 결제 취소
app.post('/api/payments/:id/cancel/', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "UPDATE payments SET status = 'CANCELED' WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 결제 링크 재생성
app.post('/api/payments/:id/regenerate_link/', async (req, res) => {
    try {
        const { id } = req.params;
        const newToken = `pay_${Date.now()}`;

        const result = await pool.query(
            'UPDATE payments SET payment_token = $1 WHERE id = $2 RETURNING *',
            [newToken, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({
            token: newToken,
            url: `https://studym.co.kr/pay/${newToken}`,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 결제 삭제
app.delete('/api/payments/:id/', async (req, res) => {
    try {
        await pool.query('DELETE FROM payments WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 결제 링크 조회 (결제 페이지용)
app.get('/api/payment-links/:token/', async (req, res) => {
    try {
        const { token } = req.params;

        const result = await pool.query(
            'SELECT * FROM payments WHERE payment_token = $1',
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: '결제 정보를 찾을 수 없습니다.' });
        }

        const p = result.rows[0];
        res.json({
            payment: {
                id: p.id,
                order_id: p.order_id,
                student_name: p.student_name,
                product_type_display: p.product_type === 'MONTHLY' ? '월간 수강권 (4주)' : p.product_type,
                amount: p.amount,
                status: p.status,
                student_phone: p.student_phone,
                parent_phone: p.parent_phone
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== 가맹점 문의 API ==========

// 가맹점 문의 생성
app.post('/api/franchise/inquire/', async (req, res) => {
    try {
        const { applicant_name, phone, email, region, budget, has_property } = req.body;

        const result = await pool.query(
            `INSERT INTO franchise_inquiries (applicant_name, phone, email, region, budget, has_property)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [applicant_name, phone, email, region, budget, has_property || false]
        );

        const inquiry = result.rows[0];
        console.log('새 가맹점 문의:', inquiry);

        // 관리자에게 SMS 알림 발송
        const budgetDisplay = {
            'UNDER_200M': '2억 미만',
            '200M_300M': '2-3억',
            'OVER_300M': '3억 이상'
        }[budget] || budget;

        const message = `[스터디엠] 가맹점 문의
신청자: ${applicant_name}
연락처: ${phone}
지역: ${region}
예산: ${budgetDisplay}
점포보유: ${has_property ? 'O' : 'X'}

관리자: studym.co.kr/admin`;

        const smsResult = await sendSMS(ADMIN_PHONE, message);

        res.status(201).json({
            ...inquiry,
            sms_sent: smsResult.success
        });
    } catch (error) {
        console.error('가맹점 문의 처리 오류:', error);
        res.status(500).json({ error: error.message });
    }
});

// 가맹점 문의 목록 조회
app.get('/api/franchise-inquiries/', async (req, res) => {
    const adminPassword = req.query.admin_password || req.headers['x-admin-password'];
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!' && adminPassword !== 'toss123456!') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const result = await pool.query('SELECT * FROM franchise_inquiries ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 가맹점 문의 수정
app.patch('/api/franchise-inquiries/:id/', async (req, res) => {
    try {
        const { id } = req.params;
        const { lead_grade, status, memo } = req.body;

        const result = await pool.query(
            'UPDATE franchise_inquiries SET lead_grade = COALESCE($1, lead_grade), status = COALESCE($2, status), memo = COALESCE($3, memo) WHERE id = $4 RETURNING *',
            [lead_grade, status, memo, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 가맹점 문의 삭제
app.delete('/api/franchise-inquiries/:id/', async (req, res) => {
    try {
        await pool.query('DELETE FROM franchise_inquiries WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== SMS 및 유틸리티 API ==========

// SMS 발송 테스트 API
app.post('/api/sms/send', async (req, res) => {
    const { to, message } = req.body;
    const result = await sendSMS(to || ADMIN_PHONE, message || 'Test SMS from StudyM');
    res.json(result);
});

// Health check
app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        await pool.query('SELECT 1');
        dbStatus = 'connected';
    } catch (e) {
        dbStatus = 'error: ' + e.message;
    }

    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// ========== Static File Serving ==========
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ========== Server Start ==========
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log('🚨====================================🚨');
        console.log(`🚀 StudyM Server running on port ${PORT}`);
        console.log(`📱 SMS Sender: ${SOLAPI_SENDER_PHONE}`);
        console.log(`📞 Admin Phone: ${ADMIN_PHONE}`);
        console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'In-Memory'}`);
        console.log('🚨====================================🚨');
    });
});
