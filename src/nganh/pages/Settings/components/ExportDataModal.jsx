import { X, Download, Check, FileText, Database, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';

const ExportDataModal = ({ isOpen, onClose }) => {
  const [selectedData, setSelectedData] = useState({
    profile: true,
    courses: true,
    classes: true,
    students: true,
    assignments: true,
    settings: false
  });

  const [format, setFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  const dataOptions = [
    { key: 'profile', label: 'Thông tin hồ sơ', description: 'Thông tin cá nhân và cài đặt tài khoản', icon: FileText },
    { key: 'courses', label: 'Khóa học', description: 'Tất cả dữ liệu khóa học', icon: Database },
    { key: 'classes', label: 'Lớp học', description: 'Danh sách lớp và sinh viên', icon: Database },
    { key: 'students', label: 'Sinh viên', description: 'Thông tin và tiến độ sinh viên', icon: Database },
    { key: 'assignments', label: 'Bài tập', description: 'Bài tập và điểm số', icon: Database },
    { key: 'settings', label: 'Cài đặt hệ thống', description: 'Tùy chọn và cấu hình', icon: SettingsIcon }
  ];

  const handleToggle = (key) => {
    setSelectedData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    setIsExporting(true);
    
    const selectedItems = Object.entries(selectedData)
      .filter(([_, value]) => value)
      .map(([key]) => dataOptions.find(opt => opt.key === key)?.label);

    setTimeout(() => {
      setIsExporting(false);
      alert(`Đã xuất dữ liệu (${format.toUpperCase()}):\n- ${selectedItems.join('\n- ')}`);
      onClose();
    }, 1500);
  };

  const selectedCount = Object.values(selectedData).filter(Boolean).length;

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
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Download className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Xuất dữ liệu</h2>
                  <p className="text-green-100 text-sm">Tải xuống dữ liệu của bạn</p>
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

          {/* Content */}
          <div className="p-6">
            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Định dạng xuất
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['json', 'csv', 'excel'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      format === fmt
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn dữ liệu cần xuất ({selectedCount} đã chọn)
              </label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dataOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.key}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedData[option.key]
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedData[option.key]}
                        onChange={() => handleToggle(option.key)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={16} className={selectedData[option.key] ? 'text-green-600' : 'text-gray-600'} />
                          <span className="font-medium text-gray-900">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      {selectedData[option.key] && (
                        <Check className="text-green-600" size={20} />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Lưu ý về xuất dữ liệu
                  </p>
                  <p className="text-sm text-blue-700">
                    Dữ liệu sẽ được mã hóa và bạn có thể nhập lại bất cứ lúc nào. 
                    File xuất có thể chứa thông tin nhạy cảm, vui lòng bảo quản cẩn thận.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isExporting}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || selectedCount === 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Đang xuất...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Xuất dữ liệu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDataModal;

