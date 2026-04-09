# TradeMind

**Smart Trading Journal & Performance Analytics SaaS**

TradeMind is a production-oriented SaaS platform that helps traders log trades, analyze performance, identify behavioral patterns, and improve decision-making through structured insights.

It is designed for forex and crypto traders who want more than a spreadsheet. Instead of scattered screenshots, notes, and manual calculations, TradeMind provides a centralized system for trade journaling, analytics, risk awareness, and subscription-based premium features.

---

## Overview

TradeMind combines:
- a fast trade journaling workflow
- real performance analytics
- rule-based smart insights
- subscription monetization
- responsive web experience
- mobile companion support

This project is built to demonstrate strong full-stack engineering, product thinking, analytics-driven backend design, and SaaS architecture.

---

## Why I Built This

Retail traders often track trades in fragmented ways: Excel sheets, screenshots, Telegram messages, or broker history without context. That makes it difficult to understand performance patterns, improve discipline, and measure progress over time.

TradeMind solves that by turning raw trade activity into structured data and actionable feedback.

> Help traders move from random execution to measurable improvement.

---

## Core Features

### Authentication
- Email/password signup and login
- JWT-based authentication
- Refresh token flow
- Password reset support
- Protected routes

### Trade Journal
- Create, edit, delete, and view trades
- Track asset, direction, prices, position size, stop loss, take profit, notes, and screenshots
- Automatically calculate PnL, risk amount, reward amount, and risk-reward ratio

### Analytics Dashboard
- Total trades
- Win rate
- Total profit/loss
- Average RR ratio
- Best and worst assets
- Equity curve
- Monthly performance
- Win/loss visualization

### Smart Insights Engine
- Detect trading behavior patterns
- Surface rule-based observations

### SaaS Billing
- Free plan with trade limits
- Pro plan with unlimited trades and advanced analytics
- Paystack integration for subscriptions
- Backend-enforced plan gating

### Export
- CSV export
- Excel export for Pro users

### Notifications
- Trade logging reminders
- Weekly performance summaries
- Risk warnings

---

## Tech Stack

### Web
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Recharts

### Mobile
- React Native
- Expo
- TypeScript

### Backend
- FastAPI
- SQLAlchemy / SQLModel
- Pydantic
- Alembic

### Data & Infrastructure
- PostgreSQL
- Redis
- Cloudinary
- Paystack
- Resend / SendGrid
- Docker

---

## Architecture Summary

TradeMind is designed as a modular SaaS system with a clear separation of concerns.

### High-Level Components
- **Web app** for dashboard, analytics, billing, and trade management
- **Mobile app** for quick trade logging and account access
- **API backend** for authentication, trade processing, analytics, billing, and notifications
- **PostgreSQL** for relational data
- **Redis + workers** for background jobs, exports, summaries, and caching
- **Cloudinary** for trade screenshot uploads
- **Paystack** for subscription billing

### Core Backend Modules
- auth
- users
- trades
- analytics
- insights
- billing
- notifications
- exports

---

## Monorepo Structure

```text
trademind/
  apps/
    web/
    mobile/
    api/
  packages/
    ui/
    config/
    types/
  docs/
```

---

## Project Docs

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/case-study.md`](docs/case-study.md)
- [`apps/web/HOMEPAGE_COPY.md`](apps/web/HOMEPAGE_COPY.md)

---

## MVP Scope

### Included
- auth
- trade CRUD
- screenshot upload
- dashboard metrics
- analytics charts
- smart insight generation
- plan gating
- exports
- billing
- notification workflows

### Deferred
- broker sync
- live market data
- AI chat coach
- copy trading
- advanced machine learning

---

## What This Project Demonstrates

TradeMind is designed to show hiring managers that I can think beyond CRUD and build systems that combine product value with engineering quality.

### Skills Demonstrated
- SaaS product design
- full-stack application architecture
- analytics-heavy backend logic
- subscription monetization
- file/image upload workflows
- scalable API design
- dashboard UX thinking
- mobile/web platform strategy
- production-aware system planning

---

## Suggested Build Order

1. Authentication and onboarding
2. Trade journaling and calculations
3. Dashboard overview and charts
4. Smart insights engine
5. SaaS billing and access control
6. Export workflows
7. Mobile companion app

---

## Author
**Pounds Michaels**  
GitHub: `poundsmichaelscode`
