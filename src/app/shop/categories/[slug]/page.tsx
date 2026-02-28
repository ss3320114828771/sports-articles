'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Types
interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string
  rating: number
  reviewCount: number
  isFeatured: boolean
  isNew?: boolean
  discount?: number
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  subcategories: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug: string
  productCount: number
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Mock data - replace with API call
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock category data based on slug
        const categories: Record<string, Category> = {
          'football': {
            id: '1',
            name: 'Football',
            slug: 'football',
            description: 'Everything you need for the beautiful game. From boots to balls, kits to accessories.',
            image: '/images/categories/football.jpg',
            productCount: 156,
            subcategories: [
              { id: '1-1', name: 'Football Boots', slug: 'football-boots', productCount: 45 },
              { id: '1-2', name: 'Football Balls', slug: 'football-balls', productCount: 23 },
              { id: '1-3', name: 'Goalkeeper Gloves', slug: 'goalkeeper-gloves', productCount: 18 },
              { id: '1-4', name: 'Shin Guards', slug: 'shin-guards', productCount: 25 },
              { id: '1-5', name: 'Football Kits', slug: 'football-kits', productCount: 32 },
              { id: '1-6', name: 'Training Equipment', slug: 'training-equipment', productCount: 13 }
            ]
          },
          'cricket': {
            id: '2',
            name: 'Cricket',
            slug: 'cricket',
            description: 'Premium cricket equipment for batsmen, bowlers, and wicketkeepers.',
            image: '/images/categories/cricket.jpg',
            productCount: 98,
            subcategories: [
              { id: '2-1', name: 'Cricket Bats', slug: 'cricket-bats', productCount: 28 },
              { id: '2-2', name: 'Cricket Balls', slug: 'cricket-balls', productCount: 15 },
              { id: '2-3', name: 'Protective Gear', slug: 'protective-gear', productCount: 32 },
              { id: '2-4', name: 'Cricket Kits', slug: 'cricket-kits', productCount: 12 },
              { id: '2-5', name: 'Training Aids', slug: 'training-aids', productCount: 11 }
            ]
          },
          'basketball': {
            id: '3',
            name: 'Basketball',
            slug: 'basketball',
            description: 'Gear up for the court with our basketball collection.',
            image: '/images/categories/basketball.jpg',
            productCount: 87,
            subcategories: [
              { id: '3-1', name: 'Basketball Shoes', slug: 'basketball-shoes', productCount: 34 },
              { id: '3-2', name: 'Basketballs', slug: 'basketballs', productCount: 18 },
              { id: '3-3', name: 'Jerseys', slug: 'basketball-jerseys', productCount: 22 },
              { id: '3-4', name: 'Accessories', slug: 'basketball-accessories', productCount: 13 }
            ]
          },
          'tennis': {
            id: '4',
            name: 'Tennis',
            slug: 'tennis',
            description: 'Professional tennis equipment for players of all levels.',
            image: '/images/categories/tennis.jpg',
            productCount: 76,
            subcategories: [
              { id: '4-1', name: 'Tennis Rackets', slug: 'tennis-rackets', productCount: 28 },
              { id: '4-2', name: 'Tennis Balls', slug: 'tennis-balls', productCount: 16 },
              { id: '4-3', name: 'Tennis Shoes', slug: 'tennis-shoes', productCount: 22 },
              { id: '4-4', name: 'Accessories', slug: 'tennis-accessories', productCount: 10 }
            ]
          },
          'swimming': {
            id: '5',
            name: 'Swimming',
            slug: 'swimming',
            description: 'Everything for the pool. Swimwear, goggles, and training gear.',
            image: '/images/categories/swimming.jpg',
            productCount: 64,
            subcategories: [
              { id: '5-1', name: 'Swimwear', slug: 'swimwear', productCount: 28 },
              { id: '5-2', name: 'Goggles', slug: 'goggles', productCount: 18 },
              { id: '5-3', name: 'Swim Caps', slug: 'swim-caps', productCount: 12 },
              { id: '5-4', name: 'Training Equipment', slug: 'swim-training', productCount: 6 }
            ]
          },
          'boxing': {
            id: '6',
            name: 'Boxing',
            slug: 'boxing',
            description: 'Premium boxing gear for training and competition.',
            image: '/images/categories/boxing.jpg',
            productCount: 52,
            subcategories: [
              { id: '6-1', name: 'Boxing Gloves', slug: 'boxing-gloves', productCount: 22 },
              { id: '6-2', name: 'Hand Wraps', slug: 'hand-wraps', productCount: 12 },
              { id: '6-3', name: 'Punch Bags', slug: 'punch-bags', productCount: 10 },
              { id: '6-4', name: 'Protective Gear', slug: 'boxing-protection', productCount: 8 }
            ]
          }
        }

        // Mock products for this category
        const mockProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
          id: `${slug}-${i + 1}`,
          name: `${slug === 'football' ? 'Nike Mercurial' : 
                  slug === 'cricket' ? 'SG Cricket Bat' :
                  slug === 'basketball' ? 'Nike Air Jordan' :
                  slug === 'tennis' ? 'Wilson Pro Staff' :
                  slug === 'swimming' ? 'Speedo Goggles' :
                  'Everlast Boxing Gloves'} ${i + 1}`,
          slug: `${slug}-product-${i + 1}`,
          price: Math.floor(Math.random() * 20000) + 1999,
          comparePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 25000) + 2999 : null,
          image: `/images/n${(i % 6) + 1}.jpeg`,
          rating: (Math.random() * 2 + 3).toFixed(1) as any,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          isFeatured: Math.random() > 0.8,
          isNew: Math.random() > 0.7,
          discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : undefined
        }))

        setCategory(categories[slug] || categories['football'])
        setProducts(mockProducts)
      } catch (error) {
        console.error('Error fetching category data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryData()
  }, [slug])

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false
      
      // Subcategory filter (mock - in real app, products would have subcategoryId)
      if (selectedSubcategories.length > 0) {
        // Mock filtering - replace with actual logic
        return Math.random() > 0.3
      }
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        case 'popular':
        default:
          return b.reviewCount - a.reviewCount
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  // Toggle subcategory
  const toggleSubcategory = (subId: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subId)
        ? prev.filter(id => id !== subId)
        : [...prev, subId]
    )
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading category...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-4">Category Not Found</h2>
          <p className="text-gray-400 mb-6">The category you're looking for doesn't exist.</p>
          <Link 
            href="/shop/categories"
            className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold"
          >
            Browse Categories
          </Link>
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

      {/* Category Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Category Image */}
            <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-7xl font-bold">
              {category.name.charAt(0)}
            </div>

            {/* Category Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
              <p className="text-xl text-gray-300 mb-4">{category.description}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="px-4 py-2 bg-white/10 rounded-lg text-white">
                  📦 {category.productCount} Products
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-lg text-white">
                  🏷️ {category.subcategories.length} Subcategories
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full mb-4 px-4 py-3 bg-white/10 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Subcategories */}
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Subcategories</h3>
                <div className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <label key={sub.id} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub.id)}
                          onChange={() => toggleSubcategory(sub.id)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-gray-300 hover:text-white transition-colors">
                          {sub.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">({sub.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20">
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

              {/* Filter Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPriceRange([0, 100000])
                    setSelectedSubcategories([])
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold lg:hidden"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Results */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-gray-400">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Products */}
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-lg border border-white/20 hover:border-green-400 transition-all group"
                    >
                      {/* Product Image */}
                      <Link href={`/shop/products/${product.slug}`}>
                        <div className="relative aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                          <span className="text-7xl opacity-50 group-hover:opacity-100 transition-opacity">
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
                      </Link>

                      {/* Product Info */}
                      <div className="p-4">
                        <Link href={`/shop/products/${product.slug}`}>
                          <h3 className="text-lg font-semibold text-white mb-2 hover:text-green-400 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </div>
                          <span className="text-sm text-gray-400">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-green-400">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/shop/products/${product.slug}`}
                            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-center transition-colors"
                          >
                            View Details
                          </Link>
                          <button className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-colors">
                            🛒
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 rounded-xl p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                  <p className="text-gray-400 mb-4">Try adjusting your filters</p>
                  <button
                    onClick={() => {
                      setPriceRange([0, 100000])
                      setSelectedSubcategories([])
                    }}
                    className="text-green-400 hover:text-green-300"
                  >
                    Clear Filters
                  </button>
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

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}