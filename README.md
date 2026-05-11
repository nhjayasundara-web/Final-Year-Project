# HOPE — Early Detection, Better Protection
### AI-Powered Breast Cancer Awareness, Detection & Support Platform
**CIT310 – Information Technology Project | #CIT310_01_26_56 | SLTC 2022–2026**

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

---

## 🚀 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend | Python Flask |
| Database | MongoDB Atlas |
| AI/ML | TensorFlow / Keras |
| Storage | Firebase / Cloudinary |
| API | REST API |

## 👥 Team
| Role | Name | Student ID |
|---|---|---|
| Group Leader | S S A M Wijesiriwardhane | 22UG3-0210 |
| Member 1 | H.G. Punara Punsisi | 22UG3-0873 |
| Member 2 | J.H. Naduni Hansika | 22UG3-0315 |
