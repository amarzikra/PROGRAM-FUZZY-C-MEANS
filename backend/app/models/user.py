from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    nama = Column(String(255), nullable=True)
    role = Column(String(50), nullable=True)  # 'dokter' | 'perawat'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    patients = relationship("Patient", back_populates="doctor", cascade="all, delete-orphan")
