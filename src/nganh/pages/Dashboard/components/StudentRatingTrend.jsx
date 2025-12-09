import React, { useMemo, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
  Customized
} from 'recharts';
import { BarChart3, CalendarRange } from 'lucide-react';

const LEVELS = [
  { key: 'xs', label: 'Xuất sắc', color: '#4c8bf5' },
  { key: 'g', label: 'Giỏi', color: '#63b3f3' },
  { key: 'kg', label: 'Khá giỏi', color: '#f5a623' },
  { key: 'k', label: 'Khá', color: '#f6b84f' },
  { key: 'tbk', label: 'Trung bình khá', color: '#f8cc6b' },
  { key: 'tb', label: 'Trung bình', color: '#fbd38d' },
  { key: 'yk', label: 'Yếu / Kém', color: '#eb4d4b' }
];

const RATING_DISTRIBUTION = {
  2022: { xs: 8, g: 15, kg: 20, k: 22, tbk: 18, tb: 12, yk: 5 },
  2023: { xs: 10, g: 18, kg: 21, k: 20, tbk: 16, tb: 10, yk: 5 },
  2024: { xs: 12, g: 20, kg: 22, k: 18, tbk: 14, tb: 9, yk: 5 },
  2025: { xs: 14, g: 20, kg: 22, k: 17, tbk: 13, tb: 9, yk: 5 }
};

const TOTAL_STUDENTS = {
  2022: 200,
  2023: 205,
  2024: 210,
  2025: 215
};

const GOOD_BENCHMARK = 70; // % Khá trở lên
const WEAK_BENCHMARK = 10; // % Yếu/Kém tối đa

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, idx) => currentYear - idx).filter((y) => y >= 2013);

const statusColor = (status) => (status === 'good' ? '#16a34a' : status === 'warning' ? '#f59e0b' : '#ef4444');

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

const StudentRatingTrend = ({ title, description }) => {
  const [startYear, setStartYear] = useState(Math.max(currentYear - 3, 2022));
  const [hoveredYear, setHoveredYear] = useState(null);
  const [clickedInfo, setClickedInfo] = useState(null);

  const chartData = useMemo(() => {
    const years = Array.from({ length: 4 }, (_, i) => startYear + i);
    return years.map((year, idx) => {
      const raw = RATING_DISTRIBUTION[year] || {};
      const total = TOTAL_STUDENTS[year] || 0;
      const prevYear = years[idx - 1];
      const prevRaw = prevYear ? RATING_DISTRIBUTION[prevYear] || {} : {};

      const dataPoint = { year: `${year}`, totalStudents: total };
      let goodRatio = 0;
      let weakRatio = 0;

      LEVELS.forEach(({ key }) => {
        const pct = raw[key] || 0;
        const count = Math.round((pct / 100) * total);
        const prevPct = prevRaw[key] ?? null;
        dataPoint[key] = pct;
        dataPoint[`${key}_count`] = count;
        dataPoint[`${key}_delta`] = prevPct !== null && prevPct !== undefined ? pct - prevPct : null;
        if (['xs', 'g', 'kg', 'k'].includes(key)) goodRatio += pct;
        if (key === 'yk') weakRatio += pct;
      });

      dataPoint.goodRatio = goodRatio;
      dataPoint.weakRatio = weakRatio;

      if (goodRatio >= GOOD_BENCHMARK && weakRatio <= WEAK_BENCHMARK) {
        dataPoint.status = 'good';
      } else if (goodRatio >= GOOD_BENCHMARK - 5 && weakRatio <= WEAK_BENCHMARK + 5) {
        dataPoint.status = 'warning';
      } else {
        dataPoint.status = 'bad';
      }

      return dataPoint;
    });
  }, [startYear]);

  const summary = useMemo(() => {
    if (!chartData.length) return null;
    const metricSeries = chartData.map((p) => p.goodRatio || 0);
    const years = chartData.map((p) => p.year);
    const trend = metricSeries.length >= 2 ? metricSeries[metricSeries.length - 1] - metricSeries[0] : 0;
    const diffs = metricSeries.map((v, idx) => (idx === 0 ? null : v - metricSeries[idx - 1]));
    const maxIncreaseIdx = diffs.reduce(
      (best, v, idx) => (v !== null && (best === -1 || v > diffs[best]) ? idx : best),
      -1
    );
    const maxDecreaseIdx = diffs.reduce(
      (worst, v, idx) => (v !== null && (worst === -1 || v < diffs[worst]) ? idx : worst),
      -1
    );
    const bestIdx = metricSeries.reduce((best, v, idx) => (v > metricSeries[best] ? idx : best), 0);
    const worstIdx = metricSeries.reduce((worst, v, idx) => (v < metricSeries[worst] ? idx : worst), 0);
    const average = metricSeries.length
      ? Math.round((metricSeries.reduce((s, v) => s + v, 0) / metricSeries.length) * 10) / 10
      : 0;

    return {
      trend,
      maxIncrease:
        maxIncreaseIdx > 0
          ? { delta: diffs[maxIncreaseIdx], from: years[maxIncreaseIdx - 1], to: years[maxIncreaseIdx] }
          : null,
      maxDecrease:
        maxDecreaseIdx > 0
          ? { delta: diffs[maxDecreaseIdx], from: years[maxDecreaseIdx - 1], to: years[maxDecreaseIdx] }
          : null,
      best: { year: years[bestIdx], value: metricSeries[bestIdx] },
      worst: { year: years[worstIdx], value: metricSeries[worstIdx] },
      average
    };
  }, [chartData]);

  const handleBarClick = (point, levelKey) => {
    if (!point) return;
    const year = point.year;
    const total = point.totalStudents || 0;
    const pct = point[levelKey] || 0;
    const count = point[`${levelKey}_count`] || 0;
    const levelLabel = LEVELS.find((l) => l.key === levelKey)?.label || levelKey;
    setClickedInfo({ year, levelLabel, pct, count, total });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow w-64">
        <p className="text-sm font-medium text-gray-900 mb-1">Năm {label}</p>
        <p className="text-xs text-gray-500 mb-2">Tổng: {point.totalStudents || 0} sinh viên</p>
        <div className="space-y-1 max-h-40 overflow-auto pr-1">
          {payload.map((entry) => {
            const delta = point?.[`${entry.dataKey}_delta`];
            const deltaText = delta === null || delta === undefined ? '' : `${delta >= 0 ? '+' : ''}${delta}%`;
            return (
              <div key={entry.name} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: entry.fill }}></span>
                <span className="font-medium">{entry.name}:</span>
                <span className="font-semibold">{entry.value}%</span>
                <span className="text-xs text-gray-500">({point?.[`${entry.dataKey}_count`] || 0} SV)</span>
                <span className={`text-xs ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {deltaText}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-600 space-y-1 border-t pt-2">
          <div>
            Tỷ lệ Khá trở lên: <span className="font-semibold">{point.goodRatio?.toFixed(1) || 0}%</span>
          </div>
          <div>
            Tỷ lệ cần cải thiện (Yếu/Kém):{' '}
            <span className="font-semibold">{point.weakRatio?.toFixed(1) || 0}%</span>
          </div>
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
      if (!hoveredYear) return null;
      const xAxis = xAxisMap?.[0];
      const index = chartData.findIndex((d) => d.year === hoveredYear);
      if (!xAxis || index === -1) return null;
      const band = xAxis?.bandSize || 0;
      const x = xAxis.scale(index) - band * 0.1;
      const width = band * 1.2;
      return <rect x={x} y={0} width={width} height="100%" fill="#e0f2fe" opacity={0.25} />;
    },
    [chartData, hoveredYear]
  );

  const StatusBadges = useCallback(
    (props) => {
      const { xAxisMap, yAxisMap } = props;
      if (!xAxisMap || !yAxisMap) return null;
      const xAxis = xAxisMap[0];
      const yAxis = yAxisMap[0];
      const band = xAxis?.bandSize || 0;
      return (
        <g>
          {chartData.map((point, idx) => {
            const x = xAxis.scale(idx) + band / 2;
            const y = yAxis?.scale(105) || 0;
            const color = statusColor(point.status);
            return (
              <g key={point.year} transform={`translate(${x}, ${y})`}>
                <circle r={8} fill={color} opacity={0.15} />
                <circle r={5} fill={color} />
              </g>
            );
          })}
        </g>
      );
    },
    [chartData]
  );

  return (
    <div className="card p-6 mt-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title || 'Xếp loại học lực sinh viên'}
            </h3>
            <p className="text-sm text-gray-600">
              {description || 'Theo quy chuẩn 4 năm, xếp loại 7 mức'}
            </p>
          </div>
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
              const style = optionStyle(y, startYear, isFuture);
              return (
                <option key={y} value={y} style={style}>
                  {y} - {y + 3}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            barCategoryGap="20%"
            onMouseMove={(state) => {
              if (state?.activeLabel) setHoveredYear(state.activeLabel);
            }}
            onMouseLeave={() => setHoveredYear(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <ReferenceArea x1={hoveredYear} x2={hoveredYear} fill="#e0f2fe" fillOpacity={0.2} />
            <Customized component={<HoverBackground />} />
            <Customized component={<StatusBadges />} />

            {LEVELS.map((lvl, idx) => (
              <Bar
                key={lvl.key}
                dataKey={lvl.key}
                name={lvl.label}
                stackId="rating"
                fill={lvl.color}
                radius={idx === LEVELS.length - 1 ? [6, 6, 0, 0] : 0}
                isAnimationActive
                animationDuration={600}
                onClick={(data) => handleBarClick(data?.payload, lvl.key)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {clickedInfo && (
        <div className="mt-3 text-sm text-gray-700 p-3 rounded-lg border border-gray-200 bg-white">
          <div className="font-semibold text-gray-900 mb-1">
            {clickedInfo.levelLabel} – Năm {clickedInfo.year}
          </div>
          <div className="text-sm">
            Tỉ lệ: <span className="font-semibold">{clickedInfo.pct}%</span> ({clickedInfo.count}/
            {clickedInfo.total} sinh viên)
          </div>
          <div className="text-xs text-gray-500">* Danh sách sinh viên: dữ liệu mock, chưa có chi tiết.</div>
        </div>
      )}

      {summary && (
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
            value={`${summary.best.year} (${summary.best.value.toFixed(1)}%)`}
            tone="up"
          />
          <SummaryItem
            label="Năm thấp nhất"
            value={`${summary.worst.year} (${summary.worst.value.toFixed(1)}%)`}
            tone="down"
          />
          <SummaryItem label="Trung bình 4 năm" value={`${summary.average}%`} />
        </div>
      )}

      {!summary && <div className="mt-4 text-sm text-gray-600">Không có dữ liệu cho giai đoạn này</div>}
    </div>
  );
};

export default StudentRatingTrend;
