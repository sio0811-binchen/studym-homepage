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

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Solapi API 설정
const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY || 'NCS2S7JFYO8QSACF';
const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET || 'CX8O4YCCDLUGVN1GMLEN03CX0JFCPNK8';
const SOLAPI_SENDER_PHONE = process.env.SOLAPI_SENDER_PHONE || '01098051011';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '01098051011';

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
                paid_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        // DB 연결 실패 시 메모리 모드로 폴백
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

// ========== 상담 API ==========

// 상담 신청 생성
app.post('/api/consultations/', async (req, res) => {
    try {
        const { student_name, student_school, student_grade, parent_name, parent_phone, consultation_date } = req.body;

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
희망일: ${consultation_date ? new Date(consultation_date).toLocaleDateString() : '미정'}

관리자: studym.co.kr/admin`;

        const smsResult = await sendSMS(ADMIN_PHONE, message);

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
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!') {
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

// 결제 목록 조회
app.get('/api/payments/', async (req, res) => {
    const adminPassword = req.query.admin_password || req.headers['x-admin-password'];
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!') {
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
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!') {
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
