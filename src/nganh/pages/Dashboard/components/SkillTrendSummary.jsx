import React from 'react';

const TrendIcon = ({ direction }) => {
  if (direction === 'up') return <span className="text-green-600 font-semibold">▲</span>;
  if (direction === 'down') return <span className="text-red-500 font-semibold">▼</span>;
  return <span className="text-gray-500 font-semibold">▬</span>;
};

const Detail = ({ label, value, tone = 'neutral' }) => {
  const color =
    tone === 'up' ? 'text-green-700' : tone === 'down' ? 'text-red-600' : 'text-gray-800';
  return (
    <div className="flex items-center justify-between text-sm text-gray-700">
      <span>{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
};

/**
 * Hiển thị tóm tắt xu hướng kỹ năng.
 * @param {{
 *  trend: {
 *    trendDirection: 'up' | 'down' | 'flat',
 *    trendLabel?: string,
 *    totalChange?: number,
 *    strongestIncrease?: { change: number, from: number, to: number } | null,
 *    strongestDecrease?: { change: number, from: number, to: number } | null,
 *    bestYear?: { year: number, average: number } | null,
 *    worstYear?: { year: number, average: number } | null
 *  }
 * }} props
 */
const SkillTrendSummary = ({ trend = {} }) => {
  const {
    trendDirection = 'flat',
    trendLabel = 'Ổn định',
    totalChange = 0,
    strongestIncrease = null,
    strongestDecrease = null,
    bestYear = null,
    worstYear = null
  } = trend;

  const formatChange = (change) => {
    if (change === null || change === undefined) return '0%';
    const sign = change > 0 ? '+' : change < 0 ? '' : '';
    return `${sign}${change}%`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-800">
        <TrendIcon direction={trendDirection} />
        <span>Xu hướng chung:</span>
        <span className="font-semibold text-gray-900">{trendLabel}</span>
      </div>

      <div className="space-y-2">
        <Detail label="Thay đổi tổng cộng" value={formatChange(totalChange)} tone={totalChange > 0 ? 'up' : totalChange < 0 ? 'down' : 'neutral'} />
        <Detail
          label="Tăng mạnh nhất"
          value={
            strongestIncrease
              ? `${formatChange(strongestIncrease.change)} (${strongestIncrease.from} → ${strongestIncrease.to})`
              : '—'
          }
          tone={strongestIncrease?.change > 0 ? 'up' : 'neutral'}
        />
        <Detail
          label="Giảm mạnh nhất"
          value={
            strongestDecrease
              ? `${formatChange(strongestDecrease.change)} (${strongestDecrease.from} → ${strongestDecrease.to})`
              : '—'
          }
          tone={strongestDecrease?.change < 0 ? 'down' : 'neutral'}
        />
        <Detail
          label="Năm tốt nhất"
          value={bestYear ? `${bestYear.year} (${bestYear.average}%)` : '—'}
          tone="up"
        />
        <Detail
          label="Năm thấp nhất"
          value={worstYear ? `${worstYear.year} (${worstYear.average}%)` : '—'}
          tone="down"
        />
      </div>
    </div>
  );
};

export default SkillTrendSummary;
