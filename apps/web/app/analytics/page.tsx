'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout';
import { EquityChart, MonthlyChart } from '@/components/charts';
import { MotionCard, SectionHeader } from '@/components/ui';
import { apiFetch } from '@/lib/api';

export default function AnalyticsPage() {
  const [equity, setEquity] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [behavior, setBehavior] = useState<any[]>([]);
  useEffect(() => { Promise.all([apiFetch('/analytics/equity-curve'), apiFetch('/analytics/monthly-performance'), apiFetch('/analytics/assets'), apiFetch('/analytics/behavior')]).then(([eq, mo, as, be]) => { setEquity(eq.items || []); setMonthly(mo.items || []); setAssets(as.items || []); setBehavior(be.items || []); }).catch(() => {}); }, []);
  return <AppShell><div className="space-y-6"><MotionCard className="p-5"><SectionHeader title="Equity Curve" subtitle="Cumulative PnL across your trade history." /><EquityChart data={equity} /></MotionCard><MotionCard className="p-5"><SectionHeader title="Monthly Performance" subtitle="Month-by-month profit and loss." /><MonthlyChart data={monthly} /></MotionCard><div className="grid gap-6 lg:grid-cols-2"><MotionCard className="p-5"><SectionHeader title="Asset Breakdown" subtitle="Performance by instrument." /><div className="space-y-3">{assets.map((item) => <div key={item.asset} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"><div><p className="font-semibold text-white">{item.asset}</p><p className="text-sm text-slate-400">{item.count} trades</p></div><div className={item.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{item.pnl >= 0 ? '+' : ''}${item.pnl}</div></div>)}</div></MotionCard><MotionCard className="p-5"><SectionHeader title="Session Behavior" subtitle="Average PnL by tagged session." /><div className="space-y-3">{behavior.map((item) => <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"><div><p className="font-semibold text-white">{item.name}</p><p className="text-sm text-slate-400">{item.trades} trades</p></div><div className={item.avgPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{item.avgPnl >= 0 ? '+' : ''}${item.avgPnl}</div></div>)}</div></MotionCard></div></div></AppShell>;
}
