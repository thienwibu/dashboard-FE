import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const ScoreTrendChart = ({ data = [], onPointClick }) => {
  // Mock data for 6 months/semesters
  const chartData = data.length > 0 ? data : [
    { period: 'T7/2024', score: 7.5 },
    { period: 'T8/2024', score: 7.6 },
    { period: 'T9/2024', score: 7.7 },
    { period: 'T10/2024', score: 7.8 },
    { period: 'T11/2024', score: 7.9 },
    { period: 'T12/2024', score: 8.0 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm text-blue-600">
            Điểm TB: <span className="font-semibold">{payload[0].value.toFixed(1)}/10</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const avgScore = chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length;
  const trend = chartData[chartData.length - 1]?.score - chartData[0]?.score || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Xu hướng điểm trung bình theo thời gian</h3>
          <p className="text-sm text-gray-600">Trung bình ngành theo tháng/kỳ</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-600">Điểm TB: </span>
            <span className="font-bold text-blue-600">{avgScore.toFixed(1)}/10</span>
          </div>
          <div className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="font-semibold">{trend >= 0 ? '+' : ''}{trend.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              domain={[0, 10]}
              label={{ value: 'Điểm TB', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              name="Điểm TB ngành"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6' }}
              activeDot={{ r: 7, onClick: () => onPointClick?.() }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreTrendChart;

