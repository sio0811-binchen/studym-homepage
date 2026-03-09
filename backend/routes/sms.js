/**
 * SMS API 라우트
 */

import { Router } from 'express';
import { asyncHandler, Errors } from '../middleware/errorHandler.js';
import * as solapiService from '../services/solapi.js';

const router = Router();

/**
 * POST /api/sms/send
 * SMS 발송
 */
router.post('/send', asyncHandler(async (req, res) => {
    const { to, message, from } = req.body;

    if (!to || !message) {
        throw Errors.BadRequest('수신번호(to)와 메시지(message)는 필수입니다.');
    }

    try {
        const result = await solapiService.sendSMS({
            to,
            text: message,
            from
        });

        res.json({
            success: true,
            messageId: result.messageId,
            groupId: result.groupId
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
}));

/**
 * POST /api/sms/notify-admin
 * 관리자 알림 발송
 */
router.post('/notify-admin', asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        throw Errors.BadRequest('메시지(message)는 필수입니다.');
    }

    const result = await solapiService.notifyAdmin(message);
    res.json(result);
}));

export default router;
