'use client'

import { useState } from 'react'

// Simple Category Type
interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  productCount: number
  isActive: boolean
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Simple mock data
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Sports Equipment',
      slug: 'sports-equipment',
      description: 'All types of sports equipment',
      parentId: null,
      productCount: 156,
      isActive: true
    },
    {
      id: '2',
      name: 'Football',
      slug: 'football',
      description: 'Football boots, balls, and accessories',
      parentId: '1',
      productCount: 45,
      isActive: true
    },
    {
      id: '3',
      name: 'Cricket',
      slug: 'cricket',
      description: 'Cricket bats, balls, and protective gear',
      parentId: '1',
      productCount: 38,
      isActive: true
    },
    {
      id: '4',
      name: 'Basketball',
      slug: 'basketball',
      description: 'Basketball shoes, jerseys, and equipment',
      parentId: '1',
      productCount: 32,
      isActive: true
    }
  ])

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    isActive: true
  })

  // Get parent categories
  const parentCategories = categories.filter(c => c.parentId === null)

  // Generate slug
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        parentId: formData.parentId || null,
        productCount: 0,
        isActive: formData.isActive
      }
      
      setCategories([newCategory, ...categories])
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Error adding category')
    } finally {
      setIsLoading(false)
    }
  }

  // Edit category
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { 
              ...cat, 
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              parentId: formData.parentId || null,
              isActive: formData.isActive
            }
          : cat
      ))
      
      setShowEditModal(false)
      resetForm()
    } catch (error) {
      console.error('Error editing category')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id))
      setShowDeleteModal(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error deleting category')
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
      parentId: '',
      isActive: true
    })
    setSelectedCategory(null)
  }

  // Open edit modal
  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId || '',
      isActive: category.isActive
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  // Toggle status
  const toggleStatus = (category: Category) => {
    setCategories(categories.map(c => 
      c.id === category.id ? { ...c, isActive: !c.isActive } : c
    ))
  }

  // Get child categories
  const getChildCategories = (parentId: string) => {
    return categories.filter(c => c.parentId === parentId)
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Categories</h1>
          
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold hover:scale-105 transition-all"
          >
            + Add New
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
          />
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {parentCategories
            .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(parent => {
              const children = getChildCategories(parent.id)
              
              return (
                <div key={parent.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                  {/* Parent Category */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white">{parent.name}</span>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          parent.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {parent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{parent.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>📦 {parent.productCount} products</span>
                        <span>🏷️ {children.length} subcategories</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(parent)}
                        className={`p-2 rounded ${parent.isActive ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                      >
                        {parent.isActive ? '🔴' : '🟢'}
                      </button>
                      <button
                        onClick={() => openEditModal(parent)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openDeleteModal(parent)}
                        className="p-2 bg-red-500/20 text-red-400 rounded"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Child Categories */}
                  {children.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-white/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {children
                          .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(child => (
                            <div key={child.id} className="bg-white/5 rounded p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{child.name}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      child.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {child.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">{child.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">📦 {child.productCount} products</p>
                                </div>
                                
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => toggleStatus(child)}
                                    className={`p-1 text-xs rounded ${child.isActive ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                                  >
                                    {child.isActive ? '🔴' : '🟢'}
                                  </button>
                                  <button
                                    onClick={() => openEditModal(child)}
                                    className="p-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(child)}
                                    className="p-1 bg-red-500/20 text-red-400 rounded text-xs"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Total</p>
            <p className="text-xl font-bold text-white">{categories.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Parent</p>
            <p className="text-xl font-bold text-blue-400">{parentCategories.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Sub</p>
            <p className="text-xl font-bold text-yellow-400">
              {categories.filter(c => c.parentId !== null).length}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Active</p>
            <p className="text-xl font-bold text-green-400">
              {categories.filter(c => c.isActive).length}
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Category</h2>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-gray-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={handleInputChange}
                  name="description"
                  rows={2}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Parent Category</label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-gray-300 text-sm">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded font-semibold"
                >
                  {isLoading ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Edit Category</h2>
            
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={handleInputChange}
                  name="description"
                  rows={2}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Parent Category</label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories
                    .filter(c => c.id !== selectedCategory.id)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-gray-300 text-sm">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded font-semibold"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Category</h2>
              <p className="text-gray-300 mb-6">
                Delete "{selectedCategory.name}"? This cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCategory}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedCategory(null)
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