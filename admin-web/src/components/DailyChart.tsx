import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyChartProps {
    data: Array<{
        date: string;
        hours: number;
    }>;
}

const DailyChart: React.FC<DailyChartProps> = ({ data }) => {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                    />
                    <YAxis label={{ value: '시간 (h)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                        labelFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                        }}
                        formatter={(value: number) => [`${value}시간`, '학습 시간']}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="hours"
                        name="학습 시간"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyChart;
