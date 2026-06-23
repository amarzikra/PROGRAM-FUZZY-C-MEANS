from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "DiabeticCare API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database — SQLite for development, swap to PostgreSQL later
    DATABASE_URL: str = "sqlite:///./diabeticcare.db"

    # JWT Auth
    JWT_SECRET_KEY: str = "diabeticcare-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # File Storage
    UPLOAD_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "uploads")
    MAX_FILE_SIZE_MB: int = 5

    # Server
    BACKEND_HOST: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
