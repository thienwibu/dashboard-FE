import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StudentPerformanceDistribution = ({ classDetails }) => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const stats = useMemo(() => {
        if (!classDetails || !classDetails.students) return null;

        const distribution = {
            excellent: { label: 'Giỏi (≥ 8.0)', count: 0, color: '#10B981', min: 8.0, max: 10, students: [] },
            good: { label: 'Khá (6.5 - < 8.0)', count: 0, color: '#3B82F6', min: 6.5, max: 8.0, students: [] },
            average: { label: 'Trung bình (5.0 - < 6.5)', count: 0, color: '#F59E0B', min: 5.0, max: 6.5, students: [] },
            weak: { label: 'Yếu (4.0 - < 5.0)', count: 0, color: '#F97316', min: 4.0, max: 5.0, students: [] },
            poor: { label: 'Kém (< 4.0)', count: 0, color: '#EF4444', min: 0, max: 4.0, students: [] }
        };

        let totalStudents = 0;
        
        // Tạo một Set để theo dõi sinh viên đã được thêm (dựa trên studentId)
        const addedStudents = new Set();

        // Chỉ lấy sinh viên từ lớp hiện tại
        if (classDetails.students) {
            classDetails.students.forEach(student => {
                // Kiểm tra xem sinh viên đã được thêm chưa
                if (addedStudents.has(student.studentId)) {
                    return; // Bỏ qua nếu đã thêm rồi
                }
                
                addedStudents.add(student.studentId);
                const score = student.averageScore || 0;
                totalStudents++;

                if (score >= 8.0) {
                    distribution.excellent.count++;
                    distribution.excellent.students.push(student);
                } else if (score >= 6.5) {
                    distribution.good.count++;
                    distribution.good.students.push(student);
                } else if (score >= 5.0) {
                    distribution.average.count++;
                    distribution.average.students.push(student);
                } else if (score >= 4.0) {
                    distribution.weak.count++;
                    distribution.weak.students.push(student);
                } else {
                    distribution.poor.count++;
                    distribution.poor.students.push(student);
                }
            });
        }

        return { distribution, totalStudents };
    }, [classDetails]);

    if (!stats) return null;

    const data = Object.values(stats.distribution).map(item => ({
        name: item.label,
        value: item.count,
        color: item.color,
        percentage: stats.totalStudents > 0 ? ((item.count / stats.totalStudents) * 100).toFixed(1) : 0
    }));

    return (
        <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Phân Bố Học Lực Sinh Viên</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                {/* Chart */}
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name, props) => [`${value} SV (${props.payload.percentage}%)`, name]}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend & Details */}
                <div className="space-y-3">
                    {data.map((item, index) => {
                        const gradeKey = Object.keys(stats.distribution)[index];
                        const gradeData = stats.distribution[gradeKey];
                        
                        return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${item.percentage}%`,
                                                backgroundColor: item.color
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                        {item.percentage}%
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSelectedGrade(gradeData);
                                            setShowModal(true);
                                        }}
                                        disabled={item.value === 0}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                            item.value === 0
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-primary-600 text-white hover:bg-primary-700'
                                        }`}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                        <span>Tổng số sinh viên</span>
                        <span className="font-medium text-gray-900">{stats.totalStudents}</span>
                    </div>
                </div>
            </div>

            {/* Modal hiển thị danh sách sinh viên */}
            {showModal && selectedGrade && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div 
                                    className="w-6 h-6 rounded-full" 
                                    style={{ backgroundColor: selectedGrade.color }}
                                ></div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {selectedGrade.label}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedGrade.count} sinh viên ({((selectedGrade.count / stats.totalStudents) * 100).toFixed(1)}%)
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {selectedGrade.students.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedGrade.students.map((student, index) => {
                                        const getTrendIcon = (scoreChange) => {
                                            if (scoreChange > 0) return <TrendingUp className="h-4 w-4 text-success-600" />;
                                            if (scoreChange < 0) return <TrendingDown className="h-4 w-4 text-danger-600" />;
                                            return <Minus className="h-4 w-4 text-gray-400" />;
                                        };

                                        return (
                                            <div 
                                                key={student.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <span className="text-primary-600 font-semibold">{index + 1}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{student.name}</p>
                                                        <p className="text-sm text-gray-600">{student.studentId} • {student.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-6">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Điểm trung bình</p>
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-xl font-bold text-gray-900">
                                                                {student.averageScore.toFixed(1)}
                                                            </p>
                                                            {getTrendIcon(student.scoreChange)}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                                                        <p className="text-xl font-bold text-gray-900">{student.completionRate}%</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Trạng thái</p>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                            student.status === 'active' 
                                                                ? 'bg-success-100 text-success-700'
                                                                : student.status === 'at_risk'
                                                                ? 'bg-danger-100 text-danger-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {student.status === 'active' ? 'Đang học' : student.status === 'at_risk' ? 'Có nguy cơ' : 'Hoàn thành'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Không có sinh viên nào trong vùng điểm này</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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

export default StudentPerformanceDistribution;
