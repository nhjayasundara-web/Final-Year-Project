from datetime import datetime, timezone

import jwt
from flask import Blueprint, current_app, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from ..utils import clean_text, public_user, require_auth, require_rate_limit

ROLES = {"patient", "caregiver", "doctor", "pharmacist", "admin"}
PUBLIC_ROLES = {"patient", "caregiver"}

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def make_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user["id"],
        "email": user["email"],
        "role": user.get("role", "patient"),
        "iat": now,
        "exp": now + current_app.config["JWT_EXPIRES"],
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET"], algorithm="HS256")


@auth_bp.post("/register")
@require_rate_limit("auth-register", limit=8, window_seconds=300)
def register():
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
    if role not in ROLES:
        return jsonify({"error": "Invalid role"}), 400
    if role not in PUBLIC_ROLES:
        return jsonify({"error": "Only patient and caregiver accounts can be created through public registration"}), 403
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
                "consents": {
                    "privacyAccepted": True,
                    "termsAccepted": True,
                },
            },
        },
    )
    token = make_token(user)
    return jsonify({"token": token, "user": public_user(user)}), 201


@auth_bp.post("/login")
@require_rate_limit("auth-login", limit=10, window_seconds=300)
def login():
    data = request.get_json(silent=True) or {}
    email = clean_text(data.get("email"), 180).lower()
    password = str(data.get("password") or "")
    user = current_app.store.find_one("users", lambda item: item.get("email", "").lower() == email)
    if not user or not check_password_hash(user.get("passwordHash", ""), password):
        return jsonify({"error": "Invalid email or password"}), 401
    if not user.get("isActive", True):
        return jsonify({"error": "This account has been disabled. Contact an administrator."}), 403
    return jsonify({"token": make_token(user), "user": public_user(user)})


@auth_bp.get("/me")
@require_auth()
def me():
    return jsonify({"user": public_user(request.user)})


@auth_bp.patch("/me")
@require_auth()
def update_me():
    data = request.get_json(silent=True) or {}
    patch = {}
    if "name" in data:
        patch["name"] = clean_text(data.get("name"), 120)
    if "profile" in data and isinstance(data.get("profile"), dict):
        profile = request.user.get("profile", {})
        profile.update(data["profile"])
        patch["profile"] = profile
    if not patch:
        return jsonify({"error": "No valid fields to update"}), 400
    updated = current_app.store.update("users", request.user["id"], patch)
    return jsonify({"user": public_user(updated)})
