/**
 * 상담 API 라우트
 */

import { Router } from 'express';
import { query } from '../utils/database.js';
import { requireAdmin, optionalAdmin } from '../middleware/auth.js';
import { asyncHandler, Errors } from '../middleware/errorHandler.js';
import * as solapiService from '../services/solapi.js';

const router = Router();

/**
 * POST /api/consultations/
 * 상담 신청
 */
router.post('/', asyncHandler(async (req, res) => {
    const { student_name, student_school, student_grade, parent_name, parent_phone, consultation_date } = req.body;

    if (!student_name || !parent_phone) {
        throw Errors.BadRequest('학생 이름과 학부모 전화번호는 필수입니다.');
    }

    const result = await query(
        `INSERT INTO consultations
         (student_name, student_school, student_grade, parent_name, parent_phone, consultation_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
         RETURNING *`,
        [student_name, student_school, student_grade, parent_name, parent_phone, consultation_date]
    );

    const consultation = result.rows[0];

    // 관리자 알림
    await solapiService.notifyAdmin(
        `[StudyM 상담 신청] ${student_name} (${student_school || '학교미입력'}) / ${parent_phone}`
    ).catch(err => console.error('관리자 알림 실패:', err));

    res.status(201).json(consultation);
}));

/**
 * GET /api/consultations/
 * 상담 목록 조회 (관리자)
 */
router.get('/', requireAdmin, asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT * FROM consultations ORDER BY created_at DESC LIMIT 100`
    );
    res.json(result.rows);
}));

/**
 * PATCH /api/consultations/:id/
 * 상담 상태 수정 (관리자)
 */
router.patch('/:id/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, memo } = req.body;

    const updates = [];
    const values = [id];
    let paramIndex = 2;

    if (status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(status);
    }
    if (memo !== undefined) {
        updates.push(`memo = $${paramIndex++}`);
        values.push(memo);
    }

    if (updates.length === 0) {
        throw Errors.BadRequest('수정할 항목이 없습니다.');
    }

    const result = await query(
        `UPDATE consultations SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('상담 정보');
    }

    res.json(result.rows[0]);
}));

/**
 * DELETE /api/consultations/:id/
 * 상담 삭제 (관리자)
 */
router.delete('/:id/', requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        `DELETE FROM consultations WHERE id = $1 RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        throw Errors.NotFound('상담 정보');
    }

    res.json({ success: true, deleted: result.rows[0] });
}));

export default router;
