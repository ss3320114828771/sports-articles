'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface OrderSummaryProps {
  items: OrderItem[]
  subtotal: number
  shipping?: number
  tax?: number
  discount?: number
  couponCode?: string
  showItems?: boolean
  showActions?: boolean
  onEditCart?: () => void
  className?: string
}

export default function OrderSummary({
  items,
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
  couponCode,
  showItems = true,
  showActions = true,
  onEditCart,
  className = ''
}: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(false)

  // Calculate totals
  const calculatedShipping = shipping >= 0 ? shipping : (subtotal > 1000 ? 0 : 99)
  const calculatedTax = tax > 0 ? tax : subtotal * 0.18
  const calculatedDiscount = discount > 0 ? discount : 0
  const total = subtotal + calculatedShipping + calculatedTax - calculatedDiscount

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Get item total
  const getItemTotal = (item: OrderItem) => {
    return item.price * item.quantity
  }

  // Toggle items view
  const toggleItems = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📋</span> Order Summary
        </h2>
        {items.length > 0 && (
          <span className="text-sm text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* Items List - Collapsible */}
      {showItems && items.length > 0 && (
        <div className="mb-4">
          <button
            onClick={toggleItems}
            className="flex items-center justify-between w-full text-left mb-2
                     text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">Items</span>
            <span className="text-xs">{expanded ? '▼' : '▶'}</span>
          </button>

          {expanded ? (
            // Expanded view - full details
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  {/* Item Image Placeholder */}
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-500/20 
                                rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl opacity-50">📷</span>
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  {/* Item Total */}
                  <p className="text-green-400 font-semibold whitespace-nowrap">
                    {formatPrice(getItemTotal(item))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // Collapsed view - summary only
            <p className="text-sm text-gray-400">
              {items.length} items • Total: {formatPrice(subtotal)}
            </p>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Shipping</span>
          {calculatedShipping === 0 ? (
            <span className="text-green-400">Free</span>
          ) : (
            <span className="text-white">{formatPrice(calculatedShipping)}</span>
          )}
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Tax (GST 18%)</span>
          <span className="text-white">{formatPrice(calculatedTax)}</span>
        </div>

        {calculatedDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-400">
            <span>Discount</span>
            <span>-{formatPrice(calculatedDiscount)}</span>
          </div>
        )}

        {/* Coupon Applied */}
        {couponCode && (
          <div className="flex items-center justify-between bg-green-500/10 p-2 rounded-lg mt-2">
            <span className="text-xs text-green-400">Coupon {couponCode} applied</span>
            <button className="text-xs text-red-400 hover:text-red-300">Remove</button>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-white/20 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-white font-semibold">Total</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-green-400">
              {formatPrice(total)}
            </span>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="space-y-2">
          <Link
            href="/shop/checkout"
            className="block w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 
                     text-white rounded-lg font-semibold text-center
                     hover:scale-105 transition-all"
          >
            Proceed to Checkout
          </Link>
          
          {onEditCart ? (
            <button
              onClick={onEditCart}
              className="block w-full py-2 text-center text-gray-400 
                       hover:text-white transition-colors"
            >
              Edit Cart
            </button>
          ) : (
            <Link
              href="/shop/cart"
              className="block w-full py-2 text-center text-gray-400 
                       hover:text-white transition-colors"
            >
              Edit Cart
            </Link>
          )}
        </div>
      )}

      {/* Free Shipping Progress */}
      {subtotal < 1000 && (
        <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
          <p className="text-xs text-yellow-400 text-center">
            Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for free shipping
          </p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
            <div 
              className="bg-yellow-400 h-1.5 rounded-full"
              style={{ width: `${(subtotal / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <span>🔒</span> Secure Checkout
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Your information is encrypted
        </p>
      </div>
    </div>
  )
}