"""
Evaluation service for segmentation quality metrics.
Implements DSC, IoU, and Pixel Accuracy as specified in PRD Section 9.8.

Formulas:
    TP = wound pixels correctly detected
    FP = non-wound pixels falsely detected as wound
    FN = wound pixels not detected
    TN = non-wound pixels correctly not detected

    DSC            = 2*TP / (2*TP + FP + FN)
    IoU            = TP / (TP + FP + FN)
    Pixel Accuracy = (TP + TN) / (TP + TN + FP + FN)
"""
import numpy as np
import cv2
from dataclasses import dataclass


@dataclass
class EvaluationMetrics:
    dsc: float
    iou: float
    pixel_accuracy: float
    tp: int
    fp: int
    fn: int
    tn: int


def compute_metrics(predicted_mask: np.ndarray, ground_truth_mask: np.ndarray) -> EvaluationMetrics:
    """
    Compare FCM-generated mask with manual ground truth mask.
    Both masks should be binary (0 or 255).
    
    Args:
        predicted_mask: Binary mask from FCM (0/255)
        ground_truth_mask: Binary mask from expert annotation (0/255)
    
    Returns:
        EvaluationMetrics with DSC, IoU, Pixel Accuracy
    """
    # Ensure same size
    if predicted_mask.shape != ground_truth_mask.shape:
        ground_truth_mask = cv2.resize(
            ground_truth_mask,
            (predicted_mask.shape[1], predicted_mask.shape[0]),
            interpolation=cv2.INTER_NEAREST,
        )
    
    # Convert to binary (0 or 1)
    pred = (predicted_mask > 127).astype(np.uint8)
    gt = (ground_truth_mask > 127).astype(np.uint8)
    
    # Compute confusion matrix elements
    tp = int(np.sum((pred == 1) & (gt == 1)))
    fp = int(np.sum((pred == 1) & (gt == 0)))
    fn = int(np.sum((pred == 0) & (gt == 1)))
    tn = int(np.sum((pred == 0) & (gt == 0)))
    
    # Compute metrics (handle division by zero)
    dsc_denom = 2 * tp + fp + fn
    dsc = (2 * tp / dsc_denom) if dsc_denom > 0 else 0.0
    
    iou_denom = tp + fp + fn
    iou = (tp / iou_denom) if iou_denom > 0 else 0.0
    
    total = tp + tn + fp + fn
    pixel_accuracy = ((tp + tn) / total) if total > 0 else 0.0
    
    return EvaluationMetrics(
        dsc=round(dsc, 4),
        iou=round(iou, 4),
        pixel_accuracy=round(pixel_accuracy, 4),
        tp=tp, fp=fp, fn=fn, tn=tn,
    )
