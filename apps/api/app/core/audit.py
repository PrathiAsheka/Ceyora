import json
import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import AuditLog


async def log_audit(
    db: AsyncSession,
    action: str,
    entity_type: str,
    entity_id: uuid.UUID = None,
    old_values: dict = None,
    new_values: dict = None,
    user_id: uuid.UUID = None,
    ip_address: str = None,
):
    audit_log = AuditLog(
        id=uuid.uuid4(),
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        old_values=json.dumps(old_values) if old_values else None,
        new_values=json.dumps(new_values) if new_values else None,
        ip_address=ip_address,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(audit_log)
    await db.flush()
