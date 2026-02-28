'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Types
interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
    phone: string
  }
  billingAddress: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
    phone: string
  }
  createdAt: string
  updatedAt: string
  deliveredAt?: string
  cancelledAt?: string
  trackingNumber?: string
  shippingProvider?: string
  notes?: string
  adminNotes?: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingProvider, setShippingProvider] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Mock data - replace with API call
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock order data
        const mockOrder: Order = {
          id: params.id as string,
          orderNumber: `ORD-2024-${params.id}`,
          customer: {
            id: 'cust_1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+91 98765 43210'
          },
          items: [
            {
              id: 'item_1',
              productId: 'prod_1',
              productName: 'Nike Mercurial Superfly 9',
              productImage: '/images/products/n1.jpeg',
              quantity: 1,
              price: 24999,
              total: 24999
            },
            {
              id: 'item_2',
              productId: 'prod_2',
              productName: 'SG Test Cricket Bat',
              productImage: '/images/products/n3.jpeg',
              quantity: 1,
              price: 15999,
              total: 15999
            }
          ],
          subtotal: 40998,
          shippingCost: 99,
          taxAmount: 7379.64,
          discountAmount: 500,
          total: 47976.64,
          status: 'PROCESSING',
          paymentStatus: 'PAID',
          paymentMethod: 'UPI',
          shippingAddress: {
            name: 'John Doe',
            address: '123 Sports Avenue, Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            phone: '+91 98765 43210'
          },
          billingAddress: {
            name: 'John Doe',
            address: '123 Sports Avenue, Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            phone: '+91 98765 43210'
          },
          createdAt: '2024-03-15T10:30:00Z',
          updatedAt: '2024-03-15T14:20:00Z',
          trackingNumber: 'SPORTS123456789',
          shippingProvider: 'Delhivery',
          notes: 'Please leave at the door if not available',
          adminNotes: 'Priority customer - call before delivery'
        }
        
        setOrder(mockOrder)
        setSelectedStatus(mockOrder.status)
        setTrackingNumber(mockOrder.trackingNumber || '')
        setShippingProvider(mockOrder.shippingProvider || '')
        setAdminNotes(mockOrder.adminNotes || '')
      } catch (error) {
        console.error('Error fetching order')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-500/20 text-gray-400'}`}>
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
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    )
  }

  // Update status
  const handleUpdateStatus = async () => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder({ ...order, status: selectedStatus as Order['status'] })
      setShowStatusModal(false)
    } catch (error) {
      console.error('Error updating status')
    } finally {
      setIsUpdating(false)
    }
  }

  // Update tracking
  const handleUpdateTracking = async () => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder({ 
        ...order, 
        trackingNumber, 
        shippingProvider 
      })
      setShowTrackingModal(false)
    } catch (error) {
      console.error('Error updating tracking')
    } finally {
      setIsUpdating(false)
    }
  }

  // Update notes
  const handleUpdateNotes = async () => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder({ ...order, adminNotes })
      setShowNotesModal(false)
    } catch (error) {
      console.error('Error updating notes')
    } finally {
      setIsUpdating(false)
    }
  }

  // Cancel order
  const handleCancelOrder = async () => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder({ 
        ...order, 
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString()
      })
      setShowCancelModal(false)
    } catch (error) {
      console.error('Error cancelling order')
    } finally {
      setIsUpdating(false)
    }
  }

  // Process refund
  const handleProcessRefund = async () => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder({ 
        ...order, 
        status: 'REFUNDED',
        paymentStatus: 'REFUNDED'
      })
      setShowRefundModal(false)
    } catch (error) {
      console.error('Error processing refund')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
          <p className="text-gray-400 mb-6">The order you're looking for doesn't exist.</p>
          <Link 
            href="/dashboard/orders"
            className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

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
            <Link 
              href="/dashboard/orders"
              className="text-gray-400 hover:text-white mb-2 inline-block"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-400 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-colors"
            >
              Update Status
            </button>
            <button
              onClick={() => setShowTrackingModal(true)}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg font-semibold transition-colors"
            >
              Add Tracking
            </button>
            <button
              onClick={() => setShowNotesModal(true)}
              className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-semibold transition-colors"
            >
              Add Notes
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Order Status</p>
            <div className="mt-2">{getStatusBadge(order.status)}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Payment Status</p>
            <div className="mt-2">{getPaymentStatusBadge(order.paymentStatus)}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Payment Method</p>
            <p className="text-white font-semibold mt-2">{order.paymentMethod}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                      {item.productName.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.productName}</h3>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">Total: ₹{item.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white">₹{order.shippingCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (GST):</span>
                    <span className="text-white">₹{order.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Discount:</span>
                    <span className="text-green-400">-₹{order.discountAmount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/20">
                    <span className="text-white">Total:</span>
                    <span className="text-green-400">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {(order.trackingNumber || order.shippingProvider) && (
              <div className="bg-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Tracking Information</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {order.trackingNumber && (
                    <div>
                      <p className="text-gray-400 text-sm">Tracking Number</p>
                      <p className="text-white font-semibold">{order.trackingNumber}</p>
                    </div>
                  )}
                  
                  {order.shippingProvider && (
                    <div>
                      <p className="text-gray-400 text-sm">Shipping Provider</p>
                      <p className="text-white font-semibold">{order.shippingProvider}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {order.adminNotes && (
              <div className="bg-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Admin Notes</h2>
                <p className="text-gray-300">{order.adminNotes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Customer & Address Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Customer Details</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-semibold">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{order.customer.phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
              
              <div className="space-y-2">
                <p className="text-white font-semibold">{order.shippingAddress.name}</p>
                <p className="text-gray-300">{order.shippingAddress.address}</p>
                <p className="text-gray-300">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-gray-300">{order.shippingAddress.country}</p>
                <p className="text-gray-300 mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Billing Address</h2>
              
              <div className="space-y-2">
                <p className="text-white font-semibold">{order.billingAddress.name}</p>
                <p className="text-gray-300">{order.billingAddress.address}</p>
                <p className="text-gray-300">
                  {order.billingAddress.city}, {order.billingAddress.state} - {order.billingAddress.pincode}
                </p>
                <p className="text-gray-300">{order.billingAddress.country}</p>
                <p className="text-gray-300 mt-2">Phone: {order.billingAddress.phone}</p>
              </div>
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="bg-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Customer Notes</h2>
                <p className="text-gray-300">{order.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel Order
                </button>
              )}
              
              {order.paymentStatus === 'PAID' && order.status !== 'REFUNDED' && (
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg font-semibold transition-colors"
                >
                  Process Refund
                </button>
              )}
              
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg font-semibold transition-colors"
              >
                Print Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Update Order Status</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Select Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-green-400"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded font-semibold"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Update Tracking Info</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-green-400"
                  placeholder="Enter tracking number"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Shipping Provider</label>
                <select
                  value={shippingProvider}
                  onChange={(e) => setShippingProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-green-400"
                >
                  <option value="">Select Provider</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="DTDC">DTDC</option>
                  <option value="FedEx">FedEx</option>
                  <option value="India Post">India Post</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateTracking}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded font-semibold"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Admin Notes</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-green-400"
                  placeholder="Enter admin notes..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateNotes}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded font-semibold"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Cancel Order</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelOrder}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  {isUpdating ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded font-semibold"
                >
                  No, Keep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-xl font-bold text-white mb-2">Process Refund</h2>
              <p className="text-gray-300 mb-4">
                Refund amount: <span className="text-green-400 font-bold">₹{order.total.toLocaleString()}</span>
              </p>
              <p className="text-gray-300 mb-6">
                Are you sure you want to process a refund for this order?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleProcessRefund}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded font-semibold"
                >
                  {isUpdating ? 'Processing...' : 'Process Refund'}
                </button>
                <button
                  onClick={() => setShowRefundModal(false)}
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