# ============================================================
# HOPE — Breast Cancer Detection Model Training Script
# Save to: backend/ml/train.py
#
# Dataset: Use the Breast Ultrasound Images Dataset (BUSI)
#          or a Kaggle mammogram dataset.
# Architecture: Transfer Learning with MobileNetV2
# Classes: normal | benign | malignant
#
# Run: python ml/train.py
# ============================================================

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard
)

# ── Configuration ──────────────────────────────────────────
IMG_SIZE    = 224
BATCH_SIZE  = 32
EPOCHS      = 50
NUM_CLASSES = 3                          # normal, benign, malignant
DATASET_DIR = "ml/data"                 # Should contain: normal/, benign/, malignant/
MODEL_DIR   = "ml/model"
MODEL_NAME  = "breast_cancer_model.h5"

os.makedirs(MODEL_DIR, exist_ok=True)


# ── Data Augmentation ───────────────────────────────────────
train_datagen = ImageDataGenerator(
    rescale            = 1.0 / 255,
    rotation_range     = 20,
    width_shift_range  = 0.15,
    height_shift_range = 0.15,
    horizontal_flip    = True,
    vertical_flip      = False,
    zoom_range         = 0.15,
    brightness_range   = [0.85, 1.15],
    fill_mode          = "nearest",
    validation_split   = 0.2,
)

val_datagen = ImageDataGenerator(
    rescale          = 1.0 / 255,
    validation_split = 0.2,
)

train_gen = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size = (IMG_SIZE, IMG_SIZE),
    batch_size  = BATCH_SIZE,
    class_mode  = "categorical",
    subset      = "training",
    shuffle     = True,
    seed        = 42,
)

val_gen = val_datagen.flow_from_directory(
    DATASET_DIR,
    target_size = (IMG_SIZE, IMG_SIZE),
    batch_size  = BATCH_SIZE,
    class_mode  = "categorical",
    subset      = "validation",
    shuffle     = False,
)

print(f"✅ Classes: {train_gen.class_indices}")
print(f"   Training samples:   {train_gen.samples}")
print(f"   Validation samples: {val_gen.samples}")


# ── Model Architecture ──────────────────────────────────────
# Phase 1: Freeze base, train only top layers
base_model = MobileNetV2(
    input_shape = (IMG_SIZE, IMG_SIZE, 3),
    include_top = False,
    weights     = "imagenet",
)
base_model.trainable = False

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.4),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(NUM_CLASSES, activation="softmax"),
])

model.compile(
    optimizer = tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss      = "categorical_crossentropy",
    metrics   = ["accuracy", tf.keras.metrics.AUC(name="auc")],
)

model.summary()


# ── Callbacks ───────────────────────────────────────────────
callbacks = [
    ModelCheckpoint(
        filepath         = os.path.join(MODEL_DIR, MODEL_NAME),
        monitor          = "val_auc",
        save_best_only   = True,
        mode             = "max",
        verbose          = 1,
    ),
    EarlyStopping(
        monitor   = "val_auc",
        patience  = 10,
        mode      = "max",
        restore_best_weights = True,
        verbose   = 1,
    ),
    ReduceLROnPlateau(
        monitor  = "val_loss",
        factor   = 0.5,
        patience = 5,
        min_lr   = 1e-6,
        verbose  = 1,
    ),
    TensorBoard(log_dir="ml/logs", histogram_freq=1),
]

# ── Phase 1 Training ─────────────────────────────────────────
print("\n🚀 Phase 1: Training top layers…")
history1 = model.fit(
    train_gen,
    epochs          = 20,
    validation_data = val_gen,
    callbacks       = callbacks,
    verbose         = 1,
)

# ── Phase 2: Fine-tune last 30 layers of base ────────────────
print("\n🔧 Phase 2: Fine-tuning base model (last 30 layers)…")
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer = tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss      = "categorical_crossentropy",
    metrics   = ["accuracy", tf.keras.metrics.AUC(name="auc")],
)

history2 = model.fit(
    train_gen,
    epochs          = EPOCHS,
    initial_epoch   = 20,
    validation_data = val_gen,
    callbacks       = callbacks,
    verbose         = 1,
)

print(f"\n✅ Training complete. Best model saved to: {os.path.join(MODEL_DIR, MODEL_NAME)}")


# ── Evaluation ───────────────────────────────────────────────
print("\n📊 Evaluating on validation set…")
results = model.evaluate(val_gen, verbose=1)
print(f"   Loss:     {results[0]:.4f}")
print(f"   Accuracy: {results[1]:.4f}")
print(f"   AUC:      {results[2]:.4f}")


# ── Save class indices ───────────────────────────────────────
import json
with open(os.path.join(MODEL_DIR, "class_indices.json"), "w") as f:
    json.dump(train_gen.class_indices, f, indent=2)
print("✅ Class indices saved.")
