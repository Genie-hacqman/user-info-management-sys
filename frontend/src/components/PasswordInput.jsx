import { useState } from 'react'

export default function PasswordInput({
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-600" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition focus:ring-2 ${
            error
              ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-200'
              : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
          } disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            className
          }`}
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
