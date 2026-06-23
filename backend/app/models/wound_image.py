from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class WoundImage(Base):
    __tablename__ = "wound_images"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True, nullable=False)

    # File paths
    image_path = Column(Text, nullable=True)             # Original uploaded image
    mask_path = Column(Text, nullable=True)               # Binary mask from FCM
    result_overlay_path = Column(Text, nullable=True)     # Overlay mask on original

    # Analysis results
    area_pixel = Column(Float, nullable=True)
    area_real = Column(Float, nullable=True)              # cm² (after calibration)
    pixel_per_cm2 = Column(Float, nullable=True)
    centroids = Column(Text, nullable=True)               # JSON string e.g. "[192.57, 78.15]"

    # FCM parameters used
    fcm_clusters = Column(Integer, nullable=True)
    fcm_fuzziness = Column(Float, nullable=True)
    fcm_max_iter = Column(Integer, nullable=True)
    fcm_epsilon = Column(Float, nullable=True)
    filter_type = Column(String(50), nullable=True)       # 'median' | 'gaussian' | 'none'
    color_space = Column(String(50), nullable=True)       # 'grayscale' | 'hsv'

    # Evaluation metrics (optional, when ground truth is provided)
    dsc = Column(Float, nullable=True)
    iou = Column(Float, nullable=True)
    pixel_accuracy = Column(Float, nullable=True)

    # Clinical notes
    catatan = Column(Text, nullable=True)
    captured_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    patient = relationship("Patient", back_populates="wound_images")
