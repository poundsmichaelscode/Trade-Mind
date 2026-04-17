# TradeMind

TradeMind is a smart trading journal and performance analytics SaaS for forex and crypto traders.

This package includes:
- `apps/web` — Next.js web app
- `apps/api` — FastAPI backend
- `apps/mobile` — Expo mobile scaffold

## What I fixed in this release
- stronger login and signup flow on the web app
- safer frontend auth error handling
- full-page redirect after successful auth so dashboard session cookies are definitely present
- clearer environment variable examples for frontend and backend deployment
- updated deployment guide for local, Docker, Vercel, and Render

## Local setup

### 1) Backend
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
# Windows:
# .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

The API runs on `http://localhost:8000`.

### 2) Frontend
Open a new terminal:
```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

The web app runs on `http://localhost:3000`.

## Docker setup
From the repo root:
```bash
docker compose up --build
```

## Required environment variables

### Backend (`apps/api/.env`)
- `APP_ENV`
- `APP_VERSION`
- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_WEBHOOK_SECRET`
- `PAYSTACK_CALLBACK_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`

### Frontend (`apps/web/.env.local`)
- `NEXT_PUBLIC_API_URL`

## Common login/signup issue to avoid
If login or signup succeeds but the dashboard does not open, check these first:
- `NEXT_PUBLIC_API_URL` must point to your deployed backend
- backend `CORS_ORIGINS` must include your exact frontend URL
- do not mix `http` and `https` across frontend/backend in production
- redeploy the frontend after changing environment variables

## Deploy
See `docs/deployment.md`.
