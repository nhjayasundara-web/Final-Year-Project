# API Endpoints

Base URL: `/api`

## Health

- `GET /health` - service status and storage type.

## Auth

- `POST /auth/register` - body: `name`, `email`, `password`, `role`. Public registration allows only `patient` and `caregiver`.
- `POST /auth/login` - body: `email`, `password`.
- `GET /auth/me` - bearer token required.
- `PATCH /auth/me` - bearer token required.

## Admin

- `GET /admin/users` - admin bearer token required.
- `POST /admin/users` - admin bearer token required. Body: `name`, `email`, `password`, `role`.
- `PATCH /admin/users/:user_id` - admin bearer token required. Body may include `name`, `role`, `password`, `isActive`.
- `GET /admin/overview` - admin bearer token required.
- `PATCH /admin/community/posts/:post_id` - admin bearer token required. Body: `moderationStatus`.
- `PATCH /admin/providers/:provider_id/verify` - admin bearer token required. Body: `isActive`, `verificationSource`.

## Content

- `GET /content/articles`
- `GET /content/articles/:slug`
- `GET /content/self-exam`
- `PATCH /content/articles/:article_id` - admin or doctor bearer token required.

## Assessment

- `POST /assessments/risk` - educational risk questionnaire.

## AI

- `POST /ai/analyze-image` - multipart form with `image` file and `consentAcknowledged=true`.

## Medicines

- `GET /medicines?q=&city=`
- `POST /medicine-requests`
- `GET /medicine-requests/mine` - bearer token required.
- `GET /pharmacist/overview` - pharmacist bearer token required.
- `POST /pharmacist/medicines` - pharmacist or admin bearer token required.
- `PATCH /pharmacist/medicine-requests/:request_id` - pharmacist or admin bearer token required.

## Providers

- `GET /providers?city=&type=&q=`
- `POST /appointments`
- `GET /appointments/mine` - bearer token required.
- `GET /doctor/overview` - doctor bearer token required.
- `PATCH /doctor/appointments/:appointment_id` - doctor or admin bearer token required.

## Community

- `GET /community/posts`
- `GET /community/posts/:post_id`
- `POST /community/posts` - bearer token required and body must include `communityConsent: true`.
- `POST /community/posts/:post_id/comments` - bearer token required and body must include `communityConsent: true`.

## Support

- `GET /support`
