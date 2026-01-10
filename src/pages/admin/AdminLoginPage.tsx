import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 이미 인증된 경우 대시보드로 이동
    useEffect(() => {
        if (localStorage.getItem('adminAuthenticated') === 'true') {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 비밀번호 인증
        if (password === 'studym001!') {
            localStorage.setItem('adminAuthenticated', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">StudyM</h2>
                        <p className="mt-2 text-blue-100">관리자 전용</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                                    관리자 비밀번호
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="비밀번호를 입력하세요"
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                <LogIn className="w-5 h-5" />
                                로그인
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <a
                                href="/"
                                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                ← 홈페이지로 돌아가기
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
