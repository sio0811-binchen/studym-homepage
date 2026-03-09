/**
 * Solapi SMS 서비스
 *
 * 보안 개선: API 키 기본값 제거, 환경변수만 사용
 */

import CryptoJS from 'crypto-js';
import axios from 'axios';

/**
 * Solapi 인증 헤더 생성
 */
function getSolapiAuthHeader() {
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error('SOLAPI API 키가 설정되지 않았습니다.');
    }

    const date = new Date().toISOString();
    const salt = Math.random().toString(36).substring(2, 18);
    const hmacData = date + salt;
    const signature = CryptoJS.HmacSHA256(hmacData, apiSecret).toString(CryptoJS.enc.Hex);

    return {
        'Authorization': `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        'Content-Type': 'application/json'
    };
}

/**
 * SMS 발송
 *
 * @param {Object} options
 * @param {string} options.to - 수신번호
 * @param {string} options.from - 발신번호
 * @param {string} options.text - 메시지 내용
 * @param {string} [options.subject] - LMS 제목
 * @returns {Promise<Object>}
 */
export async function sendSMS({ to, from, text, subject }) {
    const senderPhone = from || process.env.SOLAPI_SENDER_PHONE;

    if (!senderPhone) {
        throw new Error('발신번호가 설정되지 않았습니다.');
    }

    // 메시지 타입 결정 (90자 초과시 LMS)
    const messageType = text.length > 90 ? 'LMS' : 'SMS';

    const payload = {
        message: {
            to,
            from: senderPhone,
            text,
            ...(subject && { subject }),
            type: messageType
        }
    };

    try {
        const headers = getSolapiAuthHeader();
        const response = await axios.post(
            'https://api.solapi.com/messages/v4/send',
            payload,
            { headers }
        );

        return {
            success: true,
            messageId: response.data.messageId,
            groupId: response.data.groupId
        };
    } catch (error) {
        console.error('SMS 발송 실패:', error.response?.data || error.message);
        throw new Error(`SMS 발송 실패: ${error.response?.data?.message || error.message}`);
    }
}

/**
 * 알림톡 발송 (카카오톡)
 */
export async function sendAlimtalk({ to, templateCode, variables }) {
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const pfId = process.env.SOLAPI_PF_ID;

    if (!apiKey || !apiSecret || !pfId) {
        throw new Error('알림톡 설정이 완료되지 않았습니다.');
    }

    // 알림톡 발송 로직
    // TODO: 구현 필요시 추가
}

/**
 * 관리자에게 알림 SMS 발송
 */
export async function notifyAdmin(message) {
    const adminPhone = process.env.ADMIN_PHONE;

    if (!adminPhone) {
        console.warn('관리자 전화번호가 설정되지 않아 알림을 보내지 않습니다.');
        return { success: false, reason: 'no_admin_phone' };
    }

    try {
        return await sendSMS({
            to: adminPhone,
            from: process.env.SOLAPI_SENDER_PHONE,
            text: message,
            subject: '[StudyM 알림]'
        });
    } catch (error) {
        console.error('관리자 알림 발송 실패:', error);
        return { success: false, error: error.message };
    }
}

export default {
    sendSMS,
    sendAlimtalk,
    notifyAdmin
};
