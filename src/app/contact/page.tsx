'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (formData.phone && !/^[6-9]\d{9}$|^\+91[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Invalid phone number'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters'
    }

    return newErrors
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error('Error sending message')
    } finally {
      setIsSubmitting(false)
    }
  }

  // FAQ data
  const faqs = [
    {
      question: 'What are your store hours?',
      answer: 'Our store is open Monday to Saturday from 9:00 AM to 9:00 PM. We remain closed on Sundays and public holidays.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day easy returns on all products. Items must be unused and in original packaging.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email and SMS.'
    },
    {
      question: 'Do you provide installation services?',
      answer: 'Yes, we offer professional installation services for sports equipment at an additional cost.'
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
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Touch
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Success Message */}
      {isSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
            <p className="text-green-400">✓ Thank you for contacting us! We'll get back to you within 24 hours.</p>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Visit Us */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
                <p className="text-gray-300">
                  123 Sports Avenue,<br />
                  Stadium Road,<br />
                  Mumbai - 400001,<br />
                  Maharashtra, India
                </p>
              </div>

              {/* Call Us */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                <p className="text-gray-300 mb-2">
                  <span className="text-green-400">Main:</span><br />
                  <a href="tel:+919876543210" className="hover:text-green-400 transition-colors">
                    +91 98765 43210
                  </a>
                </p>
                <p className="text-gray-300">
                  <span className="text-blue-400">Support:</span><br />
                  <a href="tel:+919876543211" className="hover:text-blue-400 transition-colors">
                    +91 98765 43211
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-2">Mon-Sat: 9:00 AM - 9:00 PM</p>
              </div>

              {/* Email Us */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                <p className="text-gray-300 mb-2">
                  <span className="text-green-400">General:</span><br />
                  <a href="mailto:sajid.syed@gmail.com" className="hover:text-green-400 transition-colors">
                    sajid.syed@gmail.com
                  </a>
                </p>
                <p className="text-gray-300">
                  <span className="text-blue-400">Support:</span><br />
                  <a href="mailto:support@sports-elite.com" className="hover:text-blue-400 transition-colors">
                    support@sports-elite.com
                  </a>
                </p>
              </div>

              {/* Social Media */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-2xl hover:bg-blue-600/30 transition-all hover:scale-110">
                    📘
                  </a>
                  <a href="#" className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center text-2xl hover:bg-sky-500/30 transition-all hover:scale-110">
                    🐦
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center text-2xl hover:bg-pink-600/30 transition-all hover:scale-110">
                    📷
                  </a>
                  <a href="#" className="w-12 h-12 bg-blue-700/20 rounded-lg flex items-center justify-center text-2xl hover:bg-blue-700/30 transition-all hover:scale-110">
                    💼
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 ${
                        errors.name ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 ${
                        errors.email ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 ${
                        errors.phone ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-green-400 ${
                        errors.subject ? 'border-red-500' : 'border-white/20'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales Question</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="partnership">Partnership</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Your Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 ${
                        errors.message ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {formData.message.length}/1000 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Find Us Here</h2>
            <div className="aspect-w-16 aspect-h-9 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-400">Google Maps Integration</p>
                <p className="text-xs text-gray-500 mt-2">123 Sports Avenue, Mumbai - 400001</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-semibold">{faq.question}</span>
                    <span className="text-2xl text-gray-400">
                      {activeFaq === index ? '−' : '+'}
                    </span>
                  </button>
                  
                  {activeFaq === index && (
                    <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 text-center backdrop-blur-lg border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Need Immediate Assistance?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our customer support team is available 24/7 to help you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+919876543210"
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                📞 Call Now
              </a>
              <a
                href="mailto:support@sports-elite.com"
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                ✉️ Email Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Info Footer */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
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