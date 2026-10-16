from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: UUID
    email: str
    role: str
    first_name: str
    last_name: str
    institute_id: Optional[UUID] = None

    class Config:
        from_attributes = True


class InstituteCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    registration_number: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    billing_cut_off_day: int = Field(default=10, ge=1, le=28)


class InstituteResponse(BaseModel):
    id: UUID
    name: str
    registration_number: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    logo_url: Optional[str] = None
    billing_cut_off_day: int
    currency: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TeacherCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    nic: Optional[str] = None
    phone: str = Field(..., min_length=1)
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    subjects: List[str] = Field(default_factory=list)
    compensation_type: str = "percentage"
    compensation_value: float = 0


class TeacherResponse(BaseModel):
    id: UUID
    institute_id: UUID
    first_name: str
    last_name: str
    nic: Optional[str] = None
    phone: str
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    subjects: List[str]
    compensation_type: str
    compensation_value: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    date_of_birth: Optional[str] = None
    school: Optional[str] = None
    guardian_name: str = Field(..., min_length=1)
    guardian_phone: str = Field(..., min_length=1)
    guardian_whatsapp: Optional[str] = None
    class_ids: List[str] = Field(default_factory=list)


class StudentResponse(BaseModel):
    id: UUID
    institute_id: UUID
    first_name: str
    last_name: str
    date_of_birth: Optional[datetime] = None
    school: Optional[str] = None
    guardian_name: str
    guardian_phone: str
    guardian_whatsapp: Optional[str] = None
    qr_code: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ClassCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    subject_id: str
    teacher_id: str
    grade: Optional[str] = None
    medium: str = "sinhala"
    day_of_week: str = Field(..., min_length=1)
    time_slot: str = Field(..., min_length=1)
    hall: Optional[str] = None
    monthly_fee: float = Field(..., ge=0)


class ClassResponse(BaseModel):
    id: UUID
    institute_id: UUID
    name: str
    subject_id: UUID
    teacher_id: UUID
    grade: Optional[str] = None
    medium: str
    day_of_week: str
    time_slot: str
    hall: Optional[str] = None
    monthly_fee: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class FeeChargeCreate(BaseModel):
    student_id: str
    class_id: str
    amount: float = Field(..., gt=0)
    discount: float = Field(default=0, ge=0)
    discount_type: str = "fixed"
    discount_reason: Optional[str] = None
    due_date: str
    billing_period: str


class FeeChargeResponse(BaseModel):
    id: UUID
    student_id: UUID
    class_id: UUID
    amount: float
    discount: float
    discount_type: str
    discount_reason: Optional[str] = None
    net_amount: float
    due_date: datetime
    billing_period: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentCreate(BaseModel):
    student_id: str
    amount: float = Field(..., gt=0)
    payment_method: str
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class PaymentResponse(BaseModel):
    id: UUID
    student_id: UUID
    amount: float
    payment_method: str
    reference_number: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    category: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    date: str
    class_id: Optional[str] = None
    teacher_id: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: UUID
    institute_id: UUID
    category: str
    description: str
    amount: float
    date: datetime
    class_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ExamCreate(BaseModel):
    name: str = Field(..., min_length=1)
    class_id: str
    date: str
    total_marks: int = Field(..., gt=0)
    passing_marks: int = Field(..., gt=0)


class ExamResponse(BaseModel):
    id: UUID
    institute_id: UUID
    name: str
    class_id: UUID
    date: datetime
    total_marks: int
    passing_marks: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    data: List[dict]
    total: int
    page: int
    per_page: int
    total_pages: int


class MessageResponse(BaseModel):
    message: str
    success: bool = True
