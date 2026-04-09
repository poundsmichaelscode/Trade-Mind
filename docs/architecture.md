# TradeMind Architecture

## Web
The web layer is a Next.js App Router dashboard with a trading-style green/red visual language, animated cards, responsive sidebar, and analytics charts.

## API
The backend is FastAPI-based and organized into:
- routes
- models
- schemas
- services
- db/session

## Future Extensions
- JWT dependency guards on all protected endpoints
- Cloudinary integration
- Paystack webhook flow
- Background jobs for export + summaries
- PostgreSQL migration from SQLite local dev
