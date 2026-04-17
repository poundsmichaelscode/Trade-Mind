'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout';
import { MotionCard, SectionHeader } from '@/components/ui';
import { apiFetch } from '@/lib/api';

export default function InsightsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { apiFetch('/insights').then((d: any) => setItems(d.items || [])).catch(() => {}); }, []);
  return <AppShell><SectionHeader title="Smart Insights" subtitle="Behavior-driven observations from your trade journal." />
  <div className="grid gap-4 lg:grid-cols-2">
    {items.map((item, idx) => <MotionCard key={idx} className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-white">{item.title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs capitalize ${item.severity === 'positive' ? 'bg-emerald-500/15 text-emerald-300' : item.severity === 'high' ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-500/15 text-amber-300'}`}>{item.severity}</span>
        
        </div>
        
        <p className="mt-3 text-sm text-slate-300">{item.description}</p>
        
        </MotionCard>)}
        </div>
        
        </AppShell>;
}
