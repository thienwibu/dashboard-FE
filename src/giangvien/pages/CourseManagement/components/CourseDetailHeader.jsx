import { ArrowLeft, Edit, Share2, MoreVertical, Award, Clock, Users, TrendingUp, Download, Trash2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CourseDetailHeader = ({ course, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    alert('Xuất báo cáo khóa học...');
    setShowDropdown(false);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    onDelete?.();
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    
    const labels = {
      active: 'Đang hoạt động',
      completed: 'Đã hoàn thành',
      upcoming: 'Sắp diễn ra'
    };

    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${styles[status] || styles.active}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại danh sách</span>
        </Link>

        {/* Course Info */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">{course?.name}</h1>
                <p className="text-blue-100 text-lg mb-4">
                  Khóa học lập trình toàn diện với đội ngũ giảng viên chuyên nghiệp
                </p>
              </div>
              {course?.status && getStatusBadge(course.status)}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Sinh viên</p>
                    <p className="text-2xl font-bold">{course?.enrolledStudents || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Thời lượng</p>
                    <p className="text-2xl font-bold">{course?.duration || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Hoàn thành</p>
                    <p className="text-2xl font-bold">{course?.completionRate || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors relative group"
              title="Chia sẻ"
            >
              {copied ? <Check size={20} /> : <Share2 size={20} />}
              {copied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                  Đã sao chép!
                </span>
              )}
            </button>

            {/* Edit Button */}
            <button 
              onClick={onEdit}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              <Edit size={20} />
              <span>Chỉnh sửa</span>
            </button>

            {/* More Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
              >
                <MoreVertical size={20} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Download size={18} />
                      <span className="text-sm font-medium">Xuất báo cáo</span>
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Copy size={18} />
                      <span className="text-sm font-medium">Sao chép link</span>
                    </button>

                    <div className="border-t border-gray-200 my-2" />

                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm font-medium">Xóa khóa học</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;

