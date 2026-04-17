from typing import Optional, Any
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str | None = None


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    subscription_plan: str
    risk_preference_percent: float
    trading_style: Optional[str] = None
    timezone: str
    subscription_status: Optional[str] = None

    model_config = {'from_attributes': True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'
    user: UserResponse


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    risk_preference_percent: Optional[float] = None
    trading_style: Optional[str] = None
    timezone: Optional[str] = None


class TradeBase(BaseModel):
    asset: str
    market_type: str
    direction: str
    entry_price: float
    exit_price: float
    position_size: float
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    open_time: str
    close_time: str
    session_tag: Optional[str] = None
    setup_tag: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None


class TradeCreate(TradeBase):
    pass


class TradeResponse(TradeBase):
    id: int
    profit_loss: Optional[float] = None
    profit_loss_percent: Optional[float] = None
    risk_amount: Optional[float] = None
    reward_amount: Optional[float] = None
    risk_reward_ratio: Optional[float] = None
    holding_minutes: Optional[int] = None
    outcome: Optional[str] = None

    model_config = {'from_attributes': True}


class NotificationResponse(BaseModel):
    id: int
    title: str
    body: str
    type: str
    read: bool

    model_config = {'from_attributes': True}


class BillingInitializeRequest(BaseModel):
    plan: str = Field(pattern='^(pro)$')
    callback_url: Optional[str] = None


class BillingWebhookRequest(BaseModel):
    event: str
    data: dict[str, Any]


class BillingResponse(BaseModel):
    authorization_url: str
    access_code: str
    reference: str
    mode: str = 'demo'


class ExportCreateRequest(BaseModel):
    format: str = Field(pattern='^(csv|xlsx)$')


class BillingVerifyRequest(BaseModel):
    reference: str


class SummaryQueueResponse(BaseModel):
    queued: bool
    notification_id: int
