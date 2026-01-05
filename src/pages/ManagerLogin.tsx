
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://study-manager-backend-production.up.railway.app/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('로그인 실패');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            navigate('/manager/dashboard');
        } catch (err) {
            setError('아이디 또는 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-brand-navy">관리자 로그인</h1>
                    <p className="text-slate-500 mt-2">Study M Admin</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">아이디</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-navy outline-none"
                            placeholder="username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-navy outline-none"
                            placeholder="password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManagerLogin;
