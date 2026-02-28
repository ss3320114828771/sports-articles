'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Types
interface Brand {
  id: string
  name: string
  slug: string
  logo: string
  description: string
  website: string
  productCount: number
  isActive: boolean
  createdAt: string
}

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock data - replace with API call
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: '1',
      name: 'Nike',
      slug: 'nike',
      logo: '/images/brands/nike.png',
      description: 'Leading sports brand with innovative products',
      website: 'https://www.nike.com',
      productCount: 45,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Adidas',
      slug: 'adidas',
      logo: '/images/brands/adidas.png',
      description: 'German sports brand known for quality',
      website: 'https://www.adidas.com',
      productCount: 38,
      isActive: true,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Puma',
      slug: 'puma',
      logo: '/images/brands/puma.png',
      description: 'Sports lifestyle brand',
      website: 'https://www.puma.com',
      productCount: 25,
      isActive: true,
      createdAt: '2024-01-05'
    },
    {
      id: '4',
      name: 'SG',
      slug: 'sg',
      logo: '/images/brands/sg.png',
      description: 'Cricket equipment specialist',
      website: 'https://www.sgcricket.com',
      productCount: 32,
      isActive: false,
      createdAt: '2023-12-20'
    },
    {
      id: '5',
      name: 'Yonex',
      slug: 'yonex',
      logo: '/images/brands/yonex.png',
      description: 'Badminton and tennis expert',
      website: 'https://www.yonex.com',
      productCount: 28,
      isActive: true,
      createdAt: '2023-12-15'
    }
  ])

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    logo: '',
    isActive: true
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Filter brands based on search
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle name change with auto slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Brand name is required'
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }
    
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errors.website = 'Please enter a valid URL (including http:// or https://)'
    }
    
    return errors
  }

  // Handle add brand
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newBrand: Brand = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setBrands(prev => [newBrand, ...prev])
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Error adding brand:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle edit brand
  const handleEditBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBrands(prev => prev.map(brand => 
        brand.id === selectedBrand?.id 
          ? { ...brand, ...formData }
          : brand
      ))
      
      setShowEditModal(false)
      resetForm()
    } catch (error) {
      console.error('Error editing brand:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete brand
  const handleDeleteBrand = async () => {
    if (!selectedBrand) return
    
    setIsLoading(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBrands(prev => prev.filter(brand => brand.id !== selectedBrand.id))
      setShowDeleteModal(false)
      setSelectedBrand(null)
    } catch (error) {
      console.error('Error deleting brand:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      website: '',
      logo: '',
      isActive: true
    })
    setFormErrors({})
    setSelectedBrand(null)
  }

  // Open edit modal
  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      website: brand.website,
      logo: brand.logo,
      isActive: brand.isActive
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (brand: Brand) => {
    setSelectedBrand(brand)
    setShowDeleteModal(true)
  }

  // Toggle brand status
  const toggleStatus = async (brand: Brand) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setBrands(prev => prev.map(b => 
        b.id === brand.id 
          ? { ...b, isActive: !b.isActive }
          : b
      ))
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Bismillah at top */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'rgb-pulse 3s infinite'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Brands</h1>
            <p className="text-gray-300">Manage your product brands</p>
          </div>
          
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              backgroundSize: '300% 300%',
              animation: 'gradient-shift 3s infinite'
            }}
          >
            ➕ Add New Brand
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20 hover:border-green-400 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Brand Logo Placeholder */}
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-400 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{brand.name}</h3>
                    <p className="text-sm text-gray-400">{brand.productCount} products</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  brand.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {brand.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {brand.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-20">Website:</span>
                  <a 
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 truncate"
                  >
                    {brand.website.replace('https://', '')}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-20">Slug:</span>
                  <span className="text-gray-300">{brand.slug}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-20">Created:</span>
                  <span className="text-gray-300">{brand.createdAt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => toggleStatus(brand)}
                  className={`p-2 rounded-lg transition-colors ${
                    brand.isActive 
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                  }`}
                  title={brand.isActive ? 'Deactivate' : 'Activate'}
                >
                  {brand.isActive ? '🔴' : '🟢'}
                </button>
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => openDeleteModal(brand)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {filteredBrands.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏷️</div>
              <p className="text-gray-400 text-lg">No brands found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-green-400 hover:text-green-300"
              >
                Add your first brand
              </button>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="backdrop-blur-xl bg-white/10 rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Total Brands</p>
            <p className="text-2xl font-bold text-white">{brands.length}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Active Brands</p>
            <p className="text-2xl font-bold text-green-400">
              {brands.filter(b => b.isActive).length}
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-blue-400">
              {brands.reduce((sum, b) => sum + b.productCount, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl max-w-md w-full p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Brand</h2>
            
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Brand Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-green-400 ${
                    formErrors.name ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-green-400 ${
                    formErrors.slug ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {formErrors.slug && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.slug}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-green-400 ${
                    formErrors.description ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-green-400 ${
                    formErrors.website ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {formErrors.website && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.website}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Logo URL</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="/images/brands/logo.png"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-green-500"
                />
                <label className="text-gray-300">Active</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Brand'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {showEditModal && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl max-w-md w-full p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Brand</h2>
            
            <form onSubmit={handleEditBrand} className="space-y-4">
              {/* Same form fields as add modal */}
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Brand Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-green-500"
                />
                <label className="text-gray-300">Active</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Brand'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl max-w-md w-full p-6 border border-white/20">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-2">Delete Brand</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-bold text-red-400">{selectedBrand.name}</span>?
                This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteBrand}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedBrand(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes rgb-pulse {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  )
}