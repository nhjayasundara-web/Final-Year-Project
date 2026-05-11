# ============================================================
# HOPE — Medicine & Hospital Models (MongoDB)
# Save to: backend/app/models/medicine.py
# ============================================================

from datetime import datetime, timezone
from bson     import ObjectId
import re

# ── MEDICINE ─────────────────────────────────────────────────

def search_medicines(db, query: str, district: str = None, limit: int = 20) -> list:
    """Full-text search on medicine name/generic/brand."""
    regex   = re.compile(query, re.IGNORECASE) if query else None
    filter_ = {}
    if regex:
        filter_["$or"] = [
            {"name":         regex},
            {"generic_name": regex},
            {"brand":        regex},
        ]
    if district:
        filter_["pharmacies.district"] = district

    cursor = db.medicines.find(filter_).limit(limit)
    return [_serialize_med(m) for m in cursor]


def get_medicine_by_id(db, med_id: str) -> dict | None:
    try:
        m = db.medicines.find_one({"_id": ObjectId(med_id)})
        return _serialize_med(m) if m else None
    except Exception:
        return None


def get_pharmacies_for_medicine(db, med_id: str, district: str = None) -> list:
    m = get_medicine_by_id(db, med_id)
    if not m:
        return []
    pharmacies = m.get("pharmacies", [])
    if district:
        pharmacies = [p for p in pharmacies if p.get("district") == district]
    return pharmacies


def update_stock(db, pharmacy_id: str, med_id: str, in_stock: bool):
    now = datetime.now(timezone.utc)
    db.medicines.update_one(
        {"_id": ObjectId(med_id), "pharmacies.pharmacy_id": pharmacy_id},
        {"$set": {
            "pharmacies.$.in_stock":      in_stock,
            "pharmacies.$.last_updated":  now,
        }}
    )


def _serialize_med(doc: dict) -> dict:
    if not doc:
        return doc
    doc = dict(doc)
    if "_id" in doc and not isinstance(doc["_id"], str):
        doc["_id"] = str(doc["_id"])
    return doc


# ── HOSPITAL ─────────────────────────────────────────────────

def search_hospitals(db, district: str = None, specialty: str = None, limit: int = 50) -> list:
    filter_ = {}
    if district:
        filter_["district"] = district
    if specialty:
        filter_["specialties"] = {"$regex": specialty, "$options": "i"}

    cursor = db.hospitals.find(filter_).limit(limit)
    return [_serialize_hosp(h) for h in cursor]


def get_hospital_by_id(db, hosp_id: str) -> dict | None:
    try:
        h = db.hospitals.find_one({"_id": ObjectId(hosp_id)})
        return _serialize_hosp(h) if h else None
    except Exception:
        return None


def get_nearby_hospitals(db, lat: float, lng: float, radius_km: float = 20) -> list:
    """
    MongoDB $geoNear query — requires a 2dsphere index on location field.
    Ensure: db.hospitals.create_index([("location", "2dsphere")])
    """
    cursor = db.hospitals.find({
        "location": {
            "$near": {
                "$geometry": {"type": "Point", "coordinates": [lng, lat]},
                "$maxDistance": radius_km * 1000,
            }
        }
    }).limit(20)
    return [_serialize_hosp(h) for h in cursor]


def _serialize_hosp(doc: dict) -> dict:
    if not doc:
        return doc
    doc = dict(doc)
    if "_id" in doc and not isinstance(doc["_id"], str):
        doc["_id"] = str(doc["_id"])
    return doc
