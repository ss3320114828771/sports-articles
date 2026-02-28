'use client'

import { useState, useEffect, useCallback } from 'react'

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  comparePrice?: number
  image: string
  category: string
  brand: string
  addedAt: string
  inStock: boolean
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export function useWishlist() {
  const [state, setState] = useState<WishlistState>({
    items: [],
    isLoading: false,
    error: null,
    isInitialized: false
  })

  // Load wishlist from localStorage on mount
  useEffect(() => {
    loadWishlist()
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (state.isInitialized) {
      saveWishlist()
    }
  }, [state.items, state.isInitialized])

  // Load wishlist function
  const loadWishlist = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Try to load from localStorage first
      const savedWishlist = localStorage.getItem('wishlist')
      
      if (savedWishlist) {
        const items = JSON.parse(savedWishlist)
        setState(prev => ({
          ...prev,
          items,
          isLoading: false,
          isInitialized: true
        }))
      } else {
        // If no saved wishlist, try to fetch from API
        const response = await fetch('/api/wishlist')
        
        if (response.ok) {
          const data = await response.json()
          setState(prev => ({
            ...prev,
            items: data.items,
            isLoading: false,
            isInitialized: true
          }))
          localStorage.setItem('wishlist', JSON.stringify(data.items))
        } else {
          setState(prev => ({
            ...prev,
            items: [],
            isLoading: false,
            isInitialized: true
          }))
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load wishlist',
        isLoading: false,
        isInitialized: true
      }))
    }
  }, [])

  // Save wishlist to localStorage
  const saveWishlist = useCallback(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items))
  }, [state.items])

  // Add item to wishlist
  const addToWishlist = useCallback(async (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check if item already exists
      const exists = state.items.some(i => i.productId === item.productId)
      
      if (exists) {
        setState(prev => ({
          ...prev,
          error: 'Item already in wishlist',
          isLoading: false
        }))
        return { success: false, error: 'Item already in wishlist' }
      }

      const newItem: WishlistItem = {
        ...item,
        id: `wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString()
      }

      // Optimistic update
      setState(prev => ({
        ...prev,
        items: [newItem, ...prev.items],
        isLoading: false
      }))

      // Sync with server
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })

      if (!response.ok) {
        // Revert on failure
        setState(prev => ({
          ...prev,
          items: prev.items.filter(i => i.id !== newItem.id),
          error: 'Failed to add to wishlist'
        }))
        return { success: false, error: 'Failed to add to wishlist' }
      }

      return { success: true, item: newItem }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add to wishlist',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add to wishlist' }
    }
  }, [state.items])

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const itemToRemove = state.items.find(i => i.productId === productId)
      
      if (!itemToRemove) {
        setState(prev => ({
          ...prev,
          error: 'Item not found in wishlist',
          isLoading: false
        }))
        return { success: false, error: 'Item not found' }
      }

      // Optimistic update
      setState(prev => ({
        ...prev,
        items: prev.items.filter(i => i.productId !== productId),
        isLoading: false
      }))

      // Sync with server
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        // Revert on failure
        setState(prev => ({
          ...prev,
          items: [itemToRemove, ...prev.items],
          error: 'Failed to remove from wishlist'
        }))
        return { success: false, error: 'Failed to remove from wishlist' }
      }

      return { success: true }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to remove from wishlist',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to remove from wishlist' }
    }
  }, [state.items])

  // Toggle item in wishlist
  const toggleWishlist = useCallback(async (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const exists = state.items.some(i => i.productId === item.productId)
    
    if (exists) {
      return removeFromWishlist(item.productId)
    } else {
      return addToWishlist(item)
    }
  }, [state.items, addToWishlist, removeFromWishlist])

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const previousItems = [...state.items]

      // Optimistic update
      setState(prev => ({
        ...prev,
        items: [],
        isLoading: false
      }))

      // Sync with server
      const response = await fetch('/api/wishlist', {
        method: 'DELETE'
      })

      if (!response.ok) {
        // Revert on failure
        setState(prev => ({
          ...prev,
          items: previousItems,
          error: 'Failed to clear wishlist'
        }))
        return { success: false, error: 'Failed to clear wishlist' }
      }

      return { success: true }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to clear wishlist',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to clear wishlist' }
    }
  }, [state.items])

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return state.items.some(item => item.productId === productId)
  }, [state.items])

  // Get wishlist item
  const getWishlistItem = useCallback((productId: string) => {
    return state.items.find(item => item.productId === productId)
  }, [state.items])

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return state.items.length
  }, [state.items])

  // Get items by category
  const getItemsByCategory = useCallback((category: string) => {
    return state.items.filter(item => item.category === category)
  }, [state.items])

  // Get items by brand
  const getItemsByBrand = useCallback((brand: string) => {
    return state.items.filter(item => item.brand === brand)
  }, [state.items])

  // Get in-stock items
  const getInStockItems = useCallback(() => {
    return state.items.filter(item => item.inStock)
  }, [state.items])

  // Get out-of-stock items
  const getOutOfStockItems = useCallback(() => {
    return state.items.filter(item => !item.inStock)
  }, [state.items])

  // Sort wishlist
  const sortWishlist = useCallback((sortBy: 'date' | 'price-asc' | 'price-desc' | 'name') => {
    const sorted = [...state.items]
    
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        break
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setState(prev => ({ ...prev, items: sorted }))
    return sorted
  }, [state.items])

  // Search wishlist
  const searchWishlist = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase()
    return state.items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.brand.toLowerCase().includes(lowerQuery)
    )
  }, [state.items])

  // Get total value
  const getTotalValue = useCallback(() => {
    return state.items.reduce((sum, item) => sum + item.price, 0)
  }, [state.items])

  // Get average price
  const getAveragePrice = useCallback(() => {
    if (state.items.length === 0) return 0
    const total = getTotalValue()
    return total / state.items.length
  }, [state.items, getTotalValue])

  // Sync with server
  const syncWithServer = useCallback(async () => {
    try {
      const response = await fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: state.items })
      })

      if (response.ok) {
        const data = await response.json()
        setState(prev => ({
          ...prev,
          items: data.items
        }))
        localStorage.setItem('wishlist', JSON.stringify(data.items))
      }
    } catch (error) {
      console.error('Failed to sync wishlist:', error)
    }
  }, [state.items])

  return {
    // State
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    isInitialized: state.isInitialized,
    count: getWishlistCount(),

    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    syncWithServer,

    // Helpers
    isInWishlist,
    getWishlistItem,
    getWishlistCount,
    getItemsByCategory,
    getItemsByBrand,
    getInStockItems,
    getOutOfStockItems,
    sortWishlist,
    searchWishlist,
    getTotalValue,
    getAveragePrice
  }
}