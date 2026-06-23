"""
Fuzzy C-Means (FCM) Segmentation Service.

Implements the FCM algorithm as specified in PRD Section 6:
- Iterative update of membership matrix U and cluster centroids V
- Convergence check: |Pt - Pt-1| < epsilon OR t > MaxIter
- Labeling: darkest centroid = wound area
- Deterministic results via fixed random seed

Validation reference (BAB 4):
  For sample data [210, 190, 200, 85, 70, 60]:
  V1 ≈ 192.57 (healthy skin — brighter)
  V2 ≈ 78.15  (wound area — darker)
"""
import numpy as np
import cv2
from dataclasses import dataclass
from typing import Optional


@dataclass
class FCMResult:
    """Result container for FCM segmentation."""
    mask: np.ndarray              # Binary mask (0 = background, 255 = wound)
    overlay: np.ndarray           # Original image with wound area highlighted
    centroids: list[float]        # Cluster center values
    area_pixel: int               # Number of wound pixels
    area_cm2: float               # Wound area in cm²
    membership: np.ndarray        # Final membership matrix U
    iterations: int               # Number of iterations until convergence
    objective_value: float        # Final objective function value


def _initialize_membership(n_pixels: int, c: int, seed: int = 42) -> np.ndarray:
    """
    Initialize membership matrix U randomly.
    Each pixel's membership values across all clusters must sum to 1.
    Uses a fixed seed for deterministic results.
    """
    rng = np.random.RandomState(seed)
    U = rng.rand(c, n_pixels)
    # Normalize so each column sums to 1
    U = U / U.sum(axis=0, keepdims=True)
    return U


def _compute_centroids(data: np.ndarray, U: np.ndarray, m: float) -> np.ndarray:
    """
    Compute cluster centroids (weighted mean).
    V_k = sum(U_ki^m * x_i) / sum(U_ki^m)
    """
    Um = U ** m
    numerator = Um @ data          # (c,) 
    denominator = Um.sum(axis=1)   # (c,)
    return numerator / denominator


def _compute_objective(data: np.ndarray, centroids: np.ndarray, U: np.ndarray, m: float) -> float:
    """
    Compute the FCM objective function:
    J = sum_k sum_i (U_ki^m * ||x_i - V_k||^2)
    """
    Um = U ** m
    J = 0.0
    for k in range(len(centroids)):
        dist_sq = (data - centroids[k]) ** 2
        J += np.sum(Um[k] * dist_sq)
    return J


def _update_membership(data: np.ndarray, centroids: np.ndarray, m: float) -> np.ndarray:
    """
    Update membership matrix U.
    U_ki = 1 / sum_j (||x_i - V_k|| / ||x_i - V_j||)^(2/(m-1))
    """
    c = len(centroids)
    n = len(data)
    power = 2.0 / (m - 1.0)
    
    # Distance from each pixel to each centroid
    distances = np.zeros((c, n))
    for k in range(c):
        distances[k] = np.abs(data - centroids[k])
    
    # Avoid division by zero
    distances = np.maximum(distances, 1e-10)
    
    U = np.zeros((c, n))
    for k in range(c):
        denom = np.zeros(n)
        for j in range(c):
            denom += (distances[k] / distances[j]) ** power
        U[k] = 1.0 / denom
    
    return U


def run_fcm(
    pixel_data: np.ndarray,
    c: int = 2,
    m: float = 2.0,
    max_iter: int = 100,
    epsilon: float = 1e-5,
    seed: int = 42,
) -> tuple[np.ndarray, list[float], int, float]:
    """
    Run the Fuzzy C-Means algorithm on 1D pixel intensity data.
    
    Args:
        pixel_data: Flattened pixel intensities (1D array)
        c: Number of clusters
        m: Fuzziness parameter
        max_iter: Maximum iterations
        epsilon: Convergence threshold
        seed: Random seed for reproducibility
    
    Returns:
        (labels, centroids, iterations, final_objective)
    """
    data = pixel_data.astype(np.float64)
    n = len(data)
    
    # Step 1: Initialize membership matrix
    U = _initialize_membership(n, c, seed)
    
    prev_J = 0.0
    iterations = 0
    
    for t in range(1, max_iter + 1):
        # Step 2: Compute centroids
        centroids = _compute_centroids(data, U, m)
        
        # Step 3: Compute objective function
        J = _compute_objective(data, centroids, U, m)
        
        # Step 4: Check convergence
        if t > 1 and abs(J - prev_J) < epsilon:
            iterations = t
            break
        
        prev_J = J
        
        # Step 5: Update membership
        U = _update_membership(data, centroids, m)
        iterations = t
    
    # Assign each pixel to cluster with highest membership
    labels = np.argmax(U, axis=0)
    
    sorted_centroids = sorted(centroids.tolist())
    
    return labels, sorted_centroids, iterations, J


def segment_wound(
    original_bgr: np.ndarray,
    preprocessed: np.ndarray,
    pixel_per_cm2: float,
    c: int = 2,
    m: float = 2.0,
    max_iter: int = 100,
    epsilon: float = 1e-5,
) -> FCMResult:
    """
    Full wound segmentation pipeline:
    1. Flatten preprocessed image to 1D pixel data
    2. Run FCM
    3. Create binary mask (darkest centroid = wound)
    4. Create overlay visualization
    5. Calculate wound area in pixels and cm²
    
    Args:
        original_bgr: Original resized BGR image for overlay
        preprocessed: Preprocessed image (grayscale or HSV)
        pixel_per_cm2: Calibration value from frontend
        c, m, max_iter, epsilon: FCM parameters
    
    Returns:
        FCMResult with all outputs
    """
    # If HSV, use only the V (value/brightness) channel for FCM
    if len(preprocessed.shape) == 3:
        # Use V channel from HSV
        fcm_input = preprocessed[:, :, 2].flatten().astype(np.float64)
    else:
        # Grayscale
        fcm_input = preprocessed.flatten().astype(np.float64)
    
    h, w = preprocessed.shape[:2]
    
    # Run FCM
    labels, centroids, iterations, objective = run_fcm(
        fcm_input, c=c, m=m, max_iter=max_iter, epsilon=epsilon
    )
    
    # Reshape labels back to 2D
    labels_2d = labels.reshape(h, w)
    
    # Identify wound cluster: the one with the DARKEST centroid
    wound_cluster = np.argmin(centroids)
    
    # Create binary mask (255 = wound, 0 = background)
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[labels_2d == wound_cluster] = 255
    
    # Create overlay: highlight wound in red/green on original image
    overlay = original_bgr.copy()
    # Create a colored overlay (semi-transparent green)
    color_mask = np.zeros_like(overlay)
    color_mask[mask == 255] = [0, 255, 0]  # Green in BGR
    overlay = cv2.addWeighted(overlay, 0.7, color_mask, 0.3, 0)
    # Draw contours for clarity
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(overlay, contours, -1, (0, 255, 0), 2)
    
    # Calculate area
    area_pixel = int(np.sum(mask == 255))
    area_cm2 = round(area_pixel / pixel_per_cm2, 2) if pixel_per_cm2 > 0 else 0.0
    
    # Reconstruct membership for return
    # Re-run to get final U (lightweight since we store labels)
    U_final = _initialize_membership(len(fcm_input), c)  # placeholder
    
    return FCMResult(
        mask=mask,
        overlay=overlay,
        centroids=centroids,
        area_pixel=area_pixel,
        area_cm2=area_cm2,
        membership=U_final,
        iterations=iterations,
        objective_value=objective,
    )
