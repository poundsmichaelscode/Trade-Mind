import { Trade } from './api';

export function buildMetrics(overview?: any) {
  return [
    { label: 'Total PnL', value: `${(overview?.total_profit_loss || 0) >= 0 ? '+' : ''}$${overview?.total_profit_loss ?? 0}`, positive: (overview?.total_profit_loss || 0) >= 0 },
    { label: 'Win Rate', value: `${overview?.win_rate ?? 0}%`, positive: (overview?.win_rate || 0) >= 50 },
    { label: 'Avg RR', value: `${overview?.average_rr ?? 0}`, positive: (overview?.average_rr || 0) >= 1.5 },
    { label: 'Trades', value: `${overview?.total_trades ?? 0}`, positive: true },
  ];
}

export function toWinLoss(trades: Trade[]) {
  const wins = trades.filter((t) => t.outcome === 'win').length;
  const losses = trades.filter((t) => t.outcome === 'loss').length;
  return [{ name: 'Wins', value: wins }, { name: 'Losses', value: losses }];
}
