'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { loginUser, persistSessionCookies, setAuthTokens } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Enter your email and password.');
      }
      const data = await loginUser(email.trim().toLowerCase(), password);
      setAuthTokens(data.access_token, data.refresh_token);
      await persistSessionCookies(data.access_token, data.refresh_token);
      window.location.assign('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return <div className="grid min-h-screen place-items-center px-4"><div className="grid-bg w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
    <div className="mb-6 text-center">
      <p className="font-display text-3xl font-bold tracking-[0.25em] text-white">TM</p>
      
      <h1 className="mt-3 font-display text-2xl text-white">TradeMind Login</h1>
      <p className="mt-2 text-sm text-slate-400">Access your trading desk.</p>
      </div>
      <form className="space-y-4" onSubmit={submit}>
        <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white" />
        
        <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white" />{error ? 
        <p className="text-sm text-rose-300">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70">{loading ? 'Signing in...' : 'Sign in'}
          </button></form><p className="mt-4 text-center text-sm text-slate-400">No account yet? 
            <Link href="/signup" className="text-emerald-300">Create one</Link></p>
            </div>
            </div>;
}
