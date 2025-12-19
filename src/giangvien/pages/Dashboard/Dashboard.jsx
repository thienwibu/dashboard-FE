import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import KPIMetrics from './components/KPIMetrics';
import ProgressOverview from './components/ProgressOverview';
import CourseMonitoring from './components/CourseMonitoring';
import NotificationPanel from './components/NotificationPanel';
import PerformanceChart from './components/PerformanceChart';
import GradeDistribution from './components/GradeDistribution';
import { mockDashboardData, mockStudentTrackingData, mockClassData } from '../../data/mockData';
import dataService from '../../services/dataService';
import localStorageService from '../../services/localStorageService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    class: 'all',
    performance: 'all',
    status: 'all'
  });

  useEffect(() => {
    loadDashboardData();
    
    // Lắng nghe sự kiện refresh
    const handleRefresh = () => loadDashboardData();
    window.addEventListener('dataRefresh', handleRefresh);
    
    return () => window.removeEventListener('dataRefresh', handleRefresh);
  }, [filters]);

  /**
   * Tính toán progressOverview từ dữ liệu thực tế của sinh viên
   * 
   * Logic phân loại trạng thái sinh viên theo từng môn học:
   * - Hoàn thành (completed): completionRate >= 100% (hoàn thành tất cả bài tập của môn)
   * - Đang học (inProgress): 0% < completionRate < 100% (đã làm ít nhất 1 bài)
   * - Chưa bắt đầu (notStarted): completionRate === 0% (chưa làm bài nào)
   * 
   * Dữ liệu được lấy từ:
   * - classDetails[classId].students[].completionRate: tỷ lệ hoàn thành bài tập của sinh viên trong lớp đó
   * 
   * Cấu trúc dữ liệu:
   * - Mỗi lớp (class) có: id, name (22CT111/22CT112/22CT113), course (tên môn học)
   * - classDetails[classId].students: danh sách sinh viên trong lớp với completionRate
   */
  /**
   * Lấy danh sách sinh viên chi tiết theo lớp để hiển thị trong modal
   * Mỗi sinh viên sẽ có thông tin courses với progress của từng môn
   */
  const getStudentDetails = () => {
    const storedClassDetails = localStorageService.getClassDetails() || mockClassData.classDetails;
    const storedClasses = localStorageService.getClasses() || mockClassData.classes;
    
    // Tạo map sinh viên với thông tin courses
    const buildStudentList = (filterClassName) => {
      const studentMap = new Map();
      
      storedClasses.forEach(classItem => {
        // Lọc theo tên lớp nếu có
        if (filterClassName && classItem.name !== filterClassName) return;
        
        const classDetail = storedClassDetails[classItem.id];
        if (!classDetail || !classDetail.students) return;
        
        classDetail.students.forEach(student => {
          const existingStudent = studentMap.get(student.id);
          
          const courseInfo = {
            name: classItem.course,
            progress: student.completionRate || 0,
            score: student.averageScore || 0,
            className: classItem.name
          };
          
          if (existingStudent) {
            // Thêm môn học vào danh sách courses của sinh viên
            existingStudent.courses.push(courseInfo);
          } else {
            // Tạo mới sinh viên với thông tin courses
            studentMap.set(student.id, {
              ...student,
              courses: [courseInfo]
            });
          }
        });
      });
      
      return Array.from(studentMap.values());
    };
    
    return {
      all: buildStudentList(null),
      '22CT111': buildStudentList('22CT111'),
      '22CT112': buildStudentList('22CT112'),
      '22CT113': buildStudentList('22CT113')
    };
  };

  const calculateProgressOverview = () => {
    const storedClassDetails = localStorageService.getClassDetails() || mockClassData.classDetails;
    const storedClasses = localStorageService.getClasses() || mockClassData.classes;
    
    // Danh sách các môn học
    const courseNames = [
      'Nhập môn lập trình',
      'Kĩ thuật lập trình', 
      'Lập trình hướng đối tượng',
      'Cấu trúc dữ liệu và giải thuật'
    ];
    
    // Tính toán cho một nhóm lớp (theo tên lớp hoặc tất cả)
    const calculateForClassName = (filterClassName) => {
      return courseNames.map(courseName => {
        let completed = 0;
        let inProgress = 0;
        let notStarted = 0;
        
        // Tìm các lớp dạy môn này (và lọc theo tên lớp nếu có)
        const matchingClasses = storedClasses.filter(c => {
          const matchesCourse = c.course === courseName;
          const matchesClassName = !filterClassName || c.name === filterClassName;
          return matchesCourse && matchesClassName;
        });
        
        // Đếm sinh viên theo trạng thái trong các lớp này
        matchingClasses.forEach(classItem => {
          const classDetail = storedClassDetails[classItem.id];
          if (classDetail && classDetail.students) {
            classDetail.students.forEach(student => {
              const rate = student.completionRate || 0;
              
              // Logic phân loại:
              // - >= 100%: Hoàn thành (đã làm hết bài tập)
              // - > 0% và < 100%: Đang học (đã làm một số bài)
              // - = 0%: Chưa bắt đầu (chưa làm bài nào)
              if (rate >= 100) {
                completed++;
              } else if (rate > 0) {
                inProgress++;
              } else {
                notStarted++;
              }
            });
          }
        });
        
        return {
          course: courseName,
          completed,
          inProgress,
          notStarted
        };
      });
    };
    
    return {
      all: calculateForClassName(null),           // Tất cả các lớp
      '22CT111': calculateForClassName('22CT111'), // Chỉ lớp 22CT111
      '22CT112': calculateForClassName('22CT112'), // Chỉ lớp 22CT112
      '22CT113': calculateForClassName('22CT113')  // Chỉ lớp 22CT113
    };
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Lấy dữ liệu thực tế từ dataService
      const modules = dataService.getModules();
      const stats = dataService.getOverviewStats();
      const students = dataService.getStudents();
      
      // Tính toán progressOverview từ dữ liệu thực tế
      const calculatedProgressOverview = calculateProgressOverview();
      const studentDetails = getStudentDetails();
      
      // Cập nhật mockDashboardData với số liệu thực tế
      const updatedData = {
        ...mockDashboardData,
        progressOverview: calculatedProgressOverview, // Sử dụng dữ liệu tính toán thực tế
        studentDetails: studentDetails, // Danh sách sinh viên chi tiết cho modal
        courseMonitoring: modules.slice(0, 4).map(m => ({
          name: m.title,
          enrolledStudents: m.students,
          completionRate: m.progress,
          averageScore: m.avgScore || 7.5,
          duration: m.duration
        })),
        totalStudents: stats.totalStudents,
        totalCourses: stats.totalModules,
        averageProgress: stats.averageProgress
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setDashboardData(updatedData);
      
      console.log('📊 Dashboard loaded with real data:', stats);
      console.log('📈 Progress Overview calculated:', calculatedProgressOverview);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(mockDashboardData);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="card p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        filters={filters} 
        onFilterChange={handleFilterChange}
      />
      
      <KPIMetrics data={dashboardData?.kpiMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProgressOverview 
            data={dashboardData?.progressOverview} 
            selectedClass={filters.class}
            studentDetails={dashboardData?.studentDetails}
          />
          <GradeDistribution 
            data={dashboardData?.gradeDistribution} 
            students={mockStudentTrackingData?.students || []}
          />
          <PerformanceChart data={dashboardData?.performanceChart} />
        </div>
        
        <div className="space-y-6">
          <CourseMonitoring data={dashboardData?.courseMonitoring} />
          <NotificationPanel data={dashboardData?.notifications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;