from collections import defaultdict


def generate_insights(trades, risk_preference_percent: float = 2.0):
    insights = []
    if not trades:
        return [{"title": "No data yet", "description": "Log your first trades to unlock smart insights.", "severity": "info"}]

    wins = [t for t in trades if (t.profit_loss or 0) > 0]
    losses = [t for t in trades if (t.profit_loss or 0) < 0]
    if wins and losses:
        avg_win = sum(t.profit_loss for t in wins) / len(wins)
        avg_loss = sum(abs(t.profit_loss) for t in losses) / len(losses)
        if avg_loss > avg_win:
            insights.append({"title": "Loss control needed", "description": "Your average loss is larger than your average win. Tighten stops or reduce size on weaker setups.", "severity": "high"})

    by_asset = defaultdict(list)
    for trade in trades:
        by_asset[trade.asset].append(trade)
    if by_asset:
        ranked = sorted(by_asset.items(), key=lambda kv: sum((t.profit_loss or 0) for t in kv[1]))
        if len(ranked[-1][1]) >= 2:
            insights.append({"title": f"Best asset: {ranked[-1][0]}", "description": f"{ranked[-1][0]} is currently your strongest instrument by net PnL.", "severity": "positive"})

    monday_losses = [t for t in trades if str(t.open_time).lower().startswith('mon') or 'T' in str(t.open_time)]
    risky = [t for t in trades if (t.risk_amount or 0) > 0 and (t.risk_amount or 0) > (abs(t.entry_price * t.position_size) * risk_preference_percent / 100)]
    if risky and len(risky) >= max(1, len(trades)//3):
        insights.append({"title": "Risk is running hot", "description": f"More than a third of your trades exceed your preferred {risk_preference_percent:.1f}% risk threshold.", "severity": "medium"})

    london = [t for t in trades if (t.session_tag or '').lower() == 'london']
    ny = [t for t in trades if (t.session_tag or '').lower() in ('new york', 'ny')]
    if len(london) >= 2 and len(ny) >= 2:
        london_avg = sum((t.profit_loss or 0) for t in london)/len(london)
        ny_avg = sum((t.profit_loss or 0) for t in ny)/len(ny)
        better = 'London' if london_avg > ny_avg else 'New York'
        insights.append({"title": f"{better} session edge", "description": f"Your average PnL is higher during the {better} session. Consider prioritizing that window.", "severity": "positive"})

    if not insights:
        insights.append({"title": "Stable performance", "description": "Your recent results are balanced. Keep building sample size for deeper insights.", "severity": "info"})
    return insights[:4]
