/**
 * Payment Success Page - 결제 성공 후 리다이렉트되는 페이지
 */
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';

const API_BASE = 'https://study-manager-production-826b.up.railway.app';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const confirmPayment = async () => {
            const paymentKey = searchParams.get('paymentKey');
            const orderId = searchParams.get('orderId');
            const amount = searchParams.get('amount');

            if (!paymentKey || !orderId || !amount) {
                setErrorMessage('결제 정보가 올바르지 않습니다.');
                setStatus('error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/api/payment-confirm/confirm/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentKey,
                        orderId,
                        amount: parseInt(amount),
                    }),
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    setStatus('success');
                } else {
                    setErrorMessage(data.error?.message || '결제 승인에 실패했습니다.');
                    setStatus('error');
                }
            } catch (error) {
                setErrorMessage('네트워크 오류가 발생했습니다.');
                setStatus('error');
            }
        };

        confirmPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                {status === 'confirming' && (
                    <>
                        <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 중...</h1>
                        <p className="text-gray-600">잠시만 기다려주세요.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">결제 완료!</h1>
                        <p className="text-gray-600 mb-8">
                            결제가 성공적으로 완료되었습니다.<br />
                            감사합니다!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors"
                        >
                            홈으로 돌아가기
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">❌</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">결제 오류</h1>
                        <p className="text-gray-600 mb-8">{errorMessage}</p>
                        <button
                            onClick={() => window.history.back()}
                            className="w-full bg-gray-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition-colors"
                        >
                            돌아가기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
