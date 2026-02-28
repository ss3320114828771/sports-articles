'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TermsPage() {
  const [lastUpdated] = useState('March 15, 2024')

  // Terms sections
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: '📋',
      content: [
        'By accessing or using our website and services, you agree to be bound by these Terms and Conditions.',
        'If you do not agree to any part of these terms, you may not access or use our services.',
        'These terms apply to all visitors, users, and customers of Sports Elite.',
        'We reserve the right to update or modify these terms at any time without prior notice.'
      ]
    },
    {
      id: 'account',
      title: 'Account Registration',
      icon: '👤',
      content: [
        'You must be at least 18 years old to create an account.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration.',
        'You are responsible for all activities that occur under your account.',
        'Notify us immediately of any unauthorized use of your account.',
        'We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion.'
      ]
    },
    {
      id: 'orders',
      title: 'Orders and Payments',
      icon: '🛒',
      content: [
        'All orders are subject to acceptance and availability.',
        'Prices are subject to change without notice.',
        'We accept various payment methods including UPI, cards, net banking, and cash on delivery.',
        'Payment must be received in full before order processing begins.',
        'We reserve the right to cancel any order for any reason.',
        'In case of payment failure, orders will not be processed.',
        'Cash on Delivery orders require verification before dispatch.'
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing and Availability',
      icon: '💰',
      content: [
        'All prices are in Indian Rupees (INR) and include applicable taxes.',
        'Product availability is subject to change without notice.',
        'We strive to display accurate pricing, but errors may occur.',
        'In case of pricing errors, we reserve the right to cancel affected orders.',
        'Shipping charges are calculated based on order value and location.',
        'Discount offers cannot be combined unless explicitly stated.'
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping and Delivery',
      icon: '🚚',
      content: [
        'We ship to all locations across India and select international destinations.',
        'Estimated delivery times are provided for guidance only.',
        'Shipping costs are calculated at checkout based on order value and destination.',
        'Orders are processed within 24-48 hours of confirmation.',
        'Tracking information will be provided via email and SMS.',
        'Risk of loss passes to you upon delivery.',
        'Delays due to customs or courier partners are not our responsibility.'
      ]
    },
    {
      id: 'returns',
      title: 'Returns and Refunds',
      icon: '↩️',
      content: [
        'We offer a 30-day return policy from the date of delivery.',
        'Items must be unused, in original packaging, with all tags attached.',
        'Return shipping costs are borne by the customer unless the item is defective.',
        'Refunds are processed within 7-10 business days after receiving the returned item.',
        'Refunds are credited to the original payment method.',
        'Cash on Delivery orders are refunded via bank transfer.',
        'Certain items (like personalized products) are non-returnable.'
      ]
    },
    {
      id: 'warranty',
      title: 'Warranty and Guarantees',
      icon: '🛡️',
      content: [
        'Products come with manufacturer warranty where applicable.',
        'Warranty periods vary by product and brand.',
        'Warranty covers manufacturing defects only.',
        'Damage due to misuse, accidents, or normal wear and tear is not covered.',
        'To claim warranty, contact our support team with order details.',
        'We will assist in warranty claims but final approval rests with the manufacturer.'
      ]
    },
    {
      id: 'intellectual',
      title: 'Intellectual Property',
      icon: '©️',
      content: [
        'All content on this website is the property of Sports Elite or its licensors.',
        'You may not reproduce, distribute, or modify any content without written permission.',
        'Trademarks, logos, and brand names are the property of their respective owners.',
        'Unauthorized use of our content may violate copyright laws.',
        'User-generated content (reviews, comments) becomes our property upon submission.',
        'We reserve the right to remove any user content at our discretion.'
      ]
    },
    {
      id: 'conduct',
      title: 'User Conduct',
      icon: '⚖️',
      content: [
        'You agree to use our services only for lawful purposes.',
        'You may not engage in any activity that disrupts or interferes with our services.',
        'Harassment, abuse, or inappropriate behavior towards our staff will not be tolerated.',
        'You may not upload viruses or malicious code.',
        'False reviews or misleading information are prohibited.',
        'Violation may result in account termination and legal action.'
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: '⚠️',
      content: [
        'We are not liable for any indirect, incidental, or consequential damages.',
        'Our total liability is limited to the amount you paid for the product.',
        'We are not responsible for delays due to circumstances beyond our control.',
        'Product descriptions and images are for illustrative purposes; actual products may vary.',
        'We do not guarantee that our services will be error-free or uninterrupted.'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy and Data Protection',
      icon: '🔒',
      content: [
        'Your use of our services is also governed by our Privacy Policy.',
        'We collect and process personal information as described in our Privacy Policy.',
        'We implement security measures to protect your data.',
        'We do not sell your personal information to third parties.',
        'You have the right to access, correct, or delete your data.',
        'For details, please refer to our complete Privacy Policy.'
      ]
    },
    {
      id: 'governing',
      title: 'Governing Law',
      icon: '🏛️',
      content: [
        'These terms are governed by the laws of India.',
        'Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai.',
        'We encourage amicable resolution of disputes before legal action.',
        'If any provision is found unenforceable, the remaining provisions remain in effect.',
        'These terms constitute the entire agreement between you and Sports Elite.'
      ]
    }
  ]

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

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Terms &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Conditions
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-500/10 rounded-2xl p-6 backdrop-blur-lg border border-yellow-500/20">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📌</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Quick Summary</h2>
                <p className="text-gray-300">
                  By using Sports Elite, you agree to these terms. We offer 30-day returns, 
                  secure payments, and worldwide shipping. Read the full terms below for 
                  complete details about your rights and responsibilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Quick Navigation</h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        <span>{section.icon}</span>
                        <span className="text-sm">{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Contact Card */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3">Questions?</p>
                  <Link
                    href="/contact"
                    className="block w-full px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg text-center text-sm font-semibold hover:scale-105 transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Terms Content */}
            <div className="lg:col-span-3 space-y-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg border border-white/20 scroll-mt-24"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{section.icon}</span>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>

                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li key={index} className="flex gap-3 text-gray-300">
                        <span className="text-green-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact Information */}
              <div className="bg-blue-500/10 rounded-2xl p-8 backdrop-blur-lg border border-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Questions About Terms?</h3>
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">✉️</span>
                    <a href="mailto:legal@sports-elite.com" className="hover:text-green-400 transition-colors">
                      legal@sports-elite.com
                    </a>
                  </p>
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">📞</span>
                    <a href="tel:+919876543210" className="hover:text-green-400 transition-colors">
                      +91 98765 43210
                    </a>
                  </p>
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">📍</span>
                    <span>
                      123 Sports Avenue, Stadium Road,<br />
                      Mumbai - 400001, Maharashtra, India
                    </span>
                  </p>
                </div>
              </div>

              {/* Acceptance */}
              <div className="bg-white/5 rounded-2xl p-6 text-center">
                <p className="text-gray-300">
                  By using our website and services, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/privacy"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">🔒</span>
              <h3 className="text-white font-semibold mb-2">Privacy Policy</h3>
              <p className="text-gray-400 text-sm">How we protect your data</p>
            </Link>

            <Link
              href="/about"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">ℹ️</span>
              <h3 className="text-white font-semibold mb-2">About Us</h3>
              <p className="text-gray-400 text-sm">Learn more about our company</p>
            </Link>

            <Link
              href="/contact"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📞</span>
              <h3 className="text-white font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-400 text-sm">Get in touch with our team</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Info Footer */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Terms managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
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