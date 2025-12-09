import React from 'react';
import { Users, BookOpen, TrendingUp, AlertTriangle, Clock, Award } from 'lucide-react';

const ClassStats = ({ data }) => {
  if (!data) return null;

  const stats = [
    {
      title: 'Tổng Lớp Học',
      value: data.totalClasses,
      change: data.classChange,
      changeType: data.classChange > 0 ? 'increase' : 'decrease',
      icon: BookOpen,
      color: 'primary'
    },
    {
      title: 'Lớp Đang Diễn Ra',
      value: data.activeClasses,
      change: data.activeChange,
      changeType: data.activeChange > 0 ? 'increase' : 'decrease',
      icon: Clock,
      color: 'success'
    },
    {
      title: 'Tổng Sinh Viên',
      value: data.totalStudents,
      change: data.studentChange,
      changeType: data.studentChange > 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'warning'
    },
    {
      title: 'Điểm Trung Bình',
      value: `${(data.averageScore || 0).toFixed(1)}/10`,
      change: data.scoreChange,
      changeType: data.scoreChange > 0 ? 'increase' : 'decrease',
      icon: Award,
      color: 'primary'
    },
    {
      title: 'Tỷ Lệ Hoàn Thành',
      value: `${Math.round(data.completionRate || 0)}%`,
      change: data.completionChange,
      changeType: data.completionChange > 0 ? 'increase' : 'decrease',
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Lớp Cần Chú Ý',
      value: data.atRiskClasses,
      change: data.riskChange,
      changeType: data.riskChange > 0 ? 'increase' : 'decrease',
      icon: AlertTriangle,
      color: 'danger'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-50 text-primary-600',
      success: 'bg-success-50 text-success-600',
      warning: 'bg-warning-50 text-warning-600',
      danger: 'bg-danger-50 text-danger-600'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card p-6 hover:shadow-medium transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              
              <div className="flex items-center mt-2">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-danger-600 mr-1 transform rotate-180" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {Math.abs(stat.change)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassStats;