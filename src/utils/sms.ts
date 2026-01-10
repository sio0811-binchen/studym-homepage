/**
 * SMS 발송 유틸리티 (Solapi API)
 * 
 * 솔라피 REST API를 사용하여 SMS 발송
 * 발신번호: 031-387-7303 (고정)
 */
import axios from 'axios';
import CryptoJS from 'crypto-js';

const SOLAPI_API_KEY = import.meta.env.VITE_SOLAPI_API_KEY || '';
const SOLAPI_API_SECRET = import.meta.env.VITE_SOLAPI_API_SECRET || '';
const SENDER_NUMBER = '0313877303'; // 발신번호 고정

/**
 * Solapi API 인증 헤더 생성
 */
const getAuthorizationHeader = (): string => {
    const date = new Date().toISOString();
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const signature = CryptoJS.HmacSHA256(date + salt, SOLAPI_API_SECRET).toString();

    return `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
};

/**
 * SMS 발송 함수
 * @param receiver - 수신자 전화번호 (여러 명일 경우 콤마로 구분)
 * @param message - 메시지 내용
 * @param testMode - 테스트 모드 (실제 발송하지 않음)
 */
export const sendSolapiSMS = async (
    receiver: string,
    message: string,
    testMode: boolean = false
): Promise<{ success: boolean; error?: string }> => {
    // 수신자가 없으면 에러
    if (!receiver || receiver.trim() === '') {
        console.error('SMS 수신자가 없습니다.');
        return { success: false, error: '수신자가 없습니다.' };
    }

    // API 키 확인
    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) {
        console.error('Solapi API 키가 설정되지 않았습니다.');
        return { success: false, error: 'API 키가 설정되지 않았습니다.' };
    }

    // 테스트 모드
    if (testMode) {
        console.log('[SMS 테스트 모드]', { receiver, message });
        return { success: true };
    }

    try {
        // 수신자 목록 처리 (콤마로 구분된 경우)
        const receivers = receiver.split(',').map(r => r.replace(/\D/g, '').trim()).filter(Boolean);

        // 메시지 배열 생성
        const messages = receivers.map(to => ({
            to,
            from: SENDER_NUMBER,
            text: message,
            type: message.length > 45 ? 'LMS' : 'SMS'
        }));

        const response = await axios.post(
            'https://api.solapi.com/messages/v4/send-many',
            { messages },
            {
                headers: {
                    'Authorization': getAuthorizationHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.groupInfo?.status === 'FAILED') {
            console.error('Solapi SMS 발송 실패:', response.data);
            return { success: false, error: response.data.groupInfo?.errorMessage || 'SMS 발송 실패' };
        }

        console.log('SMS 발송 성공:', response.data);
        return { success: true };
    } catch (error) {
        console.error('Solapi SMS 오류:', error);
        const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.errorMessage || error.message
            : 'SMS 발송 중 오류가 발생했습니다.';
        return { success: false, error: errorMessage };
    }
};

// 하위 호환성을 위한 alias (기존 sendAligoSMS 대체)
export const sendAligoSMS = sendSolapiSMS;
