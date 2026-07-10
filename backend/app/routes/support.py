from flask import Blueprint, current_app, jsonify

support_bp = Blueprint("support", __name__, url_prefix="/api/support")


@support_bp.get("")
def support_home():
    resources = current_app.store.all("support_resources")
    affirmations = [
        "You do not have to handle uncertainty alone.",
        "A check-up is an act of strength, not fear.",
        "Small steps today can protect tomorrow.",
        "Your questions are valid. Write them down and ask for answers.",
    ]
    counsellors = [
        {"name": "Pink Ribbon Counselling Unit", "mode": "Phone or video", "contact": "+94 81 000 0002", "isDemo": True},
        {"name": "Caregiver Support Circle", "mode": "Community group", "contact": "support@hope.local", "isDemo": True},
    ]
    return jsonify(
        {
            "resources": resources,
            "affirmations": affirmations,
            "counsellors": counsellors,
            "urgentNote": "If you feel unsafe, severely distressed, or at risk of self-harm, contact local emergency services immediately.",
        }
    )
