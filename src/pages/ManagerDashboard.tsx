import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AlertCard from '../components/admin/AlertCard';
import InquiryKanban from '../components/admin/InquiryKanban';
import FinancialKPI from '../components/admin/FinancialKPI';
import {
    mockAlertStudents,
    mockInquiries,
    mockFinancialMetrics,
    type Inquiry
} from '../utils/mockData';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/manager');
            return;
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/manager');
    };

    const handleNotifyParent = (studentId: string) => {
        toast.success('학부모님께 알림을 발송했습니다.', {
            style: { background: '#10b981', color: '#fff' },
        });
        console.log('Notify parent for student:', studentId);
    };

    const handleWakeStudent = (studentId: string) => {
        toast.success('학생에게 알림을 전송했습니다.', {
            style: { background: '#F59E0B', color: '#fff' },
        });
        console.log('Wake student:', studentId);
    };

    const handleStatusChange = (inquiryId: string, newStatus: Inquiry['status']) => {
        setInquiries(prev =>
            prev.map(inq =>
                inq.id === inquiryId ? { ...inq, status: newStatus } : inq
            )
        );
        toast.success('상담 신청 상태가 변경되었습니다.', {
            style: { background: '#3b82f6', color: '#fff' },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-brand-navy to-slate-800 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-bold">PE Admin Dashboard</h1>
                    <p className="text-xs text-slate-300 mt-1">Management by Exception</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-brand-gold transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                    <LogOut className="w-5 h-5" />
                    로그아웃
                </button>
            </nav>

            {/* Main Dashboard - 3-Zone Layout */}
            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Zone A: Alert Dashboard (Left - 40%) */}
                    <div className="lg:col-span-5">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-brand-navy mb-2">
                                Alert Dashboard
                            </h2>
                            <p className="text-sm text-slate-600">
                                개입이 필요한 학생만 표시 (Management by Exception)
                            </p>
                        </div>

                        <div className="space-y-4">
                            {mockAlertStudents.map(student => (
                                <AlertCard
                                    key={student.id}
                                    student={student}
                                    onNotifyParent={handleNotifyParent}
                                    onWakeStudent={handleWakeStudent}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Zone B: Inquiry Kanban (Center - 45%) */}
                    <div className="lg:col-span-5">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-brand-navy mb-2">
                                Inquiry Pipeline
                            </h2>
                            <p className="text-sm text-slate-600">
                                상담 신청 전환 관리 (Drag & Drop)
                            </p>
                        </div>

                        <InquiryKanban
                            inquiries={inquiries}
                            onStatusChange={handleStatusChange}
                        />
                    </div>

                    {/* Zone C: Financial KPI (Right - 15%) */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-brand-navy mb-2">
                                Financial KPI
                            </h2>
                            <p className="text-xs text-slate-600">
                                경영 지표
                            </p>
                        </div>

                        <FinancialKPI metrics={mockFinancialMetrics} />
                    </div>
                </div>
            </main>

            <Toaster position="top-right" />
        </div>
    );
};

export default ManagerDashboard;
