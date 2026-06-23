from pydantic import BaseModel
from typing import Optional, List


class FCMParams(BaseModel):
    clusters: int = 2
    fuzziness: float = 2.0
    max_iter: int = 100
    epsilon: float = 1e-5


class AnalyzeRequest(BaseModel):
    image_id: int
    fcm: FCMParams = FCMParams()
    color_space: str = "grayscale"   # 'grayscale' | 'hsv'
    filter: str = "median"           # 'median' | 'gaussian' | 'none'
    pixel_per_cm2: float = 1444.0


class AnalyzeResponse(BaseModel):
    image_id: int
    mask_url: str
    overlay_url: str
    area_pixel: int
    area_cm2: float
    centroids: List[float]
    iterations: int
    metrics: Optional[dict] = None

    class Config:
        from_attributes = True


class EvaluateResponse(BaseModel):
    image_id: int
    dsc: float
    iou: float
    pixel_accuracy: float


class ProgressPoint(BaseModel):
    date: str
    area_cm2: Optional[float] = None
    image_id: int
