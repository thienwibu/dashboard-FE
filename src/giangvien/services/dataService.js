/**
 * Service quản lý dữ liệu tập trung cho toàn bộ hệ thống giảng viên
 * Đảm bảo tính đồng bộ và nhất quán giữa các trang
 */

import localStorageService from './localStorageService';
import { mockDashboardData } from '../data/mockData';

const dataService = {
  /**
   * Lấy danh sách sinh viên thực tế
   */
  getStudents: () => {
    return localStorageService.getStudents() || [];
  },

  /**
   * Lấy danh sách lớp học
   */
  getClasses: () => {
    return localStorageService.getClasses() || [];
  },

  /**
   * Tính số sinh viên theo lớp
   */
  getStudentCountByClass: (classId) => {
    const students = dataService.getStudents();
    return students.filter(s => s.classId === classId).length;
  },

  /**
   * Tính tổng số sinh viên
   */
  getTotalStudents: () => {
    return dataService.getStudents().length;
  },

  /**
   * Lấy danh sách môn học (từ cả mockData và localStorage)
   */
  getModules: () => {
    const students = dataService.getStudents();
    const totalStudents = students.length;

    // Load từ mockData
    const mockModules = mockDashboardData.courseMonitoring?.map((course, index) => {
      const progress = course.completionRate || 0;
      let status = 'pending';
      if (progress === 100) status = 'completed';
      else if (progress > 0) status = 'in-progress';

      const icons = ['📚', '💻', '🔢', '🌐'];
      
      return {
        id: index + 1,
        name: course.name,
        title: course.name,
        icon: icons[index % icons.length],
        progress: progress,
        status: status,
        students: totalStudents, // Số sinh viên thực tế
        enrolledStudents: totalStudents,
        duration: course.duration || '12 tuần',
        completionRate: progress,
        totalWeeks: parseInt(course.duration) || 12,
        source: 'mock'
      };
    }) || [];

    // Load từ localStorage
    const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
    const customModules = storedModules.map(m => {
      // Tính số sinh viên dựa trên lớp đã chọn
      let moduleStudents = totalStudents;
      if (m.selectedClasses && m.selectedClasses.length > 0) {
        moduleStudents = m.selectedClasses.reduce((sum, classId) => {
          return sum + dataService.getStudentCountByClass(classId);
        }, 0);
      }

      return {
        ...m,
        title: m.name,
        icon: m.icon || '📚',
        students: moduleStudents,
        enrolledStudents: moduleStudents,
        totalWeeks: m.totalWeeks || 12,
        duration: `${m.totalWeeks || 12} tuần`,
        progress: m.progress || 0,
        completionRate: m.progress || 0,
        source: 'custom'
      };
    });

    return [...mockModules, ...customModules];
  },

  /**
   * Lấy thông tin một môn học theo ID
   */
  getModuleById: (id) => {
    const modules = dataService.getModules();
    return modules.find(m => m.id === parseInt(id));
  },

  /**
   * Thêm môn học mới
   */
  addModule: (moduleData) => {
    try {
      const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
      
      // Tạo ID mới
      const maxId = Math.max(
        ...storedModules.map(m => m.id),
        4 // ID của mockData modules
      );
      
      const newModule = {
        ...moduleData,
        id: maxId + 1,
        createdAt: new Date().toISOString()
      };
      
      storedModules.push(newModule);
      localStorage.setItem('giangvien_modules', JSON.stringify(storedModules));
      
      console.log('✅ Đã thêm môn học:', newModule.name);
      return newModule;
    } catch (error) {
      console.error('❌ Lỗi khi thêm môn học:', error);
      return null;
    }
  },

  /**
   * Cập nhật môn học
   */
  updateModule: (moduleId, updates) => {
    try {
      const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
      const index = storedModules.findIndex(m => m.id === moduleId);
      
      if (index >= 0) {
        storedModules[index] = {
          ...storedModules[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('giangvien_modules', JSON.stringify(storedModules));
        console.log('✅ Đã cập nhật môn học');
        return storedModules[index];
      }
      return null;
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật môn học:', error);
      return null;
    }
  },

  /**
   * Xóa môn học
   */
  deleteModule: (moduleId) => {
    try {
      const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
      const filteredModules = storedModules.filter(m => m.id !== moduleId);
      localStorage.setItem('giangvien_modules', JSON.stringify(filteredModules));
      console.log('✅ Đã xóa môn học');
      return true;
    } catch (error) {
      console.error('❌ Lỗi khi xóa môn học:', error);
      return false;
    }
  },

  /**
   * Lấy thống kê tổng quan
   */
  getOverviewStats: () => {
    const modules = dataService.getModules();
    const students = dataService.getStudents();
    const classes = dataService.getClasses();

    return {
      totalModules: modules.length,
      completedModules: modules.filter(m => m.status === 'completed').length,
      inProgressModules: modules.filter(m => m.status === 'in-progress').length,
      pendingModules: modules.filter(m => m.status === 'pending').length,
      totalStudents: students.length,
      totalClasses: classes.length,
      averageProgress: modules.length > 0 
        ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
        : 0
    };
  },

  /**
   * Refresh dữ liệu - gọi khi có thay đổi
   */
  refresh: () => {
    // Trigger event để các component reload
    window.dispatchEvent(new Event('dataRefresh'));
  }
};

export default dataService;
