import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import DailyChart from '../components/DailyChart';
import WeeklyChart from '../components/WeeklyChart';
import { ArrowLeft, TrendingUp } from 'lucide-react';

const StatisticsPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: dailyData, isLoading: dailyLoading } = useQuery({
        queryKey: ['statistics', 'daily'],
        queryFn: async () => {
            const response = await client.get('/statistics/daily');
            return response.data;
        },
    });

    const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
        queryKey: ['statistics', 'weekly'],
        queryFn: async () => {
            const response = await client.get('/statistics/weekly');
            return response.data;
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            대시보드로 돌아가기
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl p-6">
                <div className="mb-6 flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold">학습 통계</h1>
                </div>

                {/* Daily Stats */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">일별 학습 시간 (최근 7일)</h2>
                    {dailyLoading ? (
                        <div className="flex h-80 items-center justify-center">
                            <div className="text-gray-500">로딩 중...</div>
                        </div>
                    ) : (
                        <DailyChart data={dailyData || []} />
                    )}
                </div>

                {/* Weekly Stats */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">주별 학습 시간 (최근 4주)</h2>
                    {weeklyLoading ? (
                        <div className="flex h-80 items-center justify-center">
                            <div className="text-gray-500">로딩 중...</div>
                        </div>
                    ) : (
                        <WeeklyChart data={weeklyData || []} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default StatisticsPage;
