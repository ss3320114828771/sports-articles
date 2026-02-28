'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CartSummaryProps {
  subtotal: number
  shipping?: number
  tax?: number
  discount?: number
  couponCode?: string
  onApplyCoupon?: (code: string) => void
  onCheckout?: () => void
  isCheckoutDisabled?: boolean
  showCheckoutButton?: boolean
  className?: string
}

export default function CartSummary({
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
  couponCode = '',
  onApplyCoupon,
  onCheckout,
  isCheckoutDisabled = false,
  showCheckoutButton = true,
  className = ''
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState(couponCode)
  const [isApplying, setIsApplying] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState(false)

  // Calculate totals
  const calculatedShipping = shipping >= 0 ? shipping : (subtotal > 1000 ? 0 : 99)
  const calculatedTax = tax > 0 ? tax : subtotal * 0.18
  const calculatedDiscount = discount > 0 ? discount : 0
  const total = subtotal + calculatedShipping + calculatedTax - calculatedDiscount

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Handle apply coupon
  const handleApplyCoupon = async () => {
    if (!onApplyCoupon || !couponInput.trim()) return

    setIsApplying(true)
    setCouponError('')
    setCouponSuccess(false)

    try {
      await onApplyCoupon(couponInput.toUpperCase())
      setCouponSuccess(true)
      setCouponError('')
    } catch (error) {
      setCouponError('Invalid coupon code')
      setCouponSuccess(false)
    } finally {
      setIsApplying(false)
    }
  }

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setCouponInput('')
    setCouponSuccess(false)
    setCouponError('')
    if (onApplyCoupon) {
      onApplyCoupon('')
    }
  }

  // Handle checkout
  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout()
    }
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          {calculatedShipping === 0 ? (
            <span className="text-green-400">Free</span>
          ) : (
            <span>{formatPrice(calculatedShipping)}</span>
          )}
        </div>

        <div className="flex justify-between text-gray-300">
          <span>Tax (GST 18%)</span>
          <span>{formatPrice(calculatedTax)}</span>
        </div>

        {calculatedDiscount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-{formatPrice(calculatedDiscount)}</span>
          </div>
        )}

        {/* Coupon Applied Message */}
        {couponSuccess && couponInput && (
          <div className="flex items-center justify-between bg-green-500/20 p-2 rounded-lg mt-2">
            <span className="text-sm text-green-400">
              Coupon {couponInput.toUpperCase()} applied
            </span>
            <button
              onClick={handleRemoveCoupon}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-white/20 my-4 pt-4">
          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span className="text-green-400">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
        </div>
      </div>

      {/* Coupon Section */}
      {onApplyCoupon && (
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">
            Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase())
                setCouponError('')
              }}
              placeholder="Enter code"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 
                       rounded-lg text-white placeholder-gray-400 
                       focus:outline-none focus:border-green-400
                       disabled:opacity-50"
              disabled={couponSuccess}
            />
            {couponSuccess ? (
              <button
                onClick={handleRemoveCoupon}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 
                         text-red-400 rounded-lg font-semibold transition-colors"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 
                         text-white rounded-lg font-semibold 
                         hover:scale-105 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent 
                                   rounded-full animate-spin"></span>
                    Apply
                  </span>
                ) : (
                  'Apply'
                )}
              </button>
            )}
          </div>
          {couponError && (
            <p className="text-red-400 text-xs mt-2">{couponError}</p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            Try: WELCOME10, SPORTS500
          </p>
        </div>
      )}

      {/* Checkout Button */}
      {showCheckoutButton && (
        <button
          onClick={handleCheckout}
          disabled={isCheckoutDisabled || subtotal === 0}
          className="w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 
                   text-white rounded-lg font-semibold 
                   hover:scale-105 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:scale-100"
        >
          {subtotal === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
        </button>
      )}

      {/* Payment Methods */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 mb-3">We accept</p>
        <div className="flex justify-center gap-3 text-2xl">
          <span title="Visa" className="hover:scale-110 transition-transform">💳</span>
          <span title="Mastercard" className="hover:scale-110 transition-transform">💳</span>
          <span title="UPI" className="hover:scale-110 transition-transform">📱</span>
          <span title="Net Banking" className="hover:scale-110 transition-transform">🏦</span>
          <span title="Cash on Delivery" className="hover:scale-110 transition-transform">💵</span>
        </div>
      </div>

      {/* Security Info */}
      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <span>🔒</span> Secure Checkout
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Your information is encrypted
        </p>
      </div>

      {/* Free Shipping Message */}
      {subtotal < 1000 && (
        <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
          <p className="text-xs text-yellow-400 text-center">
            Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for free shipping
          </p>
        </div>
      )}
    </div>
  )
}