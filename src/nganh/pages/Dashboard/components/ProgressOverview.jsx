import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockClassData, mockDashboardData } from '../../../data/mockData';

const ProgressOverview = ({ data, selectedClass = 'all' }) => {
  // Tạo dữ liệu tổng hợp ngành theo thời gian (học kỳ/tháng)
  const industryTimeData = useMemo(() => {
    // Mock data cho 6 tháng gần nhất
    const allData = data?.all || [];
  
    // Tính tổng hợp cho từng tháng
    return [
      { period: 'T1', completed: 45, inProgress: 32, notStarted: 13 },
      { period: 'T2', completed: 52, inProgress: 28, notStarted: 10 },
      { period: 'T3', completed: 58, inProgress: 25, notStarted: 7 },
      { period: 'T4', completed: 62, inProgress: 22, notStarted: 6 },
      { period: 'T5', completed: 68, inProgress: 18, notStarted: 4 },
      { period: 'T6', completed: 70, inProgress: 20, notStarted: 10 }
    ];
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">Tháng {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}% ({total > 0 ? Math.round((entry.value / total) * 100) : 0}%)
            </p>
          ))}
          <p className="text-sm font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
            Tổng: {total}%
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
          </h3>
          <p className="text-sm text-gray-600">
            Xu hướng toàn ngành theo thời gian (% sinh viên ở 3 trạng thái)
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
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={industryTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
              dataKey="period" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              label={{ value: 'Tháng', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              label={{ value: '% Sinh viên', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
              stackId="a"
                dataKey="completed" 
                name="Hoàn thành"
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
              stackId="a"
                dataKey="inProgress" 
                name="Đang học"
                fill="#f59e0b" 
              radius={[0, 0, 0, 0]}
              />
              <Bar 
              stackId="a"
                dataKey="notStarted" 
                name="Chưa bắt đầu"
                fill="#ef4444" 
              radius={[0, 0, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressOverview;