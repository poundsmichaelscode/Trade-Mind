# Deployment Guide

This project is split into:
- **frontend**: Next.js app in `apps/web`
- **backend**: FastAPI app in `apps/api`

A simple production setup is:
- **frontend on Vercel**
- **backend on Render**
- **database on Render Postgres**

## Option A: Deploy backend on Render

### Step 1: Create a Postgres database
In Render:
- create a new PostgreSQL database
- copy the internal or external connection string

### Step 2: Create the backend web service
Use `apps/api` as the root directory.

Build command:
```bash
pip install -r requirements.txt
```

Start command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Add backend environment variables
Set these in Render:
```env
APP_ENV=production
APP_VERSION=0.6.3
DATABASE_URL=your-render-postgres-url
SECRET_KEY=generate-a-long-random-secret
CORS_ORIGINS=https://your-frontend-domain.vercel.app
PAYSTACK_SECRET_KEY=your-paystack-secret
PAYSTACK_PUBLIC_KEY=your-paystack-public
PAYSTACK_WEBHOOK_SECRET=your-paystack-webhook-secret
PAYSTACK_CALLBACK_URL=https://your-frontend-domain.vercel.app/pricing?upgraded=1
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
RESEND_API_KEY=your-resend-key
```

### Step 4: Redeploy the backend
After saving env vars, redeploy the service.

### Step 5: Confirm backend health
Open:
```text
https://your-backend-domain.onrender.com/
```
You should see a JSON response.

## Option B: Deploy frontend on Vercel

### Step 1: Import the repo into Vercel
Set the root directory to:
```text
apps/web
```

### Step 2: Add frontend environment variable
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.onrender.com
```

### Step 3: Deploy
After deployment, your frontend URL will look like:
```text
https://your-frontend-domain.vercel.app
```

## Critical auth settings
For login and signup to work in production:
- backend `CORS_ORIGINS` must include the exact Vercel frontend URL
- frontend `NEXT_PUBLIC_API_URL` must be the exact Render backend URL
- Paystack callback URL should point back to the frontend pricing page

## Local deployment test before production
Run both locally first:

Backend:
```bash
cd apps/api
uvicorn app.main:app --reload
```

Frontend:
```bash
cd apps/web
npm run dev
```

Then test:
- signup
- login
- create trade
- refresh page
- logout

## Docker deployment
If you prefer Docker locally or on a VPS:
```bash
docker compose up --build
```

Services included:
- web
- api
- postgres
- redis
- worker
- flower

## Common production issues

### 1. Login works but redirects back to login
Usually caused by one of these:
- wrong `NEXT_PUBLIC_API_URL`
- missing frontend URL in backend `CORS_ORIGINS`
- frontend deployed before env vars were updated

### 2. Signup fails with CORS error
Add your frontend origin to backend `CORS_ORIGINS` exactly.

### 3. API works locally but not on Render
Make sure Render start command is:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 4. Paystack callback does not return to the app
Set:
```env
PAYSTACK_CALLBACK_URL=https://your-frontend-domain.vercel.app/pricing?upgraded=1
```

## Recommended deploy order
1. deploy database
2. deploy backend
3. test backend root URL
4. deploy frontend with backend URL
5. test signup/login
6. add Paystack and Cloudinary secrets
7. retest billing and uploads
