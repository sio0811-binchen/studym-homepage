/**
 * Toss Payments 서비스
 *
 * 보안 개선: API 키 기본값 제거, 환경변수만 사용
 */

import axios from 'axios';

const TOSS_API_URL = 'https://api.tosspayments.com';

/**
 * Toss 인증 헤더 생성
 */
function getTossAuthHeader() {
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
        throw new Error('TOSS_SECRET_KEY가 설정되지 않았습니다.');
    }

    // Base64 인코딩 (secretKey:)
    const encoded = Buffer.from(`${secretKey}:`).toString('base64');

    return {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json'
    };
}

/**
 * 결제 승인
 *
 * @param {string} paymentKey - 결제 키
 * @param {string} orderId - 주문 ID
 * @param {number} amount - 결제 금액
 */
export async function confirmPayment(paymentKey, orderId, amount) {
    try {
        const headers = getTossAuthHeader();

        const response = await axios.post(
            `${TOSS_API_URL}/v1/payments/confirm`,
            { paymentKey, orderId, amount },
            { headers }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('결제 승인 실패:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

/**
 * 결제 취소
 *
 * @param {string} paymentKey - 결제 키
 * @param {string} cancelReason - 취소 사유
 */
export async function cancelPayment(paymentKey, cancelReason) {
    try {
        const headers = getTossAuthHeader();

        const response = await axios.post(
            `${TOSS_API_URL}/v1/payments/${paymentKey}/cancel`,
            { cancelReason },
            { headers }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('결제 취소 실패:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

/**
 * 결제 부분 취소
 *
 * @param {string} paymentKey - 결제 키
 * @param {number} cancelAmount - 취소 금액
 * @param {string} cancelReason - 취소 사유
 */
export async function partialCancelPayment(paymentKey, cancelAmount, cancelReason) {
    try {
        const headers = getTossAuthHeader();

        const response = await axios.post(
            `${TOSS_API_URL}/v1/payments/${paymentKey}/cancel`,
            {
                cancelReason,
                cancelAmount
            },
            { headers }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('부분 취소 실패:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

/**
 * 결제 조회
 *
 * @param {string} paymentKey - 결제 키
 */
export async function getPayment(paymentKey) {
    try {
        const headers = getTossAuthHeader();

        const response = await axios.get(
            `${TOSS_API_URL}/v1/payments/${paymentKey}`,
            { headers }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('결제 조회 실패:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

/**
 * 결제 링크 생성 (Toss 결제 위젯)
 *
 * @param {Object} options
 * @param {string} options.orderId - 주문 ID
 * @param {number} options.amount - 결제 금액
 * @param {string} options.orderName - 주문명
 * @param {string} options.customerName - 고객명
 * @param {string} options.customerMobilePhone - 고객 전화번호
 */
export async function createPaymentLink(options) {
    const { orderId, amount, orderName, customerName, customerMobilePhone } = options;

    // 결제 링크 생성 로직
    // Toss 결제 위젯 URL 반환
    const successUrl = `${process.env.BASE_URL}/payment/success`;
    const failUrl = `${process.env.BASE_URL}/payment/fail`;

    return {
        success: true,
        data: {
            orderId,
            amount,
            orderName,
            successUrl,
            failUrl,
            customerName,
            customerMobilePhone
        }
    };
}

export default {
    confirmPayment,
    cancelPayment,
    partialCancelPayment,
    getPayment,
    createPaymentLink
};
