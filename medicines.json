import argparse

from werkzeug.security import generate_password_hash

from app import create_app


def parse_args():
    parser = argparse.ArgumentParser(description="Create or update a HOPE admin user.")
    parser.add_argument("--name", required=True, help="Admin display name")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument("--password", required=True, help="Admin password (minimum 8 characters)")
    return parser.parse_args()


def main():
    args = parse_args()
    name = args.name.strip()
    email = args.email.strip().lower()
    password = args.password.strip()

    if not name or not email or "@" not in email or len(password) < 8:
        raise SystemExit("Provide a valid --name, --email, and an 8+ character --password.")

    app = create_app(seed=False)
    with app.app_context():
        existing = app.store.find_one("users", lambda user: user.get("email", "").lower() == email)
        payload = {
            "name": name,
            "email": email,
            "role": "admin",
            "isActive": True,
            "passwordHash": generate_password_hash(password),
            "profile": {
                "language": "English",
                "remindersEnabled": True,
                "createdFrom": "create_admin.py",
            },
        }
        if existing:
            updated = app.store.update("users", existing["id"], payload)
            print(f"Updated admin account: {updated['email']}")
            return

        created = app.store.insert("users", payload)
        print(f"Created admin account: {created['email']}")


if __name__ == "__main__":
    main()
