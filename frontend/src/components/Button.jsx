export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  ...props
}) {
  const variants = {
    primary: 'bg-[linear-gradient(135deg,_#8b5cf6,_#3b82f6)] text-white shadow-lg shadow-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/60 active:brightness-90 focus:ring-violet-400 border border-violet-400/20',
    secondary: 'border-2 border-white/20 bg-slate-900/60 backdrop-blur text-slate-100 hover:bg-slate-800 hover:border-white/40 active:bg-slate-700 focus:ring-violet-400 shadow-md',
    danger: 'bg-[linear-gradient(135deg,_#ef4444,_#dc2626)] text-white shadow-lg shadow-red-500/40 hover:shadow-2xl hover:shadow-red-500/60 active:brightness-90 focus:ring-red-400 border border-red-400/20',
    ghost: 'text-violet-300 hover:bg-violet-500/15 hover:border hover:border-violet-500/40 active:bg-violet-500/25 focus:ring-violet-400 border border-transparent hover:border-violet-500/30',
    success: 'bg-[linear-gradient(135deg,_#22c55e,_#16a34a)] text-white shadow-lg shadow-green-500/40 hover:shadow-2xl hover:shadow-green-500/60 active:brightness-90 focus:ring-green-400 border border-green-400/20',
    warning: 'bg-[linear-gradient(135deg,_#f59e0b,_#d97706)] text-white shadow-lg shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/60 active:brightness-90 focus:ring-amber-400 border border-amber-400/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${
        sizes[size] || sizes.md
      } ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {icon && <span className="text-lg leading-none">{icon}</span>}
      {children}
    </button>
  )
}
