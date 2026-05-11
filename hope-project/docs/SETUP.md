# ============================================================
# HOPE — Full Setup & Installation Guide
# Save to: docs/SETUP.md
# ============================================================

# 🎀 HOPE Platform — Setup Guide
**CIT310 Information Technology Project | #CIT310_01_26_56**

---

## 📋 Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.11+ | https://python.org |
| MongoDB Community | 7.0+ | https://mongodb.com/try/download |
| Git | Latest | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com |

---

## 🗂️ Project Structure Quick Reference

```
hope-project/
├── frontend/          ← React + TypeScript + Tailwind CSS
├── backend/           ← Python Flask REST API
│   ├── app/           ← Application code
│   ├── ml/            ← TensorFlow model + training scripts
│   └── tests/         ← Pytest unit tests
└── docs/              ← Documentation
```

---

## 🚀 Step 1: Clone / Set Up Project

```bash
# If using Git:
git clone https://github.com/your-org/hope-project.git
cd hope-project

# Or just navigate to the project folder:
cd hope-project
```

---

## ⚙️ Step 2: Backend Setup (Flask)

### 2a. Create Python virtual environment
```bash
cd backend
python -m venv venv

# Activate:
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate
```

### 2b. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2c. Set up environment variables
```bash
# Copy the template:
cp .env.example .env

# Edit .env with your values:
# - MONGO_URI (MongoDB Atlas connection string)
# - SECRET_KEY and JWT_SECRET_KEY (random strings)
# - Cloudinary credentials
# - Gmail SMTP credentials
```

### 2d. Start local MongoDB (if not using Atlas)
```bash
# Windows (run as admin):
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### 2e. Seed the database
```bash
# Make sure you are in the backend/ directory with venv active:
python ml/seed_db.py
```
This populates:
- 6 awareness articles
- 5 self-exam steps
- 12 risk factors
- 6 medicines with pharmacy data
- 7 hospitals across Sri Lanka
- 4 counsellors
- 10 motivational items
- 1 pinned forum post
- 1 admin user (admin@hope.lk / HopeAdmin@2026!)

### 2f. Start Flask backend
```bash
python run.py
```
Backend runs on: **http://localhost:5000**

Test: http://localhost:5000/api/health → should return `{"status": "ok", "platform": "HOPE"}`

---

## 🎨 Step 3: Frontend Setup (React)

### 3a. Install Node.js dependencies
```bash
cd frontend
npm install
```

### 3b. Set up frontend environment
```bash
cp .env.example .env
# Edit VITE_API_URL if your backend runs on a different port
```

### 3c. Start development server
```bash
npm run dev
```
Frontend runs on: **http://localhost:3000**

### 3d. Build for production
```bash
npm run build
# Output: frontend/dist/
```

---

## 🤖 Step 4: ML Model Setup (TensorFlow)

### 4a. Get the dataset
Download a breast cancer image dataset:
- **Recommended:** [Breast Ultrasound Images Dataset (BUSI)](https://www.kaggle.com/datasets/aryashah2k/breast-ultrasound-images-dataset)
- Alternative: Kaggle Mammography datasets

### 4b. Organise dataset
```
backend/ml/data/
├── normal/          ← Normal breast images
├── benign/          ← Benign mass images
└── malignant/       ← Malignant mass images
```

### 4c. Validate and balance dataset
```bash
cd backend
python ml/preprocess.py
```

### 4d. Train the model
```bash
python ml/train.py
```
- Training time: 2–6 hours depending on GPU availability
- Best model saved to: `backend/ml/model/breast_cancer_model.h5`
- TensorBoard logs: `backend/ml/logs/`

### 4e. Monitor training
```bash
tensorboard --logdir ml/logs
# Open: http://localhost:6006
```

---

## 🧪 Step 5: Run Tests

```bash
cd backend
pytest tests/ -v

# With coverage:
pytest tests/ -v --cov=app --cov-report=html
```

---

## 🌐 VS Code Extensions (Recommended)

Install these for the best development experience:
- **Python** (ms-python.python)
- **Pylance** (ms-python.vscode-pylance)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **TypeScript + JavaScript** (built-in)
- **MongoDB for VS Code** (mongodb.mongodb-vscode)
- **Thunder Client** (rangav.vscode-thunder-client) — REST API testing
- **GitLens** (eamodio.gitlens)

---

## 🔧 Common Issues & Solutions

### "Module not found" errors (Python)
```bash
# Make sure virtual environment is activated
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

### MongoDB connection failed
```bash
# Check if MongoDB is running:
mongosh                     # Should connect
# Or check Atlas URI in .env — remove angle brackets from <password>
```

### Cloudinary upload fails
- Ensure CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET are correct
- Free Cloudinary accounts support up to 25GB storage
- In development, image upload falls back gracefully (mock URL returned)

### TensorFlow not installing (Windows)
```bash
pip install tensorflow-cpu   # CPU-only version if no GPU
```

### Port already in use
```bash
# Change Flask port in .env:
PORT=5001
# Change Vite port in vite.config.ts:
server: { port: 3001 }
```

### CORS errors in browser
- Ensure CORS_ORIGINS in .env includes your frontend URL
- Restart Flask after changing .env

---

## 🏗️ MongoDB Atlas Setup (Cloud Database)

1. Create free account at https://cloud.mongodb.com
2. Create a new **M0 Free Tier** cluster
3. Create a database user with read/write access
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Click **Connect → Connect your application → Python 3.12**
6. Copy the URI and paste into your `.env` as MONGO_URI
7. Replace `<password>` with your database user password

---

## 📦 Deployment Guide

### Frontend (Netlify / Vercel)
```bash
cd frontend
npm run build
# Upload frontend/dist/ to Netlify or run:
npx netlify deploy --prod --dir dist
```

### Backend (Render / Railway)
1. Push backend code to GitHub
2. Connect to Render.com → New Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn -w 4 -b 0.0.0.0:$PORT "run:app"`
5. Add environment variables from .env

---

## 👥 Team Contacts

| Role | Name | Email |
|------|------|-------|
| Group Leader | S S A M Wijesiriwardhane | 22ug3-0210@sltc.ac.lk |
| Member 1 | SMKT Seneviratne | 22ug3-0742@sltc.ac.lk |
| Member 2 | H.G. Punara Punsisi | 22ug3-0873@sltc.ac.lk |
| Member 3 | J.H. Naduni Hansika | 22ug3-0315@sltc.ac.lk |

---

*CIT310 Information Technology Project | SLTC Research University | Academic Year 2022–2026*
