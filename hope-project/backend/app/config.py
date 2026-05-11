# ============================================================
# HOPE — Flask Configuration
# Save to: backend/app/config.py
# ============================================================

import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ── Security ──
    SECRET_KEY           = os.getenv("SECRET_KEY", "hope-dev-secret-change-in-production")
    JWT_SECRET_KEY       = os.getenv("JWT_SECRET_KEY", "hope-jwt-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES  = timedelta(days=7)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # ── MongoDB Atlas ──
    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
    )
    DB_NAME = os.getenv("DB_NAME", "hope_db")

    # ── CORS ──
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

    # ── Cloud Storage (Cloudinary) ──
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY    = os.getenv("CLOUDINARY_API_KEY",    "")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")

    # ── Email (SMTP) ──
    MAIL_SERVER   = os.getenv("MAIL_SERVER",   "smtp.gmail.com")
    MAIL_PORT     = int(os.getenv("MAIL_PORT", "587"))
    MAIL_USE_TLS  = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
    MAIL_FROM     = os.getenv("MAIL_FROM",     "noreply@hope.lk")

    # ── ML Model ──
    MODEL_PATH = os.getenv("MODEL_PATH", "ml/model/breast_cancer_model.h5")

    # ── File Upload ──
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024   # 10 MB
    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

    # ── Debug ──
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"


class DevelopmentConfig(Config):
    DEBUG    = True
    MONGO_URI = os.getenv("MONGO_URI_DEV", "mongodb://localhost:27017/")
    DB_NAME   = "hope_dev"


class ProductionConfig(Config):
    DEBUG = False


# Select config based on FLASK_ENV
config_map = {
    "development": DevelopmentConfig,
    "production":  ProductionConfig,
}
