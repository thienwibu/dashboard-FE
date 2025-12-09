import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import CoursePerformanceTable from './CoursePerformanceTable';
import LectureEffectivenessCard from './LectureEffectivenessCard';

const CoursePerformanceSection = ({
  searchText,
  completionRange,
  onSearchChange,
  onCompletionRangeChange,
  onFilterChange,
  showLectureCard = true,
  lectureTitle,
  lectureNote
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Bảng tổng hợp
        </h3>
        <CoursePerformanceTable
          searchText={searchText}
          completionRange={completionRange}
          onSearchChange={onSearchChange}
          onCompletionRangeChange={onCompletionRangeChange}
          onFilterChange={onFilterChange}
        />
      </div>

      {showLectureCard && <LectureEffectivenessCard title={lectureTitle} note={lectureNote} />}
    </div>
  );
};

export default CoursePerformanceSection;
