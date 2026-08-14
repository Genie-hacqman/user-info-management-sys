export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  isLoading = false,
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-lg"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className={`w-full max-w-md rounded-2xl border-2 p-7 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl ${
        destructive
          ? 'border-red-500/40 bg-[linear-gradient(135deg,rgba(127,29,29,0.15),rgba(153,27,27,0.08))]'
          : 'border-cyan-500/40 bg-[linear-gradient(135deg,rgba(34,211,238,0.1),rgba(6,182,212,0.05))]'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{destructive ? '⚠️' : '❓'}</span>
          <h3 id="confirm-title" className={`text-xl font-bold ${
            destructive ? 'text-red-200' : 'text-cyan-200'
          }`}>
            {title}
          </h3>
        </div>
        <p id="confirm-message" className="text-slate-300 leading-relaxed ml-12">
          {message}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border-2 border-white/15 bg-slate-900/50 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-white/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm?.()
              onClose?.()
            }}
            disabled={isLoading}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
              destructive
                ? 'bg-[linear-gradient(135deg,#ef4444,#dc2626)] shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 focus:ring-red-400'
                : 'bg-[linear-gradient(135deg,#06b6d4,#0891b2)] shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 focus:ring-cyan-400'
            }`}
          >
            {isLoading ? '⟳ Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
