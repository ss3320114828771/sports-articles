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
  icon: string
  productCount: number
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Categories data
  const categories: Category[] = [
    { id: '1', name: 'Football', slug: 'football', icon: '⚽', productCount: 156 },
    { id: '2', name: 'Cricket', slug: 'cricket', icon: '🏏', productCount: 98 },
    { id: '3', name: 'Basketball', slug: 'basketball', icon: '🏀', productCount: 87 },
    { id: '4', name: 'Tennis', slug: 'tennis', icon: '🎾', productCount: 76 },
    { id: '5', name: 'Swimming', slug: 'swimming', icon: '🏊', productCount: 64 },
    { id: '6', name: 'Boxing', slug: 'boxing', icon: '🥊', productCount: 52 }
  ]

  // Testimonials data
  const testimonials = [
    {
      id: '1',
      name: 'Rahul Sharma',
      role: 'Cricket Player',
      content: 'Best sports equipment store in town! The quality is exceptional and delivery is always on time.',
      rating: 5,
      image: '👤'
    },
    {
      id: '2',
      name: 'Priya Patel',
      role: 'Tennis Coach',
      content: 'My go-to place for all tennis gear. Excellent customer service and great prices.',
      rating: 5,
      image: '👤'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      role: 'Football Enthusiast',
      content: 'Amazing collection of football boots. Found exactly what I was looking for.',
      rating: 5,
      image: '👤'
    }
  ]

  // Load featured products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Bismillah - Always at top */}
      <div className="text-center py-4 bg-black/20">
        <h2 className="text-xl md:text-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Sports Elite
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Your premier destination for quality sports equipment. 
              Gear up for greatness with our premium collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop/products"
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-400">Experience the best in sports equipment</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-white font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-400">Top brands & best materials</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-white font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-400">On orders above ₹1000</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">↩️</div>
              <h3 className="text-white font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-400">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-white font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-400">100% secure transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-400">Find your favorite sport equipment</p>
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

      {/* Featured Products */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-xl text-gray-400">Our top picks for you</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/products/${product.id}`}
                  className="group"
                >
                  <div className="bg-white/10 rounded-xl overflow-hidden hover:bg-white/15 transition-all border border-white/20 hover:border-green-400">
                    <div className="aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity">
                        📷
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-gray-400">{product.category}</span>
                      <h3 className="text-white font-semibold mt-1 mb-2 group-hover:text-green-400 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={`text-sm ${
                              star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                            }`}>★</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                      </div>
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

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                About{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  Sports Elite
                </span>
              </h2>
              <p className="text-gray-300 mb-4">
                Founded in 2020 by Hafiz Sajid Syed, Sports Elite has grown to become 
                one of the most trusted names in sports equipment retail. We're passionate 
                about providing athletes of all levels with the best gear to help them 
                perform at their peak.
              </p>
              <p className="text-gray-300 mb-6">
                From professional cricket bats to premier football boots, we curate 
                only the finest products from top brands worldwide. Our commitment to 
                quality and customer satisfaction sets us apart.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold"
              >
                Read Our Story
                <span>→</span>
              </Link>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 text-center">
              <div className="text-8xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-4">5+ Years of Excellence</h3>
              <p className="text-gray-400">
                Serving athletes with premium quality sports equipment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400">Trusted by athletes nationwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-6">
              Subscribe to our newsletter for exclusive offers and new arrivals
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Admin Info */}
      <section className="py-8 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-white">
            Founded & Managed by: <span className="text-yellow-400 font-bold">Hafiz Sajid Syed</span>
          </p>
          <p className="text-gray-400 mt-2">sajid.syed@gmail.com</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Sports Elite</h3>
              <p className="text-sm text-gray-400">Your premier destination for quality sports equipment.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 3).map(cat => (
                  <li key={cat.id}><Link href={`/shop/categories/${cat.slug}`} className="text-sm text-gray-400 hover:text-white">{cat.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-2xl text-gray-400 hover:text-white">📘</a>
                <a href="#" className="text-2xl text-gray-400 hover:text-white">🐦</a>
                <a href="#" className="text-2xl text-gray-400 hover:text-white">📷</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400">© 2024 Sports Elite. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}