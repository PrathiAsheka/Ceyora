from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.core.security import get_current_user
from app.models import User


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise ValueError("User account is disabled")
    return current_user


async def get_institute_context(
    current_user: User = Depends(get_current_user),
) -> dict:
    if current_user.role == "super_admin":
        return {"institute_id": None, "is_super_admin": True}
    if current_user.institute_id is None:
        raise ValueError("User is not associated with any institute")
    return {"institute_id": current_user.institute_id, "is_super_admin": False}
