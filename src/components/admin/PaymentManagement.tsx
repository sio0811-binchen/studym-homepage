/**
 * Payment Management Tab Component
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchPayments,
    createPayment,
    completePaymentManually,
    cancelPayment,
    regeneratePaymentLink,
    fetchPaymentStatistics,
} from '../../api/payments';
import type { Payment, PaymentCreateData } from '../../api/payments';
import {
    CreditCard,
    Plus,
    Check,
    X,
    RefreshCw,
    Copy,
    ExternalLink,
    Loader2,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';

const PRODUCT_TYPES = [
    { value: 'MONTHLY', label: '월간 수강권 (4주)', price: 450000 },
    { value: 'WEEKLY', label: '주간 수강권 (1주)', price: 150000 },
    { value: 'WINTER_SCHOOL', label: '겨울 특강 (2주)', price: 280000 },
    { value: 'PRORATED', label: '일할 계산', price: 0 },
];

const PaymentManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManualCompleteModal, setShowManualCompleteModal] = useState<Payment | null>(null);
    const [manualNote, setManualNote] = useState('');

    // Fetch payments
    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ['payments'],
        queryFn: fetchPayments,
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Fetch statistics
    const { data: statistics } = useQuery({
        queryKey: ['paymentStatistics'],
        queryFn: fetchPaymentStatistics,
        refetchInterval: 30000,
    });

    // Create payment mutation
    const createMutation = useMutation({
        mutationFn: createPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            setShowCreateModal(false);
        },
    });

    // Manual complete mutation
    const completeMutation = useMutation({
        mutationFn: ({ id, note }: { id: number; note: string }) => completePaymentManually(id, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            setShowManualCompleteModal(null);
            setManualNote('');
        },
    });

    // Cancel mutation
    const cancelMutation = useMutation({
        mutationFn: cancelPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });

    // Regenerate link mutation
    const regenerateMutation = useMutation({
        mutationFn: regeneratePaymentLink,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('복사되었습니다!');
    };

    // Safe payment list
    const paymentList = Array.isArray(payments) ? payments : [];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PAID: 'bg-green-100 text-green-800',
            MANUAL: 'bg-blue-100 text-blue-800',
            FAILED: 'bg-red-100 text-red-800',
            CANCELED: 'bg-gray-100 text-gray-800',
        };
        const labels: Record<string, string> = {
            PENDING: '대기중',
            PAID: '결제완료',
            MANUAL: '수동처리',
            FAILED: '실패',
            CANCELED: '취소됨',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                오류: {(error as Error).message}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                    결제 관리
                </h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    결제 생성
                </button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">총 결제 완료</p>
                                <p className="text-2xl font-bold">{formatAmount(statistics.summary.total_completed)}</p>
                            </div>
                            <CheckCircle className="h-10 w-10 text-green-200" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">이번 달 결제</p>
                                <p className="text-2xl font-bold">{formatAmount(statistics.summary.this_month_total)}</p>
                                <p className="text-blue-200 text-xs">{statistics.summary.this_month_count}건</p>
                            </div>
                            <TrendingUp className="h-10 w-10 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm">대기 중</p>
                                <p className="text-2xl font-bold">{statistics.summary.pending_count}건</p>
                            </div>
                            <Clock className="h-10 w-10 text-amber-200" />
                        </div>
                    </div>
                </div>
            )}

            {/* Payment List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학생</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paymentList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    결제 내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            paymentList.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="font-medium text-gray-900">{payment.student_name}</div>
                                            <div className="text-sm text-gray-500">{payment.student_phone}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {payment.product_type_display || payment.product_type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {formatAmount(payment.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(payment.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.created_at).toLocaleDateString('ko-KR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            {payment.status === 'PENDING' && (
                                                <>
                                                    {payment.payment_link && payment.payment_link.token && (
                                                        <>
                                                            <button
                                                                onClick={() => copyToClipboard(`${window.location.origin}/pay/${payment.payment_link?.token}`)}
                                                                className="p-1 text-gray-500 hover:text-blue-600"
                                                                title="링크 복사"
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </button>
                                                            <a
                                                                href={`/pay/${payment.payment_link.token}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1 text-gray-500 hover:text-blue-600"
                                                                title="결제 페이지 열기"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => regenerateMutation.mutate(payment.id)}
                                                        className="p-1 text-gray-500 hover:text-yellow-600"
                                                        title="링크 재생성"
                                                        disabled={regenerateMutation.isPending}
                                                    >
                                                        <RefreshCw className={`h-4 w-4 ${regenerateMutation.isPending ? 'animate-spin' : ''}`} />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowManualCompleteModal(payment)}
                                                        className="p-1 text-gray-500 hover:text-green-600"
                                                        title="수동 완료"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('정말 취소하시겠습니까?')) {
                                                                cancelMutation.mutate(payment.id);
                                                            }
                                                        }}
                                                        className="p-1 text-gray-500 hover:text-red-600"
                                                        title="취소"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Payment Modal */}
            {showCreateModal && (
                <CreatePaymentModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={(data) => createMutation.mutate(data)}
                    isLoading={createMutation.isPending}
                />
            )}

            {/* Manual Complete Modal */}
            {showManualCompleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">수동 결제 완료</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {showManualCompleteModal.student_name}님의 결제 ({formatAmount(showManualCompleteModal.amount)})를 수동으로 완료 처리합니다.
                        </p>
                        <textarea
                            value={manualNote}
                            onChange={(e) => setManualNote(e.target.value)}
                            placeholder="처리 메모 (선택사항)"
                            className="w-full border rounded-lg p-3 mb-4"
                            rows={3}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowManualCompleteModal(null)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => completeMutation.mutate({
                                    id: showManualCompleteModal.id,
                                    note: manualNote
                                })}
                                disabled={completeMutation.isPending}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {completeMutation.isPending ? '처리중...' : '완료 처리'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Create Payment Modal Component
const CreatePaymentModal: React.FC<{
    onClose: () => void;
    onSubmit: (data: PaymentCreateData) => void;
    isLoading: boolean;
}> = ({ onClose, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<PaymentCreateData>({
        student_name: '',
        student_phone: '',
        parent_phone: '',
        product_type: 'MONTHLY',
    });
    const [days, setDays] = useState<number>(7);

    const selectedProduct = PRODUCT_TYPES.find(p => p.value === formData.product_type);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...formData };
        if (formData.product_type === 'PRORATED') {
            data.days = days;
        }
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold mb-4">새 결제 생성</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">학생 이름 *</label>
                        <input
                            type="text"
                            value={formData.student_name}
                            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">학생 전화번호 *</label>
                        <input
                            type="tel"
                            value={formData.student_phone}
                            onChange={(e) => setFormData({ ...formData, student_phone: e.target.value })}
                            className="w-full border rounded-lg p-3"
                            placeholder="010-1234-5678"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">학부모 전화번호 *</label>
                        <input
                            type="tel"
                            value={formData.parent_phone}
                            onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                            className="w-full border rounded-lg p-3"
                            placeholder="010-1234-5678"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상품 유형 *</label>
                        <select
                            value={formData.product_type}
                            onChange={(e) => setFormData({ ...formData, product_type: e.target.value as PaymentCreateData['product_type'] })}
                            className="w-full border rounded-lg p-3"
                        >
                            {PRODUCT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label} {type.price > 0 && `- ${new Intl.NumberFormat('ko-KR').format(type.price)}원`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.product_type === 'PRORATED' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">수강 일수 *</label>
                            <input
                                type="number"
                                value={days}
                                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                                min={1}
                                max={28}
                                className="w-full border rounded-lg p-3"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                예상 금액: {new Intl.NumberFormat('ko-KR').format(Math.round(450000 / 28 * days))}원
                            </p>
                        </div>
                    )}

                    {selectedProduct && selectedProduct.price > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">결제 금액</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {new Intl.NumberFormat('ko-KR').format(selectedProduct.price)}원
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? '생성중...' : '결제 생성'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentManagement;
