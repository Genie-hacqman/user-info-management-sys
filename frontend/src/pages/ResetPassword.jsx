import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    token
  } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setSuccess('');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }
    setError('');
    setSuccess('Password reset successfully. Redirecting to login...');
    setTimeout(() => navigate('/'), 900);
  };
  return <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-slate-900">Reset password</h2>
      <p className="mt-2 text-sm text-slate-600">Set a new password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <PasswordInput label="New password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" error={error && !confirmPassword ? error : ''} />

        <PasswordInput label="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" error={error} />

        <p className="text-xs text-slate-500">Reset token: {token || 'missing'}</p>

        {success && <SuccessMessage message={success} />}
        {error && <ErrorMessage message={error} />}

        <Button type="submit" className="w-full">
          Reset password
        </Button>

        <p className="text-center text-sm text-slate-600">
          <Link to="/" className="font-medium text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>;
}
