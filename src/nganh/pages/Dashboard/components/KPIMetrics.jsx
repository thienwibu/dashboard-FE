import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, BookOpen, Award, UserCheck, GraduationCap, Briefcase, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { mockDepartmentData, mockClassData, mockStudentTrackingData } from '../../../data/mockData';

function getClassesSummary() {
  const { classes } = mockClassData;
  const classSummaries = classes.map(c => ({
    name: c.name,
    course: c.course,
    enrolled: c.enrolledStudents,
    instructor: c.instructor,
  }));
  return classSummaries;
}

function getTeachersSummary() {
  return mockDepartmentData.teachers.map(t => ({
    name: t.name,
    specialization: t.specialization,
    position: t.position,
    classes: mockClassData.classes.filter(c => c.instructor === t.name).map(c => ({
      name: c.name,
      course: c.course
    }))
  }));
}

function getTodayClasses() {
  // Lấy ngày hiện tại tính theo giờ hệ thống
  const today = new Date();
  let day = today.getDay();
  // Thứ 0 là chủ nhật => 1 là thứ 2, ... 7 là chủ nhật
  // Trong data: schedule chuỗi 'Thứ 2, 4 ...', đổi về cùng format
  const todayLabel = ['Chủ nhật','Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][day];
  // Lấy ra những class có buổi học ngày hôm nay
  return mockClassData.classes
    .filter(c => c.schedule.includes(todayLabel))
    .map(c => ({
      ...c,
      time: c.schedule.match(/([0-9]{1,2}:[0-9]{2}-[0-9]{1,2}:[0-9]{2})/)?.[0] || '',
      session: c.schedule.includes('13:') || c.schedule.includes('16:') ? 'Chiều' : 'Sáng',
    }));
}

function getProgressStats() {
  // Công thức: TB ngành = TB các lớp, TB lớp = TB SV lớp đó (thang 10)
  const { classes } = mockClassData;
  let totalClassAvg = 0;
  let classCount = 0;
  classes.forEach(c => {
    totalClassAvg += c.averageScore;
    classCount += 1;
  });
  const departmentAvg = classCount ? (totalClassAvg / classCount).toFixed(2) : 0;
  return {
    departmentAvg,
    classAvgs: classes.map(cl => ({ name: cl.name, course: cl.course, avg: cl.averageScore })),
    explain: 'Điểm TB ngành (tuần) = điểm TB các lớp (thang 10). Mỗi lớp là trung bình các sinh viên lớp đó.'
  };
}

const KPIMetrics = ({ data }) => {
  const { isDarkMode } = useTheme();
  const [openModal, setOpenModal] = useState(null); // null, 'students', 'teachers', 'ongoing', 'progress'
  if (!data) return null;

  const metrics = [
    {
      title: 'Tổng Sinh Viên',
      value: data.totalStudents,
      change: data.studentChange,
      changeType: data.studentChange > 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      source: 'Từ Quản lý Sinh viên',
      modalName: 'students'
    },
    {
      title: 'Tổng Giảng Viên',
      value: data.totalTeachers,
      change: data.teacherChange,
      changeType: data.teacherChange > 0 ? 'increase' : 'decrease',
      icon: UserCheck,
      color: 'bg-green-50 text-green-600',
      source: 'Từ Quản lý Giảng viên',
      modalName: 'teachers'
    },
    {
      title: 'Các Lớp Đang Diễn Ra',
      value: data.ongoingClasses,
      change: data.classChange,
      changeType: data.classChange > 0 ? 'increase' : 'decrease',
      icon: BookOpen,
      color: 'bg-yellow-50 text-yellow-600',
      source: 'Từ Quản lý Lớp học',
      modalName: 'ongoing'
    },
    {
      title: 'Tỷ Lệ Tiến Độ Học Tập Trung Bình',
      value: `${data.averageProgress}%`,
      change: data.progressChange,
      changeType: data.progressChange > 0 ? 'increase' : 'decrease',
      icon: Award,
      color: 'bg-indigo-50 text-indigo-600',
      source: 'Tổng hợp từ tiến độ các lớp',
      modalName: 'progress'
    },
    {
      title: 'Tỷ Lệ Tốt Nghiệp',
      value: `${data.graduationRate}%`,
      change: data.graduationChange,
      changeType: data.graduationChange > 0 ? 'increase' : 'decrease',
      icon: GraduationCap,
      color: 'bg-purple-50 text-purple-600',
      source: 'Từ dữ liệu kết quả đào tạo',
      modalName: undefined
    },
    {
      title: 'Tỷ Lệ Có Việc Làm (sau tốt nghiệp)',
      value: `${data.employmentRate}%`,
      change: data.employmentChange,
      changeType: data.employmentChange > 0 ? 'increase' : 'decrease',
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-600',
      source: 'Báo cáo khảo sát cựu SV (nếu có)',
      modalName: undefined
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer`}
            onClick={() => metric.modalName && setOpenModal(metric.modalName)}
          >
            <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
                <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
              <div className="flex items-center">
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className={`text-sm ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>so với tháng trước</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <metric.icon className="h-6 w-6" />
              </div>
            </div>
            <div className={`text-xs border-t pt-2 ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}> 
              <span className="font-medium">Nguồn:</span> {metric.source}
              </div>
          </div>
        ))}
      </div>

      {/* Modal - Tổng Sinh Viên */}
      {openModal === 'students' && (
        <Modal onClose={() => setOpenModal(null)} title="Tổng Sinh Viên">
          <h4 className="font-semibold mb-2">Danh sách lớp và số sinh viên & giảng viên phụ trách</h4>
          <table className="min-w-full border text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-2 px-4 border">Lớp</th>
                <th className="py-2 px-4 border">Khóa học</th>
                <th className="py-2 px-4 border">Số SV</th>
                <th className="py-2 px-4 border">Giảng viên</th>
              </tr>
            </thead>
            <tbody>
              {getClassesSummary().map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="py-1 px-2 border">{row.name}</td>
                  <td className="py-1 px-2 border">{row.course}</td>
                  <td className="py-1 px-2 border">{row.enrolled}</td>
                  <td className="py-1 px-2 border">{row.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {/* Modal - Tổng Giáo Viên */}
      {openModal === 'teachers' && (
        <Modal onClose={() => setOpenModal(null)} title="Tổng Giảng Viên">
          <h4 className="font-semibold mb-2">Thông tin giảng viên & lớp/môn phụ trách</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-2 px-4 border">Tên GV</th>
                  <th className="py-2 px-4 border">Chuyên môn</th>
                  <th className="py-2 px-4 border">Lớp phụ trách</th>
                  <th className="py-2 px-4 border">Môn học</th>
                </tr>
              </thead>
              <tbody>
                {getTeachersSummary().map((teacher, i) =>
                  teacher.classes.length === 0 ? (
                    <tr key={teacher.name} className="text-center">
                      <td className="py-1 px-2 border">{teacher.name}</td>
                      <td className="py-1 px-2 border">{teacher.specialization}</td>
                      <td className="py-1 px-2 border text-gray-400 italic">-</td>
                      <td className="py-1 px-2 border text-gray-400 italic">-</td>
                    </tr>
                  ) : (
                    teacher.classes.map((cls, idx) => (
                      <tr key={teacher.name + idx} className="text-center">
                        {idx === 0 && (
                          <>
                            <td rowSpan={teacher.classes.length} className="py-1 px-2 border align-middle">{teacher.name}</td>
                            <td rowSpan={teacher.classes.length} className="py-1 px-2 border align-middle">{teacher.specialization}</td>
                          </>
                        )}
                        <td className="py-1 px-2 border">{cls.name}</td>
                        <td className="py-1 px-2 border">{cls.course}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
              </div>
        </Modal>
      )}

      {/* Modal - Các Lớp Đang Diễn Ra */}
      {openModal === 'ongoing' && (
        <Modal onClose={() => setOpenModal(null)} title="Các Lớp Đang Diễn Ra Hôm Nay">
          <h4 className="font-semibold mb-2">Danh sách lớp có buổi học hôm nay (thời gian chính xác)</h4>
          <table className="min-w-full border text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-2 px-4 border">Lớp</th>
                <th className="py-2 px-4 border">Môn học</th>
                <th className="py-2 px-4 border">Thời gian</th>
                <th className="py-2 px-4 border">Ca học</th>
                <th className="py-2 px-4 border">Phòng</th>
                <th className="py-2 px-4 border">Giảng viên</th>
              </tr>
            </thead>
            <tbody>
              {getTodayClasses().length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-gray-400 italic">Không có lớp nào đang diễn ra hôm nay.</td>
                </tr>
              ) : (
                getTodayClasses().map((row, i) => (
                  <tr key={i} className="text-center">
                    <td className="py-1 px-2 border">{row.name}</td>
                    <td className="py-1 px-2 border">{row.course}</td>
                    <td className="py-1 px-2 border">{row.time || row.schedule.split('-').slice(-1)[0].trim()}</td>
                    <td className="py-1 px-2 border">{row.session}</td>
                    <td className="py-1 px-2 border">{row.location}</td>
                    <td className="py-1 px-2 border">{row.instructor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Modal>
      )}

      {/* Modal - Tỷ Lệ Tiến Độ Học Tập Trung Bình */}
      {openModal === 'progress' && (
        <Modal onClose={() => setOpenModal(null)} title="Tỷ Lệ Tiến Độ Học Tập Trung Bình">
          {/*
            // Giải thích công thức tính điểm TB ngành:
            //   Điểm TB lớp = TB các sinh viên lớp đó; Điểm TB ngành = TB các lớp (thang 10)
            //   Công thức chuẩn hóa: S_{lớp, w} = TB(SV), S_{ngành, w} = TB(lớp)
            //   Điểm hiển thị là điểm tuần này
          */}
          <div className="mb-2">Điểm TB ngành tuần này (thang 10):
            <span className="font-semibold ml-2 text-blue-600 dark:text-blue-300 text-lg">{getProgressStats().departmentAvg}</span>
          </div>
          <table className="min-w-full border text-xs md:text-sm mb-2">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-2 px-4 border">Lớp</th>
                <th className="py-2 px-4 border">Môn học</th>
                <th className="py-2 px-4 border">Điểm TB lớp</th>
              </tr>
            </thead>
            <tbody>
              {getProgressStats().classAvgs.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="py-1 px-2 border">{item.name}</td>
                  <td className="py-1 px-2 border">{item.course}</td>
                  <td className="py-1 px-2 border">{item.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </>
  );
};

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 relative animate-fadeIn"
        style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <button onClick={onClose} className="absolute right-2 top-2 text-gray-500 hover:text-blue-500">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold mb-3 dark:text-white pr-8">{title}</h3>
        <div className="flex-1 overflow-y-auto pr-2" style={{ minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default KPIMetrics;