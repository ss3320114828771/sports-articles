'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock authentication
      if (formData.email === 'sajid.syed@gmail.com' && formData.password === 'password123') {
        // Store user info in localStorage (in production, use secure cookies)
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          name: 'Hafiz Sajid Syed',
          email: 'sajid.syed@gmail.com',
          role: 'SUPER_ADMIN'
        }))
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else if (formData.email === 'john.doe@example.com' && formData.password === 'password123') {
        localStorage.setItem('user', JSON.stringify({
          id: '2',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'CUSTOMER'
        }))
        router.push('/dashboard')
      } else {
        setServerError('Invalid email or password')
      }
    } catch (err) {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4 animate-pulse text-4xl">
          🔐
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-gray-300">Login to your account</p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-center">{serverError}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 accent-green-500"
            />
            <span className="text-sm text-gray-300">Remember me</span>
          </label>
          <Link 
            href="/auth/forgot-password"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot Password?
          </Link>
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
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-8 p-4 bg-white/5 rounded-lg">
        <p className="text-sm text-gray-400 mb-2 text-center">Demo Credentials</p>
        <div className="space-y-1 text-xs text-gray-500">
          <p><span className="text-green-400">Admin:</span> sajid.syed@gmail.com / password123</p>
          <p><span className="text-blue-400">Customer:</span> john.doe@example.com / password123</p>
        </div>
      </div>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link 
            href="/auth/register"
            className="text-green-400 hover:text-green-300 font-semibold transition-colors"
          >
            Register Now
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