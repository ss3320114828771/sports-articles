'use client'

import { useState, useEffect, useCallback } from 'react'

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  paymentMethod: string
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
}

interface OrdersState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
}

interface OrdersFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

export function useOrders() {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  })

  // Fetch orders with filters
  const fetchOrders = useCallback(async (filters: OrdersFilters = {}) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const queryParams = new URLSearchParams()
      
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())

      const response = await fetch(`/api/orders?${queryParams.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders')
      }

      setState(prev => ({
        ...prev,
        orders: data.orders,
        totalCount: data.total,
        currentPage: data.page,
        totalPages: data.pages,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false
      }))
    }
  }, [])

  // Fetch single order
  const fetchOrder = useCallback(async (orderId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch order')
      }

      setState(prev => ({
        ...prev,
        currentOrder: data.order,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch order',
        isLoading: false
      }))
    }
  }, [])

  // Create order
  const createOrder = useCallback(async (orderData: Partial<Order>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order')
      }

      setState(prev => ({
        ...prev,
        orders: [data.order, ...prev.orders],
        currentOrder: data.order,
        totalCount: prev.totalCount + 1,
        isLoading: false
      }))

      return { success: true, order: data.order }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create order',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create order' }
    }
  }, [])

  // Update order
  const updateOrder = useCallback(async (orderId: string, updates: Partial<Order>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order')
      }

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order => 
          order.id === orderId ? data.order : order
        ),
        currentOrder: prev.currentOrder?.id === orderId ? data.order : prev.currentOrder,
        isLoading: false
      }))

      return { success: true, order: data.order }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update order',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update order' }
    }
  }, [])

  // Cancel order
  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel order')
      }

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ),
        currentOrder: prev.currentOrder?.id === orderId 
          ? { ...prev.currentOrder, status: 'cancelled' } 
          : prev.currentOrder,
        isLoading: false
      }))

      return { success: true }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to cancel order',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to cancel order' }
    }
  }, [])

  // Track order
  const trackOrder = useCallback(async (orderId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/orders/${orderId}/track`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to track order')
      }

      setState(prev => ({
        ...prev,
        currentOrder: prev.currentOrder?.id === orderId 
          ? { ...prev.currentOrder, ...data.tracking } 
          : prev.currentOrder,
        isLoading: false
      }))

      return { success: true, tracking: data.tracking }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to track order',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to track order' }
    }
  }, [])

  // Reorder
  const reorder = useCallback(async (orderId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/orders/${orderId}/reorder`, {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reorder')
      }

      setState(prev => ({
        ...prev,
        isLoading: false
      }))

      return { success: true, order: data.order }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to reorder',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to reorder' }
    }
  }, [])

  // Get order statistics
  const getOrderStats = useCallback(async () => {
    try {
      const response = await fetch('/api/orders/stats')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch order stats')
      }

      return { success: true, stats: data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch order stats' 
      }
    }
  }, [])

  // Get recent orders
  const getRecentOrders = useCallback(async (limit: number = 5) => {
    try {
      const response = await fetch(`/api/orders/recent?limit=${limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recent orders')
      }

      return { success: true, orders: data.orders }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch recent orders' 
      }
    }
  }, [])

  // Filter helpers
  const getOrdersByStatus = useCallback((status: Order['status']) => {
    return state.orders.filter(order => order.status === status)
  }, [state.orders])

  const getOrdersByDate = useCallback((date: string) => {
    return state.orders.filter(order => order.date === date)
  }, [state.orders])

  const getOrdersByDateRange = useCallback((start: string, end: string) => {
    return state.orders.filter(order => 
      order.date >= start && order.date <= end
    )
  }, [state.orders])

  const searchOrders = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase()
    return state.orders.filter(order => 
      order.orderNumber.toLowerCase().includes(lowerQuery) ||
      order.shippingAddress.name.toLowerCase().includes(lowerQuery) ||
      order.items.some(item => item.name.toLowerCase().includes(lowerQuery))
    )
  }, [state.orders])

  return {
    // State
    orders: state.orders,
    currentOrder: state.currentOrder,
    isLoading: state.isLoading,
    error: state.error,
    totalCount: state.totalCount,
    currentPage: state.currentPage,
    totalPages: state.totalPages,

    // Actions
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrder,
    cancelOrder,
    trackOrder,
    reorder,
    getOrderStats,
    getRecentOrders,

    // Filters
    getOrdersByStatus,
    getOrdersByDate,
    getOrdersByDateRange,
    searchOrders
  }
}