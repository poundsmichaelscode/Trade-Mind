export const metrics = [
  { label: 'Portfolio PnL', value: '+$12,480', delta: '+8.2%', positive: true },
  { label: 'Win Rate', value: '63.4%', delta: '+4.6%', positive: true },
  { label: 'Avg RR', value: '1.92', delta: '+0.18', positive: true },
  { label: 'Drawdown', value: '-3.8%', delta: '-0.7%', positive: false },
];

export const trades = [
  { asset: 'EURUSD', side: 'Buy', pnl: 420, rr: 2.3, status: 'Win', date: '2026-04-08', strategy: 'London Breakout' },
  { asset: 'BTCUSD', side: 'Sell', pnl: -180, rr: 0.7, status: 'Loss', date: '2026-04-08', strategy: 'NY Reversal' },
  { asset: 'XAUUSD', side: 'Buy', pnl: 360, rr: 1.8, status: 'Win', date: '2026-04-07', strategy: 'Trend Follow' },
  { asset: 'GBPJPY', side: 'Sell', pnl: 510, rr: 2.6, status: 'Win', date: '2026-04-06', strategy: 'Momentum' },
];

export const insights = [
  'Your London session trades outperform New York by 18%.',
  'GBP pairs currently show your highest win rate at 71%.',
  'Losses increase when risk exceeds 3% per trade.',
  'Monday is your weakest day. Consider reducing size early week.'
];

export const equityCurve = [
  { name: 'W1', value: 10000 },
  { name: 'W2', value: 10450 },
  { name: 'W3', value: 10220 },
  { name: 'W4', value: 10980 },
  { name: 'W5', value: 11260 },
  { name: 'W6', value: 12480 },
];

export const monthly = [
  { name: 'Jan', pnl: 820 },
  { name: 'Feb', pnl: 1140 },
  { name: 'Mar', pnl: -210 },
  { name: 'Apr', pnl: 1620 },
  { name: 'May', pnl: 970 },
  { name: 'Jun', pnl: 1310 },
];

export const winLoss = [
  { name: 'Wins', value: 63 },
  { name: 'Losses', value: 37 },
];
