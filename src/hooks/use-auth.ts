'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'manager' | 'customer'
  avatar?: string
  phone?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })

  // Load user from storage on mount
  useEffect(() => {
    loadUser()
  }, [])

  // Load user function
  const loadUser = useCallback(async () => {
    try {
      // Check localStorage first
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setState({
          user: JSON.parse(storedUser),
          isLoading: false,
          error: null
        })
        return
      }

      // If not in localStorage, try to fetch from API
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setState({
          user: data.user,
          isLoading: false,
          error: null
        })
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null
        })
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to load user'
      })
    }
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }

      setState({
        user: data.user,
        isLoading: false,
        error: null
      })

      return { success: true, user: data.user }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message
      }))
      return { success: false, error: message }
    }
  }, [])

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }))

      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message
      }))
      return { success: false, error: message }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })

      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')

      setState({
        user: null,
        isLoading: false,
        error: null
      })

      router.push('/auth/login')
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false
      }))
    }
  }, [router])

  // Update user function
  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Update failed')
      }

      const updatedUser = { ...state.user, ...data.user }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setState(prev => ({
        ...prev,
        user: updatedUser
      }))

      return { success: true, user: updatedUser }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed'
      return { success: false, error: message }
    }
  }, [state.user])

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed')
      }

      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password change failed'
      return { success: false, error: message }
    }
  }, [])

  // Forgot password function
  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email')
      }

      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email'
      return { success: false, error: message }
    }
  }, [])

  // Reset password function
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed')
      }

      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed'
      return { success: false, error: message }
    }
  }, [])

  // Check if user has role
  const hasRole = useCallback((roles: string | string[]) => {
    if (!state.user) return false
    
    const roleList = Array.isArray(roles) ? roles : [roles]
    return roleList.includes(state.user.role)
  }, [state.user])

  // Check if user is authenticated
  const isAuthenticated = !!state.user

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    hasRole,
    reloadUser: loadUser
  }
}