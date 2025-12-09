import React from 'react';
import { FileText, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const AssignmentStats = ({ data }) => {
  if (!data) return null;

  const stats = [
    {
      title: 'Tổng Bài Tập',
      value: data.totalAssignments,
      change: data.assignmentChange,
      icon: FileText,
      color: 'primary'
    },
    {
      title: 'Đang Mở',
      value: data.activeAssignments,
      change: data.activeChange,
      icon: Clock,
      color: 'warning'
    },
    {
      title: 'Đã Hoàn Thành',
      value: data.completedAssignments,
      change: data.completedChange,
      icon: CheckCircle,
      color: 'success'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'text-primary-600 bg-primary-50',
      success: 'text-success-600 bg-success-50',
      warning: 'text-warning-600 bg-warning-50',
      danger: 'text-danger-600 bg-danger-50'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  isPositive ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                <TrendIcon className="h-4 w-4" />
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentStats;
