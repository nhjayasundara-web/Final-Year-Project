from flask import Flask, jsonify
from flask_cors import CORS

from .config import Config
from .db import Store
from .seeds import seed_defaults
from .routes.admin import admin_bp
from .routes.auth import auth_bp
from .routes.content import content_bp
from .routes.assessments import assessments_bp
from .routes.ai import ai_bp
from .routes.medicines import medicines_bp
from .routes.providers import providers_bp
from .routes.community import community_bp
from .routes.support import support_bp


def create_app(seed=True):
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    app.store = Store(
        mongo_uri=app.config.get("MONGO_URI"),
        mongo_db_name=app.config.get("MONGO_DB_NAME"),
        data_dir=app.config.get("DATA_DIR"),
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(content_bp)
    app.register_blueprint(assessments_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(medicines_bp)
    app.register_blueprint(providers_bp)
    app.register_blueprint(community_bp)
    app.register_blueprint(support_bp)

    @app.get("/api/health")
    def health():
        return jsonify(
            {
                "status": "ok",
                "service": "HOPE API",
                "storage": app.store.kind,
                "medicalDisclaimer": "Educational support only. Not a diagnosis.",
            }
        )

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Route not found"}), 404

    @app.errorhandler(413)
    def file_too_large(_error):
        return jsonify({"error": "Uploaded file is too large"}), 413

    if seed:
        with app.app_context():
            seed_defaults(app.store)

    return app
