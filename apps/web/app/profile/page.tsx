'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/layout';
import { MotionCard, SectionHeader } from '@/components/ui';
import { apiFetch, User } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => { apiFetch<User>('/auth/me').then(setUser).catch(() => {}); }, []);
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    const updated = await apiFetch<User>('/users/profile', { method: 'PATCH', body: JSON.stringify(user) });
    setUser(updated);
    setMessage('Profile updated.');
  }

  return <AppShell><SectionHeader title="Profile" subtitle="Manage risk preferences, trading style, and account settings." />

  <MotionCard className="p-6">{user ? <form onSubmit={save} className="grid gap-4 md:grid-cols-2">

    <div>
    <label className="mb-2 block text-sm text-slate-400">Full name</label>

    <input value={user.full_name} onChange={(e) => setUser({ ...user, full_name: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white" />


    </div>
    <div>

      <label className="mb-2 block text-sm text-slate-400">Email</label>

    <input value={user.email} disabled className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-slate-400" /></div>
    <div><label className="mb-2 block text-sm text-slate-400">Risk %</label>
    <input value={user.risk_preference_percent} onChange={(e) => setUser({ ...user, risk_preference_percent: Number(e.target.value) })} type="number" className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white" />
    </div>
    <div><label className="mb-2 block text-sm text-slate-400">Trading style</label><input value={user.trading_style || ''} onChange={(e) => setUser({ ...user, trading_style: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white" />
    
    </div>
    <div>



      <label className="mb-2 block text-sm text-slate-400">Timezone</label>

<select
  value={user.timezone}
  onChange={(e) => setUser({ ...user, timezone: e.target.value })}
  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white"
>
  <option value="">Select your timezone</option>
  <option value="UTC">UTC</option>
  <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
  <option value="Europe/London">Europe/London (GMT+0/+1)</option>
  <option value="America/New_York">America/New_York (GMT-5/-4)</option>
  <option value="America/Los_Angeles">America/Los_Angeles (GMT-8/-7)</option>
  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
  <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
  <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
  <option value="Australia/Sydney">Australia/Sydney (GMT+10/+11)</option>
</select>

      {/* <label className="mb-2 block text-sm text-slate-400">Timezone</label>
      <input value={user.timezone} onChange={(e) => setUser({ ...user, timezone: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white" /> */}
      </div>
      <div>

        <label className="mb-2 block text-sm text-slate-400">Plan</label>
        
      <input value={user.subscription_plan} disabled className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-slate-400" />
      
      </div>
      <div className="md:col-span-2 flex justify-end"><button className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Save changes</button>
      </div>{message ? <p className="md:col-span-2 text-sm text-emerald-300">{message}</p> : null}</form> : <p className="text-slate-400">Loading profile...</p>}
      </MotionCard>
      </AppShell>;
}
