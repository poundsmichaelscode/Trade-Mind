export default function StatusPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">TradeMind / Phase 5</p>
        <h1 className="mt-3 text-4xl font-bold">Deployment & integration status</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {['Auth refresh flow','PostgreSQL-ready compose','Paystack verify scaffold','Cloudinary-ready uploads','Weekly summary queue','Resend-ready email service'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/30 p-5 text-slate-200">{item}</div>
          ))}
        </div>
      </div>
    </main>
  );
}
