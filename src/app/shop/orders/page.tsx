'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  total: number
  items: number
  paymentMethod: string
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
}

export default function OrdersPage() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-03-15',
      status: 'Delivered',
      total: 24999,
      items: 1,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-03-14',
      status: 'Shipped',
      total: 45999,
      items: 2,
      paymentMethod: 'Card',
      paymentStatus: 'Paid'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-03-13',
      status: 'Processing',
      total: 15999,
      items: 1,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      date: '2024-03-12',
      status: 'Pending',
      total: 8999,
      items: 2,
      paymentMethod: 'COD',
      paymentStatus: 'Pending'
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      date: '2024-03-10',
      status: 'Delivered',
      total: 34999,
      items: 3,
      paymentMethod: 'Card',
      paymentStatus: 'Paid'
    },
    {
      id: '6',
      orderNumber: 'ORD-2024-006',
      date: '2024-03-08',
      status: 'Cancelled',
      total: 12999,
      items: 1,
      paymentMethod: 'UPI',
      paymentStatus: 'Refunded'
    }
  ]

  // Filter orders - FIXED
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filter !== 'all') {
      if (filter === 'delivered' && order.status !== 'Delivered') return false
      if (filter === 'shipped' && order.status !== 'Shipped') return false
      if (filter === 'processing' && order.status !== 'Processing') return false
      if (filter === 'pending' && order.status !== 'Pending') return false
      if (filter === 'cancelled' && order.status !== 'Cancelled') return false
    }
    
    // Search filter
    if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    return true
  })

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Delivered': 'bg-green-500/20 text-green-400',
      'Shipped': 'bg-blue-500/20 text-blue-400',
      'Processing': 'bg-yellow-500/20 text-yellow-400',
      'Pending': 'bg-orange-500/20 text-orange-400',
      'Cancelled': 'bg-red-500/20 text-red-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  // Get payment status badge
  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Paid': 'bg-green-500/20 text-green-400',
      'Pending': 'bg-yellow-500/20 text-yellow-400',
      'Failed': 'bg-red-500/20 text-red-400',
      'Refunded': 'bg-purple-500/20 text-purple-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Bismillah */}
      <div className="text-center py-6 bg-black/20">
        <h2 className="text-xl md:text-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      {/* Header */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-green-400">
                {orders.filter(o => o.status === 'Delivered').length}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Processing</p>
              <p className="text-2xl font-bold text-yellow-400">
                {orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-green-400">
                {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/10 rounded-xl p-12 text-center">
              <div className="text-7xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
              <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
              <Link
                href="/shop/products"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/shop/orders/${order.id}`}
                  className="block bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-all border border-white/20 hover:border-green-400"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-white">{order.orderNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-400">📅 {order.date}</span>
                        <span className="text-gray-400">📦 {order.items} items</span>
                        <span className="text-gray-400">💳 {order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Right: Amount & Payment Status */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="text-xl font-bold text-green-400">{formatPrice(order.total)}</p>
                      </div>
                      <div className="min-w-[80px]">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xl">→</div>
                    </div>
                  </div>

                  {/* Progress Bar for Shipped/Delivered */}
                  {order.status === 'Shipped' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Order Placed</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  )}

                  {order.status === 'Processing' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Order Placed</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full w-1/3"></div>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/shop/products"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">🛍️</span>
              <h3 className="text-white font-semibold mb-2">Continue Shopping</h3>
              <p className="text-gray-400 text-sm">Browse our latest products</p>
            </Link>

            <Link
              href="/shop/wishlist"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">❤️</span>
              <h3 className="text-white font-semibold mb-2">Wishlist</h3>
              <p className="text-gray-400 text-sm">View your saved items</p>
            </Link>

            <Link
              href="/contact"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📞</span>
              <h3 className="text-white font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm">Contact support</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Info */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Orders managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}