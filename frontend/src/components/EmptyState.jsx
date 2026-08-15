export default function EmptyState({
  icon = '📭',
  title = 'No data',
  description = 'Nothing to display yet.'
}) {
  return <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.1),rgba(6,182,212,0.05))] px-8 py-20 text-center shadow-[0_0_30px_rgba(34,211,238,0.12)]">
      <div className="text-7xl drop-shadow-lg mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-cyan-100">{title}</h3>
      <p className="mt-3 max-w-sm text-sm text-slate-300">{description}</p>
    </div>;
}
