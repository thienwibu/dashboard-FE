import React, { useState } from 'react';
import { X, Send, Download, User, AlertTriangle } from 'lucide-react';

const RiskClassDetailModal = ({ isOpen, onClose, classData, atRiskStudents = [] }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  if (!isOpen || !classData) return null;

  const handleSelectAll = () => {
    if (selectedStudents.length === atRiskStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(atRiskStudents.map(s => s.id));
    }
  };

  const handleSendWarning = () => {
    alert(`Đã gửi cảnh báo về ${selectedStudents.length} sinh viên tới giảng viên và cố vấn học tập`);
  };

  const handleExport = () => {
    alert(`Xuất ${selectedStudents.length} sinh viên rủi ro ra Excel`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết lớp rủi ro</h2>
            <p className="text-sm text-gray-600 mt-1">
              {classData.name} - {classData.course} | Giảng viên: {classData.instructor}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Class Info */}
        <div className="p-6 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Lớp này đang có rủi ro cao</h3>
              <p className="text-sm text-red-700">
                Tiến độ: {classData.averageProgress}% | Điểm TB: {classData.averageScore?.toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách sinh viên có nguy cơ ({atRiskStudents.length})
            </h3>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === atRiskStudents.length && atRiskStudents.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Chọn tất cả</span>
              </label>
              <button
                onClick={handleExport}
                disabled={selectedStudents.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                <Download className="h-4 w-4" />
                Xuất Excel
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {atRiskStudents.map((student) => (
              <div
                key={student.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedStudents.includes(student.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedStudents(prev =>
                    prev.includes(student.id)
                      ? prev.filter(id => id !== student.id)
                      : [...prev, student.id]
                  );
                }}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Rủi ro cao
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{student.studentId || student.email}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-600">
                        Điểm: <span className="font-semibold text-red-600">{student.averageScore?.toFixed(1) || '0.0'}/10</span>
                      </span>
                      <span className="text-gray-600">
                        Tiến độ: <span className="font-semibold text-red-600">{student.completionRate || 0}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {atRiskStudents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Không có sinh viên rủi ro trong lớp này</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSendWarning}
            disabled={selectedStudents.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            <Send className="h-5 w-5" />
            <span>
              Gửi cảnh báo tới giảng viên và cố vấn học tập ({selectedStudents.length} sinh viên)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskClassDetailModal;

