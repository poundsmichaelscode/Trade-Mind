from __future__ import annotations
from pathlib import Path
from uuid import uuid4

import requests
from fastapi import UploadFile

from app.core.config import get_settings

settings = get_settings()
ALLOWED_SUFFIXES = {'.png', '.jpg', '.jpeg', '.webp'}
MAX_BYTES = 5 * 1024 * 1024


def _cloudinary_enabled() -> bool:
    return bool(settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret)


def save_trade_image(file: UploadFile, user_id: int) -> dict:
    suffix = Path(file.filename or 'image.png').suffix.lower() or '.png'
    if suffix not in ALLOWED_SUFFIXES:
        raise ValueError('Unsupported file type. Use png, jpg, jpeg, or webp.')

    content = file.file.read()
    if len(content) > MAX_BYTES:
        raise ValueError('File too large. Max size is 5MB.')

    filename = f'user_{user_id}_{uuid4().hex}{suffix}'

    if _cloudinary_enabled():
        try:
            url = f"https://api.cloudinary.com/v1_1/{settings.cloudinary_cloud_name}/image/upload"
            response = requests.post(
                url,
                data={
                    'upload_preset': 'ml_default',
                    'folder': settings.cloudinary_folder,
                    'public_id': filename.rsplit('.', 1)[0],
                    'api_key': settings.cloudinary_api_key,
                },
                files={'file': (filename, content)},
                timeout=20,
            )
            payload = response.json()
            if response.ok and payload.get('secure_url'):
                return {
                    'url': payload['secure_url'],
                    'name': filename,
                    'note': 'Uploaded to Cloudinary.',
                    'provider': 'cloudinary',
                }
        except Exception:
            pass

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    destination = upload_dir / filename
    destination.write_bytes(content)
    return {
        'url': f'/uploads/{filename}',
        'name': filename,
        'note': 'Local upload saved. Set Cloudinary env vars to swap to cloud storage.',
        'provider': 'local',
    }
