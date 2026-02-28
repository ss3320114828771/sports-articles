'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  loadingText?: string
  leftIcon?: string
  rightIcon?: string
  fullWidth?: boolean
  href?: string
  target?: string
  rel?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  href,
  target,
  rel,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border-2 border-white/20 text-white hover:border-green-400 hover:text-green-400',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20',
    success: 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20'
  }

  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3'
  }

  // Icon sizes
  const iconSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  // Spinner sizes
  const spinnerSizes = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-3',
    xl: 'w-7 h-7 border-3'
  }

  const buttonClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-green-400/50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  // Loading spinner
  const Spinner = () => (
    <div
      className={`
        ${spinnerSizes[size]}
        border-current border-t-transparent
        rounded-full animate-spin
      `}
    />
  )

  const content = (
    <>
      {isLoading && <Spinner />}
      {leftIcon && !isLoading && (
        <span className={iconSizes[size]}>{leftIcon}</span>
      )}
      <span>
        {isLoading && loadingText ? loadingText : children}
      </span>
      {rightIcon && !isLoading && (
        <span className={iconSizes[size]}>{rightIcon}</span>
      )}
    </>
  )

  // Render as link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
      >
        {content}
      </Link>
    )
  }

  // Render as button
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  )
}