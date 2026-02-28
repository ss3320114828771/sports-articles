'use client'

import { useState } from 'react'
import Link from 'next/link'

// Simple types
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  // Simple form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Simple cart data
  const cartItems = [
    { id: '1', name: 'Nike Mercurial Superfly 9', price: 24999, quantity: 1 },
    { id: '2', name: 'SG Test Cricket Bat', price: 15999, quantity: 2 }
  ]

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 1000 ? 0 : 99
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  // Simple validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = 'First name required'
    if (!formData.lastName) newErrors.lastName = 'Last name required'
    if (!formData.email) newErrors.email = 'Email required'
    if (!formData.phone) newErrors.phone = 'Phone required'
    if (!formData.address) newErrors.address = 'Address required'
    if (!formData.city) newErrors.city = 'City required'
    if (!formData.state) newErrors.state = 'State required'
    if (!formData.pincode) newErrors.pincode = 'Pincode required'

    return newErrors
  }

  // Handle next
  const handleNext = () => {
    if (currentStep === 1) {
      const stepErrors = validateStep1()
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors)
        return
      }
      setErrors({})
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  // Handle back
  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  // Handle place order
  const handlePlaceOrder = () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)
      setOrderNumber('ORD-' + Date.now().toString().slice(-8))
    }, 2000)
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Success screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center py-6 bg-black/20">
          <h2 className="text-xl font-bold text-white"
              style={{
                background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h2>
        </div>

        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white/10 rounded-2xl p-8 text-center">
            <div className="text-7xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-2">Order Placed!</h1>
            <p className="text-gray-300 mb-2">Order: {orderNumber}</p>
            <p className="text-gray-400 mb-6">Thank you for your purchase!</p>
            <Link
              href="/shop/products"
              className="inline-block px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Bismillah */}
      <div className="text-center py-6 bg-black/20">
        <h2 className="text-xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-4">Checkout</h1>
        
        {/* Simple Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step ? 'bg-green-500 text-white' : 'bg-white/20 text-gray-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-8 h-1 mx-1 ${
                  currentStep > step ? 'bg-green-500' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white/10 rounded-xl p-6">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4">Shipping Info</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                          errors.firstName ? 'border-red-500' : 'border-white/20'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                          errors.lastName ? 'border-red-500' : 'border-white/20'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                        errors.email ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                        errors.phone ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                        errors.address ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                          errors.city ? 'border-red-500' : 'border-white/20'
                        }`}
                      />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                          errors.state ? 'border-red-500' : 'border-white/20'
                        }`}
                      />
                      {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-white/10 border rounded text-white ${
                          errors.pincode ? 'border-red-500' : 'border-white/20'
                        }`}
                      />
                      {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>

                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="sameAddress" className="text-gray-300">
                      Billing same as shipping
                    </label>
                  </div>

                  <div className="space-y-2">
                    {['upi', 'card', 'netbanking', 'cod'].map(method => (
                      <label key={method} className="flex items-center p-3 bg-white/5 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleChange}
                          className="mr-3"
                        />
                        <span className="text-white capitalize">
                          {method === 'upi' ? 'UPI' :
                           method === 'card' ? 'Credit/Debit Card' :
                           method === 'netbanking' ? 'Net Banking' :
                           'Cash on Delivery'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4">Review Order</h2>
                  
                  <div className="bg-white/5 p-3 rounded">
                    <p className="text-white font-medium">Shipping To:</p>
                    <p className="text-gray-400 text-sm">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}, {formData.city}<br />
                      {formData.state} - {formData.pincode}
                    </p>
                  </div>

                  <div className="bg-white/5 p-3 rounded">
                    <p className="text-white font-medium">Payment:</p>
                    <p className="text-gray-400 text-sm capitalize">
                      {formData.paymentMethod === 'upi' ? 'UPI' :
                       formData.paymentMethod === 'card' ? 'Card' :
                       formData.paymentMethod === 'netbanking' ? 'Net Banking' :
                       'Cash on Delivery'}
                    </p>
                  </div>

                  <div className="bg-white/5 p-3 rounded">
                    <p className="text-white font-medium mb-2">Items:</p>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-400">{item.name} x{item.quantity}</span>
                        <span className="text-green-400">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-4 border-t border-white/20">
                {currentStep > 1 ? (
                  <button onClick={handleBack} className="px-4 py-2 bg-white/10 text-white rounded">
                    Back
                  </button>
                ) : (
                  <Link href="/shop/cart" className="px-4 py-2 bg-white/10 text-white rounded">
                    Back to Cart
                  </Link>
                )}
                
                {currentStep < 3 ? (
                  <button onClick={handleNext} className="px-4 py-2 bg-green-500 text-white rounded">
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/10 rounded-xl p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.name} x{item.quantity}</span>
                  <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="text-white">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-white/20 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-green-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Admin: <span className="text-yellow-400">Hafiz Sajid Syed</span></p>
          <p className="text-xs text-gray-500">sajid.syed@gmail.com</p>
        </div>
      </div>
    </div>
  )
}