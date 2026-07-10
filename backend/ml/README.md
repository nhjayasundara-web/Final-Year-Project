# HOPE ML Training Pipeline

This folder contains the real-dataset training pipeline for the HOPE AI screening endpoint.

## What it trains

- Model: MobileNetV2 transfer-learning image classifier
- Framework: TensorFlow/Keras
- Input: breast ultrasound image, resized to 224 x 224 RGB
- Output classes: `benign`, `malignant`, `normal`
- Synthetic data: **not used**
- Image augmentation: **not used** in the strict default pipeline

## Dataset expected

Use a real breast ultrasound dataset such as BUSI. After download, organize it like this:

```text
backend/datasets/BUSI/
  benign/
    benign (1).png
    benign (2).png
  malignant/
    malignant (1).png
  normal/
    normal (1).png
```

The script automatically ignores files whose names contain `mask`, because masks should not be used as classification inputs.

## Train

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

## Connect the trained model to Flask

In `backend/.env`:

```env
MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
MODEL_IMAGE_SIZE=224
MODEL_PREPROCESSING=mobilenet_v2
```

Restart the backend. The `/api/ai/analyze-image` endpoint will then return model probabilities for `benign`, `malignant`, and `normal`.

## Important safety note

This model is for academic demonstration unless it passes clinical validation. It must not be marketed or shown as a diagnosis tool. Always keep a human medical review path.
