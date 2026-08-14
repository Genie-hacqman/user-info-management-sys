import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isValidEmail } from '../utils/validation'
import authService from '../services/authService'

export default function Home() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const features = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Register with your email to get started in seconds',
    },
    {
      number: '02',
      title: 'Secure Login',
      description: 'Access your account with encrypted credentials',
    },
    {
      number: '03',
      title: 'Manage Profile',
      description: 'Update information and settings anytime',
    },
    {
      number: '04',
      title: 'Stay Secure',
      description: 'Enterprise-grade security for your data',
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await authService.login({ email, password })
      const { token, user } = response.data

      localStorage.setItem('authToken', token)

      const userData = {
        ...user,
        id: user.id || user._id,
        name: user.name || user.fullName || email.split('@')[0],
        email: user.email || email,
        role: isAdmin ? 'admin' : 'user',
        avatar: (user.name || email).charAt(0).toUpperCase(),
        lastLogin: new Date().toISOString(),
      }

      login(userData)
      navigate(isAdmin ? '/admin' : '/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Section - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16">
          <div>
            <div className="mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-2 bg-linear-to-br from-violet-500 to-blue-500 rounded-lg">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">UserHub</h1>
                  <p className="text-sm text-slate-400">Professional Management System</p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <p className="text-lg text-slate-300 leading-relaxed max-w-sm">
                Streamline your user management with a modern, secure, and intuitive platform designed for professionals.
              </p>
            </div>

            <div className="space-y-12">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
                      <span className="text-sm font-bold text-violet-300">{feature.number}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-slate-500">
            <p>© 2024 UserHub. All rights reserved.</p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {/* Form Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">Sign in to access your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 outline-none transition duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 outline-none transition duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 cursor-pointer accent-violet-500"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-slate-200 transition">Remember me</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 cursor-pointer accent-violet-500"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-slate-200 transition">Sign in as Admin</span>
                </label>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300 transition font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-violet-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-2">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition">
                    Create one
                  </Link>
                </p>
              </div>
            </form>

            {/* Mobile Footer */}
            <div className="text-center mt-8 lg:hidden">
              <p className="text-xs text-slate-500">© 2024 UserHub</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
