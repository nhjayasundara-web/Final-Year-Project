from flask import Blueprint, current_app, jsonify, request

from ..utils import current_user_optional

assessments_bp = Blueprint("assessments", __name__, url_prefix="/api/assessments")

SYMPTOM_WEIGHTS = {
    "new_lump": 30,
    "underarm_lump": 25,
    "skin_dimpling": 18,
    "nipple_discharge": 20,
    "nipple_change": 18,
    "size_shape_change": 12,
    "pain": 8,
    "redness_scaling": 14,
}


@assessments_bp.post("/risk")
def risk_assessment():
    data = request.get_json(silent=True) or {}
    try:
        age = int(data.get("age") or 0)
    except (TypeError, ValueError):
        return jsonify({"error": "Age must be a number"}), 400
    symptoms = data.get("symptoms") or []
    if not isinstance(symptoms, list):
        symptoms = []

    score = 0
    factors = []

    if age >= 55:
        score += 18
        factors.append("Age 55 or older")
    elif age >= 40:
        score += 10
        factors.append("Age 40 or older")

    if data.get("familyHistory"):
        score += 18
        factors.append("Family history of breast or ovarian cancer")
    if data.get("geneticMutation"):
        score += 30
        factors.append("Known high-risk gene mutation")
    if data.get("priorBiopsy"):
        score += 12
        factors.append("Previous breast biopsy or high-risk breast condition")
    if data.get("chestRadiation"):
        score += 20
        factors.append("Previous chest radiation")
    if data.get("hormoneTherapy"):
        score += 8
        factors.append("Hormone therapy history")
    if data.get("denseBreasts"):
        score += 8
        factors.append("Dense breast tissue")

    symptom_score = sum(SYMPTOM_WEIGHTS.get(symptom, 0) for symptom in symptoms)
    if symptom_score:
        score += symptom_score
        factors.append("Reported breast change or symptom")

    score = min(score, 100)
    if score >= 55 or symptom_score >= 25:
        level = "elevated"
        headline = "Please arrange professional medical review soon."
        recommendations = [
            "Contact a doctor, oncology clinic, or screening center for clinical evaluation.",
            "Do not wait for pain. Some important breast changes are painless.",
            "Bring your symptom dates, family history, medicines, and any previous reports.",
        ]
    elif score >= 25:
        level = "moderate"
        headline = "Discuss your risk profile with a healthcare professional."
        recommendations = [
            "Ask about a personalized screening schedule.",
            "Continue monthly breast awareness and record new changes.",
            "Use HOPE provider search if you need help finding a clinic.",
        ]
    else:
        level = "lower"
        headline = "No urgent risk pattern was detected by this educational tool."
        recommendations = [
            "Stay familiar with your normal breast look and feel.",
            "Follow age-appropriate screening guidance from your healthcare system.",
            "Seek care promptly for any new or worrying change.",
        ]

    result = {
        "score": score,
        "level": level,
        "headline": headline,
        "factors": factors,
        "recommendations": recommendations,
        "disclaimer": "This is not a diagnosis or risk prediction model. It is an educational guide to help decide when to seek professional advice.",
    }

    user = current_user_optional()
    current_app.store.insert(
        "assessments",
        {
            "userId": user.get("id") if user else None,
            "input": data,
            "result": result,
        },
    )
    return jsonify(result)
