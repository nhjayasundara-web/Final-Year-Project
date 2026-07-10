from flask import Blueprint, current_app, jsonify, request

from ..utils import audit_fields, clean_text, current_user_optional, require_auth
content_bp = Blueprint("content", __name__, url_prefix="/api/content")


@content_bp.get("/articles")
def list_articles():
    articles = sorted(current_app.store.all("articles"), key=lambda item: item.get("title", ""))
    user = current_user_optional()
    if not user or user.get("role") not in {"admin", "doctor"}:
        articles = [item for item in articles if item.get("reviewStatus", "published") == "published"]
    return jsonify({"items": articles})


@content_bp.get("/articles/<slug>")
def get_article(slug):
    article = current_app.store.find_one("articles", lambda item: item.get("slug") == slug)
    if not article:
        return jsonify({"error": "Article not found"}), 404
    user = current_user_optional()
    if article.get("reviewStatus", "published") != "published" and (not user or user.get("role") not in {"admin", "doctor"}):
        return jsonify({"error": "Article not found"}), 404
    return jsonify({"item": article})


@content_bp.get("/self-exam")
def self_exam():
    steps = sorted(current_app.store.all("self_exam_steps"), key=lambda item: item.get("order", 0))
    return jsonify(
        {
            "title": "Guided self-examination",
            "disclaimer": "Self-awareness helps you notice changes. It does not replace screening or professional diagnosis.",
            "steps": steps,
        }
    )


@content_bp.patch("/articles/<article_id>")
@require_auth(["admin", "doctor"])
def update_article(article_id):
    article = current_app.store.get("articles", article_id)
    if not article:
        return jsonify({"error": "Article not found"}), 404
    data = request.get_json(silent=True) or {}
    patch = {}
    if "reviewStatus" in data:
        review_status = clean_text(data.get("reviewStatus"), 40).lower()
        if review_status not in {"draft", "in-review", "published"}:
            return jsonify({"error": "Invalid review status"}), 400
        patch["reviewStatus"] = review_status
        patch["reviewedBy"] = request.user.get("name")
        patch["reviewerRole"] = request.user.get("role")
    for key, limit in {
        "lastReviewed": 40,
        "nextReviewDate": 40,
        "countryApplicability": 80,
        "clinicalDisclaimer": 400,
        "version": 40,
    }.items():
        if key in data:
            patch[key] = clean_text(data.get(key), limit)
    if not patch:
        return jsonify({"error": "No valid fields to update"}), 400
    patch["updatedBy"] = request.user["id"]
    updated = current_app.store.update("articles", article_id, patch)
    return jsonify({"item": updated})
