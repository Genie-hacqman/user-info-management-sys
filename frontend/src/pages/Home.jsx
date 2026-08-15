import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/validation';
import authService from '@/services/authService';
import userService from '@/services/userService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Mail, Shield, Zap, Users } from 'lucide-react';
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
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    const loadUserCount = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setTotalUsers(0);
        return;
      }
      try {
        const response = await userService.getUsers();
        const users = Array.isArray(response) ? response : response.data || [];
        setTotalUsers(users.length);
      } catch (error) {
        console.error('Failed to load user count:', error);
        setTotalUsers(0);
      }
    };
    loadUserCount();
  }, []);
  const features = [{
    icon: Users,
    title: 'Create Account',
    description: 'Register with your email to get started in seconds'
  }, {
    icon: Lock,
    title: 'Secure Login',
    description: 'Access your account with encrypted credentials'
  }, {
    icon: Shield,
    title: 'Manage Profile',
    description: 'Update information and settings anytime'
  }, {
    icon: Zap,
    title: 'Stay Secure',
    description: 'Enterprise-grade security for your data'
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
        email: user.email || email,
        role: isAdmin ? 'admin' : 'user',
        avatar: (user.name || email).charAt(0).toUpperCase(),
        lastLogin: new Date().toISOString()
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
  return <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-blue-600 to-indigo-700 text-white">
          <div>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">SLY</h1>
                  <p className="text-sm text-blue-100">User Management System</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <p className="text-lg text-blue-100 leading-relaxed max-w-sm">
                Streamline your user management with a modern, secure, and intuitive platform designed for professionals.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, idx) => {
              const Icon = feature.icon;
              return <div key={idx} className="flex gap-4 group">
                    <div className="shrink-0 mt-1">
                      <Icon className="h-5 w-5 text-blue-200 group-hover:text-white transition" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-blue-100">{feature.description}</p>
                    </div>
                  </div>;
            })}
            </div>
          </div>

          <div className="text-sm text-blue-200">
            <p>© 2024 SLY. All rights reserved.</p>
          </div>
        </div>

        {}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="space-y-3">
                <CardTitle className="text-3xl">Welcome Back</CardTitle>
                <CardDescription>Sign in to access your account</CardDescription>
                <div className="pt-2 flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Users className="h-4 w-4" />
                  <span>{totalUsers} people have joined us</span>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {}
                  {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>}

                  {}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" />
                    </div>
                  </div>

                  {}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition">Remember me</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition">Sign in as Admin</span>
                    </label>
                  </div>

                  {}
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  {}
                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                    {loading ? <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Signing in...
                      </span> : 'Sign In'}
                  </Button>

                  {}
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition">
                        Create one
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {}
            <div className="text-center mt-8 lg:hidden">
              <p className="text-xs text-muted-foreground">© 2024 SLY</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
