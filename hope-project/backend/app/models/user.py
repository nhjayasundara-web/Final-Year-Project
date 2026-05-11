# ============================================================
# HOPE — User Model (MongoDB)
# Save to: backend/app/models/user.py
# ============================================================

from datetime import datetime, timezone
from bson     import ObjectId
import bcrypt

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def check_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_user(db, data: dict) -> dict:
    """
    Insert a new user document into MongoDB.
    Returns the created user (without password).
    """
    now = datetime.now(timezone.utc)

    doc = {
        "name":          data["name"],
        "email":         data["email"].lower().strip(),
        "password_hash": hash_password(data["password"]),
        "role":          data.get("role", "patient"),   # patient | caregiver | doctor | admin
        "phone":         data.get("phone"),
        "avatar":        None,
        "is_verified":   False,
        "is_active":     True,
        # Patient-specific fields
        "date_of_birth":  data.get("dateOfBirth"),
        "diagnosis_date": data.get("diagnosisDate"),
        "cancer_stage":   data.get("stage"),
        # Doctor-specific fields
        "specialty":     data.get("specialty"),
        "hospital":      data.get("hospital"),
        "license_no":    data.get("licenseNo"),
        # Timestamps
        "created_at":    now,
        "updated_at":    now,
        "last_login":    None,
    }

    result = db.users.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return _safe_user(doc)


def find_user_by_email(db, email: str) -> dict | None:
    return db.users.find_one({"email": email.lower().strip()})


def find_user_by_id(db, user_id: str) -> dict | None:
    try:
        return db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None


def update_user(db, user_id: str, updates: dict) -> dict | None:
    updates["updated_at"] = datetime.now(timezone.utc)
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    return find_user_by_id(db, user_id)


def _safe_user(user: dict) -> dict:
    """Strip sensitive fields and serialize ObjectId."""
    user = dict(user)
    user.pop("password_hash", None)
    if "_id" in user and not isinstance(user["_id"], str):
        user["_id"] = str(user["_id"])
    # Convert datetime objects
    for key in ("created_at", "updated_at", "last_login"):
        if isinstance(user.get(key), datetime):
            user[key] = user[key].isoformat()
    return user
