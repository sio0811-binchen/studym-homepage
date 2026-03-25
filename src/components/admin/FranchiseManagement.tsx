import React, { useState, useEffect } from 'react';
import { Download, Trash2, Eye, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface FranchiseData {
    id: string;
    applicant_name: string;
    phone: string;
    email?: string;
    region: string;
    budget: string;
    has_property: boolean;
    status: string;
    lead_grade: string;
    created_at: string;
    memo?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://studym-homepage-production-a3c2.up.railway.app';
const ADMIN_PASSWORD = 'studym001!';

const SAMPLE_DATA: FranchiseData[] = []; // 샘플 데이터 제거됨

// 상세보기 모달 컴포넌트
const DetailModal: React.FC<{
    item: FranchiseData;
    onClose: () => void;
    onSave: (id: string, updates: Partial<FranchiseData>) => void;
}> = ({ item, onClose, onSave }) => {
    const [leadGrade, setLeadGrade] = useState(item.lead_grade);
    const [status, setStatus] = useState(item.status);
    const [memo, setMemo] = useState(item.memo || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(item.id, { lead_grade: leadGrade, status, memo });
            toast.success('저장되었습니다.');
            onClose();
        } catch {
            toast.error('저장 실패');
        } finally {
            setIsSaving(false);
        }
    };

    const getLeadGradeColor = (grade: string) => {
        switch (grade) {
            case 'HOT': return 'bg-red-500 text-white';
            case 'WARM': return 'bg-orange-400 text-white';
            case 'COLD': return 'bg-slate-400 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">가맹점 문의 상세</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="p-6 space-y-6">
                    {/* 신청자 정보 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-500">신청자명</label>
                            <p className="font-bold text-lg">{item.applicant_name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">연락처</label>
                            <p className="font-mono">{item.phone}</p>
                        </div>
                        {item.email && (
                            <div>
                                <label className="text-sm text-slate-500">이메일</label>
                                <p>{item.email}</p>
                            </div>
                        )}
                        <div>
                            <label className="text-sm text-slate-500">희망 지역</label>
                            <p>{item.region}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">예산</label>
                            <p className="font-bold">{item.budget}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">점포 보유</label>
                            <p>{item.has_property ? '예' : '아니오'}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">문의일</label>
                            <p>{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* 구분선 */}
                    <hr className="border-slate-200" />

                    {/* 리드 등급 변경 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">리드 등급</label>
                        <div className="flex gap-2">
                            {[
                                { value: 'HOT', label: 'HOT' },
                                { value: 'WARM', label: 'WARM' },
                                { value: 'COLD', label: 'COLD' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setLeadGrade(opt.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${leadGrade === opt.value
                                        ? getLeadGradeColor(opt.value)
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 상태 변경 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">진행 상태</label>
                        <div className="flex gap-2">
                            {[
                                { value: 'NEW', label: '신규' },
                                { value: 'CONTACTED', label: '연락완료' },
                                { value: 'CONTRACTED', label: '계약완료' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setStatus(opt.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${status === opt.value
                                        ? 'bg-purple-500 text-white'
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
                            className="w-full p-4 border border-slate-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
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
                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? '저장중...' : '저장'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FranchiseManagement: React.FC = () => {
    const [franchises, setFranchises] = useState<FranchiseData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [detailItem, setDetailItem] = useState<FranchiseData | null>(null);

    // 데이터 불러오기
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/franchise-inquiries/?admin_secret=${ADMIN_PASSWORD}`);
            if (res.ok) {
                const data = await res.json();
                const franchiseArray = Array.isArray(data) ? data : (data.results || []);
                setFranchises(franchiseArray.length > 0 ? franchiseArray : SAMPLE_DATA);
            } else {
                console.log('Franchise API fetch failed, using sample data');
                setFranchises(SAMPLE_DATA);
            }
        } catch (error) {
            console.error('Failed to fetch franchises, using sample data:', error);
            setFranchises(SAMPLE_DATA);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 상태/메모 저장
    const saveFranchise = async (id: string, updates: Partial<FranchiseData>) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/franchise-inquiries/${id}/?admin_secret=${ADMIN_PASSWORD}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!res.ok) throw new Error('API Error');

            setFranchises(prev => prev.map(item =>
                String(item.id) === id ? { ...item, ...updates } : item
            ));
        } catch (error) {
            // 로컬 상태만 업데이트 (백엔드 실패 시에도 UI 반영)
            setFranchises(prev => prev.map(item =>
                String(item.id) === id ? { ...item, ...updates } : item
            ));
            console.log('Backend update failed, updated locally');
        }
    };

    // 선택 삭제 요청
    const deleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`선택한 ${selectedIds.size}건을 삭제하시겠습니까?`)) return;

        try {
            const deletePromises = Array.from(selectedIds).map(id =>
                fetch(`${API_BASE_URL}/api/franchise-inquiries/${id}/?admin_secret=${ADMIN_PASSWORD}`, {
                    method: 'DELETE'
                })
            );

            await Promise.all(deletePromises);

            setFranchises(prev => prev.filter(item => !selectedIds.has(String(item.id))));
            setSelectedIds(new Set());
            toast.success('삭제되었습니다.');
        } catch {
            toast.error('삭제 실패');
        }
    };

    // 필터링
    const filteredFranchises = franchises.filter(item => {
        const matchesSearch =
            item.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.region.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.lead_grade === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 엑셀 다운로드
    const exportToExcel = () => {
        const dataToExport = selectedIds.size > 0
            ? filteredFranchises.filter(item => selectedIds.has(String(item.id)))
            : filteredFranchises;

        if (dataToExport.length === 0) {
            toast.error('다운로드할 데이터가 없습니다.');
            return;
        }

        const headers = ['등록일', '신청자명', '연락처', '이메일', '지역', '예산', '점포보유', '리드등급', '상태', '메모'];
        const csvData = dataToExport.map(item => [
            new Date(item.created_at).toLocaleDateString(),
            item.applicant_name,
            item.phone,
            item.email || '',
            item.region,
            item.budget,
            item.has_property ? '예' : '아니오',
            item.lead_grade,
            item.status === 'NEW' ? '신규' : item.status === 'CONTACTED' ? '연락완료' : '계약완료',
            item.memo || ''
        ]);

        const BOM = '\uFEFF';
        const csvContent = BOM + [headers, ...csvData].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `가맹점문의_${new Date().toISOString().slice(0, 10)}.csv`;
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
        if (selectedIds.size === filteredFranchises.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredFranchises.map(item => String(item.id))));
    };

    const getLeadGradeBadge = (grade: string) => {
        const styles: Record<string, string> = {
            HOT: 'bg-red-500 text-white',
            WARM: 'bg-orange-400 text-white',
            COLD: 'bg-slate-400 text-white'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[grade] || 'bg-gray-400 text-white'}`}>
                {grade}
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        const labels: Record<string, string> = {
            NEW: '신규',
            CONTACTED: '연락완료',
            CONTRACTED: '계약완료'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'NEW' ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'}`}>
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
                        placeholder="신청자 이름, 지역 검색..."
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">전체 등급</option>
                        <option value="HOT">HOT</option>
                        <option value="WARM">WARM</option>
                        <option value="COLD">COLD</option>
                    </select>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="text-sm text-slate-600">
                        총 {filteredFranchises.length}건
                        {selectedIds.size > 0 && (
                            <span className="ml-2 text-purple-600 font-bold">| {selectedIds.size}건 선택됨</span>
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
                ) : filteredFranchises.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">가맹점 문의가 없습니다.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="px-4 py-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === filteredFranchises.length && filteredFranchises.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold">날짜</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">신청자</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">연락처</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">지역</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">리드등급</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">상태</th>
                                <th className="px-6 py-4 text-center text-sm font-bold">상세</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredFranchises.map((item) => (
                                <tr key={item.id} className={`hover:bg-slate-50 ${selectedIds.has(String(item.id)) ? 'bg-purple-50' : ''}`}>
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
                                        <div className="font-bold text-slate-900">{item.applicant_name}</div>
                                        {item.memo && (
                                            <div className="text-xs text-purple-500 mt-1 truncate max-w-[150px]" title={item.memo}>
                                                📝 {item.memo}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono">{item.phone}</td>
                                    <td className="px-6 py-4 text-sm">{item.region}</td>
                                    <td className="px-6 py-4">
                                        {getLeadGradeBadge(item.lead_grade)}
                                    </td>
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
                    onSave={saveFranchise}
                />
            )}
        </div>
    );
};

export default FranchiseManagement;
