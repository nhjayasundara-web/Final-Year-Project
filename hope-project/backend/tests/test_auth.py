# ============================================================
# HOPE — Backend Tests
# Save to: backend/tests/test_auth.py
#
# Run: pytest tests/ -v
# ============================================================

import pytest
import json
from app import create_app
from app.config import DevelopmentConfig

class TestConfig(DevelopmentConfig):
    TESTING     = True
    DB_NAME     = "hope_test"
    JWT_SECRET_KEY = "test-secret"

@pytest.fixture
def app():
    application = create_app(TestConfig)
    yield application

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    """Register and login a test user, return auth headers."""
    client.post("/api/auth/register", json={
        "name": "Test User", "email": "test@hope.lk",
        "password": "TestPass123!", "role": "patient"
    })
    res = client.post("/api/auth/login", json={
        "email": "test@hope.lk", "password": "TestPass123!"
    })
    data  = json.loads(res.data)
    token = data["data"]["token"]
    return {"Authorization": f"Bearer {token}"}


# ── Auth Tests ───────────────────────────────────────────────

class TestRegister:
    def test_register_success(self, client):
        res  = client.post("/api/auth/register", json={
            "name": "Nimesha Perera", "email": "nimesha@hope.lk",
            "password": "StrongPass1!", "role": "patient"
        })
        data = json.loads(res.data)
        assert res.status_code == 201
        assert data["success"] is True
        assert "token" in data["data"]
        assert "password_hash" not in data["data"]["user"]

    def test_register_duplicate_email(self, client):
        payload = {"name": "A", "email": "dup@hope.lk", "password": "Pass1234!", "role": "patient"}
        client.post("/api/auth/register", json=payload)
        res  = client.post("/api/auth/register", json=payload)
        assert res.status_code == 409

    def test_register_missing_fields(self, client):
        res = client.post("/api/auth/register", json={"name": "A"})
        assert res.status_code == 400

    def test_register_invalid_role(self, client):
        res = client.post("/api/auth/register", json={
            "name": "A", "email": "a@b.com", "password": "Pass1234!", "role": "hacker"
        })
        assert res.status_code == 400


class TestLogin:
    def test_login_success(self, client, auth_headers):
        assert auth_headers is not None

    def test_login_wrong_password(self, client):
        client.post("/api/auth/register", json={
            "name": "B", "email": "b@hope.lk", "password": "CorrectPass1!", "role": "patient"
        })
        res  = client.post("/api/auth/login", json={"email": "b@hope.lk", "password": "WrongPass!"})
        assert res.status_code == 401

    def test_login_nonexistent_user(self, client):
        res = client.post("/api/auth/login", json={"email": "nobody@hope.lk", "password": "Nope!"})
        assert res.status_code == 401


class TestMe:
    def test_me_authenticated(self, client, auth_headers):
        res  = client.get("/api/auth/me", headers=auth_headers)
        data = json.loads(res.data)
        assert res.status_code == 200
        assert data["data"]["email"] == "test@hope.lk"

    def test_me_unauthenticated(self, client):
        res = client.get("/api/auth/me")
        assert res.status_code == 401


# ── Detection Tests ──────────────────────────────────────────

class TestSymptomCheck:
    def test_symptom_check_high_risk(self, client):
        res  = client.post("/api/detect/symptoms", json={
            "symptoms": ["Lump or thickening in breast or underarm"]
        })
        data = json.loads(res.data)
        assert res.status_code == 200
        assert data["data"]["risk_level"] == "high"
        assert data["data"]["should_see_doctor"] is True

    def test_symptom_check_low_risk(self, client):
        res  = client.post("/api/detect/symptoms", json={
            "symptoms": ["Persistent pain in breast or nipple"]
        })
        data = json.loads(res.data)
        assert res.status_code == 200
        assert data["data"]["risk_level"] in ("low", "moderate")

    def test_symptom_check_empty(self, client):
        res = client.post("/api/detect/symptoms", json={"symptoms": []})
        assert res.status_code == 400


# ── Health Check ─────────────────────────────────────────────

def test_health(client):
    res  = client.get("/api/health")
    data = json.loads(res.data)
    assert res.status_code == 200
    assert data["platform"] == "HOPE"
