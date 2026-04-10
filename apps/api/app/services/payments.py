from __future__ import annotations
import hashlib
import hmac
import json
from uuid import uuid4

import requests

from app.core.config import get_settings

settings = get_settings()


def _headers() -> dict[str, str]:
    return {
        'Authorization': f'Bearer {settings.paystack_secret_key}',
        'Content-Type': 'application/json',
    }


def create_checkout_session(email: str, plan: str, callback_url: str | None = None):
    reference = f'tm_{uuid4().hex[:12]}'
    url = callback_url or settings.paystack_callback_url
    amount_by_plan = {'pro': 150000, 'free': 0}
    amount = amount_by_plan.get(plan, 150000)

    # Attempts a real Paystack initialize call when a non-placeholder secret key is present.
    if settings.paystack_secret_key and not settings.paystack_secret_key.endswith('_xxx'):
        try:
            response = requests.post(
                f"{settings.paystack_base_url}/transaction/initialize",
                headers=_headers(),
                json={
                    'email': email,
                    'amount': amount,
                    'reference': reference,
                    'callback_url': url,
                    'metadata': {'product': 'TradeMind', 'plan': plan},
                },
                timeout=15,
            )
            payload = response.json()
            if response.ok and payload.get('status'):
                data = payload.get('data', {})
                return {
                    'authorization_url': data.get('authorization_url', url),
                    'access_code': data.get('access_code', reference),
                    'reference': data.get('reference', reference),
                    'mode': 'live',
                    'provider': 'paystack',
                    'email': email,
                    'plan': plan,
                }
        except Exception:
            pass

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


def verify_transaction(reference: str) -> dict:
    if not settings.paystack_secret_key or settings.paystack_secret_key.endswith('_xxx'):
        return {'verified': False, 'mode': 'demo', 'reference': reference, 'message': 'Configure PAYSTACK_SECRET_KEY for live verification.'}
    try:
        response = requests.get(f"{settings.paystack_base_url}/transaction/verify/{reference}", headers=_headers(), timeout=15)
        payload = response.json()
        data = payload.get('data', {}) if isinstance(payload, dict) else {}
        return {
            'verified': bool(response.ok and payload.get('status') and data.get('status') == 'success'),
            'mode': 'live',
            'reference': reference,
            'payload': payload,
        }
    except Exception as exc:
        return {'verified': False, 'mode': 'live', 'reference': reference, 'message': str(exc)}


def safe_payload_text(payload: dict) -> str:
    return json.dumps(payload, sort_keys=True)
