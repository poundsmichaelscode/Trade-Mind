'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout';
import { MotionCard, SectionHeader, StatusPill } from '@/components/ui';
import { apiBase, apiFetch, Trade } from '@/lib/api';

export default function HistoryPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [exporting, setExporting] = useState<'csv' | 'xlsx' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { apiFetch<Trade[]>('/trades').then(setTrades).catch(() => {}); }, []);

  async function runExport(format: 'csv' | 'xlsx') {
    setExporting(format); setMessage('');
    try {
      const res = await apiFetch<{ file_url: string; count: number; format: string }>('/exports/trades', { method: 'POST', body: JSON.stringify({ format }) });
      window.open(`${apiBase()}${res.file_url}`, '_blank');
      setMessage(`Export ready: ${res.count} trades in ${res.format.toUpperCase()} format.`);
    } catch (err: any) { setMessage(err.message); } finally { setExporting(null); }
  }

  return <AppShell><div className="space-y-5"><SectionHeader title="Trade History" subtitle="Review every logged position with PnL, export your journal, and audit execution quality." /><div className="flex flex-wrap gap-3"><button onClick={() => runExport('csv')} disabled={!!exporting} className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950">{exporting === 'csv' ? 'Preparing CSV...' : 'Export CSV'}</button><button onClick={() => runExport('xlsx')} disabled={!!exporting} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-semibold text-rose-200">{exporting === 'xlsx' ? 'Preparing Excel...' : 'Export Excel (Pro)'}</button>{message ? <p className="self-center text-sm text-slate-300">{message}</p> : null}</div><MotionCard className="p-5"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="text-slate-400"><tr className="border-b border-white/10"><th className="px-3 py-3">Asset</th><th className="px-3 py-3">Market</th><th className="px-3 py-3">Direction</th><th className="px-3 py-3">PnL</th><th className="px-3 py-3">RR</th><th className="px-3 py-3">Duration</th><th className="px-3 py-3">Outcome</th></tr></thead><tbody>{trades.map((trade) => <tr key={trade.id} className="border-b border-white/5"><td className="px-3 py-3 font-semibold text-white">{trade.asset}</td><td className="px-3 py-3 text-slate-300">{trade.market_type}</td><td className="px-3 py-3 text-slate-300 capitalize">{trade.direction}</td><td className={`px-3 py-3 font-semibold ${(trade.profit_loss || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{(trade.profit_loss || 0) >= 0 ? '+' : ''}${trade.profit_loss ?? 0}</td><td className="px-3 py-3 text-slate-300">{trade.risk_reward_ratio ?? '—'}</td><td className="px-3 py-3 text-slate-300">{trade.holding_minutes ?? '—'}m</td><td className="px-3 py-3"><StatusPill value={trade.outcome || 'breakeven'} /></td></tr>)}</tbody></table>{trades.length === 0 ? <p className="px-3 py-6 text-sm text-slate-400">No trades logged yet.</p> : null}</div></MotionCard></div></AppShell>;
}
