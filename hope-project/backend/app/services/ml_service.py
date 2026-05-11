# ============================================================
# HOPE — ML Service: TensorFlow / Keras Inference
# Save to: backend/app/services/ml_service.py
#
# This service loads the breast cancer detection model trained
# with TensorFlow/Keras and provides two functions:
#   1. predict_image()   — analyzes mammogram images
#   2. check_symptoms_risk() — scores symptom-based risk
# ============================================================

import os
import io
import numpy as np
from flask import current_app

# Lazy-load TensorFlow to avoid slow startup in dev
_model = None

def _load_model():
    """Load the Keras model once and cache it."""
    global _model
    if _model is not None:
        return _model
    try:
        import tensorflow as tf
        model_path = current_app.config.get("MODEL_PATH", "ml/model/breast_cancer_model.h5")
        if os.path.exists(model_path):
            _model = tf.keras.models.load_model(model_path)
            current_app.logger.info(f"✅ ML model loaded from {model_path}")
        else:
            current_app.logger.warning(f"⚠️  Model file not found at {model_path}. Using mock predictions.")
    except Exception as e:
        current_app.logger.error(f"❌ Failed to load ML model: {e}")
    return _model


def _preprocess_image(file_storage) -> "np.ndarray":
    """
    Preprocess uploaded image for model input.
    - Resize to 224x224 (matches MobileNetV2/VGG16 input)
    - Normalize pixel values to [0, 1]
    - Add batch dimension
    """
    from PIL import Image
    img_bytes = file_storage.read()
    file_storage.seek(0)                     # reset stream
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)        # (1, 224, 224, 3)
    return arr


def predict_image(file_storage) -> dict:
    """
    Run the TF model on the uploaded image.
    Returns: { prediction, confidence, recommendation }

    Classes (matching training labels):
        0 = normal
        1 = benign
        2 = malignant
    """
    model = _load_model()

    if model is None:
        # ── MOCK RESULT for development (no model file) ──
        return _mock_image_result()

    try:
        img_array = _preprocess_image(file_storage)
        raw_preds = model.predict(img_array, verbose=0)   # shape: (1, 3)
        probs     = raw_preds[0]

        class_idx   = int(np.argmax(probs))
        confidence  = round(float(probs[class_idx]) * 100, 1)
        class_names = ["normal", "benign", "malignant"]
        prediction  = class_names[class_idx]

        recommendation = _build_recommendation(prediction, confidence)

        return {
            "prediction":     prediction,
            "confidence":     confidence,
            "recommendation": recommendation,
            "raw_probs": {
                "normal":    round(float(probs[0]) * 100, 1),
                "benign":    round(float(probs[1]) * 100, 1),
                "malignant": round(float(probs[2]) * 100, 1),
            }
        }

    except Exception as e:
        current_app.logger.error(f"Model inference error: {e}")
        return _mock_image_result()


def _build_recommendation(prediction: str, confidence: float) -> str:
    if prediction == "normal":
        return (
            "No significant abnormalities detected in this image. "
            "Continue monthly self-examinations and follow your scheduled mammogram screening. "
            "Consult your doctor if you notice any new changes."
        )
    elif prediction == "benign":
        return (
            "The image shows features that may indicate a benign (non-cancerous) mass. "
            "Please schedule an appointment with a breast care specialist for further evaluation, "
            "including a clinical examination and possibly an ultrasound or biopsy."
        )
    else:  # malignant
        return (
            "⚠️ The AI has detected features that may be concerning. Please do not panic — "
            "this is a preliminary AI analysis and NOT a diagnosis. "
            "You must consult a qualified oncologist IMMEDIATELY for a proper clinical evaluation. "
            "Early medical attention is critical. Use our Hospital Finder to locate the nearest cancer centre."
        )


def _mock_image_result() -> dict:
    """Return a realistic mock result for development/testing."""
    import random
    options = [
        {"prediction": "normal",    "confidence": 87.3},
        {"prediction": "benign",    "confidence": 72.1},
        {"prediction": "malignant", "confidence": 68.5},
    ]
    chosen = random.choice(options)
    chosen["recommendation"] = _build_recommendation(chosen["prediction"], chosen["confidence"])
    chosen["raw_probs"] = {"normal": 87.3, "benign": 9.1, "malignant": 3.6}
    chosen["_is_mock"] = True
    return chosen


# ── SYMPTOM RISK CHECKER ──────────────────────────────────────

# High-risk symptoms (strongly associated with breast cancer)
HIGH_RISK_SYMPTOMS = {
    "lump or thickening in breast or underarm",
    "nipple discharge (other than breast milk)",
    "nipple turning inward",
    "skin dimpling or puckering",
}

# Moderate-risk symptoms
MODERATE_RISK_SYMPTOMS = {
    "change in size or shape of breast",
    "redness or scaling on nipple or breast skin",
    "swelling of breast (even without a lump)",
    "persistent pain in breast or nipple",
}


def check_symptoms_risk(symptoms: list[str]) -> dict:
    """
    Score symptoms and return a risk level + recommendation.

    Returns:
        {
          risk_level: "low" | "moderate" | "high",
          symptoms: [...],
          advice: "...",
          should_see_doctor: bool
        }
    """
    symptoms_lower = [s.lower().strip() for s in symptoms]

    high_count     = sum(1 for s in symptoms_lower if s in HIGH_RISK_SYMPTOMS)
    moderate_count = sum(1 for s in symptoms_lower if s in MODERATE_RISK_SYMPTOMS)
    total          = len(symptoms_lower)

    if high_count >= 1 or (high_count + moderate_count) >= 3:
        risk_level = "high"
        advice = (
            "You have reported one or more high-risk symptoms. Please consult a doctor or breast care "
            "specialist as soon as possible. Do not delay — early detection significantly improves outcomes. "
            "Use our Hospital Finder to locate the nearest cancer treatment centre."
        )
        should_see_doctor = True

    elif moderate_count >= 2 or total >= 2:
        risk_level = "moderate"
        advice = (
            "You have reported symptoms that warrant medical attention. "
            "Schedule an appointment with your general practitioner or a breast care specialist "
            "within the next 1–2 weeks. They may recommend a clinical exam or mammogram."
        )
        should_see_doctor = True

    else:
        risk_level = "low"
        advice = (
            "Your reported symptoms appear to be lower risk, but it is always wise to "
            "monitor any changes and maintain regular self-examinations. "
            "If symptoms persist or worsen, consult your doctor. "
            "Remember: early detection saves lives."
        )
        should_see_doctor = False

    return {
        "risk_level":        risk_level,
        "symptoms":          symptoms,
        "high_risk_count":   high_count,
        "moderate_risk_count": moderate_count,
        "advice":            advice,
        "should_see_doctor": should_see_doctor,
    }
