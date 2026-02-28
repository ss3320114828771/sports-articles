'use client'

interface LoadingProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'green' | 'blue' | 'purple' | 'red' | 'yellow' | 'white'
  text?: string
  fullScreen?: boolean
  count?: number
  className?: string
}

export default function Loading({
  type = 'spinner',
  size = 'md',
  color = 'green',
  text,
  fullScreen = false,
  count = 1,
  className = ''
}: LoadingProps) {
  // Size mappings
  const sizeMap = {
    xs: {
      spinner: 'w-4 h-4 border-2',
      dots: 'w-1.5 h-1.5',
      pulse: 'w-8 h-8',
      progress: 'h-1',
      text: 'text-xs'
    },
    sm: {
      spinner: 'w-6 h-6 border-2',
      dots: 'w-2 h-2',
      pulse: 'w-12 h-12',
      progress: 'h-1.5',
      text: 'text-sm'
    },
    md: {
      spinner: 'w-8 h-8 border-3',
      dots: 'w-2.5 h-2.5',
      pulse: 'w-16 h-16',
      progress: 'h-2',
      text: 'text-base'
    },
    lg: {
      spinner: 'w-12 h-12 border-3',
      dots: 'w-3 h-3',
      pulse: 'w-20 h-20',
      progress: 'h-2.5',
      text: 'text-lg'
    },
    xl: {
      spinner: 'w-16 h-16 border-4',
      dots: 'w-4 h-4',
      pulse: 'w-24 h-24',
      progress: 'h-3',
      text: 'text-xl'
    }
  }

  // Color mappings
  const colorMap = {
    green: {
      spinner: 'border-green-500/20 border-t-green-500',
      dot: 'bg-green-500',
      pulse: 'bg-green-500',
      progress: 'bg-green-500'
    },
    blue: {
      spinner: 'border-blue-500/20 border-t-blue-500',
      dot: 'bg-blue-500',
      pulse: 'bg-blue-500',
      progress: 'bg-blue-500'
    },
    purple: {
      spinner: 'border-purple-500/20 border-t-purple-500',
      dot: 'bg-purple-500',
      pulse: 'bg-purple-500',
      progress: 'bg-purple-500'
    },
    red: {
      spinner: 'border-red-500/20 border-t-red-500',
      dot: 'bg-red-500',
      pulse: 'bg-red-500',
      progress: 'bg-red-500'
    },
    yellow: {
      spinner: 'border-yellow-500/20 border-t-yellow-500',
      dot: 'bg-yellow-500',
      pulse: 'bg-yellow-500',
      progress: 'bg-yellow-500'
    },
    white: {
      spinner: 'border-white/20 border-t-white',
      dot: 'bg-white',
      pulse: 'bg-white',
      progress: 'bg-white'
    }
  }

  // Render spinner
  const renderSpinner = () => (
    <div
      className={`
        ${sizeMap[size].spinner} 
        ${colorMap[color].spinner}
        rounded-full animate-spin
      `}
    />
  )

  // Render dots
  const renderDots = () => (
    <div className="flex gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`
            ${sizeMap[size].dots}
            ${colorMap[color].dot}
            rounded-full
            animate-bounce
          `}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )

  // Render pulse
  const renderPulse = () => (
    <div
      className={`
        ${sizeMap[size].pulse}
        ${colorMap[color].pulse}
        rounded-full animate-pulse
      `}
    />
  )

  // Render progress bar
  const renderProgress = () => (
    <div
      className={`
        w-full ${sizeMap[size].progress}
        bg-white/10 rounded-full overflow-hidden
      `}
    >
      <div
        className={`
          ${colorMap[color].progress}
          h-full rounded-full animate-progress
        `}
        style={{ width: '60%' }}
      />
    </div>
  )

  // Render skeleton
  const renderSkeleton = () => (
    <div className="space-y-3 w-full">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  )

  // Render based on type
  const renderLoading = () => {
    switch (type) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'progress':
        return renderProgress()
      case 'skeleton':
        return renderSkeleton()
      default:
        return renderSpinner()
    }
  }

  const container = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {renderLoading()}
      {text && (
        <p className={`text-gray-400 ${sizeMap[size].text}`}>{text}</p>
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