'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Types
interface Coupon {
  id?: string
  code: string
  description: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  minPurchase: number
  maxDiscount?: number
  usageLimit?: number
  perUserLimit: number
  startDate: string
  endDate: string
  isActive: boolean
  applicableProducts?: string[]
  applicableCategories?: string[]
  excludeProducts?: string[]
}

interface CouponFormProps {
  initialData?: Partial<Coupon>
  products?: { id: string; name: string }[]
  categories?: { id: string; name: string }[]
  onSubmit?: (data: Coupon) => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  className?: string
}

export default function CouponForm({
  initialData = {},
  products = [],
  categories = [],
  onSubmit,
  isSubmitting = false,
  mode = 'create',
  className = ''
}: CouponFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Coupon>({
    code: '',
    description: '',
    type: 'percentage',
    value: 0,
    minPurchase: 0,
    maxDiscount: undefined,
    usageLimit: undefined,
    perUserLimit: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    applicableProducts: [],
    applicableCategories: [],
    excludeProducts: [],
    ...initialData
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('basic')
  const [showPreview, setShowPreview] = useState(false)

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error for this field
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }

    // Auto-uppercase coupon code
    if (name === 'code') {
      setFormData(prev => ({ ...prev, code: value.toUpperCase() }))
    }
  }

  // Handle multi-select
  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
      const current = prev[field as keyof Coupon] as string[] || []
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [field]: newValues }
    })
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Code validation
    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required'
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = 'Code can only contain uppercase letters and numbers'
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    // Value validation
    if (formData.type !== 'free_shipping') {
      if (formData.value <= 0) {
        newErrors.value = 'Value must be greater than 0'
      }
      if (formData.type === 'percentage' && formData.value > 100) {
        newErrors.value = 'Percentage cannot exceed 100%'
      }
    }

    // Min purchase validation
    if (formData.minPurchase < 0) {
      newErrors.minPurchase = 'Minimum purchase cannot be negative'
    }

    // Max discount validation
    if (formData.maxDiscount && formData.maxDiscount < 0) {
      newErrors.maxDiscount = 'Maximum discount cannot be negative'
    }

    // Per user limit validation
    if (formData.perUserLimit < 1) {
      newErrors.perUserLimit = 'Per user limit must be at least 1'
    }

    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (onSubmit) {
      await onSubmit(formData)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.back()
  }

  // Calculate discount preview
  const getDiscountPreview = () => {
    if (formData.type === 'free_shipping') {
      return 'Free Shipping'
    }
    if (formData.type === 'percentage') {
      return `${formData.value}% off`
    }
    return `₹${formData.value} off`
  }

  // Calculate example savings
  const getExampleSavings = () => {
    const exampleAmount = 5000
    if (formData.type === 'free_shipping') {
      return 'Free shipping'
    }
    if (formData.type === 'percentage') {
      const discount = (exampleAmount * formData.value) / 100
      const finalAmount = exampleAmount - discount
      return `On ₹5,000: Save ₹${discount.toFixed(0)}, Pay ₹${finalAmount.toFixed(0)}`
    }
    if (formData.type === 'fixed') {
      const finalAmount = Math.max(0, exampleAmount - formData.value)
      return `On ₹5,000: Save ₹${formData.value}, Pay ₹${finalAmount}`
    }
    return ''
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {mode === 'create' ? 'Create New Coupon' : 'Edit Coupon'}
        </h2>
        {mode === 'edit' && initialData.id && (
          <span className="text-sm text-gray-400">ID: {initialData.id}</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/20 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
            activeTab === 'basic'
              ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Basic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('restrictions')}
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
            activeTab === 'restrictions'
              ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Restrictions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('applicability')}
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
            activeTab === 'applicability'
              ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Applicability
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

          <div className="space-y-4">
            {/* Coupon Code */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Coupon Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="WELCOME10"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         placeholder-gray-400 font-mono uppercase
                         focus:outline-none focus:border-green-400 transition-colors 
                         ${errors.code ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.code && (
                <p className="text-red-400 text-xs mt-1">{errors.code}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe what this coupon offers..."
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         placeholder-gray-400 focus:outline-none focus:border-green-400 
                         transition-colors resize-none 
                         ${errors.description ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Discount Type <span className="text-red-400">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white focus:outline-none focus:border-green-400 transition-colors"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>

            {/* Discount Value */}
            {formData.type !== 'free_shipping' && (
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {formData.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₹)'}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  min="0"
                  max={formData.type === 'percentage' ? 100 : undefined}
                  step={formData.type === 'percentage' ? '1' : '0.01'}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                           focus:outline-none focus:border-green-400 transition-colors
                           ${errors.value ? 'border-red-500' : 'border-white/20'}`}
                />
                {errors.value && (
                  <p className="text-red-400 text-xs mt-1">{errors.value}</p>
                )}
              </div>
            )}

            {/* Preview */}
            <div className="bg-green-500/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <p className="text-white font-semibold">{getDiscountPreview()}</p>
              <p className="text-xs text-green-400 mt-1">{getExampleSavings()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Restrictions Tab */}
      {activeTab === 'restrictions' && (
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Usage Restrictions</h3>

          <div className="space-y-4">
            {/* Minimum Purchase */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Minimum Purchase Amount (₹)
              </label>
              <input
                type="number"
                name="minPurchase"
                value={formData.minPurchase}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${errors.minPurchase ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.minPurchase && (
                <p className="text-red-400 text-xs mt-1">{errors.minPurchase}</p>
              )}
            </div>

            {/* Maximum Discount */}
            {formData.type === 'percentage' && (
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Maximum Discount Amount (₹) (Optional)
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="No limit"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                           focus:outline-none focus:border-green-400 transition-colors
                           ${errors.maxDiscount ? 'border-red-500' : 'border-white/20'}`}
                />
                {errors.maxDiscount && (
                  <p className="text-red-400 text-xs mt-1">{errors.maxDiscount}</p>
                )}
              </div>
            )}

            {/* Usage Limit */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Total Usage Limit (Optional)
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit || ''}
                onChange={handleChange}
                min="1"
                placeholder="No limit"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white focus:outline-none focus:border-green-400 transition-colors"
              />
              <p className="text-gray-500 text-xs mt-1">
                Leave empty for unlimited uses
              </p>
            </div>

            {/* Per User Limit */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Per User Limit <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="perUserLimit"
                value={formData.perUserLimit}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${errors.perUserLimit ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.perUserLimit && (
                <p className="text-red-400 text-xs mt-1">{errors.perUserLimit}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applicability Tab */}
      {activeTab === 'applicability' && (
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Applicability</h3>

          <div className="space-y-6">
            {/* Valid Period */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Valid Period <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                             focus:outline-none focus:border-green-400 transition-colors
                             ${errors.startDate ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.startDate && (
                    <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                             focus:outline-none focus:border-green-400 transition-colors
                             ${errors.endDate ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.endDate && (
                    <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Applicable Categories */}
            {categories.length > 0 && (
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Applicable Categories
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 
                              bg-white/5 rounded-lg">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.applicableCategories?.includes(category.id) || false}
                        onChange={() => handleMultiSelect('applicableCategories', category.id)}
                        className="w-4 h-4 accent-green-500"
                      />
                      <span className="text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Leave empty to apply to all categories
                </p>
              </div>
            )}

            {/* Applicable Products */}
            {products.length > 0 && (
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Applicable Products
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 
                              bg-white/5 rounded-lg">
                  {products.map(product => (
                    <label key={product.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.applicableProducts?.includes(product.id) || false}
                        onChange={() => handleMultiSelect('applicableProducts', product.id)}
                        className="w-4 h-4 accent-green-500"
                      />
                      <span className="text-gray-300 truncate">{product.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Leave empty to apply to all products
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Toggle */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 accent-green-500"
          />
          <div>
            <p className="text-white font-medium">Active Coupon</p>
            <p className="text-sm text-gray-400">
              Inactive coupons won't be available for use
            </p>
          </div>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 
                   rounded-lg font-semibold transition-colors"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg 
                   font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white 
                   rounded-lg font-semibold hover:scale-105 transition-all 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent 
                             rounded-full animate-spin"></span>
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </span>
          ) : (
            mode === 'create' ? 'Create Coupon' : 'Save Changes'
          )}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl 
                        max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Coupon Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 
                          rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🎫</div>
              <p className="text-2xl font-bold text-white mb-2">{formData.code || 'COUPON'}</p>
              <p className="text-gray-300 mb-4">{formData.description || 'Discount description'}</p>
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <p className="text-3xl font-bold text-green-400">{getDiscountPreview()}</p>
                {formData.minPurchase > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    Min. Purchase: ₹{formData.minPurchase}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Valid: {formData.startDate} to {formData.endDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 font-semibold mb-2">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  )
}