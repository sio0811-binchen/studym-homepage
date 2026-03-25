import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../api/dashboard';
import { Users, BookOpen, AlertTriangle, LogOut, Clock, X, CreditCard, Building } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationToast from '../components/NotificationToast';
import FilterBar from '../components/FilterBar';
import PaymentManagement from '../components/PaymentManagement';
import ConsultationManagement from '../components/ConsultationManagement';
import FranchiseManagement from '../components/FranchiseManagement';
import { Toaster } from 'react-hot-toast';

interface Student {
    userId: string;
    name: string;
    currentSubject?: string | null;
    status: string;
    startTime?: string | null;
    todayTotalMinutes: number;
}

type TabType = 'students' | 'consultations' | 'franchise' | 'payments';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<TabType>('consultations'); // 기본값을 상담으로 변경 (유저 업무 중심)
    const { alerts, clearAlert } = useNotifications();

    // Filter states
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    React.useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
        }
    }, [navigate]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData,
        refetchInterval: 5000,
    });

    // Extract data (even if loading/error, we need to call hooks in same order)
    const { stats, students } = data || { stats: null, students: [] };

    // Get unique subjects - must be before early returns
    const subjects = useMemo(() => {
        const subjectSet = new Set<string>();
        students.forEach((student: Student) => {
            if (student.currentSubject) {
                subjectSet.add(student.currentSubject);
            }
        });
        return Array.from(subjectSet).sort();
    }, [students]);

    // Filter students - must be before early returns
    const filteredStudents = useMemo(() => {
        return students.filter((student: Student) => {
            if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (selectedSubject !== 'all' && student.currentSubject !== selectedSubject) {
                return false;
            }
            if (selectedStatus !== 'all' && student.status !== selectedStatus) {
                return false;
            }
            return true;
        });
    }, [students, searchQuery, selectedSubject, selectedStatus]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const handleResetFilters = () => {
        setSelectedSubject('all');
        setSelectedStatus('all');
        setSearchQuery('');
    };

    // Calculate elapsed time
    const getElapsedTime = (startTime: string | null) => {
        if (!startTime) return '';
        const start = new Date(startTime);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
        const hours = Math.floor(elapsed / 60);
        const mins = elapsed % 60;
        return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">스터디 매니저 관리자</h1>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                                관리자 모드
                            </div>
                            <button onClick={handleLogout} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700">
                                <LogOut className="inline h-4 w-4 mr-2" />
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Tab Navigation */}
            <div className="bg-white border-b">
                <div className="mx-auto max-w-7xl px-4">
                    <nav className="flex gap-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('consultations')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'consultations'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Users className="inline h-4 w-4 mr-2" />
                            상담 신청
                        </button>
                        <button
                            onClick={() => setActiveTab('franchise')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'franchise'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Building className="inline h-4 w-4 mr-2" />
                            가맹점 문의
                        </button>
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'students'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <BookOpen className="inline h-4 w-4 mr-2" />
                            학생 현황
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'payments'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <CreditCard className="inline h-4 w-4 mr-2" />
                            결제 관리
                        </button>
                    </nav>
                </div>
            </div>

            <main className="mx-auto max-w-7xl p-6">
                {activeTab === 'consultations' && <ConsultationManagement />}
                {activeTab === 'franchise' && <FranchiseManagement />}
                {activeTab === 'students' && (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">실시간 학생 현황</h2>
                            <button
                                onClick={() => navigate('/statistics')}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                📊 통계 보기
                            </button>
                        </div>

                        {/* Filter Bar */}
                        <FilterBar
                            subjects={subjects}
                            selectedSubject={selectedSubject}
                            selectedStatus={selectedStatus}
                            searchQuery={searchQuery}
                            onSubjectChange={setSelectedSubject}
                            onStatusChange={setSelectedStatus}
                            onSearchChange={setSearchQuery}
                            onReset={handleResetFilters}
                        />

                        {/* Loading/Error States */}
                        {isLoading && (
                            <div className="flex items-center justify-center p-8">
                                <div className="text-lg">로딩 중...</div>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-lg bg-red-50 p-6">
                                <p className="text-red-600">오류: {(error as Error).message}</p>
                            </div>
                        )}

                        {!isLoading && !error && (
                            <>
                                {/* Stats Bar with animations */}
                                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="transform rounded-lg bg-white p-6 shadow transition-transform hover:scale-105">
                                        <div className="flex items-center">
                                            <Users className="h-10 w-10 text-blue-500" />
                                            <div className="ml-4">
                                                <p className="text-sm text-gray-500">총 학생 수</p>
                                                <p className="text-3xl font-bold text-gray-900">{stats?.totalStudents || 0}명</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="transform rounded-lg bg-white p-6 shadow transition-transform hover:scale-105">
                                        <div className="flex items-center">
                                            <BookOpen className="h-10 w-10 text-green-500 animate-pulse" />
                                            <div className="ml-4">
                                                <p className="text-sm text-gray-500">현재 열공 중</p>
                                                <p className="text-3xl font-bold text-green-600">{stats?.studyingNow || 0}명</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="transform rounded-lg bg-white p-6 shadow transition-transform hover:scale-105">
                                        <div className="flex items-center">
                                            <AlertTriangle className={`h-10 w-10 text-red-500 ${stats?.drowsinessDetected ? 'animate-bounce' : ''}`} />
                                            <div className="ml-4">
                                                <p className="text-sm text-gray-500">졸음 감지</p>
                                                <p className="text-3xl font-bold text-red-600">{stats?.drowsinessDetected || 0}명</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Cards */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredStudents.map((student: Student) => {
                                        const isStudying = student.status === 'studying';
                                        const isDrowsy = student.status === 'drowsy';

                                        let cardClasses = 'rounded-lg border-2 bg-white p-4 shadow-lg transition-all hover:shadow-xl cursor-pointer ';
                                        let badgeClasses = 'rounded-full px-3 py-1 text-xs font-semibold ';
                                        let statusText = '오프라인';

                                        if (isDrowsy) {
                                            cardClasses += 'border-red-400 animate-pulse';
                                            badgeClasses += 'bg-red-100 text-red-800 animate-bounce';
                                            statusText = '⚠️ 졸음 감지';
                                        } else if (isStudying) {
                                            cardClasses += 'border-green-400 shadow-green-200';
                                            badgeClasses += 'bg-green-100 text-green-800';
                                            statusText = '✨ 공부 중';
                                        } else if (student.status === 'completed') {
                                            cardClasses += 'border-gray-200';
                                            badgeClasses += 'bg-gray-100 text-gray-800';
                                            statusText = '✅ 종료';
                                        } else {
                                            cardClasses += 'border-gray-200';
                                            badgeClasses += 'bg-gray-100 text-gray-500';
                                            statusText = '💤 오프라인';
                                        }

                                        return (
                                            <div
                                                key={student.userId}
                                                className={cardClasses}
                                                onClick={() => setSelectedStudent(student)}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                                                    <span className={badgeClasses}>{statusText}</span>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600">
                                                    {student.currentSubject && (
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-blue-500" />
                                                            <span className="font-semibold">과목:</span>
                                                            <span className="text-gray-900">{student.currentSubject}</span>
                                                        </div>
                                                    )}

                                                    {isStudying && student.startTime && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-green-500 animate-pulse" />
                                                            <span className="font-semibold">경과:</span>
                                                            <span className="text-green-700 font-bold">{getElapsedTime(student.startTime)}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-purple-500" />
                                                        <span className="font-semibold">오늘 누적:</span>
                                                        <span className="text-gray-900">{student.todayTotalMinutes}분</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'payments' && (
                    <PaymentManagement />
                )}
            </main>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{selectedStudent.name} 상세 정보</h2>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="rounded-full p-2 hover:bg-gray-100"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-2 font-semibold text-gray-700">현재 상태</h3>
                                <p className="text-lg">
                                    {selectedStudent.status === 'studying' && '✨ 공부 중'}
                                    {selectedStudent.status === 'completed' && '✅ 종료'}
                                    {selectedStudent.status === 'drowsy' && '⚠️ 졸음 감지'}
                                    {selectedStudent.status === 'offline' && '💤 오프라인'}
                                </p>
                            </div>

                            {selectedStudent.currentSubject && (
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <h3 className="mb-2 font-semibold text-gray-700">현재 과목</h3>
                                    <p className="text-lg font-bold text-blue-900">{selectedStudent.currentSubject}</p>
                                </div>
                            )}

                            {selectedStudent.status === 'studying' && selectedStudent.startTime && (
                                <div className="rounded-lg bg-green-50 p-4">
                                    <h3 className="mb-2 font-semibold text-gray-700">경과 시간</h3>
                                    <p className="text-2xl font-bold text-green-700">{getElapsedTime(selectedStudent.startTime)}</p>
                                </div>
                            )}

                            <div className="rounded-lg bg-purple-50 p-4">
                                <h3 className="mb-2 font-semibold text-gray-700">오늘 누적 시간</h3>
                                <p className="text-2xl font-bold text-purple-700">{selectedStudent.todayTotalMinutes}분</p>
                            </div>

                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="w-full rounded-lg bg-gray-800 py-3 text-white hover:bg-gray-900"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toasts */}
            <div className="fixed bottom-4 right-4 z-50 space-y-4">
                {alerts.map((alert, index) => (
                    <NotificationToast
                        key={index}
                        studentName={alert.studentName}
                        onClose={() => clearAlert(index)}
                    />
                ))}
            </div>
            <Toaster position="top-right" />
        </div>
    );
};

export default DashboardPage;
