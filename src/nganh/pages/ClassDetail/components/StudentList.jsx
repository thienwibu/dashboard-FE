import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, TrendingUp, TrendingDown } from 'lucide-react';

const StudentList = ({ students, classId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang học' },
      at_risk: { class: 'status-badge status-at-risk', text: 'Có nguy cơ' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      dropped: { class: 'status-badge bg-gray-100 text-gray-800', text: 'Đã bỏ học' }
    };
    
    return statusConfig[status] || statusConfig.active;
  };

  const getPerformanceColor = (score) => {
    if (score >= 9.0) return 'text-success-600';
    if (score >= 8.0) return 'text-primary-600';
    if (score >= 7.0) return 'text-warning-600';
    return 'text-danger-600';
  };

  const filteredAndSortedStudents = students
    ?.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.averageScore - a.averageScore;
        case 'progress':
          return b.completionRate - a.completionRate;
        default:
          return 0;
      }
    }) || [];

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang học</option>
              <option value="at_risk">Có nguy cơ</option>
              <option value="completed">Hoàn thành</option>
              <option value="dropped">Đã bỏ học</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="score">Sắp xếp theo điểm</option>
              <option value="progress">Sắp xếp theo tiến độ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
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
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-900">{Math.round(student.completionRate || 0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.completionRate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getPerformanceColor(student.averageScore || 0)}`}>
                        {(student.averageScore || 0).toFixed(1)}
                      </span>
                      {student.scoreChange > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success-600 ml-2" />
                      ) : student.scoreChange < 0 ? (
                        <TrendingDown className="h-4 w-4 text-danger-600 ml-2" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <span className="font-medium">{student.completedAssignments}</span>
                      <span className="text-gray-500">/{student.totalAssignments}</span>
                    </div>
                    <div className="text-xs text-gray-500">hoàn thành</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <a 
                        href={`mailto:${student.email}`}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a 
                        href={`tel:${student.phone}`}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedStudents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy sinh viên nào
          </h3>
          <p className="text-gray-500">
            Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentList;