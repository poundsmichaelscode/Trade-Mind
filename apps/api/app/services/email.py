from __future__ import annotations
import requests

from app.core.config import get_settings

settings = get_settings()


def send_email(to: str, subject: str, html: str) -> dict:
    if not settings.resend_api_key:
        return {'sent': False, 'mode': 'disabled', 'reason': 'RESEND_API_KEY not configured'}
    try:
        response = requests.post(
            'https://api.resend.com/emails',
            headers={'Authorization': f'Bearer {settings.resend_api_key}', 'Content-Type': 'application/json'},
            json={'from': settings.mail_from, 'to': [to], 'subject': subject, 'html': html},
            timeout=15,
        )
        payload = response.json()
        return {'sent': bool(response.ok), 'mode': 'live', 'payload': payload}
    except Exception as exc:
        return {'sent': False, 'mode': 'live', 'reason': str(exc)}
