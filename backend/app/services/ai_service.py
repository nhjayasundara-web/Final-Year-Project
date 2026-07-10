import json
import math
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np
from flask import current_app
from PIL import Image

try:
    import tensorflow as tf
except Exception:  # pragma: no cover
    tf = None

_model_cache = {"path": None, "model": None}
_label_cache = {"path": None, "labels": None}
DEFAULT_CLASSES = ["benign", "malignant", "normal"]


def _resolve_backend_path(value: str) -> Optional[Path]:
    if not value:
        return None
    path = Path(value)
    if not path.is_absolute():
        path = Path(current_app.root_path).parent / path
    return path


def _load_model():
    model_path = current_app.config.get("MODEL_PATH") or ""
    if not model_path or tf is None:
        return None
    path = _resolve_backend_path(model_path)
    if path is None or not path.exists():
        return None
    if _model_cache["path"] != str(path):
        _model_cache["model"] = tf.keras.models.load_model(path)
        _model_cache["path"] = str(path)
    return _model_cache["model"]


def _load_labels() -> List[str]:
    labels_path = current_app.config.get("MODEL_LABELS_PATH") or ""
    path = _resolve_backend_path(labels_path)
    if path is None or not path.exists():
        return DEFAULT_CLASSES
    if _label_cache["path"] == str(path) and _label_cache["labels"]:
        return _label_cache["labels"]

    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    if isinstance(payload, dict) and isinstance(payload.get("classes"), list):
        labels = [str(item) for item in payload["classes"]]
    elif isinstance(payload, dict):
        labels = [payload[str(index)] for index in range(len(payload)) if str(index) in payload]
    elif isinstance(payload, list):
        labels = [str(item) for item in payload]
    else:
        labels = DEFAULT_CLASSES

    _label_cache["path"] = str(path)
    _label_cache["labels"] = labels or DEFAULT_CLASSES
    return _label_cache["labels"]


def _get_image_size() -> int:
    try:
        return int(current_app.config.get("MODEL_IMAGE_SIZE", 224))
    except Exception:
        return 224


def _read_image(file_stream, size: Optional[int] = None) -> np.ndarray:
    size = size or _get_image_size()
    image = Image.open(file_stream).convert("RGB")
    image = image.resize((size, size))
    return np.asarray(image).astype("float32")


def preprocess_image(file_stream, size=(224, 224)):
    """Backward-compatible helper used by older tests.

    Returns an RGB array scaled to 0..1. The trained MobileNetV2 pipeline uses
    _preprocess_for_model instead.
    """
    image = Image.open(file_stream).convert("RGB")
    image = image.resize(size)
    return np.asarray(image).astype("float32") / 255.0


def _preprocess_for_model(array: np.ndarray) -> np.ndarray:
    mode = (current_app.config.get("MODEL_PREPROCESSING") or "mobilenet_v2").lower()
    if mode == "mobilenet_v2":
        # Equivalent to tf.keras.applications.mobilenet_v2.preprocess_input:
        # convert 0..255 pixels to -1..1.
        return (array / 127.5) - 1.0
    if mode in {"rescale_0_1", "0_1", "simple"}:
        return array / 255.0
    return array


def _safe_softmax(values: np.ndarray) -> np.ndarray:
    shifted = values - np.max(values)
    exp_values = np.exp(shifted)
    total = np.sum(exp_values)
    if total <= 0:
        return np.ones_like(values) / len(values)
    return exp_values / total


def _multiclass_result(prediction: np.ndarray, labels: List[str]) -> Dict:
    values = np.asarray(prediction).astype("float32").reshape(-1)
    if len(values) != len(labels):
        labels = [f"class_{index}" for index in range(len(values))]

    # Models saved by the included training script already output softmax
    # probabilities. If a custom model outputs logits, normalize them safely.
    if np.any(values < 0) or not np.isclose(float(np.sum(values)), 1.0, atol=0.05):
        values = _safe_softmax(values)

    probabilities = {labels[index]: round(float(values[index]), 4) for index in range(len(labels))}
    predicted_index = int(np.argmax(values))
    predicted_class = labels[predicted_index]

    malignant_probability = float(probabilities.get("malignant", 0.0))
    benign_probability = float(probabilities.get("benign", 0.0))
    normal_probability = float(probabilities.get("normal", 0.0))
    confidence = float(values[predicted_index])

    # Triage signal is intentionally conservative. Benign and malignant lesion
    # predictions both deserve professional review; malignant raises urgency.
    review_signal = min(0.99, malignant_probability + 0.35 * benign_probability)

    if malignant_probability >= 0.45:
        triage = "urgent-professional-review-recommended"
        headline = "The model detected a strong review signal. Arrange professional medical review."
    elif benign_probability >= 0.45:
        triage = "professional-review-recommended"
        headline = "The model detected a lesion-like pattern. Professional review is recommended."
    elif confidence < 0.55:
        triage = "uncertain"
        headline = "The model is uncertain. Do not interpret this image without clinical review."
    elif normal_probability >= 0.55:
        triage = "no-obvious-model-flag"
        headline = "No obvious model flag was found, but this does not rule out disease."
    else:
        triage = "uncertain"
        headline = "The model result is uncertain and needs clinical context."

    confidence_band = "low" if confidence < 0.55 else "medium" if confidence < 0.8 else "high"
    return {
        "score": round(float(review_signal), 3),
        "triageCategory": triage,
        "headline": headline,
        "analysisMode": "tensorflow-model",
        "predictedClass": predicted_class,
        "confidence": round(confidence, 3),
        "confidenceBand": confidence_band,
        "probabilities": probabilities,
    }


def _binary_result(prediction: np.ndarray) -> Dict:
    raw_score = float(np.ravel(prediction)[0])
    score = max(0.01, min(raw_score, 0.99))
    if score >= 0.72:
        triage = "professional-review-recommended"
        headline = "Image should be reviewed by a qualified healthcare professional."
    elif score >= 0.45:
        triage = "uncertain"
        headline = "The image is uncertain and should not be interpreted without clinical review."
    else:
        triage = "no-obvious-model-flag"
        headline = "No obvious model flag was found, but this does not rule out disease."
    confidence_band = "low" if score < 0.45 else "medium" if score < 0.72 else "high"
    return {
        "score": round(score, 3),
        "triageCategory": triage,
        "headline": headline,
        "analysisMode": "tensorflow-model",
        "confidenceBand": confidence_band,
    }


def _demo_heuristic(array: np.ndarray) -> Dict:
    """Fallback only: not trained and not diagnostic."""
    scaled = array / 255.0
    grayscale = np.mean(scaled, axis=2)
    contrast = float(np.std(grayscale))
    center = grayscale[70:154, 70:154]
    center_density = float(np.mean(center))
    edge_factor = float(np.mean(np.abs(np.diff(grayscale, axis=0))))
    raw_score = 1 / (1 + math.exp(-8 * (contrast + edge_factor + abs(center_density - 0.5) - 0.34)))
    score = max(0.01, min(raw_score, 0.99))

    if score >= 0.72:
        triage = "professional-review-recommended"
        headline = "Image should be reviewed by a qualified healthcare professional."
    elif score >= 0.45:
        triage = "uncertain"
        headline = "The image is uncertain and should not be interpreted without clinical review."
    else:
        triage = "no-obvious-demo-flag"
        headline = "No obvious flag was found by this educational demo scan."

    confidence_band = "low" if score < 0.45 else "medium" if score < 0.72 else "high"
    return {
        "score": round(score, 3),
        "triageCategory": triage,
        "headline": headline,
        "analysisMode": "demo-heuristic",
        "confidenceBand": confidence_band,
    }


def analyze_image(file_stream):
    """Analyze an uploaded breast image with a validated TensorFlow model if present.

    Important: this endpoint is for educational triage support only. It must not
    be presented as diagnosis or as a replacement for clinicians.
    """
    array = _read_image(file_stream)
    model = _load_model()

    if model is not None:
        batch = np.expand_dims(_preprocess_for_model(array), axis=0)
        prediction = model.predict(batch, verbose=0)
        labels = _load_labels()
        flattened = np.asarray(prediction).reshape(-1)
        if len(flattened) > 1:
            result = _multiclass_result(flattened, labels)
        else:
            result = _binary_result(flattened)
    else:
        result = _demo_heuristic(array)

    result.update(
        {
            "disclaimer": "This result is educational triage support only. It is not a diagnosis, cannot confirm or rule out breast cancer, and should not delay professional care.",
            "nextSteps": [
                "Contact a healthcare professional for symptoms, abnormal findings, or ongoing concern.",
                "Use clinically approved imaging, physical examination, and reports for diagnosis.",
                "If this is a real medical image, keep the original file and share it only through secure medical channels.",
            ],
            "providerEscalationCta": {
                "label": "Find a provider for follow-up",
                "href": "/providers",
            },
        }
    )
    return result
