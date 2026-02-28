'use client'

import { useState, useEffect, useCallback } from 'react'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  couponCode?: string
  itemCount: number
}

interface AddToCartParams {
  productId: string
  name: string
  price: number
  quantity?: number
  image: string
  size?: string
  color?: string
  maxQuantity?: number
}

export function useCart() {
  const [state, setState] = useState<CartState>({
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    itemCount: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCart()
    }
  }, [state.items, isInitialized])

  // Calculate cart totals
  const calculateTotals = useCallback((items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 1000 ? 0 : 99
    const tax = subtotal * 0.18
    const discount = state.discount || 0
    const total = subtotal + shipping + tax - discount
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    setState(prev => ({
      ...prev,
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount
    }))
  }, [state.discount])

  // Load cart function
  const loadCart = useCallback(async () => {
    setIsLoading(true)
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const items = JSON.parse(savedCart)
        calculateTotals(items)
      } else {
        const response = await fetch('/api/cart')
        if (response.ok) {
          const data = await response.json()
          setState(data)
          localStorage.setItem('cart', JSON.stringify(data.items))
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [calculateTotals])

  // Save cart to localStorage
  const saveCart = useCallback(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setState(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId)
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shipping = subtotal > 1000 ? 0 : 99
      const tax = subtotal * 0.18
      const total = subtotal + shipping + tax - prev.discount
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...prev,
        items: newItems,
        subtotal,
        shipping,
        tax,
        total,
        itemCount
      }
    })
  }, [])

  // Add item to cart
  const addItem = useCallback((params: AddToCartParams) => {
    const {
      productId,
      name,
      price,
      quantity = 1,
      image,
      size,
      color,
      maxQuantity = 99
    } = params

    setState(prev => {
      const existingItemIndex = prev.items.findIndex(
        item => 
          item.productId === productId && 
          item.size === size && 
          item.color === color
      )

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        newItems = [...prev.items]
        const existingItem = newItems[existingItemIndex]
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          maxQuantity
        )
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        }
      } else {
        const newItem: CartItem = {
          id: `${productId}-${Date.now()}`,
          productId,
          name,
          price,
          quantity,
          image,
          size,
          color,
          maxQuantity
        }
        newItems = [...prev.items, newItem]
      }

      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shipping = subtotal > 1000 ? 0 : 99
      const tax = subtotal * 0.18
      const total = subtotal + shipping + tax - prev.discount
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...prev,
        items: newItems,
        subtotal,
        shipping,
        tax,
        total,
        itemCount
      }
    })
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setState(prev => {
      const item = prev.items.find(i => i.id === itemId)
      if (!item) return prev

      if (newQuantity < 1) {
        const newItems = prev.items.filter(i => i.id !== itemId)
        const subtotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        const shipping = subtotal > 1000 ? 0 : 99
        const tax = subtotal * 0.18
        const total = subtotal + shipping + tax - prev.discount
        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0)

        return {
          ...prev,
          items: newItems,
          subtotal,
          shipping,
          tax,
          total,
          itemCount
        }
      }

      const finalQuantity = item.maxQuantity && newQuantity > item.maxQuantity 
        ? item.maxQuantity 
        : newQuantity

      const newItems = prev.items.map(i =>
        i.id === itemId
          ? { ...i, quantity: finalQuantity }
          : i
      )

      const subtotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      const shipping = subtotal > 1000 ? 0 : 99
      const tax = subtotal * 0.18
      const total = subtotal + shipping + tax - prev.discount
      const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0)

      return {
        ...prev,
        items: newItems,
        subtotal,
        shipping,
        tax,
        total,
        itemCount
      }
    })
  }, [])

  // Clear cart
  const clearCart = useCallback(() => {
    setState({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
      itemCount: 0
    })
    localStorage.removeItem('cart')
  }, [])

  // Apply coupon
  const applyCoupon = useCallback(async (code: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      let discount = 0
      if (code.toUpperCase() === 'WELCOME10') {
        discount = state.subtotal * 0.1
      } else if (code.toUpperCase() === 'SPORTS500') {
        discount = 500
      } else {
        throw new Error('Invalid coupon code')
      }

      setState(prev => ({
        ...prev,
        discount,
        total: prev.subtotal + prev.shipping + prev.tax - discount,
        couponCode: code
      }))

      return { success: true, discount }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to apply coupon'
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }, [state.subtotal, state.shipping, state.tax])

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setState(prev => ({
      ...prev,
      discount: 0,
      total: prev.subtotal + prev.shipping + prev.tax,
      couponCode: undefined
    }))
  }, [])

  // Check if item is in cart
  const isInCart = useCallback((productId: string, size?: string, color?: string) => {
    return state.items.some(
      item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    )
  }, [state.items])

  // Get item quantity
  const getItemQuantity = useCallback((productId: string, size?: string, color?: string) => {
    const item = state.items.find(
      item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    )
    return item?.quantity || 0
  }, [state.items])

  // Sync with server
  const syncWithServer = useCallback(async () => {
    try {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: state.items })
      })

      if (response.ok) {
        const data = await response.json()
        calculateTotals(data.items)
      }
    } catch (error) {
      console.error('Failed to sync cart:', error)
    }
  }, [state.items, calculateTotals])

  return {
    items: state.items,
    subtotal: state.subtotal,
    shipping: state.shipping,
    tax: state.tax,
    discount: state.discount,
    total: state.total,
    couponCode: state.couponCode,
    itemCount: state.itemCount,
    isLoading,
    isInitialized,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    syncWithServer,
    isInCart,
    getItemQuantity
  }
}