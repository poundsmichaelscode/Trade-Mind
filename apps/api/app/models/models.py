from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class User(Base, TimestampMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    subscription_plan = Column(String(30), default='free')
    risk_preference_percent = Column(Float, default=2.0)
    trading_style = Column(String(50), nullable=True)
    timezone = Column(String(80), default='UTC')
    paystack_customer_code = Column(String(120), nullable=True)
    subscription_status = Column(String(30), default='inactive')

    trades = relationship('Trade', back_populates='user', cascade='all, delete-orphan')
    notifications = relationship('Notification', back_populates='user', cascade='all, delete-orphan')
    refresh_tokens = relationship('RefreshToken', back_populates='user', cascade='all, delete-orphan')
    billing_events = relationship('BillingEvent', back_populates='user', cascade='all, delete-orphan')


class Trade(Base, TimestampMixin):
    __tablename__ = 'trades'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    asset = Column(String(30), nullable=False)
    market_type = Column(String(30), nullable=False)
    direction = Column(String(10), nullable=False)
    entry_price = Column(Float, nullable=False)
    exit_price = Column(Float, nullable=False)
    position_size = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=True)
    take_profit = Column(Float, nullable=True)
    open_time = Column(String(40), nullable=False)
    close_time = Column(String(40), nullable=False)
    session_tag = Column(String(40), nullable=True)
    setup_tag = Column(String(60), nullable=True)
    notes = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    profit_loss = Column(Float, nullable=True)
    profit_loss_percent = Column(Float, nullable=True)
    risk_amount = Column(Float, nullable=True)
    reward_amount = Column(Float, nullable=True)
    risk_reward_ratio = Column(Float, nullable=True)
    holding_minutes = Column(Integer, nullable=True)
    outcome = Column(String(20), nullable=True)

    user = relationship('User', back_populates='trades')


class Notification(Base, TimestampMixin):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(160), nullable=False)
    body = Column(Text, nullable=False)
    type = Column(String(30), default='system')
    read = Column(Boolean, default=False)

    user = relationship('User', back_populates='notifications')


class RefreshToken(Base, TimestampMixin):
    __tablename__ = 'refresh_tokens'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    token = Column(String(600), unique=True, nullable=False)
    revoked = Column(Boolean, default=False)

    user = relationship('User', back_populates='refresh_tokens')


class BillingEvent(Base, TimestampMixin):
    __tablename__ = 'billing_events'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    provider = Column(String(40), default='paystack')
    event_type = Column(String(80), nullable=False)
    reference_id = Column(String(120), nullable=True)
    payload = Column(Text, nullable=False)

    user = relationship('User', back_populates='billing_events')
