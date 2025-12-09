import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AssignmentAnalytics = ({ analytics, assignmentId }) => {
  if (!analytics) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {analytics.submissionRate}%
          </div>
          <div className="text-sm text-gray-600">Tỷ lệ nộp bài</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-success-600 mb-1">
            {analytics.averageScore}/10
          </div>
          <div className="text-sm text-gray-600">Điểm trung bình</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-warning-600 mb-1">
            {analytics.lateSubmissions}
          </div>
          <div className="text-sm text-gray-600">Nộp muộn</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-danger-600 mb-1">
            {analytics.failureRate}%
          </div>
          <div className="text-sm text-gray-600">Tỷ lệ không đạt</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phân bố điểm số
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Submission Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trạng thái nộp bài
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.submissionStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.submissionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Submission Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thời gian nộp bài
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.submissionTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="submissions" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class Performance Comparison */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          So sánh hiệu suất theo lớp
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.classComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="className" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="averageScore" name="Điểm TB" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="submissionRate" name="Tỷ lệ nộp" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thống kê chi tiết
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {analytics.totalSubmissions}
            </div>
            <div className="text-sm text-gray-600">Tổng bài nộp</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {analytics.averageSubmissionTime}
            </div>
            <div className="text-sm text-gray-600">Thời gian nộp TB</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {analytics.resubmissions}
            </div>
            <div className="text-sm text-gray-600">Nộp lại</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {analytics.plagiarismDetected}
            </div>
            <div className="text-sm text-gray-600">Phát hiện sao chép</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {analytics.averageGradingTime}
            </div>
            <div className="text-sm text-gray-600">Thời gian chấm TB</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {analytics.feedbackGiven}
            </div>
            <div className="text-sm text-gray-600">Đã nhận xét</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAnalytics;