from app import create_app
from app.seeds import seed_defaults

app = create_app(seed=False)

with app.app_context():
    seed_defaults(app.store)
    print("HOPE seed data is ready.")
