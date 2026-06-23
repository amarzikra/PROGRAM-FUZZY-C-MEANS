from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings
from app.core.database import engine, Base
from app.models import User, Patient, WoundImage  # noqa: F401 — ensures models are registered
from app.routers import auth, patients, upload, analyze

# Create all tables on startup (dev only — use Alembic in production)
Base.metadata.create_all(bind=engine)

# Create uploads directory if it doesn't exist
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API Backend untuk Sistem Segmentasi & Estimasi Luas Luka Ulkus Diabetikum berbasis Fuzzy C-Means",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploaded images
app.mount("/files", StaticFiles(directory=settings.UPLOAD_DIR), name="files")

# Include routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(upload.router)
app.include_router(analyze.router)

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
