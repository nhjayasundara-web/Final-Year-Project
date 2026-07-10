"""Train the HOPE breast ultrasound classifier on a real dataset.

This script is intentionally strict about data provenance: it does not create
synthetic images and it does not use GAN-generated samples. It expects an actual
breast ultrasound dataset on disk, such as BUSI, organized as:

    datasets/BUSI/
      benign/*.png
      malignant/*.png
      normal/*.png

Mask files are ignored for classification training. Keep them for a future
segmentation model if needed.
"""

from __future__ import annotations

import argparse
import json
import os
import random
from collections import Counter
from pathlib import Path
from typing import Dict, Iterable, List, Sequence, Tuple

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import label_binarize

CLASS_NAMES = ["benign", "malignant", "normal"]
VALID_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train MobileNetV2 on real BUSI breast ultrasound images.")
    parser.add_argument("--data", required=True, help="Path to real dataset root containing benign, malignant, normal folders.")
    parser.add_argument("--model-out", default="models/breast_screening.keras", help="Output .keras model path.")
    parser.add_argument("--labels-out", default="models/busi_labels.json", help="Output label metadata JSON path.")
    parser.add_argument("--report-out", default="reports/busi_training_report.json", help="Output training report JSON path.")
    parser.add_argument("--img-size", type=int, default=224, help="Image width and height used by MobileNetV2.")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size.")
    parser.add_argument("--epochs", type=int, default=25, help="Maximum frozen-base training epochs.")
    parser.add_argument("--fine-tune-epochs", type=int, default=8, help="Maximum fine-tuning epochs. Use 0 to skip.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed.")
    parser.add_argument("--test-size", type=float, default=0.15, help="Fraction reserved for final test.")
    parser.add_argument("--val-size", type=float, default=0.15, help="Fraction reserved for validation.")
    parser.add_argument("--weights", choices=["imagenet", "none"], default="imagenet", help="MobileNetV2 base weights.")
    return parser.parse_args()


def seed_everything(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    tf.random.set_seed(seed)
    os.environ["PYTHONHASHSEED"] = str(seed)


def is_training_image(path: Path) -> bool:
    if path.suffix.lower() not in VALID_EXTENSIONS:
        return False
    name = path.stem.lower()
    # BUSI includes lesion mask files beside images. Do not train the classifier
    # on masks because that would leak labels and inflate performance.
    return "mask" not in name


def collect_samples(data_root: Path) -> Tuple[List[str], List[int]]:
    paths: List[str] = []
    labels: List[int] = []
    for label_index, class_name in enumerate(CLASS_NAMES):
        class_dir = data_root / class_name
        if not class_dir.exists():
            raise FileNotFoundError(f"Missing class folder: {class_dir}")
        class_paths = sorted(path for path in class_dir.rglob("*") if path.is_file() and is_training_image(path))
        if not class_paths:
            raise ValueError(f"No image files found in {class_dir}")
        for path in class_paths:
            paths.append(str(path))
            labels.append(label_index)
    return paths, labels


def stratified_split(
    paths: Sequence[str], labels: Sequence[int], test_size: float, val_size: float, seed: int
) -> Dict[str, Tuple[List[str], List[int]]]:
    if test_size <= 0 or val_size <= 0 or test_size + val_size >= 0.8:
        raise ValueError("Use reasonable split values, for example test-size=0.15 and val-size=0.15")

    train_val_paths, test_paths, train_val_labels, test_labels = train_test_split(
        list(paths), list(labels), test_size=test_size, random_state=seed, stratify=list(labels)
    )
    relative_val = val_size / (1.0 - test_size)
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        train_val_paths,
        train_val_labels,
        test_size=relative_val,
        random_state=seed,
        stratify=train_val_labels,
    )
    return {
        "train": (train_paths, train_labels),
        "validation": (val_paths, val_labels),
        "test": (test_paths, test_labels),
    }


def load_image(path: tf.Tensor, label: tf.Tensor, img_size: int) -> Tuple[tf.Tensor, tf.Tensor]:
    image_bytes = tf.io.read_file(path)
    image = tf.image.decode_image(image_bytes, channels=3, expand_animations=False)
    image.set_shape([None, None, 3])
    image = tf.image.resize(image, [img_size, img_size])
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image, label


def make_dataset(paths: Sequence[str], labels: Sequence[int], img_size: int, batch_size: int, shuffle: bool, seed: int):
    dataset = tf.data.Dataset.from_tensor_slices((list(paths), list(labels)))
    if shuffle:
        dataset = dataset.shuffle(buffer_size=len(paths), seed=seed, reshuffle_each_iteration=True)
    dataset = dataset.map(lambda path, label: load_image(path, label, img_size), num_parallel_calls=tf.data.AUTOTUNE)
    return dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)


def class_weights(labels: Iterable[int]) -> Dict[int, float]:
    counts = Counter(labels)
    total = sum(counts.values())
    num_classes = len(CLASS_NAMES)
    return {index: total / (num_classes * counts[index]) for index in range(num_classes)}


def build_model(img_size: int, weights: str) -> tf.keras.Model:
    base = tf.keras.applications.MobileNetV2(
        input_shape=(img_size, img_size, 3),
        include_top=False,
        weights="imagenet" if weights == "imagenet" else None,
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=(img_size, img_size, 3))
    x = base(inputs, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(len(CLASS_NAMES), activation="softmax")(x)
    model = tf.keras.Model(inputs=inputs, outputs=outputs, name="hope_busi_mobilenetv2")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def callbacks(model_out: Path):
    model_out.parent.mkdir(parents=True, exist_ok=True)
    return [
        tf.keras.callbacks.ModelCheckpoint(str(model_out), monitor="val_loss", save_best_only=True),
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=6, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", patience=3, factor=0.5, min_lr=1e-6),
    ]


def evaluate_model(model: tf.keras.Model, dataset, labels: Sequence[int]) -> Dict:
    probabilities = model.predict(dataset, verbose=0)
    predicted = np.argmax(probabilities, axis=1)
    report = classification_report(labels, predicted, target_names=CLASS_NAMES, output_dict=True, zero_division=0)
    matrix = confusion_matrix(labels, predicted, labels=list(range(len(CLASS_NAMES))))

    try:
        y_true = label_binarize(labels, classes=list(range(len(CLASS_NAMES))))
        auc = float(roc_auc_score(y_true, probabilities, average="macro", multi_class="ovr"))
    except Exception:
        auc = None

    return {
        "accuracy": float(np.mean(predicted == np.array(labels))),
        "macro_auc_ovr": auc,
        "classification_report": report,
        "confusion_matrix": matrix.tolist(),
    }


def main() -> None:
    args = parse_args()
    seed_everything(args.seed)

    data_root = Path(args.data).resolve()
    model_out = Path(args.model_out).resolve()
    labels_out = Path(args.labels_out).resolve()
    report_out = Path(args.report_out).resolve()

    paths, labels = collect_samples(data_root)
    splits = stratified_split(paths, labels, args.test_size, args.val_size, args.seed)

    train_paths, train_labels = splits["train"]
    val_paths, val_labels = splits["validation"]
    test_paths, test_labels = splits["test"]

    train_ds = make_dataset(train_paths, train_labels, args.img_size, args.batch_size, shuffle=True, seed=args.seed)
    val_ds = make_dataset(val_paths, val_labels, args.img_size, args.batch_size, shuffle=False, seed=args.seed)
    test_ds = make_dataset(test_paths, test_labels, args.img_size, args.batch_size, shuffle=False, seed=args.seed)

    model = build_model(args.img_size, args.weights)
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        class_weight=class_weights(train_labels),
        callbacks=callbacks(model_out),
    )

    if args.fine_tune_epochs > 0:
        base_model = next(layer for layer in model.layers if isinstance(layer, tf.keras.Model) and layer.name.startswith("mobilenetv2"))
        base_model.trainable = True
        for layer in base_model.layers[:-30]:
            layer.trainable = False
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"],
        )
        fine_history = model.fit(
            train_ds,
            validation_data=val_ds,
            epochs=args.fine_tune_epochs,
            class_weight=class_weights(train_labels),
            callbacks=callbacks(model_out),
        )
        for key, value in fine_history.history.items():
            history.history[f"fine_tune_{key}"] = value

    # Save final model after restoring best checkpoint weights.
    model.save(model_out)

    labels_payload = {
        "classes": CLASS_NAMES,
        "class_to_index": {name: index for index, name in enumerate(CLASS_NAMES)},
        "source_dataset": "BUSI or compatible real breast ultrasound dataset",
        "preprocessing": "mobilenet_v2",
        "image_size": args.img_size,
        "synthetic_data_used": False,
    }
    labels_out.parent.mkdir(parents=True, exist_ok=True)
    labels_out.write_text(json.dumps(labels_payload, indent=2), encoding="utf-8")

    report_payload = {
        "dataset_root": str(data_root),
        "classes": CLASS_NAMES,
        "synthetic_data_used": False,
        "split_counts": {
            "train": dict(Counter(CLASS_NAMES[label] for label in train_labels)),
            "validation": dict(Counter(CLASS_NAMES[label] for label in val_labels)),
            "test": dict(Counter(CLASS_NAMES[label] for label in test_labels)),
        },
        "class_weights": class_weights(train_labels),
        "history": {key: [float(item) for item in value] for key, value in history.history.items()},
        "validation_metrics": evaluate_model(model, val_ds, val_labels),
        "test_metrics": evaluate_model(model, test_ds, test_labels),
        "limitations": [
            "This is an educational prototype, not a clinically validated diagnostic device.",
            "Use patient-level splitting when patient identifiers are available to avoid data leakage.",
            "External validation on the target population and imaging devices is required before real use.",
        ],
    }
    report_out.parent.mkdir(parents=True, exist_ok=True)
    report_out.write_text(json.dumps(report_payload, indent=2), encoding="utf-8")

    print(f"Saved model: {model_out}")
    print(f"Saved labels: {labels_out}")
    print(f"Saved report: {report_out}")


if __name__ == "__main__":
    main()
