export default function ErrorMessage({ message, children, className = '' }) {
  const content = message ?? children

  if (!content) return null

  return (
    <div
      role="alert"
      className={`flex items-start gap-4 rounded-xl border-2 border-red-500/40 bg-[linear-gradient(135deg,rgba(127,29,29,0.25),rgba(153,27,27,0.12))] px-5 py-4 text-sm text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.15)] ${
        className
      }`}
    >
      <span className="shrink-0 text-2xl leading-none mt-0.5">⚠️</span>
      <span className="flex-1 font-medium">{content}</span>
    </div>
  )
}
