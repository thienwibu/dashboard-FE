import React, { useState } from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const CourseSummaryCards = () => {
  const { isDarkMode } = useTheme();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      name: 'Nhập môn Lập trình',
      completionRate: 82,
      averageScore: 7.8,
      trend: 4,
      trendType: 'increase',
      instructor: 'TS. Nguyễn Văn An',
      completed: 123,
      inProgress: 20,
      dropped: 7,
      industryAvg: 75
    },
    {
      name: 'Kỹ thuật Lập trình',
      completionRate: 78,
      averageScore: 7.2,
      trend: 1,
      trendType: 'increase',
      instructor: 'TS. Trần Thị Bình',
      completed: 115,
      inProgress: 25,
      dropped: 10,
      industryAvg: 75
    },
    {
      name: 'Cấu trúc DL & GT',
      completionRate: 73,
      averageScore: 7.6,
      trend: -2,
      trendType: 'decrease',
      instructor: 'TS. Lê Văn Cường',
      completed: 110,
      inProgress: 30,
      dropped: 10,
      industryAvg: 75
    },
    {
      name: 'Lập trình HĐT',
      completionRate: 75,
      averageScore: 7.5,
      trend: 3,
      trendType: 'increase',
      instructor: 'TS. Phạm Thị Dung',
      completed: 113,
      inProgress: 28,
      dropped: 9,
      industryAvg: 75
    }
  ];

  const CourseCard = ({ course, onClick }) => {
    return (
      <div 
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 hover:shadow-lg transition-all cursor-pointer border-2 ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-blue-300'}`}
        onClick={onClick}
      >
        <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {course.name}
        </h4>
        <div className="space-y-1">
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-semibold text-lg">{course.completionRate}%</span> hoàn thành, ĐTB <span className="font-semibold">{course.averageScore}/10</span>
          </p>
          <div className="flex items-center">
            {course.trendType === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={`text-xs ${course.trendType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(course.trend)}% so với kỳ trước
            </span>
          </div>
        </div>
      </div>
    );
  };

  const DetailModal = ({ course, onClose }) => {
    if (!course) return null;

    const vsIndustry = course.completionRate - course.industryAvg;
    const vsIndustryScore = course.averageScore - 7.5; // Giả sử TB ngành là 7.5

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40" onClick={onClose}>
        <div 
          className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 relative animate-fadeIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose} 
            className={`absolute right-2 top-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {course.name}
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Giảng viên phụ trách</p>
              <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{course.instructor}</p>
            </div>

            <div>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Số sinh viên</p>
              <div className="space-y-1">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold text-green-600">{course.completed}</span> hoàn thành
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold text-blue-600">{course.inProgress}</span> đang học
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold text-red-600">{course.dropped}</span> bỏ học
                </p>
              </div>
            </div>

            <div>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>So sánh với TB ngành</p>
              <div className="space-y-1">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tỷ lệ hoàn thành: <span className={`font-semibold ${vsIndustry >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {vsIndustry >= 0 ? '+' : ''}{vsIndustry.toFixed(1)}%
                  </span> so với TB ngành ({course.industryAvg}%)
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Điểm TB: <span className={`font-semibold ${vsIndustryScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {vsIndustryScore >= 0 ? '+' : ''}{vsIndustryScore.toFixed(1)}
                  </span> so với TB ngành (7.5/10)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course, index) => (
          <CourseCard 
            key={index} 
            course={course} 
            onClick={() => setSelectedCourse(course)}
          />
        ))}
      </div>
      
      {selectedCourse && (
        <DetailModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </>
  );
};

export default CourseSummaryCards;

