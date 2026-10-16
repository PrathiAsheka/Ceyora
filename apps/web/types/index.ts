export interface User {
  id: string;
  email: string;
  role: "super_admin" | "institute_admin" | "teacher" | "staff";
  institute_id?: string;
  first_name: string;
  last_name: string;
}

export interface Institute {
  id: string;
  name: string;
  registration_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo_url?: string;
  billing_cut_off_day: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  institute_id: string;
  first_name: string;
  last_name: string;
  nic?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  subjects: string[];
  compensation_type: "percentage" | "flat_student" | "hourly_rate";
  compensation_value: number;
  bank_name?: string;
  bank_account?: string;
  created_at: string;
}

export interface Student {
  id: string;
  institute_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  school?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_whatsapp?: string;
  qr_code: string;
  enrollments: Enrollment[];
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrolled_at: string;
  status: "active" | "inactive" | "transferred";
}

export interface Class {
  id: string;
  institute_id: string;
  name: string;
  subject_id: string;
  teacher_id: string;
  grade?: string;
  medium: "sinhala" | "english";
  day_of_week: string;
  time_slot: string;
  hall?: string;
  monthly_fee: number;
  student_count: number;
  created_at: string;
}

export interface Subject {
  id: string;
  institute_id: string;
  name: string;
  code?: string;
}

export interface FeeCharge {
  id: string;
  student_id: string;
  class_id: string;
  amount: number;
  discount: number;
  discount_type: "percentage" | "fixed";
  discount_reason?: string;
  net_amount: number;
  due_date: string;
  billing_period: string;
  status: "pending" | "partial" | "paid" | "overdue";
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_method: "cash" | "bank_transfer" | "card" | "mobile_wallet" | "online";
  reference_number?: string;
  allocations: PaymentAllocation[];
  created_at: string;
}

export interface PaymentAllocation {
  id: string;
  payment_id: string;
  fee_charge_id: string;
  amount: number;
}

export interface Expense {
  id: string;
  institute_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  class_id?: string;
  teacher_id?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  marked_by: "qr_scan" | "manual";
  created_at: string;
}

export interface Exam {
  id: string;
  institute_id: string;
  name: string;
  class_id: string;
  date: string;
  total_marks: number;
  passing_marks: number;
  created_at: string;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks: number;
  grade?: string;
  created_at: string;
}

export interface Topic {
  id: string;
  institute_id: string;
  name: string;
  subject_id: string;
}

export interface TopicResult {
  id: string;
  exam_result_id: string;
  topic_id: string;
  marks: number;
}

export interface SupportTicket {
  id: string;
  institute_id: string;
  user_id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
