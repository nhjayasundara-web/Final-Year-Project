from flask import Blueprint, current_app, jsonify, request

from ..utils import audit_fields, clean_text, current_user_optional, require_auth, require_rate_limit

community_bp = Blueprint("community", __name__, url_prefix="/api/community")


@community_bp.get("/posts")
def list_posts():
    posts = sorted(current_app.store.all("community_posts"), key=lambda item: item.get("createdAt", ""), reverse=True)
    user = current_user_optional()
    if not user or user.get("role") != "admin":
        posts = [item for item in posts if item.get("moderationStatus", "approved") == "approved"]
    comments = current_app.store.all("community_comments")
    for post in posts:
        post["commentCount"] = len(
            [
                comment for comment in comments
                if comment.get("postId") == post.get("id")
                and ((user and user.get("role") == "admin") or comment.get("moderationStatus", "approved") == "approved")
            ]
        )
    return jsonify(
        {
            "items": posts,
            "communityGuidelines": [
                "Be kind and respectful.",
                "Do not diagnose others.",
                "Encourage professional care for symptoms or urgent worries.",
                "Do not share private medical records publicly.",
                "Posts and comments are reviewed before they become broadly visible.",
            ],
        }
    )


@community_bp.get("/posts/<post_id>")
def get_post(post_id):
    post = current_app.store.get("community_posts", post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    user = current_user_optional()
    if post.get("moderationStatus", "approved") != "approved" and (not user or user.get("role") != "admin"):
        return jsonify({"error": "Post not found"}), 404
    comments = current_app.store.find(
        "community_comments",
        lambda item: item.get("postId") == post_id
        and ((user and user.get("role") == "admin") or item.get("moderationStatus", "approved") == "approved")
    )
    return jsonify({"item": post, "comments": comments})


@community_bp.post("/posts")
@require_auth()
@require_rate_limit("community-posts", limit=6, window_seconds=300)
def create_post():
    data = request.get_json(silent=True) or {}
    title = clean_text(data.get("title"), 160)
    body = clean_text(data.get("body"), 2000)
    tags = data.get("tags") if isinstance(data.get("tags"), list) else []
    tags = [clean_text(tag, 40) for tag in tags][:5]
    consent = data.get("communityConsent") is True
    if not title or not body:
        return jsonify({"error": "Title and body are required"}), 400
    if not consent:
        return jsonify({"error": "You must confirm the community sharing consent"}), 400
    post = current_app.store.insert(
        "community_posts",
        {
            "authorId": request.user["id"],
            "authorName": request.user.get("name"),
            "authorRole": request.user.get("role"),
            "title": title,
            "body": body,
            "tags": tags,
            "moderationStatus": "pending",
            **audit_fields(request.user),
        },
    )
    return jsonify({"item": post, "message": "Post submitted for moderation review."}), 201


@community_bp.post("/posts/<post_id>/comments")
@require_auth()
@require_rate_limit("community-comments", limit=10, window_seconds=300)
def create_comment(post_id):
    if not current_app.store.get("community_posts", post_id):
        return jsonify({"error": "Post not found"}), 404
    data = request.get_json(silent=True) or {}
    body = clean_text(data.get("body"), 1200)
    consent = data.get("communityConsent") is True
    if not body:
        return jsonify({"error": "Comment body is required"}), 400
    if not consent:
        return jsonify({"error": "You must confirm the community sharing consent"}), 400
    comment = current_app.store.insert(
        "community_comments",
        {
            "postId": post_id,
            "authorId": request.user["id"],
            "authorName": request.user.get("name"),
            "authorRole": request.user.get("role"),
            "body": body,
            "moderationStatus": "pending",
            **audit_fields(request.user),
        },
    )
    return jsonify({"item": comment, "message": "Comment submitted for moderation review."}), 201
