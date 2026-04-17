from app.core.config import Settings
from app.services.calculations import calculate_trade_metrics


def test_cors_origins_split_into_list():
    settings = Settings(cors_origins="https://a.com, https://b.com")
    assert settings.cors_origins_list == ["https://a.com", "https://b.com"]


def test_trade_calculation_returns_expected_buy_metrics():
    metrics = calculate_trade_metrics(
        direction="buy",
        entry_price=100,
        exit_price=110,
        position_size=2,
        stop_loss=95,
        take_profit=120,
        open_time="2026-04-01T10:00:00",
        close_time="2026-04-01T11:00:00",
    )
    assert metrics["profit_loss"] == 20
    assert metrics["risk_amount"] == 10
    assert metrics["reward_amount"] == 40
    assert metrics["risk_reward_ratio"] == 4
    assert metrics["holding_minutes"] == 60
    assert metrics["outcome"] == "win"
