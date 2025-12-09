import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  Customized
} from 'recharts';
import { Layers, CalendarRange, BookOpen } from 'lucide-react';

const COURSE_OPTIONS = [
  { value: 'intro', label: 'Nhập môn lập trình' },
  { value: 'tech', label: 'Kỹ thuật lập trình' },
  { value: 'ds', label: 'Cấu trúc dữ liệu & GT' },
  { value: 'oop', label: 'Lập trình HĐT' }
];

const SKILL_MAP = {
  intro: ['If / Else', 'Vòng lặp For/While', 'Hàm & Tham số', 'Mảng 1 chiều', 'Xử lý Chuỗi', 'Debug cơ bản'],
  tech: ['Con trỏ & Bộ nhớ động', 'Struct', 'File', 'Hàm & Thủ tục', 'Mảng động'],
  ds: ['Array & Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Sorting'],
  oop: ['Class & Object', 'Inheritance', 'Polymorphism', 'Exception', 'Collections']
};

// Mock completion % per year for each course + skill
const COMPLETION_BY_SKILL = {
  intro: {
    'If / Else': { 2022: 72, 2023: 78, 2024: 82, 2025: 85 },
    'Vòng lặp For/While': { 2022: 68, 2023: 74, 2024: 79, 2025: 83 },
    'Hàm & Tham số': { 2022: 65, 2023: 71, 2024: 76, 2025: 81 },
    'Mảng 1 chiều': { 2022: 60, 2023: 68, 2024: 74, 2025: 78 },
    'Xử lý Chuỗi': { 2022: 58, 2023: 64, 2024: 70, 2025: 75 },
    'Debug cơ bản': { 2022: 62, 2023: 69, 2024: 73, 2025: 77 }
  },
  tech: {
    'Con trỏ & Bộ nhớ động': { 2022: 55, 2023: 62, 2024: 70, 2025: 75 },
    Struct: { 2022: 60, 2023: 66, 2024: 72, 2025: 78 },
    File: { 2022: 58, 2023: 64, 2024: 69, 2025: 73 },
    'Hàm & Thủ tục': { 2022: 63, 2023: 68, 2024: 74, 2025: 79 },
    'Mảng động': { 2022: 57, 2023: 63, 2024: 69, 2025: 74 }
  },
  ds: {
    'Array & Linked List': { 2022: 52, 2023: 60, 2024: 66, 2025: 72 },
    Stack: { 2022: 54, 2023: 62, 2024: 68, 2025: 74 },
    Queue: { 2022: 53, 2023: 60, 2024: 66, 2025: 71 },
    Tree: { 2022: 50, 2023: 58, 2024: 64, 2025: 70 },
    Graph: { 2022: 48, 2023: 56, 2024: 62, 2025: 68 },
    Sorting: { 2022: 55, 2023: 63, 2024: 69, 2025: 75 }
  },
  oop: {
    'Class & Object': { 2022: 62, 2023: 70, 2024: 76, 2025: 81 },
    Inheritance: { 2022: 58, 2023: 66, 2024: 73, 2025: 78 },
    Polymorphism: { 2022: 55, 2023: 63, 2024: 70, 2025: 75 },
    Exception: { 2022: 50, 2023: 58, 2024: 64, 2025: 70 },
    Collections: { 2022: 56, 2023: 64, 2024: 70, 2025: 76 }
  }
};

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, idx) => currentYear - idx).filter((y) => y >= 2013);

const SummaryItem = ({ label, value, tone = 'default' }) => {
  const toneClass =
    tone === 'up' ? 'text-green-600' : tone === 'down' ? 'text-red-600' : 'text-gray-800';
  return (
    <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
};

const SkillCompletionTrend = ({ title, description }) => {
  const [selectedCourse, setSelectedCourse] = useState(COURSE_OPTIONS[0].value);
  const [startYear, setStartYear] = useState(Math.max(currentYear - 3, 2022));
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);
  const [showAverage, setShowAverage] = useState(true);
  const [showDelta, setShowDelta] = useState(true);
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  useEffect(() => {
    const skills = SKILL_MAP[selectedCourse] || [];
    if (skills.length === 0) {
      setStartYear(Math.max(currentYear - 3, 2022));
    }
  }, [selectedCourse]);

  const yearKeys = useMemo(() => Array.from({ length: 4 }, (_, i) => startYear + i), [startYear]);

  const chartData = useMemo(() => {
    const skills = SKILL_MAP[selectedCourse] || [];
    const years = yearKeys;
    return years.map((year, idx) => {
      const point = { year: `${year}` };
      let sum = 0;
      let count = 0;
      skills.forEach((skill, skillIdx) => {
        const value = COMPLETION_BY_SKILL[selectedCourse]?.[skill]?.[year] ?? null;
        const prevYear = years[idx - 1];
        const prevVal =
          prevYear !== undefined
            ? COMPLETION_BY_SKILL[selectedCourse]?.[skill]?.[prevYear] ?? null
            : null;
        point[`skill_${skillIdx}`] = value;
        point[`skill_${skillIdx}_delta`] =
          value !== null && prevVal !== null ? Math.round((value - prevVal) * 10) / 10 : null;
        if (value !== null) {
          sum += value;
          count += 1;
        }
      });
      point.avg = count ? Math.round((sum / count) * 10) / 10 : null;
      return point;
    });
  }, [selectedCourse, yearKeys]);

  const insights = useMemo(() => {
    const skills = SKILL_MAP[selectedCourse] || [];
    if (!skills.length) return null;
    const firstYear = yearKeys[0];
    const lastYear = yearKeys[yearKeys.length - 1];
    const skillTrends = skills.map((skill) => {
      const first = COMPLETION_BY_SKILL[selectedCourse]?.[skill]?.[firstYear] ?? 0;
      const last = COMPLETION_BY_SKILL[selectedCourse]?.[skill]?.[lastYear] ?? 0;
      return { skill, delta: Math.round((last - first) * 10) / 10, last };
    });
    const totalChange = skillTrends.reduce((s, t) => s + t.delta, 0);
    const maxIncrease = skillTrends.reduce(
      (best, cur) => (best === null || cur.delta > best.delta ? cur : best),
      null
    );
    const maxDecrease = skillTrends.reduce(
      (worst, cur) => (worst === null || cur.delta < worst.delta ? cur : worst),
      null
    );
    const best = skillTrends.reduce((b, cur) => (b === null || cur.last > b.last ? cur : b), null);
    const worst = skillTrends.reduce((w, cur) => (w === null || cur.last < w.last ? cur : w), null);
    const avgTrend = skillTrends.length ? Math.round((totalChange / skillTrends.length) * 10) / 10 : 0;
    return { avgTrend, totalChange, maxIncrease, maxDecrease, best, worst };
  }, [selectedCourse, yearKeys]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow w-64">
        <p className="text-sm font-medium text-gray-900 mb-1">Năm {label}</p>
        {showAverage && (
          <p className="text-xs text-gray-600 mb-2">Điểm TB kỹ năng: {point.avg ?? '-'}%</p>
        )}
        <div className="space-y-1 max-h-40 overflow-auto pr-1">
          {payload.map((item, idx) => {
            const skillLabel = chartData.find((d) => d.year === label)?.skillLabels?.[idx] || SKILL_MAP[selectedCourse]?.[idx];
            if (item.value === null || item.value === undefined) return null;
            const delta = point?.[`${item.dataKey}_delta`];
            return (
              <div key={item.dataKey} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="font-medium">{skillLabel}:</span>
                <span className="font-semibold">{item.value}%</span>
                {showDelta && (
                  <span className={`text-xs ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {delta !== null && delta !== undefined ? `${delta >= 0 ? '+' : ''}${delta}%` : ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const optionStyle = (value, selectedValue, isFuture = false) => ({
    backgroundColor: value === selectedValue ? '#e8eaf6' : 'white',
    color: isFuture ? '#dc2626' : '#111827'
  });

  const HoverBackground = useCallback(
    ({ xAxisMap }) => {
      if (!highlightEnabled || !hoveredYear) return null;
      const xAxis = xAxisMap?.[0];
      const index = chartData.findIndex((d) => d.year === hoveredYear);
      if (!xAxis || index === -1) return null;
      const band = xAxis?.bandSize || 0;
      const x = xAxis.scale(index) - band * 0.1;
      const width = band * 1.2;
      return <rect x={x} y={0} width={width} height="100%" fill="#e0f2fe" opacity={0.25} />;
    },
    [chartData, highlightEnabled, hoveredYear]
  );

  return (
    <div className="card p-6 mt-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title || 'Tập kỹ năng'}
            </h3>
            <p className="text-sm text-gray-600">
              {description || 'Tiến độ hoàn thành kỹ năng theo 4 năm.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Môn</span>
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {COURSE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-gray-500" />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
            >
              {YEAR_OPTIONS.map((y) => {
                const isFuture = y > currentYear;
                const isSelected = y === startYear;
                const style = {
                  color: isFuture ? '#dc2626' : '#111827',
                  backgroundColor: isSelected ? '#e8eaf6' : 'white'
                };
                return (
                  <option key={y} value={y} style={style}>
                    {y} - {y + 3}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={showAverage} onChange={() => setShowAverage((v) => !v)} />
              Hiển thị điểm TB
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={showDelta} onChange={() => setShowDelta((v) => !v)} />
              Hiển thị biến động
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={highlightEnabled}
                onChange={() => setHighlightEnabled((v) => !v)}
              />
              Bật highlight
            </label>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            onMouseMove={(state) => {
              if (state?.activeLabel) setHoveredYear(state.activeLabel);
            }}
            onMouseLeave={() => setHoveredYear(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            {highlightEnabled && (
              <>
                <ReferenceArea x1={hoveredYear} x2={hoveredYear} fill="#e0f2fe" fillOpacity={0.2} />
                <Customized component={<HoverBackground />} />
              </>
            )}
            {SKILL_MAP[selectedCourse]?.map((skill, idx) => {
              const color = `hsl(${(idx * 55) % 360} 70% 50%)`;
              const isFocused = !hoveredSkill || hoveredSkill === skill;
              return (
                <Line
                  key={skill}
                  type="monotone"
                  dataKey={`skill_${idx}`}
                  name={skill}
                  strokeWidth={isFocused ? 4 : 2.5}
                  stroke={color}
                  dot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: color }}
                  activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2, fill: color }}
                  connectNulls
                  opacity={hoveredSkill && hoveredSkill !== skill ? 0.4 : 1}
                  onMouseOver={() => setHoveredSkill(skill)}
                  onMouseOut={() => setHoveredSkill(null)}
                  isAnimationActive
                  animationDuration={600}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {insights && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryItem
            label="Xu hướng chung (4 năm)"
            value={`${insights.avgTrend >= 0 ? '+' : ''}${insights.avgTrend}%`}
            tone={insights.avgTrend > 0 ? 'up' : insights.avgTrend < 0 ? 'down' : 'default'}
          />
          <SummaryItem
            label="Thay đổi tổng"
            value={`${insights.totalChange >= 0 ? '+' : ''}${insights.totalChange}%`}
            tone={insights.totalChange > 0 ? 'up' : insights.totalChange < 0 ? 'down' : 'default'}
          />
          <SummaryItem
            label="Tăng mạnh nhất"
            value={
              insights.maxIncrease
                ? `${insights.maxIncrease.skill}: ${insights.maxIncrease.delta}%`
                : '-'
            }
            tone="up"
          />
          <SummaryItem
            label="Giảm mạnh nhất"
            value={
              insights.maxDecrease
                ? `${insights.maxDecrease.skill}: ${insights.maxDecrease.delta}%`
                : '-'
            }
            tone="down"
          />
          <SummaryItem
            label="Kỹ năng tốt nhất"
            value={
              insights.best ? `${insights.best.skill}: ${insights.best.last}%` : '-'
            }
            tone="up"
          />
          <SummaryItem
            label="Kỹ năng thấp nhất"
            value={
              insights.worst ? `${insights.worst.skill}: ${insights.worst.last}%` : '-'
            }
            tone="down"
          />
        </div>
      )}
    </div>
  );
};

export default SkillCompletionTrend;
