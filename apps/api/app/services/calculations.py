from datetime import datetime


def _parse_minutes(start: str, end: str) -> int | None:
    try:
        fmt = "%Y-%m-%dT%H:%M" if "T" in start else "%Y-%m-%d %H:%M"
        start_dt = datetime.strptime(start, fmt)
        end_dt = datetime.strptime(end, fmt)
        return max(int((end_dt - start_dt).total_seconds() // 60), 0)
    except Exception:
        return None


def calculate_trade_metrics(direction: str, entry_price: float, exit_price: float, position_size: float, stop_loss: float | None = None, take_profit: float | None = None, open_time: str | None = None, close_time: str | None = None) -> dict:
    side = direction.lower()
    if side == "buy":
        pnl = (exit_price - entry_price) * position_size
        risk_amount = ((entry_price - stop_loss) * position_size) if stop_loss is not None else None
        reward_amount = ((take_profit - entry_price) * position_size) if take_profit is not None else None
    else:
        pnl = (entry_price - exit_price) * position_size
        risk_amount = ((stop_loss - entry_price) * position_size) if stop_loss is not None else None
        reward_amount = ((entry_price - take_profit) * position_size) if take_profit is not None else None

    risk_reward_ratio = None
    if risk_amount not in (None, 0):
        risk_reward_ratio = abs(reward_amount / risk_amount) if reward_amount is not None else None

    notional = abs(entry_price * position_size) or 1
    pnl_percent = (pnl / notional) * 100
    outcome = "win" if pnl > 0 else "loss" if pnl < 0 else "breakeven"

    return {
        "profit_loss": round(pnl, 2),
        "profit_loss_percent": round(pnl_percent, 2),
        "risk_amount": round(abs(risk_amount), 2) if risk_amount is not None else None,
        "reward_amount": round(abs(reward_amount), 2) if reward_amount is not None else None,
        "risk_reward_ratio": round(risk_reward_ratio, 2) if risk_reward_ratio is not None else None,
        "holding_minutes": _parse_minutes(open_time, close_time) if open_time and close_time else None,
        "outcome": outcome,
    }
