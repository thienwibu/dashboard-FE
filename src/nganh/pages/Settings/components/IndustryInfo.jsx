import React from 'react';
import { Building2, Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';

const IndustryInfo = ({ departmentInfo = {} }) => {
  const info = {
    name: departmentInfo.name || 'Khoa Công nghệ Thông tin',
    code: departmentInfo.code || 'CNTT',
    totalTeachers: departmentInfo.totalTeachers || 25,
    totalStudents: departmentInfo.totalStudents || 350,
    totalCourses: departmentInfo.totalCourses || 12,
    manager: departmentInfo.manager || 'TS. Nguyễn Văn An'
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-xl">
          <Building2 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thông tin Ngành</h2>
          <p className="text-sm text-gray-600">Thông tin tổng quan về ngành học</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Tên ngành</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{info.name}</p>
          <p className="text-xs text-gray-500 mt-1">Mã: {info.code}</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Giảng viên</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{info.totalTeachers}</p>
          <p className="text-xs text-gray-500 mt-1">Giảng viên hiện tại</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Sinh viên</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{info.totalStudents}</p>
          <p className="text-xs text-gray-500 mt-1">Sinh viên toàn ngành</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Khóa học</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{info.totalCourses}</p>
          <p className="text-xs text-gray-500 mt-1">Khóa học đang mở</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-600">Người phụ trách: </span>
          <span className="text-sm font-semibold text-gray-900">{info.manager}</span>
        </div>
      </div>
    </div>
  );
};

export default IndustryInfo;

