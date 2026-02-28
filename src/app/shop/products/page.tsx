'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Types
interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string
  category: string
  brand: string
  rating: number
  reviewCount: number
  isNew?: boolean
  discount?: number
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Categories and brands for filters
  const categories = ['all', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Swimming', 'Boxing']
  const brands = ['all', 'Nike', 'Adidas', 'Puma', 'SG', 'Yonex', 'Speedo', 'Everlast']

  // Mock products data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Generate mock products
        const mockProducts: Product[] = []
        for (let i = 1; i <= 24; i++) {
          const category = categories[Math.floor(Math.random() * (categories.length - 1)) + 1]
          const brand = brands[Math.floor(Math.random() * (brands.length - 1)) + 1]
          const price = Math.floor(Math.random() * 20000) + 1999
          const comparePrice = Math.random() > 0.5 ? price + Math.floor(Math.random() * 5000) + 1000 : null
          const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : undefined
          
          mockProducts.push({
            id: i.toString(),
            name: `${brand} ${category} Product ${i}`,
            slug: `product-${i}`,
            price,
            comparePrice,
            image: `/images/n${(i % 6) + 1}.jpeg`,
            category,
            brand,
            rating: Number((Math.random() * 2 + 3).toFixed(1)),
            reviewCount: Math.floor(Math.random() * 100) + 10,
            isNew: Math.random() > 0.7,
            discount
          })
        }
        
        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
      } catch (error) {
        console.error('Error loading products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Search filter
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand === selectedBrand)
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default: // popular
        result.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy, products])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setPriceRange([0, 100000])
    setSortBy('popular')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Bismillah */}
      <div className="text-center py-6 bg-black/20">
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
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">All Products</h1>
          <p className="text-gray-400">Discover our collection of premium sports equipment</p>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 bg-white/10 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Categories */}
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-gray-300 capitalize">
                          {category === 'all' ? 'All Categories' : category}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={selectedBrand === brand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-gray-300 capitalize">
                          {brand === 'all' ? 'All Brands' : brand}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-green-500"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </p>
              </div>

              {/* Products */}
              {paginatedProducts.length === 0 ? (
                <div className="bg-white/10 rounded-xl p-12 text-center">
                  <div className="text-7xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                  <button
                    onClick={resetFilters}
                    className="text-green-400 hover:text-green-300"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/products/${product.id}`}
                      className="group"
                    >
                      <div className="bg-white/10 rounded-xl overflow-hidden hover:bg-white/15 transition-all border border-white/20 hover:border-green-400">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                          <span className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity">
                            📷
                          </span>
                          {product.isNew && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-green-500/80 text-white text-xs rounded">
                              New
                            </span>
                          )}
                          {product.discount && (
                            <span className="absolute top-2 right-2 px-2 py-1 bg-red-500/80 text-white text-xs rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400">{product.brand}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">{product.category}</span>
                          </div>
                          
                          <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`text-sm ${
                                  star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                                }`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              ({product.reviewCount})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-400">
                              {formatPrice(product.price)}
                            </span>
                            {product.comparePrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
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
                    className="w-10 h-10 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/shop/categories"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📁</span>
              <h3 className="text-white font-semibold mb-2">Browse Categories</h3>
              <p className="text-gray-400 text-sm">Shop by category</p>
            </Link>

            <Link
              href="/shop/brands"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">🏷️</span>
              <h3 className="text-white font-semibold mb-2">Shop by Brand</h3>
              <p className="text-gray-400 text-sm">Explore top brands</p>
            </Link>

            <Link
              href="/shop/new-arrivals"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">🆕</span>
              <h3 className="text-white font-semibold mb-2">New Arrivals</h3>
              <p className="text-gray-400 text-sm">Latest products</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Info */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Products managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}