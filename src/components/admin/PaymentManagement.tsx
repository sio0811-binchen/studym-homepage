/**
 * Payment Management Tab Component
 * 개선사항: 날짜 필터, 할인 계산, 전화번호 통일
 */
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchPayments,
    createPayment,
    completePaymentManually,
    cancelPayment,
    regeneratePaymentLink,
    fetchPaymentStatistics,
    deletePayment,
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
    CheckCircle,
    MessageCircle,
    Calendar,
    Receipt,
    Trash2
} from 'lucide-react';
import { sendAligoSMS } from '../../utils/sms';
import { formatPhoneOnInput, extractDigits } from '../../utils/phoneFormat';
import * as XLSX from 'xlsx';

// 기본 금액 550,000원
const BASE_MONTHLY_PRICE = 550000;

const PaymentManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManualCompleteModal, setShowManualCompleteModal] = useState<Payment | null>(null);
    const [showCancelModal, setShowCancelModal] = useState<Payment | null>(null);
    const [manualNote, setManualNote] = useState('');

    // 날짜 필터 상태
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().slice(0, 10));

    // Fetch payments
    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ['payments'],
        queryFn: fetchPayments,
        refetchInterval: 30000,
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
        mutationFn: ({ id, reason, amount }: { id: number; reason: string; amount?: number }) => cancelPayment(id, reason, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            setShowCancelModal(null);
            alert('결제가 취소되었습니다.');
        },
        onError: (err) => {
            alert('취소 실패: ' + (err as Error).message);
        }
    });

    // Regenerate link mutation
    const regenerateMutation = useMutation({
        mutationFn: regeneratePaymentLink,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deletePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            alert('결제 내역이 삭제되었습니다.');
        },
        onError: (err) => {
            alert('삭제 실패: ' + (err as Error).message);
        }
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('복사되었습니다!');
    };

    // Safe payment list
    const paymentList = Array.isArray(payments) ? payments : [];

    // 날짜 필터링된 결제 목록
    const filteredPayments = useMemo(() => {
        return paymentList.filter(payment => {
            const paymentDate = new Date(payment.created_at);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return paymentDate >= start && paymentDate <= end;
        });
    }, [paymentList, startDate, endDate]);

    // 필터링된 기간의 총 결제 완료 금액
    const filteredTotalPaid = useMemo(() => {
        return filteredPayments
            .filter(p => p.status === 'PAID' || p.status === 'MANUAL')
            .reduce((sum, p) => sum + (p.amount || 0), 0);
    }, [filteredPayments]);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PAID: 'bg-green-100 text-green-800',
            MANUAL: 'bg-blue-100 text-blue-800',
            FAILED: 'bg-red-100 text-red-800',
            CANCELED: 'bg-gray-100 text-gray-800',
            PARTIAL_CANCELED: 'bg-orange-100 text-orange-800',
        };
        const labels: Record<string, string> = {
            PENDING: '대기중',
            PAID: '결제완료',
            MANUAL: '수동처리',
            FAILED: '실패',
            CANCELED: '취소됨',
            PARTIAL_CANCELED: '부분취소',
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

    const handleSendSMS = async (payment: Payment) => {
        if (!confirm(`${payment.student_name}님에게 결제 안내 문자를 발송하시겠습니까?`)) return;

        try {
            const receivers = [payment.student_phone, payment.parent_phone].filter(Boolean).join(',');
            const link = `${window.location.origin}/pay/${payment.payment_link?.token}`;
            const msg = `[StudyM] 수강료 결제 안내\n\n${payment.student_name} 학생의 수강료 결제가 생성되었습니다.\n\n- 상품: ${payment.product_type_display || payment.product_type}\n- 금액: ${formatAmount(payment.amount)}\n\n아래 링크를 통해 결제를 진행해주세요.\n${link}`;

            await sendAligoSMS(receivers, msg);
            alert('안내 문자가 발송되었습니다.');
        } catch (error) {
            alert('문자 발송에 실패했습니다.');
            console.error(error);
        }
    };

    const handleExportExcel = () => {
        if (filteredPayments.length === 0) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        const excelData = filteredPayments.map(p => ({
            '날짜': new Date(p.created_at).toLocaleDateString(),
            '학생': p.student_name,
            '연락처': p.student_phone,
            '상품': p.product_type_display || p.product_type,
            '금액': p.amount,
            '상태': p.status === 'PAID' ? '결제완료' : p.status === 'PENDING' ? '대기중' : p.status === 'CANCELED' ? '취소됨' : p.status,
            '취소금액': p.canceled_amount || 0,
            '남은금액': (p.amount || 0) - (p.canceled_amount || 0),
            '결제키': p.payment_key || '',
            '주문ID': p.order_id || ''
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "결제내역");
        XLSX.writeFile(wb, `결제내역_${startDate}~${endDate}.xlsx`);
    };

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">전체 결제</p>
                            <p className="text-2xl font-bold">{statistics?.summary?.this_month_count || paymentList.length}</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">대기중</p>
                            <p className="text-2xl font-bold">{statistics?.summary?.pending_count || paymentList.filter(p => p.status === 'PENDING').length}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">결제완료</p>
                            <p className="text-2xl font-bold">{paymentList.filter(p => p.status === 'PAID' || p.status === 'MANUAL').length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">이번 달 매출</p>
                            <p className="text-xl font-bold">{formatAmount(statistics?.summary?.this_month_total || 0)}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* 날짜 필터 및 기간별 결제 완료 금액 */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">기간:</span>
                    </div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <span className="text-slate-400">~</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <div className="ml-auto flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                        <span className="text-sm text-green-700">기간 결제 완료:</span>
                        <span className="text-lg font-bold text-green-700">{formatAmount(filteredTotalPaid)}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <div className="w-5 h-5 flex items-center justify-center font-bold border-2 border-white rounded text-[10px]">X</div>
                    엑셀 다운로드
                </button>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    새 결제 생성
                </button>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">학생</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">액션</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    선택한 기간에 결제 내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{payment.student_name}</div>
                                        <div className="text-xs text-gray-500">{payment.student_phone}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {payment.product_type_display || payment.product_type}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        <div>{formatAmount(payment.amount)}</div>
                                        {payment.canceled_amount && payment.canceled_amount > 0 && (
                                            <div className="text-xs text-orange-600">
                                                (취소: {formatAmount(payment.canceled_amount)}, 남은: {formatAmount(payment.amount - payment.canceled_amount)})
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(payment.status)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            {payment.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleSendSMS(payment)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="문자 발송"
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                    </button>
                                                    {payment.payment_link?.url && (
                                                        <>
                                                            <button
                                                                onClick={() => copyToClipboard(payment.payment_link!.url)}
                                                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                                                title="링크 복사"
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </button>
                                                            <a
                                                                href={payment.payment_link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                                                title="링크 열기"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </>
                                                    )}
                                                    {payment.receipt_url && (
                                                        <a
                                                            href={payment.receipt_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                                                            title="영수증"
                                                        >
                                                            <Receipt className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => setShowManualCompleteModal(payment)}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                        title="수동 완료"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => regenerateMutation.mutate(payment.id)}
                                                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded"
                                                        title="링크 재생성"
                                                        disabled={regenerateMutation.isPending}
                                                    >
                                                        <RefreshCw className={`h-4 w-4 ${regenerateMutation.isPending ? 'animate-spin' : ''}`} />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowCancelModal(payment)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                        title="취소"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('정말로 이 결제 내역을 삭제하시겠습니까? (영구 삭제)')) {
                                                                deleteMutation.mutate(payment.id);
                                                            }
                                                        }}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded flex items-center gap-1"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="text-xs font-bold">삭제</span>
                                                    </button>
                                                </>
                                            )}
                                            {/* 결제 완료(PAID/MANUAL) 상태: 영수증 보기 + 취소 버튼 */}
                                            {(payment.status === 'PAID' || payment.status === 'MANUAL') && (
                                                <>
                                                    {payment.receipt_url && (
                                                        <a
                                                            href={payment.receipt_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="영수증 보기"
                                                        >
                                                            <Receipt className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => setShowCancelModal(payment)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                        title="결제 취소"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('정말로 이 결제 내역을 삭제하시겠습니까? (영구 삭제)')) {
                                                                deleteMutation.mutate(payment.id);
                                                            }
                                                        }}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded flex items-center gap-1"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="text-xs font-bold">삭제</span>
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
                            {showManualCompleteModal.student_name}님의 결제를 수동으로 완료 처리합니다.
                        </p>
                        <textarea
                            value={manualNote}
                            onChange={(e) => setManualNote(e.target.value)}
                            placeholder="메모 (예: 현금 수령, 계좌이체 확인 등)"
                            className="w-full border rounded-lg p-3 mb-4"
                            rows={3}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowManualCompleteModal(null);
                                    setManualNote('');
                                }}
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

            {/* Cancel Modal */}
            {showCancelModal && (
                <CancelPaymentModal
                    payment={showCancelModal}
                    onClose={() => setShowCancelModal(null)}
                    onSubmit={(reason, amount) => cancelMutation.mutate({
                        id: showCancelModal.id,
                        reason,
                        amount
                    })}
                    isLoading={cancelMutation.isPending}
                />
            )}
        </div>
    );
};

// Create Payment Modal Component (개선된 버전)
const CreatePaymentModal: React.FC<{
    onClose: () => void;
    onSubmit: (data: PaymentCreateData) => void;
    isLoading: boolean;
}> = ({ onClose, onSubmit, isLoading }) => {
    const [studentName, setStudentName] = useState('');
    const [phone, setPhone] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [discount, setDiscount] = useState(0);
    const [discountNote, setDiscountNote] = useState('');

    const finalAmount = BASE_MONTHLY_PRICE - discount;

    const handlePhoneChange = (value: string, setter: (v: string) => void) => {
        setter(formatPhoneOnInput(value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentName.trim()) {
            alert('학생 이름을 입력해주세요.');
            return;
        }
        if (!phone.trim()) {
            alert('전화번호를 입력해주세요.');
            return;
        }
        if (finalAmount <= 0) {
            alert('결제 금액은 0원보다 커야 합니다.');
            return;
        }

        const data: PaymentCreateData = {
            student_name: studentName,
            student_phone: extractDigits(phone),
            parent_phone: parentPhone ? extractDigits(parentPhone) : undefined,
            product_type: 'MONTHLY',
            amount: finalAmount,
            discount_amount: discount > 0 ? discount : undefined,
            discount_note: discountNote || undefined,
        };

        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                <h3 className="text-xl font-bold mb-6">새 결제 생성</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 학생 이름 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            학생 이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="홍길동"
                            required
                        />
                    </div>

                    {/* 전화번호 (SMS 발송용) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            전화번호 (SMS 발송용) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value, setPhone)}
                            className="w-full border border-slate-300 rounded-lg p-3 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="010-1234-5678"
                            required
                        />
                    </div>

                    {/* 학부모 전화번호 (선택) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            학부모 전화번호 <span className="text-slate-400">(선택)</span>
                        </label>
                        <input
                            type="tel"
                            value={parentPhone}
                            onChange={(e) => handlePhoneChange(e.target.value, setParentPhone)}
                            className="w-full border border-slate-300 rounded-lg p-3 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="010-1234-5678"
                        />
                    </div>

                    {/* 상품 및 금액 */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">월간 수강권 (4주)</span>
                            <span className="font-bold">{new Intl.NumberFormat('ko-KR').format(BASE_MONTHLY_PRICE)}원</span>
                        </div>

                        {/* 할인 금액 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">할인 금액</label>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">-</span>
                                <input
                                    type="number"
                                    value={discount || ''}
                                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                                    className="flex-1 border border-slate-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="0"
                                    min={0}
                                    max={BASE_MONTHLY_PRICE}
                                />
                                <span className="text-slate-600">원</span>
                            </div>
                        </div>

                        {/* 할인 사유 (선택) */}
                        {discount > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    할인 사유 <span className="text-slate-400">(선택)</span>
                                </label>
                                <input
                                    type="text"
                                    value={discountNote}
                                    onChange={(e) => setDiscountNote(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="예: 형제 할인, 조기 등록 할인"
                                />
                            </div>
                        )}

                        {/* 최종 결제 금액 */}
                        <div className="border-t border-slate-200 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">최종 결제 금액</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {new Intl.NumberFormat('ko-KR').format(finalAmount)}원
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
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

// Cancel Payment Modal
const CancelPaymentModal: React.FC<{
    payment: Payment;
    onClose: () => void;
    onSubmit: (reason: string, amount: number | undefined) => void;
    isLoading: boolean;
}> = ({ payment, onClose, onSubmit, isLoading }) => {
    const [cancelType, setCancelType] = useState<'FULL' | 'PARTIAL'>('FULL');
    const [cancelAmount, setCancelAmount] = useState<number>(payment.amount);
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cancelType === 'PARTIAL' && (cancelAmount <= 0 || cancelAmount > payment.amount)) {
            alert('유효한 취소 금액을 입력해주세요.');
            return;
        }
        onSubmit(reason, cancelType === 'PARTIAL' ? cancelAmount : undefined);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4 text-red-600">결제 취소</h3>
                <p className="text-sm text-gray-600 mb-4">
                    {payment.student_name}님의 결제({new Intl.NumberFormat('ko-KR').format(payment.amount)}원)를 취소합니다.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={cancelType === 'FULL'}
                                onChange={() => {
                                    setCancelType('FULL');
                                    setCancelAmount(payment.amount);
                                }}
                                className="text-blue-600"
                            />
                            <span className="text-sm font-medium">전액 취소</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={cancelType === 'PARTIAL'}
                                onChange={() => setCancelType('PARTIAL')}
                                className="text-blue-600"
                            />
                            <span className="text-sm font-medium">부분 취소</span>
                        </label>
                    </div>

                    {cancelType === 'PARTIAL' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">취소할 금액</label>
                            <input
                                type="number"
                                value={cancelAmount}
                                onChange={(e) => setCancelAmount(Number(e.target.value))}
                                className="w-full border rounded p-2"
                                max={payment.amount}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">취소 사유</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="예: 단순 변심, 환불 요청"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            닫기
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {isLoading ? '처리중...' : '취소 실행'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
