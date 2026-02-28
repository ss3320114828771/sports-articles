'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItemProps {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
  maxQuantity?: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  showCheckbox?: boolean
}

export default function CartItem({
  id,
  productId,
  name,
  price,
  quantity,
  image,
  size,
  color,
  maxQuantity = 10,
  onUpdateQuantity,
  onRemove,
  isSelected = false,
  onSelect,
  showCheckbox = false
}: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Handle quantity decrease
  const handleDecrease = () => {
    if (quantity > 1) {
      setIsLoading(true)
      onUpdateQuantity(id, quantity - 1)
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  // Handle quantity increase
  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setIsLoading(true)
      onUpdateQuantity(id, quantity + 1)
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  // Handle quantity input change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value)
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= maxQuantity) {
      setIsLoading(true)
      onUpdateQuantity(id, newQuantity)
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  // Handle remove
  const handleRemove = () => {
    if (showDeleteConfirm) {
      setIsLoading(true)
      onRemove(id)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(id, e.target.checked)
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Calculate item total
  const itemTotal = price * quantity

  return (
    <div className={`
      relative bg-white/10 rounded-xl p-4 
      border transition-all duration-300
      ${isSelected ? 'border-green-400 bg-green-500/5' : 'border-white/20'}
      ${isLoading ? 'opacity-50' : ''}
      hover:border-green-400
    `}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center z-10">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Checkbox */}
        {showCheckbox && onSelect && (
          <div className="flex items-start pt-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="w-5 h-5 accent-green-500 cursor-pointer"
            />
          </div>
        )}

        {/* Product Image */}
        <Link href={`/shop/products/${productId}`} className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
            <span className="text-4xl opacity-50">📷</span>
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            {/* Name and Variants */}
            <div>
              <Link 
                href={`/shop/products/${productId}`}
                className="text-white font-semibold hover:text-green-400 transition-colors line-clamp-2"
              >
                {name}
              </Link>
              
              {/* Size and Color */}
              {(size || color) && (
                <div className="flex gap-3 mt-1 text-sm">
                  {size && (
                    <span className="text-gray-400">
                      Size: <span className="text-white">{size}</span>
                    </span>
                  )}
                  {color && (
                    <span className="text-gray-400">
                      Color: <span className="text-white">{color}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className={`p-2 rounded-lg transition-all ${
                showDeleteConfirm 
                  ? 'bg-red-500 text-white scale-110' 
                  : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
              }`}
              title={showDeleteConfirm ? 'Click again to confirm' : 'Remove item'}
            >
              {showDeleteConfirm ? '✓' : '🗑️'}
            </button>
          </div>

          {/* Price and Quantity */}
          <div className="flex justify-between items-end mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center 
                         text-white hover:bg-white/20 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </button>
              
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={maxQuantity}
                className="w-16 h-8 bg-white/10 border border-white/20 rounded-lg 
                         text-white text-center focus:outline-none focus:border-green-400
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                         [&::-webkit-inner-spin-button]:appearance-none"
              />
              
              <button
                onClick={handleIncrease}
                disabled={quantity >= maxQuantity}
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center 
                         text-white hover:bg-white/20 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>

              <span className="text-xs text-gray-400 ml-2">
                Max: {maxQuantity}
              </span>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                {formatPrice(itemTotal)}
              </div>
              <div className="text-xs text-gray-400">
                {formatPrice(price)} each
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {quantity >= maxQuantity && (
            <p className="text-xs text-yellow-400 mt-2">
              ⚠️ Maximum quantity reached
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Tooltip */}
      {showDeleteConfirm && (
        <div className="absolute -top-12 right-0 bg-red-500 text-white text-sm py-2 px-3 rounded-lg shadow-lg animate-fade-in">
          Click again to confirm removal
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-red-500"></div>
        </div>
      )}
    </div>
  )
}