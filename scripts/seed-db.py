#!/usr/bin/env python3
"""Seed the database with initial data for development."""

import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import async_session_factory, engine, Base
from app.models import User, Institute, UserRole
from app.core.security import hash_password


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as db:
        # Check if admin exists
        from sqlalchemy import select
        result = await db.execute(
            select(User).where(User.email == "admin@ceyora.lk")
        )
        existing = result.scalar_one_or_none()

        if existing:
            print("Admin user already exists. Skipping seed.")
            return

        # Create default institute
        institute = Institute(
            name="Demo Tuition Center",
            phone="+94771234567",
            email="demo@ceyora.lk",
            address="Colombo, Sri Lanka",
            billing_cut_off_day=10,
            currency="LKR",
        )
        db.add(institute)
        await db.flush()

        # Create super admin
        admin = User(
            email="admin@ceyora.lk",
            hashed_password=hash_password("changeme123"),
            role=UserRole.SUPER_ADMIN,
            first_name="Admin",
            last_name="User",
            is_active=True,
        )
        db.add(admin)

        # Create institute admin
        institute_admin = User(
            email="institute@ceyora.lk",
            hashed_password=hash_password("changeme123"),
            role=UserRole.INSTITUTE_ADMIN,
            institute_id=institute.id,
            first_name="Institute",
            last_name="Admin",
            is_active=True,
        )
        db.add(institute_admin)

        await db.commit()
        print("Seed completed successfully!")
        print("  Admin: admin@ceyora.lk / changeme123")
        print("  Institute Admin: institute@ceyora.lk / changeme123")


if __name__ == "__main__":
    asyncio.run(seed())
