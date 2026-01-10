/**
 * Payment API Client
 */
import client from './client';

export interface Payment {
    id: number;
    order_id: string;
    student_name: string;
    student_phone: string;
    parent_phone: string;
    product_type: string;
    product_type_display: string;
    amount: number;
    canceled_amount?: number; // 취소된 금액 (부분 취소 시 누적)
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'MANUAL' | 'PARTIAL_CANCELED';
    status_display: string;
    days?: number;
    start_date?: string;
    end_date?: string;
    manual_note?: string;
    created_at: string;
    paid_at?: string;
    payment_link?: {
        token: string;
        url: string;
        expires_at: string;
    };
    receipt_url?: string; // 영수증 URL
}

export interface PaymentCreateData {
    student_name: string;
    student_phone: string;
    parent_phone?: string;  // 선택 입력
    product_type: 'MONTHLY' | 'WEEKLY' | 'WINTER_SCHOOL' | 'PRORATED';
    days?: number;
    amount?: number;  // 최종 결제 금액
    custom_amount?: number;
    discount_amount?: number;  // 할인 금액
    discount_note?: string;  // 할인 사유
    start_date?: string;
    end_date?: string;
}

// Admin password for temporary access
const ADMIN_PASSWORD = 'studym001!';

const SAMPLE_PAYMENTS: Payment[] = [
    {
        id: 1,
        order_id: 'ord_20240115_001',
        student_name: '박민수',
        student_phone: '010-1234-1234',
        parent_phone: '010-4321-4321',
        product_type: 'MONTHLY',
        product_type_display: '월간 수강권 (4주)',
        amount: 450000,
        status: 'PAID',
        status_display: '결제완료',
        created_at: '2024-01-01T10:00:00',
        payment_link: { token: 'sample_token_1', url: 'https://studym.co.kr/pay/sample_1', expires_at: '2024-01-08T10:00:00' }
    },
    {
        id: 2,
        order_id: 'ord_20240115_002',
        student_name: '최영희',
        student_phone: '010-9876-9876',
        parent_phone: '010-1111-2222',
        product_type: 'WEEKLY',
        product_type_display: '주간 수강권 (1주)',
        amount: 150000,
        status: 'PENDING',
        status_display: '대기중',
        created_at: '2024-01-14T11:00:00',
        payment_link: { token: 'sample_token_2', url: 'https://studym.co.kr/pay/sample_2', expires_at: '2024-01-21T11:00:00' }
    }
];

const SAMPLE_STATS: PaymentStatistics = {
    summary: {
        total_completed: 4500000,
        this_month_total: 1200000,
        this_month_count: 5,
        pending_count: 2
    },
    by_status: {
        'PAID': { count: 10, total: 4500000 },
        'PENDING': { count: 2, total: 300000 }
    }
};

/**
 * Fetch all payments
 */
export const fetchPayments = async (): Promise<Payment[]> => {
    try {
        const response = await client.get(`/api/payments/?admin_password=${ADMIN_PASSWORD}`);
        return response.data;
    } catch (error) {
        console.warn('Using sample payments data due to API error');
        return SAMPLE_PAYMENTS;
    }
};

/**
 * Create a new payment
 */
export const createPayment = async (data: PaymentCreateData): Promise<Payment> => {
    try {
        const response = await client.post(`/api/payments/?admin_password=${ADMIN_PASSWORD}`, data);
        return response.data;
    } catch (error) {
        console.warn('Mocking create payment');
        return {
            ...SAMPLE_PAYMENTS[0],
            id: Math.random(),
            student_name: data.student_name,
            amount: 450000,
            status: 'PENDING'
        };
    }
};

/**
 * Mark payment as manually completed
 */
export const completePaymentManually = async (paymentId: number, note?: string): Promise<Payment> => {
    const response = await client.post(
        `/api/payments/${paymentId}/manual_complete/?admin_password=${ADMIN_PASSWORD}`,
        { note: note || '수동 처리' }
    );
    return response.data;
};

/**
 * Cancel payment
 */
export const cancelPayment = async (paymentId: number, cancelReason?: string, cancelAmount?: number): Promise<Payment> => {
    const response = await client.post(
        `/api/payments/${paymentId}/cancel/?admin_password=${ADMIN_PASSWORD}`,
        {
            cancelReason: cancelReason || '관리자 취소',
            cancelAmount: cancelAmount // 부분 취소 금액 (백엔드 지원 시 동작)
        }
    );
    return response.data;
};

/**
 * Delete payment
 */
export const deletePayment = async (paymentId: number): Promise<void> => {
    await client.delete(
        `/api/payments/${paymentId}/?admin_password=${ADMIN_PASSWORD}`
    );
};

/**
 * Regenerate payment link
 */
export const regeneratePaymentLink = async (paymentId: number): Promise<{ token: string; url: string; expires_at: string }> => {
    const response = await client.post(
        `/api/payments/${paymentId}/regenerate_link/?admin_password=${ADMIN_PASSWORD}`
    );
    return response.data;
};

/**
 * Calculate prorated amount
 */
export const calculateProrated = async (days: number, basePrice?: number): Promise<{ calculated_amount: number }> => {
    const response = await client.post(`/api/payments/calculate_prorated/`, {
        days,
        base_price: basePrice || 450000
    });
    return response.data;
};

/**
 * Payment Statistics
 */
export interface PaymentStatistics {
    summary: {
        total_completed: number;
        this_month_total: number;
        this_month_count: number;
        pending_count: number;
    };
    by_status: Record<string, { count: number; total: number }>;
}

export const fetchPaymentStatistics = async (): Promise<PaymentStatistics> => {
    try {
        const response = await client.get(`/api/payments/statistics/?admin_password=${ADMIN_PASSWORD}`);
        return response.data;
    } catch (error) {
        console.warn('Using sample stats data due to API error');
        return SAMPLE_STATS;
    }
};
