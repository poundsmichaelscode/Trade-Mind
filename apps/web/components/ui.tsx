'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-wide text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function MotionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`card ${className}`}>
      {children}
    </motion.div>
  );
}

export function StatusPill({ value }: { value: string }) {
  const cls = value === 'win' ? 'bg-emerald-500/15 text-emerald-300' : value === 'loss' ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-500/15 text-slate-300';
  return <span className={`rounded-full px-3 py-1 text-xs capitalize ${cls}`}>{value}</span>;
}
