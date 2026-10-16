from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.database import get_db
from app.models import Institute, User
from app.schemas import InstituteCreate, InstituteResponse
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[InstituteResponse])
async def list_institutes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "super_admin":
        result = await db.execute(select(Institute))
    else:
        result = await db.execute(
            select(Institute).where(Institute.id == current_user.institute_id)
        )
    return result.scalars().all()


@router.post("/", response_model=InstituteResponse)
async def create_institute(
    data: InstituteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    institute = Institute(**data.model_dump(), currency="LKR")
    db.add(institute)
    await db.flush()
    await db.refresh(institute)
    return institute


@router.get("/{institute_id}", response_model=InstituteResponse)
async def get_institute(
    institute_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Institute).where(Institute.id == institute_id))
    institute = result.scalar_one_or_none()
    if not institute:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Institute")
    return institute


@router.put("/{institute_id}", response_model=InstituteResponse)
async def update_institute(
    institute_id: UUID,
    data: InstituteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Institute).where(Institute.id == institute_id))
    institute = result.scalar_one_or_none()
    if not institute:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Institute")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(institute, key, value)

    await db.flush()
    await db.refresh(institute)
    return institute
