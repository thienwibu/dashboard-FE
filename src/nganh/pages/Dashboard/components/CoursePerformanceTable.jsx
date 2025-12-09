import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  BookOpen,
  ShieldCheck,
  Gauge
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { coursePerformanceData } from '../../../data/coursePerformanceData';
import { COURSE_DEFINITIONS } from './courseConstants';

const STATUS_LEVELS = [
  {
    label: 'Tốt',
    minProficiency: 80,
    minMastery: 75,
    maxStruggling: 15,
    color: 'text-green-600 bg-green-50',
    Icon: CheckCircle
  },
  {
    label: 'Khá',
    minProficiency: 65,
    minMastery: 60,
    maxStruggling: 25,
    color: 'text-blue-600 bg-blue-50',
    Icon: CheckCircle
  },
  {
    label: 'Trung bình',
    minProficiency: 50,
    minMastery: 50,
    maxStruggling: 40,
    color: 'text-yellow-600 bg-yellow-50',
    Icon: AlertCircle
  },
  {
    label: 'Tệ',
    minProficiency: 0,
    minMastery: 0,
    maxStruggling: 100,
    color: 'text-red-600 bg-red-50',
    Icon: AlertCircle
  }
];
const COMPLETION_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: '85-100', label: '85% - 100% (Xuất sắc)' },
  { value: '70-85', label: '70% - 85% (Tốt)' },
  { value: '50-70', label: '50% - 70% (Trung bình)' },
  { value: '0-50', label: '0% - 50% (Cần cải thiện)' }
];
const calculateStatus = (proficiencyRate, strugglingRate, avgMastery) => {
  for (const level of STATUS_LEVELS) {
    if (
      proficiencyRate >= level.minProficiency &&
      avgMastery >= level.minMastery &&
      strugglingRate <= level.maxStruggling
    ) {
      return { label: level.label, badge: level.color, Icon: level.Icon };
    }
  }
  return { label: 'Tệ', badge: 'text-red-600 bg-red-50', Icon: AlertCircle };
};

const getTrendMeta = (trend) =>
  trend >= 0
    ? { label: `+${trend}%`, Icon: TrendingUp, color: 'text-green-600' }
    : { label: `${trend}%`, Icon: TrendingDown, color: 'text-red-600' };

const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const calculateMasteryPercent = (courseDefinition, courseInfo) => {
  if (!courseInfo) return 0;
  const passed = courseDefinition.skills.reduce((count, skill) => {
    const value = courseInfo.skills?.[skill.key] ?? 0;
    return count + (value >= skill.threshold ? 1 : 0);
  }, 0);
  return Math.round((passed / courseDefinition.skills.length) * 100);
};

const CoursePerformanceTable = ({
  searchText = '',
  completionRange = 'all',
  onSearchChange,
  onCompletionRangeChange,
  onFilterChange
}) => {
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState({ semester: 'all', subject: 'all', status: 'all' });
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState({});

  const semesterOptions = useMemo(() => {
    const semesters = new Set(coursePerformanceData.students.map((student) => student.semester));
    return ['Tất cả', ...Array.from(semesters)];
  }, []);

  const courseStats = useMemo(
    () =>
      COURSE_DEFINITIONS.map((course) => {
        const students = coursePerformanceData.students.filter((student) => student.courses[course.dataKey]);
        if (!students.length) {
          return {
            ...course,
            students: [],
            basicSkillRate: 0,
            notAchievedRate: 100,
            averageScore: 0,
            trend: 0,
            status: calculateStatus(0, 100, 0)
          };
        }

        const masteryScores = students.map((student) =>
          calculateMasteryPercent(course, student.courses[course.dataKey])
        );
        const strongStudents = masteryScores.filter((value) => value >= 80).length;
        const strugglingStudents = masteryScores.filter((value) => value < 60).length;
        const basicSkillRate = Math.round((strongStudents / students.length) * 100);
        const notAchievedRate = Math.max(0, 100 - basicSkillRate);
        const avgMastery =
          masteryScores.length > 0
            ? Math.round(
                (masteryScores.reduce((sum, value) => sum + value, 0) / masteryScores.length) * 10
              ) / 10
            : 0;
        const avgCompletion =
          students.reduce((sum, student) => sum + student.courses[course.dataKey].completionRate, 0) /
          students.length;
        const trend = Math.round(avgCompletion - 70);

        return {
          ...course,
          students,
          basicSkillRate,
          notAchievedRate,
          trend,
          status: calculateStatus(basicSkillRate, notAchievedRate, avgMastery)
        };
      }),
    []
  );

  const matchesCompletionRange = (value) => {
    if (completionRange === 'all') return true;
    const [min, max] = completionRange.split('-').map(Number);
    return value >= min && value <= max;
  };

  const getFilteredStudents = (course) => {
    const students = course.students || [];
    return students.filter((student) => {
      const info = student.courses[course.dataKey];
      const matchesSearch =
        !searchText ||
        normalize(student.name).includes(normalize(searchText)) ||
        student.studentId.toLowerCase().includes(searchText.toLowerCase());
      const matchesCompletion = matchesCompletionRange(info.completionRate);
      return matchesSearch && matchesCompletion;
    });
  };

  const paginateStudents = (course, students) => {
    const page = currentPage[course.key] || 1;
    const start = (page - 1) * studentsPerPage;
    return {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(students.length / studentsPerPage)),
      pageStudents: students.slice(start, start + studentsPerPage)
    };
  };

  const updatePage = (courseKey, page) => {
    setCurrentPage((prev) => ({ ...prev, [courseKey]: page }));
  };

  const buildPaginationItems = (current, total) => {
    const items = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) items.push({ type: 'page', value: i });
      return items;
    }
    if (current <= 4) {
      for (let i = 1; i <= 6; i++) items.push({ type: 'page', value: i });
      items.push({ type: 'ellipsis', key: 'end' });
      items.push({ type: 'page', value: total });
      return items;
    }
    if (current >= total - 3) {
      items.push({ type: 'page', value: 1 });
      items.push({ type: 'ellipsis', key: 'start' });
      for (let i = total - 5; i <= total; i++) items.push({ type: 'page', value: i });
      return items;
    }
    items.push({ type: 'page', value: 1 });
    items.push({ type: 'ellipsis', key: 'mid-start' });
    for (let i = current - 1; i <= current + 1; i++) items.push({ type: 'page', value: i });
    items.push({ type: 'ellipsis', key: 'mid-end' });
    items.push({ type: 'page', value: total });
    return items;
  };

  const applyFilters = (course) => {
    if (filters.subject !== 'all' && course.key !== filters.subject) return false;
    if (filters.status !== 'all' && course.status.label !== filters.status) return false;
    if (filters.semester !== 'all') {
      const hasSemester = course.students.some((student) => student.semester === filters.semester);
      if (!hasSemester) return false;
    }
    if (searchText || completionRange !== 'all') return getFilteredStudents(course).length > 0;
    return true;
  };

  const filteredCourses = courseStats.filter(applyFilters);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const toggleCourse = (courseKey) => {
    setExpandedCourse((prev) => (prev === courseKey ? null : courseKey));
  };

  const labelClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';

  const selectBase =
    'border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const selectTone = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white'
    : 'bg-white border-gray-300 text-gray-900';
  const iconBoxTone = isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600';

  const optionStyle = (value, selectedValue, isFuture = false) => ({
    backgroundColor: value === selectedValue ? '#e8eaf6' : 'white',
    color: isFuture ? '#dc2626' : '#111827'
  });

  const FilterSelect = ({ icon: Icon, children, className = '', ...rest }) => (
    <div className="flex items-center gap-2 min-w-[190px]">
      {Icon && (
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconBoxTone}`}>
          <Icon className="h-4 w-4" />
        </div>
      )}
      <select className={`${selectBase} ${selectTone} ${className}`} {...rest}>
        {children}
      </select>
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${labelClass}`} />
            <input
              type="text"
              placeholder="Tìm theo tên sinh viên..."
              value={searchText}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <FilterSelect
            icon={Calendar}
            value={filters.semester}
            onChange={(event) => handleFilterChange('semester', event.target.value)}
          >
            {semesterOptions.map((option) => (
              <option
                key={option}
                value={option === 'Tất cả' ? 'all' : option}
                style={optionStyle(option === 'Tất cả' ? 'all' : option, filters.semester)}
              >
                {option}
              </option>
            ))}
          </FilterSelect>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            icon={BookOpen}
            value={filters.subject}
            onChange={(event) => handleFilterChange('subject', event.target.value)}
          >
            <option value="all">Môn</option>
            {COURSE_DEFINITIONS.map((course) => (
              <option
                key={course.key}
                value={course.key}
                style={optionStyle(course.key, filters.subject)}
              >
                {course.name}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            icon={ShieldCheck}
            value={filters.status}
            onChange={(event) => handleFilterChange('status', event.target.value)}
          >
            <option value="all">Trạng thái</option>
            {['Tốt', 'Khá', 'Trung bình', 'Tệ'].map((status) => (
              <option
                key={status}
                value={status}
                style={optionStyle(status, filters.status)}
              >
                {status}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            icon={Gauge}
            value={completionRange}
            onChange={(event) => onCompletionRangeChange?.(event.target.value)}
          >
            {COMPLETION_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={optionStyle(option.value, completionRange)}
              >
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-semibold ${labelClass} uppercase`}>Môn học</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold ${labelClass} uppercase`}>Tỷ lệ đạt</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold ${labelClass} uppercase`}>Tỷ lệ chưa đạt</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold ${labelClass} uppercase`}>Xu hướng</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold ${labelClass} uppercase`}>Trạng thái</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className={`px-6 py-8 text-center text-sm ${labelClass}`}>
                  Không tìm thấy môn học nào phù hợp với điều kiện lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => {
                const isExpanded = expandedCourse === course.key;
                const filteredStudents = isExpanded ? getFilteredStudents(course) : [];
                const { pageStudents, totalPages, currentPage: page } = paginateStudents(
                  course,
                  filteredStudents
                );
                const trendMeta = getTrendMeta(course.trend);
                const StatusIcon = course.status.Icon;

                return (
                  <React.Fragment key={course.key}>
                    <tr
                      className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                      onClick={() => toggleCourse(course.key)}
                    >
                      <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${textClass}`}>
                        <div className="flex items-center">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          )}
                          {course.name}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${labelClass}`}>
                        <span className="font-semibold">{course.basicSkillRate}%</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-500">
                        <span className="font-semibold">{course.notAchievedRate}%</span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${labelClass}`}>
                        <div className="flex items-center">
                          <trendMeta.Icon className={`h-4 w-4 mr-1 ${trendMeta.color}`} />
                          <span className={`font-semibold ${trendMeta.color}`}>{trendMeta.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.status.badge}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {course.status.label}
                        </span>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className={isDarkMode ? 'bg-gray-900 px-4 py-4' : 'bg-gray-50 px-4 py-4'}>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                            <p className={`text-sm font-medium ${labelClass}`}>
                              Tổng số sinh viên: <span className="font-semibold">{filteredStudents.length}</span>
                            </p>
                            <div className="flex items-center gap-3">
                              <label className={`text-sm ${labelClass}`}>Hiển thị:</label>
                              <select
                                value={studentsPerPage}
                                onChange={(event) => {
                                  setStudentsPerPage(Number(event.target.value));
                                  setCurrentPage((prev) => ({ ...prev, [course.key]: 1 }));
                                }}
                                className={`px-3 py-1 rounded border text-sm ${
                                  isDarkMode
                                    ? 'bg-gray-800 border-gray-700 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              >
                                {[5, 10, 15, 20, 30].map((size) => (
                                  <option key={size} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {filteredStudents.length === 0 ? (
                            <div className={`text-sm ${labelClass}`}>
                              Không có sinh viên nào phù hợp với điều kiện lọc hiện tại.
                            </div>
                          ) : (
                            <>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                                  <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                                    <tr>
                                      <th className={`px-3 py-2 text-left text-xs font-semibold ${labelClass}`}>
                                        Tên sinh viên
                                      </th>
                                      <th className={`px-3 py-2 text-center text-xs font-semibold ${labelClass}`}>
                                        % Hoàn thành
                                      </th>
                                      {course.skills.map((skill) => (
                                        <th
                                          key={skill.key}
                                          className={`px-3 py-2 text-center text-xs font-semibold ${labelClass}`}
                                        >
                                          {skill.label}
                                        </th>
                                      ))}
                                      <th className={`px-3 py-2 text-center text-xs font-semibold ${labelClass}`}>
                                        ĐTB
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className={isDarkMode ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-100'}>
                                    {pageStudents.map((student) => {
                                      const info = student.courses[course.dataKey];
                                      return (
                                        <tr key={student.id} className={isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                                          <td className={`px-3 py-2 text-sm font-medium ${textClass}`}>
                                            <div>{student.name}</div>
                                            <div className={`text-xs ${labelClass}`}>{student.studentId}</div>
                                          </td>
                                          <td className={`px-3 py-2 text-sm text-center ${labelClass}`}>
                                            <span className="font-semibold">{info.completionRate}%</span>
                                          </td>
                                          {course.skills.map((skill) => {
                                            const value = info.skills[skill.key] ?? 0;
                                            const tone =
                                              value >= skill.threshold
                                                ? 'text-green-600'
                                                : value >= skill.threshold - 10
                                                  ? 'text-yellow-600'
                                                  : 'text-red-600';
                                            return (
                                              <td key={skill.key} className={`px-3 py-2 text-sm text-center ${tone}`}>
                                                <span className="font-semibold">{value}%</span>
                                              </td>
                                            );
                                          })}
                                          <td className={`px-3 py-2 text-sm text-center ${labelClass}`}>
                                            <span className="font-semibold">{info.avgScore}/10</span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {totalPages > 1 && (
                                <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <span className={`text-sm ${labelClass}`}>
                                    Hiển thị {(page - 1) * studentsPerPage + 1} -{' '}
                                    {Math.min(page * studentsPerPage, filteredStudents.length)} trên tổng số{' '}
                                    {filteredStudents.length} sinh viên
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        updatePage(course.key, Math.max(1, page - 1));
                                      }}
                                      disabled={page === 1}
                                      className={`w-9 h-9 rounded border ${
                                        page === 1
                                          ? 'cursor-not-allowed opacity-40'
                                          : isDarkMode
                                            ? 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      <ChevronLeft className="h-4 w-4 mx-auto" />
                                    </button>
                                    {buildPaginationItems(page, totalPages).map((item) =>
                                      item.type === 'page' ? (
                                        <button
                                          key={`${course.key}-page-${item.value}`}
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            updatePage(course.key, item.value);
                                          }}
                                          className={`min-w-[36px] h-9 rounded border text-sm font-medium ${
                                            page === item.value
                                              ? 'bg-blue-600 border-blue-600 text-white'
                                              : isDarkMode
                                                ? 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'
                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                                          }`}
                                        >
                                          {item.value}
                                        </button>
                                      ) : (
                                        <span
                                          key={`${course.key}-${item.key}`}
                                          className={`min-w-[36px] h-9 rounded border flex items-center justify-center text-sm ${
                                            isDarkMode
                                              ? 'bg-gray-900 border-gray-700 text-gray-400'
                                              : 'bg-white border-gray-200 text-gray-500'
                                          }`}
                                        >
                                          ...
                                        </span>
                                      )
                                    )}
                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        updatePage(course.key, Math.min(totalPages, page + 1));
                                      }}
                                      disabled={page === totalPages}
                                      className={`w-9 h-9 rounded border ${
                                        page === totalPages
                                          ? 'cursor-not-allowed opacity-40'
                                          : isDarkMode
                                            ? 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      <ChevronRight className="h-4 w-4 mx-auto" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursePerformanceTable;
