'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CartItem from './cart-item'

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
  maxQuantity?: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Mock cart data
  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])

  const loadCart = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCartItems([
        {
          id: '1',
          productId: '1',
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
          productId: '3',
          name: 'SG Test Cricket Bat',
          price: 15999,
          quantity: 2,
          image: '/images/n3.jpeg',
          size: 'Short Handle',
          color: 'Natural',
          maxQuantity: 5
        }
      ])
    } catch (error) {
      console.error('Error loading cart')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle update quantity
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  // Handle remove item
  const handleRemoveItem = async (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 1000 ? 0 : 99
  const total = subtotal + shipping

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      window.location.href = '/shop/checkout'
    }, 1000)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-purple-900 to-indigo-900 
                    shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-purple-900/95 backdrop-blur-lg border-b border-white/10 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🛒</span>
              Your Cart ({cartItems.length})
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 
                       flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">🛒</div>
              <h3 className="text-white font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-400 text-sm mb-6">
                Looks like you haven't added anything yet.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 
                         text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-purple-900/95 backdrop-blur-lg 
                          border-t border-white/10 p-4 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t border-white/10 my-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold text-green-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 
                         text-white rounded-lg font-semibold hover:scale-105 
                         transition-all disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent 
                                   rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  'Checkout'
                )}
              </button>
              
              <Link
                href="/shop/cart"
                className="block w-full py-2 text-center text-gray-400 
                         hover:text-white transition-colors"
                onClick={onClose}
              >
                View Full Cart
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">We accept</p>
              <div className="flex justify-center gap-3 text-xl">
                <span title="Visa">💳</span>
                <span title="Mastercard">💳</span>
                <span title="UPI">📱</span>
                <span title="Net Banking">🏦</span>
                <span title="Cash on Delivery">💵</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}