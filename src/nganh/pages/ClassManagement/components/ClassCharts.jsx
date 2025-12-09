import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Bar chart: Tiến độ trung bình các lớp theo giảng viên
export const ProgressByInstructorChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { instructor: 'TS. Nguyễn Văn An', progress: 85 },
    { instructor: 'TS. Trần Thị Bình', progress: 78 },
    { instructor: 'ThS. Lê Văn Cường', progress: 72 },
    { instructor: 'TS. Phạm Văn Đức', progress: 88 }
  ];

  const getBarColor = (progress) => {
    if (progress >= 80) return '#22c55e';
    if (progress >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Tiến độ trung bình các lớp theo giảng viên</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="instructor"
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
            <Tooltip />
            <Bar dataKey="progress" name="Tiến độ TB" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.progress)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Line chart: Biến động điểm trung bình các lớp trong 3 tháng
export const ScoreFluctuationChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { month: 'T10/2024', score: 7.5 },
    { month: 'T11/2024', score: 7.6 },
    { month: 'T12/2024', score: 7.8 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Biến động điểm trung bình các lớp trong 3 tháng</h3>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="font-semibold">+0.3 điểm</span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              domain={[0, 10]}
              label={{ value: 'Điểm TB', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              name="Điểm TB ngành"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Pie chart: Tỷ lệ lớp đạt – trung bình – rủi ro
export const ClassStatusPieChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'Đạt chuẩn', value: 8, color: '#22c55e' },
    { name: 'Trung bình', value: 3, color: '#f59e0b' },
    { name: 'Rủi ro', value: 1, color: '#ef4444' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Tỷ lệ lớp đạt – trung bình – rủi ro</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => {
                const data = chartData.find(d => d.name === value);
                return (
                  <span className="text-sm">
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: data?.color }}></span>
                    {value}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        {chartData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs text-gray-500">lớp</p>
          </div>
        ))}
      </div>
    </div>
  );
};

