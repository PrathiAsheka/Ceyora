from datetime import datetime
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.models import Attendance, AttendanceStatus, AttendanceMarkedBy


async def record_attendance(
    db: AsyncSession,
    student_id: UUID,
    class_id: UUID,
    status: AttendanceStatus,
    marked_by: AttendanceMarkedBy,
    date: datetime = None,
) -> Attendance:
    if date is None:
        date = datetime.utcnow()

    attendance = Attendance(
        student_id=student_id,
        class_id=class_id,
        date=date,
        status=status,
        marked_by=marked_by,
    )
    db.add(attendance)
    await db.flush()
    return attendance


async def get_class_attendance(
    db: AsyncSession,
    class_id: UUID,
    date: datetime = None,
) -> List[Attendance]:
    if date is None:
        date = datetime.utcnow()

    query = select(Attendance).where(
        and_(
            Attendance.class_id == class_id,
            Attendance.date == date,
        )
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_student_attendance(
    db: AsyncSession,
    student_id: UUID,
    start_date: datetime = None,
    end_date: datetime = None,
) -> List[Attendance]:
    query = select(Attendance).where(Attendance.student_id == student_id)
    if start_date:
        query = query.where(Attendance.date >= start_date)
    if end_date:
        query = query.where(Attendance.date <= end_date)

    result = await db.execute(query)
    return result.scalars().all()
