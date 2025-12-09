import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';

const CourseBarChart = () => {
  const { isDarkMode } = useTheme();

  const data = [
    { name: 'Nhập môn lập trình', rate: 82, avgScore: 7.8, notAchieved: 18, status: 'Tốt', color: '#22c55e' },
    { name: 'Kỹ thuật lập trình', rate: 78, avgScore: 7.2, notAchieved: 22, status: 'Khá', color: '#3b82f6' },
    { name: 'Cấu trúc dữ liệu & GT', rate: 73, avgScore: 7.6, notAchieved: 27, status: 'Trung bình', color: '#f59e0b' },
    { name: 'Lập trình HĐT', rate: 75, avgScore: 7.5, notAchieved: 25, status: 'Trung bình', color: '#f59e0b' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 border rounded-lg shadow-lg`}>
          <p className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">% SV đạt:</span> <span className="text-green-600 font-semibold">{data.rate}%</span>
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">Điểm TB:</span> <span className="font-semibold">{data.avgScore}/10</span>
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">SV chưa đạt:</span> <span className="text-red-600 font-semibold">{data.notAchieved}%</span>
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">Trạng thái:</span> <span className="font-semibold">{data.status}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        % Sinh viên đạt kỹ năng theo từng môn
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="name" 
              angle={-15}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
              label={{ value: '% SV đạt', angle: -90, position: 'insideLeft', style: { fill: isDarkMode ? '#9ca3af' : '#6b7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CourseBarChart;

