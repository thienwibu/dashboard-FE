import React, { useState, useMemo } from 'react';
import { Download, ArrowUpDown, ArrowUp, ArrowDown, Users, BookOpen, GraduationCap } from 'lucide-react';

const DetailedDataTable = ({ courses = [], classes = [], students = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedView, setSelectedView] = useState('courses'); // 'courses', 'classes', 'students'

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Mock data for courses table
  const coursesData = useMemo(() => {
    let sorted = [...courses];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key] || 0;
        const bVal = b[sortConfig.key] || 0;
        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
    }
    return sorted;
  }, [courses, sortConfig]);

  // Mock data for classes table
  const classesData = useMemo(() => {
    const mockClasses = [
      { id: 1, name: '22CT111', course: 'Nhập môn lập trình', instructor: 'TS. Nguyễn Văn An', students: 30, completion: 85, avgScore: 8.2 },
      { id: 2, name: '22CT112', course: 'Kĩ thuật lập trình', instructor: 'TS. Trần Thị Bình', students: 28, completion: 78, avgScore: 7.8 },
      { id: 3, name: '22CT113', course: 'Lập trình hướng đối tượng', instructor: 'TS. Lê Văn Cường', students: 32, completion: 82, avgScore: 8.0 },
      { id: 4, name: '22CT114', course: 'CTDL&GT', instructor: 'TS. Nguyễn Văn An', students: 30, completion: 73, avgScore: 7.5 },
    ];
    let sorted = [...mockClasses];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key] || 0;
        const bVal = b[sortConfig.key] || 0;
        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
    }
    return sorted;
  }, [sortConfig]);

  const handleExport = () => {
    alert('Tính năng xuất dữ liệu sẽ được triển khai');
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-blue-600" />
      : <ArrowDown className="h-3 w-3 text-blue-600" />;
  };

  const renderCoursesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1">
                Khóa học
                {getSortIcon('name')}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('enrolledStudents')}
            >
              <div className="flex items-center gap-1">
                Sinh viên
                {getSortIcon('enrolledStudents')}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('completionRate')}
            >
              <div className="flex items-center gap-1">
                Hoàn thành
                {getSortIcon('completionRate')}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('averageScore')}
            >
              <div className="flex items-center gap-1">
                Điểm TB
                {getSortIcon('averageScore')}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coursesData.map((course) => (
            <tr key={course.id || course.name} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {course.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {course.enrolledStudents || 0}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>{course.completionRate || 0}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-full rounded-full ${
                        (course.completionRate || 0) >= 80 ? 'bg-green-500' : 
                        (course.completionRate || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${course.completionRate || 0}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                {course.averageScore?.toFixed(1) || '0.0'}/10
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  course.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {course.status === 'active' ? 'Đang hoạt động' : 'Kết thúc'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderClassesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lớp
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khóa học
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giảng viên
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sinh viên
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hoàn thành
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Điểm TB
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classesData.map((classItem) => (
            <tr key={classItem.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {classItem.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {classItem.course}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {classItem.instructor}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {classItem.students}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>{classItem.completion}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-full rounded-full ${
                        classItem.completion >= 80 ? 'bg-green-500' : 
                        classItem.completion >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${classItem.completion}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                {classItem.avgScore.toFixed(1)}/10
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bảng Dữ Liệu Chi Tiết</h3>
          <p className="text-sm text-gray-600">Xem và phân tích dữ liệu chi tiết</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Xuất Excel
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedView('courses')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            selectedView === 'courses'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Khóa học ({courses.length})
          </div>
        </button>
        <button
          onClick={() => setSelectedView('classes')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            selectedView === 'classes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Lớp học ({classesData.length})
          </div>
        </button>
        <button
          onClick={() => setSelectedView('students')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            selectedView === 'students'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sinh viên ({students.length || 0})
          </div>
        </button>
      </div>

      {/* Table Content */}
      <div className="mt-4">
        {selectedView === 'courses' && renderCoursesTable()}
        {selectedView === 'classes' && renderClassesTable()}
        {selectedView === 'students' && (
          <div className="text-center py-12 text-gray-500">
            <p>Bảng dữ liệu sinh viên sẽ được hiển thị ở đây</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedDataTable;

