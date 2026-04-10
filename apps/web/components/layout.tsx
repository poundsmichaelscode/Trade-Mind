'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart3, Bell, BrainCircuit, CreditCard, History, LayoutDashboard, LogIn, LogOut, Menu, PlusSquare, UserCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch, clearAuth, clearSessionCookies, getToken, NotificationItem, User } from '@/lib/api';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trade/new', label: 'Add Trade', icon: PlusSquare },
  { href: '/history', label: 'History', icon: History },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/insights', label: 'Insights', icon: BrainCircuit },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
  { href: '/profile', label: 'Profile', icon: UserCircle2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    const publicRoutes = ['/login', '/signup'];
    if (!token && !publicRoutes.includes(pathname)) {
      router.push('/login');
      return;
    }
    if (token) {
      Promise.all([apiFetch<User>('/auth/me'), apiFetch<NotificationItem[]>('/notifications').catch(() => [])])
        .then(([u, n]) => { setUser(u); setNotifications(n); })
        .catch(async () => { clearAuth(); await clearSessionCookies(); if (!publicRoutes.includes(pathname)) router.push('/login'); });
    }
  }, [pathname, router]);

  const logout = async () => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('tm_refresh_token') : null;
    try {
      if (refreshToken) await apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) });
    } catch {}
    clearAuth();
    await clearSessionCookies();
    router.push('/login');
  };
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 bg-black/20 lg:block"><Sidebar pathname={pathname} /></aside>
      <AnimatePresence>{open ? <motion.div className="fixed inset-0 z-50 bg-black/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="h-full w-[82%] max-w-xs border-r border-white/10 bg-slate-950 p-4" initial={{ x: -40 }} animate={{ x: 0 }} exit={{ x: -40 }}><div className="mb-4 flex items-center justify-between"><Brand /><button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2"><X size={18} /></button></div><Sidebar pathname={pathname} onNavigate={() => setOpen(false)} /></motion.div></motion.div> : null}</AnimatePresence>
      <main>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="rounded-xl border border-white/10 p-2 lg:hidden"><Menu size={18} /></button>
              <div><p className="font-display text-xl font-bold tracking-wide">TradeMind</p><p className="text-xs text-slate-400">Smart trading journal & analytics</p></div>
            </div>
            <div className="relative flex items-center gap-3">
              <button onClick={() => setShowNotifications((s) => !s)} className="relative rounded-2xl border border-white/10 bg-white/5 p-2"><Bell size={18} />{unreadCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unreadCount}</span> : null}</button>
              {showNotifications ? <div className="absolute right-0 top-12 z-20 w-[320px] rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl"><p className="mb-2 px-2 text-xs uppercase tracking-[0.3em] text-emerald-400">Notifications</p><div className="max-h-80 space-y-2 overflow-auto">{notifications.length ? notifications.map((n) => <div key={n.id} className={`rounded-2xl border p-3 text-sm ${n.read ? 'border-white/10 bg-white/[0.03]' : 'border-emerald-500/20 bg-emerald-500/10'}`}><p className="font-semibold text-white">{n.title}</p><p className="mt-1 text-slate-300">{n.body}</p></div>) : <p className="px-2 py-6 text-sm text-slate-400">No notifications yet.</p>}</div></div> : null}
              {user ? <><div className={`rounded-2xl border px-3 py-2 text-sm ${user.subscription_plan === 'pro' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-200'}`}>{user.subscription_plan === 'pro' ? 'Pro Trader' : 'Free Plan'}</div><button onClick={logout} className="rounded-2xl border border-white/10 bg-white/5 p-2"><LogOut size={18} /></button></> : <Link href="/login" className="rounded-2xl border border-white/10 bg-white/5 p-2"><LogIn size={18} /></Link>}
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        <footer className="px-4 pb-8 pt-2 text-center text-sm text-slate-400 sm:px-6 lg:px-8">Created by <span className="font-semibold text-emerald-300">Pounds Michaels Digitals</span></footer>
      </main>
    </div>
  );
}

function Brand() { return <div><div className="font-display text-2xl font-bold tracking-[0.2em] text-white">TM</div><div className="text-xs uppercase tracking-[0.35em] text-emerald-400">TradeMind</div></div>; }

function Sidebar({ onNavigate, pathname }: { onNavigate?: () => void; pathname: string }) {
  return <div className="flex h-full flex-col p-5"><div className="mb-8 hidden lg:block"><Brand /></div><nav className="space-y-2">{nav.map((item) => { const Icon = item.icon; const active = pathname === item.href; return <Link key={item.href} href={item.href} onClick={onNavigate} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${active ? 'border-emerald-500/30 bg-emerald-500/10 text-white' : 'border-white/5 bg-white/[0.03] text-slate-200 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-white'}`}><Icon size={18} /><span>{item.label}</span></Link>; })}</nav><div className="mt-auto rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">Trade with discipline. Journal with detail. Review like a prop desk.</div></div>;
}
