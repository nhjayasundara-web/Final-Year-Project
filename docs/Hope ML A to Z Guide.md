# HOPE ML Model A-to-Z Guide

This guide explains how to train, test, download, and integrate the HOPE breast ultrasound ML model into the local HOPE application.

The HOPE project requires an AI-powered breast cancer detection feature using TensorFlow/Keras with a Flask backend and React frontend. This guide uses a real breast ultrasound dataset, excludes mask files, avoids synthetic images, and connects the trained model to the app.

---

## Overview

You will complete these steps:

1. Start clean in Google Colab.
2. Upload the HOPE project zip and Kaggle API key.
3. Download the real BUSI breast ultrasound dataset.
4. Prepare the dataset correctly.
5. Install TensorFlow and ML packages.
6. Train the model.
7. Check accuracy.
8. Test predictions.
9. Download trained model files.
10. Integrate the model locally into the HOPE Flask backend and React frontend.

---

# A. Start Clean in Google Colab

## A1. Delete the old broken runtime

In Google Colab:

```text
Runtime -> Disconnect and delete runtime
```

Then reconnect.

This removes broken TensorFlow, JAX, and `ml_dtypes` conflicts.

## A2. Enable GPU

Go to:

```text
Runtime -> Change runtime type -> Hardware accelerator -> GPU -> Save
```

Then run:

```python
import tensorflow as tf

print("TensorFlow:", tf.__version__)
print("GPU:", tf.config.list_physical_devices("GPU"))
```

It is okay if GPU is empty, but training will be slower without GPU.

---

# B. Upload Project and Kaggle Key

You need these two files:

```text
hope-complete-app-real-ml.zip
Kaggle.json
```

Run this in Colab:

```python
from google.colab import files

uploaded = files.upload()
```

Upload:

```text
hope-complete-app-real-ml.zip
Kaggle.json
```

If Colab saves your Kaggle key as something like this, it is okay:

```text
Kaggle (2).json
```

---

# C. Unzip the HOPE App

Run:

```bash
!unzip -q hope-complete-app-real-ml.zip -d /content
!ls /content
!ls /content/hope-complete-app
```

You should see:

```text
backend
frontend
docs
README.md
IMPLEMENTATION_GUIDE.md
```

---

# D. Fix Kaggle Key Setup

Because your Kaggle file may be named `Kaggle (2).json`, use this safe code:

```python
from pathlib import Path
import shutil
import os

matches = list(Path("/content").rglob("*aggle*.json"))

if not matches:
    raise FileNotFoundError("No Kaggle JSON file found. Upload Kaggle.json again.")

src = matches[0]

dst_dir = Path.home() / ".kaggle"
dst_dir.mkdir(parents=True, exist_ok=True)

dst = dst_dir / "kaggle.json"
shutil.copy2(src, dst)
os.chmod(dst, 0o600)

print("Found Kaggle file:", src)
print("Installed Kaggle key at:", dst)
```

Test Kaggle:

```bash
!kaggle datasets list -s "breast ultrasound images dataset" | head
```

If you see dataset results, Kaggle is working.

---

# E. Download the Real BUSI Dataset

Run:

```bash
!mkdir -p /content/raw_busi
!kaggle datasets download -d aryashah2k/breast-ultrasound-images-dataset -p /content/raw_busi --unzip
```

Check folders:

```bash
!find /content/raw_busi -maxdepth 4 -type d
```

You should see folders like:

```text
benign
malignant
normal
```

or:

```text
Dataset_BUSI_with_GT/benign
Dataset_BUSI_with_GT/malignant
Dataset_BUSI_with_GT/normal
```

---

# F. Prepare the Dataset Correctly

This step copies only real ultrasound images and excludes mask files.

Run:

```python
from pathlib import Path
import shutil

raw_root = Path("/content/raw_busi")
project_busi = Path("/content/hope-complete-app/backend/datasets/BUSI")
classes = ["benign", "malignant", "normal"]

possible_roots = [p for p in raw_root.rglob("*") if p.is_dir()]
dataset_root = None

for folder in [raw_root] + possible_roots:
    if all((folder / cls).exists() for cls in classes):
        dataset_root = folder
        break

if dataset_root is None:
    raise Exception("Could not find BUSI folders: benign, malignant, normal")

print("Detected dataset root:", dataset_root)

valid_extensions = {".png", ".jpg", ".jpeg", ".bmp", ".webp"}

for cls in classes:
    target = project_busi / cls
    target.mkdir(parents=True, exist_ok=True)

    for old_file in target.glob("*"):
        old_file.unlink()

    source_folder = dataset_root / cls
    copied = 0

    for file in source_folder.rglob("*"):
        is_image = file.suffix.lower() in valid_extensions
        is_mask = "mask" in file.stem.lower()

        if file.is_file() and is_image and not is_mask:
            shutil.copy2(file, target / file.name)
            copied += 1

    print(cls, "copied:", copied)
```

Expected output will be similar to:

```text
benign copied: 437
malignant copied: 210
normal copied: 133
```

Verify that mask files were not copied:

```python
from pathlib import Path

base = Path("/content/hope-complete-app/backend/datasets/BUSI")

for cls in ["benign", "malignant", "normal"]:
    files = [
        p for p in (base / cls).glob("*")
        if p.suffix.lower() in [".png", ".jpg", ".jpeg", ".bmp", ".webp"]
    ]
    masks = [p for p in files if "mask" in p.stem.lower()]
    print(cls, "images:", len(files), "mask files:", len(masks))
```

You want:

```text
mask files: 0
```

---

# G. Install ML Packages

Because previous errors came from TensorFlow, JAX, and `ml_dtypes` conflicts, use this clean command:

```bash
!pip install -q --upgrade tensorflow==2.20.0 scikit-learn pillow matplotlib
```

Then verify:

```python
import tensorflow as tf

print("TensorFlow:", tf.__version__)
print("GPU:", tf.config.list_physical_devices("GPU"))
```

Expected:

```text
TensorFlow: 2.20.0
```

Do **not** run this for now:

```bash
!pip install -r requirements-ai.txt
```

---

# H. Go to Backend Folder

Run:

```bash
%cd /content/hope-complete-app/backend
```

Check that the training script exists:

```bash
!ls ml
```

You should see:

```text
train_busi_classifier.py
```

---

# I. Quick Training Test

Before full training, run 2 epochs:

```bash
!python ml/train_busi_classifier.py \
  --data datasets/BUSI \
  --model-out models/breast_screening.keras \
  --labels-out models/busi_labels.json \
  --report-out reports/busi_training_report.json \
  --epochs 2 \
  --fine-tune-epochs 0 \
  --batch-size 16
```

If this completes, the dataset and code are correct.

Check files:

```bash
!ls -lh models
!ls -lh reports
```

You should see:

```text
breast_screening.keras
busi_labels.json
busi_training_report.json
```

---

# J. Full Model Training

Now run full training:

```bash
!python ml/train_busi_classifier.py \
  --data datasets/BUSI \
  --model-out models/breast_screening.keras \
  --labels-out models/busi_labels.json \
  --report-out reports/busi_training_report.json \
  --epochs 25 \
  --fine-tune-epochs 8 \
  --batch-size 16
```

If Colab crashes or memory is low, use batch size 8:

```bash
!python ml/train_busi_classifier.py \
  --data datasets/BUSI \
  --model-out models/breast_screening.keras \
  --labels-out models/busi_labels.json \
  --report-out reports/busi_training_report.json \
  --epochs 25 \
  --fine-tune-epochs 8 \
  --batch-size 8
```

This creates:

```text
models/breast_screening.keras
models/busi_labels.json
reports/busi_training_report.json
```

---

# K. Check Model Files

Run:

```bash
!ls -lh models
!ls -lh reports
```

You need to see:

```text
models/breast_screening.keras
models/busi_labels.json
reports/busi_training_report.json
```

---

# L. Check Accuracy

Run:

```python
import json

with open("reports/busi_training_report.json", "r") as f:
    report = json.load(f)

print("Report keys:", report.keys())
print(json.dumps(report, indent=2)[:5000])
```

Then run this clean accuracy checker:

```python
import json

with open("reports/busi_training_report.json", "r") as f:
    report = json.load(f)

test_metrics = report.get("test_metrics", report)
accuracy = test_metrics.get("accuracy")

if accuracy is None:
    print("Could not find accuracy directly.")
    print("Available keys:", test_metrics.keys())
    print(json.dumps(test_metrics, indent=2)[:4000])
else:
    print("Test Accuracy:", round(float(accuracy) * 100, 2), "%")

print("Synthetic data used:", report.get("synthetic_data_used"))
```

For your documentation, write:

```text
Test Accuracy = XX%
Synthetic data used = false
```

Replace `XX` with your result.

---

# M. Test One Image Directly

Use the fixed label code. This avoids the earlier `KeyError: 0` bug.

```python
import tensorflow as tf
import numpy as np
from PIL import Image
import json
from pathlib import Path

image_path = "datasets/BUSI/malignant/malignant (189).png"

model = tf.keras.models.load_model("models/breast_screening.keras")

with open("models/busi_labels.json", "r") as f:
    label_data = json.load(f)

labels = label_data["classes"] if isinstance(label_data, dict) else label_data

print("Correct labels:", labels)

img = Image.open(image_path).convert("RGB")
img = img.resize((224, 224))

arr = np.array(img).astype("float32")
arr = tf.keras.applications.mobilenet_v2.preprocess_input(arr)

batch = np.expand_dims(arr, axis=0)

pred = model.predict(batch)[0]

print("Image:", image_path)
print("Raw prediction:", pred)

for label, prob in zip(labels, pred):
    print(label, ":", round(float(prob) * 100, 2), "%")

predicted_index = int(np.argmax(pred))

print("Predicted class:", labels[predicted_index])
print("Actual class:", Path(image_path).parent.name)
```

If that image path does not exist, find an image:

```bash
!find datasets/BUSI/malignant -type f | grep -Ei "\.png|\.jpg|\.jpeg" | head -10
```

Then replace:

```python
image_path = "..."
```

---

# N. Test 5 Images from Each Class

Run:

```python
from pathlib import Path
import tensorflow as tf
import numpy as np
from PIL import Image
import json

model = tf.keras.models.load_model("models/breast_screening.keras")

with open("models/busi_labels.json", "r") as f:
    label_data = json.load(f)

labels = label_data["classes"] if isinstance(label_data, dict) else label_data

def predict_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))

    arr = np.array(img).astype("float32")
    arr = tf.keras.applications.mobilenet_v2.preprocess_input(arr)

    batch = np.expand_dims(arr, axis=0)
    pred = model.predict(batch, verbose=0)[0]

    predicted_index = int(np.argmax(pred))
    predicted_label = labels[predicted_index]
    actual_label = Path(image_path).parent.name

    return actual_label, predicted_label, pred

for cls in ["benign", "malignant", "normal"]:
    print("\n==============================")
    print("Testing class:", cls)
    print("==============================")

    files = list(Path(f"datasets/BUSI/{cls}").glob("*"))
    files = [
        f for f in files
        if f.suffix.lower() in [".png", ".jpg", ".jpeg", ".bmp", ".webp"]
        and "mask" not in f.stem.lower()
    ]
    files = files[:5]

    for file in files:
        actual, predicted, pred = predict_image(str(file))

        print("\nImage:", file.name)
        print("Actual:", actual)
        print("Predicted:", predicted)

        for label, prob in zip(labels, pred):
            print(" ", label, ":", round(float(prob) * 100, 2), "%")
```

This proves the model can predict:

```text
benign
malignant
normal
```

---

# O. Manual Accuracy Test

This tests all images in the prepared BUSI folder. It is useful, but the best report value is still the held-out test accuracy from `busi_training_report.json`.

```python
from pathlib import Path
import json
import numpy as np
import tensorflow as tf
from PIL import Image
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

model = tf.keras.models.load_model("models/breast_screening.keras")

with open("models/busi_labels.json", "r") as f:
    label_data = json.load(f)

labels = label_data["classes"] if isinstance(label_data, dict) else label_data

y_true = []
y_pred = []

for actual_label in labels:
    folder = Path(f"datasets/BUSI/{actual_label}")
    image_files = [
        p for p in folder.glob("*")
        if p.suffix.lower() in [".png", ".jpg", ".jpeg", ".webp", ".bmp"]
        and "mask" not in p.stem.lower()
    ]

    for image_path in image_files:
        img = Image.open(image_path).convert("RGB")
        img = img.resize((224, 224))

        arr = np.array(img).astype("float32")
        arr = tf.keras.applications.mobilenet_v2.preprocess_input(arr)
        batch = np.expand_dims(arr, axis=0)

        pred = model.predict(batch, verbose=0)[0]
        predicted_label = labels[int(np.argmax(pred))]

        y_true.append(actual_label)
        y_pred.append(predicted_label)

accuracy = accuracy_score(y_true, y_pred)

print("Manual Accuracy on prepared BUSI folder:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(y_true, y_pred, target_names=labels))

print("\nConfusion Matrix:")
print(confusion_matrix(y_true, y_pred, labels=labels))
```

Important note: this manual accuracy may include training images, so it can look higher than true test accuracy.

---

# P. Create One ZIP File for Download

This fixes the issue where downloading individual files does not return anything.

Run:

```bash
%cd /content/hope-complete-app/backend

!zip -r /content/hope_trained_model_files.zip \
  models/breast_screening.keras \
  models/busi_labels.json \
  reports/busi_training_report.json

!ls -lh /content/hope_trained_model_files.zip
```

You should see:

```text
/content/hope_trained_model_files.zip
```

---

# Q. Download Trained Files

Try direct Colab download:

```python
from google.colab import files

files.download("/content/hope_trained_model_files.zip")
```

Wait 10 to 30 seconds.

If nothing happens, use the left sidebar:

```text
Left sidebar -> Files icon -> Refresh -> find hope_trained_model_files.zip -> Right click -> Download
```

If still not working, save to Google Drive:

```python
from google.colab import drive

drive.mount("/content/drive")
```

Then:

```bash
!cp /content/hope_trained_model_files.zip "/content/drive/MyDrive/hope_trained_model_files.zip"
```

Now download from Google Drive:

```text
My Drive -> hope_trained_model_files.zip
```

---

# R. Extract Downloaded ZIP on Your Laptop

After downloading:

```text
hope_trained_model_files.zip
```

Extract it.

Inside, you should have:

```text
models/breast_screening.keras
models/busi_labels.json
reports/busi_training_report.json
```

---

# S. Put Trained Files into Local App

On your laptop, open your local project:

```text
hope-complete-app/
```

Copy the downloaded files into:

```text
hope-complete-app/backend/models/breast_screening.keras
hope-complete-app/backend/models/busi_labels.json
hope-complete-app/backend/reports/busi_training_report.json
```

If these folders do not exist, create them:

```text
backend/models
backend/reports
```

---

# T. Configure Backend `.env`

In:

```text
hope-complete-app/backend
```

create or edit:

```text
.env
```

Add:

```env
FLASK_ENV=development
SECRET_KEY=change-this-secret
JWT_SECRET=change-this-jwt-secret
CORS_ORIGINS=http://localhost:5173

MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
MODEL_IMAGE_SIZE=224
MODEL_PREPROCESSING=mobilenet_v2
```

The most important lines are:

```env
MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
```

---

# U. Run Backend Locally

## Windows PowerShell

```powershell
cd hope-complete-app\backend

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
pip install tensorflow==2.20.0 scikit-learn pillow matplotlib

python seed.py
python run.py
```

## macOS/Linux

```bash
cd hope-complete-app/backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
pip install tensorflow==2.20.0 scikit-learn pillow matplotlib

python seed.py
python run.py
```

Backend should run on:

```text
http://127.0.0.1:5000
```

---

# V. Test Local Backend API

Open a second terminal.

Test health:

```bash
curl http://127.0.0.1:5000/api/health
```

Now test AI upload.

Use a BUSI image path on your local laptop. Example for Windows Command Prompt:

```cmd
curl -X POST ^
  -F "image=@backend/datasets/BUSI/malignant/malignant (189).png" ^
  http://127.0.0.1:5000/api/ai/analyze-image
```

For macOS/Linux:

```bash
curl -X POST \
  -F "image=@backend/datasets/BUSI/malignant/malignant (189).png" \
  http://127.0.0.1:5000/api/ai/analyze-image
```

Expected response should contain:

```json
"analysisMode": "tensorflow-model"
```

and one of:

```json
"predictedClass": "benign"
```

```json
"predictedClass": "malignant"
```

```json
"predictedClass": "normal"
```

If it says:

```json
"analysisMode": "demo-heuristic"
```

then the model is not connected. Check `.env` and restart Flask.

---

# W. Run Frontend Locally

Open another terminal:

```bash
cd hope-complete-app/frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Go to the AI screening page and upload a BUSI ultrasound image.

You should see:

```text
Predicted class
Probabilities
Triage recommendation
```

---

# X. How to Prove Integration Works

Take screenshots of:

```text
1. backend/models/breast_screening.keras
2. backend/models/busi_labels.json
3. backend/reports/busi_training_report.json
4. backend/.env with MODEL_PATH
5. Flask running
6. curl API response showing "analysisMode": "tensorflow-model"
7. frontend AI screening page prediction
```

---

# Y. What to Write in the Final Report

Use this:

```text
The HOPE AI module uses a TensorFlow/Keras MobileNetV2-based image classification model trained on the real BUSI Breast Ultrasound Images Dataset. The model classifies breast ultrasound images into benign, malignant, and normal categories. Mask files were excluded from classification training, and no synthetic images were used. The trained model was saved as breast_screening.keras and integrated with the Flask backend through the /api/ai/analyze-image endpoint. The API returns class probabilities and a triage recommendation, but it does not provide a medical diagnosis.
```

Add your accuracy:

```text
The model achieved a test accuracy of XX% on the held-out test set.
```

Replace `XX` with your printed accuracy.

---

# Z. Final Checklist

You are fully done when:

```text
[ ] Kaggle works
[ ] BUSI dataset downloaded
[ ] benign / malignant / normal folders prepared
[ ] mask files excluded
[ ] TensorFlow 2.20 installed
[ ] quick 2-epoch training works
[ ] full training completed
[ ] breast_screening.keras exists
[ ] busi_labels.json exists
[ ] busi_training_report.json exists
[ ] accuracy printed
[ ] synthetic_data_used is false
[ ] one-image test works
[ ] ZIP file downloaded
[ ] model files copied into local backend
[ ] backend .env configured
[ ] Flask runs locally
[ ] API returns analysisMode: tensorflow-model
[ ] frontend upload works
```

The two most important proof lines are:

```json
"synthetic_data_used": false
```

and:

```json
"analysisMode": "tensorflow-model"
```
