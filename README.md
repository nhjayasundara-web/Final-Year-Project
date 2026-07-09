# HOPE - Early Detection, Better Protection

HOPE is a full stack healthcare support platform for breast cancer awareness, guided self-examination, risk education, AI-assisted image triage with a real-dataset training pipeline, emotional support, medicine availability tracking, provider communication, and patient community support.

The project follows the proposal requirements: React with TypeScript and Tailwind CSS on the frontend, Flask REST APIs on the backend, MongoDB Atlas support, TensorFlow/Keras model integration plus a real BUSI dataset training script, and cloud storage placeholders for uploaded images.

> Medical safety note: HOPE is an educational and support system. It does not diagnose cancer, replace mammograms, replace pathology, or replace clinician review. Any breast change, symptom, abnormal image, or high-risk result should be reviewed by a qualified healthcare professional.

## Main features

- Warm responsive landing page inspired by the HOPE theme: soft cream background, rose accents, rounded cards, calming healthcare language, and mobile-first navigation.
- Secure registration and login with password hashing and JWT authentication.
- Awareness library with symptoms, risk factors, screening guidance, treatment navigation, and emotional support articles.
- Guided self-examination module with monthly reminder support.
- Educational risk checker with clear next-step recommendations.
- AI image analysis endpoint that supports a trained TensorFlow/Keras model and includes a MobileNetV2 training pipeline for real breast ultrasound datasets such as BUSI. No synthetic images are used by the training script.
- Medicine search and availability tracking using demo pharmacy inventory data.
- Healthcare provider directory and appointment request flow.
- Community forum with authenticated posts and comments.
- Support hub with counsellor data, affirmations, emergency guidance, and educational resources.
- MongoDB Atlas or local JSON storage fallback for easy development.
- Docker setup for frontend, backend, and MongoDB.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, Flask, Flask-CORS |
| Database | MongoDB Atlas or local JSON fallback |
| AI | TensorFlow/Keras optional model loader, PIL/NumPy image preprocessing |
| Storage | Local uploads by default, Cloudinary/Firebase placeholders |
| Auth | JWT, Werkzeug password hashing |
| Deployment | Docker Compose, Nginx frontend container, Gunicorn backend |

## Project structure

```text
hope-complete-app/
  backend/
    app/
      routes/              Flask REST API routes
      services/            AI and upload services
      config.py            Environment configuration
      db.py                MongoDB/JSON storage adapter
      seeds.py             Demo data seeding
    ml/                    Real-dataset ML training scripts
    requirements.txt
    requirements-ai.txt
    run.py
    seed.py
    Dockerfile
  frontend/
    src/
      components/
      context/
      lib/
      pages/
      App.tsx
      main.tsx
    package.json
    tailwind.config.js
    Dockerfile
    nginx.conf
  docs/
    api-endpoints.md
    ai-model-integration.md
    deployment-checklist.md
    real-dataset-ml-training.md
  docker-compose.yml
  IMPLEMENTATION_GUIDE.md
```

## Quick start without Docker

### 1. Start the backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
python run.py
```

The backend runs on `http://localhost:5000`.

If `MONGO_URI` is empty, the backend uses `backend/data/*.json` files automatically. This lets the app run immediately for demonstration and classroom evaluation. To use MongoDB Atlas, set `MONGO_URI` and `MONGO_DB_NAME` in `backend/.env`.

### 2. Start the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173` and calls `http://localhost:5000/api`.

### 3. Demo accounts

Created by `python seed.py`:

| Role | Email | Password |
| --- | --- | --- |
| Patient | patient@hope.local | Patient123! |
| Doctor | doctor@hope.local | Doctor123! |
| Pharmacist | pharmacist@hope.local | Pharmacist123! |
| Admin | admin@hope.local | HopeAdmin123! |

Change these passwords before any real deployment.

## Quick start with Docker

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

Services:

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000/api`
- MongoDB: `localhost:27017`

## Environment variables

Backend `.env`:

```env
FLASK_ENV=development
SECRET_KEY=change-this-secret
JWT_SECRET=change-this-jwt-secret
JWT_EXPIRES_HOURS=24
MONGO_URI=
MONGO_DB_NAME=hope_app
CORS_ORIGINS=http://localhost:5173,http://localhost:8080
UPLOAD_FOLDER=uploads
MAX_UPLOAD_MB=8
MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
MODEL_IMAGE_SIZE=224
MODEL_PREPROCESSING=mobilenet_v2
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## AI model integration summary

The endpoint `/api/ai/analyze-image` accepts an image file. If no trained model is configured, it returns a clearly labelled demo heuristic. For the actual project model, train on a real public medical dataset; do not use synthetic images.

Recommended academic model:

- Dataset: BUSI or another real breast ultrasound dataset with normal, benign, and malignant classes.
- Architecture: MobileNetV2 transfer-learning classifier.
- Output: three-class probabilities for `benign`, `malignant`, and `normal`.
- Training script: `backend/ml/train_busi_classifier.py`.
- Synthetic data: not used.

Training command:

```bash
cd backend
pip install -r requirements.txt
pip install -r requirements-ai.txt
python ml/train_busi_classifier.py \
  --data datasets/BUSI \
  --model-out models/breast_screening.keras \
  --labels-out models/busi_labels.json \
  --report-out reports/busi_training_report.json
```

Configure the backend after training:

```env
MODEL_PATH=models/breast_screening.keras
MODEL_LABELS_PATH=models/busi_labels.json
MODEL_IMAGE_SIZE=224
MODEL_PREPROCESSING=mobilenet_v2
```

See `docs/real-dataset-ml-training.md` and `docs/ai-model-integration.md` for the complete training and safety workflow. Do not deploy the AI result as a diagnosis unless it has been validated, audited, and approved for the intended clinical use.

## Implementation phases

1. Requirement validation: confirm user roles, workflows, Sri Lankan provider/pharmacy sources, and clinical disclaimers.
2. UI/UX: adapt the current warm responsive prototype, then test with patients/caregivers.
3. Backend setup: configure MongoDB Atlas, JWT secrets, CORS, HTTPS, and audit logging.
4. Core modules: awareness, self-exam, risk check, support, provider directory, medicine tracking.
5. AI integration: connect validated model, define safety thresholds, and route uncertain cases to clinicians.
6. Testing: unit tests, API tests, accessibility checks, mobile checks, security checks.
7. Deployment: containerize, configure CI/CD, seed production data, and monitor logs.
8. Maintenance: keep medical content reviewed by professionals and update inventory/provider data regularly.

## Important production checklist

- Use HTTPS only.
- Replace all demo users and demo data.
- Use strong secrets and rotate them.
- Enable MongoDB Atlas network restrictions.
- Add role-based admin screens before letting pharmacies/providers edit live data.
- Store uploads in Cloudinary, Firebase Storage, S3, or another managed secure storage service.
- Add consent screens before image upload and community posting.
- Add moderation for community content.
- Add backups and audit logs.
- Add a clinician-approved content review workflow.
- Add automated tests and run them in CI/CD.
