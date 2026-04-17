'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout';
import { MotionCard, SectionHeader } from '@/components/ui';
import { apiFetch, User } from '@/lib/api';

const plans = [
  { name: 'Free', price: '$0', features: ['20 trades / month', 'Basic analytics', 'Starter insights'], highlight: false },
  { name: 'Pro', price: '$19', features: ['Unlimited trades', 'Advanced analytics', 'Smart insights', 'CSV / Excel export', 'Priority feature access'], highlight: true },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiFetch<User>('/auth/me').then(setUser).catch(() => {});
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('upgraded') === '1') {
      apiFetch('/billing/activate-pro', { method: 'POST' }).then(() => { setMessage('Pro plan activated for the Phase 3 demo.'); apiFetch<User>('/auth/me').then(setUser); }).catch(() => {});
    }
  }, []);

  async function upgrade() {
    setLoading(true); setMessage('');
    try {
      const data = await apiFetch<{ authorization_url: string }>('/billing/initialize', { method: 'POST', body: JSON.stringify({ plan: 'pro', callback_url: `${window.location.origin}/pricing?upgraded=1` }) });
      window.location.href = data.authorization_url;
    } catch (err: any) { setMessage(err.message); setLoading(false); }
  }

  async function downgrade() {
    setLoading(true); setMessage('');
    try {
      await apiFetch('/billing/cancel', { method: 'POST' });
      const nextUser = await apiFetch<User>('/auth/me');
      setUser(nextUser);
      setMessage('Subscription returned to Free plan.');
    } catch (err: any) { setMessage(err.message); } finally { setLoading(false); }
  }

  return <AppShell><div className="space-y-5"><SectionHeader title="Pricing" subtitle="Choose the desk that matches your trading ambition." />{message ? <p className="text-sm text-emerald-300">{message}</p> : null}<div className="grid gap-6 lg:grid-cols-2">{plans.map((plan) => <MotionCard key={plan.name} className={`p-6 ${plan.highlight ? 'border-emerald-500/30' : ''}`}><p className="font-display text-2xl text-white">{plan.name}</p><p className="mt-2 font-display text-4xl text-white">{plan.price}<span className="text-sm text-slate-400">/mo</span></p><ul className="mt-5 space-y-3 text-slate-300">{plan.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>{plan.highlight ? <button onClick={upgrade} disabled={loading || user?.subscription_plan === 'pro'} className="mt-6 w-full rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">{user?.subscription_plan === 'pro' ? 'Already on Pro' : loading ? 'Redirecting...' : 'Upgrade to Pro'}</button> : <button onClick={downgrade} disabled={loading || user?.subscription_plan !== 'pro'} className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Updating...' : 'Stay / Return to Free'}</button>}</MotionCard>)}</div><MotionCard className="p-5"><p className="text-sm text-slate-300">Phase 4 tightens the billing story with a webhook-safe backend route, persisted billing events, and a production-ready path for Paystack verification. The local redirect still exists so you can demo upgrades fast while keeping the architecture serious.</p></MotionCard></div></AppShell>;
}
