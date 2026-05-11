# ============================================================
# HOPE — Awareness Routes
# Save to: backend/app/routes/awareness.py
# ============================================================

from flask   import Blueprint, request, jsonify
from app     import db
from bson    import ObjectId
from datetime import datetime

awareness_bp = Blueprint("awareness", __name__)

def ok(data, msg="Success", s=200):
    return jsonify({"success": True,  "data": data,   "message": msg}), s
def err(msg, s=400):
    return jsonify({"success": False, "error": msg}), s

def _s(doc):
    if not doc: return doc
    doc = dict(doc)
    if "_id" in doc: doc["_id"] = str(doc["_id"])
    for k in ("published_at", "created_at"):
        if isinstance(doc.get(k), datetime): doc[k] = doc[k].isoformat()
    return doc


@awareness_bp.route("/articles", methods=["GET"])
def list_articles():
    category = request.args.get("category")
    page     = int(request.args.get("page",  1))
    limit    = int(request.args.get("limit", 12))
    query    = {}
    if category: query["category"] = category
    total  = db.articles.count_documents(query)
    cursor = db.articles.find(query).sort("published_at", -1) \
                        .skip((page-1)*limit).limit(limit)
    return ok({"articles": [_s(a) for a in cursor], "total": total, "page": page})


@awareness_bp.route("/articles/<art_id>", methods=["GET"])
def get_article(art_id):
    try:
        a = db.articles.find_one({"_id": ObjectId(art_id)})
    except Exception:
        return err("Invalid article ID.", 400)
    if not a: return err("Article not found.", 404)
    return ok(_s(a))


@awareness_bp.route("/self-exam", methods=["GET"])
def self_exam_steps():
    """Return ordered self-examination steps."""
    steps = list(db.self_exam_steps.find().sort("step", 1))
    return ok([_s(s) for s in steps])


@awareness_bp.route("/risk-factors", methods=["GET"])
def risk_factors():
    factors = list(db.risk_factors.find())
    return ok([_s(f) for f in factors])


# ============================================================
# HOPE — Support (Counselling) Routes
# Save to: backend/app/routes/support.py
# ============================================================

from flask              import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson               import ObjectId
from datetime           import datetime, timezone

support_bp = Blueprint("support", __name__)

def oks(data, msg="Success", s=200):
    return jsonify({"success": True,  "data": data,   "message": msg}), s
def errs(msg, s=400):
    return jsonify({"success": False, "error": msg}), s

def _ss(doc):
    if not doc: return doc
    doc = dict(doc)
    if "_id" in doc: doc["_id"] = str(doc["_id"])
    return doc


@support_bp.route("/counsellors", methods=["GET"])
def list_counsellors():
    language = request.args.get("language")
    query    = {}
    if language: query["languages"] = language
    counsellors = list(db.counsellors.find(query))
    return oks({"counsellors": [_ss(c) for c in counsellors]})


@support_bp.route("/motivational", methods=["GET"])
def motivational():
    content = list(db.motivational.find().limit(20))
    return oks([_ss(c) for c in content])


@support_bp.route("/book/<counsellor_id>", methods=["POST"])
@jwt_required()
def book_appointment(counsellor_id):
    user_id = get_jwt_identity()
    data    = request.get_json(silent=True) or {}
    if not data.get("date") or not data.get("time"):
        return errs("Date and time are required.")
    now = datetime.now(timezone.utc)
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
    result = db.bookings.insert_one(booking)
    booking["_id"] = str(result.inserted_id)
    booking["created_at"] = now.isoformat()
    return oks(booking, "Appointment booking submitted.", 201)
