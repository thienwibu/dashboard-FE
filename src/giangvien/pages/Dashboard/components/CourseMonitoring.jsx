import { useState, useEffect } from 'react';
import { Clock, Users, MoreVertical, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockStudentTrackingData } from '../../../data/mockData';

const CourseMonitoring = ({ data }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [teacherName, setTeacherName] = useState('');

    useEffect(() => {
        // Lấy tên giảng viên từ sessionStorage (đã lưu khi đăng nhập)
        const userData = sessionStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setTeacherName(user?.full_name || 'Giảng viên');
        }
    }, []);

    if (!data) return null;

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { class: 'status-badge status-active', text: 'Đang diễn ra' },
            upcoming: { class: 'status-badge status-pending', text: 'Sắp diễn ra' },
            completed: { class: 'status-badge status-completed', text: 'Hoàn thành' }
        };

        return statusConfig[status] || statusConfig.active;
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const getStudentsInCourse = (courseName) => {
        const students = mockStudentTrackingData?.students || [];
        return students.filter(student => 
            student.courses?.some(c => c.name === courseName)
        );
    };



    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Theo Dõi Khóa Học</h3>
                    <p className="text-sm text-gray-600">Trạng thái và hiệu suất các khóa học</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            <div className="space-y-4">
                {data.map((course, index) => (
                    <button
                        key={index}
                        onClick={() => handleCourseClick(course)}
                        className="w-full border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-primary-300 transition-all text-left cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{course.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">Giảng viên: {teacherName}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Users className="h-4 w-4" />
                                        <span>{course.enrolledStudents} sinh viên</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={getStatusBadge(course.status).class}>
                                {getStatusBadge(course.status).text}
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Tiến độ hoàn thành</span>
                                <span className="font-medium text-gray-900">{course.completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.completionRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Xem tất cả khóa học
                </button>
            </div>

            {/* Modal chi tiết khóa học */}
            {showModal && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {selectedCourse.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                                    <div className="flex items-center space-x-1">
                                        <Users className="h-4 w-4" />
                                        <span>{selectedCourse.enrolledStudents} sinh viên</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{selectedCourse.duration}</span>
                                    </div>
                                    <span className={getStatusBadge(selectedCourse.status).class}>
                                        {getStatusBadge(selectedCourse.status).text}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Thống kê tổng quan */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Thông tin khóa học</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Tổng sinh viên</p>
                                        </div>
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {selectedCourse.enrolledStudents}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            <p className="text-sm font-medium text-green-900 dark:text-green-300">Tiến độ TB</p>
                                        </div>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedCourse.completionRate}%</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Thời lượng</p>
                                        </div>
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedCourse.duration}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phân tích hiệu suất */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Phân tích hiệu suất</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Phân bố điểm */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h5 className="font-medium text-gray-900 mb-3">Phân bố điểm số</h5>
                                        <div className="space-y-2">
                                            {(() => {
                                                const students = getStudentsInCourse(selectedCourse.name);
                                                const excellent = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.score >= 8.0;
                                                }).length;
                                                const good = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.score >= 6.5 && course.score < 8.0;
                                                }).length;
                                                const average = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.score >= 5.0 && course.score < 6.5;
                                                }).length;
                                                const poor = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.score < 5.0;
                                                }).length;

                                                return (
                                                    <>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Giỏi (≥8.0)</span>
                                                            <span className="font-bold text-green-600">{excellent} SV ({((excellent/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Khá (6.5-7.9)</span>
                                                            <span className="font-bold text-blue-600">{good} SV ({((good/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">TB (5.0-6.4)</span>
                                                            <span className="font-bold text-yellow-600">{average} SV ({((average/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Yếu/Kém (&lt;5.0)</span>
                                                            <span className="font-bold text-red-600">{poor} SV ({((poor/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Phân bố tiến độ */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h5 className="font-medium text-gray-900 mb-3">Phân bố tiến độ</h5>
                                        <div className="space-y-2">
                                            {(() => {
                                                const students = getStudentsInCourse(selectedCourse.name);
                                                const completed = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.progress >= 90;
                                                }).length;
                                                const onTrack = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.progress >= 70 && course.progress < 90;
                                                }).length;
                                                const behind = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.progress >= 50 && course.progress < 70;
                                                }).length;
                                                const atRisk = students.filter(s => {
                                                    const course = s.courses.find(c => c.name === selectedCourse.name);
                                                    return course && course.progress < 50;
                                                }).length;

                                                return (
                                                    <>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Hoàn thành tốt (≥90%)</span>
                                                            <span className="font-bold text-green-600">{completed} SV ({((completed/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Đúng tiến độ (70-89%)</span>
                                                            <span className="font-bold text-blue-600">{onTrack} SV ({((onTrack/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Chậm tiến độ (50-69%)</span>
                                                            <span className="font-bold text-yellow-600">{behind} SV ({((behind/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Rủi ro cao (&lt;50%)</span>
                                                            <span className="font-bold text-red-600">{atRisk} SV ({((atRisk/students.length)*100).toFixed(0)}%)</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={handleCloseModal}
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

export default CourseMonitoring;