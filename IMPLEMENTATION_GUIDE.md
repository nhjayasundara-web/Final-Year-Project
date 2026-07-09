# HOPE Implementation Guidelines

This guide explains how to implement, customize, test, and deploy the HOPE application.

## 1. Confirm scope and roles

Recommended user roles:

- Patient: learns, tracks reminders, checks educational risk, requests appointments, joins community.
- Caregiver: supports a patient and accesses education/support resources.
- Doctor: reviews appointment requests and contributes approved medical content.
- Pharmacist: updates medicine availability and responds to medicine requests.
- Admin: manages users, articles, providers, pharmacy records, reports, and moderation.

The current code includes authentication and role fields. Admin dashboards can be added on top of the existing API routes.

## 2. Data model

Core collections:

| Collection | Purpose |
| --- | --- |
| users | Registered users with hashed passwords and roles |
| articles | Awareness and education content |
| assessments | Educational risk assessment results |
| ai_results | Uploaded image analysis metadata and triage output |
| medicines | Medicine inventory and pharmacy availability |
| medicine_requests | User medicine search/request history |
| providers | Hospitals, clinics, counsellors, oncology units, labs |
| appointments | Appointment/contact requests |
| community_posts | Community forum posts |
| community_comments | Replies to community posts |
| support_resources | Counselling, mental health, financial, and emergency resources |

For production, add audit fields such as `createdBy`, `updatedBy`, `reviewedBy`, `reviewStatus`, and `contentVersion`.

## 3. Backend implementation steps

1. Create MongoDB Atlas cluster.
2. Add database user and restrict IP access.
3. Copy `backend/.env.example` to `backend/.env`.
4. Set `MONGO_URI`, `MONGO_DB_NAME`, `SECRET_KEY`, and `JWT_SECRET`.
5. Run `python seed.py` to insert starting data.
6. Run `python run.py` in development or Gunicorn in production.
7. Test health endpoint: `GET /api/health`.
8. Test auth: register, login, and call `GET /api/auth/me` with the token.

## 4. Frontend implementation steps

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_API_URL=http://localhost:5000/api` for local development.
3. Run `npm install`.
4. Run `npm run dev`.
5. Check responsive layout on desktop, tablet, and mobile.
6. Replace demo text, demo locations, and demo stock data with approved project data.

## 5. Medical content governance

Because this is a healthcare support system, create a content review workflow:

- Draft content by project team.
- Review by qualified medical professional.
- Store sources and review dates in each article.
- Display last reviewed date in the UI.
- Re-review content at least every 6 to 12 months or whenever guidelines change.

The app must clearly state that it supports awareness and navigation only. It must not tell a user they have or do not have cancer.

## 6. AI implementation guidelines

The backend now supports two modes:

1. Safe default mode: no trained model is configured, so the endpoint returns a labelled demo heuristic.
2. Real model mode: a TensorFlow/Keras model trained on actual breast ultrasound images is configured through `MODEL_PATH`.

For the academic implementation, train the included MobileNetV2 classifier on a real dataset such as BUSI. Do not use synthetic data, GAN-generated images, artificial tumor overlays, or mask images as classification inputs. The training script is `backend/ml/train_busi_classifier.py`; the full guide is `docs/real-dataset-ml-training.md`.

Minimum safe ML workflow:

- Download a real, cited medical imaging dataset according to its license.
- Organize actual images into `benign`, `malignant`, and `normal` folders.
- Keep masks separate; they are for segmentation, not classification input.
- Use train, validation, and held-out test sets.
- Use patient-level splitting where patient IDs are available.
- Report accuracy, malignant recall/sensitivity, specificity, macro F1, AUC, and confusion matrix.
- Review false negatives with a qualified supervisor or clinician.
- Keep the UI wording as triage/education only, never diagnosis.

Recommended API behavior:

- Low confidence: tell user the model is uncertain and recommend clinical review for concerns.
- Benign-like lesion signal: recommend professional review.
- Malignant-like signal: recommend urgent professional review.
- Always show emergency and provider links.

## 7. Security guidelines

- Hash all passwords with a strong algorithm.
- Never store plain text passwords.
- Use HTTPS and secure cookies in production.
- Store JWT secrets in environment variables only.
- Validate file types and file sizes for uploads.
- Scan uploads before storing them permanently.
- Do not expose medical images publicly.
- Add rate limiting to auth and upload endpoints.
- Add role-based permissions to admin/pharmacy/provider write routes.
- Moderate community content and remove harmful misinformation.

## 8. Testing plan

Backend tests:

- Health endpoint returns OK.
- Register/login flow works.
- Invalid login fails.
- Content endpoints return seeded data.
- Assessment endpoint returns a disclaimer and recommendations.
- Medicine search filters by name/location.
- Authenticated community post creation works.
- Upload endpoint rejects non-image files.

Frontend tests:

- Navigation renders on mobile and desktop.
- Forms validate required fields.
- API error states are displayed clearly.
- Auth state persists after refresh.
- Protected dashboard redirects unauthenticated users.
- Accessibility checks for contrast, labels, keyboard navigation.

## 9. Deployment plan

Recommended deployment paths:

- Frontend: Vercel, Netlify, Firebase Hosting, or Nginx container.
- Backend: Render, Railway, Fly.io, AWS, Azure, GCP, or Docker on VPS.
- Database: MongoDB Atlas.
- Upload storage: Cloudinary, Firebase Storage, AWS S3, or Google Cloud Storage.

Production steps:

1. Create production MongoDB Atlas cluster.
2. Deploy backend with environment variables.
3. Deploy frontend with production `VITE_API_URL`.
4. Configure CORS to allow only the frontend domain.
5. Enable HTTPS.
6. Run seed script only for approved starter content.
7. Create admin user manually and remove demo accounts.
8. Run smoke tests.
9. Set monitoring and backups.

## 10. Suggested future improvements

- Admin dashboard for content approval and moderation.
- Pharmacy portal for inventory updates.
- Doctor portal for appointment management.
- Patient reminder calendar with email/SMS notifications.
- Sinhala and Tamil translations.
- Offline-first awareness content for low-connectivity users.
- Analytics dashboard for project success metrics.
- Integration with real hospital/pharmacy systems after approvals.
