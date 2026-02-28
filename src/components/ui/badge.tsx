'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'purple' | 'pink'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'pill' | 'square'
  outline?: boolean
  icon?: string
  dot?: boolean
  pulsating?: boolean
  removable?: boolean
  onRemove?: () => void
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  shape = 'pill',
  outline = false,
  icon,
  dot = false,
  pulsating = false,
  removable = false,
  onRemove,
  className = ''
}: BadgeProps) {
  // Variant styles
  const variantStyles = {
    default: {
      bg: 'bg-gray-500',
      text: 'text-white',
      border: 'border-gray-500',
      dot: 'bg-gray-500'
    },
    success: {
      bg: 'bg-green-500',
      text: 'text-white',
      border: 'border-green-500',
      dot: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-500',
      text: 'text-white',
      border: 'border-red-500',
      dot: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-white',
      border: 'border-yellow-500',
      dot: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-500',
      text: 'text-white',
      border: 'border-blue-500',
      dot: 'bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-white',
      border: 'border-purple-500',
      dot: 'bg-purple-500'
    },
    pink: {
      bg: 'bg-pink-500',
      text: 'text-white',
      border: 'border-pink-500',
      dot: 'bg-pink-500'
    }
  }

  // Size styles
  const sizeStyles = {
    xs: {
      container: 'px-1.5 py-0.5 text-xs',
      icon: 'text-xs',
      dot: 'w-1.5 h-1.5'
    },
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'text-sm',
      dot: 'w-2 h-2'
    },
    md: {
      container: 'px-2.5 py-1 text-sm',
      icon: 'text-base',
      dot: 'w-2.5 h-2.5'
    },
    lg: {
      container: 'px-3 py-1.5 text-base',
      icon: 'text-lg',
      dot: 'w-3 h-3'
    }
  }

  // Shape styles
  const shapeStyles = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
    square: 'rounded-none'
  }

  const styles = variantStyles[variant]
  const sizes = sizeStyles[size]
  const shapeClass = shapeStyles[shape]

  // Outline styles
  const outlineStyles = outline
    ? `bg-transparent border ${styles.border} ${styles.text}`
    : `${styles.bg} ${styles.text}`

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        ${sizes.container}
        ${shapeClass}
        ${outlineStyles}
        font-medium
        transition-all
        ${pulsating ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {/* Dot Indicator */}
      {dot && (
        <span
          className={`
            ${sizes.dot} rounded-full
            ${styles.dot}
            ${pulsating ? 'animate-ping' : ''}
          `}
        />
      )}

      {/* Icon */}
      {icon && <span className={sizes.icon}>{icon}</span>}

      {/* Content */}
      <span>{children}</span>

      {/* Remove Button */}
      {removable && (
        <button
          onClick={onRemove}
          className={`
            ml-0.5 hover:opacity-80 transition-opacity
            focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full
          `}
          aria-label="Remove"
        >
          <span className={sizes.icon}>✕</span>
        </button>
      )}
    </span>
  )
}