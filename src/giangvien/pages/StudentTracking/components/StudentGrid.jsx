import React from 'react';
import { Mail, Phone, TrendingUp, TrendingDown, Clock, Award, AlertTriangle } from 'lucide-react';

const StudentGrid = ({ students, onStudentSelect, loading }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang học' },
      at_risk: { class: 'status-badge status-at-risk', text: 'Có nguy cơ' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      dropped: { class: 'status-badge bg-gray-100 text-gray-800', text: 'Đã bỏ học' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const getRiskBadge = (riskLevel) => {
    const riskConfig = {
      low: { class: 'bg-success-100 text-success-800', text: 'Thấp' },
      medium: { class: 'bg-warning-100 text-warning-800', text: 'Trung bình' },
      high: { class: 'bg-danger-100 text-danger-800', text: 'Cao' }
    };
    return riskConfig[riskLevel] || riskConfig.low;
  };

  const getPerformanceColor = (score) => {
    if (score >= 8.0) return 'text-success-600';      // Giỏi
    if (score >= 6.5) return 'text-primary-600';      // Khá
    if (score >= 5.0) return 'text-warning-600';      // Trung bình
    if (score >= 4.0) return 'text-orange-600';       // Yếu
    return 'text-danger-600';                          // Kém
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy sinh viên nào
        </h3>
        <p className="text-gray-500">
          Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students.map((student) => (
        <div
          key={student.id}
          className="card p-6 hover:shadow-medium transition-all duration-200 cursor-pointer"
          onClick={() => onStudentSelect(student)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-lg font-semibold text-white">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.studentId}</p>
              </div>
            </div>
            <span className={getStatusBadge(student.status).class}>
              {getStatusBadge(student.status).text}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Điểm trung bình</span>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${getPerformanceColor(student.averageScore)}`}>
                  {(student.averageScore || 0).toFixed(1)}
                </span>
                {student.scoreChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-success-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger-600" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Tiến độ hoàn thành</span>
                <span className="font-medium text-gray-900">{student.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${student.completionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mức độ rủi ro</span>
              <span className={`status-badge ${getRiskBadge(student.riskLevel).class}`}>
                {getRiskBadge(student.riskLevel).text}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{student.totalHours}h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{student.completedAssignments}/{student.totalAssignments}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href={`mailto:${student.email}`}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a 
                  href={`tel:${student.phone}`}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {student.riskLevel === 'high' && (
            <div className="mt-3 p-2 bg-danger-50 border border-danger-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-danger-600" />
                <span className="text-sm text-danger-800 font-medium">
                  Cần can thiệp ngay
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentGrid;