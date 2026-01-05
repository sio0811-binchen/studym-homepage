import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
    data: Array<{
        week: string;
        hours: number;
    }>;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis label={{ value: '시간 (h)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => [`${value}시간`, '학습 시간']} />
                    <Legend />
                    <Bar
                        dataKey="hours"
                        name="학습 시간"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyChart;
