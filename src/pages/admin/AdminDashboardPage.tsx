import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building, CreditCard, LogOut, RefreshCw } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import ConsultationManagement from '../../components/admin/ConsultationManagement';
import FranchiseManagement from '../../components/admin/FranchiseManagement';
import PaymentManagement from '../../components/admin/PaymentManagement';

const queryClient = new QueryClient();

type TabType = 'consultations' | 'franchise' | 'payments';

const AdminDashboardContent: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('consultations');

    // 인증 체크
    useEffect(() => {
        if (localStorage.getItem('adminAuthenticated') !== 'true') {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        navigate('/admin');
    };

    const tabs = [
        { id: 'consultations' as TabType, label: '상담 신청', icon: Users, color: 'blue' },
        { id: 'franchise' as TabType, label: '가맹점 문의', icon: Building, color: 'purple' },
        { id: 'payments' as TabType, label: '결제 관리', icon: CreditCard, color: 'green' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold text-gray-900">
                                StudyM 관리자
                            </h1>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                Admin
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                title="새로고침"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-all ${isActive
                                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6">
                {activeTab === 'consultations' && <ConsultationManagement />}
                {activeTab === 'franchise' && <FranchiseManagement />}
                {activeTab === 'payments' && <PaymentManagement />}
            </main>

            <Toaster position="top-right" />
        </div>
    );
};

// QueryClient Provider로 감싸기
const AdminDashboardPage: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AdminDashboardContent />
        </QueryClientProvider>
    );
};

export default AdminDashboardPage;
