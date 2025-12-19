import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Clock, Calendar, BookOpen, Plus,
  FileText, CheckCircle, Play
} from 'lucide-react';
import { mockDashboardData } from '../../data/mockData';
import AddWeekContentModal from './components/AddWeekContentModal';
import dataService from '../../services/dataService';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [showContentModal, setShowContentModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ weekId: null, contentType: null });

  useEffect(() => {
    loadModule();
    
    // Lắng nghe sự kiện refresh
    const handleRefresh = () => loadModule();
    window.addEventListener('dataRefresh', handleRefresh);
    
    return () => window.removeEventListener('dataRefresh', handleRefresh);
  }, [id]);

  const loadModule = () => {
    try {
      // Load từ localStorage trước
      const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
      let foundModule = storedModules.find(m => m.id === parseInt(id));
      
      // Cập nhật số sinh viên thực tế
      if (foundModule) {
        const totalStudents = dataService.getTotalStudents();
        foundModule.enrolledStudents = totalStudents;
        foundModule.students = totalStudents;
      }

      // Nếu không tìm thấy, load từ mockData
      if (!foundModule) {
        const courseIndex = parseInt(id) - 1;
        const course = mockDashboardData.courseMonitoring?.[courseIndex];
        
        if (course) {
          // Convert course từ mockData sang format module
          const totalStudents = dataService.getTotalStudents();
          foundModule = {
            id: parseInt(id),
            name: course.name,
            description: `Khóa học ${course.name}`,
            duration: course.duration,
            enrolledStudents: totalStudents, // Số sinh viên thực tế
            completionRate: course.completionRate,
            averageScore: course.averageScore,
            status: course.completionRate === 100 ? 'completed' : course.completionRate > 0 ? 'in-progress' : 'pending',
            weeks: [] // Sẽ được tạo bên dưới
          };

          // Tạo weeks nếu chưa có với tên bài học cụ thể
          const weekCount = parseInt(course.duration) || 12;
          
          // Mapping tên bài học cho từng khóa
          const weekTopics = {
            'Nhập môn lập trình': [
              'Giới thiệu lập trình và Python',
              'Biến, kiểu dữ liệu và toán tử',
              'Cấu trúc điều khiển (if-else, loops)',
              'Hàm và module',
              'Danh sách và tuple',
              'Dictionary và set',
              'Xử lý file',
              'Exception handling',
              'OOP cơ bản',
              'Thư viện chuẩn',
              'Dự án thực hành',
              'Tổng kết và kiểm tra'
            ],
            'Kĩ thuật lập trình': [
              'Con trỏ cơ bản',
              'Toán tử con trỏ và mảng',
              'Con trỏ và hàm',
              'Cấp phát động bộ nhớ',
              'Struct và union',
              'File I/O',
              'Xử lý chuỗi nâng cao',
              'Linked list',
              'Stack và queue',
              'Debugging và testing'
            ],
            'Lập trình hướng đối tượng': [
              'Giới thiệu OOP',
              'Class và object',
              'Constructor và destructor',
              'Encapsulation',
              'Inheritance (Kế thừa)',
              'Polymorphism (Đa hình)',
              'Abstract class và interface',
              'Exception handling trong OOP',
              'Design patterns cơ bản',
              'SOLID principles',
              'Unit testing',
              'Dự án OOP',
              'Best practices',
              'Code review',
              'Refactoring',
              'Final project'
            ],
            'Cấu trúc dữ liệu và giải thuật': [
              'Giới thiệu CTDL & GT',
              'Array và linked list',
              'Stack và queue',
              'Tree cơ bản',
              'Binary search tree',
              'AVL tree',
              'Heap và priority queue',
              'Graph cơ bản',
              'Graph traversal (DFS, BFS)',
              'Sorting algorithms',
              'Searching algorithms',
              'Dynamic programming'
            ]
          };
          
          const topics = weekTopics[course.name] || Array(weekCount).fill(null).map((_, i) => `Bài học ${i + 1}`);
          
          foundModule.weeks = Array.from({ length: weekCount }, (_, i) => ({
            id: i + 1,
            title: topics[i] || `Bài học ${i + 1}`,
            description: '',
            status: 'pending',
            materials: [],
            assignments: [],
            videos: []
          }));
        }
      }

      setModule(foundModule);
    } catch (error) {
      console.error('❌ Lỗi khi load module:', error);
      setModule(null);
    }
  };

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  const handleAddContent = (weekId, type) => {
    console.log(`Mở modal thêm ${type} cho tuần ${weekId}`);
    setModalConfig({ weekId, contentType: type });
    setShowContentModal(true);
  };

  const handleSaveContent = (weekId, contentType, newContent) => {
    console.log('Thêm nội dung mới:', { weekId, contentType, newContent });
    
    setModule(prev => {
      const updatedWeeks = prev.weeks.map(week => {
        if (week.id === weekId) {
          let arrayKey = 'materials';
          if (contentType === 'video') arrayKey = 'videos';
          else if (contentType === 'assignment') arrayKey = 'assignments';
          
          return {
            ...week,
            [arrayKey]: [...(week[arrayKey] || []), newContent]
          };
        }
        return week;
      });
      
      const updatedModule = { ...prev, weeks: updatedWeeks };
      
      // Lưu vào localStorage
      const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
      const moduleIndex = storedModules.findIndex(m => m.id === prev.id);
      
      if (moduleIndex >= 0) {
        storedModules[moduleIndex] = updatedModule;
        localStorage.setItem('giangvien_modules', JSON.stringify(storedModules));
        console.log('✅ Đã lưu nội dung vào localStorage');
      }
      
      return updatedModule;
    });
  };

  const handleUpdateWeek = (weekId, field, value) => {
    setModule(prev => {
      const updatedWeeks = prev.weeks.map(week =>
        week.id === weekId ? { ...week, [field]: value } : week
      );
      
      const updatedModule = { ...prev, weeks: updatedWeeks };
      
      // Lưu vào localStorage
      const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
      const moduleIndex = storedModules.findIndex(m => m.id === prev.id);
      
      if (moduleIndex >= 0) {
        storedModules[moduleIndex] = updatedModule;
        localStorage.setItem('giangvien_modules', JSON.stringify(storedModules));
      }
      
      return updatedModule;
    });
  };

  const handleDeleteModule = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${module.name}"?\n\nLưu ý: Hành động này không thể hoàn tác!`)) {
      try {
        // Xóa khỏi localStorage
        const storedModules = JSON.parse(localStorage.getItem('giangvien_modules') || '[]');
        const filteredModules = storedModules.filter(m => m.id !== module.id);
        localStorage.setItem('giangvien_modules', JSON.stringify(filteredModules));
        
        console.log('✅ Đã xóa môn học:', module.name);
        
        // Quay về trang danh sách
        navigate('/learning-path');
      } catch (error) {
        console.error('❌ Lỗi khi xóa môn học:', error);
        alert('Có lỗi xảy ra khi xóa môn học. Vui lòng thử lại!');
      }
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành', icon: CheckCircle },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang học', icon: Play },
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Chưa bắt đầu', icon: Clock }
    };
    return config[status] || config.pending;
  };

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(module.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/learning-path')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-700 flex items-center space-x-3">
              <span className="text-4xl">📚</span>
              <span>{module.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">{module.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-lg ${statusInfo.bg} ${statusInfo.text} flex items-center space-x-2`}>
            <StatusIcon className="h-4 w-4" />
            <span className="font-medium">{statusInfo.label}</span>
          </div>
          
          {/* NÚT XÓA MÔN HỌC - LUÔN HIỂN THỊ */}
          <button
            onClick={handleDeleteModule}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl font-semibold text-base border-2 border-red-700"
            title="Xóa môn học này"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>XÓA MÔN HỌC</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Số tuần</p>
              <p className="text-2xl font-bold text-blue-600">{module.weeks?.length || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sinh viên</p>
              <p className="text-2xl font-bold text-green-600">{module.enrolledStudents || 0}</p>
            </div>
            <Users className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tiến độ</p>
              <p className="text-2xl font-bold text-purple-600">{module.completionRate || 0}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Danh sách tuần */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary-600" />
            <span>Nội dung các tuần học</span>
          </h2>
          <p className="text-sm text-gray-500">
            💡 Click vào từng tuần để thêm nội dung và bài tập
          </p>
        </div>

        <div className="space-y-3">
          {module.weeks && module.weeks.length > 0 ? (
            module.weeks.map((week) => {
              const isExpanded = expandedWeeks[week.id];
              
              return (
                <div key={week.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors">
                  {/* Week Header */}
                  <button
                    onClick={() => toggleWeek(week.id)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
                        <span className="text-primary-600 font-bold">{week.id}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-700">
                          Tuần {week.id}: {week.title}
                        </h3>
                        {week.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{week.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{week.videos?.length || 0} video</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FileText className="h-4 w-4" />
                        <span>{week.materials?.length || 0} tài liệu</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        <span>{week.assignments?.length || 0} bài tập</span>
                      </div>
                      <svg
                        className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Week Content */}
                  {isExpanded && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      {/* Mô tả tuần */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả nội dung tuần học
                        </label>
                        <textarea
                          value={week.description || ''}
                          onChange={(e) => handleUpdateWeek(week.id, 'description', e.target.value)}
                          placeholder="Nhập mô tả chi tiết về nội dung sẽ học trong tuần này..."
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        />
                      </div>

                      {/* Video, Tài liệu và Bài tập */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Video */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
                              <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Video</span>
                            </h4>
                            <button
                              onClick={() => handleAddContent(week.id, 'video')}
                              className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center space-x-1"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Thêm</span>
                            </button>
                          </div>
                          
                          {week.videos && week.videos.length > 0 ? (
                            <div className="space-y-2">
                              {week.videos.map((video, idx) => (
                                <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                  <p className="text-sm font-medium text-gray-700">{video.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">🎥 {video.duration || 'Video'}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                              <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm text-gray-500">Chưa có video</p>
                            </div>
                          )}
                        </div>

                        {/* Tài liệu */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span>Tài liệu</span>
                            </h4>
                            <button
                              onClick={() => handleAddContent(week.id, 'material')}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center space-x-1"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Thêm</span>
                            </button>
                          </div>
                          
                          {week.materials && week.materials.length > 0 ? (
                            <div className="space-y-2">
                              {week.materials.map((material, idx) => (
                                <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-sm font-medium text-gray-700">{material.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">{material.type}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Chưa có tài liệu</p>
                            </div>
                          )}
                        </div>

                        {/* Bài tập */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-green-600" />
                              <span>Bài tập</span>
                            </h4>
                            <button
                              onClick={() => handleAddContent(week.id, 'assignment')}
                              className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center space-x-1"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Thêm</span>
                            </button>
                          </div>
                          
                          {week.assignments && week.assignments.length > 0 ? (
                            <div className="space-y-2">
                              {week.assignments.map((assignment, idx) => (
                                <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm font-medium text-gray-700">{assignment.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">Hạn: {assignment.dueDate}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Chưa có bài tập</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có tuần học nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm nội dung */}
      <AddWeekContentModal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        onAdd={handleSaveContent}
        weekId={modalConfig.weekId}
        contentType={modalConfig.contentType}
      />
    </div>
  );
};

export default ModuleDetail;
