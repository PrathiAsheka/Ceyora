from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from typing import Optional


class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.institute_id = None
        request.state.is_super_admin = False

        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            try:
                from app.core.security import decode_token
                from app.database import async_session_factory
                from app.models import User
                from sqlalchemy import select

                token = auth_header.split(" ")[1]
                payload = decode_token(token)
                user_id = payload.get("sub")

                if user_id:
                    async with async_session_factory() as db:
                        result = await db.execute(select(User).where(User.id == user_id))
                        user = result.scalar_one_or_none()
                        if user:
                            request.state.user_id = user.id
                            request.state.institute_id = user.institute_id
                            request.state.is_super_admin = user.role == "super_admin"
                            request.state.user_role = user.role
            except Exception:
                pass

        response = await call_next(request)
        return response
