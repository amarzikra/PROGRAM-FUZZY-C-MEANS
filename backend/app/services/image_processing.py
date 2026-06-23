"""
Preprocessing service for wound images.
Handles: resize, filtering, and color space conversion as specified in PRD Section 5.
"""
import cv2
import numpy as np
from typing import Literal


def load_image(file_path: str) -> np.ndarray:
    """Load an image from disk as BGR numpy array."""
    img = cv2.imread(file_path)
    if img is None:
        raise FileNotFoundError(f"Tidak dapat membaca gambar: {file_path}")
    return img


def resize_image(img: np.ndarray, size: int = 512) -> np.ndarray:
    """Resize image to size x size pixels."""
    return cv2.resize(img, (size, size), interpolation=cv2.INTER_AREA)


def apply_filter(img: np.ndarray, filter_type: Literal["median", "gaussian", "none"] = "median") -> np.ndarray:
    """Apply noise reduction filter."""
    if filter_type == "median":
        return cv2.medianBlur(img, 5)
    elif filter_type == "gaussian":
        return cv2.GaussianBlur(img, (5, 5), 0)
    else:
        return img


def convert_color_space(img: np.ndarray, color_space: Literal["grayscale", "hsv"] = "grayscale") -> np.ndarray:
    """
    Convert BGR image to target color space for FCM input.
    Returns a 2D array (grayscale intensity) or 3D array (HSV channels).
    """
    if color_space == "grayscale":
        return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    elif color_space == "hsv":
        return cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    else:
        return img


def preprocess_pipeline(
    file_path: str,
    resize: int = 512,
    filter_type: str = "median",
    color_space: str = "grayscale",
) -> tuple[np.ndarray, np.ndarray]:
    """
    Full preprocessing pipeline as described in PRD Section 5:
    Load → Resize 512×512 → Filter → Color Convert.

    Returns:
        (original_resized_bgr, preprocessed_for_fcm)
    """
    img = load_image(file_path)
    img_resized = resize_image(img, resize)
    img_filtered = apply_filter(img_resized, filter_type)
    img_converted = convert_color_space(img_filtered, color_space)
    return img_resized, img_converted
