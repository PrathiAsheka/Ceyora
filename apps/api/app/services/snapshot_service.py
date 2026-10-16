from datetime import datetime
from decimal import Decimal
from typing import Dict
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models import (
    Institute, Student, Class, Teacher, FeeCharge, Payment, Attendance,
    Exam, ExamResult, Expense, FeeChargeStatus, AttendanceStatus
)


async def generate_monthly_snapshot(
    db: AsyncSession,
    institute_id: UUID,
    month: str,
) -> Dict:
    snapshot = {
        "month": month,
        "generated_at": datetime.utcnow().isoformat(),
        "students": {"total": 0, "active": 0, "new": 0},
        "classes": {"total": 0},
        "finance": {
            "expected_revenue": 0,
            "collected": 0,
            "outstanding": 0,
            "expenses": 0,
            "net_income": 0,
        },
        "attendance": {
            "average_rate": 0,
            "low_attendance_students": 0,
        },
        "academic": {
            "exams_conducted": 0,
            "average_pass_rate": 0,
        },
    }
    return snapshot


async def save_snapshot(
    db: AsyncSession,
    institute_id: UUID,
    snapshot: Dict,
    month: str,
):
    from app.models import MonthlySnapshot
    import json

    existing = await db.execute(
        select(MonthlySnapshot).where(
            MonthlySnapshot.institute_id == institute_id,
            MonthlySnapshot.snapshot_month == month,
        )
    )
    existing_snapshot = existing.scalar_one_or_none()

    if existing_snapshot:
        existing_snapshot.data = json.dumps(snapshot)
        existing_snapshot.updated_at = datetime.utcnow()
    else:
        new_snapshot = MonthlySnapshot(
            institute_id=institute_id,
            snapshot_month=month,
            data=json.dumps(snapshot),
        )
        db.add(new_snapshot)

    await db.flush()
