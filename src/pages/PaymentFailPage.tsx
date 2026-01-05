/**
 * Payment Fail Page - 결제 실패 후 리다이렉트되는 페이지
 */
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const errorCode = searchParams.get('code') || 'UNKNOWN';
    const errorMessage = searchParams.get('message') || '결제가 실패했습니다.';

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">결제 실패</h1>
                <p className="text-gray-600 mb-2">{errorMessage}</p>
                <p className="text-sm text-gray-400 mb-8">오류 코드: {errorCode}</p>

                <div className="space-y-3">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
                    >
                        다시 시도
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailPage;
