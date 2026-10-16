export interface InstituteData {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  branchesCount: number;
  activeStudents: number;
  activeClasses: number;
  monthlyRevenue: number;
  billingCutOffDay: number;
  gatewayStatus: "active" | "testing" | "inactive";
  currency: string;
  status: "active" | "suspended";
}

export interface TeacherData {
  id: string;
  name: string;
  title: string;
  nic: string;
  phone: string;
  whatsapp: string;
  email: string;
  subjects: string[];
  assignedClassIds: string[];
  compensationType: "percentage" | "flat_student" | "hourly_rate";
  compensationValue: number;
  bankName: string;
  bankAccount: string;
  totalStudents: number;
  monthlyPayout: number;
  passRate: number;
  retentionRate: number;
}

export interface ClassData {
  id: string;
  name: string;
  code: string;
  subject: string;
  teacherId: string;
  instituteId: string;
  grade: string;
  medium: "Sinhala" | "English" | "Bilingual";
  dayOfWeek: string;
  timeSlot: string;
  hall: string;
  monthlyFee: number;
  enrolledStudentsCount: number;
  presentLastClass: number;
  monthlyCollection: number;
  teacherSharePercentage: number;
  instituteSharePercentage: number;
  hallChargesDeduction: number;
  status: "active" | "concluded";
}

export interface StudentData {
  id: string;
  studentId: string;
  name: string;
  gender: "Male" | "Female";
  dob: string;
  school: string;
  grade: string;
  guardianName: string;
  guardianPhone: string;
  guardianWhatsapp: string;
  instituteId: string;
  enrolledClassIds: string[];
  qrCodeUrl: string;
  concessionType: "none" | "sibling_15" | "sibling_25" | "scholarship_half" | "scholarship_full";
  paymentStatus: "paid" | "pending" | "overdue";
  balance: number;
  attendanceRate: number;
  averageMarks: number;
  recentRank: number;
  status: "active" | "at_risk" | "inactive";
}

export interface FeeChargeData {
  id: string;
  studentId: string;
  classId: string;
  billingMonth: string;
  baseAmount: number;
  discountAmount: number;
  discountReason?: string;
  netAmount: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
  daysOverdue?: number;
}

export interface PaymentRecordData {
  id: string;
  receiptNumber: string;
  studentId: string;
  chargeId: string;
  amount: number;
  paymentMethod: "cash" | "payhere_online" | "bank_transfer" | "frimi";
  referenceNumber: string;
  collectedBy: string;
  timestamp: string;
  status: "verified" | "reversed";
}

export interface ExamData {
  id: string;
  classId: string;
  name: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
  topicsCovered: string[];
}

export interface TopicDiagnosticData {
  id: string;
  subject: string;
  topicName: string;
  grade: string;
  masteryPercentage: number;
  weakStudentCount: number;
  status: "critical" | "warning" | "mastered";
  recommendation: string;
}

export interface RecommendationData {
  id: string;
  title: string;
  category: "finance" | "attendance" | "academic" | "retention";
  priority: "urgent" | "high" | "medium";
  issue: string;
  evidence: string;
  recommendedAction: string;
  affectedCount: number;
  affectedLabel: string;
  followUpStatus: "pending" | "in_progress" | "resolved";
}

export interface SupportTicketData {
  id: string;
  ticketNumber: string;
  instituteId: string;
  senderName: string;
  senderRole: string;
  subject: string;
  category: "billing" | "qr_hardware" | "attendance_sync" | "feature_request" | "payhere" | "academic";
  priority: "urgent" | "high" | "medium" | "normal";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  messagesCount: number;
}

/* =====================================================================
   RELATIONAL DATA STORE
   ===================================================================== */

export const mockInstitutes: InstituteData[] = [
  {
    id: "inst-1",
    name: "Apex Higher Education Institute - Colombo 07",
    code: "APEX-CMB",
    city: "Colombo",
    address: "No. 45, Reid Avenue, Colombo 07",
    phone: "+94 11 258 9900",
    email: "colombo@apexedu.lk",
    branchesCount: 3,
    activeStudents: 1284,
    activeClasses: 28,
    monthlyRevenue: 3845000,
    billingCutOffDay: 10,
    gatewayStatus: "active",
    currency: "LKR",
    status: "active",
  },
  {
    id: "inst-2",
    name: "Apex Science Academy - Kandy City",
    code: "APEX-KDY",
    city: "Kandy",
    address: "No. 12, William Gopallawa Mawatha, Kandy",
    phone: "+94 81 223 4455",
    email: "kandy@apexedu.lk",
    branchesCount: 1,
    activeStudents: 890,
    activeClasses: 18,
    monthlyRevenue: 2450000,
    billingCutOffDay: 10,
    gatewayStatus: "active",
    currency: "LKR",
    status: "active",
  },
  {
    id: "inst-3",
    name: "Apex Study Center - Galle Fort",
    code: "APEX-GLE",
    city: "Galle",
    address: "No. 78, Matara Road, Galle",
    phone: "+94 91 224 8822",
    email: "galle@apexedu.lk",
    branchesCount: 1,
    activeStudents: 620,
    activeClasses: 12,
    monthlyRevenue: 1680000,
    billingCutOffDay: 12,
    gatewayStatus: "testing",
    currency: "LKR",
    status: "active",
  },
];

export const mockTeachers: TeacherData[] = [
  {
    id: "tea-1",
    name: "Eng. Dilantha Fernando",
    title: "Senior Lecturer in Mathematics (B.Sc. Eng Hons, Moratuwa)",
    nic: "821450912V",
    phone: "+94 77 712 3456",
    whatsapp: "+94 77 712 3456",
    email: "dilantha.maths@gmail.com",
    subjects: ["Combined Mathematics"],
    assignedClassIds: ["cls-1", "cls-4"],
    compensationType: "percentage",
    compensationValue: 80, // 80% to teacher, 20% to institute
    bankName: "Commercial Bank PLC",
    bankAccount: "8004129931 (Bambalapitiya)",
    totalStudents: 410,
    monthlyPayout: 1480000,
    passRate: 94.2,
    retentionRate: 96.5,
  },
  {
    id: "tea-2",
    name: "Prof. Anura Weerasinghe",
    title: "Department of Physics (Ph.D, M.Sc, Colombo)",
    nic: "763290145V",
    phone: "+94 71 456 7890",
    whatsapp: "+94 71 456 7890",
    email: "anura.physics@gmail.com",
    subjects: ["Physics"],
    assignedClassIds: ["cls-2"],
    compensationType: "percentage",
    compensationValue: 80,
    bankName: "Bank of Ceylon",
    bankAccount: "0078912345 (Torrington)",
    totalStudents: 185,
    monthlyPayout: 666000,
    passRate: 91.8,
    retentionRate: 93.0,
  },
  {
    id: "tea-3",
    name: "Dr. Nimal Siriwardena",
    title: "Senior Consultant in Chemistry (MBBS, Chemistry Researcher)",
    nic: "841920834V",
    phone: "+94 76 890 1234",
    whatsapp: "+94 76 890 1234",
    email: "drnimal.chem@gmail.com",
    subjects: ["Chemistry"],
    assignedClassIds: ["cls-3"],
    compensationType: "flat_student",
    compensationValue: 2400, // LKR 2400 per student
    bankName: "Sampath Bank PLC",
    bankAccount: "1002345678 (Kollupitiya)",
    totalStudents: 160,
    monthlyPayout: 384000,
    passRate: 88.5,
    retentionRate: 90.2,
  },
  {
    id: "tea-4",
    name: "Ms. Rashmi Jayathilake",
    title: "Secondary Education Lead (B.Ed, University of Colombo)",
    nic: "905670123V",
    phone: "+94 78 333 4455",
    whatsapp: "+94 78 333 4455",
    email: "rashmi.edu@gmail.com",
    subjects: ["O/L Mathematics", "Science"],
    assignedClassIds: ["cls-5"],
    compensationType: "hourly_rate",
    compensationValue: 3500, // LKR 3500 per hour
    bankName: "Hatton National Bank",
    bankAccount: "0456123489 (Wellawatte)",
    totalStudents: 95,
    monthlyPayout: 112000,
    passRate: 95.0,
    retentionRate: 97.4,
  },
];

export const mockClasses: ClassData[] = [
  {
    id: "cls-1",
    name: "A/L Combined Mathematics 2026 (Theory)",
    code: "CMATH-2026-T",
    subject: "Combined Mathematics",
    teacherId: "tea-1",
    instituteId: "inst-1",
    grade: "Grade 12 (2026 A/L)",
    medium: "Sinhala",
    dayOfWeek: "Saturday",
    timeSlot: "08:30 AM - 01:00 PM",
    hall: "Auditorium A (Smart Wing)",
    monthlyFee: 4500,
    enrolledStudentsCount: 220,
    presentLastClass: 208,
    monthlyCollection: 954000,
    teacherSharePercentage: 80,
    instituteSharePercentage: 20,
    hallChargesDeduction: 15000,
    status: "active",
  },
  {
    id: "cls-2",
    name: "A/L Physics 2025 (Revision & Paper Class)",
    code: "PHY-2025-R",
    subject: "Physics",
    teacherId: "tea-2",
    instituteId: "inst-1",
    grade: "Grade 13 (2025 A/L)",
    medium: "Sinhala",
    dayOfWeek: "Sunday",
    timeSlot: "08:00 AM - 01:00 PM",
    hall: "Auditorium B (Science Wing)",
    monthlyFee: 4500,
    enrolledStudentsCount: 185,
    presentLastClass: 176,
    monthlyCollection: 792000,
    teacherSharePercentage: 80,
    instituteSharePercentage: 20,
    hallChargesDeduction: 12000,
    status: "active",
  },
  {
    id: "cls-3",
    name: "A/L Chemistry 2026 (Theory & Practical)",
    code: "CHEM-2026-T",
    subject: "Chemistry",
    teacherId: "tea-3",
    instituteId: "inst-1",
    grade: "Grade 12 (2026 A/L)",
    medium: "Sinhala",
    dayOfWeek: "Saturday",
    timeSlot: "01:30 PM - 05:30 PM",
    hall: "Auditorium B (Science Wing)",
    monthlyFee: 4200,
    enrolledStudentsCount: 160,
    presentLastClass: 151,
    monthlyCollection: 642000,
    teacherSharePercentage: 75,
    instituteSharePercentage: 25,
    hallChargesDeduction: 10000,
    status: "active",
  },
  {
    id: "cls-4",
    name: "A/L Combined Mathematics 2025 (Revision)",
    code: "CMATH-2025-R",
    subject: "Combined Mathematics",
    teacherId: "tea-1",
    instituteId: "inst-1",
    grade: "Grade 13 (2025 A/L)",
    medium: "Sinhala",
    dayOfWeek: "Sunday",
    timeSlot: "01:30 PM - 06:00 PM",
    hall: "Auditorium A (Smart Wing)",
    monthlyFee: 5000,
    enrolledStudentsCount: 190,
    presentLastClass: 182,
    monthlyCollection: 910000,
    teacherSharePercentage: 80,
    instituteSharePercentage: 20,
    hallChargesDeduction: 15000,
    status: "active",
  },
  {
    id: "cls-5",
    name: "O/L Mathematics Masterclass (English Medium)",
    code: "MATH-OL-EM",
    subject: "O/L Mathematics",
    teacherId: "tea-4",
    instituteId: "inst-1",
    grade: "Grade 11 (2026 O/L)",
    medium: "English",
    dayOfWeek: "Wednesday",
    timeSlot: "04:00 PM - 07:00 PM",
    hall: "Junior Hall C",
    monthlyFee: 3200,
    enrolledStudentsCount: 95,
    presentLastClass: 91,
    monthlyCollection: 288000,
    teacherSharePercentage: 70,
    instituteSharePercentage: 30,
    hallChargesDeduction: 6000,
    status: "active",
  },
];

export const mockStudents: StudentData[] = [
  {
    id: "s1",
    studentId: "STU-0421",
    name: "Kavindu Perera",
    gender: "Male",
    dob: "2008-04-12",
    school: "Royal College, Colombo",
    grade: "Grade 12",
    guardianName: "Sunil Perera",
    guardianPhone: "+94 77 123 4567",
    guardianWhatsapp: "+94 77 123 4567",
    instituteId: "inst-1",
    enrolledClassIds: ["cls-1", "cls-3"],
    qrCodeUrl: "QR_STU_0421",
    concessionType: "none",
    paymentStatus: "overdue",
    balance: 4500,
    attendanceRate: 94,
    averageMarks: 76.5,
    recentRank: 14,
    status: "active",
  },
  {
    id: "s2",
    studentId: "STU-0389",
    name: "Minoli Senanayake",
    gender: "Female",
    dob: "2007-09-24",
    school: "Visakha Vidyalaya, Colombo",
    grade: "Grade 13",
    guardianName: "Kamal Senanayake",
    guardianPhone: "+94 71 987 6543",
    guardianWhatsapp: "+94 71 987 6543",
    instituteId: "inst-1",
    enrolledClassIds: ["cls-2", "cls-4"],
    qrCodeUrl: "QR_STU_0389",
    concessionType: "sibling_15",
    paymentStatus: "paid",
    balance: 0,
    attendanceRate: 88,
    averageMarks: 84.0,
    recentRank: 6,
    status: "active",
  },
  {
    id: "s3",
    studentId: "STU-0512",
    name: "Dinuka Rajapaksha",
    gender: "Male",
    dob: "2008-01-18",
    school: "Ananda College, Colombo",
    grade: "Grade 12",
    guardianName: "Nihal Rajapaksha",
    guardianPhone: "+94 76 555 1212",
    guardianWhatsapp: "+94 76 555 1212",
    instituteId: "inst-1",
    enrolledClassIds: ["cls-1", "cls-3"],
    qrCodeUrl: "QR_STU_0512",
    concessionType: "none",
    paymentStatus: "paid",
    balance: 0,
    attendanceRate: 96,
    averageMarks: 89.2,
    recentRank: 2,
    status: "active",
  },
  {
    id: "s4",
    studentId: "STU-0294",
    name: "Tharushi Fernando",
    gender: "Female",
    dob: "2009-11-05",
    school: "Devi Balika Vidyalaya",
    grade: "Grade 11",
    guardianName: "Malini Fernando",
    guardianPhone: "+94 78 444 3322",
    guardianWhatsapp: "+94 78 444 3322",
    instituteId: "inst-1",
    enrolledClassIds: ["cls-5"],
    qrCodeUrl: "QR_STU_0294",
    concessionType: "none",
    paymentStatus: "pending",
    balance: 3200,
    attendanceRate: 71,
    averageMarks: 52.0,
    recentRank: 42,
    status: "at_risk",
  },
  {
    id: "s5",
    studentId: "STU-0601",
    name: "Ashen Wickramasinghe",
    gender: "Male",
    dob: "2007-06-30",
    school: "Nalanda College, Colombo",
    grade: "Grade 13",
    guardianName: "Bandula Wickramasinghe",
    guardianPhone: "+94 75 888 9900",
    guardianWhatsapp: "+94 75 888 9900",
    instituteId: "inst-1",
    enrolledClassIds: ["cls-2", "cls-4"],
    qrCodeUrl: "QR_STU_0601",
    concessionType: "scholarship_half", // 50% concession sanctioned by teacher
    paymentStatus: "paid",
    balance: 0,
    attendanceRate: 91,
    averageMarks: 74.8,
    recentRank: 18,
    status: "active",
  },
  {
    id: "s6",
    studentId: "STU-0744",
    name: "Sachini Dissanayake",
    gender: "Female",
    dob: "2008-08-14",
    school: "Sirimavo Bandaranaike Vidyalaya",
    grade: "Grade 12",
    guardianName: "Gamini Dissanayake",
    guardianPhone: "+94 77 444 8811",
    guardianWhatsapp: "+94 77 444 8811",
    instituteId: "inst-1",
    enrolledClassIds: ["cls-1", "cls-3"],
    qrCodeUrl: "QR_STU_0744",
    concessionType: "none",
    paymentStatus: "paid",
    balance: 0,
    attendanceRate: 98,
    averageMarks: 94.5,
    recentRank: 1,
    status: "active",
  },
];

export const mockFeeCharges: FeeChargeData[] = [
  {
    id: "chg-1",
    studentId: "s1",
    classId: "cls-1",
    billingMonth: "October 2026",
    baseAmount: 4500,
    discountAmount: 0,
    netAmount: 4500,
    dueDate: "2026-10-10",
    status: "overdue",
    daysOverdue: 7,
  },
  {
    id: "chg-2",
    studentId: "s4",
    classId: "cls-5",
    billingMonth: "October 2026",
    baseAmount: 3200,
    discountAmount: 0,
    netAmount: 3200,
    dueDate: "2026-10-15",
    status: "pending",
    daysOverdue: 2,
  },
  {
    id: "chg-3",
    studentId: "s2",
    classId: "cls-2",
    billingMonth: "October 2026",
    baseAmount: 4500,
    discountAmount: 675,
    discountReason: "Sibling 15% discount (under Kamal Senanayake)",
    netAmount: 3825,
    dueDate: "2026-10-10",
    status: "paid",
  },
  {
    id: "chg-4",
    studentId: "s5",
    classId: "cls-4",
    billingMonth: "October 2026",
    baseAmount: 5000,
    discountAmount: 2500,
    discountReason: "Teacher 50% Scholarship Pass (sanctioned by Eng. Dilantha Fernando)",
    netAmount: 2500,
    dueDate: "2026-10-10",
    status: "paid",
  },
];

export const mockPayments: PaymentRecordData[] = [
  {
    id: "pay-101",
    receiptNumber: "REC-2026-8901",
    studentId: "s3",
    chargeId: "chg- Dinuka",
    amount: 4500,
    paymentMethod: "payhere_online",
    referenceNumber: "PH-88901452",
    collectedBy: "Automated Gateway",
    timestamp: "2026-10-16 09:24 AM",
    status: "verified",
  },
  {
    id: "pay-102",
    receiptNumber: "REC-2026-8902",
    studentId: "s2",
    chargeId: "chg-3",
    amount: 3825,
    paymentMethod: "frimi",
    referenceNumber: "FRM-991204",
    collectedBy: "Counter Cashier #2",
    timestamp: "2026-10-15 02:40 PM",
    status: "verified",
  },
  {
    id: "pay-103",
    receiptNumber: "REC-2026-8903",
    studentId: "s5",
    chargeId: "chg-4",
    amount: 2500,
    paymentMethod: "cash",
    referenceNumber: "CSH-5512",
    collectedBy: "Main Gate Cashier",
    timestamp: "2026-10-14 11:15 AM",
    status: "verified",
  },
];

export const mockExams: ExamData[] = [
  {
    id: "ex-1",
    classId: "cls-1",
    name: "Monthly Evaluation #4: Differential Calculus & Limits",
    date: "2026-10-08",
    totalMarks: 100,
    passingMarks: 40,
    averageScore: 68.4,
    highestScore: 98,
    lowestScore: 22,
    passPercentage: 86.4,
    topicsCovered: ["Limits & Continuity", "First Principles", "Product & Quotient Rules"],
  },
  {
    id: "ex-2",
    classId: "cls-2",
    name: "A/L Physics Term Assessment: Electric & Magnetic Fields",
    date: "2026-10-04",
    totalMarks: 100,
    passingMarks: 40,
    averageScore: 64.2,
    highestScore: 95,
    lowestScore: 19,
    passPercentage: 82.0,
    topicsCovered: ["Coulomb's Law", "Electromagnetism", "Faraday's Induction"],
  },
];

export const mockTopicDiagnostics: TopicDiagnosticData[] = [
  {
    id: "top-1",
    subject: "Combined Mathematics",
    topicName: "Trigonometric Transformations & Identities",
    grade: "Grade 12",
    masteryPercentage: 54.8,
    weakStudentCount: 42,
    status: "critical",
    recommendation: "Conduct a 2-hour supplementary paper drill session on angle formulas.",
  },
  {
    id: "top-2",
    subject: "Physics",
    topicName: "Rotational Dynamics & Moment of Inertia",
    grade: "Grade 13",
    masteryPercentage: 62.0,
    weakStudentCount: 29,
    status: "warning",
    recommendation: "Provide step-by-step visual problem breakdowns for torque equilibrium.",
  },
  {
    id: "top-3",
    subject: "Chemistry",
    topicName: "Organic Reaction Mechanisms (Alkenes & Benzene)",
    grade: "Grade 12",
    masteryPercentage: 79.5,
    weakStudentCount: 14,
    status: "mastered",
    recommendation: "Students are ready to transition to carbonyl compound synthesis.",
  },
];

export const mockRecommendations: RecommendationData[] = [
  {
    id: "rec-1",
    title: "Overdue Receivables Recovery",
    category: "finance",
    priority: "urgent",
    issue: "LKR 284,000 in uncollected tuition fees for billing cut-off period Oct 10.",
    evidence: "14 students are > 7 days past due date across A/L Combined Maths & Physics batches.",
    recommendedAction: "Execute 1-click batch automated WhatsApp reminder dispatch to guardians with direct payment links.",
    affectedCount: 14,
    affectedLabel: "Students in Arrears",
    followUpStatus: "pending",
  },
  {
    id: "rec-2",
    title: "Retention Warning: Consecutive Absenteeism",
    category: "attendance",
    priority: "urgent",
    issue: "6 students missed 2 or more consecutive classes in O/L Mathematics and Chemistry.",
    evidence: "Data analytics shows 84% correlation between 2 consecutive absences and course drop-out within 30 days.",
    recommendedAction: "Trigger counselor outreach call and alert parent via automated SMS check-in.",
    affectedCount: 6,
    affectedLabel: "At-Risk Students",
    followUpStatus: "in_progress",
  },
  {
    id: "rec-3",
    title: "Academic Remediation: Trigonometry Weakness",
    category: "academic",
    priority: "high",
    issue: "Class average in Differential Calculus dropped by 14% compared to previous term.",
    evidence: "Exam #4 topic analysis flagged question 3 (Limits of Trigonometric functions) with 48% fail rate.",
    recommendedAction: "Release 20-minute guided video explanation and targeted 10-question practice worksheet.",
    affectedCount: 42,
    affectedLabel: "Students Needing Remediation",
    followUpStatus: "pending",
  },
];

export const mockSupportTickets: SupportTicketData[] = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-8492",
    instituteId: "inst-1",
    senderName: "Sanjeewa Perera (Campus Ops)",
    senderRole: "Counter Supervisor",
    subject: "Entrance Gate Barcode Scanner latency during 8:30 AM surge",
    category: "qr_hardware",
    priority: "urgent",
    status: "in_progress",
    createdAt: "2026-10-16 08:45 AM",
    messagesCount: 3,
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-8488",
    instituteId: "inst-1",
    senderName: "Eng. Dilantha Fernando",
    senderRole: "Teacher",
    subject: "Request to add 15% Sibling Rule to Combined Maths + Physics bundle",
    category: "billing",
    priority: "high",
    status: "open",
    createdAt: "2026-10-15 04:20 PM",
    messagesCount: 1,
  },
];
