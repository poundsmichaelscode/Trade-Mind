'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function EquityChart({ data }: { data: { name: string; value: number }[] }) {
  return <div className="h-72 w-full">
    <ResponsiveContainer><AreaChart data={data}>
    <defs>
    <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
  </linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} /><XAxis dataKey="name" stroke="#94a3b8" />
  <YAxis stroke="#94a3b8" /><Tooltip />
  <Area type="monotone" dataKey="value" stroke="#22c55e" fill="url(#equityFill)" strokeWidth={3} /></AreaChart>
  </ResponsiveContainer></div>;
}

export function MonthlyChart({ data }: { data: { name: string; pnl: number }[] }) {
  return <div className="h-72 w-full"><ResponsiveContainer><BarChart data={data}><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
  <XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip />
  <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>{data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />)}</Bar>
  </BarChart></ResponsiveContainer></div>;
}

export function WinLossChart({ data }: { data: { name: string; value: number }[] }) {
  return <div className="h-72 w-full"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={105} innerRadius={60}>{data.map((entry, idx) => <Cell key={entry.name + idx} fill={idx === 0 ? '#22c55e' : '#ef4444'} />)}</Pie>
  <Tooltip />
  </PieChart>
  </ResponsiveContainer>
  </div>;
}
