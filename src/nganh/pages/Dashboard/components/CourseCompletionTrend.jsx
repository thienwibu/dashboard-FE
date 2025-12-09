import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  Legend
} from 'recharts';
import { BookOpenCheck, CalendarRange } from 'lucide-react';

const COURSE_OPTIONS = [
  { value: 'intro', label: 'Nhập môn lập trình' },
  { value: 'tech', label: 'Kỹ thuật lập trình' },
  { value: 'ds', label: 'Cấu trúc dữ liệu & GT' },
  { value: 'oop', label: 'Lập trình HĐT' }
];

const COMPLETION_BY_YEAR = {
  intro: { 2019: 58, 2020: 62, 2021: 65, 2022: 45, 2023: 75, 2024: 30 },
  tech: { 2019: 55, 2020: 60, 2021: 61, 2022: 52, 2023: 68, 2024: 49 },
  ds: { 2019: 50, 2020: 57, 2021: 59, 2022: 54, 2023: 66, 2024: 51 },
  oop: { 2019: 52, 2020: 59, 2021: 63, 2022: 56, 2023: 71, 2024: 55 }
};

const TOTAL_STUDENTS = {
  intro: { 2019: 180, 2020: 185, 2021: 190, 2022: 195, 2023: 200, 2024: 205 },
  tech: { 2019: 170, 2020: 175, 2021: 180, 2022: 182, 2023: 188, 2024: 190 },
  ds: { 2019: 165, 2020: 170, 2021: 175, 2022: 178, 2023: 182, 2024: 185 },
  oop: { 2019: 160, 2020: 168, 2021: 174, 2022: 180, 2023: 186, 2024: 190 }
};

const INDUSTRY_BENCHMARK = 75;

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, idx) => currentYear - idx).filter((y) => y >= 2013);

const getStatus = (value) => {
  if (value === null || value === undefined) return 'warning';
  if (value >= 80) return 'good';
  if (value < 50) return 'bad';
  return 'warning';
};

const statusColor = (status) => (status === 'good' ? '#16a34a' : status === 'warning' ? '#f59e0b' : '#ef4444');

const CourseCompletionTrend = ({ title, description }) => {
  const [selectedCourse, setSelectedCourse] = useState(COURSE_OPTIONS[0].value);
  const [startYear, setStartYear] = useState(Math.max(currentYear - 3, 2019));
  const [showBenchmark, setShowBenchmark] = useState(true);

  const chartData = useMemo(() => {
    const years = Array.from({ length: 4 }, (_, i) => startYear + i);
    return years.map((year, idx) => {
      const completion =
        selectedCourse && COMPLETION_BY_YEAR[selectedCourse]
          ? COMPLETION_BY_YEAR[selectedCourse][year] ?? null
          : null;
      const prevYear = years[idx - 1];
      const prevCompletion =
        prevYear !== undefined && COMPLETION_BY_YEAR[selectedCourse]?.[prevYear] !== undefined
          ? COMPLETION_BY_YEAR[selectedCourse][prevYear]
          : null;
      const delta =
        prevCompletion !== null && prevCompletion !== undefined && completion !== null && completion !== undefined
          ? completion - prevCompletion
          : null;
      const total = TOTAL_STUDENTS[selectedCourse]?.[year] ?? 0;
      const status = getStatus(completion);
      return {
        year: `${year}`,
        completion,
        delta,
        total,
        status
      };
    });
  }, [selectedCourse, startYear]);

  const hasData = chartData.some((item) => item.completion !== null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const point = payload[0].payload;
      if (value === null || value === undefined) return null;
      const statusLabel = point.status === 'good' ? 'Tốt' : point.status === 'warning' ? 'Cần cải thiện' : 'Thấp';
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-900 mb-1">Năm {label}</p>
          <p className="text-sm text-gray-700">
            Tỷ lệ hoàn thành: <span className="font-semibold">{value}%</span>
          </p>
          <p className="text-sm text-gray-700">
            Trạng thái: <span className="font-semibold">{statusLabel}</span>
          </p>
          {point.delta !== null && (
            <p className={`text-sm ${point.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {point.delta >= 0 ? 'Tăng' : 'Giảm'} {Math.abs(point.delta)}% so với năm trước
            </p>
          )}
          {point.total ? (
            <p className="text-xs text-gray-500 mt-1">Số sinh viên: {point.total}</p>
          ) : null}
        </div>
      );
    }
    return null;
  };

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

  const summary = useMemo(() => {
    if (!hasData) return null;
    const numbers = chartData.map((d) => d.completion ?? 0);
    const years = chartData.map((d) => d.year);
    const trend = numbers.length >= 2 ? numbers[numbers.length - 1] - numbers[0] : 0;
    const diffs = numbers.map((v, idx) => (idx === 0 ? null : v - numbers[idx - 1]));
    const maxIncreaseIdx = diffs.reduce(
      (best, v, idx) => (v !== null && (best === -1 || v > diffs[best]) ? idx : best),
      -1
    );
    const maxDecreaseIdx = diffs.reduce(
      (worst, v, idx) => (v !== null && (worst === -1 || v < diffs[worst]) ? idx : worst),
      -1
    );
    const bestIdx = numbers.reduce((best, v, idx) => (v > numbers[best] ? idx : best), 0);
    const worstIdx = numbers.reduce((worst, v, idx) => (v < numbers[worst] ? idx : worst), 0);
    const avg =
      numbers.length > 0 ? Math.round((numbers.reduce((s, v) => s + v, 0) / numbers.length) * 10) / 10 : 0;

    return {
      trend,
      maxIncrease:
        maxIncreaseIdx > 0 ? { delta: diffs[maxIncreaseIdx], from: years[maxIncreaseIdx - 1], to: years[maxIncreaseIdx] } : null,
      maxDecrease:
        maxDecreaseIdx > 0 ? { delta: diffs[maxDecreaseIdx], from: years[maxDecreaseIdx - 1], to: years[maxDecreaseIdx] } : null,
      best: { year: years[bestIdx], value: numbers[bestIdx] },
      worst: { year: years[worstIdx], value: numbers[worstIdx] },
      average: avg
    };
  }, [chartData, hasData]);

  return (
    <div className="card p-6 mt-4">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title || 'Tỷ lệ hoàn thành môn học'}
            </h3>
            <p className="text-sm text-gray-600">
              {description || 'Chọn môn và mốc năm (4 năm liên tiếp)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
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
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showBenchmark}
              onChange={(e) => setShowBenchmark(e.target.checked)}
              className="h-4 w-4"
            />
            Hiển thị đường chuẩn ngành
          </label>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <ReferenceArea y1={80} y2={100} fill="#dcfce7" fillOpacity={0.35} />
            <ReferenceArea y1={50} y2={80} fill="#fef9c3" fillOpacity={0.3} />
            <ReferenceArea y1={0} y2={50} fill="#fee2e2" fillOpacity={0.3} />
            {showBenchmark && (
              <ReferenceLine
                y={INDUSTRY_BENCHMARK}
                stroke="#2563eb"
                strokeDasharray="5 5"
                label={{ value: 'Chuẩn ngành', position: 'right', fill: '#2563eb', fontSize: 12 }}
              />
            )}

            <defs>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="1" y2="0">
                {chartData.map((point, idx) => {
                  const offset = chartData.length > 1 ? (idx / (chartData.length - 1)) * 100 : 0;
                  const color = statusColor(point.status);
                  return <stop key={idx} offset={`${offset}%`} stopColor={color} />;
                })}
              </linearGradient>
            </defs>

            <Line
              type="monotone"
              dataKey="completion"
              name="Tỷ lệ hoàn thành"
              stroke="url(#completionGradient)"
              strokeWidth={3}
              dot={({ payload }) => {
                const color = statusColor(payload.status);
                return <circle key={`dot-${payload.year}`} r={5} fill={color} stroke="#e0e7ff" strokeWidth={2} />;
              }}
              activeDot={({ cx, cy, payload }) => {
                const color = statusColor(payload.status);
                return <circle key={`active-${payload.year}`} cx={cx} cy={cy} r={7} fill={color} stroke="#fff" strokeWidth={2} />;
              }}
              connectNulls
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!hasData && <div className="mt-4 text-sm text-gray-600">Không có dữ liệu cho giai đoạn này</div>}

      {hasData && summary && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryItem
            label="Xu hướng 4 năm"
            value={`${summary.trend >= 0 ? '+' : ''}${summary.trend}%`}
            tone={summary.trend > 0 ? 'up' : summary.trend < 0 ? 'down' : 'default'}
          />
          <SummaryItem
            label="Tăng mạnh nhất"
            value={
              summary.maxIncrease
                ? `${summary.maxIncrease.delta}% (${summary.maxIncrease.from} → ${summary.maxIncrease.to})`
                : '-'
            }
            tone="up"
          />
          <SummaryItem
            label="Giảm mạnh nhất"
            value={
              summary.maxDecrease
                ? `${summary.maxDecrease.delta}% (${summary.maxDecrease.from} → ${summary.maxDecrease.to})`
                : '-'
            }
            tone="down"
          />
          <SummaryItem
            label="Năm tốt nhất"
            value={`${summary.best.year} (${summary.best.value}%)`}
            tone="up"
          />
          <SummaryItem
            label="Năm thấp nhất"
            value={`${summary.worst.year} (${summary.worst.value}%)`}
            tone="down"
          />
          <SummaryItem label="Trung bình 4 năm" value={`${summary.average}%`} />
        </div>
      )}
    </div>
  );
};

export default CourseCompletionTrend;
