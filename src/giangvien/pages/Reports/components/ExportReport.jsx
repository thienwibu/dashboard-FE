import { Download, FileText, FileSpreadsheet, File, Share2, Mail, Printer } from 'lucide-react';
import { useState } from 'react';

const ExportReport = () => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      value: 'pdf',
      label: 'PDF',
      icon: FileText,
      description: 'Định dạng phổ biến, dễ chia sẻ',
      color: 'text-red-600'
    },
    {
      value: 'excel',
      label: 'Excel',
      icon: FileSpreadsheet,
      description: 'Phân tích dữ liệu chi tiết',
      color: 'text-green-600'
    },
    {
      value: 'csv',
      label: 'CSV',
      icon: File,
      description: 'Dữ liệu thô, tương thích cao',
      color: 'text-blue-600'
    }
  ];

  const handleExport = (format) => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert(`Đang xuất báo cáo dưới định dạng ${format.toUpperCase()}...`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <Download className="text-green-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Xuất báo cáo</h2>
          <p className="text-sm text-gray-600">Tải xuất và chia sẻ báo cáo</p>
        </div>
      </div>

      {/* Export Format Selection */}
      <div className="space-y-3 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Chọn định dạng xuất
        </label>
        
        {exportFormats.map((format) => {
          const Icon = format.icon;
          const isSelected = selectedFormat === format.value;
          
          return (
            <button
              key={format.value}
              onClick={() => setSelectedFormat(format.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isSelected ? 'bg-white' : 'bg-gray-50'
              }`}>
                <Icon className={format.color} size={24} />
              </div>
              
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900">{format.label}</h4>
                <p className="text-sm text-gray-600">{format.description}</p>
              </div>
              
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Export Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Tùy chọn xuất</h4>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Bao gồm biểu đồ</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Bao gồm chi tiết sinh viên</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Chỉ dữ liệu tóm tắt</span>
          </label>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={() => handleExport(selectedFormat)}
        disabled={isExporting}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          isExporting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
        }`}
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>Đang xuất...</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span>Xuất báo cáo {selectedFormat.toUpperCase()}</span>
          </>
        )}
      </button>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Hành động nhanh</h4>
        
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 size={20} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Chia sẻ</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <Mail size={20} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Email</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <Printer size={20} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReport;

