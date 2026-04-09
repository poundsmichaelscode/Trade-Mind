'use client';

import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, CreditCard, Download, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout';
import { EquityChart, MonthlyChart, WinLossChart } from '@/components/charts';
import { MotionCard, SectionHeader, StatusPill } from '@/components/ui';
import { apiFetch, Trade } from '@/lib/api';
import { buildMetrics, toWinLoss } from '@/lib/dashboard';

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [equity, setEquity] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/analytics/overview'),
      apiFetch<Trade[]>('/trades'),
      apiFetch('/insights'),
      apiFetch('/analytics/equity-curve'),
      apiFetch('/analytics/monthly-performance'),
    ]).then(([ov, tr, ins, eq, mo]) => {
      setOverview(ov); setTrades(tr); setInsights(ins.items || []); setEquity(eq.items || []); setMonthly(mo.items || []);
    }).catch(() => {});
  }, []);

  const metrics = buildMetrics(overview);

  return <AppShell><div className="space-y-6"><section className="grid-bg rounded-[32px] border border-white/10 bg-white/[0.03] p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><p className="mb-2 text-sm uppercase tracking-[0.35em] text-emerald-400">Live Trading Intelligence</p><h1 className="font-display text-4xl font-bold tracking-wide text-white sm:text-5xl">Trade like a pro. Review like a desk.</h1><p className="mt-3 max-w-2xl text-slate-300">A fully responsive journaling and analytics desk with green/red market styling, motion, exports, upload flow, and billing-ready product plumbing.</p></div><div className="grid gap-3 sm:grid-cols-3"><QuickLink href="/trade/new" icon={UploadCloud} label="Log Trade" /><QuickLink href="/history" icon={Download} label="Export Journal" /><QuickLink href="/pricing" icon={CreditCard} label="Go Pro" /></div></div></section><section><SectionHeader title="Performance snapshot" subtitle="Your trading business at a glance." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MotionCard key={metric.label} className="p-5"><p className="text-sm text-slate-400">{metric.label}</p><div className="mt-3 flex items-end justify-between gap-3"><div className="font-display text-3xl font-bold text-white">{metric.value}</div><div className={`flex items-center gap-1 text-sm font-semibold ${metric.positive ? 'text-emerald-400' : 'text-rose-400'}`}>{metric.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</div></div></MotionCard>)}</div></section><section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]"><MotionCard className="p-5"><SectionHeader title="Equity Curve" subtitle="Running PnL from your logged trades." /><EquityChart data={equity} /></MotionCard><MotionCard className="p-5"><SectionHeader title="Win vs Loss" subtitle="Distribution of closed outcomes." /><WinLossChart data={toWinLoss(trades)} /></MotionCard></section><section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><MotionCard className="p-5"><SectionHeader title="Recent Trades" subtitle="Latest journal entries and outcomes." /><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="text-slate-400"><tr className="border-b border-white/10"><th className="px-3 py-3">Asset</th><th className="px-3 py-3">Side</th><th className="px-3 py-3">Strategy</th><th className="px-3 py-3">RR</th><th className="px-3 py-3">PnL</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{trades.slice(0,6).map((trade) => <tr key={trade.id} className="border-b border-white/5"><td className="px-3 py-3 font-semibold text-white">{trade.asset}</td><td className="px-3 py-3 text-slate-300 capitalize">{trade.direction}</td><td className="px-3 py-3 text-slate-300">{trade.setup_tag || '—'}</td><td className="px-3 py-3 text-slate-300">{trade.risk_reward_ratio ?? '—'}</td><td className={`px-3 py-3 font-semibold ${(trade.profit_loss || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{(trade.profit_loss || 0) >= 0 ? '+' : ''}${trade.profit_loss ?? 0}</td><td className="px-3 py-3"><StatusPill value={trade.outcome || 'breakeven'} /></td></tr>)}</tbody></table>{trades.length === 0 ? <p className="px-3 py-6 text-sm text-slate-400">No trades yet. Add your first trade to populate the desk.</p> : null}</div></MotionCard><MotionCard className="p-5"><SectionHeader title="Smart Insights" subtitle="Rule-based performance observations." /><div className="space-y-3">{insights.map((item, idx) => <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200"><p className="font-semibold text-white">{item.title}</p><p className="mt-1 text-slate-300">{item.description}</p></div>)}</div></MotionCard></section><section><MotionCard className="p-5"><SectionHeader title="Monthly Performance" subtitle="Profitability trend by month." /><MonthlyChart data={monthly} /></MotionCard></section></div></AppShell>;
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return <Link href={href} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white transition hover:border-emerald-500/30 hover:bg-emerald-500/10"><div className="flex items-center gap-2"><Icon size={16} className="text-emerald-300" /> <span>{label}</span></div></Link>;
}
