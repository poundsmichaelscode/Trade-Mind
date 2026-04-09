# TradeMind Architecture

## System Overview

TradeMind is a modular SaaS application composed of:
- a Next.js web app
- a React Native mobile app
- a FastAPI backend
- PostgreSQL for persistent storage
- Redis for caching and background jobs
- Cloudinary for image uploads
- Paystack for subscriptions

## Core Services

### Auth Service
Handles registration, login, token issuance, refresh flow, and password reset.

### Trade Service
Handles trade CRUD, validation, ownership checks, trade calculation rules, and plan gating.

### Analytics Service
Computes dashboard metrics, chart datasets, and behavioral summaries.

### Insight Service
Generates rule-based insight statements from user trading history.

### Billing Service
Processes subscription state, upgrade flow, and webhook events.

### Notification Service
Schedules weekly summaries, reminders, and risk alerts.

### Export Service
Builds CSV/Excel exports asynchronously.

## High-Level Data Flow

1. User logs in or signs up.
2. User creates or updates a trade.
3. Backend validates input and calculates derived metrics.
4. Trade is stored in PostgreSQL.
5. Analytics caches can be refreshed.
6. Insights can be recalculated in the background.
7. Dashboard renders updated metrics and charts.

## Core Domain Entities
- User
- Subscription
- Trade
- Insight
- Notification
- ExportJob
- BillingEvent

## Architecture Principles
- API-first design
- stateless backend services
- backend-enforced plan limits
- deterministic analytics before AI coaching
- background jobs for heavy or delayed work
- modular, testable service boundaries

## Recommended Monorepo Layout

```text
trademind/
  apps/
    web/
      app/
      components/
      features/
      lib/
      hooks/
      services/
      types/
    mobile/
      app/
      components/
      features/
      services/
      store/
    api/
      app/
        api/
        core/
        models/
        schemas/
        repositories/
        services/
        workers/
        utils/
        tests/
  packages/
    ui/
    config/
    types/
  docs/
```

## Suggested API Surface

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /auth/me

### Trades
- GET /trades
- POST /trades
- GET /trades/{id}
- PATCH /trades/{id}
- DELETE /trades/{id}

### Analytics
- GET /analytics/overview
- GET /analytics/equity-curve
- GET /analytics/monthly-performance
- GET /analytics/assets
- GET /analytics/behavior

### Billing
- POST /billing/initialize
- POST /billing/webhook
- GET /billing/subscription

## Engineering Notes
- Use PostgreSQL indexes on `user_id`, `asset`, `open_time`, and `close_time`.
- Use Redis for analytics caching and worker queues.
- Use webhook signature verification for Paystack.
- Use Cloudinary upload presets or signed uploads for screenshots.
- Add Sentry for error monitoring.
