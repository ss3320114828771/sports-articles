'use client'

import { useState } from 'react'

// Simple Coupon Type
interface Coupon {
  id: string
  code: string
  description: string
  type: string
  value: number
  minPurchase: number
  usedCount: number
  usageLimit: number | null
  endDate: string
  isActive: boolean
}

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Simple mock data
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME10',
      description: '10% off on first order',
      type: 'PERCENTAGE',
      value: 10,
      minPurchase: 1000,
      usedCount: 245,
      usageLimit: 1000,
      endDate: '2024-12-31',
      isActive: true
    },
    {
      id: '2',
      code: 'SPORTS500',
      description: '₹500 off on orders above ₹5000',
      type: 'FIXED',
      value: 500,
      minPurchase: 5000,
      usedCount: 128,
      usageLimit: 500,
      endDate: '2024-05-31',
      isActive: true
    },
    {
      id: '3',
      code: 'FREESHIP',
      description: 'Free shipping on all orders',
      type: 'FREE_SHIPPING',
      value: 0,
      minPurchase: 1000,
      usedCount: 567,
      usageLimit: 1000,
      endDate: '2024-04-30',
      isActive: true
    },
    {
      id: '4',
      code: 'SUMMER25',
      description: '25% off on summer collection',
      type: 'PERCENTAGE',
      value: 25,
      minPurchase: 2000,
      usedCount: 200,
      usageLimit: 200,
      endDate: '2024-06-30',
      isActive: false
    }
  ])

  // Simple form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: '',
    minPurchase: '',
    usageLimit: '',
    endDate: '',
    isActive: true
  })

  // Filter coupons
  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Add coupon
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        description: formData.description,
        type: formData.type,
        value: Number(formData.value),
        minPurchase: Number(formData.minPurchase),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        usedCount: 0,
        endDate: formData.endDate,
        isActive: formData.isActive
      }
      
      setCoupons([newCoupon, ...coupons])
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Error adding coupon')
    } finally {
      setIsLoading(false)
    }
  }

  // Edit coupon
  const handleEditCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCoupon) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCoupons(coupons.map(coupon => 
        coupon.id === selectedCoupon.id 
          ? { 
              ...coupon, 
              code: formData.code.toUpperCase(),
              description: formData.description,
              type: formData.type,
              value: Number(formData.value),
              minPurchase: Number(formData.minPurchase),
              usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
              endDate: formData.endDate,
              isActive: formData.isActive
            }
          : coupon
      ))
      
      setShowEditModal(false)
      resetForm()
    } catch (error) {
      console.error('Error editing coupon')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete coupon
  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCoupons(coupons.filter(coupon => coupon.id !== selectedCoupon.id))
      setShowDeleteModal(false)
      setSelectedCoupon(null)
    } catch (error) {
      console.error('Error deleting coupon')
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: '',
      minPurchase: '',
      usageLimit: '',
      endDate: '',
      isActive: true
    })
    setSelectedCoupon(null)
  }

  // Open edit modal
  const openEditModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase.toString(),
      usageLimit: coupon.usageLimit?.toString() || '',
      endDate: coupon.endDate,
      isActive: coupon.isActive
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setShowDeleteModal(true)
  }

  // Toggle status
  const toggleStatus = (coupon: Coupon) => {
    setCoupons(coupons.map(c => 
      c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
    ))
  }

  // Check if expired
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  // Get status badge
  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) {
      return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Inactive</span>
    }
    if (isExpired(coupon.endDate)) {
      return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">Expired</span>
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">Used Up</span>
    }
    return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Active</span>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Coupons</h1>
          
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold hover:scale-105 transition-all"
          >
            + Add Coupon
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Total</p>
            <p className="text-xl font-bold text-white">{coupons.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Active</p>
            <p className="text-xl font-bold text-green-400">
              {coupons.filter(c => c.isActive && !isExpired(c.endDate)).length}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Expired</p>
            <p className="text-xl font-bold text-gray-400">
              {coupons.filter(c => isExpired(c.endDate)).length}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Used</p>
            <p className="text-xl font-bold text-yellow-400">
              {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
            </p>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map(coupon => (
              <div key={coupon.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-white">{coupon.code}</span>
                    </div>
                    {getStatusBadge(coupon)}
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleStatus(coupon)}
                      className={`p-1.5 rounded text-sm ${
                        coupon.isActive 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {coupon.isActive ? '🔴' : '🟢'}
                    </button>
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="p-1.5 bg-blue-500/20 text-blue-400 rounded text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => openDeleteModal(coupon)}
                      className="p-1.5 bg-red-500/20 text-red-400 rounded text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-2">{coupon.description}</p>

                {/* Details */}
                <div className="space-y-1 text-sm">
                  <p className="text-gray-500">
                    Discount: <span className="text-white">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : 
                       coupon.type === 'FIXED' ? `₹${coupon.value}` : 
                       'Free Shipping'}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    Min Purchase: <span className="text-white">₹{coupon.minPurchase}</span>
                  </p>
                  <p className="text-gray-500">
                    Used: <span className="text-white">{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                  </p>
                  <p className="text-gray-500">
                    Valid Till: <span className={isExpired(coupon.endDate) ? 'text-red-400' : 'text-green-400'}>
                      {coupon.endDate}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No coupons found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Coupon</h2>
            
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Description *</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>

              {formData.type !== 'FREE_SHIPPING' && (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    {formData.type === 'PERCENTAGE' ? 'Percentage *' : 'Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-1">Min Purchase (₹) *</label>
                <input
                  type="number"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Usage Limit (Optional)</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-gray-300">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded font-semibold"
                >
                  {isLoading ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Edit Coupon</h2>
            
            <form onSubmit={handleEditCoupon} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>

              {formData.type !== 'FREE_SHIPPING' && (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    {formData.type === 'PERCENTAGE' ? 'Percentage' : 'Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-1">Min Purchase (₹)</label>
                <input
                  type="number"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-gray-300">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded font-semibold"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Coupon</h2>
              <p className="text-gray-300 mb-6">
                Delete "{selectedCoupon.code}"? This cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCoupon}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded font-semibold"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedCoupon(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-400 rounded font-semibold"
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