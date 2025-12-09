import React from 'react';
import { Users, BookOpen, AlertTriangle, CheckCircle, Award } from 'lucide-react';

const StudentKPIs = ({ stats = {} }) => {
  const kpiCards = [
    {
      title: 'Tổng số sinh viên',
      value: stats.totalStudents || 0,
      description: 'Toàn ngành',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Đang học',
      value: stats.activeStudents || 0,
      description: 'Số lượng sinh viên đang trong khóa',
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Có nguy cơ',
      value: `${stats.atRiskPercentage || 0}%`,
      description: '% sinh viên có tiến độ <70% hoặc điểm <6.0',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Hoàn thành',
      value: `${stats.completedPercentage || 0}%`,
      description: '% sinh viên đã đạt chuẩn',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      title: 'Trung bình điểm ngành',
      value: (stats.averageScore || 0).toFixed(1),
      description: 'Điểm TB tất cả sinh viên',
      icon: Award,
      color: 'yellow',
      suffix: '/10'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon;
        const colors = getColorClasses(kpi.color);
        
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
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              {kpi.suffix && (
                <span className="text-sm text-gray-500">{kpi.suffix}</span>
              )}
            </div>
            <p className="text-xs text-gray-500">{kpi.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StudentKPIs;

