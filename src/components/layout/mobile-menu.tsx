'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn?: boolean
  userName?: string
}

export default function MobileMenu({
  isOpen,
  onClose,
  isLoggedIn = false,
  userName = 'Guest'
}: MobileMenuProps) {
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Simple navigation links
  const menuLinks = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Products', href: '/shop/products', icon: '📦' },
    { name: 'Categories', href: '/shop/categories', icon: '📁' },
    { name: 'New Arrivals', href: '/shop/new-arrivals', icon: '🆕' },
    { name: 'Deals', href: '/shop/deals', icon: '🏷️' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'Contact', href: '/contact', icon: '📞' }
  ]

  const accountLinks = isLoggedIn
    ? [
        { name: 'My Account', href: '/account', icon: '👤' },
        { name: 'My Orders', href: '/account/orders', icon: '📋' },
        { name: 'Logout', href: '#', icon: '🚪' }
      ]
    : [
        { name: 'Login', href: '/auth/login', icon: '🔐' },
        { name: 'Register', href: '/auth/register', icon: '📝' }
      ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-900 
                    shadow-2xl z-50 overflow-y-auto p-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        {isLoggedIn && (
          <div className="mb-6 p-3 bg-white/5 rounded-lg">
            <p className="text-white font-medium">Hi, {userName}</p>
            <p className="text-xs text-gray-400">Welcome back!</p>
          </div>
        )}

        {/* Main Links */}
        <div className="space-y-1 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Menu</h3>
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg
                       text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              onClick={onClose}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Account Links */}
        <div className="space-y-1 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Account</h3>
          {accountLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg
                       text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              onClick={onClose}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Admin Info */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Admin: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
        </div>
      </div>
    </>
  )
}