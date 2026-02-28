'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
  brand: string
  status: 'published' | 'draft' | 'archived'
  image?: string
  createdAt: string
}

interface ProductTableProps {
  products: Product[]
  onView?: (productId: string) => void
  onEdit?: (productId: string) => void
  onDelete?: (productId: string) => void
  onStatusChange?: (productId: string, status: string) => void
  showActions?: boolean
  className?: string
}

export default function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  showActions = true,
  className = ''
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<keyof Product>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const itemsPerPage = 10

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(p => p.category))]

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handle sort
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(paginatedProducts.map(p => p.id))
    }
  }

  // Handle select product
  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  // Handle delete
  const handleDelete = (productId: string) => {
    setProductToDelete(productId)
    setShowDeleteModal(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (productToDelete && onDelete) {
      onDelete(productToDelete)
      setShowDeleteModal(false)
      setProductToDelete(null)
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
      'published': 'bg-green-500/20 text-green-400',
      'draft': 'bg-yellow-500/20 text-yellow-400',
      'archived': 'bg-gray-500/20 text-gray-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  // Get stock status color
  const getStockColor = (stock: number) => {
    if (stock <= 0) return 'text-red-400'
    if (stock <= 10) return 'text-yellow-400'
    return 'text-green-400'
  }

  // Get sort icon
  const getSortIcon = (field: keyof Product) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Products</h2>
        
        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-400">
              {selectedProducts.length} selected
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 
                     rounded-lg text-white placeholder-gray-400 
                     focus:outline-none focus:border-green-400"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                   text-white focus:outline-none focus:border-green-400"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                   text-white focus:outline-none focus:border-green-400"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
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
                  checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-green-500"
                />
              </th>
              
              {/* Product */}
              <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                Product
              </th>
              
              {/* SKU */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('sku')}
              >
                <span className="flex items-center gap-1">
                  SKU {getSortIcon('sku')}
                </span>
              </th>
              
              {/* Category */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <span className="flex items-center gap-1">
                  Category {getSortIcon('category')}
                </span>
              </th>
              
              {/* Brand */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('brand')}
              >
                <span className="flex items-center gap-1">
                  Brand {getSortIcon('brand')}
                </span>
              </th>
              
              {/* Price */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <span className="flex items-center gap-1">
                  Price {getSortIcon('price')}
                </span>
              </th>
              
              {/* Stock */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                <span className="flex items-center gap-1">
                  Stock {getSortIcon('stock')}
                </span>
              </th>
              
              {/* Status */}
              <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                Status
              </th>
              
              {/* Created */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <span className="flex items-center gap-1">
                  Created {getSortIcon('createdAt')}
                </span>
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
            {paginatedProducts.map((product) => (
              <tr 
                key={product.id} 
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                {/* Checkbox */}
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="w-4 h-4 accent-green-500"
                  />
                </td>
                
                {/* Product */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 
                                  rounded-lg flex items-center justify-center text-white">
                      {product.image ? '📷' : product.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{product.name}</p>
                      <p className="text-gray-400 text-xs">{product.brand}</p>
                    </div>
                  </div>
                </td>
                
                {/* SKU */}
                <td className="p-4 text-gray-300 text-sm font-mono">
                  {product.sku}
                </td>
                
                {/* Category */}
                <td className="p-4 text-gray-300 text-sm">
                  {product.category}
                </td>
                
                {/* Brand */}
                <td className="p-4 text-gray-300 text-sm">
                  {product.brand}
                </td>
                
                {/* Price */}
                <td className="p-4 text-green-400 font-semibold text-sm">
                  {formatPrice(product.price)}
                </td>
                
                {/* Stock */}
                <td className="p-4">
                  <span className={`text-sm font-semibold ${getStockColor(product.stock)}`}>
                    {product.stock}
                  </span>
                </td>
                
                {/* Status */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </td>
                
                {/* Created */}
                <td className="p-4 text-gray-300 text-sm">
                  {formatDate(product.createdAt)}
                </td>
                
                {/* Actions */}
                {showActions && (
                  <td className="p-4">
                    <div className="flex gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(product.id)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg 
                                   text-blue-400 transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                      )}
                      
                      {onEdit && (
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg 
                                   text-purple-400 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                      )}
                      
                      {onStatusChange && (
                        <select
                          value={product.status}
                          onChange={(e) => onStatusChange(product.id, e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded 
                                   text-white text-xs focus:outline-none focus:border-green-400"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(product.id)}
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
              <h3 className="text-xl font-bold text-white mb-2">Delete Product</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
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
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-400">No products found</p>
        </div>
      )}
    </div>
  )
}