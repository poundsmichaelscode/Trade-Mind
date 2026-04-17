# TradeMind Deployment Guide

## Production Stack
- Frontend: Vercel (`apps/web`)
- Backend: Render (`apps/api`)
- Database: Render Postgres

## Backend on Render
- Root Directory: `apps/api`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Required environment variables
```env
APP_ENV=production
APP_VERSION=0.6.4
DATABASE_URL=<render postgres internal url>
SECRET_KEY=<long random secret>
ACCESS_TOKEN_EXPIRE_MINUTES=50
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=https://trade-mind-web-bc1e.vercel.app
PAYSTACK_CALLBACK_URL=https://trade-mind-web-bc1e.vercel.app/pricing?upgraded=1
CLOUDINARY_FOLDER=trademind
MAIL_FROM=TradeMind <noreply@trademind.app>
```

Optional integrations: `PAYSTACK_*`, `CLOUDINARY_*`, `RESEND_API_KEY`. Leave `REDIS_URL` unset unless Redis is actually provisioned.

## Frontend on Vercel
- Root Directory: `apps/web`
- Environment variable:
```env
NEXT_PUBLIC_API_URL=https://trade-mind.onrender.com
```

Redeploy the backend first, confirm `/status` and `/docs` load, then redeploy the frontend.

## Quick verification checklist
- `https://trade-mind.onrender.com/status` returns JSON
- `https://trade-mind.onrender.com/docs` opens
- login and signup work on desktop and mobile
- trade creation works
- CSV export downloads
- Excel export works for Pro users
