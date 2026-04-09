from __future__ import annotations
import hashlib
import hmac
import json
from uuid import uuid4
from app.core.config import get_settings

settings = get_settings()


def create_checkout_session(email: str, plan: str, callback_url: str | None = None):
    reference = f'tm_{uuid4().hex[:12]}'
    url = callback_url or settings.paystack_callback_url
    return {
        'authorization_url': url,
        'access_code': reference,
        'reference': reference,
        'mode': 'demo',
        'provider': 'paystack',
        'email': email,
        'plan': plan,
    }


def verify_paystack_signature(raw_body: bytes, signature: str | None) -> bool:
    if not signature:
        return False
    digest = hmac.new(settings.paystack_webhook_secret.encode(), raw_body, hashlib.sha512).hexdigest()
    return hmac.compare_digest(digest, signature)


def safe_payload_text(payload: dict) -> str:
    return json.dumps(payload, sort_keys=True)
