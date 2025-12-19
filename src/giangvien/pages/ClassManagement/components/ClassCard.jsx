import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, MoreVertical, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddNewStudentModal from './AddNewStudentModal';
import localStorageService from '../../../services/localStorageService';
import { mockClassData } from '../../../data/mockData';

const ClassCard = ({ classData, onAddStudent }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAssignmentsCount, setActiveAssignmentsCount] = useState(0);

  // Tính số bài tập đang mở từ classDetails thực tế
  useEffect(() => {
    const storedClassDetails = localStorageService.getClassDetails();
    const details = storedClassDetails?.[classData.id] || mockClassData.classDetails?.[classData.id];
    
    if (details?.assignments) {
      const activeCount = details.assignments.filter(a => a.status === 'active').length;
      setActiveAssignmentsCount(activeCount);
    } else {
      setActiveAssignmentsCount(classData.activeAssignments || 0);
    }
  }, [classData.id, classData.activeAssignments]);

  const handleAddStudent = (studentData) => {
    // Gọi callback từ parent để cập nhật state
    if (onAddStudent) {
      onAddStudent(classData.id, studentData);
    }
    
    // Hiển thị thông báo thành công
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>✅ Đã thêm sinh viên ${studentData.name} vào lớp ${classData.name}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang diễn ra' },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp diễn ra' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      cancelled: { class: 'status-badge status-at-risk', text: 'Đã hủy' }
    };
    
    return statusConfig[status] || statusConfig.active;
  };

  const getPerformanceColor = (score) => {
    if (score >= 8.0) return 'text-success-600';      // Giỏi
    if (score >= 6.5) return 'text-primary-600';      // Khá
    if (score >= 5.0) return 'text-warning-600';      // Trung bình
    if (score >= 4.0) return 'text-orange-600';       // Yếu
    return 'text-danger-600';                          // Kém
  };

  const getCompletionColor = (rate) => {
    if (rate >= 8.0) return 'bg-success-600';
    if (rate >= 7.0) return 'bg-primary-600';
    if (rate >= 6.0) return 'bg-warning-600';
    return 'bg-danger-600';
  };

  return (
    <div className="card p-6 hover:shadow-medium transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
              {classData.name}
            </h3>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{classData.course}</p>
          <span className={getStatusBadge(classData.status).class}>
            {getStatusBadge(classData.status).text}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>{classData.enrolledStudents} sinh viên</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span className={`font-medium ${getPerformanceColor(classData.averageScore || 0)}`}>
              {(classData.averageScore || 0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Tiến độ hoàn thành</span>
            <span className="font-medium text-gray-700">{Math.round(classData.completionRate || 0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor(classData.completionRate || 0)}`}
              style={{ width: `${classData.completionRate || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">{activeAssignmentsCount}</span> bài tập đang mở
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              <UserPlus className="h-4 w-4" />
              <span>Thêm SV</span>
            </button>
            
            <Link 
              to={`/classes/${classData.id}`}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Chi tiết →
            </Link>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddNewStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStudent}
        classData={classData}
      />
    </div>
  );
};

export default ClassCard;