'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  const [lastUpdated] = useState('March 15, 2024')

  // Policy sections
  const sections = [
    {
      id: 'information',
      title: 'Information We Collect',
      icon: '📋',
      content: [
        'Personal information you provide to us (name, email, phone number, shipping address)',
        'Payment information (processed securely through our payment partners)',
        'Account credentials (username and password)',
        'Order history and preferences',
        'Communication history with our support team',
        'Device information (IP address, browser type, operating system)',
        'Usage data (pages visited, time spent, clicks)'
      ]
    },
    {
      id: 'use',
      title: 'How We Use Your Information',
      icon: '⚙️',
      content: [
        'Process and fulfill your orders',
        'Communicate with you about orders, products, and promotions',
        'Improve our website and customer experience',
        'Personalize your shopping experience',
        'Prevent fraud and ensure security',
        'Comply with legal obligations',
        'Send marketing communications (with your consent)'
      ]
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: '🔄',
      content: [
        'We do not sell your personal information to third parties',
        'We share information with shipping partners to deliver orders',
        'Payment processors handle your payment information securely',
        'Service providers assist with website operations and marketing',
        'Legal authorities when required by law',
        'Business transfers in case of merger or acquisition'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: '🍪',
      content: [
        'Essential cookies for website functionality',
        'Analytics cookies to understand user behavior',
        'Marketing cookies for personalized ads',
        'Preference cookies to remember your settings',
        'You can control cookies through browser settings',
        'Third-party cookies from services like Google Analytics'
      ]
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: '🔒',
      content: [
        'SSL encryption for all data transmission',
        'Regular security audits and updates',
        'Limited access to personal information',
        'Secure data storage with industry standards',
        'Regular backups to prevent data loss',
        'Employee training on data protection'
      ]
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: '⚖️',
      content: [
        'Access your personal information',
        'Correct inaccurate data',
        'Delete your account and data',
        'Opt-out of marketing communications',
        'Export your data in portable format',
        'Withdraw consent at any time',
        'Lodge a complaint with authorities'
      ]
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      icon: '🧒',
      content: [
        'Our services are not directed to children under 13',
        'We do not knowingly collect data from children',
        'Parental consent required for minors',
        'Contact us to remove child\'s information'
      ]
    },
    {
      id: 'changes',
      title: 'Policy Changes',
      icon: '📝',
      content: [
        'We may update this policy periodically',
        'Material changes will be notified via email',
        'Continued use means acceptance of changes',
        'Check this page for latest version',
        'Last updated: ' + lastUpdated
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
            Privacy{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Policy
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-500/10 rounded-2xl p-6 backdrop-blur-lg border border-green-500/20">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📌</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Quick Summary</h2>
                <p className="text-gray-300">
                  We respect your privacy and are committed to protecting your personal data. 
                  This policy explains what information we collect, how we use it, and your rights. 
                  By using our services, you agree to the terms of this policy.
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
                  <p className="text-sm text-gray-400 mb-3">Privacy Questions?</p>
                  <Link
                    href="/contact"
                    className="block w-full px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg text-center text-sm font-semibold hover:scale-105 transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Policy Content */}
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

              {/* Additional Information */}
              <div className="bg-blue-500/10 rounded-2xl p-8 backdrop-blur-lg border border-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                <p className="text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">✉️</span>
                    <a href="mailto:privacy@sports-elite.com" className="hover:text-green-400 transition-colors">
                      privacy@sports-elite.com
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

              {/* Consent */}
              <div className="bg-white/5 rounded-2xl p-6 text-center">
                <p className="text-gray-300">
                  By using our website and services, you consent to our Privacy Policy and agree to its terms.
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
              href="/terms"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📜</span>
              <h3 className="text-white font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-gray-400 text-sm">Read our terms of service</p>
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
            Privacy Policy managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
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