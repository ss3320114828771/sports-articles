'use client'

import { useState, useEffect } from 'react'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  icon?: string
  dismissible?: boolean
  autoClose?: number
  onClose?: () => void
  className?: string
}

export default function Alert({
  type = 'info',
  title,
  message,
  icon,
  dismissible = false,
  autoClose,
  onClose,
  className = ''
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  // Auto close timer
  useEffect(() => {
    if (autoClose && isVisible) {
      const interval = 100 // Update every 100ms
      const totalSteps = autoClose / interval
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        setProgress(100 - (currentStep / totalSteps) * 100)

        if (currentStep >= totalSteps) {
          clearInterval(timer)
          handleClose()
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [autoClose, isVisible])

  // Get alert styles based on type
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500',
          text: 'text-green-400',
          icon: icon || '✅',
          progress: 'bg-green-500'
        }
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500',
          text: 'text-red-400',
          icon: icon || '❌',
          progress: 'bg-red-500'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500',
          text: 'text-yellow-400',
          icon: icon || '⚠️',
          progress: 'bg-yellow-500'
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500',
          text: 'text-blue-400',
          icon: icon || 'ℹ️',
          progress: 'bg-blue-500'
        }
    }
  }

  const styles = getAlertStyles()

  // Handle close
  const handleClose = () => {
    setIsVisible(false)
    if (onClose) {
      onClose()
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`
        relative overflow-hidden
        ${styles.bg} border ${styles.border}
        rounded-lg p-4
        animate-slideIn
        ${className}
      `}
      role="alert"
    >
      {/* Progress Bar */}
      {autoClose && (
        <div
          className={`absolute bottom-0 left-0 h-1 ${styles.progress} transition-all duration-100`}
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`text-xl ${styles.text}`}>
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold mb-1 ${styles.text}`}>
              {title}
            </h4>
          )}
          <p className="text-gray-300 text-sm">{message}</p>
        </div>

        {/* Close Button */}
        {dismissible && (
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}