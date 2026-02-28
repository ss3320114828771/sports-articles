'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Types
interface StoreSettings {
  // General
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  storeCity: string
  storeState: string
  storePincode: string
  storeCountry: string
  currency: string
  timezone: string
  
  // Business
  gstNumber: string
  panNumber: string
  businessType: string
  yearEstablished: string
  
  // Shipping
  shippingFlatRate: number
  freeShippingThreshold: number
  
  // Tax
  taxRate: number
  taxInclusive: boolean
  
  // Payment
  codEnabled: boolean
  upiEnabled: boolean
  upiId: string
  cardEnabled: boolean
  netBankingEnabled: boolean
  
  // Email
  orderEmail: boolean
  stockAlertEmail: boolean
  newsletterEnabled: boolean
  
  // SEO
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  googleAnalyticsId: string
}

interface SettingFormProps {
  initialData?: Partial<StoreSettings>
  onSubmit?: (data: StoreSettings) => void
  isSubmitting?: boolean
  mode?: 'general' | 'business' | 'shipping' | 'tax' | 'payment' | 'email' | 'seo'
  className?: string
}

export default function SettingForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  mode = 'general',
  className = ''
}: SettingFormProps) {
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState<StoreSettings>({
    // General
    storeName: initialData.storeName || 'Sports Elite',
    storeEmail: initialData.storeEmail || 'sajid.syed@gmail.com',
    storePhone: initialData.storePhone || '+91 98765 43210',
    storeAddress: initialData.storeAddress || '123 Sports Avenue',
    storeCity: initialData.storeCity || 'Mumbai',
    storeState: initialData.storeState || 'Maharashtra',
    storePincode: initialData.storePincode || '400001',
    storeCountry: initialData.storeCountry || 'India',
    currency: initialData.currency || 'INR',
    timezone: initialData.timezone || 'Asia/Kolkata',
    
    // Business
    gstNumber: initialData.gstNumber || '27ABCDE1234F1Z5',
    panNumber: initialData.panNumber || 'ABCDE1234F',
    businessType: initialData.businessType || 'Retail',
    yearEstablished: initialData.yearEstablished || '2020',
    
    // Shipping
    shippingFlatRate: initialData.shippingFlatRate || 99,
    freeShippingThreshold: initialData.freeShippingThreshold || 1000,
    
    // Tax
    taxRate: initialData.taxRate || 18,
    taxInclusive: initialData.taxInclusive || false,
    
    // Payment
    codEnabled: initialData.codEnabled !== undefined ? initialData.codEnabled : true,
    upiEnabled: initialData.upiEnabled !== undefined ? initialData.upiEnabled : true,
    upiId: initialData.upiId || 'sports.elite@okhdfcbank',
    cardEnabled: initialData.cardEnabled !== undefined ? initialData.cardEnabled : true,
    netBankingEnabled: initialData.netBankingEnabled !== undefined ? initialData.netBankingEnabled : true,
    
    // Email
    orderEmail: initialData.orderEmail !== undefined ? initialData.orderEmail : true,
    stockAlertEmail: initialData.stockAlertEmail !== undefined ? initialData.stockAlertEmail : true,
    newsletterEnabled: initialData.newsletterEnabled !== undefined ? initialData.newsletterEnabled : true,
    
    // SEO
    metaTitle: initialData.metaTitle || 'Sports Elite - Premium Sports Equipment',
    metaDescription: initialData.metaDescription || 'Buy premium sports equipment online. Football, cricket, basketball, and more.',
    metaKeywords: initialData.metaKeywords || 'sports, football, cricket, basketball, sports equipment',
    googleAnalyticsId: initialData.googleAnalyticsId || 'UA-123456789-1'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error for this field
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  // Handle number input
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : 0
    }))
  }

  // Validate form based on mode
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (mode === 'general') {
      if (!formData.storeName.trim()) {
        newErrors.storeName = 'Store name is required'
      }
      if (!formData.storeEmail.trim()) {
        newErrors.storeEmail = 'Store email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.storeEmail)) {
        newErrors.storeEmail = 'Invalid email format'
      }
      if (!formData.storePhone.trim()) {
        newErrors.storePhone = 'Phone number is required'
      }
      if (!formData.storeAddress.trim()) {
        newErrors.storeAddress = 'Address is required'
      }
      if (!formData.storeCity.trim()) {
        newErrors.storeCity = 'City is required'
      }
      if (!formData.storeState.trim()) {
        newErrors.storeState = 'State is required'
      }
      if (!formData.storePincode.trim()) {
        newErrors.storePincode = 'Pincode is required'
      }
    }

    if (mode === 'business') {
      if (!formData.gstNumber.trim()) {
        newErrors.gstNumber = 'GST number is required'
      }
      if (!formData.panNumber.trim()) {
        newErrors.panNumber = 'PAN number is required'
      }
    }

    if (mode === 'shipping') {
      if (formData.shippingFlatRate < 0) {
        newErrors.shippingFlatRate = 'Shipping rate cannot be negative'
      }
      if (formData.freeShippingThreshold < 0) {
        newErrors.freeShippingThreshold = 'Free shipping threshold cannot be negative'
      }
    }

    if (mode === 'tax') {
      if (formData.taxRate < 0 || formData.taxRate > 100) {
        newErrors.taxRate = 'Tax rate must be between 0 and 100'
      }
    }

    if (mode === 'payment') {
      if (formData.upiEnabled && !formData.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required when UPI is enabled'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (onSubmit) {
      await onSubmit(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  // Handle reset
  const handleReset = () => {
    if (confirm('Reset all settings to default?')) {
      setFormData({
        // General
        storeName: 'Sports Elite',
        storeEmail: 'sajid.syed@gmail.com',
        storePhone: '+91 98765 43210',
        storeAddress: '123 Sports Avenue',
        storeCity: 'Mumbai',
        storeState: 'Maharashtra',
        storePincode: '400001',
        storeCountry: 'India',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        
        // Business
        gstNumber: '27ABCDE1234F1Z5',
        panNumber: 'ABCDE1234F',
        businessType: 'Retail',
        yearEstablished: '2020',
        
        // Shipping
        shippingFlatRate: 99,
        freeShippingThreshold: 1000,
        
        // Tax
        taxRate: 18,
        taxInclusive: false,
        
        // Payment
        codEnabled: true,
        upiEnabled: true,
        upiId: 'sports.elite@okhdfcbank',
        cardEnabled: true,
        netBankingEnabled: true,
        
        // Email
        orderEmail: true,
        stockAlertEmail: true,
        newsletterEnabled: true,
        
        // SEO
        metaTitle: 'Sports Elite - Premium Sports Equipment',
        metaDescription: 'Buy premium sports equipment online. Football, cricket, basketball, and more.',
        metaKeywords: 'sports, football, cricket, basketball, sports equipment',
        googleAnalyticsId: 'UA-123456789-1'
      })
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.back()
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white capitalize">
          {mode} Settings
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 
                   text-yellow-400 rounded-lg transition-colors"
        >
          Reset to Default
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
          <p className="text-green-400 text-center">Settings saved successfully!</p>
        </div>
      )}

      {/* General Settings */}
      {mode === 'general' && (
        <div className="bg-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">General Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Store Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.storeName ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.storeName && <p className="text-red-400 text-xs mt-1">{errors.storeName}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Store Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="storeEmail"
                value={formData.storeEmail}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.storeEmail ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.storeEmail && <p className="text-red-400 text-xs mt-1">{errors.storeEmail}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Store Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.storePhone ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.storePhone && <p className="text-red-400 text-xs mt-1">{errors.storePhone}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white focus:outline-none focus:border-green-400"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white focus:outline-none focus:border-green-400"
              >
                <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                <option value="Asia/Dubai">GST (UTC+4)</option>
                <option value="America/New_York">EST (UTC-5)</option>
                <option value="Europe/London">GMT (UTC+0)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Store Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                       focus:outline-none focus:border-green-400
                       ${errors.storeAddress ? 'border-red-500' : 'border-white/20'}`}
            />
            {errors.storeAddress && <p className="text-red-400 text-xs mt-1">{errors.storeAddress}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="storeCity"
                value={formData.storeCity}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.storeCity ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.storeCity && <p className="text-red-400 text-xs mt-1">{errors.storeCity}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                State <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="storeState"
                value={formData.storeState}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.storeState ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.storeState && <p className="text-red-400 text-xs mt-1">{errors.storeState}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Pincode <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="storePincode"
                value={formData.storePincode}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.storePincode ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.storePincode && <p className="text-red-400 text-xs mt-1">{errors.storePincode}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Country</label>
            <input
              type="text"
              name="storeCountry"
              value={formData.storeCountry}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-green-400"
            />
          </div>
        </div>
      )}

      {/* Business Settings */}
      {mode === 'business' && (
        <div className="bg-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                GST Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.gstNumber ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.gstNumber && <p className="text-red-400 text-xs mt-1">{errors.gstNumber}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                PAN Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.panNumber ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.panNumber && <p className="text-red-400 text-xs mt-1">{errors.panNumber}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white focus:outline-none focus:border-green-400"
              >
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Year Established</label>
              <input
                type="number"
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleNumberChange}
                min="1900"
                max="2024"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white focus:outline-none focus:border-green-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {mode === 'shipping' && (
        <div className="bg-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Shipping Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Flat Shipping Rate (₹)</label>
              <input
                type="number"
                name="shippingFlatRate"
                value={formData.shippingFlatRate}
                onChange={handleNumberChange}
                min="0"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.shippingFlatRate ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.shippingFlatRate && <p className="text-red-400 text-xs mt-1">{errors.shippingFlatRate}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={formData.freeShippingThreshold}
                onChange={handleNumberChange}
                min="0"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.freeShippingThreshold ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.freeShippingThreshold && <p className="text-red-400 text-xs mt-1">{errors.freeShippingThreshold}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Tax Settings */}
      {mode === 'tax' && (
        <div className="bg-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Tax Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleNumberChange}
                min="0"
                max="100"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.taxRate ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.taxRate && <p className="text-red-400 text-xs mt-1">{errors.taxRate}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="taxInclusive"
                  checked={formData.taxInclusive}
                  onChange={handleChange}
                  className="w-5 h-5 accent-green-500"
                />
                <span className="text-white">Tax Inclusive Pricing</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {mode === 'payment' && (
        <div className="bg-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="codEnabled"
                checked={formData.codEnabled}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-white">Cash on Delivery</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="cardEnabled"
                checked={formData.cardEnabled}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-white">Credit/Debit Card</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="upiEnabled"
                checked={formData.upiEnabled}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-white">UPI</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="netBankingEnabled"
                checked={formData.netBankingEnabled}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-white">Net Banking</span>
            </label>
          </div>

          {formData.upiEnabled && (
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                UPI ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="store@okhdfcbank"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white 
                         focus:outline-none focus:border-green-400
                         ${errors.upiId ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.upiId && <p className="text-red-400 text-xs mt-1">{errors.upiId}</p>}
            </div>
          )}
        </div>
      )}

      {/* Email Settings */}
      {mode === 'email' && (
        <div className="bg-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="orderEmail"
                checked={formData.orderEmail}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-white">Order Confirmation Emails</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="stockAlertEmail"
                checked={formData.stockAlertEmail}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-white">Stock Alert Emails</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="newsletterEnabled"
                checked={formData.newsletterEnabled}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-white">Newsletter</span>
            </label>
          </div>
        </div>
      )}

      {/* SEO Settings */}
      {mode === 'seo' && (
        <div className="bg-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-green-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleChange}
              placeholder="sports, football, cricket"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Google Analytics ID</label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={formData.googleAnalyticsId}
              onChange={handleChange}
              placeholder="UA-XXXXXXXXX-X"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg 
                   font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white 
                   rounded-lg font-semibold hover:scale-105 transition-all 
                   disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}