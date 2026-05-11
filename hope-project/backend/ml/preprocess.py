# ============================================================
# HOPE — Image Preprocessing Utilities for ML Pipeline
# Save to: backend/ml/preprocess.py
#
# Handles dataset organisation, augmentation preview,
# and image quality validation before training.
# ============================================================

import os
import io
import shutil
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

# ── Config ──────────────────────────────────────────────────
IMG_SIZE     = 224
VALID_EXTS   = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
DATASET_DIR  = "ml/data"
CLASSES      = ["normal", "benign", "malignant"]

# ── 1. Validate Dataset Directory ───────────────────────────
def validate_dataset(dataset_dir: str = DATASET_DIR) -> dict:
    """
    Check that dataset_dir contains class subdirectories with images.
    Returns stats: { class: count }.
    """
    stats = {}
    errors = []
    for cls in CLASSES:
        cls_dir = os.path.join(dataset_dir, cls)
        if not os.path.isdir(cls_dir):
            errors.append(f"Missing class directory: {cls_dir}")
            stats[cls] = 0
            continue
        files = [f for f in os.listdir(cls_dir)
                 if os.path.splitext(f)[1].lower() in VALID_EXTS]
        stats[cls] = len(files)
        if len(files) < 50:
            errors.append(f"⚠️  Class '{cls}' has only {len(files)} images — recommend 500+.")

    print("📊 Dataset validation:")
    for cls, count in stats.items():
        print(f"   {cls}: {count} images")
    if errors:
        print("⚠️  Warnings / Errors:")
        for e in errors: print(f"   {e}")
    else:
        print("✅ Dataset looks good!")
    return stats


# ── 2. Preprocess Single Image ───────────────────────────────
def preprocess_for_inference(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess a raw image for model inference.
    Steps:
      1. Open and convert to RGB
      2. Resize to 224×224
      3. Apply CLAHE-like contrast enhancement (approximated with PIL)
      4. Normalize to [0, 1]
      5. Add batch dimension
    Returns: np.ndarray of shape (1, 224, 224, 3)
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Resize
    img = img.resize((IMG_SIZE, IMG_SIZE), Image.LANCZOS)

    # Contrast enhancement (simulates CLAHE for mammograms)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.3)

    # Sharpness
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.2)

    # To numpy
    arr = np.array(img, dtype=np.float32)

    # Normalize
    arr = arr / 255.0

    # Mean subtraction (ImageNet mean for MobileNetV2 compatibility)
    mean = np.array([0.485, 0.456, 0.406])
    std  = np.array([0.229, 0.224, 0.225])
    arr  = (arr - mean) / std

    return np.expand_dims(arr, axis=0)


# ── 3. Validate Uploaded Image Quality ───────────────────────
def validate_image_quality(image_bytes: bytes) -> dict:
    """
    Basic quality checks before running inference.
    Returns: { valid: bool, issues: [str] }
    """
    issues = []
    try:
        img = Image.open(io.BytesIO(image_bytes))
    except Exception:
        return {"valid": False, "issues": ["Cannot open image. File may be corrupted."]}

    # Check size
    w, h = img.size
    if w < 100 or h < 100:
        issues.append(f"Image resolution too low ({w}×{h}). Minimum 100×100 recommended.")

    # Check mode
    if img.mode not in ("RGB", "L", "RGBA"):
        issues.append(f"Unexpected image mode: {img.mode}.")

    # Check file size (approximate from bytes length)
    size_kb = len(image_bytes) / 1024
    if size_kb < 5:
        issues.append("Image file is very small — ensure it is not a thumbnail.")
    if size_kb > 10240:
        issues.append("Image file is too large (>10 MB).")

    # Check brightness (dark images may be poor quality)
    img_gray = img.convert("L")
    avg_brightness = np.array(img_gray).mean()
    if avg_brightness < 20:
        issues.append("Image appears very dark — mammogram may be underexposed.")
    if avg_brightness > 240:
        issues.append("Image appears very bright (overexposed) — results may be unreliable.")

    return {"valid": len(issues) == 0, "issues": issues, "size_kb": round(size_kb, 1)}


# ── 4. Balance Dataset (Oversampling) ────────────────────────
def balance_dataset(dataset_dir: str = DATASET_DIR, target_count: int = 500):
    """
    Ensure each class has at least `target_count` images
    by duplicating images with slight augmentation.
    """
    for cls in CLASSES:
        cls_dir = os.path.join(dataset_dir, cls)
        if not os.path.isdir(cls_dir):
            continue

        files    = [f for f in os.listdir(cls_dir) if os.path.splitext(f)[1].lower() in VALID_EXTS]
        current  = len(files)
        needed   = max(0, target_count - current)

        print(f"⚖️  Class '{cls}': {current} images, need {needed} more.")

        for i in range(needed):
            src_file = files[i % len(files)]
            src_path = os.path.join(cls_dir, src_file)

            img = Image.open(src_path).convert("RGB")

            # Random augmentation
            if i % 4 == 0:
                img = img.transpose(Image.FLIP_LEFT_RIGHT)
            elif i % 4 == 1:
                img = img.rotate(np.random.uniform(-15, 15))
            elif i % 4 == 2:
                img = ImageEnhance.Brightness(img).enhance(np.random.uniform(0.85, 1.15))
            else:
                img = img.filter(ImageFilter.GaussianBlur(radius=0.5))

            new_name = f"aug_{i:04d}_{src_file}"
            img.save(os.path.join(cls_dir, new_name))

        if needed > 0:
            print(f"   ✅ Added {needed} augmented images to '{cls}'.")


# ── Main (run directly to validate) ─────────────────────────
if __name__ == "__main__":
    print("🔍 HOPE ML Preprocessing Utility")
    print("="*40)
    validate_dataset()
    print("\nTo balance dataset, run: balance_dataset()")
