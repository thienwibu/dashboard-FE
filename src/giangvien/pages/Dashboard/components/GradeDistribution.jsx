import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const GradeDistribution = ({ data, students }) => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (!data || !students) return null;

  // Định nghĩa các vùng điểm và màu sắc
  const gradeRanges = [
    { name: 'Giỏi (≥ 8.0)', min: 8.0, max: 10, color: '#10b981', key: 'excellent' },
    { name: 'Khá (6.5 - < 8.0)', min: 6.5, max: 8.0, color: '#3b82f6', key: 'good' },
    { name: 'Trung bình (5.0 - < 6.5)', min: 5.0, max: 6.5, color: '#f59e0b', key: 'average' },
    { name: 'Yếu (4.0 - < 5.0)', min: 4.0, max: 5.0, color: '#f97316', key: 'weak' },
    { name: 'Kém (< 4.0)', min: 0, max: 4.0, color: '#ef4444', key: 'poor' }
  ];

  // Tính toán số lượng sinh viên trong mỗi vùng điểm
  const calculateDistribution = () => {
    return gradeRanges.map(range => {
      const studentsInRange = students.filter(student => 
        student.averageScore >= range.min && student.averageScore < range.max
      );
      return {
        ...range,
        count: studentsInRange.length,
        percentage: ((studentsInRange.length / students.length) * 100).toFixed(1),
        students: studentsInRange
      };
    });
  };

  const distribution = calculateDistribution();
  const totalStudents = students.length;

  const handleViewDetails = (gradeData) => {
    setSelectedGrade(gradeData);
    setShowModal(true);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Số sinh viên: <span className="font-semibold">{data.count}</span>
          </p>
          <p className="text-sm text-gray-600">
            Tỷ lệ: <span className="font-semibold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = (scoreChange) => {
    if (scoreChange > 0) return <TrendingUp className="h-4 w-4 text-success-600" />;
    if (scoreChange < 0) return <TrendingDown className="h-4 w-4 text-danger-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phân Bố Học Lực Sinh Viên</h3>
              <p className="text-sm text-gray-600">Theo dõi và quản lý tất cả các lớp học được phân công</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Biểu đồ tròn */}
          <div className="w-full lg:w-1/2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Danh sách vùng điểm với nút xem chi tiết */}
          <div className="w-full lg:w-1/2 space-y-3">
            {distribution.map((grade, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: grade.color }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{grade.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{grade.percentage}%</p>
                    <p className="text-xs text-gray-500">{grade.count} sinh viên</p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(grade)}
                    disabled={grade.count === 0}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      grade.count === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Tổng số sinh viên</p>
                <p className="text-2xl font-bold text-primary-600">{totalStudents}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal hiển thị danh sách sinh viên */}
      {showModal && selectedGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: selectedGrade.color }}
                ></div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedGrade.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedGrade.count} sinh viên ({selectedGrade.percentage}%)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {selectedGrade.students.length > 0 ? (
                <div className="space-y-3">
                  {selectedGrade.students.map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.studentId} • {student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Điểm trung bình</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-xl font-bold text-gray-900">
                              {student.averageScore.toFixed(1)}
                            </p>
                            {getTrendIcon(student.scoreChange)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                          <p className="text-xl font-bold text-gray-900">{student.completionRate}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            student.status === 'active' 
                              ? 'bg-success-100 text-success-700'
                              : student.status === 'at_risk'
                              ? 'bg-danger-100 text-danger-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.status === 'active' ? 'Đang học' : student.status === 'at_risk' ? 'Có nguy cơ' : 'Hoàn thành'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Không có sinh viên nào trong vùng điểm này</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GradeDistribution;
