export default function PageHeader({
  pretitle,
  title,
  description,
  children,
  icon
}) {
  return <div className="mb-8 rounded-2xl border-2 border-violet-500/20 bg-[linear-gradient(135deg,rgba(139,92,246,0.1),rgba(59,130,246,0.05))] px-6 py-8 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
      <div className="flex items-center justify-between">
        <div>
          {pretitle && <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-300 mb-3">
              {pretitle}
            </p>}
          {title && <h1 className="flex items-center gap-4 text-3xl font-bold bg-[linear-gradient(135deg,#fff,#cbd5e1)] bg-clip-text text-transparent">
            {icon && <span className="text-5xl drop-shadow-lg">{icon}</span>}
            {title}
          </h1>}
          {description && <p className="mt-3 text-base text-slate-200 max-w-2xl">{description}</p>}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>;
}
