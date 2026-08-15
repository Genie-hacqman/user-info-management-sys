import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validation';
import authService from '../services/authService';
export default function Home() {
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const features = [{
    icon: '�',
    title: 'Create Your Account',
    description: 'Register with your email and create a secure password to get started'
  }, {
    icon: '🔓',
    title: 'Login Anytime',
    description: 'Sign in with your credentials to access your personal dashboard'
  }, {
    icon: '👤',
    title: 'Manage Profile',
    description: 'Update your profile information and change your password anytime'
  }, {
    icon: '⚙️',
    title: 'Customizable Settings',
    description: 'Personalize your account with your preferred settings'
  }, {
    icon: '🛡️',
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with industry-standard security'
  }];
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    try {
      const response = await authService.login({
        email,
        password
      });
      const {
        token,
        user
      } = response.data;
      localStorage.setItem('authToken', token);
      const userData = {
        ...user,
        id: user.id || user._id,
        name: user.name || user.fullName || email.split('@')[0],
        role: isAdmin ? 'admin' : 'user',
        avatar: (user.name || email).charAt(0).toUpperCase()
      };
      login(userData);
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.20),_transparent_25%),linear-gradient(180deg,_#020817_0%,_#0f172a_100%)]">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[linear-gradient(135deg,_rgba(124,58,237,0.96),_rgba(59,130,246,0.9),_rgba(15,23,42,0.95))] px-12 py-16 text-white shadow-2xl shadow-violet-900/20">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg shadow-violet-500/20 backdrop-blur-sm">
              🔐
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sly Management</h1>
              <p className="text-violet-100 text-sm">System</p>
            </div>
          </div>

          <p className="mb-12 max-w-md text-base leading-relaxed text-violet-100/90">
            Welcome to our secure user management platform. Easily create an account, manage your profile, and keep your data safe with industry-leading security.
          </p>

          <div className="space-y-8">
            {features.map((feature, idx) => <div key={idx} className="flex gap-4">
                <div className="shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-base">{feature.title}</h3>
                  <p className="mt-1 text-sm text-violet-100/80">{feature.description}</p>
                </div>
              </div>)}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100/85">Quick Steps</p>
          <div className="space-y-2 text-sm text-violet-50">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-400/30 shrink-0 text-xs font-bold">1</span>
              <span>Create a new account if you don't have one</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-400/30 shrink-0 text-xs font-bold">2</span>
              <span>Sign in with your email and password</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-400/30 shrink-0 text-xs font-bold">3</span>
              <span>Access your dashboard and manage your account</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:p-8">
          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
              Welcome
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
            <p className="mt-2 text-slate-300">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-200">{error}</p>
              </div>}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                Email address
              </label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20" />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-400 bg-slate-950" />
                <span className="text-sm text-slate-300">Remember me</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="h-4 w-4 rounded border-slate-400 bg-slate-950" />
                <span className="text-sm text-slate-300">Sign in as Admin</span>
              </label>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-violet-300 hover:text-violet-200">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-violet-300 hover:text-violet-200">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
}
