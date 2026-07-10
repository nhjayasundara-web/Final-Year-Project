from flask import Blueprint, current_app, jsonify, request

from ..utils import audit_fields, clean_text, contains, current_user_optional, require_auth

medicines_bp = Blueprint("medicines", __name__, url_prefix="/api")


@medicines_bp.get("/medicines")
def list_medicines():
    query = clean_text(request.args.get("q"), 120).lower()
    city = clean_text(request.args.get("city"), 80).lower()
    items = current_app.store.all("medicines")
    if query:
        items = [
            item
            for item in items
            if contains(item.get("name"), query)
            or contains(item.get("type"), query)
            or contains(item.get("pharmacy"), query)
        ]
    if city:
        items = [item for item in items if contains(item.get("city"), city)]
    visible = [item for item in items if item.get("isActive", True)]
    return jsonify(
        {
            "items": sorted(visible, key=lambda item: (item.get("city", ""), item.get("name", ""))),
            "disclaimer": "Medicine information is supportive only. Availability must be confirmed by a pharmacist, and prescription medicines must be used under clinical supervision.",
        }
    )


@medicines_bp.post("/medicine-requests")
def create_medicine_request():
    data = request.get_json(silent=True) or {}
    user = current_user_optional()
    required_name = clean_text(data.get("medicineName"), 120)
    if not required_name:
        return jsonify({"error": "Medicine name is required"}), 400
    record = current_app.store.insert(
        "medicine_requests",
        {
            "userId": user.get("id") if user else None,
            "patientName": clean_text(data.get("patientName"), 120),
            "contact": clean_text(data.get("contact"), 120),
            "medicineName": required_name,
            "city": clean_text(data.get("city"), 80),
            "notes": clean_text(data.get("notes"), 500),
            "status": "received",
            **audit_fields(user),
        },
    )
    return jsonify({"item": record, "message": "Medicine request received. A pharmacy partner should verify availability."}), 201


@medicines_bp.get("/medicine-requests/mine")
@require_auth()
def my_medicine_requests():
    items = current_app.store.find("medicine_requests", lambda item: item.get("userId") == request.user["id"])
    return jsonify({"items": sorted(items, key=lambda item: item.get("createdAt", ""), reverse=True)})


@medicines_bp.get("/pharmacist/overview")
@require_auth(["pharmacist"])
def pharmacist_overview():
    medicines = current_app.store.all("medicines")
    requests_list = current_app.store.all("medicine_requests")
    return jsonify(
        {
            "inventory": sorted(medicines, key=lambda item: item.get("updatedAt", ""), reverse=True),
            "requests": sorted(requests_list, key=lambda item: item.get("createdAt", ""), reverse=True),
            "staleInventoryCount": len([item for item in medicines if item.get("status") in {"Low stock", "Request required"}]),
        }
    )


@medicines_bp.post("/pharmacist/medicines")
@require_auth(["pharmacist", "admin"])
def create_medicine():
    data = request.get_json(silent=True) or {}
    item = current_app.store.insert(
        "medicines",
        {
            "name": clean_text(data.get("name"), 120),
            "type": clean_text(data.get("type"), 120),
            "strength": clean_text(data.get("strength"), 80),
            "pharmacy": clean_text(data.get("pharmacy"), 120),
            "city": clean_text(data.get("city"), 80),
            "status": clean_text(data.get("status"), 80) or "Available",
            "quantity": int(data.get("quantity") or 0),
            "note": clean_text(data.get("note"), 300),
            "isActive": True,
            "updatedByEmail": request.user.get("email"),
            **audit_fields(request.user),
        },
    )
    return jsonify({"item": item}), 201


@medicines_bp.patch("/pharmacist/medicine-requests/<request_id>")
@require_auth(["pharmacist", "admin"])
def update_medicine_request(request_id):
    record = current_app.store.get("medicine_requests", request_id)
    if not record:
        return jsonify({"error": "Medicine request not found"}), 404
    status = clean_text((request.get_json(silent=True) or {}).get("status"), 40).lower()
    if status not in {"received", "reviewing", "resolved", "unavailable"}:
        return jsonify({"error": "Invalid request status"}), 400
    updated = current_app.store.update("medicine_requests", request_id, {"status": status, "updatedBy": request.user["id"]})
    return jsonify({"item": updated})
