'use client'

import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((prevValue: T) => T)

/**
 * A hook that syncs state with localStorage
 * @param key The localStorage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get stored value from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
        setStoredValue(initialValue)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue))
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue, removeValue]
}

/**
 * A hook that syncs state with sessionStorage
 * @param key The sessionStorage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue, removeValue]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get stored value from sessionStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)
        setStoredValue(initialValue)
      }
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * A hook that syncs state with localStorage with expiration
 * @param key The localStorage key
 * @param initialValue The initial value
 * @param ttl Time to live in milliseconds
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  ttl: number
): [T | null, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T | null>(null)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const { value, expiry } = JSON.parse(item)
        if (expiry && new Date().getTime() > expiry) {
          window.localStorage.removeItem(key)
          setStoredValue(null)
        } else {
          setStoredValue(value)
        }
      } else {
        setStoredValue(initialValue)
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  const setValue = useCallback(
    (value: T) => {
      try {
        const item = {
          value,
          expiry: new Date().getTime() + ttl
        }
        window.localStorage.setItem(key, JSON.stringify(item))
        setStoredValue(value)
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, ttl]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(null)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key])

  return [storedValue, setValue, removeValue]
}

/**
 * A hook that syncs state with localStorage using JSON
 * @param key The localStorage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorageJSON<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * A hook that syncs state with localStorage using JSON schema validation
 * @param key The localStorage key
 * @param schema The JSON schema for validation
 * @param initialValue The initial value
 * @returns [storedValue, setValue, removeValue, isValid]
 */
export function useLocalStorageWithSchema<T>(
  key: string,
  schema: Record<string, any>,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        // Simple schema validation (you can use a library like zod or yup)
        const valid = Object.keys(schema).every(key => 
          typeof parsed[key] === schema[key]
        )
        setIsValid(valid)
        setStoredValue(valid ? parsed : initialValue)
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      setIsValid(false)
    }
  }, [key, initialValue, schema])

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        // Validate before saving
        const valid = Object.keys(schema).every(key => 
          typeof (valueToStore as any)[key] === schema[key]
        )
        setIsValid(valid)

        if (valid) {
          setStoredValue(valueToStore)
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue, schema]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
      setIsValid(true)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue, isValid]
}