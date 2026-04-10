from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = 'TradeMind API'
    app_env: str = 'development'
    app_version: str = '0.6.3'
    cors_origins: str = 'http://localhost:3000,http://127.0.0.1:3000'

    database_url: str = 'sqlite:///./trademind.db'

    secret_key: str = 'trademind-dev-secret'
    algorithm: str = 'HS256'
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    paystack_secret_key: str = 'sk_test_xxx'
    paystack_public_key: str = 'pk_test_xxx'
    paystack_callback_url: str = 'http://localhost:3000/pricing?upgraded=1'
    paystack_webhook_secret: str = 'paystack-webhook-secret'
    paystack_base_url: str = 'https://api.paystack.co'

    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None
    cloudinary_folder: str = 'trademind'

    resend_api_key: str | None = None
    mail_from: str = 'TradeMind <noreply@trademind.app>'

    upload_dir: str = 'uploads'
    export_dir: str = 'exports'
    redis_url: str = 'redis://redis:6379/0'

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    @property
    def cors_origins_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(',') if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


# Phase 6 additions
