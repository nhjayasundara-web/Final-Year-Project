# ============================================================
# HOPE — Community Routes
# Save to: backend/app/routes/community.py
# ============================================================

from flask              import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app                import db
from app.models.post    import (
    create_post, get_posts, get_post_by_id,
    toggle_like, add_comment, delete_post
)
from app.models.user import find_user_by_id, _safe_user

community_bp = Blueprint("community", __name__)

def ok(data, msg="Success", status=200):
    return jsonify({"success": True,  "data": data,   "message": msg}), status
def err(msg, status=400):
    return jsonify({"success": False, "error": msg}), status


@community_bp.route("/posts", methods=["GET"])
def list_posts():
    category = request.args.get("category")
    page     = int(request.args.get("page",  1))
    limit    = int(request.args.get("limit", 10))
    posts, total = get_posts(db, category, page, limit)
    return ok({"posts": posts, "total": total, "page": page, "total_pages": -(-total // limit)})


@community_bp.route("/posts/<post_id>", methods=["GET"])
def get_post(post_id):
    post = get_post_by_id(db, post_id)
    if not post:
        return err("Post not found.", 404)
    return ok(post)


@community_bp.route("/posts", methods=["POST"])
@jwt_required()
def create():
    user_id = get_jwt_identity()
    user    = find_user_by_id(db, user_id)
    if not user:
        return err("User not found.", 404)
    data = request.get_json(silent=True) or {}
    if not data.get("title") or not data.get("content"):
        return err("Title and content are required.")
    post = create_post(db, data, _safe_user(user))
    return ok(post, "Post created.", 201)


@community_bp.route("/posts/<post_id>/like", methods=["POST"])
@jwt_required()
def like_post(post_id):
    user_id = get_jwt_identity()
    post    = toggle_like(db, post_id, user_id)
    if not post:
        return err("Post not found.", 404)
    return ok(post)


@community_bp.route("/posts/<post_id>/comments", methods=["POST"])
@jwt_required()
def comment(post_id):
    user_id = get_jwt_identity()
    user    = find_user_by_id(db, user_id)
    data    = request.get_json(silent=True) or {}
    if not data.get("content"):
        return err("Comment content is required.")
    post = add_comment(db, post_id, data["content"], _safe_user(user))
    if not post:
        return err("Post not found.", 404)
    return ok(post, "Comment added.", 201)


@community_bp.route("/posts/<post_id>", methods=["DELETE"])
@jwt_required()
def remove_post(post_id):
    user_id = get_jwt_identity()
    deleted = delete_post(db, post_id, user_id)
    if not deleted:
        return err("Post not found or you do not have permission.", 404)
    return ok(None, "Post deleted.")
