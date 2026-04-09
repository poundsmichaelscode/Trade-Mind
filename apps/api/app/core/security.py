from __future__ import annotations
from datetime import datetime, timedelta, UTC
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def _create_token(subject: str, expires_delta: timedelta, token_type: str) -> str:
    expires = datetime.now(UTC) + expires_delta
    payload = {'sub': subject, 'type': token_type, 'exp': expires}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(subject: str) -> str:
    return _create_token(subject, timedelta(minutes=settings.access_token_expire_minutes), 'access')


def create_refresh_token(subject: str) -> str:
    return _create_token(subject, timedelta(days=settings.refresh_token_expire_days), 'refresh')


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError as exc:
        raise ValueError('Invalid token') from exc


def decode_access_token(token: str) -> dict:
    payload = decode_token(token)
    if payload.get('type') != 'access':
        raise ValueError('Invalid access token')
    return payload


def decode_refresh_token(token: str) -> dict:
    payload = decode_token(token)
    if payload.get('type') != 'refresh':
        raise ValueError('Invalid refresh token')
    return payload
