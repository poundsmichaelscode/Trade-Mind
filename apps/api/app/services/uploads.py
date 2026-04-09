from __future__ import annotations
from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile
from app.core.config import get_settings

settings = get_settings()
ALLOWED_SUFFIXES = {'.png', '.jpg', '.jpeg', '.webp'}


def save_trade_image(file: UploadFile, user_id: int) -> dict:
    suffix = Path(file.filename or 'image.png').suffix.lower() or '.png'
    if suffix not in ALLOWED_SUFFIXES:
        raise ValueError('Unsupported file type. Use png, jpg, jpeg, or webp.')

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = f'user_{user_id}_{uuid4().hex}{suffix}'
    destination = upload_dir / filename
    with destination.open('wb') as f:
        f.write(file.file.read())

    if settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret:
        return {
            'url': f'https://res.cloudinary.com/{settings.cloudinary_cloud_name}/image/upload/v1/{filename}',
            'name': filename,
            'note': 'Cloudinary environment detected. Replace this placeholder upload with SDK integration.',
            'provider': 'cloudinary-ready',
        }

    return {
        'url': f'/uploads/{filename}',
        'name': filename,
        'note': 'Local upload saved. Set Cloudinary env vars to swap to cloud storage.',
        'provider': 'local',
    }
