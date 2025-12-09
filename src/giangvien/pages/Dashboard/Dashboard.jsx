import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import KPIMetrics from './components/KPIMetrics';
import ProgressOverview from './components/ProgressOverview';
import CourseMonitoring from './components/CourseMonitoring';
import NotificationPanel from './components/NotificationPanel';
import PerformanceChart from './components/PerformanceChart';
import GradeDistribution from './components/GradeDistribution';
import { mockDashboardData, mockStudentTrackingData } from '../../data/mockData';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    class: 'all',
    performance: 'all',
    status: 'all'
  });

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

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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
      <DashboardHeader 
        filters={filters} 
        onFilterChange={handleFilterChange}
      />
      
      <KPIMetrics data={dashboardData?.kpiMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProgressOverview data={dashboardData?.progressOverview} selectedClass={filters.class} />
          <GradeDistribution 
            data={dashboardData?.gradeDistribution} 
            students={mockStudentTrackingData?.students || []}
          />
          <PerformanceChart data={dashboardData?.performanceChart} />
        </div>
        
        <div className="space-y-6">
          <CourseMonitoring data={dashboardData?.courseMonitoring} />
          <NotificationPanel data={dashboardData?.notifications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;