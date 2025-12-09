import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraduationCap } from 'lucide-react';

const ProgressByCourseChart = ({ data = [], onBarClick }) => {
  // Mock data nếu không có data
  const chartData = data.length > 0 ? data : [
    { name: 'Nhập môn lập trình', progress: 85 },
    { name: 'Kĩ thuật lập trình', progress: 78 },
    { name: 'Lập trình hướng đối tượng', progress: 82 },
    { name: 'CTDL&GT', progress: 73 }
  ];

  const getBarColor = (progress) => {
    if (progress >= 80) return '#22c55e'; // green
    if (progress >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Tiến độ TB: <span className="font-semibold">{data.progress}%</span>
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
          <h3 className="text-lg font-semibold text-gray-900">Tiến độ trung bình theo khóa học</h3>
          <p className="text-sm text-gray-600">So sánh giữa các khóa học</p>
        </div>
        <GraduationCap className="text-gray-400" size={24} />
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              domain={[0, 100]}
              label={{ value: '% Tiến độ', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="progress" 
              name="Tiến độ TB"
              radius={[4, 4, 0, 0]}
              onClick={(data) => onBarClick?.(data)}
              style={{ cursor: 'pointer' }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.progress)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-gray-600">Tốt (≥80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span className="text-gray-600">Trung bình (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600">Rủi ro (&lt;60%)</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressByCourseChart;

