from __future__ import annotations
from collections import defaultdict
from pathlib import Path
from fastapi import APIRouter, Depends, File, Header, HTTPException, Request, UploadFile, status
from fastapi.responses import FileResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.models import BillingEvent, Notification, RefreshToken, Trade, User
from app.schemas.schemas import (
    BillingInitializeRequest,
    BillingResponse,
    ExportCreateRequest,
    LoginRequest,
    LogoutRequest,
    NotificationResponse,
    ProfileUpdate,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    TradeCreate,
    TradeResponse,
    UserResponse,
)
from app.services.calculations import calculate_trade_metrics
from app.services.exports import export_trades
from app.services.insights import generate_insights
from app.services.notifications import seed_notifications
from app.services.payments import create_checkout_session, safe_payload_text, verify_paystack_signature
from app.services.uploads import save_trade_image

auth_router = APIRouter()
trade_router = APIRouter()
analytics_router = APIRouter()
insight_router = APIRouter()
user_router = APIRouter()
billing_router = APIRouter()
upload_router = APIRouter()
export_router = APIRouter()
notification_router = APIRouter()
security = HTTPBearer(auto_error=False)


def _issue_tokens(user: User, db: Session) -> TokenResponse:
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    db.add(RefreshToken(user_id=user.id, token=refresh_token))
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Not authenticated')
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload.get('sub'))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user


@auth_router.post('/register', response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail='Email already exists')
    user = User(full_name=payload.full_name, email=payload.email.lower(), password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    seed_notifications(user, db)
    return _issue_tokens(user, db)


@auth_router.post('/login', response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    seed_notifications(user, db)
    return _issue_tokens(user, db)


@auth_router.post('/refresh', response_model=TokenResponse)
def refresh_tokens(payload: RefreshRequest, db: Session = Depends(get_db)):
    try:
        token_data = decode_refresh_token(payload.refresh_token)
        user_id = int(token_data.get('sub'))
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid refresh token')

    token_row = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token, RefreshToken.revoked.is_(False)).first()
    if not token_row:
        raise HTTPException(status_code=401, detail='Refresh token revoked or unknown')

    token_row.revoked = True
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail='User not found')
    db.add(token_row)
    db.commit()
    return _issue_tokens(user, db)


@auth_router.post('/logout')
def logout(payload: LogoutRequest, db: Session = Depends(get_db)):
    token_row = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token).first()
    if token_row:
        token_row.revoked = True
        db.add(token_row)
        db.commit()
    return {'success': True}


@auth_router.get('/me', response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@user_router.patch('/profile', response_model=UserResponse)
def update_profile(payload: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@trade_router.get('', response_model=list[TradeResponse])
def list_trades(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Trade).filter(Trade.user_id == current_user.id).order_by(Trade.created_at.desc(), Trade.id.desc()).all()


@trade_router.post('', response_model=TradeResponse)
def create_trade(payload: TradeCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    monthly_count = db.query(Trade).filter(Trade.user_id == current_user.id).count()
    if current_user.subscription_plan == 'free' and monthly_count >= 20:
        raise HTTPException(status_code=403, detail='Free plan monthly trade limit reached')

    calculated = calculate_trade_metrics(
        direction=payload.direction,
        entry_price=payload.entry_price,
        exit_price=payload.exit_price,
        position_size=payload.position_size,
        stop_loss=payload.stop_loss,
        take_profit=payload.take_profit,
        open_time=payload.open_time,
        close_time=payload.close_time,
    )
    trade = Trade(user_id=current_user.id, **payload.model_dump(), **calculated)
    db.add(trade)
    db.commit()
    db.refresh(trade)
    return trade


@trade_router.delete('/{trade_id}')
def delete_trade(trade_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trade = db.query(Trade).filter(Trade.id == trade_id, Trade.user_id == current_user.id).first()
    if not trade:
        raise HTTPException(status_code=404, detail='Trade not found')
    db.delete(trade)
    db.commit()
    return {'success': True}


@analytics_router.get('/overview')
def analytics_overview(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).all()
    total = len(trades)
    wins = len([t for t in trades if t.outcome == 'win'])
    losses = len([t for t in trades if t.outcome == 'loss'])
    total_pnl = round(sum(t.profit_loss or 0 for t in trades), 2)
    avg_rr_values = [t.risk_reward_ratio for t in trades if t.risk_reward_ratio is not None]
    avg_rr = round(sum(avg_rr_values) / len(avg_rr_values), 2) if avg_rr_values else 0
    asset_rows = db.query(Trade.asset, func.sum(Trade.profit_loss)).filter(Trade.user_id == current_user.id).group_by(Trade.asset).all()
    best_asset = worst_asset = '—'
    if asset_rows:
        sorted_rows = sorted(asset_rows, key=lambda x: x[1] or 0)
        worst_asset = sorted_rows[0][0]
        best_asset = sorted_rows[-1][0]
    return {
        'total_trades': total,
        'wins': wins,
        'losses': losses,
        'win_rate': round((wins / total) * 100, 2) if total else 0,
        'total_profit_loss': total_pnl,
        'average_rr': avg_rr,
        'best_asset': best_asset,
        'worst_asset': worst_asset,
        'subscription_plan': current_user.subscription_plan,
    }


@analytics_router.get('/equity-curve')
def equity_curve(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).order_by(Trade.created_at.asc(), Trade.id.asc()).all()
    running = 0
    series = []
    for idx, trade in enumerate(trades, start=1):
        running += trade.profit_loss or 0
        series.append({'name': f'T{idx}', 'value': round(running, 2)})
    return {'items': series}


@analytics_router.get('/monthly-performance')
def monthly_performance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).all()
    months = defaultdict(float)
    for trade in trades:
        key = (trade.open_time or '')[:7] or 'Unknown'
        months[key] += trade.profit_loss or 0
    return {'items': [{'name': k, 'pnl': round(v, 2)} for k, v in sorted(months.items())]}


@analytics_router.get('/assets')
def asset_breakdown(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Trade.asset, func.sum(Trade.profit_loss), func.count(Trade.id)).filter(Trade.user_id == current_user.id).group_by(Trade.asset).all()
    return {'items': [{'asset': r[0], 'pnl': round(r[1] or 0, 2), 'count': r[2]} for r in rows]}


@analytics_router.get('/behavior')
def behavior(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).all()
    session_map = defaultdict(list)
    for trade in trades:
        session_map[(trade.session_tag or 'Unspecified')].append(trade.profit_loss or 0)
    items = []
    for key, values in session_map.items():
        avg = sum(values) / len(values) if values else 0
        items.append({'session': key, 'avg_pnl': round(avg, 2), 'count': len(values)})
    return {'items': items}


@insight_router.get('')
def insights(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).all()
    return {'items': generate_insights(trades, current_user.risk_preference_percent)}


@billing_router.post('/initialize', response_model=BillingResponse)
def initialize_billing(payload: BillingInitializeRequest, current_user: User = Depends(get_current_user)):
    return create_checkout_session(current_user.email, payload.plan, payload.callback_url)


@billing_router.post('/activate-pro')
def activate_pro(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.subscription_plan = 'pro'
    current_user.subscription_status = 'active'
    db.add(current_user)
    db.commit()
    return {'success': True, 'plan': 'pro'}


@billing_router.post('/cancel')
def cancel_subscription(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.subscription_plan = 'free'
    current_user.subscription_status = 'inactive'
    db.add(current_user)
    db.commit()
    return {'success': True, 'plan': 'free'}


@billing_router.post('/webhook')
async def billing_webhook(request: Request, x_paystack_signature: str | None = Header(default=None), db: Session = Depends(get_db)):
    raw_body = await request.body()
    if not verify_paystack_signature(raw_body, x_paystack_signature):
        raise HTTPException(status_code=401, detail='Invalid webhook signature')
    payload = await request.json()
    customer_email = payload.get('data', {}).get('customer', {}).get('email')
    user = db.query(User).filter(User.email == customer_email).first() if customer_email else None
    if user and payload.get('event') in {'charge.success', 'subscription.create'}:
        user.subscription_plan = 'pro'
        user.subscription_status = 'active'
        db.add(user)
    event = BillingEvent(
        user_id=user.id if user else None,
        provider='paystack',
        event_type=payload.get('event', 'unknown'),
        reference_id=payload.get('data', {}).get('reference'),
        payload=safe_payload_text(payload),
    )
    db.add(event)
    db.commit()
    return {'received': True}


@upload_router.post('/trade-image')
def upload_trade_image(current_user: User = Depends(get_current_user), file: UploadFile = File(...)):
    try:
        return save_trade_image(file, current_user.id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@export_router.post('/trades')
def create_export(payload: ExportCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.format == 'xlsx' and current_user.subscription_plan != 'pro':
        raise HTTPException(status_code=403, detail='Excel export is available on Pro only')
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).order_by(Trade.created_at.desc()).all()
    file_path = export_trades(trades, payload.format, current_user.id)
    return {'file_url': f'/exports/download?path={Path(file_path).name}', 'count': len(trades), 'format': payload.format}


@export_router.get('/download')
def download_export(path: str, current_user: User = Depends(get_current_user)):
    safe_path = Path('exports') / Path(path).name
    if not safe_path.exists():
        raise HTTPException(status_code=404, detail='Export not found')
    return FileResponse(safe_path)


@notification_router.get('', response_model=list[NotificationResponse])
def list_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc(), Notification.id.desc()).all()


@notification_router.patch('/{notification_id}/read')
def mark_notification_read(notification_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Notification not found')
    item.read = True
    db.add(item)
    db.commit()
    return {'success': True}
