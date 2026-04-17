````markdown
# TradeMind

**Smart Trading Journal & Performance Analytics SaaS**

TradeMind is a full-stack SaaS application built to help traders log trades, analyze performance, identify behavioral patterns, and improve decision-making through structured insights and analytics.

It is designed for forex and crypto traders who want more than spreadsheets, screenshots, broker history, and scattered notes. TradeMind gives them a centralized platform to journal trades, monitor performance, review risk behavior, and grow toward consistency.

---

## Live Demo

**Frontend:**  
`https://trade-mind-web-bc1e.vercel.app/login`

**Backend:**  
`https://trade-mind.onrender.com`

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Core Features](#core-features)
- [Product Goals](#product-goals)
- [Target Users](#target-users)
- [User Stories](#user-stories)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Authentication Flow](#authentication-flow)
- [Trade Analytics Logic](#trade-analytics-logic)
- [Export Flow](#export-flow)
- [Deployment Strategy](#deployment-strategy)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Docker Setup](#docker-setup)
- [Render Backend Deployment](#render-backend-deployment)
- [Vercel Frontend Deployment](#vercel-frontend-deployment)
- [Testing](#testing)
- [Project Roadmap](#project-roadmap)
- [Engineering Challenges Solved](#engineering-challenges-solved)
- [Why This Project Matters](#why-this-project-matters)
- [Recruiter Summary](#recruiter-summary)
- [Author](#author)
- [License](#license)

---

## Overview

TradeMind is a modern trading journal and performance analytics platform built to help traders move from unstructured trade history to measurable improvement.

The project combines:

- secure authentication
- trade journaling
- trade metric calculation
- historical trade analysis
- smart insights
- CSV / Excel export
- subscription-ready product structure
- deployment-ready frontend and backend architecture

This project was built as a **real product-oriented engineering system**, not just a UI exercise or dashboard clone.

---

## The Problem

Retail traders often struggle with consistency because they do not have a reliable review system.

Most traders track their activity through:

- spreadsheets
- screenshots
- broker platform history
- notebooks
- note-taking apps
- memory

That causes serious problems:

- inconsistent journaling
- poor visibility into performance trends
- weak risk review
- no easy way to identify habits that hurt profitability
- manual calculation fatigue
- no unified product for analytics and reflection

Many traders execute frequently but do not have a good system for learning from their trades.

---

## The Solution

TradeMind acts as a **trader performance intelligence platform**.

It gives traders a place to:

- log trades with full context
- automatically calculate key metrics
- track performance over time
- identify patterns in results
- export trade journals
- use a product structure that can support free and Pro plans

Instead of focusing on execution or brokerage functionality, TradeMind focuses on something many traders ignore:

> reviewing trading behavior and learning from it consistently.

---

## Core Features

### 1. Authentication
- Email/password signup
- Email/password login
- JWT-based access token authentication
- Refresh token flow
- Protected routes
- Session persistence between page reloads

### 2. Trade Journal
Users can create, edit, and review trades with:

- asset
- market type
- direction
- entry price
- exit price
- position size
- stop loss
- take profit
- open time
- close time
- notes
- session tag
- setup tag
- screenshot/image upload

### 3. Automatic Calculations
The backend calculates:

- profit/loss
- profit/loss percentage
- risk amount
- reward amount
- risk/reward ratio
- holding duration
- trade outcome

### 4. Analytics Dashboard
The dashboard includes:

- total trades
- win rate
- total PnL
- average RR ratio
- asset performance
- session performance
- monthly performance
- equity curve

### 5. Smart Insights
TradeMind highlights behavioral patterns such as:

- weak performance on certain weekdays
- stronger performance on certain assets
- excessive risk behavior
- average loss larger than average win
- session-specific performance trends

### 6. Export
- CSV export
- Excel export
- protected file downloads with authentication

### 7. SaaS Product Structure
- free plan direction
- Pro plan direction
- feature gating foundation
- billing-ready backend architecture

### 8. Profile & Preferences
Users can manage:

- full name
- risk preference
- trading style
- timezone
- subscription state

---

## Product Goals

The main goals of TradeMind are:

- help traders journal consistently
- give users useful performance analytics
- expose patterns in trading behavior
- reduce manual review work
- support a SaaS monetization direction
- demonstrate real product engineering depth

---

## Target Users

TradeMind is designed primarily for:

### Beginner Traders
Need a structured way to track and review trades.

### Intermediate Traders
Need performance breakdowns and behavior insights.

### Advanced Retail Traders
Need faster journaling, analytics, exports, and discipline tracking.

Markets supported conceptually include:

- forex
- crypto
- indices
- other speculative trading assets

---

## User Stories

### Main User Story
As a trader, I want to log each trade with full context and review my performance over time, so I can identify mistakes, improve discipline, and become more consistent.

### Supporting User Stories
- As a user, I want secure signup and login so my data stays private.
- As a trader, I want automatic PnL and RR calculations so I do not calculate everything manually.
- As a user, I want to see my trade history in a structured dashboard.
- As a trader, I want analytics that help me spot strengths and weaknesses.
- As a Pro user, I want export functionality for deeper review.
- As a user, I want a responsive app that works across devices.
- As a product owner, I want the system to be deployable on Vercel and Render.

---

## Architecture

TradeMind uses a **web-first full-stack architecture** with a monorepo structure.

### High-Level Architecture

#### Frontend
Built with Next.js and TypeScript for:
- login/signup
- dashboard
- analytics
- trade history
- trade entry
- profile/settings
- export workflows

#### Backend
Built with FastAPI for:
- auth
- token generation and refresh
- trade CRUD
- calculation logic
- analytics aggregation
- export generation
- file uploads
- notifications foundation
- billing-ready endpoints

#### Data Layer
Stores:
- users
- trades
- refresh tokens
- notifications
- billing events
- export records

#### Infra Layer
Supports:
- Docker / Docker Compose for local development
- Render deployment for backend
- Vercel deployment for frontend
- PostgreSQL for production
- SQLite fallback for local development
- future Redis/worker support

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- Pydantic Settings
- Passlib
- bcrypt
- python-jose
- Uvicorn

### Database
- PostgreSQL for production
- SQLite for local fallback

### DevOps / Hosting
- Docker
- Docker Compose
- Vercel
- Render

### Future-Ready Integrations
- Cloudinary
- Paystack
- Redis
- Celery / worker flow
- Resend

---

## Folder Structure

```text
Trade-Mind/
  apps/
    web/
      app/
      components/
      lib/
      public/
      styles/
      package.json
    api/
      app/
        api/
        core/
        db/
        models/
        schemas/
        services/
        tests/
      requirements.txt
      requirements-dev.txt
    mobile/
      app/
      components/
      package.json
  docs/
    deployment.md
  render.yaml
  docker-compose.yml
  README.md
````

---

## Authentication Flow

TradeMind uses token-based authentication.

### Auth flow summary

1. User signs up or logs in
2. Backend returns:

   * `access_token`
   * `refresh_token`
   * `user`
3. Frontend stores tokens in local storage
4. Frontend persists session cookies through internal auth routes
5. Protected requests include `Authorization: Bearer <token>`
6. On `401`, frontend attempts refresh
7. If refresh succeeds, request is retried

### Auth-related security improvements

* refresh token support
* cookie persistence helpers
* protected file download flow
* safer frontend fetch handling
* better auth response validation

---

## Trade Analytics Logic

TradeMind calculates and aggregates performance data from user trades.

### Trade fields used

* entry price
* exit price
* direction
* position size
* stop loss
* take profit
* open time
* close time

### Calculated values

* `profit_loss`
* `profit_loss_percent`
* `risk_amount`
* `reward_amount`
* `risk_reward_ratio`
* `holding_minutes`
* `outcome`

### Higher-level analytics

* total trades
* win rate
* total PnL
* average RR ratio
* performance by asset
* performance by session
* monthly performance
* equity curve

### Insight strategy

The current product uses **deterministic analytics** rather than depending entirely on AI.

That means the system is:

* easier to test
* easier to debug
* cheaper to run
* more explainable
* more realistic as an MVP

---

## Export Flow

TradeMind supports protected data export.

### Supported formats

* CSV
* Excel

### Export design

1. User requests export from frontend
2. Backend creates export file
3. Frontend downloads file using an authenticated helper
4. File downloads only when valid tokens are present

This avoids insecure direct file access and prevents export failures caused by unauthenticated `window.open()` behavior.

---

## Deployment Strategy

### Recommended Production Setup

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Render Postgres

### Why this setup

It is the cleanest fit for the current architecture:

* frontend deploys easily on Vercel
* FastAPI works well on Render
* Postgres is managed cleanly in Render
* environment variables are easy to manage
* deployment complexity stays low

---

## Environment Variables

## Frontend local example

Create `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Frontend production example

Set in Vercel:

```env
NEXT_PUBLIC_API_URL=https://trade-mind.onrender.com
```

## Backend local example

Create `apps/api/.env`

```env
APP_ENV=development
APP_VERSION=0.6.4
DATABASE_URL=sqlite:///./trademind.db
SECRET_KEY=change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=50
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_WEBHOOK_SECRET=paystack-webhook-secret
PAYSTACK_CALLBACK_URL=http://localhost:3000/pricing?upgraded=1
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=trademind
RESEND_API_KEY=
MAIL_FROM=TradeMind <noreply@trademind.app>
```

## Backend production example

Set in Render:

```env
APP_ENV=production
APP_VERSION=0.6.4
DATABASE_URL=your_actual_render_postgres_internal_url
SECRET_KEY=your_long_random_secret
ACCESS_TOKEN_EXPIRE_MINUTES=50
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=https://trade-mind-web-bc1e.vercel.app
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_PUBLIC_KEY=your_paystack_public
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret
PAYSTACK_CALLBACK_URL=https://trade-mind-web-bc1e.vercel.app/pricing?upgraded=1
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=trademind
RESEND_API_KEY=your_resend_api_key
MAIL_FROM=TradeMind <noreply@trademind.app>
```

---

## Local Development Setup

## 1. Clone the repo

```bash
git clone <your-repo-url>
cd Trade-Mind
```

## 2. Frontend setup

```bash
cd apps/web
npm install
npm run dev
```

## 3. Backend setup

Use Python 3.12 or 3.13.

```bash
cd apps/api
python3.13 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Important

Do not use Python 3.14 for this backend stack if `pydantic-core` build issues appear in your environment.

---

## Docker Setup

For local Docker development:

```bash
docker compose up --build
```

### Notes

* Docker uses service names like `db` and `redis`
* those names work only inside Docker Compose
* do not reuse them in Render production env vars

---

## Render Backend Deployment

### Recommended service settings

* **Root Directory:** `apps/api`
* **Runtime:** Python
* **Build Command:**

```bash
pip install -r requirements.txt
```

* **Start Command:**

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Important

On Render, use the actual Postgres URL from your Render database service.

Do **not** use:

* `db`
* `localhost`
* placeholder strings like `your_render_postgres_internal_url`

### Health check endpoints

After deploy, confirm these open:

* `/`
* `/docs`
* `/openapi.json`

---

## Vercel Frontend Deployment

### Project settings

* **Root Directory:** `apps/web`
* **Framework:** Next.js

### Required env var

```env
NEXT_PUBLIC_API_URL=https://trade-mind.onrender.com
```

### Important

If the API URL changes, redeploy the frontend after updating the env variable.

---

## Testing

Basic backend tests are included.

### Example test areas

* security helpers
* config behavior
* calculations

### Run backend tests

```bash
cd apps/api
source .venv/bin/activate
pip install -r requirements-dev.txt
pytest
```

If you added a root script, you may also use:

```bash
npm run test:api
```

---

## Project Roadmap

### Phase 1

* frontend UI
* dashboard screens
* analytics layout
* auth screens

### Phase 2

* backend integration
* signup/login flow
* live trade creation
* trade history wiring

### Phase 3

* export system
* upload flow
* pricing direction
* Docker support

### Phase 4

* improved auth architecture
* refresh token flow
* PostgreSQL-ready config
* better deployment direction

### Phase 5

* deployment hardening
* config cleanup
* improved protected downloads
* backend reliability fixes

### Phase 6

* mobile scaffold
* worker-ready foundation
* stronger session handling
* monorepo cleanup

### Future Improvements

* broker integrations
* AI coaching assistant
* offline mobile sync
* push notifications
* trader benchmarking
* deeper behavioral analytics

---

## Engineering Challenges Solved

This project involved solving several real-world issues:

* auth token/session persistence problems
* protected file export download failures
* bcrypt / passlib compatibility issues
* monorepo workspace dependency conflicts
* Docker vs Render environment mismatch
* frontend/backend deployment coordination
* mobile browser fetch failures caused by backend instability
* Vercel build failures from broken imports and outdated Next.js versions

---

## Why This Project Matters

TradeMind is not just a UI dashboard. It demonstrates:

* product thinking
* SaaS architecture
* backend business logic
* real auth/session handling
* deployment-aware engineering
* analytics-focused feature design
* monetization-ready structure

It is a strong full-stack portfolio project because it shows both:

* user-centered product design
* practical engineering depth

---

## Recruiter Summary

TradeMind is a full-stack SaaS trading journal and analytics platform built to help traders improve consistency through structured trade logging, automated metrics, performance dashboards, and behavioral insights.

This project demonstrates:

* modern frontend development
* backend API architecture
* auth and session handling
* protected exports
* deployment readiness
* product-oriented engineering

It was built as a real system with business value, not just a visual prototype.

---

## Author

**Olayenikan Michael Olaniyi**
Built under **PoundsMichaels Digitals**

GitHub: `poundsmichaelscode`

---

## License

This project is intended for portfolio, educational, and demonstration purposes unless otherwise specified.

```
```
