export default function SuccessMessage({ message, children, className = '' }) {
  const content = message ?? children

  if (!content) return null

  return (
    <div
      role="status"
      className={`flex items-start gap-4 rounded-xl border-2 border-green-500/40 bg-[linear-gradient(135deg,rgba(20,83,45,0.25),rgba(4,120,13,0.12))] px-5 py-4 text-sm text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.15)] ${
        className
      }`}
    >
      <span className="shrink-0 text-2xl leading-none mt-0.5">✅</span>
      <span className="flex-1 font-medium">{content}</span>
    </div>
  )
}
