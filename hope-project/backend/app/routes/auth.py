# ============================================================
# HOPE — Auth Routes
# Save to: backend/app/routes/auth.py
# ============================================================

from flask            import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from datetime         import datetime, timezone
from app              import db
from app.models.user  import (
    create_user, find_user_by_email, find_user_by_id,
    check_password, update_user, _safe_user
)

auth_bp = Blueprint("auth", __name__)

def ok(data, message="Success", status=200):
    return jsonify({"success": True,  "data": data,    "message": message}), status

def err(message, status=400):
    return jsonify({"success": False, "error": message}), status


# ── POST /api/auth/register ──────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    required = ["name", "email", "password", "role"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return err(f"Missing required fields: {', '.join(missing)}")

    if data["role"] not in ("patient", "caregiver", "doctor"):
        return err("Invalid role. Must be patient, caregiver, or doctor.")

    if find_user_by_email(db, data["email"]):
        return err("An account with this email already exists.", 409)

    if len(data["password"]) < 8:
        return err("Password must be at least 8 characters.")

    user  = create_user(db, data)
    token = create_access_token(identity=user["_id"])
    refresh = create_refresh_token(identity=user["_id"])

    return ok({"user": user, "token": token, "refresh_token": refresh}, "Account created successfully.", 201)


# ── POST /api/auth/login ─────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    if not data.get("email") or not data.get("password"):
        return err("Email and password are required.")

    user = find_user_by_email(db, data["email"])
    if not user or not check_password(data["password"], user.get("password_hash", "")):
        return err("Incorrect email or password.", 401)

    if not user.get("is_active", True):
        return err("Your account has been suspended. Please contact support.", 403)

    # Update last login
    update_user(db, str(user["_id"]), {"last_login": datetime.now(timezone.utc)})

    token   = create_access_token(identity=str(user["_id"]))
    refresh = create_refresh_token(identity=str(user["_id"]))

    return ok({"user": _safe_user(user), "token": token, "refresh_token": refresh})


# ── GET /api/auth/me ─────────────────────────────────────────
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user    = find_user_by_id(db, user_id)
    if not user:
        return err("User not found.", 404)
    return ok(_safe_user(user))


# ── PUT /api/auth/me ─────────────────────────────────────────
@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data    = request.get_json(silent=True) or {}

    allowed = {"name", "phone", "dateOfBirth", "diagnosisDate", "stage", "specialty", "hospital", "licenseNo"}
    updates = {k: v for k, v in data.items() if k in allowed}

    if not updates:
        return err("No valid fields to update.")

    user = update_user(db, user_id, updates)
    return ok(_safe_user(user))


# ── POST /api/auth/logout ────────────────────────────────────
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # With JWT, logout is handled client-side (delete token).
    # For full revocation, implement a token blocklist here.
    return ok(None, "Logged out successfully.")


# ── POST /api/auth/refresh ───────────────────────────────────
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    token   = create_access_token(identity=user_id)
    return ok({"token": token})
