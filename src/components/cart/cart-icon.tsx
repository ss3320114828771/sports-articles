'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CartIconProps {
  className?: string
  showBadge?: boolean
  onClick?: () => void
}

export default function CartIcon({ 
  className = '', 
  showBadge = true,
  onClick 
}: CartIconProps) {
  const [itemCount, setItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Mock cart count - in production, fetch from cart context/API
  useEffect(() => {
    // Simulate cart count update
    const mockCartCount = 3
    setItemCount(mockCartCount)
  }, [])

  // Animate when item count changes
  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  return (
    <Link
      href="/shop/cart"
      className={`relative inline-flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      {/* Cart Icon */}
      <span className={`text-2xl transition-transform ${isAnimating ? 'scale-125' : ''}`}>
        🛒
      </span>

      {/* Badge */}
      {showBadge && itemCount > 0 && (
        <span 
          className={`absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 
                     bg-gradient-to-r from-green-400 to-blue-500 
                     rounded-full flex items-center justify-center
                     text-white text-xs font-bold
                     transition-all duration-300 ${isAnimating ? 'scale-125' : ''}`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}

      {/* Tooltip - hidden on mobile */}
      <span className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                       bg-black/80 text-white text-xs py-1 px-2 rounded 
                       opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        View Cart
      </span>
    </Link>
  )
}