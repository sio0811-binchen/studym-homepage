/**
 * 가맹점 문의 API 라우트
 */

import { Router } from 'express';
import { query } from '../utils/database.js';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler, Errors } from '../middleware/errorHandler.js';
import * as solapiService from '../services/solapi.js';

const router = Router();

/**
 * POST /api/franchise/inquire/
 * 가맹점 문의 신청
 */
router.post('/inquire/', asyncHandler(async (req, res) => {
    const { applicant_name, phone, email, region, budget, has_property } = req.body;

    if (!applicant_name || !phone) {
        throw Errors.BadRequest('신청자 이름과 전화번호는 필수입니다.');
    }

    const result = await query(
        `INSERT INTO franchise_inquiries
         (applicant_name, phone, email, region, budget, has_property, status, lead_grade)
         VALUES ($1, $2, $3, $4, $5, $6, 'NEW', 'HOT')
         RETURNING *`,
        [applicant_name, phone, email, region, budget, has_property || false]
    );

    const inquiry = result.rows[0];

    // 관리자 알림
    await solapiService.notifyAdmin(
        `[StudyM 가맹 문의] ${applicant_name} / ${phone} / ${region || '지역미입력'}`
    ).catch(err => console.error('관리자 알림 실패:', err));

    res.status(201).json(inquiry);
}));

/**
 * GET /api/franchise-inquiries/
 * 가맹점 문의 목록 (관리자)
 */
router.get('/inquiries/', requireAdmin, asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT * FROM franchise_inquiries ORDER BY created_at DESC LIMIT 100`
    );
    res.json(result.rows);
}));

/**
 * PATCH /api/franchise-inquiries/:id/
 * 가맹점 문의 상태 수정 (관리자)
 */
router.patch('/inquiries/:id/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, lead_grade, memo } = req.body;

    const updates = [];
    const values = [id];
    let paramIndex = 2;

    if (status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(status);
    }
    if (lead_grade) {
        updates.push(`lead_grade = $${paramIndex++}`);
        values.push(lead_grade);
    }
    if (memo !== undefined) {
        updates.push(`memo = $${paramIndex++}`);
        values.push(memo);
    }

    if (updates.length === 0) {
        throw Errors.BadRequest('수정할 항목이 없습니다.');
    }

    const result = await query(
        `UPDATE franchise_inquiries SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('가맹점 문의 정보');
    }

    res.json(result.rows[0]);
}));

/**
 * DELETE /api/franchise-inquiries/:id/
 * 가맹점 문의 삭제 (관리자)
 */
router.delete('/inquiries/:id/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        `DELETE FROM franchise_inquiries WHERE id = $1 RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('가맹점 문의 정보');
    }

    res.json({ success: true, deleted: result.rows[0] });
}));

export default router;
