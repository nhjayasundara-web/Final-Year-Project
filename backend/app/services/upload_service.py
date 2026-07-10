from pathlib import Path
from uuid import uuid4

from flask import current_app
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def is_allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_upload(file_storage, folder="images"):
    filename = secure_filename(file_storage.filename or "upload.png")
    if not is_allowed(filename):
        raise ValueError("Only PNG, JPG, JPEG, and WEBP images are allowed")
    ext = filename.rsplit(".", 1)[1].lower()
    upload_root = Path(current_app.config["UPLOAD_FOLDER"])
    target_dir = upload_root / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4().hex}.{ext}"
    path = target_dir / stored_name
    file_storage.save(path)
    return {"filename": stored_name, "path": str(path), "originalName": filename}
