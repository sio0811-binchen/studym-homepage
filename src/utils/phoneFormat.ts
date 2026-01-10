/**
 * 전화번호 자동 포맷팅 유틸리티
 * 숫자만 입력 → 000-0000-0000 형식으로 변환
 */

/**
 * 전화번호에서 숫자만 추출
 */
export const extractDigits = (phone: string): string => {
    return phone.replace(/\D/g, '');
};

/**
 * 전화번호 포맷팅 (010-1234-5678 형식)
 */
export const formatPhoneNumber = (phone: string): string => {
    const digits = extractDigits(phone);

    if (digits.length === 11) {
        // 010-1234-5678
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
        // 02-1234-5678 또는 031-123-4567
        if (digits.startsWith('02')) {
            return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 9) {
        // 02-123-4567
        return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }

    // 그 외는 그대로 반환
    return phone;
};

/**
 * 입력 중 실시간 포맷팅 (하이픈 자동 삽입)
 */
export const formatPhoneOnInput = (value: string): string => {
    const digits = extractDigits(value);

    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 7) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
};

/**
 * 전화번호 유효성 검사
 */
export const isValidPhoneNumber = (phone: string): boolean => {
    const digits = extractDigits(phone);
    return digits.length >= 9 && digits.length <= 11;
};
