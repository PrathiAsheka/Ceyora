import {
  DollarSign,
  Receipt,
  CreditCard,
  Smartphone,
  Users,
  PieChart,
  GraduationCap,
  Award,
  BookOpen,
  BarChart3,
  QrCode,
  Sliders,
  Building2,
  Shield,
  Globe,
} from "lucide-react";
import { SubNavItem } from "@/components/layout/module-sub-nav";

export const financeNavItems: SubNavItem[] = [
  { title: "Waterfall Overview", href: "/finance", icon: DollarSign },
  { title: "Fee Charges", href: "/finance/charges", icon: Receipt },
  { title: "Payment Receipts", href: "/finance/payments", icon: CreditCard },
  { title: "Arrears & WhatsApp", href: "/finance/outstanding", icon: Smartphone, badge: 14 },
  { title: "Faculty Payouts", href: "/finance/teacher-payments", icon: Users },
  { title: "Expenses", href: "/finance/expenses", icon: PieChart },
];

export const academicNavItems: SubNavItem[] = [
  { title: "Curriculum Analytics", href: "/academic", icon: GraduationCap },
  { title: "Term Evaluations & Rankings", href: "/academic/exams", icon: Award },
  { title: "Topic Diagnostics", href: "/academic/topics", icon: BookOpen },
];

export const attendanceNavItems: SubNavItem[] = [
  { title: "Attendance Analytics", href: "/attendance", icon: BarChart3 },
  { title: "Turnstile Gate Scanner", href: "/attendance/scan", icon: QrCode },
];

export const settingsNavItems: SubNavItem[] = [
  { title: "Settings Hub", href: "/settings", icon: Sliders },
  { title: "Institute Profile", href: "/settings/institute", icon: Building2 },
  { title: "Fee Tariffs & Splits", href: "/settings/fees", icon: DollarSign },
  { title: "4-Tier RBAC Matrix", href: "/settings/rbac", icon: Shield },
  { title: "Subjects", href: "/settings/subjects", icon: BookOpen },
  { title: "Language & Regional", href: "/settings/language", icon: Globe },
];
