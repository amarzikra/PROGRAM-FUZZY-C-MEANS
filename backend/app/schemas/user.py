from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- Request Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str
    nama: str
    role: str = "perawat"  # 'dokter' | 'perawat'

class UserLogin(BaseModel):
    email: str
    password: str

# --- Response Schemas ---
class UserResponse(BaseModel):
    id: int
    email: str
    nama: Optional[str] = None
    role: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
