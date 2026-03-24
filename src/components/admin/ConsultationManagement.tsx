import React, { useState, useEffect } from 'react';
import { Download, Trash2, Eye, X, Save } from 'lucide-react';
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
    memo?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || ''; // 상대 경로 사용 (Vite Proxy 또는 배포 환경 따름)
const ADMIN_PASSWORD = 'studym001!';

const SAMPLE_DATA: ConsultationData[] = []; // 샘플 데이터 제거됨

// 상세보기 모달 컴포넌트
const DetailModal: React.FC<{
    item: ConsultationData;
    onClose: () => void;
    onSave: (id: string, updates: Partial<ConsultationData>) => void;
}> = ({ item, onClose, onSave }) => {
    const [status, setStatus] = useState(item.status);
    const [memo, setMemo] = useState(item.memo || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(item.id, { status, memo });
            toast.success('저장되었습니다.');
            onClose();
        } catch {
            toast.error('저장 실패');
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'PENDING': return 'bg-yellow-400 text-white';
            case 'CONTACTED': return 'bg-blue-500 text-white';
            case 'COMPLETED': return 'bg-green-500 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">상담 상세 정보</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="p-6 space-y-6">
                    {/* 학생 정보 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-500">학생명</label>
                            <p className="font-bold text-lg">{item.student_name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">연락처</label>
                            <p className="font-mono">{item.parent_phone}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">학교</label>
                            <p>{item.student_school}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">학년</label>
                            <p>{item.student_grade}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">학부모명</label>
                            <p>{item.parent_name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">상담 희망일</label>
                            <p className="font-medium text-slate-900">
                                {item.consultation_date ? new Date(item.consultation_date).toLocaleString() : '방문 일시 미지정 (전화 상담)'}
                            </p>
                        </div>
                        {item.target_university && (
                            <div>
                                <label className="text-sm text-slate-500">목표 대학</label>
                                <p>{item.target_university}</p>
                            </div>
                        )}
                        {item.weak_subject && (
                            <div>
                                <label className="text-sm text-slate-500">취약 과목</label>
                                <p>{item.weak_subject}</p>
                            </div>
                        )}
                    </div>

                    {/* 구분선 */}
                    <hr className="border-slate-200" />

                    {/* 상태 변경 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">상담 상태</label>
                        <div className="flex gap-2">
                            {[
                                { value: 'PENDING', label: '대기중' },
                                { value: 'CONTACTED', label: '연락완료' },
                                { value: 'COMPLETED', label: '상담완료' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setStatus(opt.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${status === opt.value
                                        ? getStatusColor(opt.value)
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 메모 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">상담 메모</label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="상담 내용을 입력하세요..."
                            rows={5}
                            className="w-full p-4 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>
                </div>

                {/* 푸터 */}
                <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 font-medium"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? '저장중...' : '저장'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConsultationManagement: React.FC = () => {
    const [consultations, setConsultations] = useState<ConsultationData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [detailItem, setDetailItem] = useState<ConsultationData | null>(null);

    // 데이터 불러오기
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/consultations/?admin_secret=${ADMIN_PASSWORD}`);
            if (res.ok) {
                const data = await res.json();
                const consultationArray = Array.isArray(data) ? data : (data.results || []);
                setConsultations(consultationArray.length > 0 ? consultationArray : SAMPLE_DATA);
            } else {
                console.log('Backend fetch failed, using sample data');
                setConsultations(SAMPLE_DATA);
            }
        } catch (error) {
            console.error('Failed to fetch consultations:', error);
            toast.error('데이터를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 상태/메모 저장
    const saveConsultation = async (id: string, updates: Partial<ConsultationData>) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/consultations/${id}/?admin_secret=${ADMIN_PASSWORD}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!res.ok) throw new Error('API Error');

            setConsultations(prev => prev.map(item =>
                String(item.id) === id ? { ...item, ...updates } : item
            ));
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('저장에 실패했습니다.');
            // Revert or re-fetch logic could be here, but for now just notify error.
        }
    };

    // 선택 삭제 요청
    const deleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`선택한 ${selectedIds.size}건을 삭제하시겠습니까?`)) return;

        try {
            const deletePromises = Array.from(selectedIds).map(id =>
                fetch(`${API_BASE_URL}/api/consultations/${id}/?admin_secret=${ADMIN_PASSWORD}`, {
                    method: 'DELETE'
                })
            );

            await Promise.all(deletePromises);

            setConsultations(prev => prev.filter(item => !selectedIds.has(String(item.id))));
            setSelectedIds(new Set());
            toast.success('삭제되었습니다.');
        } catch {
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

        const headers = ['등록일', '학생명', '학교', '학년', '학부모명', '연락처', '상담희망일', '목표대학', '취약과목', '상태', '메모'];
        const csvData = dataToExport.map(item => [
            new Date(item.created_at).toLocaleDateString(),
            item.student_name,
            item.student_school,
            item.student_grade,
            item.parent_name,
            item.parent_phone,
            item.consultation_date ? new Date(item.consultation_date).toLocaleString() : '전화 상담',
            item.target_university || '',
            item.weak_subject || '',
            item.status === 'PENDING' ? '대기중' : item.status === 'CONTACTED' ? '연락완료' : '상담완료',
            item.memo || ''
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

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-yellow-400 text-white',
            CONTACTED: 'bg-blue-500 text-white',
            COMPLETED: 'bg-green-500 text-white'
        };
        const labels: Record<string, string> = {
            PENDING: '대기중',
            CONTACTED: '연락완료',
            COMPLETED: '상담완료'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-400 text-white'}`}>
                {labels[status] || status}
            </span>
        );
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
                                <th className="px-6 py-4 text-left text-sm font-bold">연락처</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">상태</th>
                                <th className="px-6 py-4 text-center text-sm font-bold">상세</th>
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
                                        {item.memo && (
                                            <div className="text-xs text-blue-500 mt-1 truncate max-w-[150px]" title={item.memo}>
                                                📝 {item.memo}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {item.student_school}
                                        <span className="ml-2 px-2 py-1 bg-slate-100 rounded text-xs">
                                            {item.student_grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono">{item.parent_phone}</td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setDetailItem(item)}
                                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                            title="상세보기"
                                        >
                                            <Eye className="w-4 h-4 text-slate-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 상세보기 모달 */}
            {detailItem && (
                <DetailModal
                    item={detailItem}
                    onClose={() => setDetailItem(null)}
                    onSave={saveConsultation}
                />
            )}
        </div>
    );
};

export default ConsultationManagement;
