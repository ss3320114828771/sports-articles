'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false)
        return
      }

      try {
        // Simulate token validation
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock token validation - in production, call your API
        if (token === 'invalid-token') {
          setIsValidToken(false)
        }
      } catch (err) {
        setIsValidToken(false)
      }
    }

    validateToken()
  }, [token])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear field error when user types
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
    
    // Clear server error when user types
    if (serverError) {
      setServerError('')
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setServerError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock password reset - in production, call your API
      if (token === 'expired-token') {
        setServerError('Reset link has expired. Please request a new one.')
      } else {
        setResetSuccess(true)
      }
    } catch (err) {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-red-400 to-orange-500 mb-4 text-4xl">
            ⚠️
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Invalid Reset Link</h1>
          <p className="text-gray-300">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className="bg-red-500/10 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">
            Please request a new password reset link.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
          >
            Request New Link
          </Link>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Admin Info */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </div>
    )
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4 text-4xl">
            ✅
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Password Reset!</h1>
          <p className="text-gray-300">
            Your password has been successfully reset.
          </p>
        </div>

        <div className="bg-green-500/10 rounded-lg p-6 text-center">
          <p className="text-green-400 mb-4">
            You can now log in with your new password.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
          >
            Go to Login
          </Link>
        </div>

        {/* Admin Info */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 text-4xl">
          🔐
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-300">Enter your new password below</p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-center">{serverError}</p>
        </div>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Field */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            New Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔒
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
                errors.password ? 'border-red-500' : 'border-white/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-xl"
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            Password must be at least 8 characters with uppercase, lowercase and number
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Confirm New Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔐
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
                errors.confirmPassword ? 'border-red-500' : 'border-white/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-xl"
            >
              {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Resetting Password...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Login
        </Link>
      </div>

      {/* Admin Info */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-gray-400">
          Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
      </div>
    </div>
  )
}