from flask import Blueprint, current_app, jsonify, request

from ..services.ai_service import analyze_image
from ..services.upload_service import save_upload
from ..utils import current_user_optional, require_rate_limit

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")


@ai_bp.post("/analyze-image")
@require_rate_limit("ai-analyze", limit=8, window_seconds=300)
def analyze_image_route():
    if "image" not in request.files:
        return jsonify({"error": "Upload an image field named 'image'"}), 400
    if request.form.get("consentAcknowledged") != "true":
        return jsonify({"error": "You must acknowledge the AI image consent before upload"}), 400

    image = request.files["image"]
    if not image.filename:
        return jsonify({"error": "No file selected"}), 400

    try:
        result = analyze_image(image.stream)
        image.stream.seek(0)
        saved = save_upload(image, folder="ai_uploads")
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:  # Keep unexpected model errors safe for users.
        return jsonify({"error": "Image analysis failed", "detail": str(exc)}), 500

    user = current_user_optional()
    record = current_app.store.insert(
        "ai_results",
        {
            "userId": user.get("id") if user else None,
            "image": saved,
            "result": result,
            "consentAcknowledged": True,
            "confidenceBand": result.get("confidenceBand"),
        },
    )
    result["id"] = record["id"]
    return jsonify(result)
