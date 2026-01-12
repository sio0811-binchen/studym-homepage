/**
 * Payment Test Page - 토스페이먼츠 심사용 테스트 결제 페이지
 * URL: /pay/test
 */
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2 } from 'lucide-react';
import { formatPhoneOnInput } from '../utils/phoneFormat';

// API Base URL (Relative for proxy)
const API_BASE = '';
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_ex6BJGQOVDvLA4OAxpya8W4w2zNb';

const PaymentTestPage = () => {
    // const navigate = useNavigate(); // Removed unused variable
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        student_name: '심사담당자',
        student_phone: '010-0000-0000'
    });

    // Load Toss Payments SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v1/payment';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async () => {
        if (!formData.student_name || !formData.student_phone) {
            alert('이름과 연락처를 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            // 1. Initialize Test Payment on Backend
            const response = await fetch(`${API_BASE}/api/payments/test_init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_name: formData.student_name,
                    student_phone: formData.student_phone,
                    amount: 1000 // Test Amount
                })
            });

            if (!response.ok) {
                throw new Error('결제 초기화 실패');
            }

            const data = await response.json();
            const { order_id, payment_link } = data; // Backend should return mostly the same structure

            // 2. Request Payment via Toss SDK
            // @ts-ignore
            const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);

            await tossPayments.requestPayment('카드', {
                amount: 1000,
                orderId: order_id,
                orderName: '테스트용 수강권 (1,000원)',
                customerName: formData.student_name,
                successUrl: `${window.location.origin}/pay/${payment_link.token}/success`,
                failUrl: `${window.location.origin}/pay/${payment_link.token}/fail`,
            });

        } catch (error) {
            console.error(error);
            alert('결제 진행 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-3" />
                    <h1 className="text-2xl font-bold">결제 테스트</h1>
                    <p className="text-blue-100 text-sm mt-1">심사용 테스트 결제 페이지입니다.</p>
                </div>

                {/* 심사 필수 정보 (가이드 6페이지 준수) */}
                <div className="bg-gray-100 p-4 border-b border-gray-200 text-sm text-gray-600 space-y-1">
                    <p><span className="font-bold w-24 inline-block">(1) 상호명</span> : 주식회사 스터디엠</p>
                    <p><span className="font-bold w-24 inline-block">(2) 사업자번호</span> : 682-88-03603</p>
                    <p><span className="font-bold w-24 inline-block">(3) URL</span> : https://studym.co.kr</p>
                    <p><span className="font-bold w-24 inline-block">(4) Test ID</span> : (비회원 결제)</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-blue-100 p-2">
                            <img src="/images/studym-logo.png" alt="상품 이미지" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-900 font-bold">테스트 수강권</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">토스페이먼츠 심사용 테스트 상품입니다.</div>
                            <div className="flex justify-between items-center">
                                <span className="text-blue-600 font-bold text-xl">1,000원</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.student_name}
                                onChange={e => setFormData({ ...formData, student_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.student_phone}
                                onChange={e => setFormData({ ...formData, student_phone: formatPhoneOnInput(e.target.value) })}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin h-5 w-5" />}
                        {loading ? '처리중...' : '1,000원 결제하기'}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                        * 실제 결제가 이루어지며, 승인 후 자동 취소되지 않습니다.<br />
                        (테스트 후 관리자가 취소 가능합니다)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentTestPage;
