import React from 'react';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

const StudentGroupTable = ({ groups = [], onGroupClick }) => {
  // Mock data nếu không có
  const tableData = groups.length > 0 ? groups : [
    {
      group: 'Năm 1',
      count: 120,
      averageScore: 7.8,
      averageProgress: 82,
      highRiskRate: 5
    },
    {
      group: 'Năm 2',
      count: 100,
      averageScore: 7.4,
      averageProgress: 79,
      highRiskRate: 10
    },
    {
      group: 'Năm 3',
      count: 80,
      averageScore: 7.2,
      averageProgress: 75,
      highRiskRate: 15
    },
    {
      group: 'Năm 4',
      count: 70,
      averageScore: 7.9,
      averageProgress: 86,
      highRiskRate: 2
    }
  ];

  const getRiskColor = (rate) => {
    if (rate < 5) return 'text-green-600';
    if (rate < 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tổng hợp nhóm sinh viên</h3>
          <p className="text-sm text-gray-600">Phân tích theo năm học</p>
        </div>
        <Users className="text-gray-400" size={24} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhóm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điểm TB
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiến độ TB
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tỷ lệ rủi ro cao
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onGroupClick?.(row)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{row.group}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{row.count}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{row.averageScore.toFixed(1)}/10</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{row.averageProgress}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getProgressColor(row.averageProgress)}`}
                        style={{ width: `${row.averageProgress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`flex items-center gap-1 text-sm font-semibold ${getRiskColor(row.highRiskRate)}`}>
                    {row.highRiskRate >= 10 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{row.highRiskRate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 italic">
        → Người quản lý nhìn là biết năm nào đang yếu.
      </div>
    </div>
  );
};

export default StudentGroupTable;

