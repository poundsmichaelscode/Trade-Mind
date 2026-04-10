from pathlib import Path
from celery.utils.log import get_task_logger
from app.worker import celery_app
from app.core.config import get_settings

logger = get_task_logger(__name__)
settings = get_settings()

@celery_app.task(name="weekly.summary")
def send_weekly_summary_email(user_id: int, email: str):
    logger.info("Queueing weekly summary for user=%s email=%s", user_id, email)
    return {"queued": True, "user_id": user_id, "email": email}

@celery_app.task(name="exports.cleanup")
def cleanup_old_exports():
    export_dir = Path(settings.export_dir)
    if not export_dir.exists():
        return {"deleted": 0}
    deleted = 0
    for path in export_dir.glob("*.csv"):
        # placeholder cleanup rule for production worker extension
        if path.stat().st_size == 0:
            path.unlink(missing_ok=True)
            deleted += 1
    return {"deleted": deleted}
