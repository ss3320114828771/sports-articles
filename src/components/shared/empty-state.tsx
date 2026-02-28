'use client'

import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  secondaryActionLabel?: string
  secondaryActionHref?: string
  onSecondaryAction?: () => void
  illustration?: 'cart' | 'wishlist' | 'search' | 'orders' | 'products' | 'custom'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function EmptyState({
  title = 'Nothing to see here',
  message = 'There are no items to display at the moment.',
  icon = '📭',
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  illustration = 'custom',
  size = 'md',
  className = ''
}: EmptyStateProps) {
  // Get illustration based on type
  const getIllustration = () => {
    switch (illustration) {
      case 'cart':
        return {
          icon: '🛒',
          emojis: ['📦', '🛍️', '💫']
        }
      case 'wishlist':
        return {
          icon: '❤️',
          emojis: ['💝', '✨', '⭐']
        }
      case 'search':
        return {
          icon: '🔍',
          emojis: ['🔎', '📱', '💻']
        }
      case 'orders':
        return {
          icon: '📦',
          emojis: ['🚚', '📋', '✅']
        }
      case 'products':
        return {
          icon: '🏷️',
          emojis: ['💎', '🎯', '🌟']
        }
      default:
        return {
          icon,
          emojis: ['✨', '💫', '⭐']
        }
    }
  }

  const illustration_data = getIllustration()

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-8',
          icon: 'text-5xl',
          title: 'text-xl',
          message: 'text-sm',
          button: 'px-4 py-2 text-sm'
        }
      case 'lg':
        return {
          container: 'p-16',
          icon: 'text-8xl',
          title: 'text-3xl',
          message: 'text-lg',
          button: 'px-8 py-4 text-lg'
        }
      default:
        return {
          container: 'p-12',
          icon: 'text-7xl',
          title: 'text-2xl',
          message: 'text-base',
          button: 'px-6 py-3 text-base'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  // Render action button
  const renderAction = () => {
    if (!actionLabel) return null

    const button = (
      <button
        onClick={onAction}
        className={`bg-gradient-to-r from-green-400 to-blue-500 text-white 
                   rounded-lg font-semibold hover:scale-105 transition-all
                   ${sizeClasses.button}`}
      >
        {actionLabel}
      </button>
    )

    if (actionHref) {
      return <Link href={actionHref}>{button}</Link>
    }

    return button
  }

  // Render secondary action
  const renderSecondaryAction = () => {
    if (!secondaryActionLabel) return null

    const button = (
      <button
        onClick={onSecondaryAction}
        className={`bg-white/10 hover:bg-white/20 text-white 
                   rounded-lg font-semibold transition-colors
                   ${sizeClasses.button}`}
      >
        {secondaryActionLabel}
      </button>
    )

    if (secondaryActionHref) {
      return <Link href={secondaryActionHref}>{button}</Link>
    }

    return button
  }

  return (
    <div className={`text-center ${sizeClasses.container} ${className}`}>
      {/* Main Illustration */}
      <div className="relative inline-block mb-6">
        <div className={`${sizeClasses.icon} animate-bounce`}>
          {illustration_data.icon}
        </div>
        
        {/* Floating Emojis */}
        <div className="absolute -top-4 -right-8 animate-pulse">
          <span className="text-2xl opacity-50">{illustration_data.emojis[0]}</span>
        </div>
        <div className="absolute -bottom-2 -left-8 animate-pulse animation-delay-200">
          <span className="text-2xl opacity-50">{illustration_data.emojis[1]}</span>
        </div>
        <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 animate-pulse animation-delay-400">
          <span className="text-2xl opacity-50">{illustration_data.emojis[2]}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-white mb-2 ${sizeClasses.title}`}>
        {title}
      </h3>

      {/* Message */}
      <p className={`text-gray-400 mb-8 max-w-md mx-auto ${sizeClasses.message}`}>
        {message}
      </p>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {renderAction()}
          {renderSecondaryAction()}
        </div>
      )}

      {/* Decorative Elements */}
      <div className="mt-8 flex justify-center gap-4 text-gray-600">
        <span className="text-sm">✨</span>
        <span className="text-sm">💫</span>
        <span className="text-sm">⭐</span>
      </div>
    </div>
  )
}