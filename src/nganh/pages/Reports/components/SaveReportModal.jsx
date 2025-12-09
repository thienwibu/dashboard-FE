import { X, Save, Calendar, Bell } from 'lucide-react';
import { useState } from 'react';

const SaveReportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: 'none',
    emailReport: false,
    includeCharts: true,
    includeDetails: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Đã lưu cấu hình báo cáo: ' + formData.name);
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        schedule: 'none',
        emailReport: false,
        includeCharts: true,
        includeDetails: true
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Save className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Lưu cấu hình báo cáo</h2>
                  <p className="text-purple-100 text-sm">Tạo báo cáo tự động</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6">
            <div className="space-y-6">
              {/* Report Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên báo cáo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ví dụ: Báo cáo tuần học kỳ 1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mô tả về báo cáo này..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} />
                  Lịch tự động tạo
                </label>
                <select
                  value={formData.schedule}
                  onChange={(e) => handleChange('schedule', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="none">Không tự động</option>
                  <option value="daily">Hàng ngày (8:00 AM)</option>
                  <option value="weekly">Hàng tuần (Thứ 2, 8:00 AM)</option>
                  <option value="monthly">Hàng tháng (Ngày 1, 8:00 AM)</option>
                </select>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.emailReport}
                    onChange={() => handleToggle('emailReport')}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-900">Gửi email tự động</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Gửi báo cáo qua email theo lịch đã chọn
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.includeCharts}
                    onChange={() => handleToggle('includeCharts')}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Bao gồm biểu đồ</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Thêm các biểu đồ phân tích vào báo cáo
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.includeDetails}
                    onChange={() => handleToggle('includeDetails')}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Bao gồm chi tiết</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Thêm dữ liệu chi tiết sinh viên và khóa học
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Lưu cấu hình</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaveReportModal;

