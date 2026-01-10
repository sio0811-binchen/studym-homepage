import React, { useState, useEffect } from 'react';

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
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://studym-homepage-production-a3c2.up.railway.app';
const ADMIN_PASSWORD = 'studym001!';

const SAMPLE_DATA: FranchiseData[] = [
    {
        id: '1',
        applicant_name: '홍길동',
        phone: '010-1111-2222',
        email: 'hong@example.com',
        region: '서울 강남구',
        budget: '1억 이상',
        has_property: false,
        status: 'NEW',
        lead_grade: 'HOT',
        created_at: '2024-01-14T10:00:00'
    },
    {
        id: '2',
        applicant_name: '장보고',
        phone: '010-3333-4444',
        region: '부산 해운대구',
        budget: '5천만원 ~ 1억',
        has_property: true,
        status: 'CONTACTED',
        lead_grade: 'WARM',
        created_at: '2024-01-12T14:30:00'
    }
];

const FranchiseManagement: React.FC = () => {
    const [franchises, setFranchises] = useState<FranchiseData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/franchise-inquiries/?admin_password=${ADMIN_PASSWORD}`);
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
            // toast.error('서버 연결 오류');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredFranchises = franchises.filter(item => {
        const matchesSearch =
            item.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.region.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.lead_grade === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* 필터 */}
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
                                <th className="px-6 py-4 text-left text-sm font-bold">날짜</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">신청자</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">연락처</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">지역</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">예산</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">리드등급</th>
                                <th className="px-6 py-4 text-left text-sm font-bold">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredFranchises.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{item.applicant_name}</div>
                                        {item.email && (
                                            <div className="text-xs text-slate-500">{item.email}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono">{item.phone}</td>
                                    <td className="px-6 py-4 text-sm">{item.region}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                        {item.budget}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${item.lead_grade === 'HOT' ? 'bg-red-500 text-white' :
                                            item.lead_grade === 'WARM' ? 'bg-orange-400 text-white' :
                                                'bg-slate-400 text-white'
                                            }`}>
                                            {item.lead_grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${item.status === 'NEW' ? 'bg-purple-500 text-white' :
                                            'bg-green-500 text-white'
                                            }`}>
                                            {item.status === 'NEW' ? '신규' : '완료'}
                                        </span>
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

export default FranchiseManagement;
