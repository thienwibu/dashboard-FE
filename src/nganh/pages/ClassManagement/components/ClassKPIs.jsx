import React from 'react';
import { GraduationCap, CheckCircle, AlertTriangle } from 'lucide-react';

const ClassKPIs = ({ stats = {} }) => {
  const kpiCards = [
    {
      title: 'Tổng số lớp toàn ngành',
      value: stats.totalClasses || 0,
      description: 'Tổng số lớp đang mở',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      title: 'Lớp đạt chuẩn tiến độ',
      value: `${stats.meetingStandardPercentage || 0}%`,
      description: 'Tỷ lệ lớp có tiến độ >80%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Lớp có vấn đề',
      value: `${stats.problematicPercentage || 0}%`,
      description: 'Tiến độ <60% hoặc điểm TB <7',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon;
        const colors = colorMap[kpi.color] || colorMap.blue;

        return (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm border ${colors.border} p-4 hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Icon className={colors.text} size={20} />
              </div>
            </div>
            <h3 className="text-gray-600 text-xs font-medium mb-1">{kpi.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ClassKPIs;
