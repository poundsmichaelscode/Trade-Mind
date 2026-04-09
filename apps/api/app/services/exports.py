from __future__ import annotations
from pathlib import Path
import csv
from openpyxl import Workbook
from app.models.models import Trade


EXPORT_DIR = Path("exports")
EXPORT_DIR.mkdir(exist_ok=True)


def _trade_rows(trades: list[Trade]):
    headers = [
        "id", "asset", "market_type", "direction", "entry_price", "exit_price", "position_size",
        "stop_loss", "take_profit", "open_time", "close_time", "session_tag", "setup_tag", "notes",
        "image_url", "profit_loss", "profit_loss_percent", "risk_amount", "reward_amount",
        "risk_reward_ratio", "holding_minutes", "outcome",
    ]
    rows = []
    for t in trades:
        rows.append([getattr(t, h) for h in headers])
    return headers, rows


def export_trades(trades: list[Trade], fmt: str, user_id: int) -> str:
    headers, rows = _trade_rows(trades)
    out = EXPORT_DIR / f"trades_user_{user_id}.{fmt}"
    if fmt == "csv":
        with out.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)
    else:
        wb = Workbook()
        ws = wb.active
        ws.title = "Trades"
        ws.append(headers)
        for row in rows:
            ws.append(row)
        wb.save(out)
    return str(out)
