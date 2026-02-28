'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Simple types
interface ProductFormData {
  name: string
  description: string
  price: number
  sku: string
  categoryId: string
  brandId: string
  quantity: number
  isPublished: boolean
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  categories?: { id: string; name: string }[]
  brands?: { id: string; name: string }[]
  onSubmit?: (data: ProductFormData) => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
}

export default function ProductForm({
  initialData = {},
  categories = [],
  brands = [],
  onSubmit,
  isSubmitting = false,
  mode = 'create'
}: ProductFormProps) {
  const router = useRouter()
  
  // Simple form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || 0,
    sku: initialData.sku || '',
    categoryId: initialData.categoryId || '',
    brandId: initialData.brandId || '',
    quantity: initialData.quantity || 0,
    isPublished: initialData.isPublished || false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
  }

  // Handle number input
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : 0
    }))
  }

  // Simple validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </h2>
      </div>

      {/* Form Fields */}
      <div className="bg-white/10 rounded-xl p-6 space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nike Mercurial Superfly 9"
            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                     placeholder-gray-400 focus:outline-none focus:border-green-400
                     ${errors.name ? 'border-red-500' : 'border-white/20'}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
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
            rows={4}
            placeholder="Product description..."
            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                     placeholder-gray-400 focus:outline-none focus:border-green-400
                     ${errors.description ? 'border-red-500' : 'border-white/20'}`}
          />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Price and SKU */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Price (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleNumberChange}
              min="0"
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       focus:outline-none focus:border-green-400
                       ${errors.price ? 'border-red-500' : 'border-white/20'}`}
            />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              SKU <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="NK-FB-001"
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       placeholder-gray-400 focus:outline-none focus:border-green-400
                       ${errors.sku ? 'border-red-500' : 'border-white/20'}`}
            />
            {errors.sku && <p className="text-red-400 text-xs mt-1">{errors.sku}</p>}
          </div>
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       focus:outline-none focus:border-green-400
                       ${errors.categoryId ? 'border-red-500' : 'border-white/20'}`}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Brand</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-green-400"
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">Stock Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleNumberChange}
            min="0"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                     text-white focus:outline-none focus:border-green-400"
          />
        </div>

        {/* Published Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer pt-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-5 h-5 accent-green-500"
          />
          <span className="text-white">Publish immediately</span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
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
                   disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}