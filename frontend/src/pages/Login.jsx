import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validation';
export default function Login() {
  const navigate = useNavigate();
  const {
    login,
    setLoading
  } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
    isAdmin: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const handleChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsLoading(true);
    setLoading(true);
    setSubmitError('');
    try {
      const role = form.isAdmin ? 'admin' : 'user';
      const dashboardPath = form.isAdmin ? '/admin' : '/dashboard';
      login({
        id: 1,
        fullName: form.isAdmin ? 'Admin User' : 'Demo User',
        name: form.isAdmin ? 'Admin User' : 'Demo User',
        email: form.email,
        phone: '+1 (555) 987-6543',
        role: role,
        status: 'Active',
        createdAt: '2024-01-12T00:00:00.000Z',
        lastLogin: new Date().toISOString()
      });
      navigate(dashboardPath);
    } catch (error) {
      setSubmitError(error.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };
  return <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-slate-900">Login</h2>
      <p className="mt-2 text-sm text-slate-600">Access your account to continue.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input label="Email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} />

        <PasswordInput label="Password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} error={errors.password} />

        {submitError && <ErrorMessage message={submitError} />}

        <label className="inline-flex items-center gap-2 text-slate-600">
          <input type="checkbox" name="isAdmin" checked={form.isAdmin} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          Sign in as Admin
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600">
            <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Remember me
          </label>

          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>;
}
