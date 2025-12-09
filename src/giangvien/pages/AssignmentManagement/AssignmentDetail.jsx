import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download, Users, Clock, Calendar, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import AssignmentDetailHeader from './components/AssignmentDetailHeader';
import SubmissionList from './components/SubmissionList';
import AssignmentAnalytics from './components/AssignmentAnalytics';
import GradingPanel from './components/GradingPanel';
import { mockAssignmentData } from '../../data/mockData';

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submissions');

  useEffect(() => {
    loadAssignmentDetail();
  }, [id]);

  const loadAssignmentDetail = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const foundAssignment = mockAssignmentData.assignments.find(a => a.id === parseInt(id));
      if (foundAssignment) {
        setAssignment({
          ...foundAssignment,
          submissions: mockAssignmentData.assignmentDetails.submissions,
          analytics: mockAssignmentData.assignmentDetails.analytics,
          files: mockAssignmentData.assignmentDetails.files
        });
      }
    } catch (error) {
      console.error('Error loading assignment detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="card p-6 mb-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="card p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy bài tập
        </h3>
        <p className="text-gray-500 mb-4">
          Bài tập bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/assignments" className="btn-primary">
          Quay lại danh sách bài tập
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'submissions', label: 'Bài nộp', count: assignment.submissions?.length || 0 },
    { id: 'analytics', label: 'Phân tích', count: null },
    { id: 'grading', label: 'Chấm điểm', count: assignment.submissions?.filter(s => s.status === 'pending').length || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/assignments" className="hover:text-primary-600 transition-colors">
          Quản lý bài tập
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{assignment.title}</span>
      </div>

      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/assignments"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>
      </div>

      {/* Assignment Header */}
      <AssignmentDetailHeader assignment={assignment} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'submissions' && (
          <SubmissionList submissions={assignment.submissions} assignmentId={assignment.id} />
        )}
        {activeTab === 'analytics' && (
          <AssignmentAnalytics analytics={assignment.analytics} assignmentId={assignment.id} />
        )}
        {activeTab === 'grading' && (
          <GradingPanel submissions={assignment.submissions} assignmentId={assignment.id} />
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;