'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Simple product type
interface ProductFormData {
  name: string
  description: string
  price: string
  sku: string
  category: string
  brand: string
  quantity: string
  isPublished: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Simple form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    sku: '',
    category: '',
    brand: '',
    quantity: '0',
    isPublished: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Categories
  const categories = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Swimming', 'Boxing']
  
  // Brands
  const brands = ['Nike', 'Adidas', 'Puma', 'SG', 'Yonex']

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    return newErrors
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/dashboard/products?success=created')
    } catch (error) {
      console.error('Error creating product')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (confirm('Discard changes?')) {
      router.push('/dashboard/products')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Bismillah */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/dashboard/products" className="text-gray-400 hover:text-white">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-white mt-2">Add New Product</h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 rounded-lg p-6 space-y-6">
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
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white ${
                errors.name ? 'border-red-500' : 'border-white/20'
              }`}
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
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white ${
                errors.description ? 'border-red-500' : 'border-white/20'
              }`}
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
                onChange={handleChange}
                placeholder="24999"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white ${
                  errors.price ? 'border-red-500' : 'border-white/20'
                }`}
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
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white ${
                  errors.sku ? 'border-red-500' : 'border-white/20'
                }`}
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
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white ${
                  errors.category ? 'border-red-500' : 'border-white/20'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
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
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          {/* Published */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <div>
              <p className="text-white font-semibold">Publish Immediately</p>
              <p className="text-gray-400 text-sm">Make product visible to customers</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}