# ============================================================
# HOPE — Forum Post Model (MongoDB)
# Save to: backend/app/models/post.py
# ============================================================

from datetime import datetime, timezone
from bson     import ObjectId

VALID_CATEGORIES = {"general", "treatment", "emotional", "recovery", "tips"}

def create_post(db, data: dict, author: dict) -> dict:
    now = datetime.now(timezone.utc)
    doc = {
        "author_id":    author["_id"],
        "author_name":  author["name"],
        "author_avatar": author.get("avatar"),
        "author_role":  author["role"],
        "title":        data["title"],
        "content":      data["content"],
        "category":     data.get("category", "general"),
        "tags":         data.get("tags", []),
        "likes":        0,
        "liked_by":     [],
        "comments":     [],
        "is_pinned":    False,
        "is_flagged":   False,
        "created_at":   now,
        "updated_at":   now,
    }
    result = db.posts.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return _serialize(doc)


def get_posts(db, category: str = None, page: int = 1, limit: int = 10) -> tuple:
    query  = {"is_flagged": False}
    if category and category in VALID_CATEGORIES:
        query["category"] = category

    total  = db.posts.count_documents(query)
    cursor = db.posts.find(query) \
                     .sort([("is_pinned", -1), ("created_at", -1)]) \
                     .skip((page - 1) * limit) \
                     .limit(limit)
    posts  = [_serialize(p) for p in cursor]
    return posts, total


def get_post_by_id(db, post_id: str) -> dict | None:
    try:
        post = db.posts.find_one({"_id": ObjectId(post_id)})
        return _serialize(post) if post else None
    except Exception:
        return None


def toggle_like(db, post_id: str, user_id: str) -> dict | None:
    post = db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        return None
    liked_by = [str(uid) for uid in post.get("liked_by", [])]
    if user_id in liked_by:
        db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$pull": {"liked_by": user_id}, "$inc": {"likes": -1}}
        )
    else:
        db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$push": {"liked_by": user_id}, "$inc": {"likes": 1}}
        )
    return get_post_by_id(db, post_id)


def add_comment(db, post_id: str, content: str, author: dict) -> dict | None:
    now     = datetime.now(timezone.utc)
    comment = {
        "_id":          str(ObjectId()),
        "author_id":    author["_id"],
        "author_name":  author["name"],
        "author_avatar": author.get("avatar"),
        "content":      content,
        "likes":        0,
        "created_at":   now.isoformat(),
    }
    db.posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$push": {"comments": comment}, "$set": {"updated_at": now}}
    )
    return get_post_by_id(db, post_id)


def delete_post(db, post_id: str, user_id: str) -> bool:
    result = db.posts.delete_one({"_id": ObjectId(post_id), "author_id": user_id})
    return result.deleted_count > 0


def _serialize(doc: dict) -> dict:
    if not doc:
        return doc
    doc = dict(doc)
    if "_id" in doc and not isinstance(doc["_id"], str):
        doc["_id"] = str(doc["_id"])
    for key in ("created_at", "updated_at"):
        if isinstance(doc.get(key), datetime):
            doc[key] = doc[key].isoformat()
    return doc
