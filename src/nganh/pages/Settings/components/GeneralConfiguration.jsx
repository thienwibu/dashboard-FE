import React, { useEffect, useState } from 'react';
import { Save, RotateCcw, Plus, Copy, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'dashboardCardConfigs';

const buildDefaultCards = () => [
  {
    id: 'lecture-effectiveness',
    type: 'lectureEffectiveness',
    title: 'Độ phù hợp bài giảng',
    description: 'Hiển thị hiệu quả giữa bài giảng và năng lực sinh viên.',
    enabled: true,
    filters: {
      course: 'Nhập môn lập trình',
      courseList: ['Nhập môn lập trình', 'Kỹ thuật lập trình', 'Cấu trúc dữ liệu & GT', 'Lập trình HDT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    chart: {
      type: 'line',
      color: '#2563eb',
      smooth: true,
      showDots: true
    },
    threshold: 65,
    benchmark: 75,
    warning: 60
  },
  {
    id: 'course-completion',
    type: 'courseCompletion',
    title: 'Tỷ lệ hoàn thành môn học',
    description: 'Theo dõi xu hướng hoàn thành môn theo năm.',
    enabled: true,
    filters: {
      course: 'Nhập môn lập trình',
      courseList: ['Nhập môn lập trình', 'Kỹ thuật lập trình', 'Cấu trúc dữ liệu & GT', 'Lập trình HDT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    chart: {
      type: 'line',
      color: '#3f51b5',
      smooth: true,
      showDots: true
    },
    threshold: 70,
    benchmark: 75,
    warning: 60
  },
  {
    id: 'student-rating',
    type: 'studentRating',
    title: 'Xếp loại học lực sinh viên',
    description: 'Xếp loại 7 mức theo quy chuẩn 4 năm.',
    enabled: true,
    filters: {
      course: 'Tất cả',
      courseList: ['Tất cả', 'Nhập môn lập trình', 'Kỹ thuật lập trình', 'Cấu trúc dữ liệu & GT', 'Lập trình HDT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    chart: {
      type: 'bar',
      color: '#2563eb',
      smooth: false,
      showDots: false
    },
    threshold: 60,
    benchmark: 75,
    warning: 60
  },
  {
    id: 'skill-trend',
    type: 'skillTrend',
    title: 'Tập kỹ năng',
    description: 'Tiến độ hoàn thành kỹ năng theo 4 năm.',
    enabled: true,
    filters: {
      course: 'Nhập môn lập trình',
      courseList: ['Nhập môn lập trình', 'Kỹ thuật lập trình', 'Cấu trúc dữ liệu & GT', 'Lập trình HDT'],
      trainingCycle: '4y',
      startYear: 2022,
      endYear: 2025
    },
    chart: {
      type: 'line',
      color: '#2563eb',
      smooth: true,
      showDots: true
    },
    threshold: 65,
    benchmark: 75,
    warning: 60
  }
];

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const label = 'block text-sm font-medium text-gray-700 mb-1';
const groupTitle = 'text-lg font-semibold text-gray-900';
const groupDesc = 'text-sm text-gray-600';

const TAB_KEYS = [
  { key: 'display', label: 'Thông tin hiển thị' },
  { key: 'filters', label: 'Bộ lọc mặc định' },
  { key: 'chart', label: 'Kiểu biểu đồ' },
  { key: 'threshold', label: 'Ngưỡng đánh giá' }
];

const GeneralConfiguration = () => {
  const [cards, setCards] = useState(buildDefaultCards());
  const [activeTabs, setActiveTabs] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const defaults = buildDefaultCards();
        const merged = parsed.map((c) => {
          const def = defaults.find((d) => d.type === c.type) || defaults[0];
          return {
            ...def,
            ...c,
            filters: { ...def.filters, ...(c.filters || {}) },
            chart: { ...def.chart, ...(c.chart || {}) }
          };
        });
        setCards(merged);
      } catch {
        setCards(buildDefaultCards());
      }
    }
  }, []);

  const persist = (next) => {
    setCards(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateCard = (id, updater) => {
    persist(cards.map((c) => (c.id === id ? updater(c) : c)));
  };

  const addCard = () => {
    const def = buildDefaultCards()[0];
    const newId = `card-${Date.now()}`;
    persist([
      ...cards,
      {
        ...def,
        id: newId,
        type: 'custom',
        title: 'Card mới',
        description: 'Mô tả ngắn'
      }
    ]);
  };

  const duplicateCard = (id) => {
    const src = cards.find((c) => c.id === id);
    if (!src) return;
    persist([...cards, { ...src, id: `${id}-copy-${Date.now()}`, title: `${src.title} (bản sao)` }]);
  };

  const removeCard = (id) => persist(cards.filter((c) => c.id !== id));
  const resetDefaults = () => persist(buildDefaultCards());

  const handleSaveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    setMessage('Đã lưu cấu hình!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cấu hình Card Dashboard</h2>
          <p className="text-sm text-gray-600">
            Giữ lại các trường thật sự cần cho người quản lý ngành. Đã ẩn phần nguồn dữ liệu cho vai trò này.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetDefaults}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset mặc định
          </button>
          <button
            onClick={addCard}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Thêm card mới
          </button>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Lưu tất cả
          </button>
        </div>
      </div>
      {message && <div className="text-green-700 text-sm font-medium">{message}</div>}

      {cards.map((card) => {
        const activeTab = activeTabs[card.id] || 'display';
        return (
          <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-gray-500">Card ID: {card.id}</p>
                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Bật</label>
                <button
                  onClick={() => updateCard(card.id, (c) => ({ ...c, enabled: !c.enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    card.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      card.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <button
                  onClick={() => duplicateCard(card.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4" /> Sao chép
                </button>
                <button
                  onClick={() => removeCard(card.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
              {TAB_KEYS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTabs((prev) => ({ ...prev, [card.id]: tab.key }))}
                  className={`px-3 py-1.5 text-sm rounded-t ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-700 border border-gray-200 border-b-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'display' && (
              <div className="space-y-3">
                <h4 className={groupTitle}>Thông tin hiển thị</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Tiêu đề</label>
                    <input
                      className={inputClass}
                      value={card.title}
                      onChange={(e) => updateCard(card.id, (c) => ({ ...c, title: e.target.value }))}
                      placeholder="Tỷ lệ hoàn thành môn học"
                    />
                  </div>
                  <div>
                    <label className={label}>Mô tả</label>
                    <input
                      className={inputClass}
                      value={card.description}
                      onChange={(e) => updateCard(card.id, (c) => ({ ...c, description: e.target.value }))}
                      placeholder="Theo dõi xu hướng hoàn thành môn theo năm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="space-y-4">
                <h4 className={groupTitle}>Bộ lọc mặc định</h4>
                <p className={groupDesc}>Tự động lấy 4 năm gần nhất, có thể đổi chu kỳ đào tạo.</p>
                <div className="space-y-4">
                  <div>
                    <label className={label}>Môn</label>
                    <div className="flex items-center gap-3">
                      <select
                        className={`${inputClass} flex-1`}
                        value={card.filters.course}
                        onChange={(e) =>
                          updateCard(card.id, (c) => ({ ...c, filters: { ...c.filters, course: e.target.value } }))
                        }
                      >
                        {(card.filters.courseList || []).map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500">
                      Danh sách môn dùng chung; thêm mới để các ngành khác cũng chọn được.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={label}>Chu kỳ đào tạo</label>
                      <select
                        className={inputClass}
                        value={card.filters.trainingCycle || '4y'}
                        onChange={(e) =>
                          updateCard(card.id, (c) => ({
                            ...c,
                            filters: { ...c.filters, trainingCycle: e.target.value }
                          }))
                        }
                      >
                        <option value="3y">3 năm</option>
                        <option value="4y">4 năm</option>
                        <option value="5y">5 năm</option>
                        <option value="custom">Tùy chỉnh</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">4 năm là mặc định với chương trình đại học.</p>
                    </div>

                    {card.filters.trainingCycle === 'custom' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:col-span-1">
                        <div>
                          <label className={label}>Năm bắt đầu</label>
                          <input
                            type="number"
                            className={inputClass}
                            value={card.filters.startYear}
                            onChange={(e) =>
                              updateCard(card.id, (c) => ({
                                ...c,
                                filters: { ...c.filters, startYear: Number(e.target.value) }
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className={label}>Năm kết thúc</label>
                          <input
                            type="number"
                            className={inputClass}
                            value={card.filters.endYear}
                            onChange={(e) =>
                              updateCard(card.id, (c) => ({
                                ...c,
                                filters: { ...c.filters, endYear: Number(e.target.value) }
                              }))
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className={label}>Khoảng năm hiển thị</label>
                        <input
                          className={inputClass}
                          value={(() => {
                            const now = new Date().getFullYear();
                            const span =
                              card.filters.trainingCycle === '3y'
                                ? 3
                                : card.filters.trainingCycle === '5y'
                                  ? 5
                                  : 4;
                            const start = now - (span - 1);
                            const end = now;
                            return `${start} - ${end}`;
                          })()}
                          readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Tự động lấy{' '}
                          {card.filters.trainingCycle === '3y'
                            ? '3'
                            : card.filters.trainingCycle === '5y'
                              ? '5'
                              : '4'}{' '}
                          năm gần nhất.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chart' && (
              <div className="space-y-3">
                <h4 className={groupTitle}>Kiểu biểu đồ</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={label}>Kiểu</label>
                    <select
                      className={inputClass}
                      value={card.chart.type}
                      onChange={(e) =>
                        updateCard(card.id, (c) => ({ ...c, chart: { ...c.chart, type: e.target.value } }))
                      }
                    >
                      <option value="line">Line</option>
                      <option value="bar">Bar</option>
                      <option value="area">Area</option>
                      <option value="spline">Spline</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Line/Area cho xu hướng; Bar cho so sánh nhanh.</p>
                  </div>
                  <div>
                    <label className={label}>Màu biểu đồ</label>
                    <input
                      type="color"
                      className="h-10 w-full rounded border border-gray-300"
                      value={card.chart.color}
                      onChange={(e) =>
                        updateCard(card.id, (c) => ({ ...c, chart: { ...c.chart, color: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={card.chart.smooth}
                      onChange={(e) =>
                        updateCard(card.id, (c) => ({ ...c, chart: { ...c.chart, smooth: e.target.checked } }))
                      }
                    />
                    <label className={label + ' mb-0'}>Đường mượt</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={card.chart.showDots}
                      onChange={(e) =>
                        updateCard(card.id, (c) => ({ ...c, chart: { ...c.chart, showDots: e.target.checked } }))
                      }
                    />
                    <label className={label + ' mb-0'}>Hiển thị điểm dữ liệu</label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'threshold' && (
              <div className="space-y-4">
                <h4 className={groupTitle}>Mức đề ra / Ngưỡng đánh giá</h4>
                <p className={groupDesc}>Đặt mục tiêu, ngưỡng cảnh báo cho từng card.</p>
                <div className="space-y-4">
                  <div>
                    <label className={label}>Mức đề ra (mục tiêu %)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={card.benchmark ?? 75}
                      onChange={(e) => updateCard(card.id, (c) => ({ ...c, benchmark: Number(e.target.value) }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Tỷ lệ mục tiêu khoa mong muốn.</p>
                  </div>
                  <div>
                    <label className={label}>Mức dưới chuẩn (%)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={card.warning ?? 60}
                      onChange={(e) => updateCard(card.id, (c) => ({ ...c, warning: Number(e.target.value) }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Nếu kết quả thấp hơn mức này sẽ cảnh báo mạnh.</p>
                  </div>
                  <div>
                    <label className={label}>Ngưỡng chú ý (%)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={card.threshold}
                      onChange={(e) => updateCard(card.id, (c) => ({ ...c, threshold: Number(e.target.value) }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nếu gần mức dưới chuẩn sẽ highlight nhẹ (vùng cảnh báo).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GeneralConfiguration;
