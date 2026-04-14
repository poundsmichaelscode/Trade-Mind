'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { persistSessionCookies, registerUser, setAuthTokens } from '@/lib/api';

export default function SignupPage() {
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanName = full_name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (cleanName.length < 2) {
        throw new Error('Enter your full name.');
      }

      if (!cleanEmail) {
        throw new Error('Enter your email address.');
      }

      if (cleanPassword.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }

      const data = await registerUser(cleanName, cleanEmail, cleanPassword);

      if (!data?.access_token || !data?.refresh_token) {
        throw new Error('Signup succeeded but session tokens were not returned.');
      }

      setAuthTokens(data.access_token, data.refresh_token);
      await persistSessionCookies(data.access_token, data.refresh_token);

      window.location.assign('/');
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="grid-bg w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
        <div className="mb-6 text-center">
          <p className="font-display text-3xl font-bold tracking-[0.25em] text-white">TM</p>
          <h1 className="mt-3 font-display text-2xl text-white">Open Your Trading Desk</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create an account and start journaling.
          </p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <input
            required
            minLength={2}
            value={full_name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Full name"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-emerald-400"
          />

          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-emerald-400"
          />

          <input
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-emerald-400"
          />

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-300 hover:text-emerald-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}