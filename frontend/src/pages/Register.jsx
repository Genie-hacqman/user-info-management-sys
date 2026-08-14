import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'
import { useAuth } from '../context/AuthContext'
import { getPasswordStrength, validateRegister } from '../utils/validation'
import authService from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const passwordStrength = getPasswordStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form data:', form)
    const nextErrors = validateRegister(form)
    console.log('Validation errors:', nextErrors)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      console.log('Validation failed, not submitting')
      return
    }
    console.log('Validation passed, submitting...')

    setIsLoading(true)
    setSubmitMessage('')
    setMessageType('')

    try {
      // Call backend register API
      const response = await authService.register({
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })

      // Registration successful - show success message
      setMessageType('success')
      setSubmitMessage('Registration successful! Redirecting to login...')

      // Redirect to login after a short delay
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      console.error('Registration error:', error.message)
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed. Please try again.'
      console.error('Error message:', errorMsg)
      setMessageType('error')
      setSubmitMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
      <p className="mt-2 text-sm text-slate-600">Join and manage your profile securely.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Full name"
          type="text"
          name="fullName"
          placeholder="Jane Doe"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Phone number"
          type="tel"
          name="phone"
          placeholder="+1 555 123 4567"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <div>
          <PasswordInput
            label="Password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          {form.password && (
            <p className="mt-2 text-xs text-slate-500">
              Password strength: <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
            </p>
          )}
        </div>

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {submitMessage && messageType === 'success' && (
          <SuccessMessage message={submitMessage} />
        )}

        {submitMessage && messageType === 'error' && (
          <ErrorMessage message={submitMessage} />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Register'}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
