'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ProductDetailsProps {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  category: string
  brand: string
  images: string[]
  sizes?: string[]
  colors?: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  features?: string[]
  specifications?: Record<string, string>
  onAddToCart?: (data: any) => void
  onBuyNow?: (data: any) => void
  className?: string
}

export default function ProductDetails({
  id,
  name,
  description,
  price,
  comparePrice,
  sku,
  category,
  brand,
  images,
  sizes = [],
  colors = [],
  rating,
  reviewCount,
  inStock,
  features = [],
  specifications = {},
  onAddToCart,
  onBuyNow,
  className = ''
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!comparePrice) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1)
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        productId: id,
        quantity,
        size: selectedSize,
        color: selectedColor
      })
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 3000)
    }
  }

  // Handle buy now
  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow({
        productId: id,
        quantity,
        size: selectedSize,
        color: selectedColor
      })
    }
  }

  return (
    <div className={`grid md:grid-cols-2 gap-8 ${className}`}>
      {/* Left Column - Images */}
      <div>
        {/* Main Image */}
        <div className="aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 
                      rounded-2xl mb-4 flex items-center justify-center">
          <span className="text-8xl opacity-50">📷</span>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 
                           rounded-lg flex items-center justify-center border-2 transition-all
                           ${selectedImage === index ? 'border-green-400' : 'border-transparent'}`}
              >
                <span className="text-3xl">📷</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Details */}
      <div>
        {/* Title & Brand */}
        <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-400">
            Brand: <span className="text-white">{brand}</span>
          </span>
          <span className="text-gray-400">
            SKU: <span className="text-white">{sku}</span>
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`text-xl ${
                  star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-400">
            {rating} ({reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-400">
              {formatPrice(price)}
            </span>
            {comparePrice && comparePrice > price && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(comparePrice)}
                </span>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">
                  {getDiscountPercentage()}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
        </div>

        {/* Size Selection */}
        {sizes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all
                    ${selectedSize === size
                      ? 'border-green-400 bg-green-500/20 text-white'
                      : 'border-white/20 text-gray-400 hover:text-white'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {colors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Select Color</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all
                    ${selectedColor === color
                      ? 'border-green-400 bg-green-500/20 text-white'
                      : 'border-white/20 text-gray-400 hover:text-white'
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Quantity</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={decreaseQuantity}
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center 
                       justify-center text-white hover:bg-white/20"
            >
              −
            </button>
            <span className="w-16 text-center text-white text-lg">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center 
                       justify-center text-white hover:bg-white/20"
            >
              +
            </button>
            <span className="text-sm text-gray-400 ml-2">(Max 10)</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-6">
          {inStock ? (
            <p className="text-green-400">✓ In Stock</p>
          ) : (
            <p className="text-red-400">✗ Out of Stock</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 
                     text-white rounded-lg font-semibold transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!inStock}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 
                     text-white rounded-lg font-semibold hover:scale-105 
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>

        {/* Key Features */}
        {features.length > 0 && (
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications */}
        {Object.keys(specifications).length > 0 && (
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-gray-400">{key}</p>
                  <p className="text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}