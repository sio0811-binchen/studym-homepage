/**
 * Public Payment Page - 고객이 결제하는 페이지
 * URL: /pay/:token
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

// API Base URL
const API_BASE = import.meta.env.VITE_API_BASE || 'https://studym-homepage-production-a3c2.up.railway.app';
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_ex6BJGQOVDvLA4OAxpya8W4w2zNb';


interface PaymentInfo {
    id: number;
    order_id: string;
    student_name: string;
    product_type_display: string;
    amount: number;
    status: string;
    student_phone?: string;
    parent_phone?: string;
}

type PageState = 'loading' | 'ready' | 'processing' | 'success' | 'failed' | 'error';

const PaymentPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [pageState, setPageState] = useState<PageState>('loading');
    const [payment, setPayment] = useState<PaymentInfo | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Load payment info
    useEffect(() => {
        const loadPaymentInfo = async () => {
            if (!token) {
                setErrorMessage('잘못된 접근입니다.');
                setPageState('error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/api/payment-links/${token}/`);
                const data = await response.json();

                if (!response.ok) {
                    setErrorMessage(data.error || '결제 정보를 불러올 수 없습니다.');
                    setPageState('error');
                    return;
                }

                setPayment(data.payment);

                // Check if already paid
                if (data.payment.status === 'PAID' || data.payment.status === 'MANUAL') {
                    setPageState('success');
                } else if (data.payment.status === 'CANCELED') {
                    setErrorMessage('취소된 결제입니다.');
                    setPageState('error');
                } else {
                    setPageState('ready');
                }
            } catch (error) {
                setErrorMessage('네트워크 오류가 발생했습니다.');
                setPageState('error');
            }
        };

        loadPaymentInfo();
    }, [token]);

    // Load Toss Payments SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v1/payment';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Handle payment
    const handlePayment = async () => {
        if (!payment) return;

        setPageState('processing');

        try {
            // @ts-ignore - Toss SDK is loaded dynamically
            const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);

            // Save contact info for success page SMS
            localStorage.setItem('payment_contact_info', JSON.stringify({
                student_phone: payment.student_phone,
                parent_phone: payment.parent_phone,
                student_name: payment.student_name,
                product_name: payment.product_type_display,
                amount: payment.amount
            }));

            await tossPayments.requestPayment('카드', {
                amount: payment.amount,
                orderId: payment.order_id,
                orderName: payment.product_type_display,
                customerName: payment.student_name,
                successUrl: `${window.location.origin}/pay/${token}/success`,
                failUrl: `${window.location.origin}/pay/${token}/fail`,
            });
        } catch (error: any) {
            if (error.code === 'USER_CANCEL') {
                setPageState('ready');
            } else {
                setErrorMessage(error.message || '결제 중 오류가 발생했습니다.');
                setPageState('failed');
            }
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-3" />
                    <h1 className="text-2xl font-bold">StudyM 결제</h1>
                    <p className="text-blue-100 text-sm mt-1">안전한 결제 페이지입니다</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {pageState === 'loading' && (
                        <div className="text-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                            <p className="text-gray-600">결제 정보를 불러오는 중...</p>
                        </div>
                    )}

                    {pageState === 'ready' && payment && (
                        <div className="space-y-6">
                            {/* Payment Info */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-gray-600">학생명</span>
                                    <span className="font-semibold text-gray-900">{payment.student_name}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-gray-600">상품</span>
                                    <span className="font-semibold text-gray-900">{payment.product_type_display}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-600">결제 금액</span>
                                    <span className="text-2xl font-bold text-blue-600">{formatAmount(payment.amount)}원</span>
                                </div>
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                결제하기
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
                            </p>
                        </div>
                    )}

                    {pageState === 'processing' && (
                        <div className="text-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                            <p className="text-gray-600">결제를 진행 중입니다...</p>
                        </div>
                    )}

                    {pageState === 'success' && (
                        <div className="text-center py-12">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h2>
                            <p className="text-gray-600 mb-6">
                                {payment?.student_name}님의 결제가 완료되었습니다.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                            >
                                홈으로 돌아가기
                            </button>
                        </div>
                    )}

                    {pageState === 'failed' && (
                        <div className="text-center py-12">
                            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 실패</h2>
                            <p className="text-gray-600 mb-6">{errorMessage}</p>
                            <button
                                onClick={() => setPageState('ready')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                            >
                                다시 시도
                            </button>
                        </div>
                    )}

                    {pageState === 'error' && (
                        <div className="text-center py-12">
                            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">오류</h2>
                            <p className="text-gray-600 mb-6">{errorMessage}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
                            >
                                홈으로 돌아가기
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center">
                    <p className="text-xs text-gray-500">© 2026 StudyM. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
