export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-lg"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`w-full ${sizeMap[size] || sizeMap.md} rounded-2xl border-2 border-violet-500/30 bg-[linear-gradient(135deg,rgba(17,24,39,0.98),rgba(15,23,42,0.95))] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(139,92,246,0.2)] backdrop-blur-xl`}>
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 id="modal-title" className="text-2xl font-bold bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-white/10 bg-slate-900/50 p-2 text-slate-300 hover:bg-violet-500/20 hover:text-violet-200 hover:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
