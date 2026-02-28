'use client'

import { useState, useCallback, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  title?: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
  title?: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContext {
  toasts: Toast[]
  showToast: (options: ToastOptions) => string
  success: (message: string, options?: Partial<ToastOptions>) => string
  error: (message: string, options?: Partial<ToastOptions>) => string
  warning: (message: string, options?: Partial<ToastOptions>) => string
  info: (message: string, options?: Partial<ToastOptions>) => string
  dismissToast: (id: string) => void
  dismissAll: () => void
  updateToast: (id: string, options: Partial<ToastOptions>) => void
}

const DEFAULT_DURATION = 5000 // 5 seconds
const MAX_TOASTS = 5

export function useToast(): ToastContext {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Auto-dismiss toasts after duration
  useEffect(() => {
    const timers = toasts.map(toast => {
      if (toast.duration !== 0) {
        return setTimeout(() => {
          dismissToast(toast.id)
        }, toast.duration || DEFAULT_DURATION)
      }
      return null
    })

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer))
    }
  }, [toasts])

  // Generate unique ID
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Show toast
  const showToast = useCallback((options: ToastOptions): string => {
    const id = generateId()
    const newToast: Toast = {
      id,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration !== undefined ? options.duration : DEFAULT_DURATION,
      title: options.title,
      icon: options.icon,
      action: options.action
    }

    setToasts(prev => {
      // Limit number of toasts
      const updated = [newToast, ...prev]
      if (updated.length > MAX_TOASTS) {
        return updated.slice(0, MAX_TOASTS)
      }
      return updated
    })

    return id
  }, [generateId])

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return showToast({ message, type: 'success', ...options })
  }, [showToast])

  const error = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return showToast({ message, type: 'error', ...options })
  }, [showToast])

  const warning = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return showToast({ message, type: 'warning', ...options })
  }, [showToast])

  const info = useCallback((message: string, options?: Partial<ToastOptions>): string => {
    return showToast({ message, type: 'info', ...options })
  }, [showToast])

  // Dismiss toast
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  // Update toast
  const updateToast = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id 
        ? { 
            ...toast, 
            ...options,
            type: options.type || toast.type
          }
        : toast
    ))
  }, [])

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    dismissToast,
    dismissAll,
    updateToast
  }
}

// Toast types and icons
export const toastIcons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}

// Toast colors
export const toastColors: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    text: 'text-green-400'
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    text: 'text-red-400'
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    text: 'text-yellow-400'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    text: 'text-blue-400'
  }
}

// Toast animations
export const toastAnimations = {
  enter: 'animate-slideIn',
  exit: 'animate-slideOut'
}

// Toast positions
export type ToastPosition = 
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

export const toastPositions: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
}