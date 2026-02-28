'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    avatar?: string
  }
  date: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  items: number
}

interface OrderTableProps {
  orders: Order[]
  onViewDetails?: (orderId: string) => void
  onUpdateStatus?: (orderId: string, status: string) => void
  onDelete?: (orderId: string) => void
  showActions?: boolean
  className?: string
}

export default function OrderTable({
  orders,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  showActions = true,
  className = ''
}: OrderTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<keyof Order>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const itemsPerPage = 10

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage)
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handle sort
  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(paginatedOrders.map(o => o.id))
    }
  }

  // Handle select order
  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  // Handle delete
  const handleDelete = (orderId: string) => {
    setOrderToDelete(orderId)
    setShowDeleteModal(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (orderToDelete && onDelete) {
      onDelete(orderToDelete)
      setShowDeleteModal(false)
      setOrderToDelete(null)
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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

  // Get payment status badge
  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'paid': 'bg-green-500/20 text-green-400',
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'failed': 'bg-red-500/20 text-red-400',
      'refunded': 'bg-purple-500/20 text-purple-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  // Get sort icon
  const getSortIcon = (field: keyof Order) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Orders</h2>
        
        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-400">
              {selectedOrders.length} selected
            </span>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
              Update Status
            </button>
            <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 
                     rounded-lg text-white placeholder-gray-400 
                     focus:outline-none focus:border-green-400"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                   text-white focus:outline-none focus:border-green-400"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              {/* Checkbox */}
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-green-500"
                />
              </th>
              
              {/* Order Number */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('orderNumber')}
              >
                <span className="flex items-center gap-1">
                  Order #{getSortIcon('orderNumber')}
                </span>
              </th>
              
              {/* Customer */}
              <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                Customer
              </th>
              
              {/* Date */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <span className="flex items-center gap-1">
                  Date {getSortIcon('date')}
                </span>
              </th>
              
              {/* Items */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('items')}
              >
                <span className="flex items-center gap-1">
                  Items {getSortIcon('items')}
                </span>
              </th>
              
              {/* Total */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('total')}
              >
                <span className="flex items-center gap-1">
                  Total {getSortIcon('total')}
                </span>
              </th>
              
              {/* Status */}
              <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                Status
              </th>
              
              {/* Payment Status */}
              <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                Payment
              </th>
              
              {/* Actions */}
              {showActions && (
                <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {paginatedOrders.map((order) => (
              <tr 
                key={order.id} 
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                {/* Checkbox */}
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    className="w-4 h-4 accent-green-500"
                  />
                </td>
                
                {/* Order Number */}
                <td className="p-4">
                  <Link 
                    href={`/dashboard/orders/${order.id}`}
                    className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                
                {/* Customer */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 
                                  rounded-full flex items-center justify-center text-white text-sm">
                      {order.customer.avatar || order.customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{order.customer.name}</p>
                      <p className="text-gray-400 text-xs">{order.customer.email}</p>
                    </div>
                  </div>
                </td>
                
                {/* Date */}
                <td className="p-4 text-gray-300 text-sm">
                  {formatDate(order.date)}
                </td>
                
                {/* Items */}
                <td className="p-4 text-gray-300 text-sm">
                  {order.items}
                </td>
                
                {/* Total */}
                <td className="p-4 text-green-400 font-semibold text-sm">
                  {formatPrice(order.total)}
                </td>
                
                {/* Status */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                
                {/* Payment Status */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </td>
                
                {/* Actions */}
                {showActions && (
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg 
                                 text-blue-400 transition-colors"
                        title="View Details"
                      >
                        👁️
                      </Link>
                      
                      {onUpdateStatus && (
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded 
                                   text-white text-xs focus:outline-none focus:border-green-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg 
                                   text-red-400 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 bg-white/10 rounded-lg text-white disabled:opacity-50 
                     disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            ←
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 bg-white/10 rounded-lg text-white disabled:opacity-50 
                     disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            →
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Order</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 
                           text-red-400 rounded-lg font-semibold transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 
                           text-gray-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {sortedOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-400">No orders found</p>
        </div>
      )}
    </div>
  )
}