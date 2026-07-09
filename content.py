from flask import Blueprint, current_app, jsonify, request
from werkzeug.security import generate_password_hash

from ..utils import audit_fields, clean_text, public_user, require_auth, safe_bool

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

ALLOWED_ROLES = {"patient", "caregiver", "doctor", "pharmacist", "admin"}


@admin_bp.get("/users")
@require_auth(["admin"])
def list_users():
    users = sorted(current_app.store.all("users"), key=lambda item: (item.get("role", ""), item.get("name", "")))
    summary = {role: 0 for role in sorted(ALLOWED_ROLES)}
    for user in users:
        summary[user.get("role", "patient")] = summary.get(user.get("role", "patient"), 0) + 1
    return jsonify({"items": [public_user(user) for user in users], "summary": summary})


@admin_bp.post("/users")
@require_auth(["admin"])
def create_user():
    data = request.get_json(silent=True) or {}
    name = clean_text(data.get("name"), 120)
    email = clean_text(data.get("email"), 180).lower()
    password = str(data.get("password") or "")
    role = clean_text(data.get("role") or "patient", 40).lower()

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400
    if "@" not in email:
        return jsonify({"error": "A valid email is required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if role not in ALLOWED_ROLES:
        return jsonify({"error": "Invalid role"}), 400
    existing = current_app.store.find_one("users", lambda user: user.get("email", "").lower() == email)
    if existing:
        return jsonify({"error": "Email is already registered"}), 409

    user = current_app.store.insert(
        "users",
        {
            "name": name,
            "email": email,
            "role": role,
            "isActive": True,
            "passwordHash": generate_password_hash(password),
            "profile": {
                "language": "English",
                "remindersEnabled": True,
                "createdByAdminId": request.user["id"],
            },
            **audit_fields(request.user),
        },
    )
    return jsonify({"user": public_user(user)}), 201


@admin_bp.patch("/users/<user_id>")
@require_auth(["admin"])
def update_user(user_id):
    target = current_app.store.get("users", user_id)
    if not target:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json(silent=True) or {}
    patch = {}
    if "name" in data:
        patch["name"] = clean_text(data.get("name"), 120)
    if "role" in data:
        role = clean_text(data.get("role"), 40).lower()
        if role not in ALLOWED_ROLES:
            return jsonify({"error": "Invalid role"}), 400
        patch["role"] = role
    if "isActive" in data:
        patch["isActive"] = safe_bool(data.get("isActive"))
    if "password" in data:
        password = str(data.get("password") or "")
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400
        patch["passwordHash"] = generate_password_hash(password)
    if not patch:
        return jsonify({"error": "No valid fields to update"}), 400

    patch["updatedBy"] = request.user["id"]
    updated = current_app.store.update("users", user_id, patch)
    return jsonify({"user": public_user(updated)})


@admin_bp.get("/overview")
@require_auth(["admin"])
def overview():
    users = current_app.store.all("users")
    posts = current_app.store.all("community_posts")
    articles = current_app.store.all("articles")
    providers = current_app.store.all("providers")
    appointments = current_app.store.all("appointments")
    medicine_requests = current_app.store.all("medicine_requests")
    ai_results = current_app.store.all("ai_results")

    return jsonify(
        {
            "counts": {
                "users": len(users),
                "postsPending": len([item for item in posts if item.get("moderationStatus", "approved") != "approved"]),
                "articlesPending": len([item for item in articles if item.get("reviewStatus", "published") != "published"]),
                "providersPending": len([item for item in providers if not item.get("isActive", True)]),
                "appointments": len(appointments),
                "medicineRequests": len(medicine_requests),
                "aiUploads": len(ai_results),
            },
            "recentCommunityPosts": sorted(posts, key=lambda item: item.get("createdAt", ""), reverse=True)[:5],
            "recentAiResults": sorted(ai_results, key=lambda item: item.get("createdAt", ""), reverse=True)[:5],
        }
    )


@admin_bp.patch("/community/posts/<post_id>")
@require_auth(["admin"])
def moderate_post(post_id):
    post = current_app.store.get("community_posts", post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    status = clean_text((request.get_json(silent=True) or {}).get("moderationStatus"), 40).lower()
    if status not in {"pending", "approved", "hidden"}:
        return jsonify({"error": "Invalid moderation status"}), 400
    updated = current_app.store.update("community_posts", post_id, {"moderationStatus": status, "updatedBy": request.user["id"]})
    return jsonify({"item": updated})


@admin_bp.patch("/providers/<provider_id>/verify")
@require_auth(["admin"])
def verify_provider(provider_id):
    provider = current_app.store.get("providers", provider_id)
    if not provider:
        return jsonify({"error": "Provider not found"}), 404
    data = request.get_json(silent=True) or {}
    updated = current_app.store.update(
        "providers",
        provider_id,
        {
            "isActive": safe_bool(data.get("isActive", True)),
            "verifiedBy": request.user.get("name"),
            "verificationSource": clean_text(data.get("verificationSource"), 120) or "admin-review",
            "updatedBy": request.user["id"],
        },
    )
    return jsonify({"item": updated})
