import React from 'react';
import { X, User, Mail, Phone, GraduationCap, Users, Calendar, Clock, MapPin } from 'lucide-react';
import { mockDepartmentData, mockClassData } from '../../../data/mockData';

const ClassDetailModal = ({ classItem, onClose }) => {
  if (!classItem) return null;

  // Lấy thông tin giảng viên
  const instructor = mockDepartmentData.teachers.find(
    t => t.name === classItem.instructor
  ) || null;

  // Lấy thông tin sinh viên
  const classDetails = mockClassData.classDetails[classItem.id];
  const students = classDetails?.students || [];

  // Lấy ngày hôm nay
  const today = new Date();
  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const todayDay = today.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
  const todayName = dayNames[todayDay];

  // Kiểm tra xem hôm nay có giảng viên nào dạy không (dựa trên schedule)
  const hasClassToday = classItem.schedule && (
    classItem.schedule.includes(todayName) ||
    (classItem.schedule.includes('Thứ 2, 4') && (todayDay === 1 || todayDay === 3)) ||
    (classItem.schedule.includes('Thứ 3, 5') && (todayDay === 2 || todayDay === 4)) ||
    (classItem.schedule.includes('Thứ 6') && todayDay === 5) ||
    (classItem.schedule.includes('Thứ 7') && todayDay === 6)
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{classItem.name}</h2>
            <p className="text-gray-600 mt-1">{classItem.course}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Giảng Viên Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Giảng Viên</h3>
            {hasClassToday && (
              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                Dạy hôm nay
              </span>
            )}
          </div>
          
          {instructor ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {instructor.name.split(' ').pop().charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{instructor.name}</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {instructor.position}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{instructor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{instructor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{instructor.specialization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Lịch: {classItem.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{classItem.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center text-gray-500">
              Không tìm thấy thông tin giảng viên
            </div>
          )}
        </div>

        {/* Sinh Viên Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Danh Sách Sinh Viên ({students.length} sinh viên)
            </h3>
          </div>

          {students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {student.name.split(' ').pop().charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 mb-1 truncate">
                        {student.name}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Mã SV:</span>
                          <span>{student.studentId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{student.phone}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <div>
                            <span className="text-xs text-gray-500">Tiến độ:</span>
                            <span className={`ml-1 font-semibold ${
                              student.completionRate >= 80 ? 'text-emerald-600' :
                              student.completionRate >= 60 ? 'text-amber-600' :
                              'text-rose-600'
                            }`}>
                              {student.completionRate}%
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Điểm TB:</span>
                            <span className={`ml-1 font-semibold ${
                              student.averageScore >= 8 ? 'text-emerald-600' :
                              student.averageScore >= 6 ? 'text-amber-600' :
                              'text-rose-600'
                            }`}>
                              {student.averageScore?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Chưa có sinh viên nào trong lớp này</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailModal;

