import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import SuccessMessage from '../components/SuccessMessage'
import ErrorMessage from '../components/ErrorMessage'
import { isValidEmail } from '../utils/validation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      setMessage('')
      return
    }

    setError('')
    setMessage('Password reset instructions have been sent to your email.')
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-slate-900">Forgot password</h2>
      <p className="mt-2 text-sm text-slate-600">Enter your email and we’ll send you a reset link.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          error={error}
        />

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <Button type="submit" className="w-full">
          Send reset link
        </Button>

        <p className="text-center text-sm text-slate-600">
          <Link to="/" className="font-medium text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  )
}
