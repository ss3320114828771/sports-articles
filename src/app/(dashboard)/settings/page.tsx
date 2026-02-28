'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface StoreSettings {
  // General Settings
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
  
  // Business Settings
  gstNumber: string
  panNumber: string
  businessType: string
  yearEstablished: string
  
  // Shipping Settings
  shippingFlatRate: string
  freeShippingThreshold: string
  shippingZones: string
  
  // Tax Settings
  taxRate: string
  taxInclusive: boolean
  
  // Payment Settings
  codEnabled: boolean
  upiEnabled: boolean
  upiId: string
  cardEnabled: boolean
  netBankingEnabled: boolean
  
  // Email Settings
  orderEmail: boolean
  stockAlertEmail: boolean
  newsletterEnabled: boolean
  
  // SEO Settings
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  googleAnalyticsId: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  // Settings state
  const [settings, setSettings] = useState<StoreSettings>({
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
    shippingFlatRate: '99',
    freeShippingThreshold: '1000',
    shippingZones: 'Domestic, International',
    
    // Tax
    taxRate: '18',
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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle save
  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle reset
  const handleReset = () => {
    setShowResetModal(false)
    // Reset to default values
    setSettings({
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
      gstNumber: '27ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      businessType: 'Retail',
      yearEstablished: '2020',
      shippingFlatRate: '99',
      freeShippingThreshold: '1000',
      shippingZones: 'Domestic, International',
      taxRate: '18',
      taxInclusive: false,
      codEnabled: true,
      upiEnabled: true,
      upiId: 'sports.elite@okhdfcbank',
      cardEnabled: true,
      netBankingEnabled: true,
      orderEmail: true,
      stockAlertEmail: true,
      newsletterEnabled: true,
      metaTitle: 'Sports Elite - Premium Sports Equipment',
      metaDescription: 'Buy premium sports equipment online. Football, cricket, basketball, and more.',
      metaKeywords: 'sports, football, cricket, basketball, sports equipment',
      googleAnalyticsId: 'UA-123456789-1'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-6">
      {/* Bismillah */}
      <div className="text-center mb-4 md:mb-6">
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your store configuration</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-semibold transition-colors"
            >
              ↩️ Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
            <p className="text-green-400 text-center">Settings saved successfully!</p>
          </div>
        )}

        {/* Settings Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'general' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            🏠 General
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'business' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            💼 Business
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'shipping' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            🚚 Shipping
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'tax' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            💰 Tax
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'payment' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            💳 Payment
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'email' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            📧 Email
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'seo' 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            🔍 SEO
          </button>
        </div>

        {/* Settings Forms */}
        <div className="bg-white/10 rounded-lg p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Store Email</label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={settings.storeEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Store Phone</label>
                  <input
                    type="text"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Currency</label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
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
                    value={settings.timezone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  >
                    <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                    <option value="Asia/Dubai">GST (UTC+4)</option>
                    <option value="America/New_York">EST (UTC-5)</option>
                    <option value="Europe/London">GMT (UTC+0)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm mb-2">Store Address</label>
                  <input
                    type="text"
                    name="storeAddress"
                    value={settings.storeAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">City</label>
                  <input
                    type="text"
                    name="storeCity"
                    value={settings.storeCity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">State</label>
                  <input
                    type="text"
                    name="storeState"
                    value={settings.storeState}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Pincode</label>
                  <input
                    type="text"
                    name="storePincode"
                    value={settings.storePincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Country</label>
                  <input
                    type="text"
                    name="storeCountry"
                    value={settings.storeCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Settings */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Business Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={settings.gstNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={settings.panNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Business Type</label>
                  <select
                    name="businessType"
                    value={settings.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
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
                    value={settings.yearEstablished}
                    onChange={handleChange}
                    min="1900"
                    max="2024"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Shipping Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Flat Shipping Rate (₹)</label>
                  <input
                    type="number"
                    name="shippingFlatRate"
                    value={settings.shippingFlatRate}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    name="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm mb-2">Shipping Zones</label>
                  <input
                    type="text"
                    name="shippingZones"
                    value={settings.shippingZones}
                    onChange={handleChange}
                    placeholder="Domestic, International, etc."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tax Settings */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Tax Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    name="taxRate"
                    value={settings.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <input
                    type="checkbox"
                    name="taxInclusive"
                    checked={settings.taxInclusive}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="text-white font-semibold">Tax Inclusive Pricing</p>
                    <p className="text-gray-400 text-sm">Prices include tax</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Payment Settings</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                    <input
                      type="checkbox"
                      name="codEnabled"
                      checked={settings.codEnabled}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="text-white font-semibold">Cash on Delivery</p>
                      <p className="text-gray-400 text-sm">Accept COD payments</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                    <input
                      type="checkbox"
                      name="upiEnabled"
                      checked={settings.upiEnabled}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="text-white font-semibold">UPI Payments</p>
                      <p className="text-gray-400 text-sm">Accept UPI payments</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                    <input
                      type="checkbox"
                      name="cardEnabled"
                      checked={settings.cardEnabled}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="text-white font-semibold">Card Payments</p>
                      <p className="text-gray-400 text-sm">Credit/Debit cards</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                    <input
                      type="checkbox"
                      name="netBankingEnabled"
                      checked={settings.netBankingEnabled}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="text-white font-semibold">Net Banking</p>
                      <p className="text-gray-400 text-sm">All major banks</p>
                    </div>
                  </label>
                </div>

                {settings.upiEnabled && (
                  <div className="mt-4">
                    <label className="block text-gray-300 text-sm mb-2">UPI ID</label>
                    <input
                      type="text"
                      name="upiId"
                      value={settings.upiId}
                      onChange={handleChange}
                      placeholder="store@okhdfcbank"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Email Settings</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <input
                    type="checkbox"
                    name="orderEmail"
                    checked={settings.orderEmail}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="text-white font-semibold">Order Confirmation Emails</p>
                    <p className="text-gray-400 text-sm">Send emails for new orders</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <input
                    type="checkbox"
                    name="stockAlertEmail"
                    checked={settings.stockAlertEmail}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="text-white font-semibold">Stock Alert Emails</p>
                    <p className="text-gray-400 text-sm">Notify when stock is low</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <input
                    type="checkbox"
                    name="newsletterEnabled"
                    checked={settings.newsletterEnabled}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="text-white font-semibold">Newsletter</p>
                    <p className="text-gray-400 text-sm">Send newsletters to subscribers</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">SEO Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={settings.metaTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                  <p className="text-gray-500 text-xs mt-1">{settings.metaTitle.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={settings.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                  <p className="text-gray-500 text-xs mt-1">{settings.metaDescription.length}/160 characters</p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={settings.metaKeywords}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                  <p className="text-gray-500 text-xs mt-1">Comma separated keywords</p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    name="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={handleChange}
                    placeholder="UA-XXXXXXXXX-X"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg text-center">
          <p className="text-sm text-gray-400">
            Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Reset Settings</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to reset all settings to default? This cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded font-semibold"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}