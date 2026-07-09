# Real Dataset ML Training Guide for HOPE

## 1. What changed

The first version of the app had an AI-ready endpoint and a safe fallback heuristic. This update adds a real-dataset training pipeline so the project can train an actual TensorFlow/Keras model instead of using synthetic data.

## 2. Dataset rule

For this project:

- Do not use synthetic images.
- Do not use GAN-generated images.
- Do not use artificial tumor overlays.
- Do not train the classifier on mask images.
- Use real, cited, medical datasets only.

Preprocessing such as resizing, normalization, and train/validation/test splitting is allowed. The strict default training script does not use image augmentation.

## 3. Recommended dataset for the app

Use BUSI: Breast Ultrasound Images Dataset.

Why BUSI fits HOPE:

- It contains real breast ultrasound images.
- It has three useful classes for the app: normal, benign, malignant.
- It includes masks that can later support lesion segmentation.
- It is small enough for an academic prototype.

Expected local folder structure:

```text
backend/datasets/BUSI/
  benign/
  malignant/
  normal/
```

The training script ignores files with `mask` in the filename.

## 4. Model selected

The included training pipeline uses MobileNetV2 transfer learning:

```text
Input image -> MobileNetV2 feature extractor -> GlobalAveragePooling -> Dropout -> Dense softmax
```

Output classes:

```text
benign, malignant, normal
```

Reason for this choice:

- It works well for small-to-medium image datasets.
- It is lighter than many larger CNNs.
- It can run on a normal laptop or Google Colab.
- It exports cleanly as a `.keras` file for Flask integration.

## 5. Training commands

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

## 6. Connect model to backend

In `backend/.env`:

```env
MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
MODEL_IMAGE_SIZE=224
MODEL_PREPROCESSING=mobilenet_v2
```

Then restart Flask:

```bash
python run.py
```

## 7. What the API returns after training

The endpoint returns triage support, not diagnosis:

```json
{
  "analysisMode": "tensorflow-model",
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

## 8. Evaluation rules

Include these in the final project report:

- Dataset name and citation
- Number of images per class
- Train/validation/test split counts
- Accuracy
- Malignant recall/sensitivity
- Specificity
- Precision
- Macro F1-score
- Confusion matrix
- Macro AUC if available
- False negatives discussion

The script writes a JSON report to:

```text
backend/reports/busi_training_report.json
```

## 9. Strong limitation statement for presentation

Use this wording:

> The HOPE ML model is trained on real public breast ultrasound images for academic demonstration only. It is not a diagnostic medical device. Results must be interpreted by qualified healthcare professionals, and external clinical validation is required before real patient use.

## 10. Future improvement

After the classifier works, use the mask files to train a lesion segmentation model such as U-Net. That would allow the app to highlight suspicious regions, but it must still be validated clinically.
