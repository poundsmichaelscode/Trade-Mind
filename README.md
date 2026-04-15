
---

````markdown
# TradeMind

**Smart Trading Journal & Performance Analytics SaaS**

TradeMind is a full-stack SaaS platform built to help traders log trades, analyze performance, identify behavioral patterns, and improve decision-making through structured insights.

Live Demo: https://trade-mind-web-bc1e.vercel.app

---

## Overview

Most retail traders track performance with spreadsheets, screenshots, trading platform history, or scattered notes. That makes it difficult to spot patterns, review mistakes, and build consistency.

TradeMind solves that problem by giving traders a centralized system to:

- log trades with full context
- track performance across assets and sessions
- review profit/loss and risk metrics
- generate smart behavior-based insights
- export trade history
- manage usage through a SaaS subscription model

This project was designed as a **production-oriented web-first SaaS application** with a strong emphasis on product thinking, modern UI, full-stack architecture, and real-world engineering decisions.

---

## The Problem It Solves

Retail traders often face these challenges:

- no structured journal for reviewing trades
- no clear visibility into win rate, risk, and performance trends
- difficulty identifying repeated mistakes
- weak discipline caused by inconsistent self-review
- no simple way to turn raw trading history into actionable insights

Most tools available are either too basic, too manual, or too disconnected from how real traders reflect on performance.

TradeMind addresses that gap by combining:

- trade journaling
- analytics
- behavior insights
- SaaS monetization
- future-ready architecture for mobile and AI extensions

---

## Solution

TradeMind is built as a **trader performance intelligence platform**.

Instead of focusing on execution or market data feeds, it focuses on the part traders often neglect:

> reviewing decisions, measuring performance, and improving consistency.

The platform allows users to record each trade, measure outcomes, and receive insight into what is helping or hurting profitability.

---

## Key Features

### Authentication
- Email/password signup and login
- JWT-based authentication
- Access and refresh token support
- Protected routes
- Session persistence between refreshes

### Trade Journal
- Add, edit, and delete trades
- Log:
  - asset
  - market type
  - trade direction
  - entry and exit price
  - position size
  - stop loss
  - take profit
  - notes
  - screenshot upload
  - session and setup tags
- Automatically calculate:
  - profit/loss
  - risk amount
  - reward amount
  - risk/reward ratio
  - holding duration
  - trade outcome

### Analytics Dashboard
- Total trades
- Win rate
- Total profit/loss
- Average RR ratio
- Equity curve
- Monthly performance
- Asset-level performance
- Session and behavior breakdown

### Smart Insights
- Highlights patterns in trader behavior
- Examples:
  - poor performance on specific weekdays
  - stronger results on certain assets
  - risk management inconsistencies
  - average loss exceeding average win

### Export
- CSV export
- Excel export for Pro users

### SaaS Billing
- Free plan
- Pro plan
- plan-based feature gating
- billing-ready backend architecture

### Profile & Preferences
- risk preference
- trading style
- timezone
- subscription state

---

## Live Demo

**Frontend:**  
https://trade-mind-web-bc1e.vercel.app/login

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
- JWT Authentication
- Passlib
- PostgreSQL / SQLite fallback

### DevOps / Infrastructure
- Docker
- Docker Compose
- Vercel for frontend deployment
- Render-ready backend architecture
- Cloudinary-ready upload integration
- Paystack-ready billing architecture
- Redis / Celery foundation for jobs and notifications

---

## Architecture

TradeMind is designed as a modular full-stack system with a clear separation between presentation, business logic, and data access.

### High-Level Architecture

#### Web Client
The frontend is built with Next.js and provides:
- authentication screens
- dashboard
- analytics
- trade history
- export actions
- profile management

#### Backend API
The FastAPI backend handles:
- authentication
- token generation and refresh
- trade CRUD
- calculation logic
- analytics aggregation
- export generation
- subscription gating
- notifications foundation

#### Data Layer
The backend persists:
- users
- trades
- insights
- export records
- subscription state
- refresh tokens
- billing events

#### Async / Infrastructure Layer
The project includes a foundation for:
- background jobs
- notification summaries
- export tasks
- future queue-based processing

---

## Folder Structure

```text
trademind/
  apps/
    web/
      app/
      components/
      lib/
      public/
    api/
      app/
        api/
        core/
        models/
        schemas/
        services/
        repositories/
        utils/
    mobile/
      app/
      components/
      features/
  docs/
  docker-compose.yml
````

---

## Product Thinking

A key product decision in TradeMind was to start with a **deterministic analytics engine** instead of an LLM-first insight system.

That choice makes the MVP:

* cheaper to run
* easier to test
* easier to explain
* more reliable for users
* more realistic to ship

The system is designed so AI-generated coaching can be layered in later, but the core insight engine is grounded in actual trade statistics and business logic.

---

## User Story

### Primary User

A forex or crypto trader who wants to improve consistency by understanding their historical performance.

### Example User Story

> As a trader, I want to log each trade with full context and review performance over time, so I can identify mistakes, improve discipline, and increase consistency.

### Additional User Stories

* As a user, I want to sign up and access a personal dashboard securely.
* As a trader, I want to record entry, exit, stop loss, take profit, and notes for each trade.
* As a user, I want to see my win rate, PnL, and average risk/reward ratio.
* As a Pro user, I want to export my trades into CSV or Excel.
* As a trader, I want the app to highlight patterns in my performance so I know what to improve.
* As a user, I want a mobile-ready product direction so I can manage trades on the go.

---

## Why This Project Matters

TradeMind is more than a CRUD dashboard.

It demonstrates:

* product design thinking
* full-stack architecture
* financial data modeling
* analytics-focused backend logic
* responsive SaaS dashboard development
* authentication and session handling
* file export workflows
* subscription-ready architecture
* deployment readiness

This makes it a strong portfolio project for recruiters and engineering teams evaluating:

* frontend architecture
* backend system design
* SaaS product understanding
* real-world build decisions

---

## Engineering Highlights

### 1. Business Logic Beyond CRUD

TradeMind includes calculation and analytics logic for:

* PnL
* RR ratio
* asset-level performance
* session behavior
* trend insights

### 2. Real SaaS Thinking

The project includes:

* free vs pro access
* feature gating
* export restrictions
* billing-ready structure

### 3. Production-Oriented UI

The web application was designed to feel like a real trading platform:

* green/red market-inspired color system
* responsive dashboard layout
* animated cards and transitions
* mobile-aware interface behavior

### 4. Scalable Direction

The architecture allows future expansion into:

* AI coaching
* broker integrations
* mobile app enhancements
* advanced subscription workflows
* notifications and worker queues

---

## Roadmap

### Phase 1

* core web UI
* dashboard layout
* trade history
* analytics views
* authentication foundation

### Phase 2

* backend integration
* login/signup flow
* live trade creation
* analytics endpoints
* profile updates

### Phase 3

* export system
* billing scaffolding
* notification foundation
* upload flow
* Docker setup

### Phase 4

* stronger auth flow
* refresh token support
* PostgreSQL-ready config
* Cloud upload service layer
* webhook architecture

### Phase 5

* deployment hardening
* production config improvements
* CI/deployment structure
* service-level cleanup

### Phase 6

* mobile app scaffold
* worker system foundation
* SSR-aware auth handling
* stronger multi-service architecture

### Future Improvements

* broker API integrations
* AI-generated coaching assistant
* live market sync
* mobile offline trade sync
* advanced performance benchmarking
* tax/export reporting
* richer alerts and reminders

---

## Screens Included

The web app includes:

* login
* signup
* dashboard
* analytics
* insights
* trade history
* new trade entry
* pricing
* profile

---

## Deployment

### Frontend

The web app is deployable on **Vercel**.

### Backend

The API is structured to be deployable on **Render** with:

* environment variables
* PostgreSQL
* production start command
* CORS configuration
* token-based auth setup

---

## Local Development

### Web

```bash
cd apps/web
npm install
npm run dev
```

### API

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend

```env
APP_ENV=development
SECRET_KEY=change-this-in-production
DATABASE_URL=sqlite:///./trademind.db
CORS_ORIGINS=http://localhost:3000
```

Optional production integrations:

* Paystack
* Cloudinary
* Resend
* Redis

---

## Challenges Solved

During development, this project involved solving practical issues around:

* monorepo dependency conflicts
* auth token/session persistence
* secure route protection
* protected file exports
* backend hashing compatibility
* local vs Docker database configuration
* deployment environment mismatch handling

---

## What Recruiters Should Know

TradeMind was built to demonstrate the ability to:

* think like a product engineer
* design systems around real user problems
* build modern, responsive frontend experiences
* structure clean backend services
* handle authentication, analytics, and exports
* plan for deployment and scale

This is not just a UI clone or tutorial project. It is a portfolio-grade SaaS application with clear business value and a realistic full-stack architecture.

---

## Future Vision

TradeMind can grow into a complete trading companion platform with:

* AI performance coaching
* broker sync
* automated summaries
* push notifications
* mobile-first journaling
* community / accountability features
* advanced risk diagnostics

---

## Author

**Olayenikan Michael Olaniyi**
Frontend & Full-Stack Product Engineer

**Brand:** PoundsMichaels Digitals

---

## Credits

Built and designed by **PoundsMichaels Digitals**

---

## License

This project is for portfolio, educational, and demonstration purposes unless otherwise specified.

```

---

```
