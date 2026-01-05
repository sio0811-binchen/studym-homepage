import { TrendingUp, DollarSign, Users } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { FinancialMetrics } from '../../utils/mockData';

interface FinancialKPIProps {
    metrics: FinancialMetrics;
}

const FinancialKPI = ({ metrics }: FinancialKPIProps) => {
    const formatCurrency = (value: number) => {
        return (value / 10000).toFixed(0) + '만원';
    };

    return (
        <div className="space-y-4">
            {/* Revenue Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">이번 달 매출</p>
                        <p className="text-3xl font-mono font-bold text-brand-navy">
                            {formatCurrency(metrics.revenue.current)}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">목표 대비</span>
                        <span className="font-bold text-blue-600">{metrics.revenue.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                            style={{ width: `${metrics.revenue.percentage}%` }}
                        />
                    </div>
                </div>

                <p className="text-xs text-slate-500">
                    목표: {formatCurrency(metrics.revenue.target)}
                </p>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">가동률</p>
                        <p className="text-3xl font-mono font-bold text-brand-navy">
                            {metrics.occupancyRate}%
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <Users className="w-6 h-6 text-green-600" />
                    </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600"
                        style={{ width: `${metrics.occupancyRate}%` }}
                    />
                </div>
            </div>

            {/* MoM Growth */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">전월 대비 성장률</p>
                        <p className="text-3xl font-mono font-bold text-green-600">
                            +{metrics.momGrowth}%
                        </p>
                    </div>
                    <div className="p-3 bg-brand-gold/10 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-brand-gold" />
                    </div>
                </div>

                {/* Sparkline */}
                <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.dailyRevenue}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 mt-2">일별 매출 추이</p>
            </div>
        </div>
    );
};

export default FinancialKPI;
