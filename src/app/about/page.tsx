'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story')

  // Company milestones
  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'Sports Elite was founded by Hafiz Sajid Syed with a vision to provide premium sports equipment to athletes of all levels.',
      icon: '🚀'
    },
    {
      year: '2021',
      title: 'First Store',
      description: 'Opened our first physical store in Mumbai, serving over 1000 customers in the first month.',
      icon: '🏪'
    },
    {
      year: '2022',
      title: 'Online Launch',
      description: 'Launched our e-commerce platform, making sports equipment accessible across India.',
      icon: '💻'
    },
    {
      year: '2023',
      title: '10000+ Customers',
      description: 'Reached the milestone of 10,000 happy customers and expanded to 5 major cities.',
      icon: '🎯'
    },
    {
      year: '2024',
      title: 'International Shipping',
      description: 'Started shipping internationally, serving customers in 15+ countries worldwide.',
      icon: '🌍'
    }
  ]

  // Team members
  const teamMembers = [
    {
      name: 'Hafiz Sajid Syed',
      role: 'Founder & CEO',
      bio: 'Sports enthusiast with 15+ years of experience in sports equipment industry. Dedicated to providing quality gear to athletes.',
      email: 'sajid.syed@gmail.com',
      icon: '👑'
    },
    {
      name: 'Rahul Sharma',
      role: 'Head of Operations',
      bio: 'Former national level cricketer ensuring quality and authenticity of all cricket equipment.',
      icon: '🏏'
    },
    {
      name: 'Priya Patel',
      role: 'Customer Experience',
      bio: 'Passionate about sports and customer satisfaction, ensuring every customer gets the best experience.',
      icon: '🤝'
    },
    {
      name: 'Amit Kumar',
      role: 'Technical Lead',
      bio: 'Leading the digital transformation of sports equipment shopping with innovative solutions.',
      icon: '💡'
    }
  ]

  // Values
  const values = [
    {
      title: 'Quality First',
      description: 'We personally test every product before it reaches our customers. Only the best makes the cut.',
      icon: '✨'
    },
    {
      title: 'Customer Centric',
      description: 'Your satisfaction is our priority. We go the extra mile to ensure you love your purchase.',
      icon: '❤️'
    },
    {
      title: 'Expert Knowledge',
      description: 'Our team consists of sports enthusiasts who understand the needs of athletes at every level.',
      icon: '📚'
    },
    {
      title: 'Community Support',
      description: 'We actively support local sports clubs and young athletes through sponsorships and training.',
      icon: '🤲'
    }
  ]

  // Statistics
  const stats = [
    { label: 'Happy Customers', value: '15,000+', icon: '😊' },
    { label: 'Products Sold', value: '50,000+', icon: '🏆' },
    { label: 'Cities Served', value: '50+', icon: '📍' },
    { label: 'Years Experience', value: '5+', icon: '⭐' }
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Sports Elite
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Your trusted partner in sports excellence since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'story'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📖 Our Story
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'mission'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🎯 Mission & Values
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'team'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              👥 Our Team
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📞 Contact Us
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg border border-white/20">
            {/* Our Story Tab */}
            {activeTab === 'story' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    From a small dream to a trusted name in sports equipment
                  </p>
                </div>

                {/* Founder's Message */}
                <div className="bg-white/5 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">💭</div>
                    <div>
                      <p className="text-white text-lg italic mb-4">
                        "I started Sports Elite with a simple belief: every athlete deserves access to quality equipment. 
                        Today, we're proud to serve thousands of customers, but our mission remains the same - 
                        to help you perform at your best."
                      </p>
                      <p className="text-green-400 font-semibold">- Hafiz Sajid Syed, Founder</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-8 pb-4 border-l-2 border-green-500/30 last:pb-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{milestone.icon}</span>
                        <span className="text-xl font-bold text-green-400">{milestone.year}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mission & Values Tab */}
            {activeTab === 'mission' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Our Mission & Values</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    What drives us every single day
                  </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-8 text-center">
                  <p className="text-2xl text-white font-semibold mb-4">Our Mission</p>
                  <p className="text-lg text-gray-300">
                    To empower athletes of all levels with premium quality sports equipment, 
                    expert knowledge, and unwavering support, helping them achieve their 
                    personal best and foster a lifelong love for sports.
                  </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {values.map((value, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
                      <div className="text-4xl mb-3">{value.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                      <p className="text-gray-400">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Passionate sports enthusiasts dedicated to your success
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{member.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                          <p className="text-green-400 text-sm mb-2">{member.role}</p>
                          <p className="text-gray-400 text-sm mb-2">{member.bio}</p>
                          {member.email && (
                            <p className="text-blue-400 text-sm">{member.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    We'd love to hear from you
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-white mb-4">📍 Visit Us</h3>
                      <p className="text-gray-300">
                        123 Sports Avenue,<br />
                        Stadium Road,<br />
                        Mumbai - 400001,<br />
                        Maharashtra, India
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-white mb-4">📞 Call Us</h3>
                      <p className="text-gray-300 mb-2">Main: +91 98765 43210</p>
                      <p className="text-gray-300">Support: +91 98765 43211</p>
                      <p className="text-xs text-gray-500 mt-2">Mon-Sat: 9:00 AM - 9:00 PM</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-white mb-4">✉️ Email Us</h3>
                      <p className="text-blue-400 mb-2">sajid.syed@gmail.com</p>
                      <p className="text-gray-300">support@sports-elite.com</p>
                    </div>
                  </div>

                  {/* Quick Contact Form */}
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Send a Message</h3>
                    
                    <form className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Your Email"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={4}
                          placeholder="Your Message"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 text-center backdrop-blur-lg border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Elevate Your Game?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied athletes who trust Sports Elite for their equipment needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Info Footer */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Founded and managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
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