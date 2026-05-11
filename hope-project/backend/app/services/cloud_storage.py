# ============================================================
# HOPE — Cloud Storage Service (Cloudinary)
# Save to: backend/app/services/cloud_storage.py
# ============================================================

import cloudinary
import cloudinary.uploader
from flask import current_app
import uuid

def _configure():
    cloudinary.config(
        cloud_name = current_app.config["CLOUDINARY_CLOUD_NAME"],
        api_key    = current_app.config["CLOUDINARY_API_KEY"],
        api_secret = current_app.config["CLOUDINARY_API_SECRET"],
        secure     = True,
    )

def upload_image_to_cloud(file_storage) -> str:
    """
    Upload image to Cloudinary.
    Returns the secure URL of the uploaded image.
    Falls back to a placeholder URL in development.
    """
    try:
        _configure()
        public_id = f"hope/detections/{uuid.uuid4().hex}"
        result    = cloudinary.uploader.upload(
            file_storage,
            public_id    = public_id,
            folder       = "hope/detections",
            resource_type = "image",
            overwrite    = False,
        )
        return result["secure_url"]
    except Exception as e:
        current_app.logger.warning(f"Cloudinary upload failed: {e}. Using placeholder.")
        return "https://placeholder.hope.lk/image.jpg"
