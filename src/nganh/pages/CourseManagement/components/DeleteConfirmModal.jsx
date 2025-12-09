import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, courseName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = () => {
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      onConfirm?.();
      setIsDeleting(false);
      onClose();
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
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Xác nhận xóa</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Bạn có chắc chắn muốn xóa khóa học:
              </p>
              <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border-l-4 border-red-500">
                {courseName}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Cảnh báo: Hành động này không thể hoàn tác!
                  </p>
                  <p className="text-sm text-red-700">
                    Tất cả dữ liệu liên quan đến khóa học này sẽ bị xóa vĩnh viễn, bao gồm:
                  </p>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                    <li>Danh sách lớp học</li>
                    <li>Bài tập và điểm số</li>
                    <li>Dữ liệu sinh viên trong khóa</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={20} />
                    <span>Xóa khóa học</span>
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

export default DeleteConfirmModal;

