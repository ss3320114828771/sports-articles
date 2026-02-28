'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Invalid phone number (10 digits required)'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
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

      // Mock registration - in production, this would call your API
      if (formData.email === 'existing@example.com') {
        setServerError('Email already registered')
      } else {
        // Success - show success message and redirect after delay
        setRegistrationSuccess(true)
        setTimeout(() => {
          router.push('/auth/login?registered=true')
        }, 3000)
      }
    } catch (err) {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4 text-4xl">
            ✅
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Registration Successful!</h1>
          <p className="text-gray-300">
            Your account has been created successfully.
          </p>
        </div>

        <div className="bg-green-500/10 rounded-lg p-6 text-center">
          <p className="text-green-400 mb-4">
            Please check your email to verify your account.
          </p>
          <p className="text-gray-300 text-sm mb-4">
            Redirecting to login page in 3 seconds...
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4 text-4xl">
          📝
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-300">Join Sports Elite today</p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-center">{serverError}</p>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              👤
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
                errors.name ? 'border-red-500' : 'border-white/20'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ✉️
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sajid.syed@gmail.com"
              className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
                errors.email ? 'border-red-500' : 'border-white/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              📱
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
                errors.phone ? 'border-red-500' : 'border-white/20'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Password <span className="text-red-400">*</span>
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
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Confirm Password <span className="text-red-400">*</span>
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

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-1 accent-green-500"
            />
            <span className="text-sm text-gray-300">
              I accept the{' '}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-red-400 text-xs mt-2">{errors.acceptTerms}</p>
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
              Creating Account...
            </span>
          ) : (
            'Register'
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link 
            href="/auth/login"
            className="text-green-400 hover:text-green-300 font-semibold transition-colors"
          >
            Login Here
          </Link>
        </p>
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