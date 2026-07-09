# AI Model Integration

The project includes an AI-ready endpoint. By default it is safe and conservative: if no trained TensorFlow/Keras model is configured, the endpoint returns a clearly labelled demo heuristic and does **not** claim diagnostic accuracy.

## Current default behavior

`POST /api/ai/analyze-image` does this:

1. Validates the uploaded image format.
2. Resizes the image to the configured model size, default 224 x 224 RGB.
3. Loads a TensorFlow/Keras model if `MODEL_PATH` exists and TensorFlow is installed.
4. Loads labels from `MODEL_LABELS_PATH` if provided.
5. Otherwise runs a demo heuristic.
6. Returns a triage category, score, probabilities when available, next steps, and a medical disclaimer.

## Recommended real dataset model

For the academic HOPE version, use a real breast ultrasound dataset such as BUSI and train the included MobileNetV2 transfer-learning classifier:

- Classes: `benign`, `malignant`, `normal`
- Model file: `backend/models/breast_screening.keras`
- Label file: `backend/models/busi_labels.json`
- Synthetic data: not used
- Strict default augmentation: not used

The training script is here:

```text
backend/ml/train_busi_classifier.py
```

## Train on actual dataset images

Download the real dataset yourself according to its license and organize it like this:

```text
backend/datasets/BUSI/
  benign/*.png
  malignant/*.png
  normal/*.png
```

Then run:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-ai.txt
python ml/train_busi_classifier.py \
  --data datasets/BUSI \
  --model-out models/breast_screening.keras \
  --labels-out models/busi_labels.json \
  --report-out reports/busi_training_report.json \
  --epochs 25 \
  --fine-tune-epochs 8 \
  --batch-size 16
```

## Configure Flask to use the trained model

In `backend/.env`:

```env
MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
MODEL_IMAGE_SIZE=224
MODEL_PREPROCESSING=mobilenet_v2
```

Restart the backend.

## Expected model output

The included model returns a three-class softmax probability vector. The backend reports:

```json
{
  "predictedClass": "malignant",
  "confidence": 0.81,
  "probabilities": {
    "benign": 0.13,
    "malignant": 0.81,
    "normal": 0.06
  },
  "triageCategory": "urgent-professional-review-recommended"
}
```

If you supply a custom binary model, the backend still supports one numeric output where higher means stronger review signal.

## Clinical safety requirements

Before any real-world use:

- Validate performance on the target country, hospitals, machines, and image capture workflow.
- Report malignant sensitivity/recall, specificity, false negatives, confusion matrix, macro F1, and AUC.
- Use patient-level data splitting whenever patient IDs are available.
- Add clinician review before users see high-stakes recommendations.
- Add explicit consent, privacy controls, encryption, and audit logging.
- Obtain approvals required by your university, hospital, and jurisdiction.

This application must remain educational unless clinically validated and approved.
