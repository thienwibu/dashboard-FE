import React from 'react';
import { AlertTriangle, Clock, CheckCircle, Eye } from 'lucide-react';

const ClassWarningBox = ({ warnings = [], onViewRiskClasses }) => {
  const defaultWarnings = warnings.length > 0 ? warnings : [
    {
      id: 1,
      type: 'critical',
      icon: AlertTriangle,
      color: 'red',
      message: '3 lớp có tiến độ <60%'
    },
    {
      id: 2,
      type: 'warning',
      icon: Clock,
      color: 'orange',
      message: '2 lớp chưa cập nhật kết quả 2 tuần'
    },
    {
      id: 3,
      type: 'info',
      icon: CheckCircle,
      color: 'green',
      message: 'Tỷ lệ hoàn thành ngành tăng 5% so với kỳ trước'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', dot: 'bg-red-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', dot: 'bg-orange-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', dot: 'bg-green-500' }
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cảnh báo & Rủi ro</h3>
          <p className="text-sm text-gray-600">Theo dõi và hành động</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {defaultWarnings.map((warning) => {
          const Icon = warning.icon;
          const colors = getColorClasses(warning.color);
          
          return (
            <div
              key={warning.id}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 flex items-start gap-3`}
            >
              <div className={`${colors.dot} w-2 h-2 rounded-full mt-2 flex-shrink-0`}></div>
              <Icon className={`${colors.icon} flex-shrink-0 mt-1`} size={20} />
              <p className="flex-1 text-sm text-gray-700">{warning.message}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onViewRiskClasses?.()}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        <Eye className="h-5 w-5" />
        <span>Xem chi tiết lớp rủi ro</span>
      </button>
    </div>
  );
};

export default ClassWarningBox;

