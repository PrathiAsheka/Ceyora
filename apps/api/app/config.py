from pydantic_settings import BaseSettings
from typing import List
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Ceyora"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = f"sqlite+aiosqlite:///{os.path.join(BASE_DIR, 'ceyora.db')}"
    DATABASE_URL_SYNC: str = f"sqlite:///{os.path.join(BASE_DIR, 'ceyora.db')}"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    JWT_SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]

    # WhatsApp
    WHATSAPP_API_VERSION: str = "v18.0"
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_ACCESS_TOKEN: str = ""
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = ""

    # SMS
    SMS_API_URL: str = ""
    SMS_API_KEY: str = ""
    SMS_SENDER_ID: str = ""

    # PayHere
    PAYHERE_MERCHANT_ID: str = ""
    PAYHERE_MERCHANT_SECRET: str = ""
    PAYHERE_SANDBOX: bool = True

    # WebXPay
    WEBXPAY_API_KEY: str = ""
    WEBXPAY_SANDBOX: bool = True

    # Storage
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = ""
    R2_PUBLIC_URL: str = ""

    # WeasyPrint
    WEASYPRINT_PATH: str = "weasyprint"

    # Super Admin
    SUPER_ADMIN_EMAIL: str = "admin@ceyora.lk"
    SUPER_ADMIN_PASSWORD: str = "changeme123"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
