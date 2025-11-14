

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend, Line, LineChart } from 'recharts';
import type { Page, Student, Instructor, Course, Transaction, Staff, Exam, Classroom, TrainingField, Candidate, AdminProfile } from './types';
import { 
  navigationItems, 
  courseStatusData, financialOverviewData, upcomingExams, recentActivities,
  GraduationCapIcon, LayoutDashboardIcon, LogOutIcon, SettingsIcon,
  SearchIcon, PlusIcon, EyeIcon, EditIcon, Trash2Icon, MoreVerticalIcon,
  ChevronLeftIcon, ChevronRightIcon, BellIcon, FilterIcon, EyeOffIcon, DownloadIcon,
  TrendingUpIcon, BookOpenIcon, UserCheckIcon, UsersIcon, XIcon,
  MenuIcon, SunIcon, MoonIcon, UploadCloudIcon, BarChartIcon, UserCircleIcon
} from './constants';

type Theme = 'light' | 'dark';

// MOCK DATA (will be managed by state)
const initialStudents: Student[] = [
    { id: 'HV001', name: 'Nguyễn Văn An', avatar: 'https://i.pravatar.cc/150?u=hv001', course: 'Lập Trình Web Full-Stack', avgScore: 8.5, status: 'Đang học', enrollDate: '2023-01-15' },
    { id: 'HV002', name: 'Trần Thị Bích', avatar: 'https://i.pravatar.cc/150?u=hv002', course: 'Khoa Học Dữ Liệu', avgScore: 9.2, status: 'Hoàn thành', enrollDate: '2022-11-20' },
    { id: 'HV003', name: 'Lê Hoàng Cường', avatar: 'https://i.pravatar.cc/150?u=hv003', course: 'Thiết Kế UI/UX', avgScore: 7.8, status: 'Tạm dừng', enrollDate: '2023-03-10' },
    { id: 'HV004', name: 'Phạm Thị Dung', avatar: 'https://i.pravatar.cc/150?u=hv004', course: 'Lập Trình Di Động', avgScore: 8.9, status: 'Đang học', enrollDate: '2023-02-05' },
    { id: 'HV005', name: 'Võ Minh Em', avatar: 'https://i.pravatar.cc/150?u=hv005', course: 'Digital Marketing', avgScore: 8.1, status: 'Hoàn thành', enrollDate: '2022-10-01' },
];

const initialInstructors: Instructor[] = [
    { id: 'GV001', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=gv001', major: 'Khoa học Máy tính', email: 'nguyenvana@example.com', status: 'Hoạt động' },
    { id: 'GV002', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=gv002', major: 'Kinh tế', email: 'tranthib@example.com', status: 'Hoạt động' },
    { id: 'GV003', name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?u=gv003', major: 'Ngoại ngữ', email: 'levanc@example.com', status: 'Không hoạt động' },
    { id: 'GV004', name: 'Phạm Thị D', avatar: 'https://i.pravatar.cc/150?u=gv004', major: 'Thiết kế Đồ họa', email: 'phamthid@example.com', status: 'Hoạt động' },
    { id: 'GV005', name: 'Hoàng Văn E', avatar: 'https://i.pravatar.cc/150?u=gv005', major: 'Khoa học Máy tính', email: 'hoangvane@example.com', status: 'Hoạt động' },
];

const initialCourses: Course[] = [
    { name: 'Advanced JavaScript', code: 'JS-ADV-01', instructor: 'Nguyễn Văn A', students: { enrolled: 25, capacity: 30 }, status: 'Ongoing', schedule: 'Mon, Wed, Fri' },
    { name: 'Introduction to Python', code: 'PY-INT-03', instructor: 'Trần Thị B', students: { enrolled: 30, capacity: 30 }, status: 'Upcoming', schedule: 'Tue, Thu' },
    { name: 'Data Structures', code: 'CS-DS-02', instructor: 'Lê Văn C', students: { enrolled: 18, capacity: 20 }, status: 'Finished', schedule: 'Mon, Wed' },
    { name: 'UI/UX Design Principles', code: 'UX-DES-01', instructor: 'Phạm Thị D', students: { enrolled: 22, capacity: 25 }, status: 'Ongoing', schedule: 'Tue, Thu, Sat' },
];

const initialTransactions: Transaction[] = [
    { id: '#TXN12035', date: '2023-10-25', description: 'Thu học phí lớp ABC', person: 'Nguyễn Văn A', type: 'Thu', amount: 5000000 },
    { id: '#TXN12034', date: '2023-10-24', description: 'Chi tiền điện tháng 10', person: 'EVN HCMC', type: 'Chi', amount: 2500000 },
    { id: '#TXN12033', date: '2023-10-22', description: 'Mua văn phòng phẩm', person: 'Fahasa', type: 'Chi', amount: 850000 },
    { id: '#TXN12032', date: '2023-10-20', description: 'Thu học phí lớp XYZ', person: 'Trần Thị B', type: 'Thu', amount: 4500000 },
    { id: '#TXN12031', date: '2023-10-18', description: 'Chi lương giảng viên', person: 'Phạm Văn C', type: 'Chi', amount: 15000000 },
];

const initialStaff: Staff[] = [
  { id: 'NV001', name: 'Lê Minh Anh', avatar: 'https://i.pravatar.cc/150?u=nv001', email: 'minhanh.le@example.com', role: 'Giảng viên', status: 'Đang làm việc', joinDate: '2022-03-15' },
  { id: 'NV002', name: 'Trần Hoài Nam', avatar: 'https://i.pravatar.cc/150?u=nv002', email: 'hoainam.tran@example.com', role: 'Nhân viên tư vấn', status: 'Đang làm việc', joinDate: '2022-07-20' },
  { id: 'NV003', name: 'Phạm Thu Hà', avatar: 'https://i.pravatar.cc/150?u=nv003', email: 'thuha.pham@example.com', role: 'Trợ giảng', status: 'Tạm nghỉ', joinDate: '2021-11-01' },
  { id: 'NV004', name: 'Nguyễn Văn Bình', avatar: 'https://i.pravatar.cc/150?u=nv004', email: 'vanbinh.ng@example.com', role: 'Giảng viên', status: 'Đã nghỉ', joinDate: '2020-01-10' },
];

const initialExams: Exam[] = [
  { id: 'K15', name: 'Kiểm tra cuối kỳ Lập trình Python K15', subject: 'Python', date: '2023-12-25', startTime: '08:00', location: 'Phòng A101', capacity: '35/40', status: 'Sắp diễn ra' },
  { id: 'K12', name: 'Thi giữa kỳ Thiết kế Web K12', subject: 'HTML/CSS', date: '2023-11-15', startTime: '13:30', location: 'Phòng B203', capacity: '28/30', status: 'Đang diễn ra' },
  { id: 'K10', name: 'Kiểm tra 15p Java Nâng cao K10', subject: 'Java', date: '2023-10-01', startTime: '10:00', location: 'Phòng C305', capacity: '20/20', status: 'Đã kết thúc' },
  { id: 'K11', name: 'Thi cuối kỳ Quản trị Mạng K11', subject: 'Networking', date: '2023-09-30', startTime: '09:00', location: 'Phòng D102', capacity: '15/20', status: 'Đã hủy' },
];

const initialClassrooms: Classroom[] = [
  { id: 'P101', name: 'Phòng học A', location: 'Cơ sở 1', capacity: 30, status: 'Sẵn sàng' },
  { id: 'P102', name: 'Phòng học B', location: 'Cơ sở 1', capacity: 25, status: 'Đang sử dụng' },
  { id: 'P201', name: 'Phòng học C', location: 'Cơ sở 2', capacity: 50, status: 'Đang bảo trì' },
  { id: 'P202', name: 'Phòng thực hành D', location: 'Cơ sở 2', capacity: 40, status: 'Sẵn sàng' },
  { id: 'P301', name: 'Phòng máy tính E', location: 'Cơ sở 3', capacity: 35, status: 'Sẵn sàng' },
];

const initialTrainingFields: TrainingField[] = [
  { id: 1, name: 'Lập Trình Web', description: 'Các khóa học về phát triển front-end và back-end.', creationDate: '2024-07-20' },
  { id: 2, name: 'Digital Marketing', description: 'Chiến lược SEO, SEM, và quảng cáo trên mạng xã hội.', creationDate: '2024-07-19' },
  { id: 3, name: 'Thiết Kế Đồ Họa', description: 'Sử dụng các công cụ Adobe để tạo ra sản phẩm đồ họa.', creationDate: '2024-07-18' },
  { id: 4, name: 'Khoa Học Dữ Liệu', description: 'Phân tích và trực quan hóa dữ liệu với Python.', creationDate: '2024-07-15' },
  { id: 5, name: 'Quản Trị Mạng', description: 'Cấu hình và quản lý hệ thống mạng doanh nghiệp.', creationDate: '2024-07-12' },
];

const initialCandidates: Candidate[] = [
  { id: 'TS001', name: 'Nguyễn Văn An', dob: '2000-05-15', registrationDate: '2024-07-20', profileStatus: 'Đã duyệt', examResult: 'Đạt' },
  { id: 'TS002', name: 'Trần Thị Bích', dob: '1999-08-22', registrationDate: '2024-07-19', profileStatus: 'Chờ duyệt', examResult: 'Chưa có' },
  { id: 'TS003', name: 'Lê Hoàng Cường', dob: '1999-01-10', registrationDate: '2024-07-18', profileStatus: 'Đã duyệt', examResult: 'Không đạt' },
  { id: 'TS004', name: 'Phạm Thị Dung', dob: '2002-12-03', registrationDate: '2024-07-17', profileStatus: 'Bị từ chối', examResult: 'Chưa có' },
  { id: 'TS005', name: 'Võ Minh Em', dob: '1998-07-18', registrationDate: '2024-07-16', profileStatus: 'Chờ duyệt', examResult: 'Chưa có' },
];

// UTILITY COMPONENTS
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'md' | 'lg' | 'xl' | '2xl' }> = ({ isOpen, onClose, title, children, size = '2xl' }) => {
    if (!isOpen) return null;

    const sizeClasses: Record<string, string> = {
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className={`bg-light-bg-card dark:bg-dark-bg-card rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-xl font-semibold text-light-text-main dark:text-dark-text-main">{title}</h3>
                    <button onClick={onClose} className="text-light-text-muted dark:text-dark-text-muted hover:text-light-text-main dark:hover:text-dark-text-main transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ImageUpload: React.FC<{ value: string | null; onChange: (value: string | null) => void; defaultAvatar: string; }> = ({ value, onChange, defaultAvatar }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium mb-2">Ảnh đại diện</label>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={value || defaultAvatar}
                        alt="Avatar preview"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                     {value && (
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 leading-none hover:bg-red-600"
                            aria-label="Remove image"
                        >
                           <XIcon className="w-3 h-3"/>
                        </button>
                     )}
                </div>
                <div
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 h-24 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors ${
                        isDragging ? 'border-primary-blue bg-primary-blue/10' : 'border-light-border dark:border-dark-border hover:border-primary-blue'
                    }`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <UploadCloudIcon className={`w-8 h-8 ${isDragging ? 'text-primary-blue' : 'text-light-text-muted dark:text-dark-text-muted'}`} />
                    <p className="text-xs text-center text-light-text-muted dark:text-dark-text-muted mt-1">
                       Kéo và thả hoặc <span className="text-primary-blue font-semibold">nhấn để tải lên</span>
                    </p>
                </div>
            </div>
        </div>
    );
};


const StatCard: React.FC<{ title: string; value: string; change?: string; changeUp?: boolean, icon?: React.ReactNode }> = ({ title, value, change, changeUp, icon }) => (
    <div className="bg-light-bg-card dark:bg-dark-bg-card p-6 rounded-lg shadow-md flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-light-text-muted dark:text-dark-text-muted text-sm">{title}</p>
                <p className="text-3xl font-bold mt-2">{value}</p>
            </div>
            {icon && <div className="bg-light-bg-nav dark:bg-dark-bg-nav p-3 rounded-full">{icon}</div>}
        </div>
        {change && (
            <p className={`text-sm mt-1 flex items-center ${changeUp ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUpIcon className={`w-4 h-4 mr-1 ${!changeUp && 'transform rotate-180'}`} /> {change}
            </p>
        )}
    </div>
);

const FinancialOverviewChart: React.FC<{theme: Theme}> = ({ theme }) => (
  <div className="bg-light-bg-card dark:bg-dark-bg-card p-6 rounded-lg">
    <h3 className="text-lg font-semibold">Biểu đồ Dòng tiền - 30 Ngày Gần Nhất</h3>
    <p className="text-light-text-muted dark:text-dark-text-muted text-sm mb-4">Lợi nhuận tháng này: <span className="font-bold text-green-500">+12.8%</span></p>
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={financialOverviewData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} axisLine={false} tickLine={false} />
          <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}tr`} />
          <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`, borderRadius: '0.5rem' }} />
          <Legend iconType="circle" />
          <Line type="monotone" dataKey="thu" name="Thu" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="chi" name="Chi" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const CourseStatusChart: React.FC<{theme: Theme}> = ({ theme }) => (
    <div className="bg-light-bg-card dark:bg-dark-bg-card p-6 rounded-lg flex flex-col">
        <h3 className="text-lg font-semibold">Tình trạng Học viên</h3>
        <p className="text-light-text-muted dark:text-dark-text-muted text-sm mb-4">Tỷ lệ hoàn thành khóa học</p>
        <div className="relative flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={courseStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                    >
                        {courseStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`, borderRadius: '0.5rem' }} />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-4xl font-bold text-green-500">65%</p>
                    <p className="text-light-text-muted dark:text-dark-text-muted">Hoàn thành</p>
                </div>
            </div>
        </div>
        <div className="flex justify-center space-x-4 mt-auto">
            {courseStatusData.map(item => (
                <div key={item.name} className="flex items-center text-sm">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></span>
                    {item.name} ({item.value}%)
                </div>
            ))}
        </div>
    </div>
);

const ActivityFeed: React.FC<{ title: string; items: { icon: React.ReactNode, title: string, subtitle: string, time: string}[] }> = ({ title, items}) => (
    <div className="bg-light-bg-card dark:bg-dark-bg-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ul className="space-y-4">
            {items.map((item, index) => (
                <li key={index} className="flex items-start space-x-4">
                    <div className="bg-light-bg-nav dark:bg-dark-bg-nav p-2 rounded-full">{item.icon}</div>
                    <div className="flex-1">
                        <p className="font-medium text-sm text-light-text-main dark:text-dark-text-main">{item.title}</p>
                        <p className="text-xs text-light-text-muted dark:text-dark-text-muted">{item.subtitle}</p>
                    </div>
                    <p className="text-xs text-light-text-muted dark:text-dark-text-muted whitespace-nowrap">{item.time}</p>
                </li>
            ))}
        </ul>
    </div>
);


const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusMap: { [key: string]: string } = {
        'Hoạt động': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Không hoạt động': 'bg-status-red-bg-light dark:bg-status-red-bg-dark text-status-red',
        'Đang học': 'bg-status-blue-bg-light dark:bg-status-blue-bg-dark text-status-blue',
        'Hoàn thành': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Tạm dừng': 'bg-status-yellow-bg-light dark:bg-status-yellow-bg-dark text-status-yellow',
        'Ongoing': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Upcoming': 'bg-status-blue-bg-light dark:bg-status-blue-bg-dark text-status-blue',
        'Finished': 'bg-status-yellow-bg-light dark:bg-status-yellow-bg-dark text-status-yellow',
        'Thu': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Chi': 'bg-status-red-bg-light dark:bg-status-red-bg-dark text-status-red',
        'Đang làm việc': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Tạm nghỉ': 'bg-status-yellow-bg-light dark:bg-status-yellow-bg-dark text-status-yellow',
        'Đã nghỉ': 'bg-status-red-bg-light dark:bg-status-red-bg-dark text-status-red',
        'Sắp diễn ra': 'bg-status-yellow-bg-light dark:bg-status-yellow-bg-dark text-status-yellow',
        'Đang diễn ra': 'bg-status-blue-bg-light dark:bg-status-blue-bg-dark text-status-blue',
        'Đã kết thúc': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Đã hủy': 'bg-status-red-bg-light dark:bg-status-red-bg-dark text-status-red',
        'Sẵn sàng': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Đang sử dụng': 'bg-status-yellow-bg-light dark:bg-status-yellow-bg-dark text-status-yellow',
        'Đang bảo trì': 'bg-status-red-bg-light dark:bg-status-red-bg-dark text-status-red',
        'Đã duyệt': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Chờ duyệt': 'bg-status-yellow-bg-light dark:bg-status-yellow-bg-dark text-status-yellow',
        'Bị từ chối': 'bg-status-red-bg-light dark:bg-status-red-bg-dark text-status-red',
        'Đạt': 'bg-status-green-bg-light dark:bg-status-green-bg-dark text-status-green',
        'Không đạt': 'bg-status-red-bg-light dark:bg-status-red-bg-dark text-status-red',
        'Chưa có': 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    };
    const style = statusMap[status] || 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${style}`}>{status}</span>;
};

const Pagination: React.FC<{ currentPage: number, totalPages: number, onPageChange: (page: number) => void, totalItems: number, itemsPerPage: number }> = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-light-text-muted dark:text-dark-text-muted gap-4">
            <span>Hiển thị {startItem}-{endItem} của {totalItems}</span>
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-primary-blue text-white' : 'hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// LAYOUT COMPONENTS
const ThemeToggle: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-light-text-muted dark:text-dark-text-muted hover:text-light-text-main dark:hover:text-dark-text-main hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
    );
};

const Sidebar: React.FC<{ activePage: Page; onNavigate: (page: Page) => void; isOpen: boolean; onClose: () => void; adminProfile: AdminProfile; }> = ({ activePage, onNavigate, isOpen, onClose, adminProfile }) => {
    const handleNav = (page: Page) => {
        onNavigate(page);
        onClose();
    };
    
    return (
        <aside className={`w-64 bg-light-bg-nav dark:bg-dark-bg-nav flex flex-col fixed h-full z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <button
              onClick={() => handleNav('Profile')}
              className="w-full text-left hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover transition-colors focus:outline-none"
            >
                <div className="flex items-center h-20 px-4 border-b border-light-border dark:border-dark-border">
                    <img src={adminProfile.avatar} alt="Admin Avatar" className="w-12 h-12 rounded-full object-cover" />
                    <div className="ml-3">
                        <p className="font-bold text-md text-light-text-main dark:text-dark-text-main">{adminProfile.name}</p>
                        <p className="text-xs text-light-text-muted dark:text-dark-text-muted">{adminProfile.role}</p>
                    </div>
                </div>
            </button>
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navigationItems.map(item => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleNav(item.page); }}
                        className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${activePage === item.page ? 'bg-primary-blue text-white font-semibold' : 'text-light-text-muted dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover hover:text-light-text-main dark:hover:text-dark-text-main'}`}
                    >
                        {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                        {item.name}
                    </a>
                ))}
            </nav>
            <div className="px-4 py-4 border-t border-light-border dark:border-dark-border space-y-2">
                 <a href="#" onClick={(e) => { e.preventDefault(); handleNav('Settings'); }} className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors text-light-text-muted dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover hover:text-light-text-main dark:hover:text-dark-text-main`}>
                    <SettingsIcon className="w-5 h-5 mr-3" />
                    Cài đặt
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNav('Logout'); }} className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors text-light-text-muted dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover hover:text-light-text-main dark:hover:text-dark-text-main`}>
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    Đăng xuất
                </a>
            </div>
        </aside>
    );
};

const AppLayout: React.FC<{ children: React.ReactNode, activePage: Page; onNavigate: (page: Page) => void, theme: Theme, setTheme: (theme: Theme) => void, adminProfile: AdminProfile }> = ({ children, activePage, onNavigate, theme, setTheme, adminProfile }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pageTitle = useMemo(() => {
        if (activePage === 'Profile') return 'Hồ sơ';
        if (activePage === 'Reports') return 'Báo cáo';
        return navigationItems.find(item => item.page === activePage)?.name || 'Trang chủ';
    }, [activePage]);

    return (
        <div className="flex h-screen bg-light-bg-main dark:bg-dark-bg-main">
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activePage={activePage} onNavigate={onNavigate} adminProfile={adminProfile} />
            <div className="flex-1 flex flex-col lg:ml-64 h-screen overflow-hidden">
                <header className="flex-shrink-0 bg-light-bg-main/80 dark:bg-dark-bg-main/80 backdrop-blur-sm z-20 flex items-center justify-between h-16 px-4 md:px-8 border-b border-light-border dark:border-dark-border">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 mr-2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-main dark:hover:text-dark-text-main">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold hidden sm:block">{pageTitle}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                        <button className="p-2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-main dark:hover:text-dark-text-main">
                            <BellIcon className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <img className="w-10 h-10 rounded-full object-cover" src={adminProfile.avatar} alt={adminProfile.name} />
                            <div className="hidden md:block">
                                <p className="font-semibold">{adminProfile.name}</p>
                                <p className="text-xs text-light-text-muted dark:text-dark-text-muted">{adminProfile.role}</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};


// PAGE COMPONENTS
const DashboardPage: React.FC<{ theme: Theme }> = ({ theme }) => {
    const examItems = upcomingExams.map(exam => ({
        icon: <BookOpenIcon className="w-5 h-5 text-primary-blue"/>,
        title: exam.title,
        subtitle: `Môn: ${exam.subject}`,
        time: exam.time
    }));

    const activityItems = recentActivities.map(activity => ({
        icon: <UserCheckIcon className="w-5 h-5 text-green-500"/>,
        title: activity.name,
        subtitle: `Khóa học: ${activity.course}`,
        time: activity.time
    }));

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
                    <p className="text-light-text-muted dark:text-dark-text-muted mt-1">Tổng quan hoạt động của trung tâm</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm">
                        <option>Tháng này</option>
                        <option>3 Tháng trước</option>
                        <option>Năm nay</option>
                    </select>
                    <button className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Tạo Báo cáo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Tổng số học viên" value="1,250" change="+5.4%" changeUp={true} />
                <StatCard title="Học viên mới (tháng)" value="89" change="+15%" changeUp={true} />
                <StatCard title="Tổng doanh thu" value="150tr" change="+12.8%" changeUp={true} />
                <StatCard title="Giảng viên hoạt động" value="15" change="+0%" changeUp={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <FinancialOverviewChart theme={theme} />
                </div>
                <div className="lg:col-span-1">
                    <CourseStatusChart theme={theme} />
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityFeed title="Lịch thi sắp tới" items={examItems} />
                <ActivityFeed title="Học viên mới đăng ký" items={activityItems} />
            </div>
        </>
    );
};

const AddEditStudentForm: React.FC<{
  student: Student | null;
  onSubmit: (formData: Omit<Student, 'id' | 'avgScore'> & { avatar: string | null }) => void;
  onClose: () => void;
}> = ({ student, onSubmit, onClose }) => {
    const [name, setName] = useState(student?.name || '');
    const [course, setCourse] = useState(student?.course || initialCourses[0]?.name || '');
    const [enrollDate, setEnrollDate] = useState(student?.enrollDate || '');
    const [status, setStatus] = useState(student?.status || 'Đang học');
    const [avatar, setAvatar] = useState<string | null>(student?.avatar || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, course, enrollDate, status, avatar });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload 
                value={avatar} 
                onChange={setAvatar} 
                defaultAvatar={`https://i.pravatar.cc/150?u=${student?.id || 'new'}`}
            />
            <div>
                <label className="block text-sm font-medium mb-2">Họ và Tên</label>
                <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Nguyễn Văn A" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-2">Khóa học</label>
                <select value={course} onChange={e => setCourse(e.target.value)} required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                   {initialCourses.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium mb-2">Ngày đăng ký</label>
                <input value={enrollDate} onChange={e => setEnrollDate(e.target.value)} type="date" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-muted" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <select value={status} onChange={e => setStatus(e.target.value as Student['status'])} required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                   <option>Đang học</option>
                   <option>Hoàn thành</option>
                   <option>Tạm dừng</option>
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
            </div>
        </form>
    );
};


const StudentManagementPage: React.FC = () => {
    const ITEMS_PER_PAGE = 5;
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Student | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });

    const filteredStudents = useMemo(() => {
        return students
            .filter(student =>
                (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.id.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .filter(student =>
                statusFilter === 'all' || student.status === statusFilter
            );
    }, [searchTerm, statusFilter, students]);

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredStudents, currentPage]);
    
    const activeStudents = students.filter(s => s.status === 'Đang học').length;
    const completedStudents = students.filter(s => s.status === 'Hoàn thành').length;
    const averageScore = (students.reduce((acc, s) => acc + s.avgScore, 0) / students.length).toFixed(1);

    const handleAddStudent = (formData: Omit<Student, 'id' | 'avgScore'> & { avatar: string | null }) => {
        const newStudent: Student = {
            id: `HV${Date.now().toString().slice(-4)}`,
            ...formData,
            avatar: formData.avatar || `https://i.pravatar.cc/150?u=hv${Date.now().toString().slice(-4)}`,
            avgScore: 8.0, // Default score
        };
        setStudents([newStudent, ...students]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateStudent = (formData: Omit<Student, 'id' | 'avgScore'> & { avatar: string | null }) => {
        if (!modalState.selected) return;
        const updatedStudent: Student = {
            ...modalState.selected,
            ...formData,
            avatar: formData.avatar || modalState.selected.avatar,
        };
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        setModalState({ ...modalState, edit: false, selected: null });
    };
    
    const handleDeleteStudent = () => {
        if (!modalState.selected) return;
        setStudents(students.filter(s => s.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };

    const handleCloseModal = () => {
      setModalState({ ...modalState, add: false, edit: false, selected: null });
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Học viên</h1>
            <p className="text-light-text-muted dark:text-dark-text-muted mb-6">Tổng quan, tìm kiếm và quản lý thông tin học viên.</p>
            
            {/* ADD/EDIT MODAL */}
            <Modal isOpen={modalState.add || modalState.edit} onClose={handleCloseModal} title={modalState.add ? "Thêm Học viên Mới" : "Chỉnh sửa Thông tin"}>
               <AddEditStudentForm 
                    student={modalState.selected}
                    onSubmit={modalState.add ? handleAddStudent : handleUpdateStudent}
                    onClose={handleCloseModal}
               />
            </Modal>
            
            {/* VIEW MODAL */}
            <Modal isOpen={modalState.view} onClose={() => setModalState({...modalState, view: false, selected: null})} title="Thông tin Học viên">
                {modalState.selected && (
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <img src={modalState.selected.avatar} alt={modalState.selected.name} className="w-24 h-24 rounded-full object-cover" />
                        <div className="space-y-2 text-sm text-center sm:text-left">
                            <p><strong className="w-32 inline-block">Mã Học Viên:</strong> {modalState.selected.id}</p>
                            <p><strong className="w-32 inline-block">Họ và Tên:</strong> {modalState.selected.name}</p>
                            <p><strong className="w-32 inline-block">Khóa học:</strong> {modalState.selected.course}</p>
                            <p><strong className="w-32 inline-block">Điểm TB:</strong> {modalState.selected.avgScore}</p>
                            <p><strong className="w-32 inline-block">Ngày Đăng Ký:</strong> {modalState.selected.enrollDate}</p>
                            <p><strong className="w-32 inline-block">Trạng thái:</strong> <StatusBadge status={modalState.selected.status} /></p>
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* DELETE MODAL */}
            <Modal isOpen={modalState.delete} onClose={() => setModalState({...modalState, delete: false, selected: null})} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa học viên <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name}</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteStudent} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Tổng số học viên" value={students.length.toString()} icon={<UsersIcon className="w-6 h-6 text-primary-blue" />} />
                <StatCard title="Đang theo học" value={activeStudents.toString()} icon={<TrendingUpIcon className="w-6 h-6 text-status-blue" />} />
                <StatCard title="Hoàn thành khóa" value={completedStudents.toString()} icon={<GraduationCapIcon className="w-6 h-6 text-status-green" />} />
                <StatCard title="Điểm trung bình" value={averageScore} icon={<BookOpenIcon className="w-6 h-6 text-status-yellow" />} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên hoặc mã học viên..." 
                        className="w-full bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end w-full md:w-auto">
                    <select 
                        className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Đang học">Đang học</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Tạm dừng">Tạm dừng</option>
                    </select>
                     <button className="flex items-center bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border font-semibold py-2 px-4 rounded-lg hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover transition-colors">
                        <DownloadIcon className="w-5 h-5 mr-2" /> Xuất Excel
                    </button>
                    <button onClick={() => setModalState({ ...modalState, add: true, selected: null })} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm Học Viên
                    </button>
                </div>
            </div>

            <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 w-12"><input type="checkbox" className="bg-light-bg-card dark:bg-dark-bg-card border-light-border dark:border-dark-border rounded" /></th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Họ và Tên</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Khóa Học</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Điểm TB</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Trạng Thái</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Ngày Đăng Ký</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStudents.map(student => (
                            <tr key={student.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4"><input type="checkbox" className="bg-light-bg-card dark:bg-dark-bg-card border-light-border dark:border-dark-border rounded" /></td>
                                <td className="p-4">
                                     <div className="flex items-center">
                                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-xs text-light-text-muted dark:text-dark-text-muted">{student.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">{student.course}</td>
                                <td className="p-4 text-sm font-semibold">{student.avgScore}</td>
                                <td className="p-4 text-sm"><StatusBadge status={student.status} /></td>
                                <td className="p-4 text-sm">{student.enrollDate}</td>
                                <td className="p-4">
                                    <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: student })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: student })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: student })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    totalItems={filteredStudents.length} 
                    itemsPerPage={ITEMS_PER_PAGE} 
                />
            </div>
        </div>
    );
};

const AddEditInstructorForm: React.FC<{
  instructor: Instructor | null;
  onSubmit: (formData: Omit<Instructor, 'id'> & { avatar: string | null }) => void;
  onClose: () => void;
}> = ({ instructor, onSubmit, onClose }) => {
    const [name, setName] = useState(instructor?.name || '');
    const [email, setEmail] = useState(instructor?.email || '');
    const [major, setMajor] = useState(instructor?.major || '');
    const [status, setStatus] = useState(instructor?.status || 'Hoạt động');
    const [avatar, setAvatar] = useState<string | null>(instructor?.avatar || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, email, major, status, avatar });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <ImageUpload 
                value={avatar} 
                onChange={setAvatar} 
                defaultAvatar={`https://i.pravatar.cc/150?u=${instructor?.id || 'new'}`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Họ và Tên</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Nguyễn Văn A" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@example.com" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium mb-2">Chuyên ngành</label>
                <input value={major} onChange={e => setMajor(e.target.value)} type="text" placeholder="Khoa học Máy tính" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <select value={status} onChange={e => setStatus(e.target.value as Instructor['status'])} required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                   <option value="Hoạt động">Hoạt động</option>
                   <option value="Không hoạt động">Không hoạt động</option>
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
            </div>
        </form>
    );
};


const InstructorManagementPage: React.FC = () => {
    const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
    const ITEMS_PER_PAGE = 5;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [majorFilter, setMajorFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Instructor | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });

    const filteredInstructors = useMemo(() => {
        return instructors
            .filter(instructor =>
                (instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 instructor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 instructor.major.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .filter(instructor =>
                statusFilter === 'all' || instructor.status === statusFilter
            )
            .filter(instructor =>
                majorFilter === 'all' || instructor.major === majorFilter
            );
    }, [searchTerm, statusFilter, majorFilter, instructors]);

    const totalPages = Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE);

    const paginatedInstructors = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredInstructors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredInstructors, currentPage]);

    const uniqueMajors = [...new Set(instructors.map(i => i.major))];
    const activeInstructors = instructors.filter(i => i.status === 'Hoạt động').length;
    
    const majorCounts = instructors.reduce((acc, i) => {
        acc[i.major] = (acc[i.major] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topMajor = Object.keys(majorCounts).reduce((a, b) => majorCounts[a] > majorCounts[b] ? a : b, '');

    const handleAddInstructor = (formData: Omit<Instructor, 'id'> & { avatar: string | null }) => {
        const newInstructor: Instructor = {
            id: `GV${Date.now().toString().slice(-4)}`,
            ...formData,
            avatar: formData.avatar || `https://i.pravatar.cc/150?u=gv${Date.now().toString().slice(-4)}`,
        };
        setInstructors([newInstructor, ...instructors]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateInstructor = (formData: Omit<Instructor, 'id'> & { avatar: string | null }) => {
        if (!modalState.selected) return;
        const updatedInstructor: Instructor = {
            ...modalState.selected,
            ...formData,
            avatar: formData.avatar || modalState.selected.avatar,
        };
        setInstructors(instructors.map(i => i.id === updatedInstructor.id ? updatedInstructor : i));
        setModalState({ ...modalState, edit: false, selected: null });
    };

    const handleDeleteInstructor = () => {
        if (!modalState.selected) return;
        setInstructors(instructors.filter(i => i.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };

    const handleCloseModal = () => {
        setModalState({ ...modalState, add: false, edit: false, selected: null });
    };

     return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Giảng viên</h1>
            <p className="text-light-text-muted dark:text-dark-text-muted mb-6">Tổng quan, tìm kiếm và quản lý thông tin giảng viên.</p>

            <Modal isOpen={modalState.add || modalState.edit} onClose={handleCloseModal} title={modalState.add ? "Thêm Giảng viên Mới" : "Chỉnh sửa Thông tin Giảng viên"}>
                <AddEditInstructorForm 
                    instructor={modalState.selected}
                    onSubmit={modalState.add ? handleAddInstructor : handleUpdateInstructor}
                    onClose={handleCloseModal}
                />
            </Modal>
            
            <Modal isOpen={modalState.view} onClose={() => setModalState({ ...modalState, view: false, selected: null })} title="Thông tin Giảng viên">
                {modalState.selected && <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <img src={modalState.selected.avatar} alt={modalState.selected.name} className="w-24 h-24 rounded-full" />
                    <div className="space-y-2 text-sm text-center sm:text-left">
                        <p><strong className="w-24 inline-block">Mã GV:</strong> {modalState.selected.id}</p>
                        <p><strong className="w-24 inline-block">Họ và Tên:</strong> {modalState.selected.name}</p>
                        <p><strong className="w-24 inline-block">Email:</strong> {modalState.selected.email}</p>
                        <p><strong className="w-24 inline-block">Chuyên ngành:</strong> {modalState.selected.major}</p>
                        <p><strong className="w-24 inline-block">Trạng thái:</strong> <StatusBadge status={modalState.selected.status} /></p>
                    </div>
                </div>}
            </Modal>

            <Modal isOpen={modalState.delete} onClose={() => setModalState({ ...modalState, delete: false, selected: null })} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa giảng viên <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name}</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteInstructor} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <StatCard title="Tổng số giảng viên" value={instructors.length.toString()} icon={<UsersIcon className="w-6 h-6 text-primary-blue" />} />
                 <StatCard title="Đang hoạt động" value={activeInstructors.toString()} icon={<UserCheckIcon className="w-6 h-6 text-status-green" />} />
                 <StatCard title="Chuyên ngành hàng đầu" value={topMajor} icon={<BookOpenIcon className="w-6 h-6 text-status-yellow" />} />
            </div>

             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, mã, chuyên ngành..." 
                        className="w-full bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end w-full md:w-auto">
                     <select 
                        className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                     >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Không hoạt động">Không hoạt động</option>
                    </select>
                     <select 
                        className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        value={majorFilter}
                        onChange={e => { setMajorFilter(e.target.value); setCurrentPage(1); }}
                     >
                        <option value="all">Tất cả chuyên ngành</option>
                        {uniqueMajors.map(major => <option key={major} value={major}>{major}</option>)}
                    </select>
                    <button className="flex items-center bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border font-semibold py-2 px-4 rounded-lg hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover transition-colors">
                        <DownloadIcon className="w-5 h-5 mr-2" /> Xuất Excel
                    </button>
                    <button onClick={() => setModalState({...modalState, add: true, selected: null})} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm Giảng viên
                    </button>
                </div>
            </div>
            <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Họ và Tên</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Chuyên ngành</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Email</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Trạng thái</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedInstructors.map(instructor => (
                            <tr key={instructor.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <img src={instructor.avatar} alt={instructor.name} className="w-10 h-10 rounded-full mr-4" />
                                        <div>
                                            <p className="font-medium">{instructor.name}</p>
                                            <p className="text-xs text-light-text-muted dark:text-dark-text-muted">{instructor.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">{instructor.major}</td>
                                <td className="p-4 text-sm">{instructor.email}</td>
                                <td className="p-4"><StatusBadge status={instructor.status} /></td>
                                <td className="p-4">
                                    <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: instructor })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: instructor })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: instructor })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    totalItems={filteredInstructors.length} 
                    itemsPerPage={ITEMS_PER_PAGE} 
                />
            </div>
        </div>
    );
}

const CourseManagementPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Course | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });

    const handleAddCourse = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCourse: Course = {
            name: formData.get('name') as string,
            code: formData.get('code') as string,
            instructor: formData.get('instructor') as string,
            schedule: formData.get('schedule') as string,
            status: 'Upcoming',
            students: {
                enrolled: 0,
                capacity: parseInt(formData.get('capacity') as string, 10),
            },
        };
        setCourses([newCourse, ...courses]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateCourse = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!modalState.selected) return;
        const formData = new FormData(e.currentTarget);
        const updatedCourse: Course = {
            ...modalState.selected,
            name: formData.get('name') as string,
            code: formData.get('code') as string,
            instructor: formData.get('instructor') as string,
            schedule: formData.get('schedule') as string,
            status: formData.get('status') as Course['status'],
            students: {
                ...modalState.selected.students,
                capacity: parseInt(formData.get('capacity') as string, 10),
            },
        };
        setCourses(courses.map(c => c.code === updatedCourse.code ? updatedCourse : c));
        setModalState({ ...modalState, edit: false, selected: null });
    };

    const handleDeleteCourse = () => {
        if (!modalState.selected) return;
        setCourses(courses.filter(c => c.code !== modalState.selected!.code));
        setModalState({ ...modalState, delete: false, selected: null });
    };


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Khóa học & Lớp học</h1>
             <Modal isOpen={modalState.add || modalState.edit} onClose={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} title={modalState.add ? "Thêm Khóa học Mới" : "Chỉnh sửa Khóa học"}>
                 <form onSubmit={modalState.add ? handleAddCourse : handleUpdateCourse} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tên khóa học</label>
                            <input name="name" type="text" placeholder="Advanced JavaScript" required defaultValue={modalState.selected?.name} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Mã lớp</label>
                            <input name="code" type="text" placeholder="JS-ADV-01" required defaultValue={modalState.selected?.code} readOnly={!!modalState.selected} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue read-only:bg-gray-200 dark:read-only:bg-gray-700" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Giảng viên</label>
                            <select name="instructor" required defaultValue={modalState.selected?.instructor} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                               {initialInstructors.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Sức chứa</label>
                            <input name="capacity" type="number" placeholder="30" required defaultValue={modalState.selected?.students.capacity} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-2">Lịch học</label>
                        <input name="schedule" type="text" placeholder="Mon, Wed, Fri" required defaultValue={modalState.selected?.schedule} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                    </div>
                    {modalState.edit && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Trạng thái</label>
                            <select name="status" required defaultValue={modalState.selected?.status} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                                <option>Ongoing</option>
                                <option>Upcoming</option>
                                <option>Finished</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                        <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={modalState.view} onClose={() => setModalState({ ...modalState, view: false, selected: null })} title="Thông tin Khóa học">
                {modalState.selected && <div className="space-y-3 text-sm">
                    <p><strong className="w-24 inline-block">Tên khóa học:</strong> {modalState.selected.name}</p>
                    <p><strong className="w-24 inline-block">Mã lớp:</strong> {modalState.selected.code}</p>
                    <p><strong className="w-24 inline-block">Giảng viên:</strong> {modalState.selected.instructor}</p>
                    <p><strong className="w-24 inline-block">Lịch học:</strong> {modalState.selected.schedule}</p>
                    <p><strong className="w-24 inline-block">Học viên:</strong> {modalState.selected.students.enrolled} / {modalState.selected.students.capacity}</p>
                    <p><strong className="w-24 inline-block">Trạng thái:</strong> <StatusBadge status={modalState.selected.status} /></p>
                </div>}
            </Modal>
            
            <Modal isOpen={modalState.delete} onClose={() => setModalState({ ...modalState, delete: false, selected: null })} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa khóa học <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name} ({modalState.selected?.code})</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                 <div className="flex items-center space-x-4">
                    <select className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                        <option>Trạng thái: Tất cả</option>
                    </select>
                    <select className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                        <option>Giảng viên: Tất cả</option>
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setModalState({...modalState, add: true})} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm Khóa học Mới
                    </button>
                </div>
            </div>
            <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                     <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">TÊN KHÓA HỌC</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">MÃ LỚP</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">GIẢNG VIÊN</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">HỌC VIÊN</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">TRẠNG THÁI</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">LỊCH HỌC</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.code} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4 font-medium">{course.name}</td>
                                <td className="p-4">{course.code}</td>
                                <td className="p-4">{course.instructor}</td>
                                <td className="p-4">{course.students.enrolled} / {course.students.capacity}</td>
                                <td className="p-4"><StatusBadge status={course.status} /></td>
                                <td className="p-4">{course.schedule}</td>
                                <td className="p-4">
                                     <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: course })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: course })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: course })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AddEditTransactionForm: React.FC<{
  transaction: Transaction | null;
  onSubmit: (formData: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}> = ({ transaction, onSubmit, onClose }) => {
    const [type, setType] = useState(transaction?.type || 'Thu');
    const [amount, setAmount] = useState(transaction?.amount || '');
    const [description, setDescription] = useState(transaction?.description || '');
    const [person, setPerson] = useState(transaction?.person || '');
    const [date, setDate] = useState(transaction?.date || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ 
            type, 
            amount: Number(amount), 
            description, 
            person, 
            date 
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Loại giao dịch</label>
                <select value={type} onChange={e => setType(e.target.value as Transaction['type'])} required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                   <option value="Thu">Thu</option>
                   <option value="Chi">Chi</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Số tiền (VND)</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="5000000" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Nội dung</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Thu học phí..." required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue h-24"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Người nộp/nhận</label>
                <input value={person} onChange={e => setPerson(e.target.value)} type="text" placeholder="Nguyễn Văn A" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-2">Ngày giao dịch</label>
                <input value={date} onChange={e => setDate(e.target.value)} type="date" required className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-muted" />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu Giao Dịch</button>
            </div>
        </form>
    );
};

const FinancialManagementPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Transaction | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;


    const handleAddTransaction = (formData: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            id: `#TXN${Date.now().toString().slice(-5)}`,
            ...formData,
            amount: formData.type === 'Chi' ? Math.abs(formData.amount) * -1 : Math.abs(formData.amount),
        };
        setTransactions([newTransaction, ...transactions]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateTransaction = (formData: Omit<Transaction, 'id'>) => {
        if (!modalState.selected) return;
        const updatedTransaction: Transaction = {
            ...modalState.selected,
            ...formData,
            amount: formData.type === 'Chi' ? Math.abs(formData.amount) * -1 : Math.abs(formData.amount),
        };
        setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
        setModalState({ ...modalState, edit: false, selected: null });
    };

    const handleDeleteTransaction = () => {
        if (!modalState.selected) return;
        setTransactions(transactions.filter(t => t.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };

    const handleCloseModal = () => {
      setModalState({ view: false, add: false, edit: false, delete: false, selected: null });
    };
    
    const { totalThu, totalChi } = useMemo(() => {
        return transactions.reduce((acc, tx) => {
            if (tx.type === 'Thu') acc.totalThu += tx.amount;
            if (tx.type === 'Chi') acc.totalChi += tx.amount;
            return acc;
        }, { totalThu: 0, totalChi: 0 });
    }, [transactions]);
    
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => 
            tx.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transactions, searchTerm]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);


    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tổng Quan Tài Chính</h1>
            
            <Modal isOpen={modalState.add || modalState.edit} onClose={handleCloseModal} title={modalState.add ? "Thêm Giao Dịch Mới" : "Chỉnh sửa Giao dịch"}>
                 <AddEditTransactionForm 
                    transaction={modalState.selected}
                    onSubmit={modalState.add ? handleAddTransaction : handleUpdateTransaction}
                    onClose={handleCloseModal}
                 />
            </Modal>
            
            <Modal isOpen={modalState.view} onClose={handleCloseModal} title="Chi tiết Giao dịch">
                {modalState.selected && (
                    <div className="space-y-3 text-sm">
                        <p><strong className="w-32 inline-block">Mã Giao Dịch:</strong> {modalState.selected.id}</p>
                        <p><strong className="w-32 inline-block">Ngày:</strong> {modalState.selected.date}</p>
                        <p><strong className="w-32 inline-block">Nội Dung:</strong> {modalState.selected.description}</p>
                        <p><strong className="w-32 inline-block">Người Nộp/Nhận:</strong> {modalState.selected.person}</p>
                        <p><strong className="w-32 inline-block">Loại:</strong> <StatusBadge status={modalState.selected.type} /></p>
                        <p><strong className="w-32 inline-block">Số Tiền:</strong> <span className={`font-semibold ${modalState.selected.type === 'Thu' ? 'text-status-green' : 'text-status-red'}`}>{formatCurrency(modalState.selected.amount)}</span></p>
                    </div>
                )}
            </Modal>
            
            <Modal isOpen={modalState.delete} onClose={handleCloseModal} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa giao dịch <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.id}</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={handleCloseModal} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteTransaction} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border font-semibold py-2 px-4 rounded-lg hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover transition-colors">Xuất Báo Cáo</button>
                    <button onClick={() => setModalState({ ...modalState, add: true, selected: null })} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors"><PlusIcon className="w-5 h-5 mr-2" /> Thêm Giao Dịch Mới</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Tổng Thu Trong Tháng" value={formatCurrency(totalThu)} change="+5.2%" changeUp={true} />
                <StatCard title="Tổng Chi Trong Tháng" value={formatCurrency(totalChi)} change="+2.1%" changeUp={false} />
                <StatCard title="Lợi Nhuận Ròng" value={formatCurrency(totalThu - totalChi)} change="+12.8%" changeUp={true} />
            </div>

            <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Lịch Sử Giao Dịch</h2>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="relative w-full md:w-1/3">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Tìm theo mã giao dịch..."
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <select className="bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"><option>Tháng này</option></select>
                        <select className="bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"><option>Tất cả loại</option></select>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="border-b border-light-border dark:border-dark-border">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Mã Giao Dịch</th>
                                <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Ngày</th>
                                <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Nội Dung</th>
                                <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Người Nộp/Nhận</th>
                                <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Loại</th>
                                <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-right">Số Tiền</th>
                                <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransactions.map(tx => (
                                <tr key={tx.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                    <td className="p-4 font-medium">{tx.id}</td>
                                    <td className="p-4 text-sm">{tx.date}</td>
                                    <td className="p-4 text-sm">{tx.description}</td>
                                    <td className="p-4 text-sm">{tx.person}</td>
                                    <td className="p-4"><StatusBadge status={tx.type} /></td>
                                    <td className={`p-4 text-right font-semibold ${tx.type === 'Thu' ? 'text-status-green' : 'text-status-red'}`}>{formatCurrency(tx.amount)}</td>
                                    <td className="p-4">
                                     <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: tx })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: tx })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: tx })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="mt-6">
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={setCurrentPage} 
                        totalItems={filteredTransactions.length} 
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                 </div>
            </div>
        </div>
    );
}

const StaffManagementPage: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Staff | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });

    const filteredStaff = useMemo(() => {
        return staffList.filter(staff =>
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [staffList, searchTerm]);

    const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
    const paginatedStaff = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredStaff, currentPage]);

    const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newStaff: Staff = {
            id: `NV${Date.now().toString().slice(-4)}`,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            joinDate: formData.get('joinDate') as string,
            status: 'Đang làm việc',
            avatar: `https://i.pravatar.cc/150?u=nv${Date.now().toString().slice(-4)}`,
        };
        setStaffList([newStaff, ...staffList]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateStaff = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!modalState.selected) return;
        const formData = new FormData(e.currentTarget);
        const updatedStaff: Staff = {
            ...modalState.selected,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            joinDate: formData.get('joinDate') as string,
            status: formData.get('status') as Staff['status'],
        };
        setStaffList(staffList.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        setModalState({ ...modalState, edit: false, selected: null });
    };

    const handleDeleteStaff = () => {
        if (!modalState.selected) return;
        setStaffList(staffList.filter(s => s.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Nhân viên</h1>
            <p className="text-light-text-muted dark:text-dark-text-muted mb-6">Xem, tìm kiếm và quản lý thông tin nhân viên trong trung tâm.</p>
            <Modal isOpen={modalState.add || modalState.edit} onClose={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} title={modalState.add ? "Thêm Nhân viên Mới" : "Chỉnh sửa Thông tin Nhân viên"}>
                <form onSubmit={modalState.add ? handleAddStaff : handleUpdateStaff} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Họ và Tên</label>
                            <input name="name" type="text" placeholder="Lê Minh Anh" required defaultValue={modalState.selected?.name} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input name="email" type="email" placeholder="minhanh.le@example.com" required defaultValue={modalState.selected?.email} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium mb-2">Chức vụ</label>
                            <input name="role" type="text" placeholder="Giảng viên" required defaultValue={modalState.selected?.role} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Ngày tham gia</label>
                            <input name="joinDate" type="date" required defaultValue={modalState.selected?.joinDate} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-muted" />
                        </div>
                    </div>
                    {modalState.edit && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Trạng thái</label>
                            <select name="status" required defaultValue={modalState.selected?.status} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                                <option>Đang làm việc</option>
                                <option>Tạm nghỉ</option>
                                <option>Đã nghỉ</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                        <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={modalState.view} onClose={() => setModalState({ ...modalState, view: false, selected: null })} title="Thông tin Nhân viên">
                 {modalState.selected && <div className="flex items-center space-x-6">
                    <img src={modalState.selected.avatar} alt={modalState.selected.name} className="w-24 h-24 rounded-full" />
                    <div className="space-y-2 text-sm">
                        <p><strong className="w-24 inline-block">Mã NV:</strong> {modalState.selected.id}</p>
                        <p><strong className="w-24 inline-block">Họ và Tên:</strong> {modalState.selected.name}</p>
                        <p><strong className="w-24 inline-block">Email:</strong> {modalState.selected.email}</p>
                        <p><strong className="w-24 inline-block">Chức vụ:</strong> {modalState.selected.role}</p>
                         <p><strong className="w-24 inline-block">Ngày tham gia:</strong> {modalState.selected.joinDate}</p>
                        <p><strong className="w-24 inline-block">Trạng thái:</strong> <StatusBadge status={modalState.selected.status} /></p>
                    </div>
                </div>}
            </Modal>

            <Modal isOpen={modalState.delete} onClose={() => setModalState({ ...modalState, delete: false, selected: null })} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa nhân viên <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name}</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteStaff} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>


            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, mã hoặc chức vụ..." 
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end w-full md:w-auto">
                     <select className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm">
                        <option>Trạng thái: Đang làm việc</option>
                    </select>
                    <button onClick={() => setModalState({ ...modalState, add: true })} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm Nhân viên mới
                    </button>
                </div>
            </div>

            <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 w-12"><input type="checkbox" className="bg-light-bg-card dark:bg-dark-bg-card border-light-border dark:border-dark-border rounded" /></th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Họ và Tên</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Email</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Chức vụ</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Trạng thái</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Ngày tham gia</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStaff.map(staff => (
                            <tr key={staff.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4"><input type="checkbox" className="bg-light-bg-card dark:bg-dark-bg-card border-light-border dark:border-dark-border rounded" /></td>
                                <td className="p-4">
                                     <div className="flex items-center">
                                        <img src={staff.avatar} alt={staff.name} className="w-10 h-10 rounded-full mr-4" />
                                        <div>
                                            <p className="font-medium">{staff.name}</p>
                                            <p className="text-xs text-light-text-muted dark:text-dark-text-muted">{staff.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">{staff.email}</td>
                                <td className="p-4 text-sm">{staff.role}</td>
                                <td className="p-4"><StatusBadge status={staff.status} /></td>
                                <td className="p-4 text-sm">{staff.joinDate}</td>
                                <td className="p-4">
                                     <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: staff })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: staff })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: staff })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    totalItems={filteredStaff.length} 
                    itemsPerPage={ITEMS_PER_PAGE} />
            </div>
        </div>
    );
};

const ExamScheduleManagementPage: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>(initialExams);
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Exam | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const uniqueSubjects = useMemo(() => [...new Set(exams.map(e => e.subject))], [exams]);

    const filteredExams = useMemo(() => {
        return exams
            .filter(exam =>
                exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(exam => statusFilter === 'all' || exam.status === statusFilter)
            .filter(exam => subjectFilter === 'all' || exam.subject === subjectFilter)
            .filter(exam => dateFilter === '' || exam.date === dateFilter);
    }, [exams, searchTerm, statusFilter, subjectFilter, dateFilter]);

    const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);

    const paginatedExams = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredExams.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredExams, currentPage]);

    const handleAddExam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newExam: Exam = {
            id: `K${Date.now().toString().slice(-3)}`,
            name: formData.get('name') as string,
            subject: formData.get('subject') as string,
            date: formData.get('date') as string,
            startTime: formData.get('startTime') as string,
            location: formData.get('location') as string,
            capacity: `0/${formData.get('capacity') as string}`,
            status: 'Sắp diễn ra',
        };
        setExams([newExam, ...exams]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateExam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!modalState.selected) return;
        const formData = new FormData(e.currentTarget);
        const updatedExam: Exam = {
            ...modalState.selected,
            name: formData.get('name') as string,
            subject: formData.get('subject') as string,
            date: formData.get('date') as string,
            startTime: formData.get('startTime') as string,
            location: formData.get('location') as string,
            capacity: `${modalState.selected.capacity.split('/')[0]}/${formData.get('capacity') as string}`,
            status: formData.get('status') as Exam['status'],
        };
        setExams(exams.map(ex => ex.id === updatedExam.id ? updatedExam : ex));
        setModalState({ ...modalState, edit: false, selected: null });
    };
    
    const handleDeleteExam = () => {
        if (!modalState.selected) return;
        setExams(exams.filter(ex => ex.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Lịch thi</h1>
            <Modal isOpen={modalState.add || modalState.edit} onClose={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} title={modalState.add ? "Thêm Lịch thi Mới" : "Chỉnh sửa Lịch thi"}>
                <form onSubmit={modalState.add ? handleAddExam : handleUpdateExam} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-2">Tên kỳ thi</label>
                        <input name="name" type="text" placeholder="Kiểm tra cuối kỳ..." required defaultValue={modalState.selected?.name} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Môn học</label>
                            <input name="subject" type="text" placeholder="Python" required defaultValue={modalState.selected?.subject} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Địa điểm</label>
                            <input name="location" type="text" placeholder="Phòng A101" required defaultValue={modalState.selected?.location} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Ngày thi</label>
                            <input name="date" type="date" required defaultValue={modalState.selected?.date} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-muted" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Giờ bắt đầu</label>
                            <input name="startTime" type="time" required defaultValue={modalState.selected?.startTime} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-muted" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium mb-2">Sức chứa</label>
                            <input name="capacity" type="number" placeholder="40" required defaultValue={modalState.selected?.capacity.split('/')[1]} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                        {modalState.edit && (
                             <div>
                                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                                <select name="status" required defaultValue={modalState.selected?.status} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                                    <option>Sắp diễn ra</option>
                                    <option>Đang diễn ra</option>
                                    <option>Đã kết thúc</option>
                                    <option>Đã hủy</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                        <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={modalState.view} onClose={() => setModalState({ ...modalState, view: false, selected: null })} title="Thông tin Lịch thi">
                 {modalState.selected && <div className="space-y-3 text-sm">
                    <p><strong className="w-24 inline-block">Mã kỳ thi:</strong> {modalState.selected.id}</p>
                    <p><strong className="w-24 inline-block">Tên kỳ thi:</strong> {modalState.selected.name}</p>
                    <p><strong className="w-24 inline-block">Môn học:</strong> {modalState.selected.subject}</p>
                    <p><strong className="w-24 inline-block">Ngày thi:</strong> {modalState.selected.date}</p>
                    <p><strong className="w-24 inline-block">Giờ bắt đầu:</strong> {modalState.selected.startTime}</p>
                    <p><strong className="w-24 inline-block">Địa điểm:</strong> {modalState.selected.location}</p>
                    <p><strong className="w-24 inline-block">Sĩ số:</strong> {modalState.selected.capacity}</p>
                    <p><strong className="w-24 inline-block">Trạng thái:</strong> <StatusBadge status={modalState.selected.status} /></p>
                </div>}
            </Modal>
            
             <Modal isOpen={modalState.delete} onClose={() => setModalState({ ...modalState, delete: false, selected: null })} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa kỳ thi <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name}</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteExam} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                 <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên hoặc mã kỳ thi..." 
                        className="w-full bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" 
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                 <button onClick={() => setModalState({ ...modalState, add: true })} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Thêm Lịch thi mới
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-light-bg-card dark:bg-dark-bg-card rounded-lg">
                <select 
                    className="bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm w-full sm:w-auto"
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Sắp diễn ra">Sắp diễn ra</option>
                    <option value="Đang diễn ra">Đang diễn ra</option>
                    <option value="Đã kết thúc">Đã kết thúc</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
                <select 
                    className="bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm w-full sm:w-auto"
                    value={subjectFilter}
                    onChange={e => { setSubjectFilter(e.target.value); setCurrentPage(1); }}
                >
                    <option value="all">Tất cả môn học</option>
                    {uniqueSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                </select>
                <input 
                    type="date" 
                    className="bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm w-full sm:w-auto text-light-text-muted dark:text-dark-text-muted" 
                    value={dateFilter}
                    onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
                />
                 <button
                    onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setSubjectFilter('all');
                        setDateFilter('');
                        setCurrentPage(1);
                    }}
                    className="flex items-center text-sm text-light-text-muted dark:text-dark-text-muted hover:text-primary-blue transition-colors"
                >
                    <XIcon className="w-4 h-4 mr-1" />
                    Xóa bộ lọc
                </button>
            </div>
            <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Tên kỳ thi</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Môn học</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Ngày thi</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Giờ bắt đầu</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Địa điểm</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Sĩ số</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Trạng thái</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedExams.map(exam => (
                            <tr key={exam.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4 font-medium">{exam.name}<p className="text-xs text-light-text-muted dark:text-dark-text-muted">{exam.id}</p></td>
                                <td className="p-4 text-sm">{exam.subject}</td>
                                <td className="p-4 text-sm">{exam.date}</td>
                                <td className="p-4 text-sm">{exam.startTime}</td>
                                <td className="p-4 text-sm">{exam.location}</td>
                                <td className="p-4 text-sm">{exam.capacity}</td>
                                <td className="p-4"><StatusBadge status={exam.status} /></td>
                                <td className="p-4">
                                     <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: exam })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: exam })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: exam })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    totalItems={filteredExams.length} 
                    itemsPerPage={ITEMS_PER_PAGE} />
            </div>
        </div>
    );
};

const ClassroomManagementPage: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Classroom | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });

    const filteredClassrooms = useMemo(() => {
        return classrooms.filter(classroom =>
            classroom.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classroom.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [classrooms, searchTerm]);

    const totalPages = Math.ceil(filteredClassrooms.length / ITEMS_PER_PAGE);

    const paginatedClassrooms = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredClassrooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredClassrooms, currentPage]);


    const handleAddClassroom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newClassroom: Classroom = {
            id: formData.get('id') as string,
            name: formData.get('name') as string,
            location: formData.get('location') as string,
            capacity: parseInt(formData.get('capacity') as string, 10),
            status: 'Sẵn sàng',
        };
        setClassrooms([newClassroom, ...classrooms]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateClassroom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!modalState.selected) return;
        const formData = new FormData(e.currentTarget);
        const updatedClassroom: Classroom = {
            ...modalState.selected,
            name: formData.get('name') as string,
            location: formData.get('location') as string,
            capacity: parseInt(formData.get('capacity') as string, 10),
            status: formData.get('status') as Classroom['status'],
        };
        setClassrooms(classrooms.map(c => c.id === updatedClassroom.id ? updatedClassroom : c));
        setModalState({ ...modalState, edit: false, selected: null });
    };

    const handleDeleteClassroom = () => {
        if (!modalState.selected) return;
        setClassrooms(classrooms.filter(c => c.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };

     return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Phòng học</h1>
            <Modal isOpen={modalState.add || modalState.edit} onClose={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} title={modalState.add ? "Thêm Phòng học Mới" : "Chỉnh sửa Phòng học"}>
                <form onSubmit={modalState.add ? handleAddClassroom : handleUpdateClassroom} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium mb-2">Mã phòng</label>
                            <input name="id" type="text" placeholder="P101" required defaultValue={modalState.selected?.id} readOnly={!!modalState.selected} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue read-only:bg-gray-200 dark:read-only:bg-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tên phòng</label>
                            <input name="name" type="text" placeholder="Phòng học A" required defaultValue={modalState.selected?.name} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Cơ sở</label>
                            <input name="location" type="text" placeholder="Cơ sở 1" required defaultValue={modalState.selected?.location} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Sức chứa</label>
                            <input name="capacity" type="number" placeholder="30" required defaultValue={modalState.selected?.capacity} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                    </div>
                    {modalState.edit && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Tình trạng</label>
                            <select name="status" required defaultValue={modalState.selected?.status} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                                <option>Sẵn sàng</option>
                                <option>Đang sử dụng</option>
                                <option>Đang bảo trì</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                        <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
                    </div>
                </form>
            </Modal>
            
             <Modal isOpen={modalState.view} onClose={() => setModalState({ ...modalState, view: false, selected: null })} title="Thông tin Phòng học">
                {modalState.selected && (
                    <div className="space-y-3 text-sm">
                        <p><strong className="w-24 inline-block">Mã phòng:</strong> {modalState.selected.id}</p>
                        <p><strong className="w-24 inline-block">Tên phòng:</strong> {modalState.selected.name}</p>
                        <p><strong className="w-24 inline-block">Cơ sở:</strong> {modalState.selected.location}</p>
                        <p><strong className="w-24 inline-block">Sức chứa:</strong> {modalState.selected.capacity}</p>
                        <p><strong className="w-24 inline-block">Tình trạng:</strong> <StatusBadge status={modalState.selected.status} /></p>
                    </div>
                )}
            </Modal>

             <Modal isOpen={modalState.delete} onClose={() => setModalState({ ...modalState, delete: false, selected: null })} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa phòng học <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name} ({modalState.selected?.id})</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteClassroom} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo mã, tên phòng hoặc cơ sở..." 
                        className="w-full bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" 
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <button className="flex items-center bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border font-semibold py-2 px-4 rounded-lg hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover transition-colors">
                        <FilterIcon className="w-5 h-5 mr-2" /> Lọc
                    </button>
                    <button onClick={() => setModalState({ ...modalState, add: true })} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm Phòng học
                    </button>
                </div>
            </div>
            <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                     <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 w-12"><input type="checkbox" className="bg-light-bg-card dark:bg-dark-bg-card border-light-border dark:border-dark-border rounded" /></th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Mã phòng</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Tên phòng</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Cơ sở</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Sức chứa</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Tình trạng</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành động</th>
                        </tr>
                    </thead>
                     <tbody>
                        {paginatedClassrooms.map(classroom => (
                            <tr key={classroom.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4"><input type="checkbox" className="bg-light-bg-card dark:bg-dark-bg-card border-light-border dark:border-dark-border rounded" /></td>
                                <td className="p-4 font-medium">{classroom.id}</td>
                                <td className="p-4 text-sm">{classroom.name}</td>
                                <td className="p-4 text-sm">{classroom.location}</td>
                                <td className="p-4 text-sm">{classroom.capacity}</td>
                                <td className="p-4"><StatusBadge status={classroom.status} /></td>
                                <td className="p-4">
                                     <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: classroom })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: classroom })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: classroom })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    totalItems={filteredClassrooms.length} 
                    itemsPerPage={ITEMS_PER_PAGE} />
            </div>
        </div>
    );
};

const TrainingFieldManagementPage: React.FC = () => {
    const [fields, setFields] = useState<TrainingField[]>(initialTrainingFields);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: TrainingField | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });
    
    const filteredFields = useMemo(() => {
        return fields.filter(field =>
            field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.id.toString().includes(searchTerm)
        );
    }, [fields, searchTerm]);

    const totalPages = Math.ceil(filteredFields.length / ITEMS_PER_PAGE);
    const paginatedFields = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredFields.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredFields, currentPage]);


    const handleAddTrainingField = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newField: TrainingField = {
            id: fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            creationDate: new Date().toISOString().split('T')[0],
        };
        setFields([newField, ...fields]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateTrainingField = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!modalState.selected) return;
        const formData = new FormData(e.currentTarget);
        const updatedField: TrainingField = {
            ...modalState.selected,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
        };
        setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
        setModalState({ ...modalState, edit: false, selected: null });
    };
    
    const handleDeleteTrainingField = () => {
        if (!modalState.selected) return;
        setFields(fields.filter(f => f.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Lĩnh vực Đào tạo</h1>
            <Modal isOpen={modalState.add || modalState.edit} onClose={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} title={modalState.add ? "Thêm Lĩnh vực Mới" : "Chỉnh sửa Lĩnh vực"}>
                <form onSubmit={modalState.add ? handleAddTrainingField : handleUpdateTrainingField} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tên Lĩnh vực</label>
                        <input name="name" type="text" placeholder="Lập Trình Web" required defaultValue={modalState.selected?.name} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <textarea name="description" placeholder="Các khóa học về..." required defaultValue={modalState.selected?.description} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue h-24"></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                        <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={modalState.view} onClose={() => setModalState({ ...modalState, view: false, selected: null })} title="Thông tin Lĩnh vực">
                {modalState.selected && (
                    <div className="space-y-3 text-sm">
                        <p><strong className="w-24 inline-block">ID:</strong> {modalState.selected.id}</p>
                        <p><strong className="w-24 inline-block">Tên lĩnh vực:</strong> {modalState.selected.name}</p>
                        <p><strong className="w-24 inline-block align-top">Mô tả:</strong> <span className="inline-block w-[calc(100%-7rem)]">{modalState.selected.description}</span></p>
                        <p><strong className="w-24 inline-block">Ngày tạo:</strong> {modalState.selected.creationDate}</p>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modalState.delete} onClose={() => setModalState({ ...modalState, delete: false, selected: null })} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa lĩnh vực <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name}</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteTrainingField} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên hoặc mã..." 
                        className="w-full bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setModalState({ ...modalState, add: true })} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm Mới
                    </button>
                </div>
            </div>
             <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Mã</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Tên Lĩnh vực</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted w-1/2">Mô tả Ngắn</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Ngày Tạo</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedFields.map(field => (
                            <tr key={field.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4">{field.id}</td>
                                <td className="p-4 font-medium">{field.name}</td>
                                <td className="p-4 text-sm">{field.description}</td>
                                <td className="p-4 text-sm">{field.creationDate}</td>
                                <td className="p-4">
                                    <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: field })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: field })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: field })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage}
                    totalItems={filteredFields.length} 
                    itemsPerPage={ITEMS_PER_PAGE} />
            </div>
        </div>
    );
};

const CandidateManagementPage: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [modalState, setModalState] = useState<{
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
      selected: Candidate | null;
    }>({ view: false, add: false, edit: false, delete: false, selected: null });

    const filteredCandidates = useMemo(() => {
        return candidates.filter(candidate =>
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [candidates, searchTerm]);
    
    const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
    const paginatedCandidates = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCandidates, currentPage]);

    const handleAddCandidate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCandidate: Candidate = {
            id: `TS${Date.now().toString().slice(-4)}`,
            name: formData.get('name') as string,
            dob: formData.get('dob') as string,
            registrationDate: formData.get('registrationDate') as string,
            profileStatus: 'Chờ duyệt',
            examResult: 'Chưa có',
        };
        setCandidates([newCandidate, ...candidates]);
        setModalState({ ...modalState, add: false });
    };

    const handleUpdateCandidate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!modalState.selected) return;
        const formData = new FormData(e.currentTarget);
        const updatedCandidate: Candidate = {
            ...modalState.selected,
            name: formData.get('name') as string,
            dob: formData.get('dob') as string,
            registrationDate: formData.get('registrationDate') as string,
            profileStatus: formData.get('profileStatus') as Candidate['profileStatus'],
            examResult: formData.get('examResult') as Candidate['examResult'],
        };
        setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
        setModalState({ ...modalState, edit: false, selected: null });
    };
    
    const handleDeleteCandidate = () => {
        if (!modalState.selected) return;
        setCandidates(candidates.filter(c => c.id !== modalState.selected!.id));
        setModalState({ ...modalState, delete: false, selected: null });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Thí sinh</h1>
            <p className="text-light-text-muted dark:text-dark-text-muted mb-6">Xem, tìm kiếm, và quản lý hồ sơ thí sinh</p>
            <Modal isOpen={modalState.add || modalState.edit} onClose={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} title={modalState.add ? "Thêm Thí sinh Mới" : "Chỉnh sửa Thí sinh"}>
                <form onSubmit={modalState.add ? handleAddCandidate : handleUpdateCandidate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Họ và Tên</label>
                            <input name="name" type="text" placeholder="Nguyễn Văn An" required defaultValue={modalState.selected?.name} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Ngày sinh</label>
                            <input name="dob" type="date" required defaultValue={modalState.selected?.dob} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-muted" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Ngày đăng ký</label>
                        <input name="registrationDate" type="date" required defaultValue={modalState.selected?.registrationDate} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-muted" />
                    </div>
                    {modalState.edit && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Trạng thái hồ sơ</label>
                                <select name="profileStatus" required defaultValue={modalState.selected?.profileStatus} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                                    <option>Chờ duyệt</option>
                                    <option>Đã duyệt</option>
                                    <option>Bị từ chối</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Kết quả thi</label>
                                <select name="examResult" required defaultValue={modalState.selected?.examResult} className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                                    <option>Chưa có</option>
                                    <option>Đạt</option>
                                    <option>Không đạt</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setModalState({ ...modalState, add: false, edit: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                        <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg">Lưu</button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={modalState.view} onClose={() => setModalState({ ...modalState, view: false, selected: null })} title="Thông tin Thí sinh">
                {modalState.selected && (
                    <div className="space-y-3 text-sm">
                        <p><strong className="w-32 inline-block">ID Thí sinh:</strong> {modalState.selected.id}</p>
                        <p><strong className="w-32 inline-block">Họ và Tên:</strong> {modalState.selected.name}</p>
                        <p><strong className="w-32 inline-block">Ngày sinh:</strong> {modalState.selected.dob}</p>
                        <p><strong className="w-32 inline-block">Ngày đăng ký:</strong> {modalState.selected.registrationDate}</p>
                        <p><strong className="w-32 inline-block">Trạng thái hồ sơ:</strong> <StatusBadge status={modalState.selected.profileStatus} /></p>
                        <p><strong className="w-32 inline-block">Kết quả thi:</strong> <StatusBadge status={modalState.selected.examResult} /></p>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modalState.delete} onClose={() => setModalState({ ...modalState, delete: false, selected: null })} title="Xác nhận Xóa" size="md">
                <p>Bạn có chắc chắn muốn xóa thí sinh <strong className="text-light-text-main dark:text-dark-text-main">{modalState.selected?.name}</strong>? Hành động này không thể hoàn tác.</p>
                 <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={() => setModalState({ ...modalState, delete: false, selected: null })} className="bg-light-bg-nav dark:bg-dark-bg-nav hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover px-6 py-2 rounded-lg">Hủy</button>
                    <button type="button" onClick={handleDeleteCandidate} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Xóa</button>
                </div>
            </Modal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Tổng số thí sinh" value="1,250" change="+5.2% so với tháng trước" changeUp={true} />
                <StatCard title="Hồ sơ chờ duyệt" value="82" change="+10% so với tuần trước" changeUp={true} />
                <StatCard title="Tỷ lệ đạt" value="85%" change="-1.5% so với kỳ trước" changeUp={false} />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên hoặc ID thí sinh..." 
                        className="w-full bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" 
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end w-full md:w-auto">
                    <select className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"><option>Trạng thái hồ sơ</option></select>
                    <select className="bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"><option>Kết quả thi</option></select>
                    <button className="flex items-center bg-light-bg-card dark:bg-dark-bg-card border border-light-border dark:border-dark-border font-semibold py-2 px-4 rounded-lg hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover transition-colors">
                        <DownloadIcon className="w-5 h-5 mr-2" /> Xuất Dữ liệu
                    </button>
                    <button onClick={() => setModalState({ ...modalState, add: true })} className="flex items-center bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm Thí Sinh Mới
                    </button>
                </div>
            </div>
             <div className="bg-light-bg-card dark:bg-dark-bg-card rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-light-bg-nav dark:bg-dark-bg-nav">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">ID Thí sinh</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Họ và Tên</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Ngày sinh</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Ngày đăng ký</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Trạng thái hồ sơ</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">Kết quả thi</th>
                            <th className="p-4 text-sm font-semibold text-light-text-muted dark:text-dark-text-muted text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCandidates.map(candidate => (
                            <tr key={candidate.id} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">
                                <td className="p-4 font-medium">{candidate.id}</td>
                                <td className="p-4 text-sm">{candidate.name}</td>
                                <td className="p-4 text-sm">{candidate.dob}</td>
                                <td className="p-4 text-sm">{candidate.registrationDate}</td>
                                <td className="p-4"><StatusBadge status={candidate.profileStatus} /></td>
                                <td className="p-4"><StatusBadge status={candidate.examResult} /></td>
                                <td className="p-4">
                                     <div className="flex justify-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                                        <button onClick={() => setModalState({ ...modalState, view: true, selected: candidate })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, edit: true, selected: candidate })} className="hover:text-light-text-main dark:hover:text-dark-text-main p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setModalState({ ...modalState, delete: true, selected: candidate })} className="hover:text-red-500 p-1 rounded-md hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    totalItems={filteredCandidates.length} 
                    itemsPerPage={ITEMS_PER_PAGE} />
            </div>
        </div>
    );
};

const ProfilePage: React.FC<{ profile: AdminProfile; onUpdate: (newProfile: AdminProfile) => void; }> = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState(profile);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (newAvatar: string | null) => {
        setFormData(prev => ({ ...prev, avatar: newAvatar || `https://i.pravatar.cc/150?u=${profile.id}` }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
        // Add a success notification/toast here in a real app
    };
    
    const handleCancel = () => {
        setFormData(profile);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">Chỉnh sửa Hồ sơ</h1>
            <p className="text-light-text-muted dark:text-dark-text-muted mt-1 mb-8">Cập nhật thông tin cá nhân của bạn.</p>
            
            <div className="max-w-4xl mx-auto bg-light-bg-card dark:bg-dark-bg-card p-8 rounded-lg shadow-md">
                <form onSubmit={handleSave}>
                    <div className="flex flex-col md:flex-row items-center gap-8 border-b border-light-border dark:border-dark-border pb-8 mb-8">
                        <div className="relative">
                            <img src={formData.avatar} alt="Profile Avatar" className="w-32 h-32 rounded-full object-cover ring-4 ring-offset-2 ring-offset-light-bg-card dark:ring-offset-dark-bg-card ring-primary-blue" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <label htmlFor="avatar-upload-button" className="inline-block bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-2 px-5 rounded-lg transition-colors cursor-pointer">
                                Tải ảnh lên
                            </label>
                            <input id="avatar-upload-button" type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => handleAvatarChange(reader.result as string);
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }} />
                            <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-2">Cho phép PNG hoặc JPG. Kích thước tối đa 5MB.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Họ và tên</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                            <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Ngày tháng năm sinh</label>
                            <input name="dob" value={formData.dob} onChange={handleInputChange} type="date" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-blue text-light-text-muted dark:text-dark-text-main" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Số ID</label>
                            <input name="id" value={formData.id} readOnly type="text" className="w-full bg-light-bg-nav dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-2.5 focus:outline-none text-light-text-muted dark:text-dark-text-muted cursor-not-allowed" />
                        </div>
                    </div>
                     <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-light-border dark:border-dark-border">
                        <button type="button" onClick={handleCancel} className="bg-light-bg-nav dark:bg-dark-bg-nav-hover font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-bg-nav-hover/80">Hủy</button>
                        <button type="submit" className="bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold px-8 py-2 rounded-lg">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// AUTH PAGES
const LoginPage: React.FC<{ setPage: (page: Page) => void, setIsAuthenticated: (auth: boolean) => void }> = ({ setPage, setIsAuthenticated }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticated(true);
        setPage('Dashboard');
    };
    
    return (
        <div className="min-h-screen bg-light-bg-main dark:bg-dark-bg-main flex items-center justify-center p-4">
            <div className="flex w-full max-w-5xl bg-light-bg-card dark:bg-dark-bg-card rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-1/2 relative overflow-hidden hidden md:block">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 opacity-80"></div>
                     <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-full object-cover" alt="background"/>
                     <div className="absolute inset-0 flex flex-col justify-end p-12">
                         <h2 className="text-white text-4xl font-bold mb-4">EduCenter</h2>
                         <p className="text-gray-300">Nền tảng quản lý đào tạo toàn diện.</p>
                     </div>
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại</h1>
                    <p className="text-light-text-muted dark:text-dark-text-muted mb-8">Nền tảng quản lý đào tạo toàn diện.</p>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">Email hoặc tên đăng nhập</label>
                            <input id="email" type="email" placeholder="Nhập email của bạn" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                        <div className="mb-4 relative">
                             <label className="block text-sm font-medium mb-2" htmlFor="password">Mật khẩu</label>
                            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu của bạn" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-light-text-muted dark:text-dark-text-muted">
                                {showPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                        <div className="text-right mb-6">
                            <a href="#" className="text-sm text-primary-blue hover:underline">Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            Đăng nhập
                        </button>
                    </form>

                     <div className="flex items-center my-6">
                        <hr className="w-full border-light-border dark:border-dark-border" />
                        <span className="px-4 text-xs text-light-text-muted dark:text-dark-text-muted">Hoặc tiếp tục với</span>
                        <hr className="w-full border-light-border dark:border-dark-border" />
                    </div>

                    <div className="flex space-x-4">
                        <button className="w-full flex justify-center items-center bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border py-3 rounded-lg hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">Google</button>
                        <button className="w-full flex justify-center items-center bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border py-3 rounded-lg hover:bg-light-bg-nav dark:hover:bg-dark-bg-nav-hover">Microsoft</button>
                    </div>
                     <p className="text-center text-sm text-light-text-muted dark:text-dark-text-muted mt-8">
                        Chưa có tài khoản? <a href="#" onClick={(e) => {e.preventDefault(); setPage('Signup')}} className="font-semibold text-primary-blue hover:underline">Đăng ký ngay</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

const SignupPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <div className="min-h-screen bg-light-bg-main dark:bg-dark-bg-main flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-light-bg-card dark:bg-dark-bg-card rounded-2xl shadow-2xl p-8 md:p-12">
                <div className="text-center">
                    <GraduationCapIcon className="h-12 w-12 text-primary-blue mx-auto mb-4"/>
                    <h1 className="text-3xl font-bold mb-2">Tạo tài khoản mới</h1>
                    <p className="text-light-text-muted dark:text-dark-text-muted mb-8">Bắt đầu quản lý trung tâm của bạn một cách hiệu quả.</p>
                </div>
                <form onSubmit={e => {e.preventDefault(); setPage('EmailVerification')}}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Họ và tên</label>
                            <input type="text" placeholder="Nhập họ và tên" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                            <input type="tel" placeholder="Nhập số điện thoại" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="flex">
                            <input type="email" placeholder="Nhập địa chỉ email" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                            <button type="button" className="bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold py-3 px-4 rounded-r-lg">Gửi mã</button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Mã xác minh Email</label>
                        <input type="text" placeholder="Nhập mã xác minh" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                            <input type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-light-text-muted dark:text-dark-text-muted">{showPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}</button>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">Xác nhận Mật khẩu</label>
                            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" className="w-full bg-light-bg-main dark:bg-dark-bg-main border border-light-border dark:border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-10 text-light-text-muted dark:text-dark-text-muted">{showConfirmPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}</button>
                        </div>
                    </div>
                     <div className="flex items-center mt-6">
                        <input type="checkbox" id="terms" className="w-4 h-4 text-primary-blue bg-light-bg-main dark:bg-dark-bg-main border-light-border dark:border-dark-border rounded focus:ring-primary-blue" />
                        <label htmlFor="terms" className="ml-2 text-sm text-light-text-muted dark:text-dark-text-muted">Tôi đồng ý với các <a href="#" className="text-primary-blue hover:underline">Điều khoản và Điều kiện</a>.</label>
                    </div>
                    <button type="submit" className="w-full mt-8 bg-primary-blue hover:bg-primary-blue-hover text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Đăng ký
                    </button>
                </form>
                <p className="text-center text-sm text-light-text-muted dark:text-dark-text-muted mt-8">
                    Bạn đã có tài khoản? <a href="#" onClick={(e) => {e.preventDefault(); setPage('Login')}} className="font-semibold text-primary-blue hover:underline">Đăng nhập ngay</a>
                </p>
            </div>
        </div>
    );
};

const EmailVerificationPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    return (
        <div className="min-h-screen bg-light-bg-main dark:bg-dark-bg-main flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-light-bg-card dark:bg-dark-bg-card rounded-2xl shadow-2xl p-12 text-center">
                 <div className="w-20 h-20 bg-primary-blue/20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Kiểm tra Email của bạn</h1>
                <p className="text-light-text-muted dark:text-dark-text-muted mb-8">Chúng tôi đã gửi một email xác minh đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) để hoàn tất đăng ký.</p>
                <button onClick={() => alert("Email sent!")} className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4">
                    Gửi lại Email
                </button>
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('Signup'); }} className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-main dark:hover:text-dark-text-main">Quay lại trang Đăng ký</a>
            </div>
        </div>
    );
}

// MAIN APP COMPONENT
const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<Page>('Login');
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'dark'; // Default to dark theme
    });
    
    const [adminProfile, setAdminProfile] = useState<AdminProfile>({
        id: 'ADMIN-001',
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?u=admin-nguyenvana',
        email: 'admin.nguyenvana@example.com',
        phone: '0987654321',
        dob: '1990-01-01',
        role: 'Quản trị viên'
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);


    const handleNavigate = useCallback((page: Page) => {
        if (page === 'Logout') {
            setIsAuthenticated(false);
            setCurrentPage('Login');
        } else {
            setCurrentPage(page);
        }
    }, []);
    
    const renderPage = () => {
        // Unauthenticated pages
        if (!isAuthenticated) {
            switch (currentPage) {
                case 'Signup':
                    return <SignupPage setPage={handleNavigate} />;
                case 'EmailVerification':
                    return <EmailVerificationPage setPage={handleNavigate} />;
                case 'Login':
                default:
                    return <LoginPage setPage={handleNavigate} setIsAuthenticated={setIsAuthenticated} />;
            }
        }
        
        // Authenticated pages
        let pageComponent: React.ReactNode;
        switch (currentPage) {
            case 'Dashboard':
                pageComponent = <DashboardPage theme={theme} />;
                break;
            case 'StudentManagement':
                pageComponent = <StudentManagementPage />;
                break;
            case 'InstructorManagement':
                pageComponent = <InstructorManagementPage />;
                break;
            case 'CourseManagement':
                pageComponent = <CourseManagementPage />;
                break;
            case 'FinancialManagement':
                pageComponent = <FinancialManagementPage />;
                break;
            case 'StaffManagement':
                pageComponent = <StaffManagementPage />;
                break;
            case 'ExamScheduleManagement':
                pageComponent = <ExamScheduleManagementPage />;
                break;
            case 'ClassroomManagement':
                pageComponent = <ClassroomManagementPage />;
                break;
            case 'TrainingFieldManagement':
                pageComponent = <TrainingFieldManagementPage />;
                break;
            case 'CandidateManagement':
                pageComponent = <CandidateManagementPage />;
                break;
            case 'Profile':
                pageComponent = <ProfilePage profile={adminProfile} onUpdate={setAdminProfile} />;
                break;
            case 'Reports':
                 pageComponent = <div className="text-center text-2xl mt-20">Trang Báo cáo đang được xây dựng...</div>;
                break;
            case 'Settings':
                pageComponent = <div className="text-center text-2xl mt-20">Trang Cài đặt đang được xây dựng...</div>;
                break;
            default:
                pageComponent = <DashboardPage theme={theme} />;
        }
        return (
             <AppLayout activePage={currentPage} onNavigate={handleNavigate} theme={theme} setTheme={setTheme} adminProfile={adminProfile}>
                {pageComponent}
            </AppLayout>
        );
    };

    return <>{renderPage()}</>;
};

export default App;