'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isNew?: boolean
  discount?: number
  onAddToCart?: (id: string) => void
  onAddToWishlist?: (id: string) => void
  className?: string
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  category,
  rating,
  reviewCount,
  isNew = false,
  discount,
  onAddToCart,
  onAddToWishlist,
  className = ''
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!comparePrice) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(id)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  // Handle add to wishlist
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(id)
      setIsWishlisted(!isWishlisted)
    }
  }

  return (
    <Link
      href={`/shop/products/${slug}`}
      className={`block group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white/10 rounded-xl overflow-hidden hover:bg-white/15 
                    transition-all border border-white/20 hover:border-green-400">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20">
          {/* Image Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-6xl transition-all duration-300 
              ${isHovered ? 'scale-110 opacity-80' : 'opacity-50'}`}>
              📷
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {isNew && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                New
              </span>
            )}
            {discount && discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300
                        ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
            <button
              onClick={handleAddToWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center
                       transition-all hover:scale-110
                       ${isWishlisted 
                         ? 'bg-red-500 text-white' 
                         : 'bg-white/20 text-white hover:bg-red-500'}`}
              aria-label="Add to wishlist"
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-400 mb-1">{category}</p>

          {/* Product Name */}
          <h3 className="text-white font-semibold mb-2 line-clamp-2 
                       group-hover:text-green-400 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-sm ${
                    star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-green-400">
                {formatPrice(price)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold
                       transition-all hover:scale-105
                       ${isAdded 
                         ? 'bg-green-500 text-white' 
                         : 'bg-gradient-to-r from-green-400 to-blue-500 text-white'}`}
              aria-label="Add to cart"
            >
              {isAdded ? '✓ Added' : 'Add'}
            </button>
          </div>

          {/* Discount Info */}
          {comparePrice && comparePrice > price && (
            <p className="text-xs text-green-400 mt-2">
              Save {formatPrice(comparePrice - price)} ({getDiscountPercentage()}% off)
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}