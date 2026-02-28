'use client'

import { useState, useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right'
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  // Auto close timer
  useEffect(() => {
    const interval = 100 // Update every 100ms
    const totalSteps = duration / interval
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
  }, [duration])

  // Get toast styles based on type
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: '✅',
          progress: 'bg-green-300'
        }
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: '❌',
          progress: 'bg-red-300'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: '⚠️',
          progress: 'bg-yellow-300'
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          icon: 'ℹ️',
          progress: 'bg-blue-300'
        }
    }
  }

  // Get position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2'
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2'
      default:
        return 'top-4 right-4'
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  const styles = getToastStyles()

  return (
    <div
      className={`
        fixed z-50
        ${getPositionStyles()}
        animate-slideIn
      `}
    >
      <div
        className={`
          ${styles.bg} text-white
          rounded-lg shadow-lg
          min-w-[300px] max-w-md
          overflow-hidden
        `}
      >
        {/* Progress Bar */}
        <div
          className={`h-1 ${styles.progress} transition-all duration-100`}
          style={{ width: `${progress}%` }}
        />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <span className="text-xl">{styles.icon}</span>

            {/* Message */}
            <p className="flex-1 text-sm">{message}</p>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
  }>
  onClose: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function ToastContainer({
  toasts,
  onClose,
  position = 'top-right'
}: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={position}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </>
  )
}

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
  }>>([])

  const showToast = (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    duration?: number
  ) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    closeToast,
    success: (msg: string, duration?: number) => showToast(msg, 'success', duration),
    error: (msg: string, duration?: number) => showToast(msg, 'error', duration),
    warning: (msg: string, duration?: number) => showToast(msg, 'warning', duration),
    info: (msg: string, duration?: number) => showToast(msg, 'info', duration)
  }
}