import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { mockClassData } from '../../../data/mockData';

const PerformanceChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('7days');
  
  // Tính toán dữ liệu hiệu suất trung bình toàn ngành từ trung bình cộng của toàn bộ lớp
  const industryPerformanceData = useMemo(() => {
    const classes = mockClassData.classes || [];
    
    // Mock data cho 7 tuần gần nhất
    return [
      { week: 'Tuần 1', avgScore: 72, completionRate: 68, lmsActivity: 75, prevAvgScore: 70 },
      { week: 'Tuần 2', avgScore: 73, completionRate: 70, lmsActivity: 76, prevAvgScore: 71 },
      { week: 'Tuần 3', avgScore: 74, completionRate: 72, lmsActivity: 77, prevAvgScore: 72 },
      { week: 'Tuần 4', avgScore: 75, completionRate: 74, lmsActivity: 78, prevAvgScore: 73 },
      { week: 'Tuần 5', avgScore: 76, completionRate: 75, lmsActivity: 79, prevAvgScore: 74 },
      { week: 'Tuần 6', avgScore: 77, completionRate: 77, lmsActivity: 80, prevAvgScore: 75 },
      { week: 'Tuần 7', avgScore: 78, completionRate: 78, lmsActivity: 81, prevAvgScore: 76 }
    ];
  }, []);
  
  if (!industryPerformanceData || industryPerformanceData.length === 0) return null;

  const timeRangeOptions = [
    { value: '7days', label: '7 ngày qua' },
    { value: '30days', label: '30 ngày qua' },
    { value: '3months', label: '3 tháng qua' },
    { value: '6months', label: '6 tháng qua' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'prevAvgScore') {
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full bg-transparent"></div>
                  <span className="text-sm text-gray-600">{entry.name}:</span>
                  <span className="text-sm font-medium text-gray-500">{entry.value}/10</span>
                </div>
              );
            }
            const isScore = entry.dataKey === 'avgScore';
            const displayValue = isScore ? `${entry.value}/10` : `${entry.value}%`;
            return (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}:</span>
                <span className="text-sm font-medium text-gray-900">{displayValue}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hiệu Suất Trung Bình Toàn Ngành</h3>
            <p className="text-sm text-gray-600">Dữ liệu từ trung bình cộng của toàn bộ lớp trong ngành</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={industryPerformanceData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="avgScore" 
              name="Điểm TB ngành"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="completionRate" 
              name="Tỷ lệ hoàn thành trung bình"
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="lmsActivity" 
              name="Mức độ tham gia LMS trung bình"
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
            />
            {/* Đường chấm so sánh học kỳ trước */}
            <Line 
              type="monotone" 
              dataKey="prevAvgScore" 
              name="Học kỳ trước (so sánh)"
              stroke="#9ca3af" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <p className="text-2xl font-bold text-primary-600">
            {industryPerformanceData && industryPerformanceData.length > 0 
              ? industryPerformanceData[industryPerformanceData.length - 1].avgScore.toFixed(1) 
              : '0'}/10
          </p>
          <p className="text-sm text-gray-600">Điểm TB toàn ngành</p>
        </div>
        <div className="text-center p-3 bg-success-50 rounded-lg">
          <p className="text-2xl font-bold text-success-600">
            {industryPerformanceData && industryPerformanceData.length > 0 
              ? Math.round(industryPerformanceData[industryPerformanceData.length - 1].completionRate) 
              : '0'}%
          </p>
          <p className="text-sm text-gray-600">Mức tiến độ chung</p>
        </div>
        <div className="text-center p-3 bg-warning-50 rounded-lg">
          <p className="text-2xl font-bold text-warning-600">
            {industryPerformanceData && industryPerformanceData.length > 0 
              ? industryPerformanceData[industryPerformanceData.length - 1].lmsActivity.toFixed(1) 
              : '0'}%
          </p>
          <p className="text-sm text-gray-600">Mức độ hoạt động LMS</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;