import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [confirmText, setConfirmText] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const CONFIRM_TEXT = 'XÓA TÀI KHOẢN';

  const handleDelete = () => {
    if (confirmText !== CONFIRM_TEXT || !understood) return;

    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false);
      alert('Tài khoản đã được xóa. Bạn sẽ được đăng xuất.');
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setConfirmText('');
    setUnderstood(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <ShieldAlert className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Xóa tài khoản</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning */}
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm font-bold text-red-900 mb-2">
                    ⚠️ CẢNH BÁO NGHIÊM TRỌNG
                  </p>
                  <p className="text-sm text-red-700 mb-3">
                    Hành động này sẽ <strong>XÓA VĨNH VIỄN</strong> tài khoản của bạn và KHÔNG THỂ HOÀN TÁC.
                  </p>
                  <p className="text-sm font-medium text-red-900 mb-2">
                    Dữ liệu sẽ bị xóa bao gồm:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 ml-4">
                    <li>• Tất cả thông tin cá nhân</li>
                    <li>• Toàn bộ khóa học và lớp học</li>
                    <li>• Dữ liệu sinh viên và điểm số</li>
                    <li>• Bài tập và file đã tải lên</li>
                    <li>• Báo cáo và thống kê</li>
                    <li>• Cài đặt hệ thống</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5"
                />
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Tôi hiểu hậu quả
                  </p>
                  <p className="text-sm text-gray-600">
                    Tôi xác nhận rằng tôi hiểu tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
                  </p>
                </div>
              </label>
            </div>

            {/* Confirmation Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Để xác nhận, vui lòng nhập: <code className="px-2 py-1 bg-gray-100 rounded text-red-600 font-mono">{CONFIRM_TEXT}</code>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Nhập chính xác văn bản trên"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting || confirmText !== CONFIRM_TEXT || !understood}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={20} />
                    <span>Xóa vĩnh viễn</span>
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

export default DeleteAccountModal;

