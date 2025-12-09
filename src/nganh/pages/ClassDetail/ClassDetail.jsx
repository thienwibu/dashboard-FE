import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, MapPin, Calendar, Download, Settings } from 'lucide-react';
import ClassDetailHeader from './components/ClassDetailHeader';
import StudentList from './components/StudentList';
import AssignmentProgress from './components/AssignmentProgress';
import ClassSchedule from './components/ClassSchedule';
import { mockClassData } from '../../data/mockData';

const ClassDetail = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    loadClassDetail();
  }, [id]);

  const loadClassDetail = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const classId = parseInt(id);
      const foundClass = mockClassData.classes.find(c => c.id === classId);
      const details = mockClassData.classDetails[classId];
      
      if (foundClass && details) {
        // Tính toán tiến độ dựa theo lịch học
        const scheduleList = details.schedule || [];
        const completedSessions = scheduleList.filter(s => s.status === 'completed').length;
        const totalSessions = scheduleList.length;
        const calculatedCompletion = totalSessions > 0 
          ? Math.round((completedSessions / totalSessions) * 100) 
          : 0;
        
        const combinedData = {
          ...foundClass,
          students: details.students,
          assignments: details.assignments,
          scheduleList: scheduleList,
          completionRate: calculatedCompletion,  // Ghi đè bằng giá trị tính toán
          completedSessions,
          totalSessions
        };
        setClassData(combinedData);
      } else {
        setClassData(null);
      }
    } catch (error) {
      console.error('Error loading class detail:', error);
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

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy lớp học
        </h3>
        <p className="text-gray-500 mb-4">
          Lớp học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/classes" className="btn-primary">
          Quay lại danh sách lớp học
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'students', label: 'Sinh viên', count: classData.students?.length || 0 },
    { id: 'assignments', label: 'Bài tập', count: classData.assignments?.length || 0 },
    { id: 'schedule', label: 'Lịch học', count: classData.scheduleList?.length || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/classes" className="hover:text-primary-600 transition-colors">
          Quản lý lớp học
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{classData.name}</span>
      </div>

      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/classes"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>
      </div>

      {/* Class Header */}
      <ClassDetailHeader classData={classData} />

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
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'students' && (
          <StudentList students={classData.students} classId={classData.id} />
        )}
        {activeTab === 'assignments' && (
          <AssignmentProgress assignments={classData.assignments} classId={classData.id} />
        )}
        {activeTab === 'schedule' && (
          <ClassSchedule schedule={classData.scheduleList} classId={classData.id} />
        )}
      </div>
    </div>
  );
};

export default ClassDetail;