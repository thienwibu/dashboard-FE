import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import KPIMetrics from './components/KPIMetrics';
import CoursePerformanceSection from './components/CoursePerformanceSection';
import ProgressOverview from './components/ProgressOverview';
import NotificationPanel from './components/NotificationPanel';
import PerformanceChart from './components/PerformanceChart';
import IndustryAnalysis from './components/IndustryAnalysis';
import CourseCompletionTrend from './components/CourseCompletionTrend';
import StudentRatingTrend from './components/StudentRatingTrend';
import SkillCompletionTrend from './components/SkillCompletionTrend';
import { mockDashboardData } from '../../data/mockData';

const CONFIG_STORAGE_KEY = 'dashboardCardConfigs';

const CARD_TEXT_PATCHES = {
  'lecture-effectiveness': {
    title: 'Độ phù hợp bài giảng',
    description: 'Hiển thị hiệu quả giữa bài giảng và năng lực sinh viên.',
    oldTitles: ['Do phu hop bai giang'],
    oldDescriptions: ['Hien thi hieu qua giua bai giang va nang luc sinh vien.']
  },
  'course-completion': {
    title: 'Tỷ lệ hoàn thành môn học',
    description: 'Theo dõi xu hướng hoàn thành môn theo năm.',
    oldTitles: ['Ty le hoan thanh mon hoc'],
    oldDescriptions: ['Theo doi xu huong hoan thanh mon theo nam.']
  },
  'student-rating': {
    title: 'Xếp loại học lực sinh viên',
    description: 'Xếp loại 7 mức theo quy chuẩn 4 năm.',
    oldTitles: ['Xep loai hoc luc sinh vien'],
    oldDescriptions: ['Xep loai 7 muc theo quy chuan 4 nam.']
  },
  'skill-trend': {
    title: 'Tập kỹ năng',
    description: 'Tiến độ hoàn thành kỹ năng theo 4 năm.',
    oldTitles: ['Tap ky nang'],
    oldDescriptions: ['Tien do hoan thanh ky nang theo 4 nam.']
  }
};

// Fallback defaults when localStorage is empty so the cards appear on first load
const buildDefaultCards = () => [
  {
    id: 'lecture-effectiveness',
    type: 'lectureEffectiveness',
    title: 'Độ phù hợp bài giảng',
    description: 'Hiển thị hiệu quả giữa bài giảng và năng lực sinh viên.',
    enabled: true,
    filters: {
      course: 'Nhap mon lap trinh',
      courseList: ['Nhap mon lap trinh', 'Ky thuat lap trinh', 'Cau truc du lieu & GT', 'Lap trinh HOT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    dataSource: {
      mode: 'api',
      endpoint: '/api/lecture-effectiveness',
      manualJson: ''
    },
    chart: {
      type: 'line',
      color: '#2563eb',
      smooth: true,
      showDots: true
    },
    threshold: 65,
    benchmark: 75,
    warning: 60
  },
  {
    id: 'course-completion',
    type: 'courseCompletion',
    title: 'Tỷ lệ hoàn thành môn học',
    description: 'Theo dõi xu hướng hoàn thành môn theo năm.',
    enabled: true,
    filters: {
      course: 'Nhap mon lap trinh',
      courseList: ['Nhap mon lap trinh', 'Ky thuat lap trinh', 'Cau truc du lieu & GT', 'Lap trinh HOT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    dataSource: {
      mode: 'api',
      endpoint: '/api/course-completion',
      manualJson: ''
    },
    chart: {
      type: 'line',
      color: '#3f51b5',
      smooth: true,
      showDots: true
    },
    threshold: 70,
    benchmark: 75,
    warning: 60
  },
  {
    id: 'student-rating',
    type: 'studentRating',
    title: 'Xếp loại học lực sinh viên',
    description: 'Xếp loại 7 mức theo quy chuẩn 4 năm.',
    enabled: true,
    filters: {
      course: 'Tat ca',
      courseList: ['Tat ca', 'Nhap mon lap trinh', 'Ky thuat lap trinh', 'Cau truc du lieu & GT', 'Lap trinh HOT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    dataSource: {
      mode: 'api',
      endpoint: '/api/student-rating',
      manualJson: ''
    },
    chart: {
      type: 'bar',
      color: '#2563eb',
      smooth: false,
      showDots: false
    },
    threshold: 60,
    benchmark: 75,
    warning: 60
  },
  {
    id: 'skill-trend',
    type: 'skillTrend',
    title: 'Tập kỹ năng',
    description: 'Tiến độ hoàn thành kỹ năng theo 4 năm.',
    enabled: true,
    filters: {
      course: 'Nhap mon lap trinh',
      courseList: ['Nhap mon lap trinh', 'Ky thuat lap trinh', 'Cau truc du lieu & GT', 'Lap trinh HOT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    dataSource: {
      mode: 'api',
      endpoint: '/api/skill-trend',
      manualJson: ''
    },
    chart: {
      type: 'line',
      color: '#2563eb',
      smooth: true,
      showDots: true
    },
    threshold: 65,
    benchmark: 75,
    warning: 60
  }
];

const applyCardTextPatches = (configs) =>
  configs.map((cfg) => {
    const patch = CARD_TEXT_PATCHES[cfg.id];
    if (!patch) return cfg;
    const needsTitleFix = !cfg.title || (patch.oldTitles || []).includes(cfg.title);
    const needsDescFix = !cfg.description || (patch.oldDescriptions || []).includes(cfg.description);
    return {
      ...cfg,
      ...(needsTitleFix ? { title: patch.title } : {}),
      ...(needsDescFix ? { description: patch.description } : {})
    };
  });

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    class: 'all',
    performance: 'all',
    status: 'all'
  });
  const [searchText, setSearchText] = useState('');
  const [completionRange, setCompletionRange] = useState('all');
  const [cardConfigs, setCardConfigs] = useState([]);

  useEffect(() => {
    // Simulate API call
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [filters]);

  useEffect(() => {
    const loadConfig = () => {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const patched = applyCardTextPatches(parsed);
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(patched));
          setCardConfigs(patched);
        } catch {
          const defaults = buildDefaultCards();
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(defaults));
          setCardConfigs(defaults);
        }
      } else {
        const defaults = buildDefaultCards();
        const patched = applyCardTextPatches(defaults);
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(patched));
        setCardConfigs(patched);
      }
    };

    loadConfig();
    const handleStorage = (e) => {
      if (e.key === CONFIG_STORAGE_KEY) {
        loadConfig();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleIndustryFilterChange = (newFilters) => {
    console.log('Industry filters changed:', newFilters);
    // Xử lý filter change nếu cần
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
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

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {/* Phân bố năng lực theo môn học - đã gộp filter và bảng */}
      <div>
        <CoursePerformanceSection 
          searchText={searchText} 
          completionRange={completionRange}
          onSearchChange={setSearchText}
          onCompletionRangeChange={setCompletionRange}
          onFilterChange={handleIndustryFilterChange}
          showLectureCard={false}
          lectureTitle={null}
          lectureNote={null}
        />
        {cardConfigs.find((c) => c.type === 'courseCompletion' && c.enabled) && (
          <CourseCompletionTrend
            title={cardConfigs.find((c) => c.type === 'courseCompletion')?.title}
            description={cardConfigs.find((c) => c.type === 'courseCompletion')?.description}
          />
        )}
        {cardConfigs.find((c) => c.type === 'studentRating' && c.enabled) && (
          <StudentRatingTrend
            title={cardConfigs.find((c) => c.type === 'studentRating')?.title}
            description={cardConfigs.find((c) => c.type === 'studentRating')?.description}
          />
        )}
        {cardConfigs.find((c) => c.type === 'skillTrend' && c.enabled) && (
          <SkillCompletionTrend
            title={cardConfigs.find((c) => c.type === 'skillTrend')?.title}
            description={cardConfigs.find((c) => c.type === 'skillTrend')?.description}
          />
        )}
      </div>
      
      {/* Chỉ số tổng quan nhanh (KPI Cards) */}
      <div>
        <KPIMetrics data={dashboardData?.kpiMetrics} />
      </div>
      
      {/* Phân Tích Ngành */}
      <IndustryAnalysis />
      
      {/* Các phần khác giữ nguyên */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProgressOverview data={dashboardData?.progressOverview} selectedClass={filters.class} />
          <PerformanceChart data={dashboardData?.performanceChart} />
        </div>
        
        <div className="space-y-6">
          <NotificationPanel data={dashboardData?.notifications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
