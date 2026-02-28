'use client'

import Link from 'next/link'

interface FooterProps {
  className?: string
}

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  // Footer sections
  const sections = {
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Store Location', href: '/directions' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    help: {
      title: 'Help & Support',
      links: [
        { name: 'FAQs', href: '/faqs' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns Policy', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Track Order', href: '/track-order' }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Disclaimer', href: '/disclaimer' }
      ]
    },
    categories: {
      title: 'Categories',
      links: [
        { name: 'Football', href: '/shop/categories/football' },
        { name: 'Cricket', href: '/shop/categories/cricket' },
        { name: 'Basketball', href: '/shop/categories/basketball' },
        { name: 'Tennis', href: '/shop/categories/tennis' },
        { name: 'Swimming', href: '/shop/categories/swimming' },
        { name: 'Boxing', href: '/shop/categories/boxing' }
      ]
    }
  }

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: 'https://facebook.com/sports.elite', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com/sports_elite', color: 'hover:text-sky-400' },
    { name: 'Instagram', icon: '📷', href: 'https://instagram.com/sports.elite', color: 'hover:text-pink-400' },
    { name: 'YouTube', icon: '🎥', href: 'https://youtube.com/sports-elite', color: 'hover:text-red-400' },
    { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/company/sports-elite', color: 'hover:text-blue-600' },
    { name: 'WhatsApp', icon: '📱', href: 'https://wa.me/919876543210', color: 'hover:text-green-400' }
  ]

  // Payment methods
  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'RuPay', icon: '💳' },
    { name: 'UPI', icon: '📱' },
    { name: 'Net Banking', icon: '🏦' },
    { name: 'Cash on Delivery', icon: '💵' }
  ]

  return (
    <footer className={`bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-lg border-t border-white/10 ${className}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo & Description */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Sports Elite
              </h2>
            </Link>
            <p className="text-sm text-gray-400 mt-3">
              Your premier destination for quality sports equipment. Serving athletes since 2020.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl text-gray-400 ${social.color} transition-colors hover:scale-110 transform`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {Object.entries(sections).map(([key, section]) => (
            <div key={key} className="md:col-span-1">
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-white/10 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-white font-medium">Visit Us</p>
              <p className="text-gray-400">123 Sports Avenue, Mumbai - 400001</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">📞</span>
            <div>
              <p className="text-white font-medium">Call Us</p>
              <a href="tel:+919876543210" className="text-gray-400 hover:text-white transition-colors">
                +91 98765 43210
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">✉️</span>
            <div>
              <p className="text-white font-medium">Email Us</p>
              <a href="mailto:sajid.syed@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                sajid.syed@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods & Trust Badges */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">We Accept:</span>
            <div className="flex gap-3">
              {paymentMethods.map((method) => (
                <span
                  key={method.name}
                  className="text-2xl text-gray-400 hover:text-white transition-colors"
                  title={method.name}
                >
                  {method.icon}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Trusted By:</span>
            <div className="flex gap-3">
              <span className="text-gray-400 hover:text-white transition-colors" title="Google Trusted Store">
                🔒
              </span>
              <span className="text-gray-400 hover:text-white transition-colors" title="SSL Secure">
                🛡️
              </span>
              <span className="text-gray-400 hover:text-white transition-colors" title="Money Back Guarantee">
                💰
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400">
            © {currentYear} Sports Elite. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/sitemap" className="text-xs text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            Admin: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 
                   rounded-full flex items-center justify-center text-white text-2xl
                   shadow-lg hover:scale-110 transition-all opacity-75 hover:opacity-100
                   animate-bounce"
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  )
}