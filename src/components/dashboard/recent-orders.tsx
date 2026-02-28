'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface RecentOrder {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    avatar?: string
  }
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  items: number
}

interface RecentOrdersProps {
  orders: RecentOrder[]
  title?: string
  maxItems?: number
  showViewAll?: boolean
  onViewAll?: () => void
  onOrderClick?: (orderId: string) => void
  className?: string
}

export default function RecentOrders({
  orders,
  title = 'Recent Orders',
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  onOrderClick,
  className = ''
}: RecentOrdersProps) {
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null)

  // Limit orders to maxItems
  const displayedOrders = orders.slice(0, maxItems)

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'processing': 'bg-blue-500/20 text-blue-400',
      'shipped': 'bg-purple-500/20 text-purple-400',
      'delivered': 'bg-green-500/20 text-green-400',
      'cancelled': 'bg-red-500/20 text-red-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      'pending': '⏳',
      'processing': '⚙️',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    }
    return icons[status] || '📦'
  }

  // Handle order click
  const handleOrderClick = (orderId: string) => {
    if (onOrderClick) {
      onOrderClick(orderId)
    }
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {showViewAll && orders.length > maxItems && (
          <button
            onClick={onViewAll}
            className="text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-400">No recent orders</p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div
              key={order.id}
              className={`
                relative p-4 bg-white/5 rounded-lg border-2 transition-all cursor-pointer
                ${hoveredOrder === order.id 
                  ? 'border-green-400 bg-green-500/5' 
                  : 'border-transparent hover:border-green-400/50'
                }
              `}
              onMouseEnter={() => setHoveredOrder(order.id)}
              onMouseLeave={() => setHoveredOrder(null)}
              onClick={() => handleOrderClick(order.id)}
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {/* Customer Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 
                                rounded-full flex items-center justify-center text-white font-bold">
                    {order.customer.avatar || order.customer.name.charAt(0)}
                  </div>
                  
                  {/* Customer Info */}
                  <div>
                    <p className="text-white font-medium">{order.customer.name}</p>
                    <p className="text-xs text-gray-400">{order.customer.email}</p>
                  </div>
                </div>

                {/* Order Number */}
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-mono"
                  onClick={(e) => e.stopPropagation()}
                >
                  {order.orderNumber}
                </Link>
              </div>

              {/* Order Details */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  {/* Items */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-400">📦</span>
                    <span className="text-white">{order.items} items</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-400">📅</span>
                    <span className="text-white">{formatDate(order.date)}</span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    <span>{getStatusIcon(order.status)}</span>
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-lg font-bold text-green-400">
                      {formatPrice(order.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar for active orders */}
              {(order.status === 'processing' || order.status === 'shipped') && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Order Placed</span>
                    <span>{order.status === 'shipped' ? 'Shipped' : 'Processing'}</span>
                    <span>Delivered</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        order.status === 'processing' ? 'bg-blue-400 w-1/3' : 'bg-purple-400 w-2/3'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {displayedOrders.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-400">Total Orders</p>
              <p className="text-lg font-bold text-white">{orders.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-lg font-bold text-yellow-400">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivered</p>
              <p className="text-lg font-bold text-green-400">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}