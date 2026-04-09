'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout';
import { MotionCard, SectionHeader } from '@/components/ui';
import { apiFetch, apiBase, uploadTradeImage } from '@/lib/api';

const initial = { asset: '', direction: 'buy', market_type: 'forex', entry_price: '', exit_price: '', position_size: '', stop_loss: '', take_profit: '', open_time: '', close_time: '', session_tag: 'London', setup_tag: '', notes: '', image_url: '' };

function Field({ label, name, value, onChange, type = 'text' }: any) {
  return <div><label className="mb-2 block text-sm text-slate-400">{label}</label><input name={name} value={value} onChange={onChange} type={type} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500/40" /></div>;
}

export default function NewTradePage() {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const onChange = (e: any) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError('');
    try {
      const res = await uploadTradeImage(file);
      setForm((s) => ({ ...s, image_url: `${apiBase()}${res.url}` }));
    } catch (err: any) { setError(err.message); } finally { setUploading(false); }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await apiFetch('/trades', { method: 'POST', body: JSON.stringify({ ...form, entry_price: Number(form.entry_price), exit_price: Number(form.exit_price), position_size: Number(form.position_size), stop_loss: form.stop_loss ? Number(form.stop_loss) : null, take_profit: form.take_profit ? Number(form.take_profit) : null }) });
      router.push('/history');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return <AppShell><SectionHeader title="Log New Trade" subtitle="Capture setup, execution, risk, screenshot evidence, and reasoning." /><MotionCard className="p-6"><form onSubmit={submit}><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Field label="Asset" name="asset" value={form.asset} onChange={onChange} /><div><label className="mb-2 block text-sm text-slate-400">Direction</label><select name="direction" value={form.direction} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white"><option value="buy">Buy</option><option value="sell">Sell</option></select></div><div><label className="mb-2 block text-sm text-slate-400">Market Type</label><select name="market_type" value={form.market_type} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white"><option value="forex">Forex</option><option value="crypto">Crypto</option><option value="indices">Indices</option></select></div><Field label="Entry Price" name="entry_price" value={form.entry_price} onChange={onChange} type="number" /><Field label="Exit Price" name="exit_price" value={form.exit_price} onChange={onChange} type="number" /><Field label="Position Size" name="position_size" value={form.position_size} onChange={onChange} type="number" /><Field label="Stop Loss" name="stop_loss" value={form.stop_loss} onChange={onChange} type="number" /><Field label="Take Profit" name="take_profit" value={form.take_profit} onChange={onChange} type="number" /><Field label="Open Time" name="open_time" value={form.open_time} onChange={onChange} type="datetime-local" /><Field label="Close Time" name="close_time" value={form.close_time} onChange={onChange} type="datetime-local" /><Field label="Session" name="session_tag" value={form.session_tag} onChange={onChange} /><Field label="Strategy Tag" name="setup_tag" value={form.setup_tag} onChange={onChange} /></div><div className="mt-4"><label className="mb-2 block text-sm text-slate-400">Notes</label><textarea name="notes" value={form.notes} onChange={onChange} rows={5} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500/40" /></div><div className="mt-4 grid gap-4 md:grid-cols-2"><div><label className="mb-2 block text-sm text-slate-400">Upload Screenshot</label><input onChange={handleFile} type="file" accept="image/*" className="w-full rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-slate-300" />{uploading ? <p className="mt-2 text-sm text-emerald-300">Uploading chart screenshot...</p> : null}</div><div><label className="mb-2 block text-sm text-slate-400">Screenshot URL</label><input name="image_url" value={form.image_url} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white" placeholder="https://..." />{form.image_url ? <a className="mt-2 inline-block text-sm text-emerald-300 underline" href={form.image_url} target="_blank">Preview uploaded screenshot</a> : null}</div></div>{error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setForm(initial)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-white">Reset</button><button disabled={loading} className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">{loading ? 'Creating...' : 'Create Trade'}</button></div></form></MotionCard></AppShell>;
}
