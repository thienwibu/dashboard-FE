import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { errorStats, submissions, plagiarismWarnings } from '../data/data';

const Feedback = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-success-100 text-success-800';
      case 'partial':
        return 'bg-warning-100 text-warning-800';
      case 'failed':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'passed':
        return 'Đạt';
      case 'partial':
        return 'Đạt một phần';
      case 'failed':
        return 'Chưa đạt';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lỗi & Phản hồi</h1>
        <p className="text-gray-600">Phân tích lỗi và gợi ý cải thiện</p>
      </div>

      {/* Error Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thống kê Lỗi</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={errorStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, count }) => `${type}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {errorStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Biểu đồ Số lượng Lỗi</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #3f51b5',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontWeight: '600'
                  }}
                  itemStyle={{
                    color: '#1f2937',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                  labelStyle={{
                    color: '#3f51b5',
                    fontWeight: '700',
                    marginBottom: '4px'
                  }}
                  cursor={{ fill: 'rgba(63, 81, 181, 0.1)' }}
                />
                <Bar dataKey="count" name="Số lỗi">
                  {errorStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách Bài nộp Gần đây</h2>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{submission.assignmentName}</h3>
                  <p className="text-sm text-gray-600">Nộp lúc: {submission.submittedAt}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${getStatusColor(submission.status)}`}>
                    {getStatusLabel(submission.status)}
                  </span>
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    {submission.score} điểm
                  </p>
                </div>
              </div>

              {/* Test Results */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Test Cases</span>
                  <span className="text-sm text-gray-600">
                    {submission.testsPassed}/{submission.testsTotal} passed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      submission.testsPassed === submission.testsTotal
                        ? 'bg-success-500'
                        : 'bg-warning-500'
                    }`}
                    style={{ width: `${(submission.testsPassed / submission.testsTotal) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Errors and Suggestions */}
              {submission.errors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm">Lỗi & Gợi ý sửa:</h4>
                  {submission.errors.map((error, idx) => (
                    <div key={idx} className="bg-danger-50 border-l-4 border-danger-500 p-3 rounded-r">
                      <div className="flex items-start space-x-2">
                        <span className="text-danger-600 font-medium text-sm">{error.type}:</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 mb-2">{error.description}</p>
                          <div className="bg-primary-50 border-l-4 border-primary-500 p-2 rounded-r">
                            <p className="text-xs text-primary-800">
                              💡 <strong>Gợi ý:</strong> {error.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {submission.errors.length === 0 && (
                <div className="bg-success-50 border-l-4 border-success-500 p-3 rounded-r">
                  <p className="text-sm text-success-800 flex items-center">
                    <span className="mr-2">🎉</span>
                    Tuyệt vời! Bài làm của bạn hoàn hảo, không có lỗi nào.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DT037: Cảnh báo đạo văn */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Cảnh báo Đạo văn (Plagiarism Detection)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Hệ thống tự động phát hiện mức độ tương đồng trong bài nộp của bạn
        </p>
        <div className="space-y-4">
          {plagiarismWarnings.map((warning) => {
            const getStatusColor = () => {
              switch (warning.status) {
                case 'safe':
                  return 'bg-success-50 border-success-200 text-success-800';
                case 'warning':
                  return 'bg-warning-50 border-warning-200 text-warning-800';
                case 'high-risk':
                  return 'bg-danger-50 border-danger-200 text-danger-800';
                default:
                  return 'bg-gray-50 border-gray-200 text-gray-800';
              }
            };

            const getStatusIcon = () => {
              switch (warning.status) {
                case 'safe':
                  return '✅';
                case 'warning':
                  return '⚠️';
                case 'high-risk':
                  return '🚨';
                default:
                  return 'ℹ️';
              }
            };

            const getStatusLabel = () => {
              switch (warning.status) {
                case 'safe':
                  return 'An toàn';
                case 'warning':
                  return 'Cảnh báo';
                case 'high-risk':
                  return 'Nguy cơ cao';
                default:
                  return 'Không xác định';
              }
            };

            return (
              <div 
                key={warning.id} 
                className={`border-l-4 rounded-r-lg p-4 ${getStatusColor()}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getStatusIcon()}</span>
                      <h3 className="font-bold text-gray-800">{warning.assignmentName}</h3>
                      <span className={`badge ${
                        warning.status === 'safe' ? 'bg-success-100 text-success-800' :
                        warning.status === 'warning' ? 'bg-warning-100 text-warning-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {getStatusLabel()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Nộp lúc: {new Date(warning.submittedAt).toLocaleString('vi-VN')}
                    </p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Mức độ tương đồng</span>
                        <span className={`text-2xl font-bold ${
                          warning.similarityScore < 30 ? 'text-success-600' :
                          warning.similarityScore < 60 ? 'text-warning-600' :
                          'text-danger-600'
                        }`}>
                          {warning.similarityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            warning.similarityScore < 30 ? 'bg-success-500' :
                            warning.similarityScore < 60 ? 'bg-warning-500' :
                            'bg-danger-500'
                          }`}
                          style={{ width: `${Math.min(100, warning.similarityScore)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold mb-3 ${
                      warning.status === 'safe' ? 'text-success-700' :
                      warning.status === 'warning' ? 'text-warning-700' :
                      'text-danger-700'
                    }`}>
                      {warning.message}
                    </p>
                  </div>
                </div>

                {warning.matchedSources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nguồn tương đồng:</p>
                    <div className="space-y-2">
                      {warning.matchedSources.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white/60 rounded p-2">
                          <span className="text-xs text-gray-700">{source.source}</span>
                          <span className="text-xs font-bold text-gray-800">{source.similarity}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4 bg-primary-50 border-l-4 border-primary-500 rounded-r">
          <p className="text-sm text-gray-700">
            <strong>💡 Lưu ý:</strong> Hệ thống phát hiện đạo văn tự động dựa trên so sánh với các bài nộp khác và mã nguồn công khai. 
            Mức độ tương đồng cao không nhất thiết có nghĩa là đạo văn, nhưng cần đảm bảo code là của bạn hoặc có trích dẫn nguồn phù hợp.
          </p>
        </div>
      </div>

      {/* Common Errors Tips */}
      <div className="card bg-primary-50 border-l-4 border-primary-500">
        <h2 className="text-lg font-bold text-gray-800 mb-3">💡 Mẹo tránh lỗi thường gặp</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Syntax Error:</strong> Luôn kiểm tra dấu ngoặc, dấu chấm phẩy và cú pháp trước khi chạy code.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Logic Error:</strong> Test code với nhiều trường hợp khác nhau, đặc biệt là edge cases.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Runtime Error:</strong> Kiểm tra null/undefined trước khi truy cập thuộc tính của object.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Best Practice:</strong> Sử dụng console.log() để debug và hiểu rõ flow của chương trình.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Feedback;

