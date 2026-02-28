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
  rating: number
  reviewCount: number
}

interface Category {
  id: string
  name: string
  slug: string
  image: string
  productCount: number
  icon: string
}

interface Brand {
  id: string
  name: string
  slug: string
  logo: string
  productCount: number
}

export default function ShopHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('featured')

  // Categories data
  const categories: Category[] = [
    { id: '1', name: 'Football', slug: 'football', image: '/images/categories/football.jpg', productCount: 156, icon: '⚽' },
    { id: '2', name: 'Cricket', slug: 'cricket', image: '/images/categories/cricket.jpg', productCount: 98, icon: '🏏' },
    { id: '3', name: 'Basketball', slug: 'basketball', image: '/images/categories/basketball.jpg', productCount: 87, icon: '🏀' },
    { id: '4', name: 'Tennis', slug: 'tennis', image: '/images/categories/tennis.jpg', productCount: 76, icon: '🎾' },
    { id: '5', name: 'Swimming', slug: 'swimming', image: '/images/categories/swimming.jpg', productCount: 64, icon: '🏊' },
    { id: '6', name: 'Boxing', slug: 'boxing', image: '/images/categories/boxing.jpg', productCount: 52, icon: '🥊' }
  ]

  // Brands data
  const brands: Brand[] = [
    { id: '1', name: 'Nike', slug: 'nike', logo: '/images/brands/nike.png', productCount: 145 },
    { id: '2', name: 'Adidas', slug: 'adidas', logo: '/images/brands/adidas.png', productCount: 132 },
    { id: '3', name: 'Puma', slug: 'puma', logo: '/images/brands/puma.png', productCount: 89 },
    { id: '4', name: 'SG', slug: 'sg', logo: '/images/brands/sg.png', productCount: 56 },
    { id: '5', name: 'Yonex', slug: 'yonex', logo: '/images/brands/yonex.png', productCount: 48 },
    { id: '6', name: 'Speedo', slug: 'speedo', logo: '/images/brands/speedo.png', productCount: 42 }
  ]

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Featured products
        setFeaturedProducts([
          {
            id: '1',
            name: 'Nike Mercurial Superfly 9',
            slug: 'nike-mercurial-superfly-9',
            price: 24999,
            comparePrice: 29999,
            image: '/images/n1.jpeg',
            category: 'Football',
            rating: 4.5,
            reviewCount: 128
          },
          {
            id: '2',
            name: 'SG Test Cricket Bat',
            slug: 'sg-test-cricket-bat',
            price: 15999,
            comparePrice: 18999,
            image: '/images/n3.jpeg',
            category: 'Cricket',
            rating: 4.8,
            reviewCount: 92
          },
          {
            id: '3',
            name: 'Nike Air Jordan',
            slug: 'nike-air-jordan',
            price: 18999,
            comparePrice: 21999,
            image: '/images/n5.jpeg',
            category: 'Basketball',
            rating: 4.9,
            reviewCount: 156
          },
          {
            id: '4',
            name: 'Yonex EZONE 100',
            slug: 'yonex-ezone-100',
            price: 15999,
            comparePrice: 17999,
            image: '/images/n6.jpeg',
            category: 'Tennis',
            rating: 4.6,
            reviewCount: 42
          }
        ])

        // New arrivals
        setNewArrivals([
          {
            id: '5',
            name: 'Adidas Predator Edge',
            slug: 'adidas-predator-edge',
            price: 22999,
            comparePrice: 25999,
            image: '/images/n2.jpeg',
            category: 'Football',
            rating: 4.3,
            reviewCount: 76
          },
          {
            id: '6',
            name: 'Adidas Cricket Helmet',
            slug: 'adidas-cricket-helmet',
            price: 4999,
            comparePrice: 5999,
            image: '/images/n4.jpeg',
            category: 'Cricket',
            rating: 4.4,
            reviewCount: 34
          },
          {
            id: '7',
            name: 'Speedo Goggles Pro',
            slug: 'speedo-goggles-pro',
            price: 1999,
            comparePrice: 2499,
            image: '/images/n1.jpeg',
            category: 'Swimming',
            rating: 4.2,
            reviewCount: 28
          },
          {
            id: '8',
            name: 'Everlast Boxing Gloves',
            slug: 'everlast-boxing-gloves',
            price: 3999,
            comparePrice: 4999,
            image: '/images/n2.jpeg',
            category: 'Boxing',
            rating: 4.7,
            reviewCount: 63
          }
        ])

        // Best sellers
        setBestSellers([
          {
            id: '9',
            name: 'Nike Mercurial Superfly 9',
            slug: 'nike-mercurial-superfly-9',
            price: 24999,
            comparePrice: 29999,
            image: '/images/n1.jpeg',
            category: 'Football',
            rating: 4.5,
            reviewCount: 128
          },
          {
            id: '10',
            name: 'SG Test Cricket Bat',
            slug: 'sg-test-cricket-bat',
            price: 15999,
            comparePrice: 18999,
            image: '/images/n3.jpeg',
            category: 'Cricket',
            rating: 4.8,
            reviewCount: 92
          },
          {
            id: '11',
            name: 'Nike Air Jordan',
            slug: 'nike-air-jordan',
            price: 18999,
            comparePrice: 21999,
            image: '/images/n5.jpeg',
            category: 'Basketball',
            rating: 4.9,
            reviewCount: 156
          },
          {
            id: '12',
            name: 'Yonex EZONE 100',
            slug: 'yonex-ezone-100',
            price: 15999,
            comparePrice: 17999,
            image: '/images/n6.jpeg',
            category: 'Tennis',
            rating: 4.6,
            reviewCount: 42
          }
        ])
      } catch (error) {
        console.error('Error loading products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Get current products based on tab
  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'new':
        return newArrivals
      case 'bestsellers':
        return bestSellers
      default:
        return featuredProducts
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading shop...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Banner */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20">
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Sports Elite
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Your premier destination for quality sports equipment. Gear up for greatness!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop/products"
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Shop Now
              </Link>
              <Link
                href="/shop/categories"
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900 to-transparent"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-400">Find what you need in your favorite sport</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/15 transition-all border border-white/20 hover:border-green-400">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.productCount} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Featured Products</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'featured'
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'new'
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'bestsellers'
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Best Sellers
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCurrentProducts().map((product) => (
              <Link
                key={product.id}
                href={`/shop/products/${product.id}`}
                className="group"
              >
                <div className="bg-white/10 rounded-xl overflow-hidden hover:bg-white/15 transition-all border border-white/20 hover:border-green-400">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity">
                      📷
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
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
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
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

          {/* View All Link */}
          <div className="text-center mt-10">
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold"
            >
              View All Products
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top Brands</h2>
            <p className="text-xl text-gray-400">Shop from the best brands in sports</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/shop/brands/${brand.slug}`}
                className="group"
              >
                <div className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/15 transition-all border border-white/20 hover:border-green-400">
                  <div className="text-4xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    🏷️
                  </div>
                  <h3 className="text-white font-semibold mb-1">{brand.name}</h3>
                  <p className="text-sm text-gray-400">{brand.productCount} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 text-center border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Summer Sale!</h2>
            <p className="text-xl text-gray-300 mb-6">Get up to 40% off on selected items</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop/products?sale=true"
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Shop Sale
              </Link>
              <Link
                href="/shop/deals"
                className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                View All Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="text-white font-semibold mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-400">On orders above ₹1000</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">↩️</div>
              <h3 className="text-white font-semibold mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-400">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-white font-semibold mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-400">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="text-white font-semibold mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-400">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}