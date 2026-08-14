export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
