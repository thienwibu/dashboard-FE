import { useState } from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle, X, ChevronRight } from 'lucide-react';

const StudentReport = ({ students }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Báo cáo sinh viên</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Không có dữ liệu sinh viên</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalStudents = students.length;
  // Sinh viên đang học = tổng sinh viên có mức rủi ro (low + medium + high)
  const activeStudents = students.filter(s => s.riskLevel && ['low', 'medium', 'high'].includes(s.riskLevel)).length;
  const atRiskStudents = students.filter(s => s.riskLevel === 'high').length;
  const excellentStudents = students.filter(s => s.averageScore >= 8.5).length;
  
  const avgCompletion = students.reduce((sum, s) => sum + s.completionRate, 0) / totalStudents;
  const avgScore = students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents;

  // Risk level distribution
  const riskDistribution = {
    low: students.filter(s => s.riskLevel === 'low').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    high: students.filter(s => s.riskLevel === 'high').length
  };

  // Score distribution
  // Phân loại điểm theo chuẩn: Giỏi ≥8.0, Khá 6.5-7.9, TB 5.0-6.4, Yếu 4.0-4.9, Kém <4.0
  const scoreRanges = [
    { label: 'Giỏi (≥8.0)', min: 8.0, max: 10, count: 0, color: 'bg-green-500' },
    { label: 'Khá (6.5-7.9)', min: 6.5, max: 7.9, count: 0, color: 'bg-blue-500' },
    { label: 'Trung bình (5.0-6.4)', min: 5.0, max: 6.4, count: 0, color: 'bg-yellow-500' },
    { label: 'Yếu (4.0-4.9)', min: 4.0, max: 4.9, count: 0, color: 'bg-orange-500' },
    { label: 'Kém (<4.0)', min: 0, max: 3.9, count: 0, color: 'bg-red-500' }
  ];

  students.forEach(student => {
    const range = scoreRanges.find(r => student.averageScore >= r.min && student.averageScore <= r.max);
    if (range) range.count++;
  });

  const maxCount = Math.max(...scoreRanges.map(r => r.count));

  const handleStatClick = (type, data) => {
    setModalContent({ type, data });
    setShowDetailModal(true);
  };

  const handleScoreRangeClick = (range) => {
    const studentsInRange = students.filter(s => s.averageScore >= range.min && s.averageScore <= range.max);
    handleStatClick('scoreRange', { range, students: studentsInRange });
  };

  const handleRiskClick = (level) => {
    const studentsInRisk = students.filter(s => s.riskLevel === level);
    handleStatClick('risk', { level, students: studentsInRisk });
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Users className="text-purple-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Báo cáo sinh viên</h2>
          <p className="text-sm text-gray-600">Phân tích chi tiết về sinh viên</p>
        </div>
      </div>

      {/* Quick Stats - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button 
          onClick={() => handleStatClick('all', students)}
          className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-600" />
            <p className="text-sm font-medium text-blue-900">Tổng SV</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
          <div className="text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <span>Xem danh sách</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </div>
        </button>

        <button 
          onClick={() => handleStatClick('excellent', students.filter(s => s.averageScore >= 8.0))}
          className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm font-medium text-green-900">Giỏi</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{students.filter(s => s.averageScore >= 8.0).length}</p>
          <div className="text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <span>Xem chi tiết</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </div>
        </button>

        <button 
          onClick={() => handleRiskClick('high')}
          className="bg-red-50 rounded-lg p-4 hover:bg-red-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <p className="text-sm font-medium text-red-900">Rủi ro cao</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{atRiskStudents}</p>
          <div className="text-xs text-red-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <span>Xem chi tiết</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </div>
        </button>

        <button 
          onClick={() => handleStatClick('avgScore', students)}
          className="bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-purple-600" />
            <p className="text-sm font-medium text-purple-900">ĐTB</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{avgScore.toFixed(1)}</p>
          <div className="text-xs text-purple-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <span>Phân tích</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </div>
        </button>
      </div>

      {/* Score Distribution - Clickable */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố điểm số</h3>
        <div className="space-y-3">
          {scoreRanges.map((range, index) => {
            const percentage = totalStudents > 0 ? (range.count / totalStudents) * 100 : 0;
            const width = maxCount > 0 ? (range.count / maxCount) * 100 : 0;
            
            return (
              <button
                key={index}
                onClick={() => handleScoreRangeClick(range)}
                className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                disabled={range.count === 0}
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                    {range.label}
                  </span>
                  <span className="text-gray-600">
                    {range.count} SV ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${range.color} h-full rounded-full transition-all duration-500 group-hover:opacity-80`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Risk Level Distribution - Clickable */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố mức độ rủi ro</h3>
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => handleRiskClick('low')}
            className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition-colors group"
          >
            <p className="text-sm text-green-700 font-medium mb-2">Thấp</p>
            <p className="text-3xl font-bold text-green-600">{riskDistribution.low}</p>
            <p className="text-xs text-green-600 mt-1">
              {((riskDistribution.low / totalStudents) * 100).toFixed(0)}%
            </p>
            <div className="text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Xem chi tiết →
            </div>
          </button>

          <button 
            onClick={() => handleRiskClick('medium')}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center hover:bg-yellow-100 transition-colors group"
          >
            <p className="text-sm text-yellow-700 font-medium mb-2">Trung bình</p>
            <p className="text-3xl font-bold text-yellow-600">{riskDistribution.medium}</p>
            <p className="text-xs text-yellow-600 mt-1">
              {((riskDistribution.medium / totalStudents) * 100).toFixed(0)}%
            </p>
            <div className="text-xs text-yellow-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Xem chi tiết →
            </div>
          </button>

          <button 
            onClick={() => handleRiskClick('high')}
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-center hover:bg-red-100 transition-colors group"
          >
            <p className="text-sm text-red-700 font-medium mb-2">Cao</p>
            <p className="text-3xl font-bold text-red-600">{riskDistribution.high}</p>
            <p className="text-xs text-red-600 mt-1">
              {((riskDistribution.high / totalStudents) * 100).toFixed(0)}%
            </p>
            <div className="text-xs text-red-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Xem chi tiết →
            </div>
          </button>
        </div>
      </div>

      {/* Summary - Clickable */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Tổng quan</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleStatClick('completion', students)}
            className="text-center hover:bg-blue-50 p-4 rounded-lg transition-colors group border border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-1">Tỷ lệ hoàn thành TB</p>
            <p className="text-2xl font-bold text-blue-600">{avgCompletion.toFixed(1)}%</p>
            <div className="text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Xem chi tiết →
            </div>
          </button>
          <button 
            onClick={() => handleStatClick('active', students.filter(s => s.riskLevel && ['low', 'medium', 'high'].includes(s.riskLevel)))}
            className="text-center hover:bg-green-50 p-4 rounded-lg transition-colors group border border-gray-200 relative"
            title="Tổng số sinh viên có đánh giá rủi ro = Rủi ro thấp + Rủi ro trung bình + Rủi ro cao"
          >
            <p className="text-sm text-gray-600 mb-1">Sinh viên đang học</p>
            <p className="text-2xl font-bold text-green-600">
              {riskDistribution.low + riskDistribution.medium + riskDistribution.high}
            </p>
            <div className="text-xs text-gray-500 mt-1 font-medium">
              = {riskDistribution.low} (thấp) + {riskDistribution.medium} (TB) + {riskDistribution.high} (cao)
            </div>
            <div className="text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Xem danh sách →
            </div>
          </button>
        </div>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">💡 Giải thích:</span> "Sinh viên đang học" là tổng số sinh viên có đánh giá mức độ rủi ro (bao gồm cả 3 mức: thấp, trung bình và cao). Số liệu này được tính từ phần "Phân bố mức độ rủi ro" ở trên.
          </p>
        </div>
      </div>
    </div>

    {/* Detail Modal */}
    {showDetailModal && modalContent && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalContent.type === 'all' && 'Danh sách tất cả sinh viên'}
                {modalContent.type === 'excellent' && 'Sinh viên giỏi (≥8.0)'}
                {modalContent.type === 'risk' && `Sinh viên rủi ro ${modalContent.data.level === 'high' ? 'cao' : modalContent.data.level === 'medium' ? 'trung bình' : 'thấp'}`}
                {modalContent.type === 'avgScore' && 'Phân tích điểm trung bình'}
                {modalContent.type === 'scoreRange' && `Sinh viên trong khoảng ${modalContent.data.range.label}`}
                {modalContent.type === 'completion' && 'Chi tiết tỷ lệ hoàn thành'}
                {modalContent.type === 'active' && 'Sinh viên đang học'}
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Student List */}
            {(modalContent.type === 'all' || modalContent.type === 'excellent' || modalContent.type === 'active' || modalContent.type === 'scoreRange') && (
              <div className="space-y-3">
                {(modalContent.type === 'scoreRange' ? modalContent.data.students : modalContent.data).map((student, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary-600">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.studentId} • {student.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          student.averageScore >= 8.0 ? 'text-success-600' :
                          student.averageScore >= 6.5 ? 'text-primary-600' :
                          student.averageScore >= 5.0 ? 'text-warning-600' :
                          'text-danger-600'
                        }`}>
                          {student.averageScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">Điểm TB</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Hoàn thành</div>
                        <div className="font-medium text-gray-900">{student.completionRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Bài tập</div>
                        <div className="font-medium text-gray-900">{student.completedAssignments}/{student.totalAssignments}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Rủi ro</div>
                        <div className={`font-medium ${
                          student.riskLevel === 'high' ? 'text-danger-600' :
                          student.riskLevel === 'medium' ? 'text-warning-600' :
                          'text-success-600'
                        }`}>
                          {student.riskLevel === 'high' ? 'Cao' : student.riskLevel === 'medium' ? 'TB' : 'Thấp'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Risk Students Detail */}
            {modalContent.type === 'risk' && (
              <div className="space-y-3">
                {modalContent.data.students.map((student, index) => (
                  <div key={index} className={`border-l-4 rounded-lg p-4 ${
                    modalContent.data.level === 'high' ? 'border-danger-500 bg-danger-50' :
                    modalContent.data.level === 'medium' ? 'border-warning-500 bg-warning-50' :
                    'border-success-500 bg-success-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          modalContent.data.level === 'high' ? 'bg-danger-100' :
                          modalContent.data.level === 'medium' ? 'bg-warning-100' :
                          'bg-success-100'
                        }`}>
                          <span className={`text-lg font-bold ${
                            modalContent.data.level === 'high' ? 'text-danger-600' :
                            modalContent.data.level === 'medium' ? 'text-warning-600' :
                            'text-success-600'
                          }`}>
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.studentId} • {student.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-gray-600">Điểm TB</div>
                        <div className="font-bold text-gray-900">{student.averageScore.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Hoàn thành</div>
                        <div className="font-bold text-gray-900">{student.completionRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Bài tập</div>
                        <div className="font-bold text-gray-900">{student.completedAssignments}/{student.totalAssignments}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Thời gian</div>
                        <div className="font-bold text-gray-900">{student.totalHours}h</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Môn học:</div>
                      {student.courses?.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-white rounded p-2">
                          <span className="text-gray-700">{course.name}</span>
                          <div className="flex items-center space-x-3">
                            <span className={`font-medium ${
                              course.score >= 8.0 ? 'text-success-600' :
                              course.score >= 6.5 ? 'text-primary-600' :
                              course.score >= 5.0 ? 'text-warning-600' :
                              'text-danger-600'
                            }`}>
                              Điểm: {course.score.toFixed(1)}
                            </span>
                            <span className={`font-medium ${
                              course.progress >= 80 ? 'text-success-600' :
                              course.progress >= 50 ? 'text-warning-600' :
                              'text-danger-600'
                            }`}>
                              Tiến độ: {course.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Average Score Analysis */}
            {modalContent.type === 'avgScore' && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-6 rounded-lg text-center border-2 border-purple-200">
                  <div className="text-5xl font-bold text-purple-600 mb-2">
                    {(modalContent.data.reduce((sum, s) => sum + s.averageScore, 0) / modalContent.data.length).toFixed(2)}
                  </div>
                  <div className="text-gray-600 mb-3">Điểm trung bình chung</div>
                  <div className="text-sm text-purple-700 bg-white/50 rounded-lg p-3 mt-3">
                    <div className="font-semibold mb-1">📊 Cách tính:</div>
                    <div className="text-xs">
                      Tổng điểm của {modalContent.data.length} sinh viên ÷ {modalContent.data.length} = {' '}
                      ({modalContent.data.reduce((sum, s) => sum + s.averageScore, 0).toFixed(2)} ÷ {modalContent.data.length})
                    </div>
                  </div>
                </div>

                {/* Explanation Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold text-lg">💡</span>
                    <div className="text-sm text-blue-800">
                      <div className="font-semibold mb-1">Giải thích chi tiết:</div>
                      <div className="space-y-1">
                        <div>• <span className="font-medium">Tổng sinh viên:</span> {modalContent.data.length} người</div>
                        <div>• <span className="font-medium">Tổng điểm:</span> {modalContent.data.reduce((sum, s) => sum + s.averageScore, 0).toFixed(2)} điểm</div>
                        <div>• <span className="font-medium">Công thức:</span> Điểm TB = Tổng điểm ÷ Số sinh viên</div>
                        <div>• <span className="font-medium">Kết quả:</span> {modalContent.data.reduce((sum, s) => sum + s.averageScore, 0).toFixed(2)} ÷ {modalContent.data.length} = <span className="font-bold text-purple-600">{(modalContent.data.reduce((sum, s) => sum + s.averageScore, 0) / modalContent.data.length).toFixed(2)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Điểm cao nhất</div>
                    <div className="text-2xl font-bold text-success-600">
                      {Math.max(...modalContent.data.map(s => s.averageScore)).toFixed(1)}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Điểm thấp nhất</div>
                    <div className="text-2xl font-bold text-danger-600">
                      {Math.min(...modalContent.data.map(s => s.averageScore)).toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Top 5 sinh viên xuất sắc:</h4>
                  {modalContent.data
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .slice(0, 5)
                    .map((student, index) => (
                      <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.studentId}</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-success-600">{student.averageScore.toFixed(1)}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Completion Detail */}
            {modalContent.type === 'completion' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {(modalContent.data.reduce((sum, s) => sum + s.completionRate, 0) / modalContent.data.length).toFixed(1)}%
                  </div>
                  <div className="text-gray-600">Tỷ lệ hoàn thành trung bình</div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Chi tiết từng sinh viên:</h4>
                  {modalContent.data
                    .sort((a, b) => b.completionRate - a.completionRate)
                    .map((student, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.studentId}</div>
                          </div>
                          <div className={`text-2xl font-bold ${
                            student.completionRate >= 80 ? 'text-success-600' :
                            student.completionRate >= 50 ? 'text-warning-600' :
                            'text-danger-600'
                          }`}>
                            {student.completionRate}%
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className={`h-3 rounded-full ${
                              student.completionRate >= 80 ? 'bg-success-600' :
                              student.completionRate >= 50 ? 'bg-warning-600' :
                              'bg-danger-600'
                            }`}
                            style={{ width: `${student.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Bài tập: {student.completedAssignments}/{student.totalAssignments} • 
                          Thời gian: {student.totalHours}h
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default StudentReport;

