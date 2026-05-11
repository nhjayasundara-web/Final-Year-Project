# ============================================================
# HOPE — Flask Entry Point
# Save to: backend/run.py
#
# Development:  python run.py
# Production:   gunicorn -w 4 -b 0.0.0.0:5000 "run:app"
# ============================================================

import os
from app import create_app
from app.config import config_map

env = os.getenv("FLASK_ENV", "development")
app = create_app(config_map.get(env, config_map["development"]))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=app.config["DEBUG"])
