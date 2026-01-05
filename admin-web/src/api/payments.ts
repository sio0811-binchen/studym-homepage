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
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'MANUAL';
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
}

export interface PaymentCreateData {
    student_name: string;
    student_phone: string;
    parent_phone: string;
    product_type: 'MONTHLY' | 'WEEKLY' | 'WINTER_SCHOOL' | 'PRORATED';
    days?: number;
    custom_amount?: number;
    start_date?: string;
    end_date?: string;
}

// Admin password for temporary access
const ADMIN_PASSWORD = 'studym2025';

/**
 * Fetch all payments
 */
export const fetchPayments = async (): Promise<Payment[]> => {
    const response = await client.get(`/api/payments/?admin_password=${ADMIN_PASSWORD}`);
    return response.data;
};

/**
 * Create a new payment
 */
export const createPayment = async (data: PaymentCreateData): Promise<Payment> => {
    const response = await client.post(`/api/payments/?admin_password=${ADMIN_PASSWORD}`, data);
    return response.data;
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
export const cancelPayment = async (paymentId: number): Promise<Payment> => {
    const response = await client.post(
        `/api/payments/${paymentId}/cancel/?admin_password=${ADMIN_PASSWORD}`
    );
    return response.data;
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
    const response = await client.get(`/api/payments/statistics/?admin_password=${ADMIN_PASSWORD}`);
    return response.data;
};
