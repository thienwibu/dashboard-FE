import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ComparisonChart = ({ currentData = [], previousData = [] }) => {
  // Merge data for comparison
  const comparisonData = [
    {
      name: 'Tuần 1',
      hiệnTại: 75,
      kỳTrước: 72,
      thayĐổi: '+3.0%'
    },
    {
      name: 'Tuần 2',
      hiệnTại: 76,
      kỳTrước: 73,
      thayĐổi: '+3.0%'
    },
    {
      name: 'Tuần 3',
      hiệnTại: 77,
      kỳTrước: 74,
      thayĐổi: '+3.0%'
    },
    {
      name: 'Tuần 4',
      hiệnTại: 78,
      kỳTrước: 75,
      thayĐổi: '+3.0%'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const current = payload.find(p => p.dataKey === 'hiệnTại')?.value || 0;
      const previous = payload.find(p => p.dataKey === 'kỳTrước')?.value || 0;
      const change = ((current - previous) / previous * 100).toFixed(1);
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-blue-600 mb-1">
            Hiện tại: <span className="font-semibold">{current}%</span>
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Kỳ trước: <span className="font-semibold">{previous}%</span>
          </p>
          <p className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Thay đổi: {change > 0 ? '+' : ''}{change}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">So Sánh Hiệu Suất</h3>
          <p className="text-sm text-gray-600">Kỳ này vs Kỳ trước</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-gray-600">Kỳ hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-400"></div>
            <span className="text-gray-600">Kỳ trước</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={{ value: '% Hoàn thành', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="hiệnTại" 
              name="Kỳ hiện tại"
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="kỳTrước" 
              name="Kỳ trước"
              fill="#9ca3af" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">TB kỳ hiện tại</p>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(comparisonData.reduce((sum, d) => sum + d.hiệnTại, 0) / comparisonData.length)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">TB kỳ trước</p>
          <p className="text-2xl font-bold text-gray-600">
            {Math.round(comparisonData.reduce((sum, d) => sum + d.kỳTrước, 0) / comparisonData.length)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Cải thiện</p>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-2xl font-bold text-green-600">+3.0%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;

