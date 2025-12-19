import React from 'react';
import { Mail, Phone, TrendingUp, TrendingDown, Clock, Award, AlertTriangle, MoreVertical, Eye, Trash2 } from 'lucide-react';
import dataService from '../../../services/dataService';

const StudentList = ({ students, onStudentSelect, loading, onStudentDeleted }) => {
  
  const handleDeleteStudent = (e, student) => {
    e.stopPropagation();
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên "${student.name}"?\n\nLưu ý: Hành động này không thể hoàn tác!`)) {
      if (dataService.deleteStudent(student.id)) {
        dataService.refresh();
        if (onStudentDeleted) onStudentDeleted();
        console.log('✅ Đã xóa sinh viên:', student.name);
      } else {
        alert('Có lỗi xảy ra khi xóa sinh viên. Vui lòng thử lại!');
      }
    }
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang học' },
      at_risk: { class: 'status-badge status-at-risk', text: 'Có nguy cơ' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      dropped: { class: 'status-badge bg-gray-100 text-gray-600', text: 'Đã bỏ học' }
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Không tìm thấy sinh viên nào
        </h3>
        <p className="text-gray-500">
          Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Sinh viên
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Điểm TB
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tiến độ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Rủi ro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Liên hệ
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr 
                key={student.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onStudentSelect(student)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-700">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.studentId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(student.status).class}>
                    {getStatusBadge(student.status).text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getPerformanceColor(student.averageScore)}`}>
                      {(student.averageScore || 0).toFixed(1)}
                    </span>
                    {student.scoreChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-danger-600" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full max-w-xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">{student.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary-600 h-1.5 rounded-full"
                        style={{ width: `${student.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`status-badge ${getRiskBadge(student.riskLevel).class}`}>
                    {getRiskBadge(student.riskLevel).text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStudentSelect(student);
                      }}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      onClick={(e) => handleDeleteStudent(e, student)}
                      title="Xóa sinh viên"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
