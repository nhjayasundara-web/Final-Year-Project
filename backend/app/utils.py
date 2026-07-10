from collections import defaultdict, deque
from functools import wraps
from time import time

import jwt
from flask import current_app, jsonify, request

_RATE_LIMIT_BUCKETS = defaultdict(deque)


def public_user(user):
    if not user:
        return None
    return {k: v for k, v in user.items() if k not in {"passwordHash"}}


def get_token_payload():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1].strip()
    if not token:
        return None
    try:
        return jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


def current_user_optional():
    payload = get_token_payload()
    if not payload:
        return None
    return current_app.store.get("users", payload.get("sub"))


def require_auth(roles=None):
    allowed = set(roles or [])

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = current_user_optional()
            if not user:
                return jsonify({"error": "Authentication required"}), 401
            if allowed and user.get("role") not in allowed:
                return jsonify({"error": "You do not have permission for this action"}), 403
            request.user = user
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def require_rate_limit(key, limit, window_seconds=60):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            identity = request.headers.get("X-Forwarded-For") or request.remote_addr or "anonymous"
            bucket_key = f"{key}:{identity}"
            bucket = _RATE_LIMIT_BUCKETS[bucket_key]
            now = time()
            while bucket and now - bucket[0] > window_seconds:
                bucket.popleft()
            if len(bucket) >= limit:
                return jsonify({"error": "Too many requests. Please try again shortly."}), 429
            bucket.append(now)
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def audit_fields(actor=None, **extra):
    fields = {
        "createdBy": actor.get("id") if actor else None,
        "updatedBy": actor.get("id") if actor else None,
    }
    fields.update(extra)
    return {key: value for key, value in fields.items() if value is not None}


def clean_text(value, max_len=1000):
    if value is None:
        return ""
    value = str(value).strip()
    return value[:max_len]


def contains(value, query):
    return query.lower() in str(value or "").lower()


def safe_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"true", "1", "yes", "on"}
    return bool(value)
