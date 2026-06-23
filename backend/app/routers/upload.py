from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.wound_image import WoundImage
from app.utils.file_storage import (
    generate_filename, save_bytes_to_file, get_file_url,
    validate_image_file,
)

router = APIRouter(prefix="/api/v1/upload", tags=["Upload Citra"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    patient_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload foto luka pasien (JPG/PNG, maks 5 MB).
    Mengembalikan image_id dan URL untuk digunakan pada endpoint /analyze.
    """
    # Read file
    contents = await file.read()

    # Validate
    try:
        validate_image_file(file.content_type, len(contents))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Check patient belongs to current user
    from app.models.patient import Patient
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.user_id == current_user.id,
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")

    # Save file to disk
    relative_path = generate_filename(current_user.id, patient_id, suffix="raw")
    save_bytes_to_file(contents, relative_path)

    # Create database record (partial — will be updated by /analyze)
    wound_image = WoundImage(
        patient_id=patient_id,
        image_path=relative_path,
    )
    db.add(wound_image)
    db.commit()
    db.refresh(wound_image)

    return {
        "image_id": wound_image.id,
        "image_url": get_file_url(relative_path),
        "message": "Citra berhasil diunggah",
    }
