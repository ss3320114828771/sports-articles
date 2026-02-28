'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful registration
      router.push('/auth/login?registered=true')
    } catch (err) {
      setErrors({ form: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rgb-button {
          background: linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff);
          background-size: 300% 300%;
          animation: gradient-shift 3s infinite;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md">
        {/* Bismillah at top */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold"
              style={{
                background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'rgb-pulse 3s infinite'
              }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h2>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4 animate-pulse text-4xl">
              📝
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Join Sports Elite today</p>
          </div>

          {/* Form Error */}
          {errors.form && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm text-center">{errors.form}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Full Name</label>
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
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
              <label className="block text-gray-300 mb-1 text-sm">Email Address</label>
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
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
              <label className="block text-gray-300 mb-1 text-sm">Phone Number</label>
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
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
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
              <label className="block text-gray-300 mb-1 text-sm">Password</label>
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
                  className={`w-full pl-10 pr-12 py-2.5 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
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
              <p className="text-gray-500 text-xs mt-1">
                Min 8 chars with uppercase, lowercase & number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Confirm Password</label>
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
                  className={`w-full pl-10 pr-12 py-2.5 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors ${
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
              <label className="flex items-start space-x-2">
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
                <p className="text-red-400 text-xs mt-1">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rgb-button py-3 text-lg font-semibold rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Register'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
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
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-gray-400">
              Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Add RGB animation style */}
      <style jsx>{`
        @keyframes rgb-pulse {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(360deg); }
        }
        .rgb-button {
          background: linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff);
          background-size: 300% 300%;
          animation: gradient-shift 3s infinite;
        }
      `}</style>
    </div>
  )
}