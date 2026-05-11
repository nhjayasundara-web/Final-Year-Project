# ============================================================
# HOPE — Hospital Routes
# Save to: backend/app/routes/hospital.py
# ============================================================

from flask   import Blueprint, request, jsonify
from app     import db
from app.models.medicine import (
    search_hospitals, get_hospital_by_id, get_nearby_hospitals
)

hospital_bp = Blueprint("hospital", __name__)

def ok(data, msg="Success", status=200):
    return jsonify({"success": True,  "data": data,   "message": msg}), status
def err(msg, status=400):
    return jsonify({"success": False, "error": msg}), status


@hospital_bp.route("/search", methods=["GET"])
def search():
    district  = request.args.get("district",  None)
    specialty = request.args.get("specialty", None)
    hospitals = search_hospitals(db, district, specialty)
    return ok({"hospitals": hospitals, "total": len(hospitals)})


@hospital_bp.route("/<hosp_id>", methods=["GET"])
def get_hospital(hosp_id):
    h = get_hospital_by_id(db, hosp_id)
    if not h:
        return err("Hospital not found.", 404)
    return ok(h)


@hospital_bp.route("/nearby", methods=["GET"])
def nearby():
    try:
        lat    = float(request.args.get("lat"))
        lng    = float(request.args.get("lng"))
        radius = float(request.args.get("radius", 20))
    except (TypeError, ValueError):
        return err("lat, lng must be valid numbers.")
    hospitals = get_nearby_hospitals(db, lat, lng, radius)
    return ok({"hospitals": hospitals, "total": len(hospitals)})
