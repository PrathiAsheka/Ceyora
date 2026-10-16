from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.database import get_db
from app.models import Teacher, User
from app.schemas import TeacherCreate, TeacherResponse
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[TeacherResponse])
async def list_teachers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.institute_id:
        result = await db.execute(
            select(Teacher).where(Teacher.institute_id == current_user.institute_id)
        )
        return result.scalars().all()
    return []


@router.post("/", response_model=TeacherResponse)
async def create_teacher(
    data: TeacherCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    teacher = Teacher(
        institute_id=current_user.institute_id,
        **data.model_dump(),
    )
    db.add(teacher)
    await db.flush()
    await db.refresh(teacher)
    return teacher


@router.get("/{teacher_id}", response_model=TeacherResponse)
async def get_teacher(
    teacher_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Teacher).where(Teacher.id == teacher_id))
    teacher = result.scalar_one_or_none()
    if not teacher:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Teacher")
    return teacher
