export default function Input({
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return <div className="w-full">
      {label && <label htmlFor={inputId} className="mb-2.5 block text-sm font-semibold text-slate-200">
          {label}
          {required && <span className="ml-1 text-red-400" aria-label="required">*</span>}
        </label>}
      <input id={inputId} type={type} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition focus:ring-2 ${error ? 'border-red-500/50 bg-red-500/10 text-red-100 placeholder:text-red-300/50 focus:border-red-400 focus:ring-red-400/30' : 'border-white/15 bg-slate-900/80 text-white placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-400/30 focus:bg-slate-900'} disabled:bg-slate-900/50 disabled:text-slate-400 disabled:cursor-not-allowed ${className}`} {...props} />
      {error && <p id={`${inputId}-error`} className="mt-2 text-xs font-bold text-red-300">
          ⚠️ {error}
        </p>}
    </div>;
}
