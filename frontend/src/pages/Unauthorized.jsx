import { Link } from 'react-router-dom';
export default function UnauthorizedPage() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Access denied</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-3 text-slate-600">
          You do not have permission to view this page.
        </p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
          Return to dashboard
        </Link>
      </div>
    </div>;
}
