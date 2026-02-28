'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Types
interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
  maxQuantity: number
}

export default function CartPage() {
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Mock cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 'prod_1',
      name: 'Nike Mercurial Superfly 9',
      price: 24999,
      quantity: 1,
      image: '/images/n1.jpeg',
      size: 'UK 8',
      color: 'Black/Red',
      maxQuantity: 10
    },
    {
      id: '2',
      productId: 'prod_2',
      name: 'SG Test Cricket Bat',
      price: 15999,
      quantity: 2,
      image: '/images/n3.jpeg',
      size: 'Short Handle',
      color: 'Natural',
      maxQuantity: 5
    },
    {
      id: '3',
      productId: 'prod_3',
      name: 'Adidas Cricket Helmet',
      price: 4999,
      quantity: 1,
      image: '/images/n4.jpeg',
      size: 'L/XL',
      color: 'Blue',
      maxQuantity: 8
    }
  ])

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 1000 ? 0 : 99
  const tax = subtotal * 0.18 // 18% GST
  const discount = couponApplied ? subtotal * 0.1 : 0 // 10% discount if coupon applied
  const total = subtotal + shipping + tax - discount

  // Handle quantity update
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return
    
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )
    )
  }

  // Handle remove item
  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  // Handle clear cart
  const clearCart = () => {
    setCartItems([])
    setCouponApplied(false)
    setCouponCode('')
  }

  // Handle coupon apply
  const applyCoupon = () => {
    setCouponError('')
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    // Mock coupon validation
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setCouponApplied(true)
      setCouponError('')
    } else if (couponCode.toUpperCase() === 'SPORTS500') {
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false)
      window.location.href = '/shop/checkout'
    }, 1000)
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Bismillah */}
      <div className="text-center py-6 bg-black/20">
        <h2 className="text-xl md:text-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      {/* Header */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-400">{cartItems.length} items in your cart</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cartItems.length === 0 ? (
            // Empty Cart
            <div className="bg-white/10 rounded-2xl p-12 text-center backdrop-blur-lg border border-white/20">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link
                href="/shop/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            // Cart with items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/10 rounded-xl p-4 backdrop-blur-lg border border-white/20 hover:border-green-400 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                        📷
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              href={`/shop/products/${item.productId}`}
                              className="text-lg font-semibold text-white hover:text-green-400 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <div className="flex gap-4 mt-1 text-sm">
                              {item.size && (
                                <span className="text-gray-400">Size: {item.size}</span>
                              )}
                              {item.color && (
                                <span className="text-gray-400">Color: {item.color}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setItemToDelete(item.id)
                              setShowDeleteModal(true)
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            title="Remove item"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                              −
                            </button>
                            <span className="w-12 text-center text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              +
                            </button>
                            <span className="text-xs text-gray-400 ml-2">
                              Max: {item.maxQuantity}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatPrice(item.price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cart Actions */}
                <div className="flex justify-between items-center pt-4">
                  <Link
                    href="/shop/products"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 sticky top-24">
                  <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                  {/* Summary Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax (GST 18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/20 my-3 pt-3">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span className="text-green-400">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label className="block text-gray-300 text-sm mb-2">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        disabled={couponApplied}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponApplied}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-xs mt-1">{couponError}</p>
                    )}
                    {couponApplied && (
                      <p className="text-green-400 text-xs mt-1">
                        Coupon applied! 10% discount
                      </p>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 mb-4"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center justify-center">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Processing...
                      </span>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>

                  {/* Payment Methods */}
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-3">We accept</p>
                    <div className="flex justify-center gap-4 text-2xl">
                      <span title="Visa">💳</span>
                      <span title="Mastercard">💳</span>
                      <span title="UPI">📱</span>
                      <span title="Net Banking">🏦</span>
                      <span title="Cash on Delivery">💵</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Links */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/shop/products"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">🛍️</span>
              <h3 className="text-white font-semibold mb-2">Continue Shopping</h3>
              <p className="text-gray-400 text-sm">Browse more products</p>
            </Link>

            <Link
              href="/shop/wishlist"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">❤️</span>
              <h3 className="text-white font-semibold mb-2">Wishlist</h3>
              <p className="text-gray-400 text-sm">View saved items</p>
            </Link>

            <Link
              href="/contact"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📞</span>
              <h3 className="text-white font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm">Contact support</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl max-w-md w-full p-6 border border-white/20">
            <div className="text-center">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-xl font-bold text-white mb-2">Remove Item</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to remove this item from your cart?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => itemToDelete && removeItem(itemToDelete)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setItemToDelete(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Info Footer */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Store managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </footer>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}