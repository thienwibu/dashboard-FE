import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Plus, Eye, Edit, Trash2, Star, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockDepartmentData, mockClassData } from '../../data/mockData';

const TeacherManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [searchName, setSearchName] = useState('');
  const [activeView, setActiveView] = useState(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    return view === 'schedule' || view === 'progress' ? view : 'overview';
  });
  const [yearFilter, setYearFilter] = useState('all'); // xem tất cả năm

  // Sync view from URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'schedule' || view === 'progress' || view === 'overview') {
      if (view !== activeView) setActiveView(view);
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset year filter when select teacher
  useEffect(() => {
    if (selectedTeacher) {
      const rows = getPerformanceRows(selectedTeacher.name);
      const ranges = buildYearRanges(rows.map((r) => r.year), 2);
      setYearFilter(ranges.length ? `${ranges[0][0]}-${ranges[0][1]}` : 'all');
    }
  }, [selectedTeacher]);

  // Push view to URL when changed
  const prevViewRef = useRef(activeView);
  useEffect(() => {
    if (prevViewRef.current !== activeView) {
      prevViewRef.current = activeView;
      const params = new URLSearchParams(location.search);
      if (params.get('view') !== activeView) {
        params.set('view', activeView);
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
      }
    }
  }, [activeView, navigate, location.pathname, location.search]);

  const teachers = Array.isArray(mockDepartmentData?.teachers) ? mockDepartmentData.teachers : [];

  // Demo data
  const performanceByTeacher = {
    'TS. Nguyen Van An': [
      { year: 2024, className: '22CT111', subject: 'Lập trình', completion: 92 },
      { year: 2023, className: '22CT110', subject: 'Lập trình', completion: 88 },
      { year: 2022, className: '21CT105', subject: 'Lập trình', completion: 84 },
      { year: 2021, className: '21CT101', subject: 'Lập trình', completion: 79 }
    ],
    'TS. Tran Thi Binh': [
      { year: 2024, className: '22CT112', subject: 'Lập trình hướng đối tượng', completion: 90 },
      { year: 2023, className: '22CT111', subject: 'Lập trình hướng đối tượng', completion: 82 },
      { year: 2022, className: '21CT104', subject: 'Lập trình hướng đối tượng', completion: 80 }
    ],
    'TS. Le Van Cuong': [
      { year: 2024, className: '22CT113', subject: 'Cơ sở dữ liệu', completion: 89 },
      { year: 2023, className: '22CT112', subject: 'Cơ sở dữ liệu', completion: 80 },
      { year: 2022, className: '21CT103', subject: 'Cơ sở dữ liệu', completion: 77 }
    ]
  };

  const normalizeName = (name = '') =>
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const getPerformanceRows = (name) => {
    const key = normalizeName(name);
    const found = Object.entries(performanceByTeacher).find(([k]) => normalizeName(k) === key);
    return found ? found[1] : [];
  };

  const specializationOptions = useMemo(() => {
    const specs = teachers.flatMap((t) =>
      (t.specialization || '')
        .split(/[,-]/g)
        .map((s) => s.trim())
        .filter(Boolean)
    );
    return ['all', ...Array.from(new Set(specs))];
  }, [teachers]);

  const filteredTeachers = teachers.filter((teacher) => {
    const name = (teacher?.name || '').toLowerCase();
    const spec = (teacher?.specialization || '').toLowerCase();
    const specList = spec
      .split(/[,-]/g)
      .map((s) => s.trim())
      .filter(Boolean);
    const matchesSearch = !searchName || name.includes(searchName.toLowerCase());
    const matchesSpec = filterSpecialization === 'all' || specList.includes(filterSpecialization.toLowerCase());
    return matchesSearch && matchesSpec;
  });

  const allClasses = useMemo(
    () => (Array.isArray(mockClassData?.classes) ? mockClassData.classes : []),
    []
  );

  const classesByInstructor = useMemo(() => {
    const map = new Map();
    for (const c of allClasses) {
      const key = c.instructor || '-';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return map;
  }, [allClasses]);

  const weakCountByInstructor = useMemo(() => {
    const map = new Map();
    const details = mockClassData?.classDetails || {};
    for (const [name, arr] of classesByInstructor.entries()) {
      let count = 0;
      for (const cls of arr) {
        const detail = details[cls.id];
        if (!detail?.students) continue;
        count += detail.students.filter((s) => (s.averageScore ?? 0) < 6 || (s.completionRate ?? 0) < 60).length;
      }
      map.set(name, count);
    }
    return map;
  }, [classesByInstructor]);

  const lastActiveMap = useMemo(
    () => ({
      1: '2 ngày trước',
      2: '1 ngày trước',
      3: '5 giờ trước',
      4: '3 ngày trước',
      5: '8 giờ trước',
      6: 'hôm qua',
      7: '4 giờ trước',
      8: '2 giờ trước'
    }),
    []
  );

  const departmentAverage = useMemo(() => {
    if (!teachers.length) return 0;
    const sum = teachers.reduce((acc, t) => acc + (t.averageRating || 0), 0);
    return Math.round((sum / teachers.length) * 10) / 10;
  }, [teachers]);

  const renderSpecializationBadges = (specText) =>
    specText
      .split(/[,-]/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((spec) => (
        <button
          key={spec}
          type="button"
          onClick={() => setFilterSpecialization(spec)}
          className={`px-2 py-1 rounded-full text-[11px] font-medium border ${
            filterSpecialization.toLowerCase() === spec.toLowerCase()
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
          }`}
          title="Lọc giảng viên cùng môn"
        >
          {spec}
        </button>
      ));

  const SimpleLineChart = ({ rows }) => {
    if (!rows || !rows.length) return null;
    const sorted = [...rows].sort((a, b) => a.year - b.year);
    const padding = 8;
    const w = 240;
    const h = 120;
    const years = sorted.map((r) => r.year);
    const minY = 0;
    const maxY = 100;
    const xStep = years.length > 1 ? (w - padding * 2) / (years.length - 1) : 0;
    const points = sorted.map((r, idx) => {
      const x = padding + idx * xStep;
      const y = padding + ((maxY - r.completion) / (maxY - minY)) * (h - padding * 2);
      return { x, y, year: r.year, completion: r.completion, className: r.className };
    });
    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    return (
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Xu hướng hoàn thành lớp">
        <path d={path} fill="none" stroke="rgba(99,102,241,0.9)" strokeWidth="2" />
        <path
          d={path + ` L ${points[points.length - 1].x} ${h - padding} L ${points[0].x} ${h - padding} Z`}
          fill="rgba(99,102,241,0.08)"
        />
        {points.map((p) => (
          <g key={p.year}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="rgba(99,102,241,1)" stroke="#fff" strokeWidth="1.2">
              <title>{`Năm ${p.year} • ${p.className || ''} • ${p.completion}%`}</title>
            </circle>
            <text x={p.x} y={h - 4} textAnchor="middle" fontSize="9" fill="#6b7280">
              {p.year}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  const buildYearRanges = (years, size = 2) => {
    if (!years.length) return [];
    const sorted = [...new Set(years)].sort((a, b) => b - a);
    const ranges = [];
    for (let i = 0; i <= sorted.length - size; i++) {
      const slice = sorted.slice(i, i + size);
      if (slice.length === size) ranges.push([slice[size - 1], slice[0]]);
    }
    if (!ranges.length) ranges.push([sorted[sorted.length - 1], sorted[0]]);
    return ranges;
  };

  const renderTrendChart = (teacherName) => {
    const rows = getPerformanceRows(teacherName);
    if (!rows.length) return null;
    const sortedAll = [...rows].sort((a, b) => a.year - b.year);
    const ranges = buildYearRanges(sortedAll.map((r) => r.year), 2);

    let filtered = sortedAll;
    if (yearFilter !== 'all') {
      const [start, end] = yearFilter.split('-').map((n) => parseInt(n, 10));
      filtered = sortedAll.filter((r) => r.year >= start && r.year <= end).sort((a, b) => a.year - b.year);
    }
    let growth = null;
    if (filtered.length >= 2) {
      const prev = filtered[filtered.length - 2].completion;
      const curr = filtered[filtered.length - 1].completion;
      growth = (curr - prev).toFixed(1);
    }
    return (
      <div className="mt-3 border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
        <div className="text-xs text-gray-600 mb-2 flex items-center justify-between gap-2">
          <span>Xu hướng hoàn thành lớp (%)</span>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-gray-500">Năm:</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-gray-200 rounded px-2 py-1 text-[11px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              {ranges.map(([start, end]) => (
                <option key={`${start}-${end}`} value={`${start}-${end}`}>
                  {start} - {end}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-gray-500">0-100</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full flex flex-col">
              <div className="flex-1" style={{ background: 'rgba(16,185,129,0.08)' }} />
              <div className="flex-1" style={{ background: 'rgba(251,191,36,0.10)' }} />
              <div className="flex-1" style={{ background: 'rgba(248,113,113,0.10)' }} />
            </div>
            <div className="absolute left-0 right-0" style={{ top: '25%', borderTop: '1px dashed rgba(37,99,235,0.6)' }}>
              <span className="absolute right-2 -top-3 text-[10px] text-blue-600">Chuẩn 75%</span>
            </div>
          </div>
          <SimpleLineChart rows={filtered} />
        </div>
        {growth !== null && (
          <div className="mt-2 text-xs text-gray-700">
            So với năm trước:{' '}
            <span className={growth >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {growth >= 0 ? `+${growth}` : growth} %
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 text-sm">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Giảng Viên</h1>
        </div>
        <p className="text-gray-600 text-sm mt-1">Quản lý thông tin và hoạt động của đội ngũ giảng viên trong khoa</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="min-w-[220px] text-sm">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Tìm theo tên giảng viên"
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="min-w-[260px] text-sm">
            <select
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
            >
              <option value="all">Tất cả chuyên môn</option>
              {specializationOptions
                .filter((s) => s !== 'all')
                .map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
            </select>
          </div>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm Giảng Viên
          </button>
        </div>
      </div>

      {activeView === 'overview' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Giảng Viên</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Môn phụ trách</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">SV yếu trong lớp</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Đánh giá (feedback)</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Hoạt động gần nhất</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Nghiên cứu/Hướng dẫn</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 text-xs">
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center text-left w-full hover:opacity-80"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                          {teacher.name.split(' ').pop().charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-blue-700">{teacher.name}</div>
                          <div className="text-[11px] text-gray-500">{teacher.email}</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">{renderSpecializationBadges(teacher.specialization || '')}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-xs text-gray-900">{weakCountByInstructor.get(teacher.name) || 0} SV</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                        <span className="text-xs font-medium text-gray-900">{teacher.averageRating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="text-[11px] text-gray-700">{lastActiveMap[teacher.id] || '-'}</span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-xs text-gray-900">{teacher.projects} dự án</div>
                      <div className="text-[11px] text-gray-500">{teacher.publications} bài báo</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-[11px] font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded" title="Chỉnh sửa">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded" title="Xóa">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeView === 'schedule' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Giảng viên</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Buổi</th>
                  <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Thời gian / Phòng</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(mockClassData?.classes ?? []).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 text-xs">
                    <td className="px-4 py-2.5 whitespace-nowrap text-gray-900">{c.name || c.code || `Lớp ${c.id}`}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-gray-700">{c.instructor || '-'}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-gray-700">{c.session || c.schedule?.session || c.timeSlot || '-'}</td>
                    <td className="px-4 py-2.5 text-gray-700">
                      {c.time || (c.startTime && c.endTime ? `${c.startTime} - ${c.endTime}` : c.schedule?.time) || c.schedule?.day || c.room || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-900">Tỉ lệ hoàn thành trung bình lớp</h3>
            <div className="text-sm text-gray-700">
              TB khoa: <span className="font-semibold">{departmentAverage}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Đánh giá tiến độ dạy trung bình của giảng viên trong khoa.</p>
          <div className="text-sm text-gray-500">Chế độ progress đang được đơn giản hóa.</div>
        </div>
      )}

      {showDetailModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Thông tin giảng viên</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <div className="font-semibold text-gray-900">{selectedTeacher.name}</div>
                <div className="text-gray-500 text-xs">{selectedTeacher.email}</div>
              </div>
              <div>
                <span className="font-medium text-gray-800">Lớp đang dạy:</span>{' '}
                <span className="text-gray-700">
                  {(classesByInstructor.get(selectedTeacher.name) || [])[0]?.name || 'Chưa có lớp'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-800">Môn phụ trách:</span>{' '}
                <span className="text-gray-700">{selectedTeacher.specialization}</span>
              </div>
              <div>
                <span className="font-medium text-gray-800">Đánh giá:</span>{' '}
                <span className="text-gray-700">{selectedTeacher.averageRating} ⭐</span>
              </div>
              <div className="flex gap-2 flex-wrap">{renderSpecializationBadges(selectedTeacher.specialization || '')}</div>
              {renderTrendChart(selectedTeacher.name)}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">So sánh theo năm (Hoàn thành lớp)</h4>
                <table className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Năm</th>
                      <th className="px-3 py-2 text-left">Lớp</th>
                      <th className="px-3 py-2 text-left">Hoàn thành (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(getPerformanceRows(selectedTeacher.name) || []).map((row) => (
                      <tr key={row.year} className="odd:bg-white even:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-900">{row.year}</td>
                        <td className="px-3 py-2">{row.className || '-'}</td>
                        <td className="px-3 py-2">{row.completion}%</td>
                      </tr>
                    ))}
                    {!(performanceByTeacher[selectedTeacher.name] || []).length && (
                      <tr>
                        <td className="px-3 py-2 text-gray-500" colSpan={3}>
                          Chưa có dữ liệu so sánh năm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
