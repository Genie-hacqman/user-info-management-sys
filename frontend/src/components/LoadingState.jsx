import LoadingSpinner from './LoadingSpinner';
export default function LoadingState({
  message = 'Loading...'
}) {
  return <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-16 text-center shadow-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 font-medium text-slate-900">{message}</p>
      <p className="mt-2 text-sm text-slate-600">Please wait while we fetch your data.</p>
    </div>;
}
