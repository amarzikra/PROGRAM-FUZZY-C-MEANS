import uuid
import os
from pathlib import Path
from app.core.config import settings


def generate_filename(user_id: int, patient_id: int, suffix: str = "raw") -> str:
    """Generate a structured filename: {user_id}/{patient_id}/{uuid}_{suffix}.png"""
    unique_id = uuid.uuid4().hex[:12]
    return f"{user_id}/{patient_id}/{unique_id}_{suffix}.png"


def get_full_path(relative_path: str) -> str:
    """Convert relative path to absolute filesystem path."""
    full = os.path.join(settings.UPLOAD_DIR, relative_path)
    # Ensure parent directory exists
    os.makedirs(os.path.dirname(full), exist_ok=True)
    return full


def get_file_url(relative_path: str) -> str:
    """Build a public URL for a stored file."""
    return f"{settings.BACKEND_HOST}/files/{relative_path}"


def save_bytes_to_file(data: bytes, relative_path: str) -> str:
    """Save raw bytes to disk and return the relative path."""
    full_path = get_full_path(relative_path)
    with open(full_path, "wb") as f:
        f.write(data)
    return relative_path


ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/jpg"}
MAX_FILE_SIZE = settings.MAX_FILE_SIZE_MB * 1024 * 1024  # bytes


def validate_image_file(content_type: str, file_size: int) -> None:
    """Validate uploaded image file type and size."""
    if content_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Tipe file tidak diizinkan: {content_type}. Hanya JPG/PNG.")
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"Ukuran file melebihi batas {settings.MAX_FILE_SIZE_MB} MB.")
