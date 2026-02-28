'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartIcon from '../cart/cart-icon'

interface NavbarProps {
  className?: string
}

export default function Navbar({ className = '' }: NavbarProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('Guest')

  // Check login status on mount
  useEffect(() => {
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

  // Simple navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/shop/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Sports Elite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? 'text-green-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon */}
            <CartIcon />

            {/* User Menu */}
            <div className="relative group">
              <button className="p-2 text-gray-300 hover:text-white">
                <span className="text-xl">👤</span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-40 bg-gradient-to-b from-purple-900 to-indigo-900 
                            rounded-lg shadow-lg border border-white/20 py-2 opacity-0 invisible 
                            group-hover:opacity-100 group-hover:visible transition-all">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-1 text-sm text-white">Hi, {userName}</div>
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                      Account
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                      Login
                    </Link>
                    <Link href="/auth/register" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-900 to-indigo-900 border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-white/10">
              {isLoggedIn ? (
                <>
                  <div className="py-2 text-white">Hi, {userName}</div>
                  <Link href="/account" className="block py-2 text-gray-300 hover:text-white">
                    My Account
                  </Link>
                  <button className="block py-2 text-red-400 hover:text-red-300">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block py-2 text-gray-300 hover:text-white">
                    Login
                  </Link>
                  <Link href="/auth/register" className="block py-2 text-gray-300 hover:text-white">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}