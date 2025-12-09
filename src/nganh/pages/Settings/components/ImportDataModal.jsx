import { X, Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const ImportDataModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;

    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      setImportResult({
        success: true,
        imported: 156,
        updated: 23,
        failed: 2
      });
      
      setTimeout(() => {
        alert('Nhập dữ liệu thành công!');
        handleClose();
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Upload className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nhập dữ liệu</h2>
                  <p className="text-blue-100 text-sm">Khôi phục dữ liệu từ file</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!importResult ? (
              <>
                {/* File Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : selectedFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <FileText className="text-green-600" size={32} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Xóa file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Upload className="text-gray-400" size={32} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Kéo thả file vào đây
                        </p>
                        <p className="text-sm text-gray-600">hoặc</p>
                      </div>
                      <label className="inline-block">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                          Chọn file
                        </span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".json,.csv,.xlsx"
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        Hỗ trợ: JSON, CSV, Excel (.xlsx)
                      </p>
                    </div>
                  )}
                </div>

                {/* Format Info */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 mb-1">
                        Lưu ý quan trọng
                      </p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• File phải được xuất từ hệ thống này</li>
                        <li>• Dữ liệu hiện tại sẽ được ghi đè</li>
                        <li>• Khuyến nghị sao lưu trước khi nhập</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={handleClose}
                    disabled={isImporting}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={isImporting || !selectedFile}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Đang nhập...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Nhập dữ liệu</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Import Result */
              <div className="text-center py-8">
                <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nhập dữ liệu thành công!
                </h3>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                    <p className="text-xs text-gray-600">Đã nhập</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-600">{importResult.updated}</p>
                    <p className="text-xs text-gray-600">Đã cập nhật</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                    <p className="text-xs text-gray-600">Lỗi</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDataModal;

