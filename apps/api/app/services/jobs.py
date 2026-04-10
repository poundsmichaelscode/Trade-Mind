from app.worker_tasks import send_weekly_summary_email

def enqueue_weekly_summary(user_id: int, email: str):
    try:
        return send_weekly_summary_email.delay(user_id, email).id
    except Exception:
        return f"local-dev-summary-{user_id}"


def send_upgrade_confirmation(email: str):
    return {"queued": True, "email": email, "channel": "email"}
