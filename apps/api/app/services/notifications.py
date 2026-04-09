from app.models.models import Notification, Trade


def seed_notifications(user, db):
    if db.query(Notification).filter(Notification.user_id == user.id).count() > 0:
        return

    trades = db.query(Trade).filter(Trade.user_id == user.id).all()
    total = len(trades)
    wins = len([t for t in trades if t.outcome == "win"])
    pnl = round(sum(t.profit_loss or 0 for t in trades), 2)

    samples = [
        Notification(user_id=user.id, title="Weekly performance summary", body=f"You logged {total} trades so far with {wins} wins and total PnL of ${pnl}.", type="summary"),
        Notification(user_id=user.id, title="Journal reminder", body="Log each trade the same day you take it to improve review quality.", type="reminder"),
        Notification(user_id=user.id, title="Risk discipline", body=f"Your preferred risk per trade is {user.risk_preference_percent}%. Keep position sizing aligned.", type="risk"),
    ]
    db.add_all(samples)
    db.commit()
