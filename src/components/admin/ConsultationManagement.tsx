import React, { useState, useEffect } from 'react';
import { Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConsultationData {
    id: string;
    student_name: string;
    student_school: string;
    student_grade: string;
    parent_name: string;
    parent_phone: string;
    consultation_date: string;
    target_university?: string;
    weak_subject?: string;
    preferred_branch?: string;
    status: string;
    created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://study-manager-production-826b.up.railway.app';
const ADMIN_PASSWORD = 'studym2025';

const SAMPLE_DATA: ConsultationData[] = [
    {
        id: '1',
        student_name: '김철수',
        student_school: '서울고등학교',
        student_grade: '고2',
        parent_name: '김부모',
        parent_phone: '010-1234-5678',
        consultation_date: '2024-01-15T10:00:00',
        target_university: '서울대학교',
        weak_subject: '수학',
        status: 'PENDING',
        created_at: '2024-01-10T09:00:00'
    },
    {
        id: '2',
        student_name: '이영희',
        student_school: '경기여자고등학교',
        student_grade: '고3',
        parent_name: '이모친',
        parent_phone: '010-9876-5432',
        consultation_date: '2024-01-16T14:00:00',
        target_university: '연세대학교',
        weak_subject: '영어',
        status: 'CONTACTED',
        created_at: '2024-01-09T15:30:00'
    },
    {
        id: '3',
        student_name: '박지성',
        student_school: '수원고등학교',
        student_grade: '고1',
        parent_name: '박부친',
        parent_phone: '010-5555-5555',
        consultation_date: '2024-01-20T11:00:00',
        target_university: '고려대학교',
        weak_subject: '국어',
        status: 'COMPLETED',
        created_at: '2024-01-08T10:00:00'
    }
];

const ConsultationManagement: React.FC = () => {
    const [consultations, setConsultations] = useState<ConsultationData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // 데이터 불러오기
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/consultations/?admin_password=${ADMIN_PASSWORD}`);
            if (res.ok) {
                const data = await res.json();
                const consultationArray = Array.isArray(data) ? data : (data.results || []);
                setConsultations(consultationArray.length > 0 ? consultationArray : SAMPLE_DATA);
            } else {
                console.log('Backend fetch failed, using sample data');
                setConsultations(SAMPLE_DATA);
            }
        } catch (error) {
            console.error('Failed to fetch consultations, using sample data:', error);
            setConsultations(SAMPLE_DATA);
            // toast.error('데이터 조회 실패');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 상태 변경 요청
    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/consultations/${id}/?admin_password=${ADMIN_PASSWORD}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('API Error');

            setConsultations(prev => prev.map(item =>
                String(item.id) === id ? { ...item, status: newStatus } : item
            ));

            const statusLabel = newStatus === 'PENDING' ? '대기중' : newStatus === 'CONTACTED' ? '연락완료' : '상담완료';
            toast.success(`상태가 '${statusLabel}'로 변경되었습니다.`);
        } catch (error) {
            toast.error('상태 변경 실패');
        }
    };

    // 선택 삭제 요청
    const deleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`선택한 ${selectedIds.size}건을 삭제하시겠습니까?`)) return;

        try {
            const deletePromises = Array.from(selectedIds).map(id =>
                fetch(`${API_BASE_URL}/api/consultations/${id}/?admin_password=${ADMIN_PASSWORD}`, {
                    method: 'DELETE'
                })
            );

            await Promise.all(deletePromises);

            setConsultations(prev => prev.filter(item => !selectedIds.has(String(item.id))));
            setSelectedIds(new Set());
            toast.success('삭제되었습니다.');
        } catch (error) {
            toast.error('삭제 실패');
        }
    };

    // 필터링
    const filteredConsultations = consultations.filter(item => {
        const matchesSearch =
            item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.student_school.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 엑셀 다운로드
    const exportToExcel = () => {
        const dataToExport = selectedIds.size > 0
            ? filteredConsultations.filter(item => selectedIds.has(String(item.id)))
            : filteredConsultations;

        if (dataToExport.length === 0) {
            toast.error('다운로드할 데이터가 없습니다.');
            return;
        }

        const headers = ['등록일', '학생명', '학교', '학년', '학부모명', '연락처', '상담희망일', '목표대학', '취약과목', '상태'];
        const csvData = dataToExport.map(item => [
            new Date(item.created_at).toLocaleDateString(),
            item.student_name,
            item.student_school,
            item.student_grade,
            item.parent_name,
            item.parent_phone,
            new Date(item.consultation_date).toLocaleDateString(),
            item.target_university || '',
            item.weak_subject || '',
            item.status === 'PENDING' ? '대기중' : item.status === 'CONTACTED' ? '연락완료' : '상담완료'
        ]);

        const BOM = '\uFEFF';
        const csvContent = BOM + [headers, ...csvData].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `상담신청_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // 선택 로직
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredConsultations.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredConsultations.map(item => String(item.id))));
    };

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* 검색 및 필터 */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="search"
                        placeholder="학생/학부모 이름, 학교 검색..."
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">전체 상태</option>
                        <option value="PENDING">대기중</option>
                        <option value="CONTACTED">연락완료</option>
                        <option value="COMPLETED">상담완료</option>
                    </select>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="text-sm text-slate-600">
                        총 {filteredConsultations.length}건
                        {selectedIds.size > 0 && (
                            <span className="ml-2 text-blue-600 font-bold">| {selectedIds.size}건 선택됨</span>
                        )}
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            엑셀 다운로드
                        </button>
                        <button
                            onClick={deleteSelected}
                            disabled={selectedIds.size === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            선택 삭제
                        </button>
                    </div>
                </div>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-10 text-center text-slate-500">로딩 중...</div>
                ) : filteredConsultations.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">상담 신청이 없습니다.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="px-4 py-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === filteredConsultations.length && filteredConsultations.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold">날짜</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">학생</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">학교/학년</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">학부모</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">연락처</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">상담일</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredConsultations.map((item) => (
                                <tr key={item.id} className={`hover:bg-slate-50 ${selectedIds.has(String(item.id)) ? 'bg-blue-50' : ''}`}>
                                    <td className="px-4 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(String(item.id))}
                                            onChange={() => toggleSelect(String(item.id))}
                                            className="w-4 h-4 rounded cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{item.student_name}</div>
                                        {item.target_university && (
                                            <div className="text-xs text-slate-500">목표: {item.target_university}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {item.student_school}
                                        <span className="ml-2 px-2 py-1 bg-slate-100 rounded text-xs">
                                            {item.student_grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{item.parent_name}</td>
                                    <td className="px-6 py-4 text-sm font-mono">{item.parent_phone}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(item.consultation_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={item.status}
                                            onChange={(e) => updateStatus(String(item.id), e.target.value)}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${item.status === 'PENDING' ? 'bg-yellow-400 text-white' :
                                                item.status === 'CONTACTED' ? 'bg-blue-500 text-white' :
                                                    'bg-green-500 text-white'
                                                }`}
                                        >
                                            <option value="PENDING" className="bg-white text-black">대기중</option>
                                            <option value="CONTACTED" className="bg-white text-black">연락완료</option>
                                            <option value="COMPLETED" className="bg-white text-black">상담완료</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ConsultationManagement;
