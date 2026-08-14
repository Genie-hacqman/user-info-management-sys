import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import ErrorMessage from '../../components/ErrorMessage'
import SuccessMessage from '../../components/SuccessMessage'
import { useAuth } from '../../context/AuthContext'
import userService from '../../services/userService'
import { validateProfile } from '../../utils/validation'

const notifyUserDataUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sly-user-data-updated'))
  }
}

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  useEffect(() => {
    setForm({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateProfile(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) return

    setIsLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const payload = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      }

      const { data } = await userService.updateProfile(payload)
      const nextUser = {
        ...user,
        ...data,
        fullName: data.fullName || data.name || form.fullName.trim(),
        name: data.name || form.fullName.trim(),
        email: data.email || form.email.trim(),
        phone: data.phone || form.phone.trim(),
      }

      setUser(nextUser)
      notifyUserDataUpdated()
      setStatus({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to update profile.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Account</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Edit profile</h2>
      </div>

      {status.type === 'error' && <ErrorMessage message={status.message} className="mb-4" />}
      {status.type === 'success' && <SuccessMessage message={status.message} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/profile')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
