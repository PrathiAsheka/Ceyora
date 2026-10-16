from typing import Dict, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Attendance, FeeCharge, ExamResult


async def generate_recommendations(
    db: AsyncSession,
    institute_id: UUID,
) -> List[Dict]:
    recommendations = []

    recommendations.append({
        "id": "welcome",
        "type": "info",
        "issue": "Platform Setup",
        "evidence": "Welcome to Ceyora. Import your data to begin.",
        "priority": "medium",
        "action": "Import institute data via CSV/Excel or manually add classes and students.",
        "affected_classes": [],
        "affected_students": [],
        "status": "pending",
    })

    return recommendations


async def generate_alerts(
    db: AsyncSession,
    institute_id: UUID,
) -> List[Dict]:
    alerts = []

    alerts.append({
        "id": "setup",
        "type": "info",
        "message": "Complete institute setup to start receiving alerts.",
        "severity": "low",
        "created_at": None,
    })

    return alerts
