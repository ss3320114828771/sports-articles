'use client'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'green' | 'blue' | 'purple' | 'red' | 'yellow' | 'white'
  variant?: 'circle' | 'dots' | 'pulse' | 'bars' | 'ring'
  text?: string
  fullScreen?: boolean
  className?: string
}

export default function Spinner({
  size = 'md',
  color = 'green',
  variant = 'circle',
  text,
  fullScreen = false,
  className = ''
}: SpinnerProps) {
  // Size mappings
  const sizeMap = {
    xs: {
      circle: 'w-4 h-4 border-2',
      dots: 'w-1.5 h-1.5',
      pulse: 'w-6 h-6',
      bars: 'w-1 h-4',
      ring: 'w-6 h-6 border-2',
      text: 'text-xs',
      gap: 'gap-1'
    },
    sm: {
      circle: 'w-6 h-6 border-2',
      dots: 'w-2 h-2',
      pulse: 'w-8 h-8',
      bars: 'w-1.5 h-5',
      ring: 'w-8 h-8 border-2',
      text: 'text-sm',
      gap: 'gap-1.5'
    },
    md: {
      circle: 'w-8 h-8 border-3',
      dots: 'w-2.5 h-2.5',
      pulse: 'w-12 h-12',
      bars: 'w-2 h-6',
      ring: 'w-10 h-10 border-3',
      text: 'text-base',
      gap: 'gap-2'
    },
    lg: {
      circle: 'w-12 h-12 border-3',
      dots: 'w-3 h-3',
      pulse: 'w-16 h-16',
      bars: 'w-2.5 h-8',
      ring: 'w-14 h-14 border-3',
      text: 'text-lg',
      gap: 'gap-2.5'
    },
    xl: {
      circle: 'w-16 h-16 border-4',
      dots: 'w-4 h-4',
      pulse: 'w-20 h-20',
      bars: 'w-3 h-10',
      ring: 'w-16 h-16 border-4',
      text: 'text-xl',
      gap: 'gap-3'
    }
  }

  // Color mappings
  const colorMap = {
    green: {
      circle: 'border-green-500/20 border-t-green-500',
      dot: 'bg-green-500',
      pulse: 'bg-green-500',
      bar: 'bg-green-500',
      ring: 'border-green-500/20 border-t-green-500'
    },
    blue: {
      circle: 'border-blue-500/20 border-t-blue-500',
      dot: 'bg-blue-500',
      pulse: 'bg-blue-500',
      bar: 'bg-blue-500',
      ring: 'border-blue-500/20 border-t-blue-500'
    },
    purple: {
      circle: 'border-purple-500/20 border-t-purple-500',
      dot: 'bg-purple-500',
      pulse: 'bg-purple-500',
      bar: 'bg-purple-500',
      ring: 'border-purple-500/20 border-t-purple-500'
    },
    red: {
      circle: 'border-red-500/20 border-t-red-500',
      dot: 'bg-red-500',
      pulse: 'bg-red-500',
      bar: 'bg-red-500',
      ring: 'border-red-500/20 border-t-red-500'
    },
    yellow: {
      circle: 'border-yellow-500/20 border-t-yellow-500',
      dot: 'bg-yellow-500',
      pulse: 'bg-yellow-500',
      bar: 'bg-yellow-500',
      ring: 'border-yellow-500/20 border-t-yellow-500'
    },
    white: {
      circle: 'border-white/20 border-t-white',
      dot: 'bg-white',
      pulse: 'bg-white',
      bar: 'bg-white',
      ring: 'border-white/20 border-t-white'
    }
  }

  const sizes = sizeMap[size]
  const colors = colorMap[color]

  // Circle spinner
  const renderCircle = () => (
    <div
      className={`
        ${sizes.circle}
        ${colors.circle}
        rounded-full animate-spin
      `}
    />
  )

  // Dots spinner
  const renderDots = () => (
    <div className={`flex ${sizes.gap}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`
            ${sizes.dots}
            ${colors.dot}
            rounded-full
            animate-bounce
          `}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )

  // Pulse spinner
  const renderPulse = () => (
    <div
      className={`
        ${sizes.pulse}
        ${colors.pulse}
        rounded-full animate-pulse
      `}
    />
  )

  // Bars spinner
  const renderBars = () => (
    <div className={`flex items-center ${sizes.gap}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`
            ${sizes.bars}
            ${colors.bar}
            rounded-full
            animate-bar
          `}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )

  // Ring spinner
  const renderRing = () => (
    <div className="relative">
      <div
        className={`
          ${sizes.ring}
          ${colors.ring}
          rounded-full animate-spin
        `}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${sizes.dots} ${colors.dot} rounded-full`} />
      </div>
    </div>
  )

  // Render based on variant
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'bars':
        return renderBars()
      case 'ring':
        return renderRing()
      default:
        return renderCircle()
    }
  }

  const container = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderSpinner()}
      {text && (
        <p className={`text-gray-400 ${sizes.text}`}>{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 
                    backdrop-blur-sm z-50 flex items-center justify-center">
        {container}
      </div>
    )
  }

  return container
}