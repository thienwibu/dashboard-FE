import React, { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import { coursePerformanceData } from '../../../data/coursePerformanceData';
import { CLASS_OPTIONS, COURSE_DEFINITIONS } from './courseConstants';

// Thẻ "Độ phù hợp bài giảng"
const LectureEffectivenessCard = ({ title, note }) => {
  const { isDarkMode } = useTheme();
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCourseKey, setSelectedCourseKey] = useState(COURSE_DEFINITIONS[0].key);

  const courseDefinition =
    COURSE_DEFINITIONS.find((course) => course.key === selectedCourseKey) || COURSE_DEFINITIONS[0];
  const classLabel = selectedClass === 'all' ? 'Tất cả lớp' : `Lớp ${selectedClass}`;

  const skillStats = useMemo(() => {
    const students = coursePerformanceData.students.filter((student) => {
      const courseInfo = student.courses[courseDefinition.dataKey];
      if (!courseInfo) return false;
      if (selectedClass === 'all') return true;
      return student.className === selectedClass;
    });

    if (!students.length) {
      return courseDefinition.skills.map((skill, index) => ({
        ...skill,
        average: 0,
        gap: -skill.threshold,
        index
      }));
    }

    return courseDefinition.skills.map((skill, index) => {
      const values = students.map(
        (student) => student.courses[courseDefinition.dataKey].skills[skill.key] ?? 0
      );
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return {
        ...skill,
        average: Math.round(average),
        gap: Math.round(average - skill.threshold),
        index
      };
    });
  }, [courseDefinition, selectedClass]);

  const effectivePercent = Math.round(
    (skillStats.filter((skill) => skill.average >= skill.threshold).length / skillStats.length) * 100
  );
  const riskyTopics = skillStats.filter((skill) => skill.average < 60).map((skill) => skill.label);
  const fasterTopics = skillStats
    .filter((skill) => skill.gap >= 12)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 2)
    .map((skill) => skill.label);

  const scatterData = skillStats.map((skill) => ({
    skill: skill.label,
    ability: skill.average,
    expected: skill.threshold,
    gap: skill.gap
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return (
      <div
        className={`rounded-lg border px-3 py-2 text-sm ${
          isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <p className="font-semibold">{point.skill}</p>
        <p>Khả năng trung bình: {point.ability}%</p>
        <p>Mức yêu cầu: {point.expected}%</p>
        <p className={point.gap >= 0 ? 'text-green-500' : 'text-red-500'}>
          Chênh lệch: {point.gap >= 0 ? '+' : ''}
          {point.gap}%
        </p>
      </div>
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 space-y-6`}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">
              Phân tích hiệu quả bài giảng
            </p>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title || 'Độ phù hợp bài giảng'}
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {note || 'Hiển thị hiệu quả giữa bài giảng và năng lực sinh viên.'}
            </p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {classLabel} ở {courseDefinition.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={selectedCourseKey}
              onChange={(event) => setSelectedCourseKey(event.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {COURSE_DEFINITIONS.map((course) => (
                <option key={course.key} value={course.key}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-indigo-50'} rounded-lg p-4`}>
          <p className="text-sm font-medium text-indigo-500">Hiệu quả mong đợi</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {effectivePercent}%
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Bài giảng đạt/vượt ngưỡng hiểu bài
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'} rounded-lg p-4`}>
          <p className="text-sm font-medium text-amber-600">Nguy cơ</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {riskyTopics.length
              ? `${riskyTopics.length} chủ đề dưới 60% (${riskyTopics.join(', ')})`
              : 'Không có chủ đề dưới 60%'}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Theo dõi và bổ sung hỗ trợ khi cần
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-emerald-50'} rounded-lg p-4`}>
          <p className="text-sm font-medium text-emerald-600">Nhịp độ giảng dạy</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {fasterTopics.length
              ? `Sinh viên làm nhanh hơn ~12% ở ${fasterTopics.join(', ')}`
              : 'Nhịp độ học tập ổn định'}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Gợi ý điều chỉnh độ khó hoặc tăng thử thách
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 40, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#d1d5db'} />
            <XAxis
              type="number"
              dataKey="ability"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              label={{ value: '% sinh viên làm được', position: 'insideBottom', offset: -20 }}
            />
            <YAxis
              type="category"
              dataKey="skill"
              width={120}
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData} fill={isDarkMode ? '#60a5fa' : '#2563eb'} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LectureEffectivenessCard;
