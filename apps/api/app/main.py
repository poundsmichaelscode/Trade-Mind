from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import (
    analytics_router,
    auth_router,
    billing_router,
    export_router,
    insight_router,
    notification_router,
    trade_router,
    upload_router,
    user_router,
)
from app.core.config import get_settings
from app.db.session import Base, engine

settings = get_settings()

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
Path(settings.export_dir).mkdir(parents=True, exist_ok=True)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, version=settings.app_version)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list if settings.app_env != "development" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
app.mount("/exports/files", StaticFiles(directory=settings.export_dir), name="exports-files")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(trade_router, prefix="/trades", tags=["trades"])
app.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
app.include_router(insight_router, prefix="/insights", tags=["insights"])
app.include_router(billing_router, prefix="/billing", tags=["billing"])
app.include_router(upload_router, prefix="/uploads", tags=["uploads"])
app.include_router(export_router, prefix="/exports", tags=["exports"])
app.include_router(notification_router, prefix="/notifications", tags=["notifications"])


@app.get("/")
def root():
    return {"name": settings.app_name, "status": "ok", "phase": 6, "version": settings.app_version}


@app.get("/status")
def status():
    return {"status": "ok", "version": settings.app_version}
