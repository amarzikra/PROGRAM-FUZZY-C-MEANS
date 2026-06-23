import json
import cv2
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.patient import Patient
from app.models.wound_image import WoundImage
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse, EvaluateResponse, ProgressPoint
from app.services.image_processing import preprocess_pipeline
from app.services.fcm_service import segment_wound
from app.services.evaluation import compute_metrics
from app.utils.file_storage import get_full_path, get_file_url, generate_filename, save_bytes_to_file

router = APIRouter(prefix="/api/v1", tags=["Analisis FCM"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_wound(
    payload: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Jalankan segmentasi Fuzzy C-Means pada gambar yang telah diunggah.
    
    Pipeline: Load → Resize 512×512 → Filter → Color Convert → FCM → Mask + Overlay → Simpan
    """
    # Fetch wound image record
    wound_image = db.query(WoundImage).filter(WoundImage.id == payload.image_id).first()
    if not wound_image:
        raise HTTPException(status_code=404, detail="Gambar tidak ditemukan")

    # Verify ownership
    patient = db.query(Patient).filter(
        Patient.id == wound_image.patient_id,
        Patient.user_id == current_user.id,
    ).first()
    if not patient:
        raise HTTPException(status_code=403, detail="Akses ditolak")

    # Get absolute path of uploaded image
    image_full_path = get_full_path(wound_image.image_path)

    # Step 1: Preprocessing pipeline
    try:
        original_resized, preprocessed = preprocess_pipeline(
            file_path=image_full_path,
            resize=512,
            filter_type=payload.filter,
            color_space=payload.color_space,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    # Step 2: Run FCM segmentation
    result = segment_wound(
        original_bgr=original_resized,
        preprocessed=preprocessed,
        pixel_per_cm2=payload.pixel_per_cm2,
        c=payload.fcm.clusters,
        m=payload.fcm.fuzziness,
        max_iter=payload.fcm.max_iter,
        epsilon=payload.fcm.epsilon,
    )

    # Step 3: Save mask and overlay images to disk
    mask_path = generate_filename(current_user.id, patient.id, suffix="mask")
    overlay_path = generate_filename(current_user.id, patient.id, suffix="overlay")

    mask_full = get_full_path(mask_path)
    overlay_full = get_full_path(overlay_path)

    cv2.imwrite(mask_full, result.mask)
    cv2.imwrite(overlay_full, result.overlay)

    # Step 4: Update database record
    wound_image.mask_path = mask_path
    wound_image.result_overlay_path = overlay_path
    wound_image.area_pixel = result.area_pixel
    wound_image.area_real = result.area_cm2
    wound_image.pixel_per_cm2 = payload.pixel_per_cm2
    wound_image.centroids = json.dumps(result.centroids)
    wound_image.fcm_clusters = payload.fcm.clusters
    wound_image.fcm_fuzziness = payload.fcm.fuzziness
    wound_image.fcm_max_iter = payload.fcm.max_iter
    wound_image.fcm_epsilon = payload.fcm.epsilon
    wound_image.filter_type = payload.filter
    wound_image.color_space = payload.color_space

    db.commit()
    db.refresh(wound_image)

    return AnalyzeResponse(
        image_id=wound_image.id,
        mask_url=get_file_url(mask_path),
        overlay_url=get_file_url(overlay_path),
        area_pixel=result.area_pixel,
        area_cm2=result.area_cm2,
        centroids=result.centroids,
        iterations=result.iterations,
    )


@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_segmentation(
    image_id: int,
    ground_truth: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload ground truth mask dan hitung DSC, IoU, Pixel Accuracy.
    """
    # Fetch wound image
    wound_image = db.query(WoundImage).filter(WoundImage.id == image_id).first()
    if not wound_image or not wound_image.mask_path:
        raise HTTPException(status_code=404, detail="Mask segmentasi belum tersedia. Jalankan /analyze terlebih dahulu.")

    # Verify ownership
    patient = db.query(Patient).filter(
        Patient.id == wound_image.patient_id,
        Patient.user_id == current_user.id,
    ).first()
    if not patient:
        raise HTTPException(status_code=403, detail="Akses ditolak")

    # Load predicted mask
    import numpy as np
    mask_full_path = get_full_path(wound_image.mask_path)
    predicted_mask = cv2.imread(mask_full_path, cv2.IMREAD_GRAYSCALE)
    if predicted_mask is None:
        raise HTTPException(status_code=500, detail="Gagal membaca mask segmentasi")

    # Load ground truth from upload
    gt_bytes = await ground_truth.read()
    gt_array = np.frombuffer(gt_bytes, dtype=np.uint8)
    gt_mask = cv2.imdecode(gt_array, cv2.IMREAD_GRAYSCALE)
    if gt_mask is None:
        raise HTTPException(status_code=400, detail="Gagal membaca gambar ground truth")

    # Compute evaluation metrics
    metrics = compute_metrics(predicted_mask, gt_mask)

    # Update database
    wound_image.dsc = metrics.dsc
    wound_image.iou = metrics.iou
    wound_image.pixel_accuracy = metrics.pixel_accuracy
    db.commit()

    return EvaluateResponse(
        image_id=image_id,
        dsc=metrics.dsc,
        iou=metrics.iou,
        pixel_accuracy=metrics.pixel_accuracy,
    )


@router.get("/patients/{patient_id}/progress", response_model=List[ProgressPoint])
def get_patient_progress(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Deret waktu luas luka pasien untuk grafik progres penyembuhan (Chart.js).
    """
    # Verify ownership
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.user_id == current_user.id,
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")

    # Get wound images sorted by date
    images = (
        db.query(WoundImage)
        .filter(
            WoundImage.patient_id == patient_id,
            WoundImage.area_real.isnot(None),
        )
        .order_by(WoundImage.captured_at.asc())
        .all()
    )

    return [
        ProgressPoint(
            date=img.captured_at.strftime("%Y-%m-%d") if img.captured_at else "",
            area_cm2=img.area_real,
            image_id=img.id,
        )
        for img in images
    ]
