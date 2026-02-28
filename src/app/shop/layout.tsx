'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Types
interface CartItem {
  id: string
  quantity: number
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Mock cart and wishlist counts
  useEffect(() => {
    // In real app, fetch from API/context
    setCartCount(3)
    setWishlistCount(5)
  }, [])

  // Categories for navigation
  const categories = [
    { name: 'Football', slug: 'football', icon: '⚽' },
    { name: 'Cricket', slug: 'cricket', icon: '🏏' },
    { name: 'Basketball', slug: 'basketball', icon: '🏀' },
    { name: 'Tennis', slug: 'tennis', icon: '🎾' },
    { name: 'Swimming', slug: 'swimming', icon: '🏊' },
    { name: 'Boxing', slug: 'boxing', icon: '🥊' }
  ]

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop/products?search=${encodeURIComponent(searchQuery)}`
    }
    setShowSearch(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Top Bar with Bismillah */}
      <div className="bg-black/20 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-sm md:text-base font-bold text-white"
              style={{
                background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h2>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Sports Elite
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/' ? 'text-green-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/shop/products" 
                className={`text-sm font-semibold transition-colors ${
                  pathname.includes('/shop/products') ? 'text-green-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Products
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="text-sm font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  Categories
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-b from-purple-900 to-indigo-900 rounded-lg shadow-xl border border-white/20 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop/categories/${cat.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                href="/shop/new-arrivals" 
                className={`text-sm font-semibold transition-colors ${
                  pathname.includes('/shop/new-arrivals') ? 'text-green-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                New Arrivals
              </Link>
              <Link 
                href="/shop/deals" 
                className={`text-sm font-semibold transition-colors ${
                  pathname.includes('/shop/deals') ? 'text-green-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Deals
              </Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-xl">🔍</span>
              </button>

              {/* Wishlist */}
              <Link href="/shop/wishlist" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">❤️</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/shop/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link href="/account" className="p-2 text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">👤</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar (when active) */}
          {showSearch && (
            <div className="py-4 border-t border-white/10">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-white">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/shop/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Products
                </Link>

                {/* Mobile Categories */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-400">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop/categories/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 pl-4 text-gray-300 hover:text-white transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/shop/new-arrivals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
                <Link
                  href="/shop/deals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Deals
                </Link>
                <Link
                  href="/shop/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Wishlist ({wishlistCount})
                </Link>
                <Link
                  href="/shop/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cart ({cartCount})
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                >
                  My Account
                </Link>
              </nav>

              {/* Admin Info in Mobile Menu */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Admin: <span className="text-yellow-400">Hafiz Sajid Syed</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Sports Elite</h3>
              <p className="text-sm text-gray-400 mb-4">
                Your premier destination for quality sports equipment. Serving athletes since 2020.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-white text-xl">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white text-xl">📷</a>
                <a href="#" className="text-gray-400 hover:text-white text-xl">💼</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/directions" className="text-sm text-gray-400 hover:text-white transition-colors">Store Location</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link 
                      href={`/shop/categories/${cat.slug}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>123 Sports Avenue, Mumbai</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:+919876543210" className="hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href="mailto:sajid.syed@gmail.com" className="hover:text-white transition-colors">
                    sajid.syed@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>🕒</span>
                  <span>Mon-Sat: 9AM - 9PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              © 2024 Sports Elite. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}