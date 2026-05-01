````md
# TradeMind

**Smart Trading Journal & Performance Analytics SaaS**

TradeMind is a full-stack SaaS platform built to help traders log trades, analyze performance, identify behavioral patterns, and improve trading discipline through structured insights and analytics.

It is designed for forex, crypto, indices, and retail traders who want more than spreadsheets, screenshots, broker history, and scattered notes. TradeMind gives traders one centralized platform to journal trades, monitor performance, review risk behavior, and grow toward consistency.

---

## Live Demo

### Frontend

[https://trade-mind-web-bc1e.vercel.app/login](https://trade-mind-web-bc1e.vercel.app/login)

### Backend

[https://trade-mind.onrender.com](https://trade-mind.onrender.com)

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

The platform combines secure authentication, trade journaling, performance analytics, smart insights, export workflows, and SaaS-ready architecture.

TradeMind was built as a real product-oriented engineering system, not just a UI dashboard clone.

---

## The Problem

Retail traders often struggle with consistency because they do not have a reliable trade review system.

Many traders track their activity through:

- Spreadsheets
- Screenshots
- Broker platform history
- Notebooks
- Notes apps
- Memory

This creates several problems:

- Inconsistent journaling
- Poor visibility into performance trends
- Weak risk review
- No easy way to identify bad trading habits
- Manual calculation fatigue
- No unified analytics system

Many traders execute trades frequently but do not have a structured system for learning from their past decisions.

---

## The Solution

TradeMind acts as a **Trader Performance Intelligence Platform**.

It gives traders a place to:

- Log trades with proper context
- Automatically calculate trade metrics
- Track performance over time
- Identify profitable and weak patterns
- Export trade journals
- Manage a SaaS-ready Free and Pro product structure

Instead of focusing on broker execution, TradeMind focuses on something many traders ignore:

> Reviewing trading behavior and learning from it consistently.

---

## Core Features

### 1. Authentication

TradeMind includes a secure authentication system with:

- Email and password signup
- Email and password login
- JWT access tokens
- Refresh token flow
- Protected routes
- Session persistence

---

### 2. Trade Journal

Users can create, edit, and review trades with detailed information such as:

- Asset
- Market type
- Direction
- Entry price
- Exit price
- Position size
- Stop loss
- Take profit
- Open time
- Close time
- Notes
- Session tag
- Setup tag
- Screenshot upload

---

### 3. Automatic Trade Calculations

The backend calculates important trade metrics such as:

- Profit and loss
- Profit percentage
- Risk amount
- Reward amount
- Risk-to-reward ratio
- Holding duration
- Trade outcome

---

### 4. Analytics Dashboard

The analytics dashboard provides traders with key performance data, including:

- Total trades
- Win rate
- Total profit and loss
- Average risk-to-reward ratio
- Asset performance
- Session performance
- Monthly performance
- Equity curve

---

### 5. Smart Insights

TradeMind highlights trading patterns such as:

- Weak trading weekdays
- Stronger-performing assets
- Excessive risk behavior
- Average loss greater than average win
- Session-specific trends

---

### 6. Export System

Users can export their trade journal data in:

- CSV format
- Excel format

Exports are protected and require valid authentication.

---

### 7. SaaS Product Structure

TradeMind is structured to support future SaaS monetization with:

- Free plan direction
- Pro plan direction
- Feature gating foundation
- Billing-ready backend architecture

---

### 8. Profile and Preferences

Users can manage profile and trading preferences such as:

- Full name
- Risk preference
- Trading style
- Timezone
- Subscription state

---

## Product Goals

The main goals of TradeMind are to:

- Help traders journal consistently
- Provide useful performance analytics
- Expose behavioral trading patterns
- Reduce manual review work
- Support SaaS monetization
- Demonstrate real full-stack engineering depth

---

## Target Users

### Beginner Traders

Traders who need a structured journaling system.

### Intermediate Traders

Traders who need performance breakdowns, analytics, and trading insights.

### Advanced Retail Traders

Traders who need fast journaling, exports, detailed analytics, and discipline tracking.

### Supported Markets

TradeMind can support journaling for:

- Forex
- Crypto
- Indices
- Other speculative assets

---

## User Stories

### Main User Story

As a trader, I want to log each trade with context and review my performance over time so I can identify mistakes, improve discipline, and become more consistent.

### Supporting User Stories

- As a user, I want to securely sign up and log in.
- As a trader, I want my profit, loss, and risk-to-reward values calculated automatically.
- As a trader, I want a dashboard that summarizes my trading performance.
- As a trader, I want to identify my strengths and weaknesses.
- As a trader, I want to export my journal data.
- As a user, I want the app to work across devices.
- As a developer or reviewer, I want a deployable and maintainable architecture.

---

## Architecture

TradeMind uses a **web-first full-stack monorepo architecture**.

### Frontend

The frontend is built with Next.js and TypeScript. It handles:

- Login and signup pages
- Dashboard layout
- Analytics pages
- Trade history
- Trade entry forms
- Profile and settings
- Export workflows

### Backend

The backend is built with FastAPI. It handles:

- Authentication
- Token generation and refresh
- Trade CRUD operations
- Trade calculation logic
- Analytics aggregation
- Export generation
- File uploads
- Billing-ready endpoints

### Data Layer

The data layer stores:

- Users
- Trades
- Refresh tokens
- Notifications
- Billing events
- Export records

### Infrastructure Layer

The infrastructure setup supports:

- Docker
- Docker Compose
- Render deployment
- Vercel deployment
- PostgreSQL production database
- SQLite local development fallback
- Future Redis and worker integration

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
- Passlib
- bcrypt
- python-jose
- Uvicorn

### Database

- PostgreSQL
- SQLite for local development

### DevOps and Hosting

- Docker
- Docker Compose
- Vercel
- Render

### Future Integrations

- Cloudinary
- Paystack
- Redis
- Celery
- Resend

---

## Folder Structure

```text
Trade-Mind/
│
├── apps/
│   ├── web/
│   ├── api/
│   └── mobile/
│
├── docs/
├── render.yaml
├── docker-compose.yml
└── README.md
````

---

## Authentication Flow

1. User signs up or logs in.
2. Backend returns:

   * `access_token`
   * `refresh_token`
   * `user`
3. Frontend stores the tokens.
4. Protected requests use the authorization header:

```text
Authorization: Bearer <token>
```

5. If a `401 Unauthorized` response occurs, the frontend sends a refresh token request.
6. The original request is retried using a new access token.

### Security Improvements

* Refresh token support
* Protected downloads
* Safer fetch handling
* Session persistence
* Protected frontend routes

---

## Trade Analytics Logic

### Trade Fields Used

TradeMind uses the following fields to calculate trade performance:

* Entry price
* Exit price
* Direction
* Position size
* Stop loss
* Take profit
* Open time
* Close time

### Calculated Values

The backend calculates:

* `profit_loss`
* `profit_loss_percent`
* `risk_amount`
* `reward_amount`
* `risk_reward_ratio`
* `holding_minutes`
* `outcome`

### Higher-Level Analytics

TradeMind also generates higher-level analytics such as:

* Total trades
* Win rate
* Total profit and loss
* Average risk-to-reward ratio
* Performance by asset
* Performance by session
* Monthly performance
* Equity curve

### Insight Strategy

TradeMind currently uses **deterministic analytics** instead of relying fully on artificial intelligence.

This approach is useful for an MVP because it is:

* Easier to test
* Easier to debug
* Cheaper to run
* More explainable
* A stronger foundation for future AI features

---

## Export Flow

TradeMind supports authenticated export downloads.

### Supported Formats

* CSV
* Excel

### Flow

1. User requests an export.
2. Backend generates the export file.
3. Frontend downloads the file using an authenticated helper.
4. A valid access token is required before the download is allowed.

---

## Deployment Strategy

### Production Setup

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Render PostgreSQL

### Why This Setup?

This deployment stack was selected because it provides:

* Easy deployment
* Good FastAPI support
* Managed PostgreSQL
* Simple environment variable management
* Clear separation between frontend and backend services

---

## Environment Variables

### Frontend

Create a `.env.local` file inside `apps/web`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Frontend

On Vercel, set:

```env
NEXT_PUBLIC_API_URL=https://trade-mind.onrender.com
```

### Backend

Create a `.env` file inside `apps/api`.

```env
APP_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=50
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Trade-Mind
```

### 2. Run the Frontend

```bash
cd apps/web
npm install
npm run dev
```

The frontend should run on:

```text
http://localhost:3000
```

### 3. Run the Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend should run on:

```text
http://localhost:8000
```

### 4. Backend API Docs

FastAPI automatically provides API documentation at:

```text
http://localhost:8000/docs
```

---

## Docker Setup

From the root of the project, run:

```bash
docker compose up --build
```

To stop containers:

```bash
docker compose down
```

To rebuild from scratch:

```bash
docker compose down -v
docker compose up --build
```

---

## Render Backend Deployment

### Recommended Render Settings

| Setting        | Value                                              |
| -------------- | -------------------------------------------------- |
| Service Type   | Web Service                                        |
| Root Directory | `apps/api`                                         |
| Runtime        | Python                                             |
| Build Command  | `pip install -r requirements.txt`                  |
| Start Command  | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### Required Environment Variables on Render

```env
APP_ENV=production
DATABASE_URL=your-render-postgres-url
SECRET_KEY=your-production-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=50
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Vercel Frontend Deployment

### Recommended Vercel Settings

| Setting          | Value           |
| ---------------- | --------------- |
| Framework Preset | Next.js         |
| Root Directory   | `apps/web`      |
| Build Command    | `npm run build` |
| Output Directory | `.next`         |

### Required Environment Variable on Vercel

```env
NEXT_PUBLIC_API_URL=https://trade-mind.onrender.com
```

After adding the environment variable, redeploy the project.

---

## Testing

### Backend Tests

```bash
cd apps/api
pytest
```

### Frontend Checks

```bash
cd apps/web
npm run lint
npm run build
```

---

## Project Roadmap

### Phase 1

* UI screens
* Authentication pages
* Dashboard layout

### Phase 2

* Backend integration
* Signup and login
* Trade CRUD operations

### Phase 3

* Export system
* Upload flow
* Pricing direction

### Phase 4

* Improved authentication
* PostgreSQL-ready configuration
* Deployment stability

### Future Improvements

* Broker integrations
* AI coaching assistant
* Mobile offline sync
* Push notifications
* Deeper trade analytics
* Pro plan feature gating
* Screenshot-based trade analysis
* Payment integration

---

## Engineering Challenges Solved

This project solves several real-world engineering challenges, including:

* Auth persistence issues
* Protected export failures
* bcrypt and passlib conflicts
* Monorepo dependency issues
* Docker and Render environment mismatch
* Frontend and backend coordination
* Mobile fetch instability
* Vercel build failures
* Production API environment configuration

---

## Why This Project Matters

TradeMind is not just a dashboard.

It demonstrates:

* Product thinking
* SaaS architecture
* Backend business logic
* Authentication and session handling
* Deployment-aware engineering
* Monetization-ready structure
* Real-world full-stack development

This makes it a strong portfolio project for showcasing product engineering, backend architecture, frontend implementation, and SaaS development capability.

---

## Recruiter Summary

TradeMind is a full-stack SaaS trading journal and analytics platform that helps traders improve consistency through structured trade logging, automated metrics, performance dashboards, and behavioral insights.

This project demonstrates:

* Modern frontend development
* Backend API architecture
* Authentication systems
* Protected export workflows
* Deployment readiness
* SaaS product thinking
* Product-oriented engineering

---

## Author

**Olayenikan Michael Olaniyi**

Built under **PoundsMichaels Digitals**

GitHub: [`poundsmichaelscode`](https://github.com/poundsmichaelscode)

---

## License

This project is intended for portfolio, educational, and demonstration purposes unless otherwise specified.
pounds michels Digitals
```
```
