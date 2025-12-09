import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, X } from 'lucide-react';
import ClassKPIs from './components/ClassKPIs';
import ClassSummaryTable from './components/ClassSummaryTable';
import { ScoreFluctuationChart } from './components/ClassCharts';
import ClassWarningBox from './components/ClassWarningBox';
import RiskClassDetailModal from './components/RiskClassDetailModal';
import { mockClassData } from '../../data/mockData';
import { useLocation, useNavigate } from 'react-router-dom';

const normalize = (value = '') => value.toString().trim().toLowerCase();

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskClass, setSelectedRiskClass] = useState(null);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeClassFilter, setActiveClassFilter] = useState(null);

  useEffect(() => {
    loadClassData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setActiveClassFilter(params.get('classId'));
  }, [location.search]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const transformedClasses = (mockClassData.classes || []).map((cls, index) => ({
        ...cls,
        id: cls.id || cls.name || `CLASS-${index + 1}`,
        course: cls.course || cls.courseName || '',
        instructor: cls.instructor || 'N/A',
        studentCount: cls.enrolledStudents || 0,
        averageProgress: cls.completionRate || 0,
        riskLevel:
          (cls.completionRate || 0) >= 80 ? 'low' : (cls.completionRate || 0) >= 60 ? 'medium' : 'high',
        note: (cls.completionRate || 0) < 60 ? 'Gần cảnh báo' : (cls.completionRate || 0) < 70 ? 'Cần theo dõi' : '-'
      }));
      setClasses(transformedClasses);
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = useMemo(() => {
    if (!activeClassFilter) return classes;
    const normalized = normalize(activeClassFilter);
    const matches = classes.filter(
      (cls) => normalize(cls.name) === normalized || normalize(cls.id) === normalized
    );
    return matches.length ? matches : classes;
  }, [classes, activeClassFilter]);

  const selectedClassInfo = useMemo(() => {
    if (!activeClassFilter) return null;
    const normalized = normalize(activeClassFilter);
    return (
      classes.find((cls) => normalize(cls.name) === normalized || normalize(cls.id) === normalized) || null
    );
  }, [classes, activeClassFilter]);

  const stats = useMemo(() => {
    const total = filteredClasses.length;
    const meetingStandard = filteredClasses.filter((c) => c.completionRate > 80).length;
    const problematic = filteredClasses.filter((c) => c.completionRate < 60 || (c.averageScore || 0) < 7).length;
    const avgScore =
      filteredClasses.length > 0
        ? filteredClasses.reduce((sum, c) => sum + (c.averageScore || 0), 0) / filteredClasses.length
        : 0;

    const instructorCount = {};
    filteredClasses.forEach((cls) => {
      const instructor = cls.instructor || 'N/A';
      instructorCount[instructor] = (instructorCount[instructor] || 0) + 1;
    });
    const topInstructor = Object.entries(instructorCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalClasses: total,
      meetingStandardPercentage: total > 0 ? Math.round((meetingStandard / total) * 100) : 0,
      problematicPercentage: total > 0 ? Math.round((problematic / total) * 100) : 0,
      topInstructorName: topInstructor ? topInstructor[0].split(' ').slice(-2).join(' ') : 'N/A',
      topInstructorClassCount: topInstructor ? topInstructor[1] : 0,
      averageScore: avgScore
    };
  }, [filteredClasses]);

  const handleClassClick = (classItem) => {
    if (!classItem?.name) return;
    navigate(`/classes?classId=${encodeURIComponent(classItem.name)}`);
  };

  const handleViewRiskClasses = () => {
    const riskClasses = filteredClasses.filter((c) => c.riskLevel === 'high');
    if (riskClasses.length > 0) {
      const firstRiskClass = riskClasses[0];
      const atRiskStudents = [
        { id: 1, name: 'Nguyễn Văn A', studentId: 'SV001', email: 'a.nguyen@student.edu.vn', averageScore: 5.5, completionRate: 45 },
        { id: 2, name: 'Trần Thị B', studentId: 'SV002', email: 'b.tran@student.edu.vn', averageScore: 5.8, completionRate: 52 },
        { id: 3, name: 'Lê Văn C', studentId: 'SV003', email: 'c.le@student.edu.vn', averageScore: 6.2, completionRate: 58 }
      ];
      setSelectedRiskClass({ ...firstRiskClass, atRiskStudents });
      setShowRiskModal(true);
    }
  };

  const clearClassFilter = () => {
    navigate('/classes', { replace: true });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Phân tích lớp học</h1>
                  <p className="text-gray-600 mt-1">Theo dõi sức khỏe và hiệu suất lớp trong toàn ngành</p>
                </div>
                {selectedClassInfo && (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <span>Lớp đang xem: {selectedClassInfo.name || selectedClassInfo.id}</span>
                    <button
                      onClick={clearClassFilter}
                      className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="Bỏ lọc lớp"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClassKPIs stats={stats} />

        <ClassSummaryTable classes={filteredClasses} onClassClick={handleClassClick} />

        <div className="mb-6">
          <ScoreFluctuationChart data={[]} />
        </div>

        <div className="mb-6">
          <ClassWarningBox warnings={[]} onViewRiskClasses={handleViewRiskClasses} />
        </div>
      </div>

      <RiskClassDetailModal
        isOpen={showRiskModal}
        onClose={() => {
          setShowRiskModal(false);
          setSelectedRiskClass(null);
        }}
        classData={selectedRiskClass}
        atRiskStudents={selectedRiskClass?.atRiskStudents || []}
      />
    </div>
  );
};

export default ClassManagement;
