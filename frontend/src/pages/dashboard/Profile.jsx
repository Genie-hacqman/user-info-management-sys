import { Link } from 'react-router-dom';
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaShieldAlt, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
const localeMap = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  Arabic: 'ar-EG'
};
const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('sly-user-settings') || '{}');
  } catch {
    return {};
  }
};
const formatWithPreferences = (value, options = {}) => {
  const settings = getSettings();
  const locale = localeMap[settings.language] || 'en-US';
  const timeZone = settings.timezone || 'UTC';
  if (!value) return 'N/A';
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    ...options
  }).format(new Date(value));
};
export default function ProfilePage() {
  const {
    user,
    logout
  } = useAuth();
  const profileCompletion = Math.min(100, Math.round([user?.fullName, user?.email, user?.phone].filter(Boolean).length / 3 * 100));
  return <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-violet-500/40 bg-[linear-gradient(135deg,rgba(139,92,246,0.15),rgba(59,130,246,0.1))] text-5xl shadow-lg shadow-violet-500/20">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Profile</p>
              <h2 className="mt-2 text-4xl font-bold text-white">{user?.fullName || user?.name || 'User'}</h2>
              <p className="mt-1 text-sm text-slate-300 capitalize">{user?.role || 'user'} Account</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard/edit-profile">
              <Button variant="secondary">Edit Profile</Button>
            </Link>
            <Link to="/dashboard/change-password">
              <Button variant="secondary">Change Password</Button>
            </Link>
            <Button variant="danger" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-[0_0_40px_rgba(59,130,246,0.1)] backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🔐 Account details
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
              <span className="text-blue-300 text-lg">📧</span>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-white font-semibold mt-1">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
              <span className="text-cyan-300 text-lg">📞</span>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Phone</p>
                <p className="text-white font-semibold mt-1">{user?.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <span className="text-amber-300 text-lg">🛡️</span>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Role</p>
                <p className="text-white font-semibold mt-1 capitalize">{user?.role || 'user'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <span className="text-emerald-300 text-lg">📅</span>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Member Since</p>
                <p className="text-white font-semibold mt-1">{user?.createdAt ? formatWithPreferences(user.createdAt, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/5 p-4">
              <span className="text-green-300 text-lg">✅</span>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status</p>
                <p className="text-white font-semibold mt-1">{user?.status || 'Active'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-[0_0_40px_rgba(168,85,247,0.1)] backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📊 Profile summary
          </h3>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border-2 border-amber-500/40 bg-[linear-gradient(135deg,rgba(245,158,11,0.1),rgba(217,119,6,0.05))] p-5">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Account role</p>
              <p className="mt-3 font-bold text-amber-100 capitalize text-lg">{user?.role || 'user'}</p>
            </div>
            <div className="rounded-xl border-2 border-emerald-500/40 bg-[linear-gradient(135deg,rgba(34,197,94,0.1),rgba(22,163,74,0.05))] p-5">
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Status</p>
              <p className="mt-3 font-bold text-emerald-100 text-lg">{user?.status || 'Active'}</p>
            </div>
            <div className="rounded-xl border-2 border-violet-500/40 bg-[linear-gradient(135deg,rgba(139,92,246,0.1),rgba(109,40,217,0.05))] p-5">
              <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">Profile completion</p>
              <p className="mt-3 font-bold text-violet-100 text-lg">{profileCompletion}%</p>
              <div className="mt-3 h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full bg-[linear-gradient(90deg,#8b5cf6,#3b82f6)] transition-all duration-500" style={{
                width: `${profileCompletion}%`
              }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
