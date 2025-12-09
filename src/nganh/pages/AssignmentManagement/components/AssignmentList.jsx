import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Copy,
  Link2
} from 'lucide-react';

const AssignmentList = ({ assignments, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { class: 'status-badge bg-gray-100 text-gray-800', text: 'Bản nháp', icon: FileText },
      active: { class: 'status-badge status-active', text: 'Đang mở', icon: Clock },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp mở', icon: Calendar },
      completed: { class: 'status-badge status-completed', text: 'Đã đóng', icon: CheckCircle },
      overdue: { class: 'status-badge status-at-risk', text: 'Quá hạn', icon: AlertTriangle }
    };
    return statusConfig[status] || statusConfig.draft;
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'bg-success-600';
    if (rate >= 60) return 'bg-primary-600';
    if (rate >= 40) return 'bg-warning-600';
    return 'bg-danger-600';
  };

  const normalizeDifficulty = (difficulty) => {
    const key = (difficulty || '').toLowerCase();
    if (key === 'easy' || key === 'dễ') return 'easy';
    if (key === 'medium' || key === 'chuẩn' || key === 'chuan') return 'medium';
    if (['hard', 'advanced', 'nâng cao'].includes(key)) return 'advanced';
    return 'medium';
  };

  const getDifficultyBadge = (difficulty) => {
    const key = normalizeDifficulty(difficulty);
    const cfg = {
      easy: {
        text: 'Dễ',
        description: '',
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      },
      medium: {
        text: 'Chuẩn',
        description: '',
        className: 'bg-amber-50 text-amber-700 border border-amber-200'
      },
      advanced: {
        text: 'Nâng cao',
        description: '',
        className: 'bg-blue-50 text-blue-700 border border-blue-200'
      }
    };
    return cfg[key] || cfg.easy;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const handleCopyLink = (assignment) => {
    const url = `${window.location.origin}/assignments/${assignment.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
  };

  const handleDuplicate = (assignment) => {
    // Placeholder: hook to duplicate flow
    console.info('Duplicate assignment', assignment.id);
  };

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const statusInfo = getStatusBadge(assignment.status);
        const StatusIcon = statusInfo.icon;
        const submissionRate =
          assignment.totalStudents > 0
            ? Math.round((assignment.submittedCount / assignment.totalStudents) * 100)
            : 0;
        const difficultyInfo = getDifficultyBadge(assignment.difficulty);

        return (
          <div key={assignment.id} className="card p-6 hover:shadow-medium transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Link
                    to={`/assignments/${assignment.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {assignment.title}
                  </Link>
                  <span className={statusInfo.class}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.text}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${difficultyInfo.className}`}
                    title={difficultyInfo.description}
                  >
                    {difficultyInfo.text}
                  </span>
                  {assignment.mainSkill && (
                    <span className="px-2 py-1 text-[11px] rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                      Kỹ năng chính: {assignment.mainSkill}
                    </span>
                  )}
                  {assignment.timeEstimate && (
                    <span className="px-2 py-1 text-[11px] rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                      Thời lượng: {assignment.timeEstimate}
                    </span>
                  )}
                  {(assignment.skills || []).slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-[11px] rounded-full bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Mở: {formatDate(assignment.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Hạn: {formatDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {assignment.submittedCount}/{assignment.totalStudents} nộp bài
                    </span>
                  </div>
                  <div className="text-primary-600 font-medium">
                    {assignment.course} - {assignment.className}
                  </div>
                  {assignment.goal && (
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                      Mục tiêu: {assignment.goal}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to={`/assignments/${assignment.id}`}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  to={`/assignments/${assignment.id}/edit`}
                  className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDuplicate(assignment)}
                  className="p-2 text-gray-400 hover:text-info-600 hover:bg-info-50 rounded-lg transition-colors"
                  title="Nhân bản bài tập"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopyLink(assignment)}
                  className="p-2 text-gray-400 hover:text-info-600 hover:bg-info-50 rounded-lg transition-colors"
                  title="Sao chép link bài tập"
                >
                  <Link2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(assignment.id)}
                  className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                  title="Xóa bài tập"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Tỷ lệ nộp bài</span>
                  <span className="font-medium text-gray-900">{submissionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor(submissionRate)}`}
                    style={{ width: `${submissionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{assignment.averageScore}%</div>
                    <div className="text-xs text-gray-500">Điểm TB</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-600">{assignment.submittedCount}</div>
                    <div className="text-xs text-gray-500">Đã nộp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-warning-600">
                      {assignment.totalStudents - assignment.submittedCount}
                    </div>
                    <div className="text-xs text-gray-500">Chưa nộp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-danger-600">{assignment.lateSubmissions || 0}</div>
                    <div className="text-xs text-gray-500">Nộp muộn</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Cập nhật: {formatDate(assignment.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentList;
