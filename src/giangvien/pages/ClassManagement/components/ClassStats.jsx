import React, { useState } from 'react';
import { Users, BookOpen, TrendingUp, TrendingDown, AlertTriangle, Clock, X, ChevronRight } from 'lucide-react';
import { mockClassData } from '../../../data/mockData';

const ClassStats = ({ data }) => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassDetail, setShowClassDetail] = useState(false);

  if (!data) return null;

  const stats = [
    {
      id: 'totalClasses',
      title: 'Tổng Lớp Học',
      value: data.totalClasses,
      change: data.classChange,
      changeType: data.classChange > 0 ? 'increase' : 'decrease',
      icon: BookOpen,
      color: 'primary',
      description: 'Tổng số lớp học được phân công'
    },
    {
      id: 'activeClasses',
      title: 'Lớp Đang Diễn Ra',
      value: data.activeClasses,
      change: data.activeChange,
      changeType: data.activeChange > 0 ? 'increase' : 'decrease',
      icon: Clock,
      color: 'success',
      description: 'Lớp học đang trong quá trình giảng dạy'
    },
    {
      id: 'totalStudents',
      title: 'Tổng Sinh Viên',
      value: data.totalStudents,
      change: data.studentChange,
      changeType: data.studentChange > 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'warning',
      description: 'Tổng số sinh viên trong tất cả các lớp'
    },
    {
      id: 'completionRate',
      title: 'Tỷ Lệ Hoàn Thành',
      value: `${Math.round(data.completionRate || 0)}%`,
      change: data.completionChange,
      changeType: data.completionChange > 0 ? 'increase' : 'decrease',
      icon: TrendingUp,
      color: 'success',
      description: 'Tỷ lệ hoàn thành trung bình của các lớp'
    },
    {
      id: 'atRiskClasses',
      title: 'Lớp Cần Chú Ý',
      value: data.atRiskClasses,
      change: data.riskChange,
      changeType: data.riskChange > 0 ? 'increase' : 'decrease',
      icon: AlertTriangle,
      color: 'danger',
      description: 'Lớp có tỷ lệ hoàn thành thấp hoặc nhiều sinh viên gặp khó khăn'
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

  const getDetailData = (statId) => {
    const classes = mockClassData?.classes || [];
    
    switch (statId) {
      case 'totalClasses':
        return classes;
      case 'activeClasses':
        return classes.filter(c => c.status === 'active');
      case 'totalStudents':
        return classes.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
      case 'completionRate':
        return classes.sort((a, b) => b.completionRate - a.completionRate);
      case 'atRiskClasses':
        return classes.filter(c => c.completionRate < 70 || c.averageScore < 6.5);
      default:
        return classes;
    }
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'bg-success-100 text-success-700', text: 'Đang diễn ra' },
      upcoming: { class: 'bg-primary-100 text-primary-700', text: 'Sắp diễn ra' },
      completed: { class: 'bg-gray-100 text-gray-700', text: 'Hoàn thành' },
      cancelled: { class: 'bg-danger-100 text-danger-700', text: 'Đã hủy' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={() => handleStatClick(stat)}
            className="card p-6 hover:shadow-medium transition-all duration-200 text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>

                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-danger-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'}`}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedStat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(selectedStat.color)}`}>
                  <selectedStat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedStat.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedStat.description}
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Giá trị hiện tại</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedStat.value}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Thay đổi</p>
                  <div className="flex items-center mt-1">
                    {selectedStat.changeType === 'increase' ? (
                      <TrendingUp className="h-5 w-5 text-success-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-danger-600 mr-1" />
                    )}
                    <span className={`text-2xl font-bold ${
                      selectedStat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {Math.abs(selectedStat.change)}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tổng lớp học</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {getDetailData(selectedStat.id).length}
                  </p>
                </div>
              </div>

              {/* Danh sách lớp học */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách lớp học
                </h4>
                <div className="space-y-3">
                  {getDetailData(selectedStat.id).map((classItem, index) => (
                    <button
                      key={classItem.id}
                      onClick={() => {
                        setSelectedClass(classItem);
                        setShowClassDetail(true);
                      }}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{classItem.name}</p>
                          <p className="text-sm text-gray-600">{classItem.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Sinh viên</p>
                          <p className="text-lg font-bold text-gray-900">{classItem.enrolledStudents}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Hoàn thành</p>
                          <p className="text-lg font-bold text-gray-900">{classItem.completionRate}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(classItem.status).class}`}>
                            {getStatusBadge(classItem.status).text}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Mẹo:</strong> Click vào bất kỳ lớp học nào để xem danh sách sinh viên chi tiết
                  </p>
                </div>
              </div>
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

      {/* Modal chi tiết lớp học */}
      {showClassDetail && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedClass.name} - {selectedClass.course}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{selectedClass.enrolledStudents} sinh viên</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedClass.status).class}`}>
                    {getStatusBadge(selectedClass.status).text}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowClassDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedClass.completionRate}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bài tập đang mở</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedClass.activeAssignments || 0}</p>
                </div>
              </div>

              {/* Danh sách sinh viên */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách sinh viên trong lớp
                </h4>
                {mockClassData.classDetails[selectedClass.id]?.students ? (
                  <div className="space-y-3">
                    {mockClassData.classDetails[selectedClass.id].students.map((student, index) => (
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
                            <p className="text-sm text-gray-600">Điểm TB</p>
                            <p className="text-lg font-bold text-gray-900">{student.averageScore.toFixed(1)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Hoàn thành</p>
                            <p className="text-lg font-bold text-gray-900">{student.completionRate}%</p>
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
                    <p className="text-gray-500">Chưa có sinh viên nào trong lớp này</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowClassDetail(false)}
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

export default ClassStats;
