import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import PasswordInput from '../../components/PasswordInput'
import ErrorMessage from '../../components/ErrorMessage'
import SuccessMessage from '../../components/SuccessMessage'
import { useAuth } from '../../context/AuthContext'
import userService from '../../services/userService'
import { getPasswordStrength, validateChangePassword } from '../../utils/validation'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin'
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const strength = getPasswordStrength(form.newPassword)
  const strengthColors = {
    Weak: 'bg-red-500',
    Fair: 'bg-amber-500',
    Good: 'bg-blue-500',
    Strong: 'bg-emerald-500',
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAdmin) {
      setStatus({ type: 'error', message: 'Password resets must be approved by an administrator.' })
      return
    }

    const nextErrors = validateChangePassword(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) return

    setIsLoading(true)
    setStatus({ type: '', message: '' })

    try {
      await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })

      setStatus({ type: 'success', message: 'Password changed successfully.' })
      setTimeout(() => navigate('/dashboard/profile'), 800)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to change password.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Security</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Change password</h2>
      </div>

      {status.type === 'error' && <ErrorMessage message={status.message} className="mb-4" />}
      {status.type === 'success' && <SuccessMessage message={status.message} className="mb-4" />}

      {!isAdmin ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <h3 className="text-lg font-bold">Password changes require admin approval</h3>
          <p className="mt-2 text-sm text-amber-800">
            Regular users cannot change their password directly. Please contact an administrator to reset it for you.
          </p>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/profile')}>
              Back to profile
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput
            label="Current password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            placeholder="Current password"
          />

          <div>
            <PasswordInput
              label="New password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              placeholder="New password"
            />

            {form.newPassword && (
              <div className="mt-3 space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${strengthColors[strength.label] || 'bg-slate-300'}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600">
                  Password strength: <span className="font-semibold text-slate-700">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm password"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/profile')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update password'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
