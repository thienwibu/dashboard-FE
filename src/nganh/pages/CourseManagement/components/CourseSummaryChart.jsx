import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CourseSummaryChart = ({ courses = [] }) => {
  // Tính toán dữ liệu cho biểu đồ: X-axis là các khóa học, Y-axis là % hoàn thành
  const chartData = courses.map(course => ({
    name: course.name.length > 15 ? course.name.substring(0, 15) + '...' : course.name,
    fullName: course.name,
    completionRate: course.completionRate || 0,
    averageScore: course.averageScore || 0
  }));

  const getBarColor = (rate) => {
    if (rate >= 80) return '#22c55e'; // green
    if (rate >= 60) return '#f59e0b'; // yellow/amber
    return '#ef4444'; // red
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{data.fullName || data.name}</p>
          <p className="text-sm text-gray-600">
            Hoàn thành: <span className="font-semibold">{data.completionRate}%</span>
          </p>
          <p className="text-sm text-gray-600">
            Điểm TB: <span className="font-semibold">{data.averageScore?.toFixed(1)}/10</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ tổng hợp khóa học</h3>
      <div className="h-64">
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
              label={{ value: '% Hoàn thành', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="completionRate" 
              name="% Hoàn thành"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.completionRate)} 
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

export default CourseSummaryChart;

