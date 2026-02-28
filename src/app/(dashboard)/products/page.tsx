'use client'

import { useState } from 'react'
import Link from 'next/link'

// Simple Product Type
interface Product {
  id: string
  name: string
  sku: string
  price: number
  category: string
  brand: string
  stock: number
  status: 'Published' | 'Draft'
  image: string
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Nike Mercurial Superfly 9',
      sku: 'NK-FB-001',
      price: 24999,
      category: 'Football',
      brand: 'Nike',
      stock: 45,
      status: 'Published',
      image: 'n1.jpeg'
    },
    {
      id: '2',
      name: 'Adidas Predator Edge',
      sku: 'AD-FB-002',
      price: 22999,
      category: 'Football',
      brand: 'Adidas',
      stock: 32,
      status: 'Published',
      image: 'n2.jpeg'
    },
    {
      id: '3',
      name: 'SG Test Cricket Bat',
      sku: 'SG-CR-001',
      price: 15999,
      category: 'Cricket',
      brand: 'SG',
      stock: 18,
      status: 'Published',
      image: 'n3.jpeg'
    },
    {
      id: '4',
      name: 'Adidas Cricket Helmet',
      sku: 'AD-CR-002',
      price: 4999,
      category: 'Cricket',
      brand: 'Adidas',
      stock: 27,
      status: 'Draft',
      image: 'n4.jpeg'
    },
    {
      id: '5',
      name: 'Nike Air Jordan',
      sku: 'NK-BB-001',
      price: 18999,
      category: 'Basketball',
      brand: 'Nike',
      stock: 23,
      status: 'Published',
      image: 'n5.jpeg'
    },
    {
      id: '6',
      name: 'Yonex EZONE 100',
      sku: 'YN-TN-001',
      price: 15999,
      category: 'Tennis',
      brand: 'Yonex',
      stock: 15,
      status: 'Draft',
      image: 'n6.jpeg'
    }
  ])

  // Get unique categories for filter
  const categories = ['ALL', ...new Set(products.map(p => p.category))]

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Category filter
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter
    
    // Status filter
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Handle delete
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setShowDeleteModal(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error deleting product')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle status
  const toggleStatus = (product: Product) => {
    setProducts(products.map(p => 
      p.id === product.id 
        ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' }
        : p
    ))
  }

  // Calculate stats
  const totalProducts = products.length
  const publishedProducts = products.filter(p => p.status === 'Published').length
  const draftProducts = products.filter(p => p.status === 'Draft').length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Products</h1>
            <p className="text-gray-400">Manage your product catalog</p>
          </div>
          
          <Link
            href="/dashboard/products/new"
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold hover:scale-105 transition-all"
          >
            ➕ Add New Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{totalProducts}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Published</p>
            <p className="text-2xl font-bold text-green-400">{publishedProducts}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Draft</p>
            <p className="text-2xl font-bold text-yellow-400">{draftProducts}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Stock</p>
            <p className="text-2xl font-bold text-blue-400">{totalStock}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Value</p>
            <p className="text-2xl font-bold text-purple-400">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            <option value="ALL">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Product</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">SKU</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Category</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Brand</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Price</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Stock</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {product.name.charAt(0)}
                          </div>
                          <span className="text-white font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300 font-mono">{product.sku}</td>
                      <td className="p-4 text-gray-300">{product.category}</td>
                      <td className="p-4 text-gray-300">{product.brand}</td>
                      <td className="p-4 text-green-400 font-semibold">₹{product.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.stock > 20 ? 'bg-green-500/20 text-green-400' :
                          product.stock > 10 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.status === 'Published' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/products/${product.id}`}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                            title="View"
                          >
                            👁️
                          </Link>
                          <button
                            onClick={() => toggleStatus(product)}
                            className={`p-2 rounded transition-colors ${
                              product.status === 'Published'
                                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                            }`}
                            title={product.status === 'Published' ? 'Unpublish' : 'Publish'}
                          >
                            {product.status === 'Published' ? '🔴' : '🟢'}
                          </button>
                          <Link
                            href={`/dashboard/products/${product.id}/edit`}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-400 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedProduct(product)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Categories Distribution</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.filter(c => c !== 'ALL').map(cat => (
                <span key={cat} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {cat} ({products.filter(p => p.category === cat).length})
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Brands Distribution</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[...new Set(products.map(p => p.brand))].map(brand => (
                <span key={brand} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  {brand} ({products.filter(p => p.brand === brand).length})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Product</h2>
              <p className="text-gray-300 mb-6">
                Delete <span className="font-bold text-red-400">{selectedProduct.name}</span>? 
                This cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteProduct}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedProduct(null)
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