from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.database import get_db
from app.models import Student, User
from app.schemas import StudentCreate, StudentResponse
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[StudentResponse])
async def list_students(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.institute_id:
        result = await db.execute(
            select(Student).where(Student.institute_id == current_user.institute_id)
        )
        return result.scalars().all()
    return []


@router.post("/", response_model=StudentResponse)
async def create_student(
    data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    import uuid as uuid_lib
    student = Student(
        institute_id=current_user.institute_id,
        first_name=data.first_name,
        last_name=data.last_name,
        date_of_birth=data.date_of_birth,
        school=data.school,
        guardian_name=data.guardian_name,
        guardian_phone=data.guardian_phone,
        guardian_whatsapp=data.guardian_whatsapp,
        qr_code=str(uuid_lib.uuid4())[:8].upper(),
    )
    db.add(student)
    await db.flush()
    await db.refresh(student)
    return student


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Student")
    return student
