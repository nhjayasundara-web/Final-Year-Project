# ============================================================
# HOPE — Flask App Factory
# Save to: backend/app/__init__.py
# ============================================================

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from .config import Config

# Global DB reference
mongo_client = None
db           = None

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ── Extensions ──
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    JWTManager(app)

    # ── MongoDB connection ──
    global mongo_client, db
    mongo_client = MongoClient(app.config["MONGO_URI"])
    db = mongo_client[app.config["DB_NAME"]]

    # ── Register Blueprints ──
    from .routes.auth      import auth_bp
    from .routes.detection import detection_bp
    from .routes.awareness import awareness_bp
    from .routes.community import community_bp
    from .routes.medicine  import medicine_bp
    from .routes.hospital  import hospital_bp
    from .routes.support   import support_bp

    app.register_blueprint(auth_bp,      url_prefix="/api/auth")
    app.register_blueprint(detection_bp, url_prefix="/api/detect")
    app.register_blueprint(awareness_bp, url_prefix="/api/awareness")
    app.register_blueprint(community_bp, url_prefix="/api/community")
    app.register_blueprint(medicine_bp,  url_prefix="/api/medicine")
    app.register_blueprint(hospital_bp,  url_prefix="/api/hospital")
    app.register_blueprint(support_bp,   url_prefix="/api/support")

    # ── Health check ──
    @app.route("/api/health")
    def health():
        return {"status": "ok", "platform": "HOPE", "version": "1.0.0"}

    return app
