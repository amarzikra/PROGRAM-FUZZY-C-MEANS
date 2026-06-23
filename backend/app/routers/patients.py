from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse, PatientDetailResponse

router = APIRouter(prefix="/api/v1/patients", tags=["Pasien"])

@router.get("/", response_model=List[PatientResponse])
def list_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Daftar semua pasien milik user yang sedang login."""
    patients = db.query(Patient).filter(Patient.user_id == current_user.id).order_by(Patient.created_at.desc()).all()
    return patients

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    payload: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tambah pasien baru."""
    # Check unique no_rekam_medis
    existing = db.query(Patient).filter(Patient.no_rekam_medis == payload.no_rekam_medis).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No. Rekam Medis sudah terdaftar"
        )

    patient = Patient(
        nama=payload.nama,
        no_rekam_medis=payload.no_rekam_medis,
        user_id=current_user.id,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/{patient_id}", response_model=PatientDetailResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Detail pasien beserta riwayat foto luka."""
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.user_id == current_user.id,
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    payload: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update data pasien."""
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.user_id == current_user.id,
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")

    if payload.nama is not None:
        patient.nama = payload.nama
    if payload.no_rekam_medis is not None:
        # Check uniqueness
        existing = db.query(Patient).filter(
            Patient.no_rekam_medis == payload.no_rekam_medis,
            Patient.id != patient_id,
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="No. Rekam Medis sudah dipakai pasien lain")
        patient.no_rekam_medis = payload.no_rekam_medis

    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Hapus pasien beserta seluruh riwayat lukanya."""
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.user_id == current_user.id,
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    db.delete(patient)
    db.commit()
