# Deployment Checklist

## Before deployment

- Replace all demo provider, pharmacy, and support contact records.
- Remove demo accounts or change their passwords.
- Review all medical content with qualified professionals.
- Configure HTTPS.
- Set strong `SECRET_KEY` and `JWT_SECRET`.
- Configure production `CORS_ORIGINS`.
- Configure MongoDB Atlas network access.
- Choose secure image storage.
- Add community moderation workflow.
- Add privacy policy and consent screens.

## Build frontend

```bash
cd frontend
npm install
npm run build
```

## Run backend in production

```bash
cd backend
pip install -r requirements.txt
gunicorn run:app -b 0.0.0.0:5000 --workers 2
```

## Docker

```bash
docker compose up --build -d
```

## Smoke tests

- Open `/api/health`.
- Register a test account.
- Login and open dashboard.
- Load article library.
- Submit risk check.
- Search medicines.
- Submit appointment request.
- Create community post.
