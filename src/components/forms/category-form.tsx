'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Types
interface Category {
  id?: string
  name: string
  slug: string
  description: string
  parentId: string | null
  image?: string
  isActive: boolean
  order: number
}

interface CategoryFormProps {
  initialData?: Partial<Category>
  categories?: { id: string; name: string }[]
  onSubmit?: (data: Category) => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  className?: string
}

export default function CategoryForm({
  initialData = {},
  categories = [],
  onSubmit,
  isSubmitting = false,
  mode = 'create',
  className = ''
}: CategoryFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Category>({
    name: '',
    slug: '',
    description: '',
    parentId: null,
    image: '',
    isActive: true,
    order: 0,
    ...initialData
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  // Generate slug from name
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle name change with auto-slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : generateSlug(name)
    }))

    // Clear name error
    if (errors.name) {
      const newErrors = { ...errors }
      delete newErrors.name
      setErrors(newErrors)
    }
  }

  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true)
    setFormData(prev => ({ ...prev, slug: e.target.value }))

    // Clear slug error
    if (errors.slug) {
      const newErrors = { ...errors }
      delete newErrors.slug
      setErrors(newErrors)
    }
  }

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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Category name must be less than 50 characters'
    }

    // Slug validation
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    // Parent category validation (can't be its own parent)
    if (formData.parentId === initialData.id) {
      newErrors.parentId = 'Category cannot be its own parent'
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

  // Preview slug in URL format
  const getPreviewUrl = () => {
    if (!formData.slug) return ''
    return `/shop/categories/${formData.slug}`
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {mode === 'create' ? 'Create New Category' : 'Edit Category'}
        </h2>
        {mode === 'edit' && initialData.id && (
          <span className="text-sm text-gray-400">ID: {initialData.id}</span>
        )}
      </div>

      {/* Basic Information */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., Football, Cricket, Basketball"
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       placeholder-gray-400 focus:outline-none focus:border-green-400 
                       transition-colors ${errors.name ? 'border-red-500' : 'border-white/20'}`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Slug Field */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              URL Slug <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">/shop/categories/</span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="football"
                className={`flex-1 px-4 py-3 bg-white/10 border rounded-lg text-white 
                         placeholder-gray-400 focus:outline-none focus:border-green-400 
                         transition-colors ${errors.slug ? 'border-red-500' : 'border-white/20'}`}
              />
            </div>
            {errors.slug && (
              <p className="text-red-400 text-xs mt-1">{errors.slug}</p>
            )}
            {formData.slug && !errors.slug && (
              <p className="text-green-400 text-xs mt-1">
                Preview: {getPreviewUrl()}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe this category..."
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       placeholder-gray-400 focus:outline-none focus:border-green-400 
                       transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-white/20'}`}
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Category Settings */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Category Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Category */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Parent Category</label>
            <select
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       focus:outline-none focus:border-green-400 transition-colors
                       ${errors.parentId ? 'border-red-500' : 'border-white/20'}`}
            >
              <option value="">None (Top Level Category)</option>
              {categories
                .filter(c => c.id !== initialData.id) // Can't select self as parent
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            {errors.parentId && (
              <p className="text-red-400 text-xs mt-1">{errors.parentId}</p>
            )}
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              max="999"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-green-400 transition-colors"
            />
            <p className="text-gray-500 text-xs mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>
      </div>

      {/* SEO & Media */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">SEO & Media</h3>

        <div className="space-y-4">
          {/* Category Image */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Category Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/images/categories/football.jpg"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:border-green-400 
                       transition-colors"
            />
            <p className="text-gray-500 text-xs mt-1">
              Recommended size: 400x400px
            </p>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="mt-2">
              <p className="text-gray-300 text-sm mb-2">Preview:</p>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-500/20 
                            rounded-lg flex items-center justify-center">
                <span className="text-3xl">📷</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
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
            <p className="text-white font-medium">Active Category</p>
            <p className="text-sm text-gray-400">
              Inactive categories are hidden from the store
            </p>
          </div>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4">
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
            mode === 'create' ? 'Create Category' : 'Save Changes'
          )}
        </button>
      </div>

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