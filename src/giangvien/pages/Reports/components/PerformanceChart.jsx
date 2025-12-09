import { LineChart, TrendingUp } from 'lucide-react';

const PerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Biểu đồ hiệu suất</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  // Calculate max values for scaling
  const maxScore = Math.max(...data.map(d => d.averageScore || 0));
  const maxCompletion = Math.max(...data.map(d => d.completionRate || 0));
  const maxEngagement = Math.max(...data.map(d => d.engagement || 0));

  const getYPosition = (value, max, height) => {
    return height - (value / max) * height;
  };

  const chartHeight = 300;
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  const effectiveHeight = chartHeight - padding.top - padding.bottom;
  const effectiveWidth = chartWidth - padding.left - padding.right;
  const stepX = effectiveWidth / (data.length - 1);

  const metrics = [
    {
      key: 'averageScore',
      label: 'Điểm TB',
      color: '#3b82f6',
      max: 10
    },
    {
      key: 'completionRate',
      label: 'Tỷ lệ hoàn thành',
      color: '#10b981',
      max: 100
    },
    {
      key: 'engagement',
      label: 'Mức độ tương tác',
      color: '#f59e0b',
      max: 10
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <LineChart className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Xu hướng học tập theo thời gian</h2>
            <p className="text-sm text-gray-600">Theo dõi sự thay đổi của điểm số, tỷ lệ hoàn thành và mức độ tương tác</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-blue-600 font-bold">ℹ️</span>
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-1">Cách đọc biểu đồ:</div>
            <div className="space-y-1">
              <div>• <span className="font-medium">Trục ngang (X):</span> Thời gian theo tháng</div>
              <div>• <span className="font-medium">Trục dọc (Y):</span> Giá trị từ 0-100 (điểm TB quy đổi theo thang 100, tỷ lệ % hoàn thành, mức độ tương tác quy đổi)</div>
              <div>• <span className="font-medium">Xu hướng tăng:</span> Đường đi lên = Cải thiện, Đường đi xuống = Giảm sút</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        {metrics.map((metric) => (
          <div key={metric.key} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: metric.color }}></div>
            <span className="text-sm font-medium text-gray-700">{metric.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          <g>
            {[0, 25, 50, 75, 100].map((tick) => {
              const y = padding.top + effectiveHeight - (tick / 100) * effectiveHeight;
              return (
                <g key={tick}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="4"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-500"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}
          </g>

          {/* X-axis labels */}
          <g>
            {data.map((point, index) => {
              const x = padding.left + index * stepX;
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {point.date}
                </text>
              );
            })}
          </g>

          {/* Lines */}
          {metrics.map((metric) => {
            const points = data.map((point, index) => {
              const x = padding.left + index * stepX;
              const normalizedValue = (point[metric.key] / metric.max) * 100;
              const y = padding.top + effectiveHeight - (normalizedValue / 100) * effectiveHeight;
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={metric.key}>
                {/* Line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Points */}
                {data.map((point, index) => {
                  const x = padding.left + index * stepX;
                  const normalizedValue = (point[metric.key] / metric.max) * 100;
                  const y = padding.top + effectiveHeight - (normalizedValue / 100) * effectiveHeight;
                  
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="white"
                      stroke={metric.color}
                      strokeWidth="3"
                      className="hover:r-6 transition-all cursor-pointer"
                    >
                      <title>{`${metric.label}: ${point[metric.key]}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Thống kê tổng hợp (từ {data[0]?.date} đến {data[data.length - 1]?.date})</h3>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const values = data.map(d => d[metric.key]);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const firstValue = values[0];
            const lastValue = values[values.length - 1];
            const trend = lastValue - firstValue;
            const trendPercent = firstValue > 0 ? ((trend / firstValue) * 100).toFixed(1) : 0;
            
            return (
              <div key={metric.key} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">{metric.label} TB</p>
                <p className="text-2xl font-bold mb-2" style={{ color: metric.color }}>
                  {avg.toFixed(1)}
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bắt đầu:</span>
                    <span className="font-medium">{firstValue.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hiện tại:</span>
                    <span className="font-medium">{lastValue.toFixed(1)}</span>
                  </div>
                  <div className={`flex items-center justify-between font-semibold ${
                    trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <span>Thay đổi:</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
                      <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)} ({trend > 0 ? '+' : ''}{trendPercent}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

