import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { X, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';

const ProgressOverview = ({
  data,
  selectedClass = 'all',
  studentDetails = {},
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  if (!data) return null;

  // Get data for selected class
  const classData = data[selectedClass] || data.all || [];

  // Filter out courses with no students
  const filteredData = classData.filter(
    (item) => item.completed > 0 || item.inProgress > 0 || item.notStarted > 0
  );

  // Handle bar click
  const handleBarClick = (courseData, statusKey) => {
    if (courseData && statusKey) {
      setSelectedCourse(courseData.course);
      setSelectedStatus(statusKey);
      setModalOpen(true);
    }
  };

  // Get students for selected course and status
  const getStudentsForStatus = () => {
    if (!selectedCourse || !selectedStatus || !studentDetails) return [];

    const students = studentDetails[selectedClass] || studentDetails.all || [];
    return students.filter((student) => {
      // Find student's course data
      const courseMatch = student.courses?.find(
        (c) =>
          c.name === selectedCourse ||
          c.name?.includes(selectedCourse.split(' ')[0])
      );

      if (!courseMatch) return false;

      const rate = courseMatch.progress || student.completionRate || 0;

      switch (selectedStatus) {
        case 'completed':
          return rate >= 100;
        case 'inProgress':
          return rate > 0 && rate < 100;
        case 'notStarted':
          return rate === 0;
        default:
          return false;
      }
    });
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      completed: {
        label: 'Hoàn thành',
        color: 'text-primary-600',
        bgColor: 'bg-primary-100',
        icon: CheckCircle,
      },
      inProgress: {
        label: 'Đang học',
        color: 'text-warning-600',
        bgColor: 'bg-warning-100',
        icon: Clock,
      },
      notStarted: {
        label: 'Chưa bắt đầu',
        color: 'text-danger-600',
        bgColor: 'bg-danger-100',
        icon: AlertCircle,
      },
    };
    return statusConfig[status] || statusConfig.completed;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-700 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} sinh viên (
              {total > 0 ? Math.round((entry.value / total) * 100) : 0}%)
            </p>
          ))}
          <p className="text-sm font-medium text-gray-700 mt-2 pt-2 border-t border-gray-200">
            Tổng: {total} sinh viên
          </p>
          <p className="text-xs text-primary-600 mt-1">Click để xem chi tiết</p>
        </div>
      );
    }
    return null;
  };

  // Custom bar with click handler
  const CustomBar = (props) => {
    const { x, y, width, height, fill, payload, dataKey } = props;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={4}
        ry={4}
        style={{ cursor: 'pointer' }}
        onClick={() => handleBarClick(payload, dataKey)}
      />
    );
  };

  const studentsToShow = getStudentsForStatus();
  const statusInfo = selectedStatus ? getStatusInfo(selectedStatus) : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            Tổng Quan Tiến Độ Học Tập
            {selectedClass !== 'all' && (
              <span className="text-primary-600"> - {selectedClass}</span>
            )}
          </h3>
          <p className="text-sm text-gray-600">
            Số lượng sinh viên theo trạng thái từng khóa học
            {selectedClass !== 'all' && ` (Lớp ${selectedClass})`}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Hoàn thành</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Đang học</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Chưa bắt đầu</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="course" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="completed"
                name="Hoàn thành"
                fill="#3b82f6"
                shape={<CustomBar />}
              />
              <Bar
                dataKey="inProgress"
                name="Đang học"
                fill="#f59e0b"
                shape={<CustomBar />}
              />
              <Bar
                dataKey="notStarted"
                name="Chưa bắt đầu"
                fill="#ef4444"
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu cho lớp này</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        💡 Click vào cột để xem danh sách sinh viên chi tiết
      </p>

      {/* Modal hiển thị chi tiết sinh viên */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div
              className={`p-6 ${statusInfo?.bgColor} border-b border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {StatusIcon && (
                    <StatusIcon className={`h-6 w-6 ${statusInfo?.color}`} />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {selectedCourse}
                    </h3>
                    <p className={`text-sm ${statusInfo?.color} font-medium`}>
                      {statusInfo?.label} - {studentsToShow.length} sinh viên
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {studentsToShow.length > 0 ? (
                <div className="space-y-3">
                  {studentsToShow.map((student, index) => {
                    const courseData = student.courses?.find(
                      (c) =>
                        c.name === selectedCourse ||
                        c.name?.includes(selectedCourse.split(' ')[0])
                    );
                    const progress =
                      courseData?.progress || student.completionRate || 0;

                    return (
                      <div
                        key={student.id || index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                              {student.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.studentId}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  progress >= 100
                                    ? 'bg-primary-600'
                                    : progress > 0
                                      ? 'bg-warning-500'
                                      : 'bg-gray-300'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <span
                              className={`text-sm font-medium ${statusInfo?.color}`}
                            >
                              {progress}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Điểm TB:{' '}
                            {(courseData?.score || student.averageScore || 0).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Không có sinh viên nào trong danh mục này
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressOverview;
