import React, { useState } from 'react';
import { Link2, RefreshCw, Download, Database, Check, X } from 'lucide-react';

const IntegrationData = () => {
  const [lmsConnected, setLmsConnected] = useState(false);
  const [lmsType, setLmsType] = useState('moodle');
  const [autoSync, setAutoSync] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState('weekly');

  const lmsOptions = [
    { value: 'moodle', label: 'Moodle' },
    { value: 'canvas', label: 'Canvas' },
    { value: 'google-classroom', label: 'Google Classroom' },
    { value: 'blackboard', label: 'Blackboard' }
  ];

  const handleConnectLMS = () => {
    setLmsConnected(true);
    alert(`Đã kết nối với ${lmsOptions.find(o => o.value === lmsType)?.label}`);
  };

  const handleExportData = (format) => {
    alert(`Đang xuất dữ liệu thống kê ngành ra định dạng ${format.toUpperCase()}...`);
  };

  const handleReloadData = () => {
    alert('Đang tải lại dữ liệu ngành...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Tích hợp & Dữ liệu</h2>
        <p className="text-sm text-gray-600">Kết nối hệ thống và quản lý dữ liệu</p>
      </div>

      {/* LMS Connection */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Kết nối với hệ thống LMS</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn hệ thống LMS
            </label>
            <select
              value={lmsType}
              onChange={(e) => setLmsType(e.target.value)}
              disabled={lmsConnected}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {lmsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Trạng thái kết nối</p>
              <p className="text-xs text-gray-500">
                {lmsConnected
                  ? `Đã kết nối với ${lmsOptions.find(o => o.value === lmsType)?.label}`
                  : 'Chưa kết nối'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {lmsConnected ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>

          <button
            onClick={handleConnectLMS}
            disabled={lmsConnected}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              lmsConnected
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {lmsConnected ? 'Đã kết nối' : 'Kết nối LMS'}
          </button>
        </div>
      </div>

      {/* Auto Sync */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tự động đồng bộ điểm và tiến độ</h3>
              <p className="text-sm text-gray-500">
                Tự động đồng bộ dữ liệu từ hệ thống LMS
              </p>
            </div>
          </div>
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoSync ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoSync ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Xuất dữ liệu thống kê ngành</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['csv', 'excel', 'pdf'].map((format) => (
            <button
              key={format}
              onClick={() => handleExportData(format)}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 uppercase"
            >
              <Download className="h-4 w-4" />
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Backup Schedule */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Lịch trình backup dữ liệu</h3>
        </div>
        <div className="space-y-3">
          {['daily', 'weekly', 'monthly'].map((schedule) => {
            const labels = {
              daily: 'Hàng ngày',
              weekly: 'Hàng tuần',
              monthly: 'Hàng tháng'
            };
            return (
              <label key={schedule} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="backupSchedule"
                  value={schedule}
                  checked={backupSchedule === schedule}
                  onChange={(e) => setBackupSchedule(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">{labels[schedule]}</span>
              </label>
            );
          })}
          <p className="text-xs text-gray-500 mt-2">
            Hệ thống sẽ tự động tạo bản sao lưu dữ liệu theo lịch trình đã chọn
          </p>
        </div>
      </div>

      {/* Reload Data */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <button
          onClick={handleReloadData}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
        >
          <RefreshCw className="h-5 w-5" />
          Tải lại dữ liệu ngành
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Cập nhật thủ công tất cả dữ liệu từ các nguồn kết nối
        </p>
      </div>
    </div>
  );
};

export default IntegrationData;

