'use client'

import { useState } from 'react'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  disabled?: boolean
  minAmount?: number
  maxAmount?: number
}

interface PaymentMethodsProps {
  selectedMethod: string
  onSelect: (methodId: string) => void
  totalAmount?: number
  disabled?: boolean
  className?: string
}

export default function PaymentMethods({
  selectedMethod,
  onSelect,
  totalAmount = 0,
  disabled = false,
  className = ''
}: PaymentMethodsProps) {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null)

  // Payment methods configuration
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using Google Pay, PhonePe, Paytm, or any UPI app',
      minAmount: 1,
      maxAmount: 200000
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay, American Express',
      minAmount: 1
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks including SBI, HDFC, ICICI, Axis',
      minAmount: 1
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: '👛',
      description: 'Paytm Wallet, Amazon Pay, PhonePe Wallet',
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive your order',
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'emi',
      name: 'EMI',
      icon: '📅',
      description: 'No-cost EMI available on select cards',
      minAmount: 3000
    }
  ]

  // Check if method is available for current amount
  const isMethodAvailable = (method: PaymentMethod): boolean => {
    if (method.disabled) return false
    if (method.minAmount && totalAmount < method.minAmount) return false
    if (method.maxAmount && totalAmount > method.maxAmount) return false
    return true
  }

  // Get method status message
  const getMethodStatus = (method: PaymentMethod): string | null => {
    if (method.disabled) return 'Temporarily unavailable'
    if (method.minAmount && totalAmount < method.minAmount) {
      return `Minimum amount: ₹${method.minAmount.toLocaleString('en-IN')}`
    }
    if (method.maxAmount && totalAmount > method.maxAmount) {
      return `Maximum amount: ₹${method.maxAmount.toLocaleString('en-IN')}`
    }
    return null
  }

  // Handle method selection
  const handleSelect = (methodId: string) => {
    if (disabled) return
    const method = paymentMethods.find(m => m.id === methodId)
    if (method && isMethodAvailable(method)) {
      onSelect(methodId)
    }
  }

  // Toggle expanded method
  const toggleExpand = (methodId: string) => {
    setExpandedMethod(expandedMethod === methodId ? null : methodId)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>

      {/* Payment Methods List */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isAvailable = isMethodAvailable(method)
          const statusMessage = getMethodStatus(method)
          const isSelected = selectedMethod === method.id
          const isExpanded = expandedMethod === method.id

          return (
            <div
              key={method.id}
              className={`
                relative bg-white/5 rounded-lg border-2 transition-all
                ${isSelected ? 'border-green-400' : 'border-transparent'}
                ${!isAvailable ? 'opacity-50' : 'hover:bg-white/10 cursor-pointer'}
              `}
              onClick={() => isAvailable && handleSelect(method.id)}
            >
              {/* Main Method Row */}
              <div className="p-4">
                <div className="flex items-center gap-4">
                  {/* Radio Button */}
                  <div className="flex-shrink-0">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected 
                        ? 'border-green-400' 
                        : 'border-gray-400'
                      }
                    `}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                      )}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">{method.icon}</div>

                  {/* Method Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{method.name}</h4>
                      {!isAvailable && statusMessage && (
                        <span className="text-xs text-red-400">
                          {statusMessage}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {method.description}
                    </p>
                  </div>

                  {/* Expand/Collapse Button */}
                  {method.id === 'emi' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(method.id)
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  )}
                </div>

                {/* Expanded EMI Options */}
                {isExpanded && method.id === 'emi' && (
                  <div className="mt-4 pl-14 space-y-3">
                    <p className="text-sm text-gray-300">Choose EMI option:</p>
                    {[3, 6, 9, 12].map((months) => {
                      const emiAmount = Math.round(totalAmount / months)
                      const interest = months > 6 ? 15 : 12
                      const totalWithInterest = totalAmount + (totalAmount * interest / 100)
                      const monthlyEmi = Math.round(totalWithInterest / months)

                      return (
                        <label
                          key={months}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="radio"
                            name="emi"
                            value={`${months}`}
                            className="w-4 h-4 accent-green-500"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              {months} months EMI
                            </p>
                            <p className="text-xs text-gray-400">
                              ₹{monthlyEmi.toLocaleString('en-IN')}/month
                            </p>
                          </div>
                          <p className="text-green-400 text-sm font-semibold">
                            ₹{totalWithInterest.toLocaleString('en-IN')}
                          </p>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* UPI Options (when UPI selected) */}
              {isSelected && method.id === 'upi' && (
                <div className="px-4 pb-4 pl-14 space-y-3">
                  <p className="text-sm text-gray-300 mb-2">Choose UPI app:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['gpay', 'phonepe', 'paytm', 'amazonpay', 'bhim', 'others'].map((app) => (
                      <button
                        key={app}
                        className="p-2 bg-white/5 rounded-lg text-center hover:bg-white/10 
                                 transition-colors text-xs text-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {app === 'gpay' && '📱 Google Pay'}
                        {app === 'phonepe' && '📱 PhonePe'}
                        {app === 'paytm' && '📱 Paytm'}
                        {app === 'amazonpay' && '📱 Amazon Pay'}
                        {app === 'bhim' && '📱 BHIM'}
                        {app === 'others' && '📱 Other UPI'}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">
                      Or enter UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 
                               rounded-lg text-white text-sm placeholder-gray-400
                               focus:outline-none focus:border-green-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Card Options (when Card selected) */}
              {isSelected && method.id === 'card' && (
                <div className="px-4 pb-4 pl-14 space-y-3">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {['visa', 'mastercard', 'rupay', 'amex'].map((card) => (
                      <div
                        key={card}
                        className="p-2 bg-white/5 rounded-lg text-center text-gray-300 text-xs"
                      >
                        {card === 'visa' && '💳 Visa'}
                        {card === 'mastercard' && '💳 Mastercard'}
                        {card === 'rupay' && '💳 RuPay'}
                        {card === 'amex' && '💳 AmEx'}
                      </div>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 
                               rounded-lg text-white text-sm placeholder-gray-400 mb-2
                               focus:outline-none focus:border-green-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-3 py-2 bg-white/10 border border-white/20 
                                 rounded-lg text-white text-sm placeholder-gray-400
                                 focus:outline-none focus:border-green-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-3 py-2 bg-white/10 border border-white/20 
                                 rounded-lg text-white text-sm placeholder-gray-400
                                 focus:outline-none focus:border-green-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Security Message */}
      <div className="mt-6 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
        <p className="text-xs text-green-400 flex items-center gap-2">
          <span>🔒</span>
          Your payment information is secure. All transactions are encrypted.
        </p>
      </div>

      {/* Payment Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• You'll be redirected to a secure payment page</p>
        <p>• We never store your full card details</p>
        <p>• 3D Secure authentication may be required</p>
      </div>
    </div>
  )
}