# TradeMind

TradeMind is a smart trading journal and performance analytics SaaS for forex and crypto traders.

## Phase 4 Upgrade
This version pushes the project closer to a deployable product:
- PostgreSQL-ready backend configuration
- refresh token auth flow with token rotation
- webhook-safe Paystack billing endpoint scaffold
- Cloudinary-ready upload service fallback
- notification read endpoint
- Docker Compose with Postgres
- Alembic migration baseline stub
- frontend token refresh support

## Apps
- `apps/web` — Next.js trading dashboard
- `apps/api` — FastAPI backend

## Quick Start
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
source .venv/bin/activate  # or .venv\\Scripts\\activate on Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Docker
```bash
docker compose up --build
```

## Production Notes
This repo now includes the core architecture for a serious MVP, but it still needs final production hardening such as:
- real Cloudinary SDK upload integration
- real Paystack transaction verification fetch
- full Alembic migration chain
- background worker for exports and summaries
- email delivery provider wiring
