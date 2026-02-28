'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: string
  rightIcon?: string
  onRightIconClick?: () => void
  fullWidth?: boolean
  variant?: 'default' | 'filled' | 'outline'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    onRightIconClick,
    fullWidth = false,
    variant = 'default',
    className = '',
    type = 'text',
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    // Determine input type for password visibility toggle
    const inputType = type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type

    // Variant styles
    const variantStyles = {
      default: 'bg-white/10 border border-white/20 focus:border-green-400',
      filled: 'bg-white/5 border-transparent focus:bg-white/10 focus:border-green-400',
      outline: 'bg-transparent border-2 border-white/20 focus:border-green-400'
    }

    // State styles
    const stateStyles = error
      ? 'border-red-500 focus:border-red-500'
      : disabled
        ? 'opacity-50 cursor-not-allowed'
        : ''

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div
          className={`
            relative flex items-center
            rounded-lg transition-all duration-200
            ${variantStyles[variant]}
            ${stateStyles}
            ${isFocused ? 'ring-2 ring-green-400/20' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
        >
          {/* Left Icon */}
          {leftIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={`
              w-full bg-transparent text-white placeholder-gray-500
              outline-none
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon || type === 'password' ? 'pr-10' : 'pr-4'}
              py-2.5
              ${disabled ? 'cursor-not-allowed' : ''}
              ${className}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right Icon / Password Toggle */}
          {type === 'password' ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          ) : rightIcon ? (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 text-gray-400 hover:text-white transition-colors"
              disabled={!onRightIconClick}
            >
              {rightIcon}
            </button>
          ) : null}
        </div>

        {/* Error / Hint Message */}
        {error && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input