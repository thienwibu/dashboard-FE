import React, { useState } from 'react';
import { FileText, Mail, Users, Save, Plus, Trash2 } from 'lucide-react';

const ReportsMonitoring = () => {
  const [reportFrequency, setReportFrequency] = useState('weekly');
  const [autoBackup, setAutoBackup] = useState(true);
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Ban Giám hiệu', email: 'bgh@university.edu.vn' },
    { id: 2, name: 'TS. Nguyễn Văn An', email: 'nguyen.van.an@university.edu.vn' }
  ]);
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });

  const handleAddRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      setRecipients([
        ...recipients,
        { id: Date.now(), name: newRecipient.name, email: newRecipient.email }
      ]);
      setNewRecipient({ name: '', email: '' });
    }
  };

  const handleRemoveRecipient = (id) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleSave = () => {
    alert('Đã lưu cấu hình báo cáo và giám sát thành công!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Báo cáo & Giám sát</h2>
        <p className="text-sm text-gray-600">Cấu hình tự động gửi báo cáo và sao lưu dữ liệu</p>
      </div>

      {/* Report Frequency */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Tần suất gửi báo cáo đến ban giám hiệu
          </h3>
        </div>
        <div className="space-y-3">
          {['daily', 'weekly', 'monthly'].map((freq) => {
            const labels = {
              daily: 'Hàng ngày',
              weekly: 'Hàng tuần',
              monthly: 'Hàng tháng'
            };
            return (
              <label key={freq} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportFrequency"
                  value={freq}
                  checked={reportFrequency === freq}
                  onChange={(e) => setReportFrequency(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{labels[freq]}</span>
              </label>
            );
          })}
          <p className="text-xs text-gray-500 mt-2">
            Hệ thống sẽ tự động gửi báo cáo tổng hợp về tình hình ngành theo tần suất đã chọn
          </p>
        </div>
      </div>

      {/* Recipients */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Người nhận tự động</h3>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {recipients.map((recipient) => (
            <div
              key={recipient.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
                <p className="text-xs text-gray-500">{recipient.email}</p>
              </div>
              <button
                onClick={() => handleRemoveRecipient(recipient.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Recipient */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Thêm người nhận mới</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Tên người nhận"
              value={newRecipient.name}
              onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={newRecipient.email}
              onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAddRecipient}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Thêm người nhận
          </button>
        </div>
      </div>

      {/* Auto Backup Email */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Gửi bản sao lưu dữ liệu định kỳ qua email
              </h3>
              <p className="text-sm text-gray-500">
                Tự động gửi file backup đến danh sách người nhận
              </p>
            </div>
          </div>
          <button
            onClick={() => setAutoBackup(!autoBackup)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoBackup ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoBackup ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="h-5 w-5" />
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
};

export default ReportsMonitoring;

