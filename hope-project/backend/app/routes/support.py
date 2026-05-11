# ============================================================
# HOPE — Support Routes
# Save to: backend/app/routes/support.py
# ============================================================

from flask              import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime           import datetime, timezone
from app                import db

support_bp = Blueprint("support", __name__)

def ok(data, msg="Success", s=200):
    return jsonify({"success": True,  "data": data,   "message": msg}), s
def err(msg, s=400):
    return jsonify({"success": False, "error": msg}), s

def _serialize(doc):
    if not doc: return doc
    doc = dict(doc)
    if "_id" in doc: doc["_id"] = str(doc["_id"])
    return doc


@support_bp.route("/counsellors", methods=["GET"])
def list_counsellors():
    language = request.args.get("language")
    query    = {}
    if language:
        query["languages"] = language
    counsellors = list(db.counsellors.find(query))
    return ok({"counsellors": [_serialize(c) for c in counsellors]})


@support_bp.route("/motivational", methods=["GET"])
def motivational():
    content = list(db.motivational.find().limit(20))
    return ok([_serialize(c) for c in content])


@support_bp.route("/book/<counsellor_id>", methods=["POST"])
@jwt_required()
def book_appointment(counsellor_id):
    user_id = get_jwt_identity()
    data    = request.get_json(silent=True) or {}
    if not data.get("date") or not data.get("time"):
        return err("Date and time are required.")

    now     = datetime.now(timezone.utc)
    booking = {
        "user_id":       user_id,
        "counsellor_id": counsellor_id,
        "date":          data["date"],
        "time":          data["time"],
        "session_type":  data.get("sessionType", "online"),
        "notes":         data.get("notes", ""),
        "status":        "pending",
        "created_at":    now,
    }
    result          = db.bookings.insert_one(booking)
    booking["_id"]  = str(result.inserted_id)
    booking["created_at"] = now.isoformat()
    return ok(booking, "Appointment booking submitted. Our team will confirm shortly.", 201)


@support_bp.route("/bookings", methods=["GET"])
@jwt_required()
def my_bookings():
    user_id  = get_jwt_identity()
    bookings = list(db.bookings.find({"user_id": user_id}).sort("created_at", -1))
    return ok([_serialize(b) for b in bookings])
