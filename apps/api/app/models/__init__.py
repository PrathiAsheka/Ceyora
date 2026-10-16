import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean, Integer, Numeric, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    INSTITUTE_ADMIN = "institute_admin"
    TEACHER = "teacher"
    STAFF = "staff"


class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"
    CARD = "card"
    MOBILE_WALLET = "mobile_wallet"
    ONLINE = "online"


class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"


class AttendanceMarkedBy(str, enum.Enum):
    QR_SCAN = "qr_scan"
    MANUAL = "manual"


class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRANSFERRED = "transferred"


class FeeChargeStatus(str, enum.Enum):
    PENDING = "pending"
    PARTIAL = "partial"
    PAID = "paid"
    OVERDUE = "overdue"


class DiscountType(str, enum.Enum):
    PERCENTAGE = "percentage"
    FIXED = "fixed"


class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class BaseModel(Base):
    __abstract__ = True

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Institute(BaseModel):
    __tablename__ = "institutes"

    name = Column(String(255), nullable=False)
    registration_number = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    billing_cut_off_day = Column(Integer, default=10, nullable=False)
    currency = Column(String(3), default="LKR", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    users = relationship("User", back_populates="institute")
    teachers = relationship("Teacher", back_populates="institute")
    students = relationship("Student", back_populates="institute")
    classes = relationship("Class", back_populates="institute")
    subjects = relationship("Subject", back_populates="institute")
    expenses = relationship("Expense", back_populates="institute")
    exams = relationship("Exam", back_populates="institute")


class User(BaseModel):
    __tablename__ = "users"

    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.INSTITUTE_ADMIN)
    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    institute = relationship("Institute", back_populates="users")


class Teacher(BaseModel):
    __tablename__ = "teachers"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    nic = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=False)
    whatsapp = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    bank_name = Column(String(100), nullable=True)
    bank_account = Column(String(50), nullable=True)
    compensation_type = Column(String(20), default="percentage", nullable=False)
    compensation_value = Column(Numeric(10, 2), default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    institute = relationship("Institute", back_populates="teachers")
    classes = relationship("Class", back_populates="teacher")


class Subject(BaseModel):
    __tablename__ = "subjects"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=True)

    institute = relationship("Institute", back_populates="subjects")
    classes = relationship("Class", back_populates="subject")


class Class(BaseModel):
    __tablename__ = "classes"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    name = Column(String(255), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    grade = Column(String(20), nullable=True)
    medium = Column(String(20), default="sinhala", nullable=False)
    day_of_week = Column(String(20), nullable=False)
    time_slot = Column(String(50), nullable=False)
    hall = Column(String(100), nullable=True)
    monthly_fee = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    institute = relationship("Institute", back_populates="classes")
    subject = relationship("Subject", back_populates="classes")
    teacher = relationship("Teacher", back_populates="classes")
    enrollments = relationship("Enrollment", back_populates="class_")
    fee_charges = relationship("FeeCharge", back_populates="class_")


class Student(BaseModel):
    __tablename__ = "students"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    school = Column(String(200), nullable=True)
    guardian_name = Column(String(200), nullable=False)
    guardian_phone = Column(String(20), nullable=False)
    guardian_whatsapp = Column(String(20), nullable=True)
    qr_code = Column(String(100), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)

    institute = relationship("Institute", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student")
    fee_charges = relationship("FeeCharge", back_populates="student")
    payments = relationship("Payment", back_populates="student")
    attendance_records = relationship("Attendance", back_populates="student")
    exam_results = relationship("ExamResult", back_populates="student")


class Enrollment(BaseModel):
    __tablename__ = "enrollments"

    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(SAEnum(EnrollmentStatus), default=EnrollmentStatus.ACTIVE, nullable=False)

    student = relationship("Student", back_populates="enrollments")
    class_ = relationship("Class", back_populates="enrollments")


class FeeCharge(BaseModel):
    __tablename__ = "fee_charges"

    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    discount = Column(Numeric(10, 2), default=0, nullable=False)
    discount_type = Column(SAEnum(DiscountType), default=DiscountType.FIXED, nullable=False)
    discount_reason = Column(Text, nullable=True)
    net_amount = Column(Numeric(10, 2), nullable=False)
    due_date = Column(DateTime, nullable=False)
    billing_period = Column(String(20), nullable=False)
    status = Column(SAEnum(FeeChargeStatus), default=FeeChargeStatus.PENDING, nullable=False)

    student = relationship("Student", back_populates="fee_charges")
    class_ = relationship("Class", back_populates="fee_charges")
    allocations = relationship("PaymentAllocation", back_populates="fee_charge")


class Payment(BaseModel):
    __tablename__ = "payments"

    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(SAEnum(PaymentMethod), nullable=False)
    reference_number = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    student = relationship("Student", back_populates="payments")
    allocations = relationship("PaymentAllocation", back_populates="payment")


class PaymentAllocation(BaseModel):
    __tablename__ = "payment_allocations"

    payment_id = Column(UUID(as_uuid=True), ForeignKey("payments.id"), nullable=False)
    fee_charge_id = Column(UUID(as_uuid=True), ForeignKey("fee_charges.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)

    payment = relationship("Payment", back_populates="allocations")
    fee_charge = relationship("FeeCharge", back_populates="allocations")


class Expense(BaseModel):
    __tablename__ = "expenses"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    date = Column(DateTime, nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True)

    institute = relationship("Institute", back_populates="expenses")


class Attendance(BaseModel):
    __tablename__ = "attendance"

    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    status = Column(SAEnum(AttendanceStatus), nullable=False)
    marked_by = Column(SAEnum(AttendanceMarkedBy), nullable=False)

    student = relationship("Student", back_populates="attendance_records")


class Exam(BaseModel):
    __tablename__ = "exams"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    name = Column(String(200), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    total_marks = Column(Integer, nullable=False)
    passing_marks = Column(Integer, nullable=False)

    institute = relationship("Institute", back_populates="exams")
    results = relationship("ExamResult", back_populates="exam")


class ExamResult(BaseModel):
    __tablename__ = "exam_results"

    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    marks = Column(Integer, nullable=False)
    grade = Column(String(10), nullable=True)

    exam = relationship("Exam", back_populates="results")
    student = relationship("Student", back_populates="exam_results")
    topic_results = relationship("TopicResult", back_populates="exam_result")


class Topic(BaseModel):
    __tablename__ = "topics"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    name = Column(String(200), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"), nullable=False)


class TopicResult(BaseModel):
    __tablename__ = "topic_results"

    exam_result_id = Column(UUID(as_uuid=True), ForeignKey("exam_results.id"), nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=False)
    marks = Column(Integer, nullable=False)

    exam_result = relationship("ExamResult", back_populates="topic_results")


class SupportTicket(BaseModel):
    __tablename__ = "support_tickets"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SAEnum(TicketStatus), default=TicketStatus.OPEN, nullable=False)
    priority = Column(SAEnum(TicketPriority), default=TicketPriority.MEDIUM, nullable=False)


class ConsentRecord(BaseModel):
    __tablename__ = "consent_records"

    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    consent_type = Column(String(50), nullable=False)
    granted = Column(Boolean, nullable=False)
    granted_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime, nullable=True)


class AuditLog(BaseModel):
    __tablename__ = "audit_logs"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    old_values = Column(Text, nullable=True)
    new_values = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)


class MonthlySnapshot(BaseModel):
    __tablename__ = "monthly_snapshots"

    institute_id = Column(UUID(as_uuid=True), ForeignKey("institutes.id"), nullable=False)
    snapshot_month = Column(String(7), nullable=False)  # YYYY-MM
    data = Column(Text, nullable=False)  # JSON blob of metrics
