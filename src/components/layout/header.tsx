'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartIcon from '../cart/cart-icon'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(3)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('Guest')

  // Check login status on mount
  useEffect(() => {
    // Mock check - in production, check auth token
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
      setUserName(JSON.parse(user).name)
    }
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUserName('Guest')
    window.location.href = '/'
  }

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/shop/products' },
    { name: 'Categories', href: '/shop/categories', dropdown: true },
    { name: 'New Arrivals', href: '/shop/new-arrivals' },
    { name: 'Deals', href: '/shop/deals' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  // Categories for dropdown
  const categories = [
    { name: 'Football', href: '/shop/categories/football', icon: '⚽' },
    { name: 'Cricket', href: '/shop/categories/cricket', icon: '🏏' },
    { name: 'Basketball', href: '/shop/categories/basketball', icon: '🏀' },
    { name: 'Tennis', href: '/shop/categories/tennis', icon: '🎾' },
    { name: 'Swimming', href: '/shop/categories/swimming', icon: '🏊' },
    { name: 'Boxing', href: '/shop/categories/boxing', icon: '🥊' }
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Sports Elite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                      {item.name}
                      <span className="text-xs">▼</span>
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-b from-purple-900 to-indigo-900 
                                  rounded-lg shadow-xl border border-white/20 py-2 opacity-0 invisible 
                                  group-hover:opacity-100 group-hover:visible transition-all">
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="flex items-center gap-2 px-4 py-2 text-gray-300 
                                   hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-sm font-semibold transition-colors ${
                      pathname === item.href
                        ? 'text-green-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <span className="text-xl">🔍</span>
            </button>

            {/* Wishlist */}
            <Link
              href="/shop/wishlist"
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Wishlist"
            >
              <span className="text-xl">❤️</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                             flex items-center justify-center text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <CartIcon className="p-2" />

            {/* User Menu */}
            <div className="relative group">
              <button className="p-2 text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">👤</span>
              </button>
              
              {/* User Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-b from-purple-900 to-indigo-900 
                            rounded-lg shadow-xl border border-white/20 py-2 opacity-0 invisible 
                            group-hover:opacity-100 group-hover:visible transition-all">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm text-white">Hi, {userName}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 
                               hover:bg-red-500/10 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Menu"
            >
              <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-white/10 animate-slideDown">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 
                         text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gradient-to-b from-purple-900 to-indigo-900 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="space-y-4">
              {/* Mobile Navigation Links */}
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <div className="text-gray-400 text-sm font-semibold mb-2">{item.name}</div>
                      <div className="pl-4 space-y-2 mb-4">
                        {categories.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            className="flex items-center gap-3 py-2 text-gray-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile User Links */}
              <div className="pt-4 mt-4 border-t border-white/10">
                {isLoggedIn ? (
                  <>
                    <div className="text-white mb-2">Hi, {userName}</div>
                    <Link
                      href="/account"
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block py-2 text-red-400 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Admin Info */}
              <div className="pt-4 mt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500">
                  Admin: <span className="text-yellow-400">Hafiz Sajid Syed</span>
                </p>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}