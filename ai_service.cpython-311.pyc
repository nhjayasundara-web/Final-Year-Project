from flask import Blueprint, current_app, jsonify, request

from ..utils import audit_fields, clean_text, contains, current_user_optional, require_auth, safe_bool

providers_bp = Blueprint("providers", __name__, url_prefix="/api")


@providers_bp.get("/providers")
def list_providers():
    city = clean_text(request.args.get("city"), 80).lower()
    provider_type = clean_text(request.args.get("type"), 80).lower()
    query = clean_text(request.args.get("q"), 120).lower()
    user = current_user_optional()
    items = current_app.store.all("providers")
    if city:
        items = [item for item in items if contains(item.get("city"), city)]
    if provider_type:
        items = [item for item in items if contains(item.get("type"), provider_type)]
    if query:
        items = [
            item
            for item in items
            if contains(item.get("name"), query)
            or contains(item.get("type"), query)
            or contains(" ".join(item.get("services", [])), query)
        ]
    visible = items if user and user.get("role") == "admin" else [item for item in items if item.get("isActive", True)]
    return jsonify({"items": sorted(visible, key=lambda item: item.get("name", ""))})


@providers_bp.post("/appointments")
def request_appointment():
    data = request.get_json(silent=True) or {}
    user = current_user_optional()
    provider_id = clean_text(data.get("providerId"), 80)
    provider = current_app.store.get("providers", provider_id) if provider_id else None
    reason = clean_text(data.get("reason"), 800)
    contact = clean_text(data.get("contact"), 120)
    patient_name = clean_text(data.get("patientName"), 120)

    if not provider:
        return jsonify({"error": "Valid provider is required"}), 400
    if not reason or not contact:
        return jsonify({"error": "Reason and contact details are required"}), 400

    appointment = current_app.store.insert(
        "appointments",
        {
            "userId": user.get("id") if user else None,
            "patientName": patient_name or (user.get("name") if user else ""),
            "contact": contact,
            "providerId": provider_id,
            "providerName": provider.get("name"),
            "preferredDate": clean_text(data.get("preferredDate"), 50),
            "reason": reason,
            "status": "requested",
            **audit_fields(user),
        },
    )
    return jsonify({"item": appointment, "message": "Appointment request submitted."}), 201


@providers_bp.get("/appointments/mine")
@require_auth()
def my_appointments():
    items = current_app.store.find("appointments", lambda item: item.get("userId") == request.user["id"])
    return jsonify({"items": sorted(items, key=lambda item: item.get("createdAt", ""), reverse=True)})


@providers_bp.get("/doctor/overview")
@require_auth(["doctor"])
def doctor_overview():
    appointments = current_app.store.all("appointments")
    articles = current_app.store.all("articles")
    providers = current_app.store.all("providers")
    return jsonify(
        {
            "appointments": sorted(appointments, key=lambda item: item.get("createdAt", ""), reverse=True),
            "articles": sorted(articles, key=lambda item: item.get("updatedAt", ""), reverse=True),
            "providers": sorted(providers, key=lambda item: item.get("name", "")),
        }
    )


@providers_bp.patch("/doctor/appointments/<appointment_id>")
@require_auth(["doctor", "admin"])
def update_appointment(appointment_id):
    appointment = current_app.store.get("appointments", appointment_id)
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404
    status = clean_text((request.get_json(silent=True) or {}).get("status"), 40).lower()
    if status not in {"requested", "reviewing", "scheduled", "completed"}:
        return jsonify({"error": "Invalid appointment status"}), 400
    updated = current_app.store.update("appointments", appointment_id, {"status": status, "updatedBy": request.user["id"]})
    return jsonify({"item": updated})
