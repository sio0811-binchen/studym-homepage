import React from 'react';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
    subjects: string[];
    selectedSubject: string;
    selectedStatus: string;
    searchQuery: string;
    onSubjectChange: (subject: string) => void;
    onStatusChange: (status: string) => void;
    onSearchChange: (query: string) => void;
    onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    subjects,
    selectedSubject,
    selectedStatus,
    searchQuery,
    onSubjectChange,
    onStatusChange,
    onSearchChange,
    onReset,
}) => {
    const statusOptions = [
        { value: 'all', label: '전체' },
        { value: 'studying', label: '공부 중' },
        { value: 'drowsy', label: '졸음 감지' },
        { value: 'completed', label: '종료' },
        { value: 'offline', label: '오프라인' },
    ];

    return (
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">필터</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Search by name */}
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="이름 검색..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Filter by subject */}
                <div>
                    <select
                        value={selectedSubject}
                        onChange={(e) => onSubjectChange(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">모든 과목</option>
                        {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filter by status */}
                <div>
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset button */}
                <div>
                    <button
                        onClick={onReset}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        초기화
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
