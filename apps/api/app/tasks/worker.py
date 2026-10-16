# TODO: Configure Celery or ARQ worker
# This file will contain worker configuration for async task processing

# from celery import Celery
# from app.config import settings

# celery_app = Celery(
#     "ceyora",
#     broker=settings.REDIS_URL,
#     backend=settings.REDIS_URL,
# )

# celery_app.conf.update(
#     task_serializer="json",
#     accept_content=["json"],
#     result_serializer="json",
#     timezone="Asia/Colombo",
#     enable_utc=True,
#     task_track_started=True,
#     task_time_limit=300,
#     task_soft_time_limit=240,
# )
