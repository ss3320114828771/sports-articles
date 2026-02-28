'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  hover?: boolean
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  className?: string
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

interface CardImageProps {
  src: string
  alt: string
  position?: 'top' | 'bottom' | 'cover'
  height?: string
  className?: string
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'lg',
  hover = false,
  href,
  target,
  rel,
  onClick,
  className = ''
}: CardProps) {
  // Variant styles
  const variantStyles = {
    default: 'bg-white/10 backdrop-blur-lg border border-white/20',
    elevated: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl',
    outlined: 'bg-transparent border-2 border-white/20',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10'
  }

  // Padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7'
  }

  // Radius styles
  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-3xl'
  }

  // Hover styles
  const hoverStyles = hover
    ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-green-400'
    : ''

  const cardClasses = `
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${radiusStyles[radius]}
    ${hoverStyles}
    overflow-hidden
    ${className}
  `

  const content = <div className={cardClasses}>{children}</div>

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className="block"
        onClick={onClick}
      >
        {content}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="block w-full text-left"
      >
        {content}
      </button>
    )
  }

  return content
}

// Card Header Component
Card.Header = function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-white/10 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  )
}

// Card Body Component
Card.Body = function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Card Footer Component
Card.Footer = function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`border-t border-white/10 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  )
}

// Card Image Component
Card.Image = function CardImage({
  src,
  alt,
  position = 'cover',
  height = 'h-48',
  className = ''
}: CardImageProps) {
  const positionStyles = {
    top: 'object-top',
    bottom: 'object-bottom',
    cover: 'object-cover'
  }

  return (
    <div className={`relative ${height} w-full overflow-hidden`}>
      {/* Placeholder until actual images are implemented */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20
        flex items-center justify-center text-4xl
        ${positionStyles[position]}
        ${className}
      `}>
        📷
      </div>
    </div>
  )
}