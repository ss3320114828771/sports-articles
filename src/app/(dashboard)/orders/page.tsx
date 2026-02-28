'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod: string
  items: number
  createdAt: string
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('ALL')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      total: 12599,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      items: 3,
      createdAt: '2024-03-15'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      total: 34999,
      status: 'PROCESSING',
      paymentStatus: 'PAID',
      paymentMethod: 'Card',
      items: 2,
      createdAt: '2024-03-16'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@example.com',
      total: 8999,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'Cash',
      items: 1,
      createdAt: '2024-03-16'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@example.com',
      total: 45999,
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      items: 4,
      createdAt: '2024-03-14'
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customerName: 'Amit Kumar',
      customerEmail: 'amit.kumar@example.com',
      total: 15999,
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      paymentMethod: 'Card',
      items: 2,
      createdAt: '2024-03-13'
    },
    {
      id: '6',
      orderNumber: 'ORD-2024-006',
      customerName: 'Sneha Reddy',
      customerEmail: 'sneha.reddy@example.com',
      total: 27999,
      status: 'OUT_FOR_DELIVERY',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      items: 3,
      createdAt: '2024-03-15'
    }
  ])

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    // Date filter
    let matchesDate = true
    const today = new Date()
    const orderDate = new Date(order.createdAt)
    
    if (dateFilter === 'TODAY') {
      matchesDate = orderDate.toDateString() === today.toDateString()
    } else if (dateFilter === 'WEEK') {
      const weekAgo = new Date(today.setDate(today.getDate() - 7))
      matchesDate = orderDate >= weekAgo
    } else if (dateFilter === 'MONTH') {
      const monthAgo = new Date(today.setMonth(today.getMonth() - 1))
      matchesDate = orderDate >= monthAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'PENDING': 'bg-yellow-500/20 text-yellow-400',
      'PROCESSING': 'bg-blue-500/20 text-blue-400',
      'CONFIRMED': 'bg-purple-500/20 text-purple-400',
      'PACKED': 'bg-indigo-500/20 text-indigo-400',
      'SHIPPED': 'bg-cyan-500/20 text-cyan-400',
      'OUT_FOR_DELIVERY': 'bg-orange-500/20 text-orange-400',
      'DELIVERED': 'bg-green-500/20 text-green-400',
      'CANCELLED': 'bg-red-500/20 text-red-400',
      'REFUNDED': 'bg-gray-500/20 text-gray-400'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-500/20 text-yellow-400',
      'PAID': 'bg-green-500/20 text-green-400',
      'FAILED': 'bg-red-500/20 text-red-400',
      'REFUNDED': 'bg-gray-500/20 text-gray-400'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    )
  }

  // Handle delete
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrders(orders.filter(order => order.id !== selectedOrder.id))
      setShowDeleteModal(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error deleting order')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-6">
      {/* Bismillah */}
      <div className="text-center mb-4 md:mb-6">
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Orders</h1>
            <p className="text-gray-400">Manage your customer orders</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-white">{totalOrders}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingOrders}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-400">{deliveredOrders}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">This Week</option>
            <option value="MONTH">This Month</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Order ID</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Customer</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Date</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Items</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Total</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Payment</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-blue-400 hover:text-blue-300 font-mono">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{order.customerName}</p>
                          <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{order.createdAt}</td>
                      <td className="p-4 text-gray-300">{order.items}</td>
                      <td className="p-4 text-white font-semibold">₹{order.total.toLocaleString()}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4">{getPaymentStatusBadge(order.paymentStatus)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                            title="View Details"
                          >
                            👁️
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <p className="text-gray-400">No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Average Order Value</p>
            <p className="text-2xl font-bold text-white">
              ₹{totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Paid Orders</p>
            <p className="text-2xl font-bold text-green-400">
              {orders.filter(o => o.paymentStatus === 'PAID').length}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-400">
              {orders.filter(o => o.paymentStatus === 'PENDING').length}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Order</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete order <span className="font-bold text-red-400">{selectedOrder.orderNumber}</span>?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteOrder}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedOrder(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}