import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, Plus, Trash2 } from 'lucide-react';
import AddModuleModal from './components/AddModuleModal';
import dataService from '../../services/dataService';

const LearningPathSimple = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    loadModules();
    
    // Lắng nghe sự kiện refresh data
    const handleRefresh = () => loadModules();
    window.addEventListener('dataRefresh', handleRefresh);
    
    return () => window.removeEventListener('dataRefresh', handleRefresh);
  }, []);

  const loadModules = () => {
    try {
      // Sử dụng dataService để lấy dữ liệu đồng bộ
      const allModules = dataService.getModules();
      const totalStudents = dataService.getTotalStudents();
      
      setModules(allModules);
      setTotalStudents(totalStudents);
      
      console.log('📚 Loaded modules:', allModules.length);
      console.log('👥 Total students:', totalStudents);
    } catch (error) {
      console.error('❌ Lỗi khi load modules:', error);
      setModules([]);
    }
  };

  const handleAddModule = (newModule) => {
    dataService.addModule(newModule);
    dataService.refresh();
    loadModules();
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      if (dataService.deleteModule(moduleId)) {
        dataService.refresh();
        loadModules();
      }
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang học' },
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Chưa bắt đầu' }
    };
    return config[status] || config.pending;
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'from-green-400 to-green-600';
    if (progress >= 50) return 'from-blue-400 to-indigo-600';
    if (progress > 0) return 'from-orange-400 to-orange-600';
    return 'from-gray-300 to-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-700 flex items-center space-x-3">
            <span className="text-4xl">🗺️</span>
            <span>Lộ Trình Học</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Tổng quan các môn học và tiến độ học tập
          </p>
        </div>

        <button 
          onClick={() => setShowAddModuleModal(true)}
          className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm Môn Học Mới</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng môn học</p>
              <p className="text-3xl font-bold text-blue-600">{modules.length}</p>
            </div>
            <BookOpen className="h-12 w-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
              <p className="text-3xl font-bold text-green-600">
                {modules.filter(m => m.status === 'completed').length}
              </p>
            </div>
            <div className="text-green-500 opacity-50">✓</div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang học</p>
              <p className="text-3xl font-bold text-orange-600">
                {modules.filter(m => m.status === 'in-progress').length}
              </p>
            </div>
            <Clock className="h-12 w-12 text-orange-500 opacity-50" />
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng sinh viên</p>
              <p className="text-3xl font-bold text-purple-600">{totalStudents}</p>
            </div>
            <Users className="h-12 w-12 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const statusBadge = getStatusBadge(module.status);
          
          return (
            <div
              key={module.id}
              className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-5xl">{module.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-700 group-hover:text-primary-600 transition-colors">
                        {module.title}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Delete button - chỉ hiện cho modules từ localStorage */}
                  {module.id > 4 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(module.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa môn học"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Tiến độ</span>
                    <span className="font-semibold text-gray-700">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(module.progress)} transition-all duration-1000`}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Body - Stats */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Sinh viên</span>
                  </div>
                  <span className="font-semibold text-gray-700">{module.students}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Thời lượng</span>
                  </div>
                  <span className="font-semibold text-gray-700">{module.duration}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>Số tuần</span>
                  </div>
                  <span className="font-semibold text-gray-700">{module.totalWeeks} tuần</span>
                </div>
              </div>

              {/* Card Footer - Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => navigate(`/learning-path/${module.id}`)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Xem chi tiết →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {modules.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có môn học nào
          </h3>
          <p className="text-gray-600 mb-6">
            Bắt đầu bằng cách thêm môn học mới
          </p>
          <button
            onClick={() => setShowAddModuleModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm Môn Học Đầu Tiên</span>
          </button>
        </div>
      )}

      {/* Add Module Modal */}
      <AddModuleModal
        isOpen={showAddModuleModal}
        onClose={() => setShowAddModuleModal(false)}
        onAdd={handleAddModule}
      />
    </div>
  );
};

export default LearningPathSimple;
