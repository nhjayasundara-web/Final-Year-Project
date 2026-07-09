FLASK_ENV=development
SECRET_KEY=change-this-secret
JWT_SECRET=change-this-jwt-secret
JWT_EXPIRES_HOURS=24
MONGO_URI=mongodb://localhost:27017/hope
MONGO_DB_NAME=hope
CORS_ORIGINS=http://localhost:5173,http://localhost:8080
UPLOAD_FOLDER=uploads
MAX_UPLOAD_MB=8

# Empty MODEL_PATH keeps the safe demo heuristic enabled.
# After training with a real dataset, set these values:
MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
MODEL_IMAGE_SIZE=224
MODEL_PREPROCESSING=mobilenet_v2
