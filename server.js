/**
 * Express Server for StudyM Homepage
 * - Static file serving (dist folder)
 * - SMS API endpoint (Solapi)
 * - Consultation API endpoint (localStorage alternative - in-memory for demo)
 */
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Solapi API 설정
const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY || 'NCS2S7JFYO8QSACF';
const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET || 'CX8O4YCCDLUGVN1GMLEN03CX0JFCPNK8';
const SOLAPI_SENDER_PHONE = process.env.SOLAPI_SENDER_PHONE || '01098051011';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '01098051011';

// In-memory storage (Railway는 stateless이므로 실제 운영에서는 DB 필요)
let consultations = [];
let franchiseInquiries = [];

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

// ========== API Routes ==========

// 상담 신청 API
app.post('/api/consultations/', async (req, res) => {
    try {
        const consultation = {
            id: Date.now(),
            ...req.body,
            status: 'PENDING',
            created_at: new Date().toISOString()
        };

        consultations.unshift(consultation);
        console.log('새 상담 신청:', consultation);

        // 관리자에게 SMS 알림 발송
        const message = `[스터디엠] 새 상담신청
학생: ${consultation.student_name} (${consultation.student_grade})
학교: ${consultation.student_school || '-'}
학부모: ${consultation.parent_name}
연락처: ${consultation.parent_phone}
희망일: ${consultation.consultation_date ? new Date(consultation.consultation_date).toLocaleDateString() : '미정'}

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

// 상담 목록 조회 API
app.get('/api/consultations/', (req, res) => {
    const adminPassword = req.query.admin_password || req.headers['x-admin-password'];
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(consultations);
});

// 상담 상태 수정 API
app.patch('/api/consultations/:id/', (req, res) => {
    const id = parseInt(req.params.id);
    const index = consultations.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }
    consultations[index] = { ...consultations[index], ...req.body };
    res.json(consultations[index]);
});

// 상담 삭제 API
app.delete('/api/consultations/:id/', (req, res) => {
    const id = parseInt(req.params.id);
    consultations = consultations.filter(c => c.id !== id);
    res.status(204).send();
});

// ========== 결제 API ==========
let payments = [];

// 결제 생성 API
app.post('/api/payments/', (req, res) => {
    const payment = {
        id: Date.now(),
        order_id: `ord_${Date.now()}`,
        ...req.body,
        status: 'PENDING',
        status_display: '대기중',
        product_type_display: req.body.product_type === 'MONTHLY' ? '월간 수강권 (4주)' : req.body.product_type,
        created_at: new Date().toISOString(),
        payment_link: {
            token: `pay_${Date.now()}`,
            url: `https://studym.co.kr/pay/pay_${Date.now()}`,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    };
    payments.unshift(payment);
    console.log('새 결제 생성:', payment);
    res.status(201).json(payment);
});

// 결제 목록 조회 API
app.get('/api/payments/', (req, res) => {
    const adminPassword = req.query.admin_password || req.headers['x-admin-password'];
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(payments);
});

// 결제 통계 API
app.get('/api/payments/statistics/', (req, res) => {
    const paidPayments = payments.filter(p => p.status === 'PAID' || p.status === 'MANUAL');
    const pendingPayments = payments.filter(p => p.status === 'PENDING');

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisMonthPayments = paidPayments.filter(p => new Date(p.created_at) >= thisMonth);

    res.json({
        summary: {
            total_completed: paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
            this_month_total: thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
            this_month_count: thisMonthPayments.length,
            pending_count: pendingPayments.length
        },
        by_status: {
            'PAID': { count: paidPayments.length, total: paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0) },
            'PENDING': { count: pendingPayments.length, total: pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0) }
        }
    });
});

// 결제 수동 완료 API
app.post('/api/payments/:id/manual_complete/', (req, res) => {
    const id = parseInt(req.params.id);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }
    payments[index] = {
        ...payments[index],
        status: 'MANUAL',
        status_display: '수동처리',
        manual_note: req.body.note || '수동 처리',
        paid_at: new Date().toISOString()
    };
    res.json(payments[index]);
});

// 결제 취소 API
app.post('/api/payments/:id/cancel/', (req, res) => {
    const id = parseInt(req.params.id);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }
    payments[index] = {
        ...payments[index],
        status: 'CANCELED',
        status_display: '취소됨'
    };
    res.json(payments[index]);
});

// 결제 링크 재생성 API
app.post('/api/payments/:id/regenerate_link/', (req, res) => {
    const id = parseInt(req.params.id);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }
    const newLink = {
        token: `pay_${Date.now()}`,
        url: `https://studym.co.kr/pay/pay_${Date.now()}`,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    payments[index].payment_link = newLink;
    res.json(newLink);
});

// 결제 삭제 API
app.delete('/api/payments/:id/', (req, res) => {
    const id = parseInt(req.params.id);
    payments = payments.filter(p => p.id !== id);
    res.status(204).send();
});

// 결제 링크 조회 API (결제 페이지용)
app.get('/api/payment-links/:token/', (req, res) => {
    const token = req.params.token;
    const payment = payments.find(p => p.payment_link && p.payment_link.token === token);

    if (!payment) {
        return res.status(404).json({ error: '결제 정보를 찾을 수 없습니다.' });
    }

    res.json({
        payment: {
            id: payment.id,
            order_id: payment.order_id,
            student_name: payment.student_name,
            product_type_display: payment.product_type_display,
            amount: payment.amount,
            status: payment.status,
            student_phone: payment.student_phone,
            parent_phone: payment.parent_phone
        }
    });
});


// 가맹점 문의 API
app.post('/api/franchise/inquire/', async (req, res) => {
    try {
        const inquiry = {
            id: Date.now(),
            ...req.body,
            status: 'NEW',
            lead_grade: 'HOT',
            created_at: new Date().toISOString()
        };

        franchiseInquiries.unshift(inquiry);
        console.log('새 가맹점 문의:', inquiry);

        // 관리자에게 SMS 알림 발송
        const budgetDisplay = {
            'UNDER_200M': '2억 미만',
            '200M_300M': '2-3억',
            'OVER_300M': '3억 이상'
        }[inquiry.budget] || inquiry.budget;

        const message = `[스터디엠] 가맹점 문의
신청자: ${inquiry.applicant_name}
연락처: ${inquiry.phone}
지역: ${inquiry.region}
예산: ${budgetDisplay}
점포보유: ${inquiry.has_property ? 'O' : 'X'}

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

// 가맹점 문의 목록 조회 API
app.get('/api/franchise-inquiries/', (req, res) => {
    const adminPassword = req.query.admin_password || req.headers['x-admin-password'];
    if (adminPassword !== 'studym2025' && adminPassword !== 'studym001!') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(franchiseInquiries);
});

// 가맹점 문의 수정 API
app.patch('/api/franchise-inquiries/:id/', (req, res) => {
    const id = parseInt(req.params.id);
    const index = franchiseInquiries.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }
    franchiseInquiries[index] = { ...franchiseInquiries[index], ...req.body };
    res.json(franchiseInquiries[index]);
});

// 가맹점 문의 삭제 API
app.delete('/api/franchise-inquiries/:id/', (req, res) => {
    const id = parseInt(req.params.id);
    franchiseInquiries = franchiseInquiries.filter(f => f.id !== id);
    res.status(204).send();
});

// SMS 발송 테스트 API
app.post('/api/sms/send', async (req, res) => {
    const { to, message } = req.body;
    const result = await sendSMS(to || ADMIN_PHONE, message || 'Test SMS from StudyM');
    res.json(result);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        consultations_count: consultations.length,
        franchise_count: franchiseInquiries.length
    });
});

// ========== Static File Serving ==========
// dist 폴더의 정적 파일 서빙 (Vite 빌드 결과물)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - 모든 경로를 index.html로 리다이렉트
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ========== Server Start ==========
app.listen(PORT, () => {
    console.log('🚨====================================🚨');
    console.log(`🚀 StudyM Server running on port ${PORT}`);
    console.log(`📱 SMS Sender: ${SOLAPI_SENDER_PHONE}`);
    console.log(`📞 Admin Phone: ${ADMIN_PHONE}`);
    console.log('🚨====================================🚨');
});
