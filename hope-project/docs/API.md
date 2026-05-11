# ============================================================
# HOPE — REST API Documentation
# Save to: docs/API.md
# ============================================================

# 🎀 HOPE Platform — API Reference

**Base URL:** `http://localhost:5000/api`
**Auth:** Bearer JWT token in `Authorization` header
**Content-Type:** `application/json`

---

## Response Format

All endpoints return this envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Human-readable message"
}
```

Errors:
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## 🔐 Auth Endpoints `/api/auth`

### POST /register
Register a new user account.

**Body:**
```json
{
  "name":     "Nimesha Perera",
  "email":    "nimesha@example.com",
  "password": "SecurePass123!",
  "role":     "patient",
  "phone":    "+94771234567"
}
```

**Roles:** `patient` | `caregiver` | `doctor`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user":  { "_id": "...", "name": "...", "role": "patient", ... },
    "token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}
```

---

### POST /login
```json
{ "email": "nimesha@example.com", "password": "SecurePass123!" }
```
**Response 200:** Same structure as `/register`

---

### GET /me
Requires: `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "data": {
    "_id": "...", "name": "...", "email": "...",
    "role": "patient", "created_at": "2026-03-22T..."
  }
}
```

---

### PUT /me
Update logged-in user's profile.
**Body (any subset):**
```json
{
  "name": "Updated Name",
  "phone": "+94771234567",
  "dateOfBirth": "1985-06-15",
  "diagnosisDate": "2025-11-01",
  "stage": "II"
}
```

---

### POST /logout
Clears server-side session (client must delete JWT).

---

### POST /refresh
**Requires:** Refresh token in Authorization header.
**Response:** New access token.

---

## 🔬 Detection Endpoints `/api/detect`

### POST /image
Upload a mammogram image for AI analysis.

**Content-Type:** `multipart/form-data`
**Field:** `image` (JPG/PNG, max 10MB)

**Response 200:**
```json
{
  "data": {
    "_id":            "...",
    "image_url":      "https://cloudinary.com/...",
    "prediction":     "benign",
    "confidence":     78.4,
    "recommendation": "Please consult a specialist...",
    "raw_probs": {
      "normal": 12.1, "benign": 78.4, "malignant": 9.5
    },
    "created_at": "2026-05-11T..."
  }
}
```

**Prediction values:** `normal` | `benign` | `malignant` | `uncertain`

---

### POST /symptoms
Symptom-based risk assessment (no auth required).

**Body:**
```json
{
  "symptoms": [
    "Lump or thickening in breast or underarm",
    "Nipple discharge (other than breast milk)"
  ]
}
```

**Response 200:**
```json
{
  "data": {
    "risk_level":          "high",
    "symptoms":            ["..."],
    "high_risk_count":     1,
    "moderate_risk_count": 0,
    "advice":              "Please consult a doctor immediately...",
    "should_see_doctor":   true
  }
}
```

**Risk levels:** `low` | `moderate` | `high`

---

### GET /history
Returns logged-in user's detection history.

**Query params:** `page` (default 1), `limit` (default 10)

---

## 📖 Awareness Endpoints `/api/awareness`

### GET /articles
**Query params:** `category`, `page`, `limit`

**Categories:** `symptoms` | `prevention` | `treatment` | `lifestyle` | `screening`

**Response:**
```json
{
  "data": {
    "articles": [ { "_id": "...", "title": "...", "category": "...", "read_time": 5, ... } ],
    "total": 6,
    "page": 1
  }
}
```

---

### GET /articles/:id
Full article content.

---

### GET /self-exam
Returns all 5 self-examination steps in order.

---

### GET /risk-factors
Returns all risk factors (modifiable + non-modifiable).

---

## 👥 Community Endpoints `/api/community`

### GET /posts
**Query:** `category`, `page`, `limit`

**Response:**
```json
{
  "data": {
    "posts": [
      {
        "_id": "...", "title": "...", "content": "...",
        "author_name": "...", "author_role": "patient",
        "category": "recovery", "likes": 47,
        "comments": [...], "is_pinned": true,
        "created_at": "..."
      }
    ],
    "total": 24
  }
}
```

---

### POST /posts
**Auth required**
```json
{
  "title":    "My story",
  "content":  "Full post content...",
  "category": "recovery",
  "tags":     ["survivor", "chemo"]
}
```

---

### POST /posts/:id/like
**Auth required** — Toggles like on/off.

---

### POST /posts/:id/comments
**Auth required**
```json
{ "content": "Comment text here..." }
```

---

### DELETE /posts/:id
**Auth required** — Only the post author can delete.

---

## 💊 Medicine Endpoints `/api/medicine`

### GET /search
**Query:** `query` (name/generic/brand), `district`

**Response:**
```json
{
  "data": {
    "medicines": [
      {
        "_id": "...", "name": "Tamoxifen", "generic_name": "...",
        "brand": "Nolvadex", "category": "hormone",
        "is_essential": true,
        "pharmacies": [
          {
            "pharmacy_id": "...", "pharmacy_name": "...",
            "district": "Colombo", "in_stock": true,
            "price": 850, "phone": "..."
          }
        ]
      }
    ]
  }
}
```

---

### GET /medicine/:id
Full medicine details with all pharmacy stock.

---

### GET /medicine/:id/pharmacies
**Query:** `district`

---

### POST /stock-report
**Auth required** — Community stock reporting.
```json
{
  "pharmacyId": "p001",
  "medicineId": "...",
  "inStock":    false
}
```

---

## 🏥 Hospital Endpoints `/api/hospital`

### GET /search
**Query:** `district`, `specialty`

**Response:**
```json
{
  "data": {
    "hospitals": [
      {
        "_id": "...", "name": "Apeksha Hospital",
        "type": "government", "district": "Colombo",
        "phone": ["+94114620000"], "specialties": ["Oncology", ...],
        "has_cancer_unit": true, "has_oncologist": true,
        "emergency_available": true, "rating": 4.5,
        "lat": 6.8485, "lng": 79.9968
      }
    ]
  }
}
```

**Hospital types:** `government` | `private` | `teaching` | `clinic`

---

### GET /hospital/:id
Full hospital details.

---

### GET /hospital/nearby
Find hospitals near a GPS coordinate.
**Query:** `lat`, `lng`, `radius` (km, default 20)

---

## 💗 Support Endpoints `/api/support`

### GET /counsellors
**Query:** `language` (Sinhala | English | Tamil)

---

### GET /motivational
Returns up to 20 motivational items (quotes, stories, tips).

---

### POST /book/:counsellor_id
**Auth required**
```json
{
  "date":        "2026-05-20",
  "time":        "10:00",
  "sessionType": "online",
  "notes":       "I am currently in week 3 of chemotherapy..."
}
```

---

### GET /bookings
**Auth required** — Returns logged-in user's appointments.

---

## ✅ Health Check

### GET /health
No auth required.
```json
{ "status": "ok", "platform": "HOPE", "version": "1.0.0" }
```

---

## 🔑 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK |
| 201  | Created |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found |
| 409  | Conflict (e.g. duplicate email) |
| 500  | Internal Server Error |

---

*HOPE Platform API v1.0 | CIT310 | SLTC Research University 2022–2026*
