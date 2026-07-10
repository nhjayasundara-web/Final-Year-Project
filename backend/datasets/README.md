# Dataset folder

Place real medical datasets here for local training. Do not commit patient data or large dataset files to Git.

For BUSI, use this structure:

```text
datasets/BUSI/
  benign/
  malignant/
  normal/
```

The training script ignores mask files for classification.
