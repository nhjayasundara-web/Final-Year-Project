import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def _split_csv(value, default):
    raw = value or default
    return [item.strip() for item in raw.split(",") if item.strip()]


class Config:
    DEBUG = os.getenv("FLASK_ENV", "development") == "development"
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    JWT_SECRET = os.getenv("JWT_SECRET", SECRET_KEY)
    JWT_EXPIRES = timedelta(hours=int(os.getenv("JWT_EXPIRES_HOURS", "24")))
    MONGO_URI = os.getenv("MONGO_URI", "").strip()
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "hope_app")
    DATA_DIR = os.getenv("DATA_DIR", str(BASE_DIR / "data"))
    CORS_ORIGINS = _split_csv(os.getenv("CORS_ORIGINS"), "http://localhost:5173,http://localhost:8080")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", str(BASE_DIR / "uploads"))
    MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "8"))
    MAX_CONTENT_LENGTH = MAX_UPLOAD_MB * 1024 * 1024

    # AI model configuration. The default service is safe: if no trained model is
    # supplied, it returns a clearly labelled demo heuristic, not a diagnosis.
    MODEL_PATH = os.getenv("MODEL_PATH", "").strip()
    MODEL_LABELS_PATH = os.getenv("MODEL_LABELS_PATH", "").strip()
    MODEL_IMAGE_SIZE = int(os.getenv("MODEL_IMAGE_SIZE", "224"))
    MODEL_PREPROCESSING = os.getenv("MODEL_PREPROCESSING", "mobilenet_v2").strip().lower()
