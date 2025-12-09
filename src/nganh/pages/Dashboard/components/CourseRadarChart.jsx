import React, { useMemo, useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';

const CourseRadarChart = () => {
  const { isDarkMode } = useTheme();
  const [selectedCourse, setSelectedCourse] = useState('NMLT');

  const courseNames = {
    NMLT: 'Nhập môn lập trình',
    KTLT: 'Kỹ thuật lập trình',
    CTDLGT: 'Cấu trúc dữ liệu & GT',
    LTHDT: 'Lập trình HĐT'
  };

  const skillData = {
    NMLT: [
      { skill: 'If-Else', value: 98 },
      { skill: 'For/While', value: 94 },
      { skill: 'Function', value: 100 },
      { skill: 'Array', value: 94 },
      { skill: 'String', value: 92 },
      { skill: 'Debug', value: 95 }
    ],
    KTLT: [
      { skill: 'If-Else', value: 90 },
      { skill: 'For/While', value: 88 },
      { skill: 'Function', value: 85 },
      { skill: 'Array', value: 82 },
      { skill: 'Pointer', value: 80 },
      { skill: 'Debug', value: 84 }
    ],
    CTDLGT: [
      { skill: 'Recursion', value: 78 },
      { skill: 'Sorting', value: 82 },
      { skill: 'Searching', value: 80 },
      { skill: 'Graph', value: 72 },
      { skill: 'Dynamic Prog.', value: 68 },
      { skill: 'Optimization', value: 70 }
    ],
    LTHDT: [
      { skill: 'OOP Basics', value: 85 },
      { skill: 'Encapsulation', value: 88 },
      { skill: 'Inheritance', value: 90 },
      { skill: 'Polymorphism', value: 86 },
      { skill: 'Abstraction', value: 84 },
      { skill: 'Design Patterns', value: 78 }
    ]
  };

  const colors = {
    NMLT: '#22c55e',
    KTLT: '#3b82f6',
    CTDLGT: '#f59e0b',
    LTHDT: '#8b5cf6'
  };

  const chartData = useMemo(() => skillData[selectedCourse] || [], [selectedCourse]);

  const selectedColor = colors[selectedCourse] || '#22c55e';
  const selectedCourseLabel = courseNames[selectedCourse] || 'Khóa học';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } p-3 border rounded-lg shadow-lg`}
        >
          <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {payload[0].payload.skill}
          </p>
          <p className="text-sm" style={{ color: selectedColor }}>
            <span className="font-medium">{selectedCourseLabel}:</span>{' '}
            <span className="font-semibold">{payload[0].payload.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Mức độ làm chủ kỹ năng theo môn học
        </h3>
        <label className="flex items-center gap-3 text-sm font-medium">
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chọn môn:</span>
          <select
            value={selectedCourse}
            onChange={(event) => setSelectedCourse(event.target.value)}
            className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-gray-900 border-gray-700 text-white focus:ring-indigo-400'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-indigo-500'
            }`}
          >
            {Object.entries(courseNames).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Mỗi nhánh thể hiện một kỹ năng trọng tâm của môn {selectedCourseLabel}.
      </p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name={selectedCourseLabel}
              dataKey="value"
              stroke={selectedColor}
              fill={selectedColor}
              fillOpacity={0.35}
              strokeWidth={3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CourseRadarChart;
