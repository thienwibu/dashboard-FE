import api from './api';

export const searchService = {
  // Tìm kiếm tất cả
  searchAll: async (query) => {
    try {
      const response = await api.get('/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      return { results: [] };
    }
  },

  // Tìm sinh viên theo MSSV hoặc tên
  searchStudents: async (query) => {
    try {
      const response = await api.get('/students/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Search students error:', error);
      return { students: [] };
    }
  },

  // Tìm khóa học
  searchCourses: async (query) => {
    try {
      const response = await api.get('/courses/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Search courses error:', error);
      return { courses: [] };
    }
  },

  // Tìm lớp học
  searchClasses: async (query) => {
    try {
      const response = await api.get('/classes/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Search classes error:', error);
      return { classes: [] };
    }
  },

  // Lấy thông tin sinh viên theo MSSV
  getStudentByMSSV: async (mssv) => {
    try {
      const response = await api.get(`/students/mssv/${mssv}`);
      return response.data;
    } catch (error) {
      console.error('Get student error:', error);
      return null;
    }
  }
};
