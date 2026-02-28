'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validate email
  const validateEmail = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    return newErrors
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateEmail()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setError('')
    setErrors({})

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, this would send a reset email
      console.log('Password reset email sent to:', email)
      
      setIsSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend
  const handleResend = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Resend logic here
    } catch (err) {
      setError('Failed to resend. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        {/* Bismillah */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white"
              style={{
                background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h2>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 animate-pulse text-4xl">
              🔐
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-300">
              {!isSubmitted 
                ? "Enter your email and we'll send you a reset link" 
                : "Check your email for the reset link"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {!isSubmitted ? (
            /* Email Form */
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) {
                        const newErrors = { ...errors }
                        delete newErrors.email
                        setErrors(newErrors)
                      }
                    }}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="space-y-6">
              <div className="bg-green-500/10 rounded-lg p-6 text-center">
                <div className="text-5xl mb-4">📧</div>
                <p className="text-green-400 font-semibold mb-2">Reset link sent!</p>
                <p className="text-gray-300 text-sm mb-4">
                  We've sent a password reset link to <br />
                  <span className="text-green-400 font-medium">{email}</span>
                </p>
                <p className="text-gray-400 text-xs">
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-green-400 hover:text-green-300 font-semibold"
                  >
                    resend
                  </button>
                </p>
              </div>

              {/* Back to Login */}
              <Link
                href="/auth/login"
                className="block text-center text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <Link
              href="/auth/login"
              className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              Remember your password? Login
            </Link>
            <Link
              href="/auth/register"
              className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              Don't have an account? Register
            </Link>
          </div>

          {/* Admin Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
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
      `}</style>
    </div>
  )
}