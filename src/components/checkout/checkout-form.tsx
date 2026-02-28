'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Types
interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  state: string
  pincode: string
  country: string
}

interface CheckoutFormProps {
  onSubmit?: (data: any) => void
  initialData?: Partial<Address>
  isProcessing?: boolean
}

export default function CheckoutForm({ 
  onSubmit, 
  initialData = {},
  isProcessing = false 
}: CheckoutFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    apartment: initialData.apartment || '',
    city: initialData.city || '',
    state: initialData.state || '',
    pincode: initialData.pincode || '',
    country: initialData.country || 'India'
  })

  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  })

  // Handle input change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[`shipping.${name}`]) {
      const newErrors = { ...errors }
      delete newErrors[`shipping.${name}`]
      setErrors(newErrors)
    }
  }

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBillingAddress(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[`billing.${name}`]) {
      const newErrors = { ...errors }
      delete newErrors[`billing.${name}`]
      setErrors(newErrors)
    }
  }

  // Validate shipping address
  const validateShipping = () => {
    const newErrors: Record<string, string> = {}

    if (!shippingAddress.firstName.trim()) {
      newErrors['shipping.firstName'] = 'First name is required'
    }
    if (!shippingAddress.lastName.trim()) {
      newErrors['shipping.lastName'] = 'Last name is required'
    }
    if (!shippingAddress.email.trim()) {
      newErrors['shipping.email'] = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors['shipping.email'] = 'Invalid email format'
    }
    if (!shippingAddress.phone.trim()) {
      newErrors['shipping.phone'] = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone.replace(/\s+/g, ''))) {
      newErrors['shipping.phone'] = 'Invalid phone number'
    }
    if (!shippingAddress.address.trim()) {
      newErrors['shipping.address'] = 'Address is required'
    }
    if (!shippingAddress.city.trim()) {
      newErrors['shipping.city'] = 'City is required'
    }
    if (!shippingAddress.state.trim()) {
      newErrors['shipping.state'] = 'State is required'
    }
    if (!shippingAddress.pincode.trim()) {
      newErrors['shipping.pincode'] = 'Pincode is required'
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors['shipping.pincode'] = 'Pincode must be 6 digits'
    }

    return newErrors
  }

  // Validate billing address
  const validateBilling = () => {
    if (sameAsShipping) return {}

    const newErrors: Record<string, string> = {}

    if (!billingAddress.firstName.trim()) {
      newErrors['billing.firstName'] = 'First name is required'
    }
    if (!billingAddress.lastName.trim()) {
      newErrors['billing.lastName'] = 'Last name is required'
    }
    if (!billingAddress.email.trim()) {
      newErrors['billing.email'] = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingAddress.email)) {
      newErrors['billing.email'] = 'Invalid email format'
    }
    if (!billingAddress.phone.trim()) {
      newErrors['billing.phone'] = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(billingAddress.phone.replace(/\s+/g, ''))) {
      newErrors['billing.phone'] = 'Invalid phone number'
    }
    if (!billingAddress.address.trim()) {
      newErrors['billing.address'] = 'Address is required'
    }
    if (!billingAddress.city.trim()) {
      newErrors['billing.city'] = 'City is required'
    }
    if (!billingAddress.state.trim()) {
      newErrors['billing.state'] = 'State is required'
    }
    if (!billingAddress.pincode.trim()) {
      newErrors['billing.pincode'] = 'Pincode is required'
    } else if (!/^\d{6}$/.test(billingAddress.pincode)) {
      newErrors['billing.pincode'] = 'Pincode must be 6 digits'
    }

    return newErrors
  }

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      const shippingErrors = validateShipping()
      if (Object.keys(shippingErrors).length > 0) {
        setErrors(shippingErrors)
        return
      }
      setErrors({})
      setCurrentStep(2)
    } else if (currentStep === 2) {
      const billingErrors = validateBilling()
      if (Object.keys(billingErrors).length > 0) {
        setErrors(billingErrors)
        return
      }
      setErrors({})
      setCurrentStep(3)
    }
  }

  // Handle back step
  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (onSubmit) {
      onSubmit({
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod
      })
    }
  }

  // Get error for field
  const getError = (field: string) => {
    return errors[field]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${currentStep >= step 
                ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' 
                : 'bg-white/10 text-gray-400'
              }
            `}>
              {step}
            </div>
            {step < 3 && (
              <div className={`
                w-12 h-1 mx-1
                ${currentStep > step ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-white/10'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Shipping Address */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-6">Shipping Address</h2>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={shippingAddress.firstName}
                onChange={handleShippingChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${getError('shipping.firstName') ? 'border-red-500' : 'border-white/20'}`}
              />
              {getError('shipping.firstName') && (
                <p className="text-red-400 text-xs mt-1">{getError('shipping.firstName')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={shippingAddress.lastName}
                onChange={handleShippingChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${getError('shipping.lastName') ? 'border-red-500' : 'border-white/20'}`}
              />
              {getError('shipping.lastName') && (
                <p className="text-red-400 text-xs mt-1">{getError('shipping.lastName')}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={shippingAddress.email}
                onChange={handleShippingChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${getError('shipping.email') ? 'border-red-500' : 'border-white/20'}`}
              />
              {getError('shipping.email') && (
                <p className="text-red-400 text-xs mt-1">{getError('shipping.email')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleShippingChange}
                placeholder="9876543210"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${getError('shipping.phone') ? 'border-red-500' : 'border-white/20'}`}
              />
              {getError('shipping.phone') && (
                <p className="text-red-400 text-xs mt-1">{getError('shipping.phone')}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       focus:outline-none focus:border-green-400 transition-colors
                       ${getError('shipping.address') ? 'border-red-500' : 'border-white/20'}`}
            />
            {getError('shipping.address') && (
              <p className="text-red-400 text-xs mt-1">{getError('shipping.address')}</p>
            )}
          </div>

          {/* Apartment */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Apartment (Optional)</label>
            <input
              type="text"
              name="apartment"
              value={shippingAddress.apartment}
              onChange={handleShippingChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>

          {/* City, State, Pincode */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${getError('shipping.city') ? 'border-red-500' : 'border-white/20'}`}
              />
              {getError('shipping.city') && (
                <p className="text-red-400 text-xs mt-1">{getError('shipping.city')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                State <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleShippingChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${getError('shipping.state') ? 'border-red-500' : 'border-white/20'}`}
              />
              {getError('shipping.state') && (
                <p className="text-red-400 text-xs mt-1">{getError('shipping.state')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Pincode <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleShippingChange}
                maxLength={6}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400 transition-colors
                         ${getError('shipping.pincode') ? 'border-red-500' : 'border-white/20'}`}
              />
              {getError('shipping.pincode') && (
                <p className="text-red-400 text-xs mt-1">{getError('shipping.pincode')}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Country</label>
            <select
              name="country"
              value={shippingAddress.country}
              onChange={handleShippingChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-green-400 transition-colors"
            >
              <option value="India">India</option>
              <option value="UAE">UAE</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>

          {/* Billing Address Toggle */}
          <label className="flex items-center gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="w-5 h-5 accent-green-500"
            />
            <span className="text-gray-300">Billing address same as shipping</span>
          </label>

          {/* Billing Address */}
          {!sameAsShipping && (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Billing Address</h3>

              {/* Billing Address Fields - Simplified */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={billingAddress.firstName}
                    onChange={handleBillingChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                             placeholder-gray-400 focus:outline-none focus:border-green-400
                             ${getError('billing.firstName') ? 'border-red-500' : 'border-white/20'}`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={billingAddress.lastName}
                    onChange={handleBillingChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                             placeholder-gray-400 focus:outline-none focus:border-green-400
                             ${getError('billing.lastName') ? 'border-red-500' : 'border-white/20'}`}
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={billingAddress.email}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                           placeholder-gray-400 focus:outline-none focus:border-green-400
                           ${getError('billing.email') ? 'border-red-500' : 'border-white/20'}`}
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={billingAddress.phone}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                           placeholder-gray-400 focus:outline-none focus:border-green-400
                           ${getError('billing.phone') ? 'border-red-500' : 'border-white/20'}`}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={billingAddress.address}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                           placeholder-gray-400 focus:outline-none focus:border-green-400
                           ${getError('billing.address') ? 'border-red-500' : 'border-white/20'}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={billingAddress.city}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                           placeholder-gray-400 focus:outline-none focus:border-green-400
                           ${getError('billing.city') ? 'border-red-500' : 'border-white/20'}`}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={billingAddress.state}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                           placeholder-gray-400 focus:outline-none focus:border-green-400
                           ${getError('billing.state') ? 'border-red-500' : 'border-white/20'}`}
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={billingAddress.pincode}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white
                           placeholder-gray-400 focus:outline-none focus:border-green-400
                           ${getError('billing.pincode') ? 'border-red-500' : 'border-white/20'}`}
                />
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="space-y-3">
            {[
              { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
              { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
              { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
              { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' }
            ].map(method => (
              <label
                key={method.id}
                className={`flex items-center p-4 bg-white/5 rounded-lg cursor-pointer
                         transition-all hover:bg-white/10 border-2
                         ${paymentMethod === method.id 
                           ? 'border-green-400' 
                           : 'border-transparent'}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 accent-green-500"
                />
                <span className="text-2xl mr-3">{method.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold">{method.label}</p>
                  <p className="text-sm text-gray-400">{method.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Review Order */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-6">Review Your Order</h2>

          {/* Shipping Address Review */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>📦</span> Shipping Address
            </h3>
            <p className="text-gray-300 text-sm">
              {shippingAddress.firstName} {shippingAddress.lastName}<br />
              {shippingAddress.address}<br />
              {shippingAddress.apartment && `${shippingAddress.apartment}<br />`}
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}<br />
              {shippingAddress.country}<br />
              📞 {shippingAddress.phone}<br />
              ✉️ {shippingAddress.email}
            </p>
          </div>

          {/* Billing Address Review */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>💰</span> Billing Address
            </h3>
            {sameAsShipping ? (
              <p className="text-gray-400 text-sm">Same as shipping address</p>
            ) : (
              <p className="text-gray-300 text-sm">
                {billingAddress.firstName} {billingAddress.lastName}<br />
                {billingAddress.address}<br />
                {billingAddress.apartment && `${billingAddress.apartment}<br />`}
                {billingAddress.city}, {billingAddress.state} - {billingAddress.pincode}<br />
                {billingAddress.country}<br />
                📞 {billingAddress.phone}<br />
                ✉️ {billingAddress.email}
              </p>
            )}
          </div>

          {/* Payment Method Review */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>💳</span> Payment Method
            </h3>
            <p className="text-gray-300 text-sm">
              {paymentMethod === 'upi' && 'UPI (Google Pay, PhonePe, Paytm)'}
              {paymentMethod === 'card' && 'Credit/Debit Card'}
              {paymentMethod === 'netbanking' && 'Net Banking'}
              {paymentMethod === 'cod' && 'Cash on Delivery'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-white/10">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isProcessing}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg 
                     font-semibold transition-all disabled:opacity-50"
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white 
                     rounded-lg font-semibold hover:scale-105 transition-all"
          >
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            disabled={isProcessing}
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white 
                     rounded-lg font-semibold hover:scale-105 transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent 
                               rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              'Place Order'
            )}
          </button>
        )}
      </div>
    </form>
  )
}