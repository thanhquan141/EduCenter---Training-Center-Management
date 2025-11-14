
export type Page = 
  | 'Login' 
  | 'Signup'
  | 'EmailVerification'
  | 'Dashboard' 
  | 'StudentManagement'
  | 'InstructorManagement'
  | 'CourseManagement'
  | 'FinancialManagement'
  | 'StaffManagement'
  | 'ExamScheduleManagement'
  | 'ClassroomManagement'
  | 'TrainingFieldManagement'
  | 'CandidateManagement'
  | 'Profile'
  | 'Reports'
  | 'Settings'
  | 'Logout';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  course: string;
  avgScore: number;
  status: 'Đang học' | 'Hoàn thành' | 'Tạm dừng';
  enrollDate: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  major: string;
  email: string;
  status: 'Hoạt động' | 'Không hoạt động';
}

export interface Course {
  name: string;
  code: string;
  instructor: string;
  students: {
    enrolled: number;
    capacity: number;
  };
  status: 'Ongoing' | 'Upcoming' | 'Finished';
  schedule: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    person: string;
    type: 'Thu' | 'Chi';
    amount: number;
}

export interface Staff {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  status: 'Đang làm việc' | 'Tạm nghỉ' | 'Đã nghỉ';
  joinDate: string;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  startTime: string;
  location: string;
  capacity: string;
  status: 'Sắp diễn ra' | 'Đang diễn ra' | 'Đã kết thúc' | 'Đã hủy';
}

export interface Classroom {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: 'Sẵn sàng' | 'Đang sử dụng' | 'Đang bảo trì';
}

export interface TrainingField {
  id: number;
  name: string;
  description: string;
  creationDate: string;
}

export interface Candidate {
  id: string;
  name:string;
  dob: string;
  registrationDate: string;
  profileStatus: 'Đã duyệt' | 'Chờ duyệt' | 'Bị từ chối';
  examResult: 'Đạt' | 'Không đạt' | 'Chưa có';
}

export interface AdminProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  dob: string;
  role: string;
}
