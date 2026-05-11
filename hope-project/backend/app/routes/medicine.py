# ============================================================
# HOPE — Medicine Routes
# Save to: backend/app/routes/medicine.py
# ============================================================

from flask              import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app                import db
from app.models.medicine import (
    search_medicines, get_medicine_by_id,
    get_pharmacies_for_medicine, update_stock
)

medicine_bp = Blueprint("medicine", __name__)

def ok(data, msg="Success", status=200):
    return jsonify({"success": True,  "data": data,   "message": msg}), status
def err(msg, status=400):
    return jsonify({"success": False, "error": msg}), status


@medicine_bp.route("/search", methods=["GET"])
def search():
    query    = request.args.get("query",    "")
    district = request.args.get("district", None)
    results  = search_medicines(db, query, district)
    return ok({"medicines": results, "total": len(results)})


@medicine_bp.route("/<med_id>", methods=["GET"])
def get_medicine(med_id):
    med = get_medicine_by_id(db, med_id)
    if not med:
        return err("Medicine not found.", 404)
    return ok(med)


@medicine_bp.route("/<med_id>/pharmacies", methods=["GET"])
def pharmacies(med_id):
    district    = request.args.get("district", None)
    pharmacies  = get_pharmacies_for_medicine(db, med_id, district)
    return ok({"pharmacies": pharmacies, "total": len(pharmacies)})


@medicine_bp.route("/stock-report", methods=["POST"])
@jwt_required()
def stock_report():
    data = request.get_json(silent=True) or {}
    if not all(k in data for k in ("pharmacyId", "medicineId", "inStock")):
        return err("pharmacyId, medicineId and inStock are required.")
    update_stock(db, data["pharmacyId"], data["medicineId"], data["inStock"])
    return ok(None, "Stock report submitted. Thank you!")


# ============================================================
# HOPE — Hospital Routes
# Save to: backend/app/routes/hospital.py
# ============================================================
# NOTE: Create a separate file at backend/app/routes/hospital.py
#       with the content below the separator line.

"""
SEPARATE FILE — backend/app/routes/hospital.py
"""
