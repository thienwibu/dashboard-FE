import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RiskDistributionChart = ({ students = [], onSegmentClick }) => {
  // Tính phân bố rủi ro
  const riskDistribution = {
    low: students.filter(s => s.riskLevel === 'low').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    high: students.filter(s => s.riskLevel === 'high').length
  };

  const total = students.length;
  const chartData = [
    { name: 'Thấp', value: riskDistribution.low, color: '#22c55e', riskLevel: 'low' },
    { name: 'Trung bình', value: riskDistribution.medium, color: '#f59e0b', riskLevel: 'medium' },
    { name: 'Cao', value: riskDistribution.high, color: '#ef4444', riskLevel: 'high' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Số lượng: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Tỷ lệ: <span className="font-semibold">{percentage}%</span>
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
          <h3 className="text-lg font-semibold text-gray-900">Phân bố theo nhóm rủi ro</h3>
          <p className="text-sm text-gray-600">Tổng số sinh viên: {total}</p>
        </div>
      </div>

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
              onClick={(data) => onSegmentClick?.(data.riskLevel)}
              style={{ cursor: 'pointer' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
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
          <div
            key={index}
            className="text-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            onClick={() => onSegmentClick?.(item.riskLevel)}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs text-gray-500">{total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistributionChart;

