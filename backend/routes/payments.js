/**
 * 결제 API 라우트
 *
 * 보안 개선: 중복 라우트 제거, 인증 미들웨어 통합
 */

import { Router } from 'express';
import crypto from 'crypto';
import { query, transaction } from '../utils/database.js';
import { requireAdmin, optionalAdmin } from '../middleware/auth.js';
import { asyncHandler, Errors } from '../middleware/errorHandler.js';
import * as tossService from '../services/toss.js';
import * as solapiService from '../services/solapi.js';

const router = Router();

/**
 * GET /api/payments/
 * 결제 목록 조회
 */
router.get('/', optionalAdmin, asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT id, order_id, student_name, student_phone, parent_phone,
                product_type, amount, discount_amount, status, created_at,
                payment_key, receipt_url, paid_at, manual_note
         FROM payments
         ORDER BY created_at DESC
         LIMIT 100`
    );
    res.json(result.rows);
}));

/**
 * GET /api/payments/statistics/
 * 결제 통계
 */
router.get('/statistics/', requireAdmin, asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'PENDING') as pending,
            COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
            COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled,
            COALESCE(SUM(amount), 0) as total_amount,
            COALESCE(SUM(amount) FILTER (WHERE status = 'COMPLETED'), 0) as completed_amount
         FROM payments`
    );
    res.json(result.rows[0]);
}));

/**
 * POST /api/payments/
 * 결제 생성
 */
router.post('/', asyncHandler(async (req, res) => {
    const { student_name, student_phone, parent_phone, product_type, amount, discount_amount, discount_note } = req.body;

    if (!student_name || !student_phone || !product_type || !amount) {
        throw Errors.BadRequest('필수 항목이 누락되었습니다.');
    }

    // 주문 ID 생성
    const order_id = `STUDYM-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const payment_token = crypto.randomBytes(16).toString('hex');

    const result = await query(
        `INSERT INTO payments
         (order_id, student_name, student_phone, parent_phone, product_type, amount, discount_amount, discount_note, status, payment_token)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9)
         RETURNING *`,
        [order_id, student_name, student_phone, parent_phone, product_type, amount, discount_amount || 0, discount_note, payment_token]
    );

    const payment = result.rows[0];

    // 관리자 알림
    await solapiService.notifyAdmin(`[StudyM] 새 결제 요청: ${student_name} / ${product_type} / ${amount.toLocaleString()}원`);

    res.status(201).json(payment);
}));

/**
 * GET /api/payment-links/:token/
 * 결제 링크 조회
 */
router.get('/links/:token/', asyncHandler(async (req, res) => {
    const { token } = req.params;

    const result = await query(
        `SELECT * FROM payments WHERE payment_token = $1`,
        [token]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('결제 정보');
    }

    res.json(result.rows[0]);
}));

/**
 * POST /api/payment-confirm/confirm/
 * 결제 승인 (Toss)
 *
 * 주의: 중복 라우트 제거됨 (기존 2회 정의 → 1회)
 */
router.post('/confirm/', asyncHandler(async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || !amount) {
        throw Errors.BadRequest('paymentKey, orderId, amount가 필요합니다.');
    }

    // Toss 결제 승인
    const tossResult = await tossService.confirmPayment(paymentKey, orderId, amount);

    if (!tossResult.success) {
        throw Errors.BadRequest(`결제 승인 실패: ${tossResult.error}`);
    }

    // DB 업데이트
    const dbResult = await query(
        `UPDATE payments
         SET status = 'COMPLETED',
             payment_key = $1,
             receipt_url = $2,
             paid_at = NOW()
         WHERE order_id = $3
         RETURNING *`,
        [paymentKey, tossResult.data?.receipt?.url, orderId]
    );

    if (dbResult.rows.length === 0) {
        throw Errors.NotFound('결제 정보');
    }

    const payment = dbResult.rows[0];

    // 고객 알림 SMS
    if (payment.student_phone) {
        await solapiService.sendSMS({
            to: payment.student_phone,
            text: `[StudyM] 결제가 완료되었습니다.\n상품: ${payment.product_type}\n금액: ${payment.amount.toLocaleString()}원`,
            subject: '[StudyM] 결제 완료'
        }).catch(err => console.error('SMS 발송 실패:', err));
    }

    res.json({ success: true, payment });
}));

/**
 * POST /api/payments/:id/cancel/
 * 결제 취소
 */
router.post('/:id/cancel/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cancel_reason } = req.body;

    // 결제 정보 조회
    const paymentResult = await query(
        `SELECT * FROM payments WHERE id = $1`,
        [id]
    );

    if (paymentResult.rows.length === 0) {
        throw Errors.NotFound('결제 정보');
    }

    const payment = paymentResult.rows[0];

    // Toss 결제 취소
    if (payment.payment_key) {
        const tossResult = await tossService.cancelPayment(payment.payment_key, cancel_reason || '관리자 취소');

        if (!tossResult.success) {
            throw Errors.BadRequest(`결제 취소 실패: ${tossResult.error}`);
        }
    }

    // DB 업데이트
    await query(
        `UPDATE payments SET status = 'CANCELLED' WHERE id = $1`,
        [id]
    );

    res.json({ success: true });
}));

/**
 * POST /api/payments/:id/partial_cancel/
 * 결제 부분 취소
 */
router.post('/:id/partial_cancel/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cancel_amount, cancel_reason } = req.body;

    if (!cancel_amount || cancel_amount <= 0) {
        throw Errors.BadRequest('취소 금액이 필요합니다.');
    }

    // 결제 정보 조회
    const paymentResult = await query(
        `SELECT * FROM payments WHERE id = $1`,
        [id]
    );

    if (paymentResult.rows.length === 0) {
        throw Errors.NotFound('결제 정보');
    }

    const payment = paymentResult.rows[0];

    if (cancel_amount > payment.amount) {
        throw Errors.BadRequest('취소 금액이 결제 금액을 초과합니다.');
    }

    // Toss 부분 취소
    if (payment.payment_key) {
        const tossResult = await tossService.partialCancelPayment(
            payment.payment_key,
            cancel_amount,
            cancel_reason || '부분 취소'
        );

        if (!tossResult.success) {
            throw Errors.BadRequest(`부분 취소 실패: ${tossResult.error}`);
        }

        // DB 업데이트 - 금액 차감
        const newAmount = payment.amount - cancel_amount;
        const newStatus = newAmount === 0 ? 'CANCELLED' : 'COMPLETED';

        const dbResult = await query(
            `UPDATE payments
             SET amount = $1,
                 status = CASE WHEN $1 = 0 THEN 'CANCELLED' ELSE status END,
                 cancel_amount = COALESCE(cancel_amount, 0) + $2,
                 cancel_reason = $3
             WHERE id = $4
             RETURNING *`,
            [newAmount, cancel_amount, cancel_reason, id]
        );

        res.json({ success: true, payment: dbResult.rows[0] });
    } else {
        throw Errors.BadRequest('결제 키가 없어 취소할 수 없습니다.');
    }
}));

/**
 * POST /api/payments/:id/manual_complete/
 * 수동 결제 완료 처리 (관리자)
 */
router.post('/:id/manual_complete/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;

    const result = await query(
        `UPDATE payments
         SET status = 'COMPLETED',
             manual_note = $1,
             paid_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [note, id]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('결제 정보');
    }

    res.json({ success: true, payment: result.rows[0] });
}));

/**
 * POST /api/payments/:id/regenerate_link/
 * 결제 링크 재생성
 */
router.post('/:id/regenerate_link/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const newToken = crypto.randomBytes(16).toString('hex');

    const result = await query(
        `UPDATE payments SET payment_token = $1 WHERE id = $2 RETURNING *`,
        [newToken, id]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('결제 정보');
    }

    res.json({ success: true, payment: result.rows[0] });
}));

/**
 * DELETE /api/payments/:id/
 * 결제 삭제
 */
router.delete('/:id/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        `DELETE FROM payments WHERE id = $1 RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('결제 정보');
    }

    res.json({ success: true, deleted: result.rows[0] });
}));

/**
 * POST /api/payments/test_init
 * 테스트 결제 생성 (심사용)
 */
router.post('/test_init', asyncHandler(async (req, res) => {
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
}));

export default router;
