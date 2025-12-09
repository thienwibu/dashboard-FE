import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProgressOverview = ({ data, selectedClass = 'all' }) => {
  if (!data) return null;
  
  // Get data for selected class
  const classData = data[selectedClass] || data.all || [];
  
  // Filter out courses with no students
  const filteredData = classData.filter(item => 
    item.completed > 0 || item.inProgress > 0 || item.notStarted > 0
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} sinh viên ({total > 0 ? Math.round((entry.value / total) * 100) : 0}%)
            </p>
          ))}
          <p className="text-sm font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
            Tổng: {total} sinh viên
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tổng Quan Tiến Độ Học Tập
            {selectedClass !== 'all' && <span className="text-primary-600"> - {selectedClass}</span>}
          </h3>
          <p className="text-sm text-gray-600">
            Số lượng sinh viên theo trạng thái từng khóa học
            {selectedClass !== 'all' && ` (Lớp ${selectedClass})`}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Hoàn thành</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Đang học</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Chưa bắt đầu</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="course" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="completed" 
                name="Hoàn thành"
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="inProgress" 
                name="Đang học"
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="notStarted" 
                name="Chưa bắt đầu"
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu cho lớp này</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressOverview;