'use client'

import { useState, useEffect } from 'react'

/**
 * A hook that debounces a value
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timer if the value changes before the delay ends
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * A hook that debounces a function
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const debouncedFn = ((...args: Parameters<T>) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set a new timeout
    const id = setTimeout(() => {
      fn(...args)
    }, delay)

    setTimeoutId(id)
  }) as T

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return debouncedFn
}

/**
 * A hook that debounces a value with immediate execution option
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @param immediate Whether to execute immediately on first change
 * @returns The debounced value
 */
export function useDebounceWithImmediate<T>(
  value: T,
  delay: number,
  immediate: boolean = false
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // If immediate and this is the first execution
    if (immediate && debouncedValue === value) {
      return
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay, immediate, debouncedValue])

  return debouncedValue
}

/**
 * A hook that debounces a value with leading/trailing options
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @param options Configuration options
 * @returns The debounced value
 */
export function useDebounceWithOptions<T>(
  value: T,
  delay: number,
  options: {
    leading?: boolean
    trailing?: boolean
    maxWait?: number
  } = {}
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [leadingValue, setLeadingValue] = useState<T | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [maxWaitTimeoutId, setMaxWaitTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const { leading = false, trailing = true, maxWait } = options

  useEffect(() => {
    // Handle leading edge
    if (leading && !timeoutId) {
      setLeadingValue(value)
      setDebouncedValue(value)
    }

    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    // Set trailing timeout
    if (trailing) {
      const timer = setTimeout(() => {
        setDebouncedValue(value)
        setTimeoutId(null)
      }, delay)
      setTimeoutId(timer)
    }

    // Set max wait timeout
    if (maxWait && !maxWaitTimeoutId) {
      const maxWaitTimer = setTimeout(() => {
        setDebouncedValue(value)
        setMaxWaitTimeoutId(null)
      }, maxWait)
      setMaxWaitTimeoutId(maxWaitTimer)
    }

    // Clean up
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (maxWaitTimeoutId) {
        clearTimeout(maxWaitTimeoutId)
      }
    }
  }, [value, delay, leading, trailing, maxWait])

  return debouncedValue
}