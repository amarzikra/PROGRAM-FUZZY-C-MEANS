from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Request Schemas ---
class PatientCreate(BaseModel):
    nama: str
    no_rekam_medis: str

class PatientUpdate(BaseModel):
    nama: Optional[str] = None
    no_rekam_medis: Optional[str] = None

# --- Response Schemas ---
class WoundImageBrief(BaseModel):
    id: int
    area_real: Optional[float] = None
    captured_at: Optional[datetime] = None
    result_overlay_path: Optional[str] = None
    mask_path: Optional[str] = None

    class Config:
        from_attributes = True

class PatientResponse(BaseModel):
    id: int
    nama: str
    no_rekam_medis: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PatientDetailResponse(PatientResponse):
    wound_images: List[WoundImageBrief] = []
