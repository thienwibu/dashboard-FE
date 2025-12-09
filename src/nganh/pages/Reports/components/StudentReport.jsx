import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const StudentReport = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Báo cáo sinh viên</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Không có dữ liệu sinh viên</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const atRiskStudents = students.filter(s => s.riskLevel === 'high').length;
  const excellentStudents = students.filter(s => s.averageScore >= 8.5).length;
  
  const avgCompletion = students.reduce((sum, s) => sum + s.completionRate, 0) / totalStudents;
  const avgScore = students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents;

  // Risk level distribution
  const riskDistribution = {
    low: students.filter(s => s.riskLevel === 'low').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    high: students.filter(s => s.riskLevel === 'high').length
  };

  // Score distribution
  const scoreRanges = [
    { label: '9.0 - 10', min: 9.0, max: 10, count: 0, color: 'bg-green-500' },
    { label: '8.0 - 8.9', min: 8.0, max: 8.9, count: 0, color: 'bg-blue-500' },
    { label: '7.0 - 7.9', min: 7.0, max: 7.9, count: 0, color: 'bg-yellow-500' },
    { label: '6.0 - 6.9', min: 6.0, max: 6.9, count: 0, color: 'bg-orange-500' },
    { label: '< 6.0', min: 0, max: 5.9, count: 0, color: 'bg-red-500' }
  ];

  students.forEach(student => {
    const range = scoreRanges.find(r => student.averageScore >= r.min && student.averageScore <= r.max);
    if (range) range.count++;
  });

  const maxCount = Math.max(...scoreRanges.map(r => r.count));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Users className="text-purple-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Báo cáo sinh viên</h2>
          <p className="text-sm text-gray-600">Phân tích chi tiết về sinh viên</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-600" />
            <p className="text-sm font-medium text-blue-900">Tổng SV</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm font-medium text-green-900">Xuất sắc</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{excellentStudents}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <p className="text-sm font-medium text-red-900">Rủi ro cao</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{atRiskStudents}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-purple-600" />
            <p className="text-sm font-medium text-purple-900">ĐTB</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{avgScore.toFixed(1)}</p>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố điểm số</h3>
        <div className="space-y-3">
          {scoreRanges.map((range, index) => {
            const percentage = totalStudents > 0 ? (range.count / totalStudents) * 100 : 0;
            const width = maxCount > 0 ? (range.count / maxCount) * 100 : 0;
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{range.label}</span>
                  <span className="text-gray-600">
                    {range.count} SV ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${range.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Level Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố mức độ rủi ro</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700 font-medium mb-2">Thấp</p>
            <p className="text-3xl font-bold text-green-600">{riskDistribution.low}</p>
            <p className="text-xs text-green-600 mt-1">
              {((riskDistribution.low / totalStudents) * 100).toFixed(0)}%
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-700 font-medium mb-2">Trung bình</p>
            <p className="text-3xl font-bold text-yellow-600">{riskDistribution.medium}</p>
            <p className="text-xs text-yellow-600 mt-1">
              {((riskDistribution.medium / totalStudents) * 100).toFixed(0)}%
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700 font-medium mb-2">Cao</p>
            <p className="text-3xl font-bold text-red-600">{riskDistribution.high}</p>
            <p className="text-xs text-red-600 mt-1">
              {((riskDistribution.high / totalStudents) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tỷ lệ hoàn thành TB</p>
            <p className="text-2xl font-bold text-blue-600">{avgCompletion.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Sinh viên đang học</p>
            <p className="text-2xl font-bold text-green-600">{activeStudents}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReport;

