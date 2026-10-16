import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const instituteSchema = z.object({
  name: z.string().min(1, "Institute name is required"),
  registration_number: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  billing_cut_off_day: z.number().min(1).max(28).default(10),
});

export const teacherSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  nic: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
});

export const studentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().optional(),
  school: z.string().optional(),
  guardian_name: z.string().min(1, "Guardian name is required"),
  guardian_phone: z.string().min(1, "Guardian phone is required"),
  guardian_whatsapp: z.string().optional(),
  class_ids: z.array(z.string()).min(1, "At least one class is required"),
});

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  subject_id: z.string().min(1, "Subject is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
  grade: z.string().optional(),
  medium: z.enum(["sinhala", "english"]).default("sinhala"),
  day_of_week: z.string().min(1, "Day is required"),
  time_slot: z.string().min(1, "Time slot is required"),
  hall: z.string().optional(),
  monthly_fee: z.number().min(0, "Fee must be positive"),
});

export const feeChargeSchema = z.object({
  student_id: z.string().min(1),
  class_id: z.string().min(1),
  amount: z.number().min(0),
  discount: z.number().min(0).default(0),
  discount_type: z.enum(["percentage", "fixed"]).default("fixed"),
  discount_reason: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"),
  billing_period: z.string().min(1, "Billing period is required"),
});

export const paymentSchema = z.object({
  student_id: z.string().min(1),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  payment_method: z.enum(["cash", "bank_transfer", "card", "mobile_wallet", "online"]),
  reference_number: z.string().optional(),
  allocations: z.array(z.object({
    fee_charge_id: z.string(),
    amount: z.number().min(0),
  })).optional(),
});

export const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  class_id: z.string().optional(),
  teacher_id: z.string().optional(),
});

export const examSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  class_id: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  total_marks: z.number().min(1, "Total marks required"),
  passing_marks: z.number().min(1, "Passing marks required"),
});
