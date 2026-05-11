# ============================================================
# HOPE — Detection Routes (Image Analysis + Symptom Checker)
# Save to: backend/app/routes/detection.py
# ============================================================

from flask              import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime           import datetime, timezone
from bson               import ObjectId
from app                import db
from app.services.ml_service     import predict_image, check_symptoms_risk
from app.services.cloud_storage  import upload_image_to_cloud
import os, uuid

detection_bp = Blueprint("detection", __name__)

def ok(data, message="Success", status=200):
    return jsonify({"success": True,  "data": data,    "message": message}), status

def err(message, status=400):
    return jsonify({"success": False, "error": message}), status

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ── POST /api/detect/image ───────────────────────────────────
@detection_bp.route("/image", methods=["POST"])
@jwt_required(optional=True)
def detect_image():
    """
    Accepts: multipart/form-data with 'image' field.
    Returns: AI prediction result.
    NOTE: For demo/development, returns a mock result if model not loaded.
    """
    if "image" not in request.files:
        return err("No image file provided.")

    file = request.files["image"]
    if not file.filename or not allowed_file(file.filename):
        return err("Invalid file. Please upload a JPG or PNG image.")

    if len(file.read()) > 10 * 1024 * 1024:
        return err("File too large. Maximum size is 10 MB.")
    file.seek(0)

    try:
        # Upload to Cloudinary / Firebase
        image_url = upload_image_to_cloud(file)

        # Run TensorFlow inference
        prediction_result = predict_image(file)

        # Save detection record
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except Exception:
            pass

        now    = datetime.now(timezone.utc)
        record = {
            "user_id":        user_id,
            "image_url":      image_url,
            "prediction":     prediction_result["prediction"],
            "confidence":     prediction_result["confidence"],
            "recommendation": prediction_result["recommendation"],
            "created_at":     now,
        }
        result = db.detections.insert_one(record)
        record["_id"] = str(result.inserted_id)
        record["created_at"] = now.isoformat()

        return ok(record)

    except Exception as e:
        current_app.logger.error(f"Detection error: {e}")
        return err("Analysis failed. Please try again with a clearer image.", 500)


# ── POST /api/detect/symptoms ────────────────────────────────
@detection_bp.route("/symptoms", methods=["POST"])
def detect_symptoms():
    """
    Accepts: JSON { "symptoms": ["symptom1", "symptom2", ...] }
    Returns: Risk level and recommendation.
    """
    data     = request.get_json(silent=True) or {}
    symptoms = data.get("symptoms", [])

    if not symptoms or not isinstance(symptoms, list):
        return err("Please provide a list of symptoms.")
    if len(symptoms) > 20:
        return err("Too many symptoms provided.")

    result = check_symptoms_risk(symptoms)
    return ok(result)


# ── GET /api/detect/history ──────────────────────────────────
@detection_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    """Return the logged-in user's detection history."""
    user_id = get_jwt_identity()
    page    = int(request.args.get("page",  1))
    limit   = int(request.args.get("limit", 10))

    total   = db.detections.count_documents({"user_id": user_id})
    cursor  = db.detections.find({"user_id": user_id}) \
                            .sort("created_at", -1) \
                            .skip((page - 1) * limit) \
                            .limit(limit)

    records = []
    for r in cursor:
        r["_id"] = str(r["_id"])
        if isinstance(r.get("created_at"), datetime):
            r["created_at"] = r["created_at"].isoformat()
        records.append(r)

    return ok({
        "records":     records,
        "total":       total,
        "page":        page,
        "total_pages": -(-total // limit),
    })
