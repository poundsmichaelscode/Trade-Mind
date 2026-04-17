from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    app_name: str = "TradeMind API"
    app_env: str = "development"
    app_version: str = "0.6.4"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    database_url: str = f"sqlite:///{BASE_DIR / 'trademind.db'}"

    secret_key: str = "trademind-dev-secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    paystack_secret_key: str = "sk_test_xxx"
    paystack_public_key: str = "pk_test_xxx"
    paystack_callback_url: str = "http://localhost:3000/pricing?upgraded=1"
    paystack_webhook_secret: str = "paystack-webhook-secret"
    paystack_base_url: str = "https://api.paystack.co"

    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None
    cloudinary_folder: str = "trademind"

    resend_api_key: str | None = None
    mail_from: str = "TradeMind <noreply@trademind.app>"

    upload_dir: str = str(BASE_DIR / "uploads")
    export_dir: str = str(BASE_DIR / "exports")
    redis_url: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=False)

    @property
    def cors_origins_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
