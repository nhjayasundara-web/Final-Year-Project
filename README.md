# 🎗️ HOPE — Early Detection, Better Protection

### AI-Powered Breast Cancer Awareness, Detection & Support Platform
**CIT310 – Information Technology Project | #CIT310_01_26_56 | SLTC 2022–2026**

An intelligent healthcare platform designed to support breast cancer awareness, early-stage detection, emotional support, and community engagement. HOPE combines AI-powered image analysis, educational resources, counselling support, medicine guidance, and hospital services into one modern web application.

---

## 🎨 Project Overview

HOPE is developed as an academic Information Technology project focused on improving awareness and accessibility for breast cancer prevention and support. The platform empowers users through AI-assisted detection tools, educational content, healthcare resources, and supportive community features.

---

## ✨ Features

### 🩺 AI-Powered Detection

* Upload breast scan images for AI analysis
* TensorFlow/Keras-powered prediction system
* Detection result visualization
* Symptom checker assistance

### 📚 Awareness & Education

* Breast cancer awareness articles
* Self-examination guidance
* Risk factor quizzes
* Educational resources for early prevention

### 💬 Community Support

* Community discussion forum
* Share experiences and advice
* Motivational support feed
* User engagement features

### ❤️ Emotional & Counselling Support

* Counselling information cards
* Mental health support resources
* Motivational content system

### 💊 Medicine & Pharmacy Services

* Medicine search functionality
* Nearby pharmacy details
* Medicine information management

### 🏥 Hospital Assistance

* Hospital information system
* Interactive hospital map
* Nearby treatment center details

### 🔐 Authentication & Security

* User registration and login
* Secure authentication system
* Protected dashboard access

### 📱 Responsive Modern UI

* Clean healthcare-focused interface
* Mobile responsive design
* Built with Tailwind CSS
* Modern reusable UI components

---

## 🛠️ Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React.js + TypeScript + Vite |
| Styling  | Tailwind CSS                 |
| Backend  | Python Flask                 |
| Database | MongoDB Atlas                |
| AI/ML    | TensorFlow / Keras           |
| Storage  | Firebase / Cloudinary        |
| API      | REST API                     |


---

## 📁 Full Project Structure

```
hope-project/
├── frontend/                        # React.js + TypeScript + Tailwind CSS
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/                  # Images, icons, fonts
│   │   ├── styles/
│   │   │   └── globals.css          # Global CSS variables & base styles
│   │   ├── types/
│   │   │   └── index.ts             # Global TypeScript types/interfaces
│   │   ├── lib/
│   │   │   ├── api.ts               # Axios API client
│   │   │   └── utils.ts             # Utility functions
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Auth state hook
│   │   │   ├── useApi.ts            # Generic API hook
│   │   │   └── useToast.ts          # Toast notifications hook
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── Toast.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx       # Top navigation
│   │   │   │   ├── Sidebar.tsx      # Side navigation
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx       # Root layout wrapper
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── RegisterForm.tsx
│   │   │   │   ├── awareness/
│   │   │   │   │   ├── AwarenessCard.tsx
│   │   │   │   │   ├── SelfExamGuide.tsx
│   │   │   │   │   └── RiskFactorQuiz.tsx
│   │   │   │   ├── detection/
│   │   │   │   │   ├── ImageUploader.tsx
│   │   │   │   │   ├── SymptomChecker.tsx
│   │   │   │   │   └── DetectionResult.tsx
│   │   │   │   ├── support/
│   │   │   │   │   ├── CounsellingCard.tsx
│   │   │   │   │   └── MotivationalFeed.tsx
│   │   │   │   ├── community/
│   │   │   │   │   ├── ForumPost.tsx
│   │   │   │   │   └── ForumList.tsx
│   │   │   │   ├── medicine/
│   │   │   │   │   ├── MedicineSearch.tsx
│   │   │   │   │   └── PharmacyCard.tsx
│   │   │   │   └── hospital/
│   │   │   │       ├── HospitalMap.tsx
│   │   │   │       └── HospitalCard.tsx
│   │   │   └── pages/
│   │   │       ├── HomePage.tsx
│   │   │       ├── AuthPage.tsx
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── AwarenessPage.tsx
│   │   │       ├── DetectionPage.tsx
│   │   │       ├── SupportPage.tsx
│   │   │       ├── CommunityPage.tsx
│   │   │       ├── MedicinePage.tsx
│   │   │       └── HospitalPage.tsx
│   │   ├── App.tsx                  # Root component + Router
│   │   ├── main.tsx                 # Entry point
│   │   └── vite-env.d.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── backend/                         # Python Flask API
│   ├── app/
│   │   ├── __init__.py              # Flask app factory
│   │   ├── models/
│   │   │   ├── user.py              # User model (MongoDB)
│   │   │   ├── post.py              # Community post model
│   │   │   ├── medicine.py          # Medicine model
│   │   │   └── hospital.py          # Hospital model
│   │   ├── routes/
│   │   │   ├── auth.py              # /api/auth/*
│   │   │   ├── detection.py         # /api/detect/*
│   │   │   ├── awareness.py         # /api/awareness/*
│   │   │   ├── community.py         # /api/community/*
│   │   │   ├── medicine.py          # /api/medicine/*
│   │   │   └── hospital.py          # /api/hospital/*
│   │   └── services/
│   │       ├── ml_service.py        # TensorFlow model inference
│   │       ├── cloud_storage.py     # Firebase/Cloudinary upload
│   │       └── email_service.py     # Email notifications
│   ├── config/
│   │   └── config.py                # App configuration
│   ├── ml/
│   │   ├── model/                   # Saved TF model files
│   │   ├── train.py                 # Model training script
│   │   └── preprocess.py            # Image preprocessing
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_detection.py
│   │   └── test_medicine.py
│   ├── run.py                       # App entry point
│   └── requirements.txt
│
└── docs/
    ├── API.md                       # API documentation
    └── SETUP.md                     # Setup instructions
```


## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* Python (v3.10 or higher)
* MongoDB Atlas account
* npm or yarn

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/hope-project.git
cd hope-project
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

### 3️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
```

Backend runs on:

```bash
http://localhost:5000
```

---

## 📜 Available Scripts

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build production files
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend

```bash
python run.py      # Start Flask server
pytest             # Run backend tests
```

---

## 🎯 Core Modules

| Module         | Description                        |
| -------------- | ---------------------------------- |
| Authentication | User registration & login          |
| AI Detection   | Breast cancer prediction system    |
| Awareness      | Educational resources & guides     |
| Community      | User discussion platform           |
| Support        | Counselling & motivational content |
| Medicine       | Medicine and pharmacy information  |
| Hospital       | Hospital search & maps             |

---

## 🤖 AI Detection Workflow

1. User uploads a breast scan image
2. Image preprocessing is performed
3. TensorFlow model analyzes the image
4. Prediction results are generated
5. Detection report is displayed to the user

---

## 🧪 Testing

Backend tests are available inside:

```bash
backend/tests/
```

Run tests using:

```bash
pytest
```

---

## 👥 Team

| Role         | Name                     | Student ID |
| ------------ | ------------------------ | ---------- |
| Group Leader | S S A M Wijesiriwardhane | 22UG3-0210 |
| Member 1    | H.G. Punara Punsisi      | 22UG3-0873 |
| Member 2     | J.H. Naduni Hansika      | 22UG3-0315 |

---

## 🎓 Academic Project

This project was developed for:

* **Course:** CIT310 – Information Technology Project
* **Project Code:** #CIT310_01_26_56
* **Institution:** SLTC Research University
* **Batch:** 2022–2026

---

## 🤝 Contributing

This is an academic group project. For major modifications or feature additions, please coordinate with the project team before making changes.

---

## 📝 License

This project is developed for educational and academic purposes only.

---

## 🔗 Links

* Repository: Add GitHub Repository Link
* API Documentation: `/docs/API.md`
* Setup Guide: `/docs/SETUP.md`

---

### ❤️ Made with hope, care, and technology for better healthcare awareness.

