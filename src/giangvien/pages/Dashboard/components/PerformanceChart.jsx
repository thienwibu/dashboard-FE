import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, X, Users } from 'lucide-react';
import { mockStudentTrackingData } from '../../../data/mockData';

const PerformanceChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [showModal, setShowModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  
  if (!data) return null;

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
            const isScore = entry.dataKey === 'averageScore' || entry.dataKey === 'engagement';
            const displayValue = isScore ? (entry.value / 10).toFixed(1) : `${entry.value}%`;
            const unit = isScore ? '/10' : '';
            return (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}:</span>
                <span className="text-sm font-medium text-gray-900">{displayValue}{unit}</span>
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
            <h3 className="text-lg font-semibold text-gray-900">Biểu Đồ Hiệu Suất</h3>
            <p className="text-sm text-gray-600">Theo dõi xu hướng học tập theo thời gian</p>
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
            data={data.map(d => ({
              ...d,
              averageScore: d.averageScore * 10,
              engagement: d.engagement * 10
            }))} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
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
              dataKey="averageScore" 
              name="Điểm trung bình"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="completionRate" 
              name="Tỷ lệ hoàn thành"
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              name="Mức độ tham gia"
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <button
          onClick={() => {
            setSelectedMetric({
              id: 'averageScore',
              title: 'Điểm TB tháng này',
              value: data && data.length > 0 ? data[data.length - 1].averageScore.toFixed(1) : '0',
              color: 'primary',
              description: 'Điểm trung bình của tất cả sinh viên trong tháng này'
            });
            setShowModal(true);
          }}
          className="text-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
        >
          <p className="text-2xl font-bold text-primary-600">
            {data && data.length > 0 ? data[data.length - 1].averageScore.toFixed(1) : '0'}/10
          </p>
          <p className="text-sm text-gray-600">Điểm TB tháng này</p>
        </button>
        <button
          onClick={() => {
            setSelectedMetric({
              id: 'completionRate',
              title: 'Tỷ lệ hoàn thành',
              value: data && data.length > 0 ? Math.round(data[data.length - 1].completionRate) : '0',
              color: 'success',
              description: 'Tỷ lệ hoàn thành bài tập và khóa học của sinh viên'
            });
            setShowModal(true);
          }}
          className="text-center p-3 bg-success-50 rounded-lg hover:bg-success-100 transition-colors cursor-pointer"
        >
          <p className="text-2xl font-bold text-success-600">
            {data && data.length > 0 ? Math.round(data[data.length - 1].completionRate) : '0'}%
          </p>
          <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
        </button>
        <button
          onClick={() => {
            setSelectedMetric({
              id: 'engagement',
              title: 'Mức độ tham gia',
              value: data && data.length > 0 ? data[data.length - 1].engagement.toFixed(1) : '0',
              color: 'warning',
              description: 'Mức độ tham gia và tương tác của sinh viên trong lớp học'
            });
            setShowModal(true);
          }}
          className="text-center p-3 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors cursor-pointer"
        >
          <p className="text-2xl font-bold text-warning-600">
            {data && data.length > 0 ? data[data.length - 1].engagement.toFixed(1) : '0'}/10
          </p>
          <p className="text-sm text-gray-600">Mức độ tham gia</p>
        </button>
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedMetric.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedMetric.description}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Giá trị hiện tại</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedMetric.value}{selectedMetric.id === 'completionRate' ? '%' : '/10'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tổng sinh viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {mockStudentTrackingData?.students?.length || 0}
                  </p>
                </div>
              </div>

              {/* Danh sách sinh viên */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách sinh viên
                </h4>
                <div className="space-y-3">
                  {(mockStudentTrackingData?.students || [])
                    .sort((a, b) => {
                      if (selectedMetric.id === 'averageScore') return b.averageScore - a.averageScore;
                      if (selectedMetric.id === 'completionRate') return b.completionRate - a.completionRate;
                      return 0;
                    })
                    .map((student, index) => (
                      <div 
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.studentId} • {student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Điểm TB</p>
                            <p className="text-lg font-bold text-gray-900">{student.averageScore.toFixed(1)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Hoàn thành</p>
                            <p className="text-lg font-bold text-gray-900">{student.completionRate}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Trạng thái</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              student.status === 'active' 
                                ? 'bg-success-100 text-success-700'
                                : student.status === 'at_risk'
                                ? 'bg-danger-100 text-danger-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {student.status === 'active' ? 'Đang học' : student.status === 'at_risk' ? 'Có nguy cơ' : 'Hoàn thành'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;