'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DirectionsPage() {
  const [activeTab, setActiveTab] = useState('map')
  const [selectedTransport, setSelectedTransport] = useState('all')

  // Transport options
  const transportModes = [
    { id: 'all', name: 'All', icon: '🚗' },
    { id: 'metro', name: 'Metro', icon: '🚇' },
    { id: 'bus', name: 'Bus', icon: '🚌' },
    { id: 'car', name: 'Car', icon: '🚗' },
    { id: 'train', name: 'Train', icon: '🚂' },
    { id: 'walk', name: 'Walking', icon: '🚶' }
  ]

  // Directions data
  const directions = [
    {
      id: 1,
      transport: 'metro',
      title: 'By Metro',
      icon: '🚇',
      color: 'blue',
      steps: [
        'Take Line 1 (Blue Line) towards Stadium Station',
        'Exit from Gate No. 3',
        'Walk straight for 5 minutes',
        'Store is on your right, opposite the stadium'
      ],
      duration: '25 mins',
      fare: '₹40',
      tips: 'Last train at 11:30 PM'
    },
    {
      id: 2,
      transport: 'bus',
      title: 'By Bus',
      icon: '🚌',
      color: 'green',
      steps: [
        'Routes: 123, 456, 789 to Stadium Stop',
        'Get off at Stadium Bus Stop',
        'Cross the road at pedestrian crossing',
        'Walk 2 minutes towards East',
        'Store is opposite the stadium'
      ],
      duration: '35 mins',
      fare: '₹25',
      tips: 'Buses every 10 minutes'
    },
    {
      id: 3,
      transport: 'car',
      title: 'By Car',
      icon: '🚗',
      color: 'orange',
      steps: [
        'Take Western Express Highway',
        'Exit at Stadium Junction',
        'Follow signs to Stadium Parking',
        'Enter from Gate B to basement parking',
        'Take elevator to Ground Floor'
      ],
      duration: '20 mins',
      fare: '₹50 (parking)',
      tips: 'Free parking for first 2 hours with purchase'
    },
    {
      id: 4,
      transport: 'train',
      title: 'By Local Train',
      icon: '🚂',
      color: 'purple',
      steps: [
        'Take Western Line to Churchgate',
        'Change to Harbour Line',
        'Get off at Stadium Station',
        'Take East exit',
        'Store is 5 minutes walk'
      ],
      duration: '40 mins',
      fare: '₹15',
      tips: 'Avoid peak hours (9-11 AM, 6-8 PM)'
    },
    {
      id: 5,
      transport: 'walk',
      title: 'Walking',
      icon: '🚶',
      color: 'green',
      steps: [
        'From Stadium Station, head East on Main Road',
        'Turn right at the signal',
        'Walk past the stadium',
        'Store is on your left, next to Cafe'
      ],
      duration: '10 mins from station',
      fare: 'Free',
      tips: 'Well-lit path, safe for walking'
    }
  ]

  // Parking information
  const parkingInfo = [
    {
      type: 'Car Parking',
      spots: 150,
      rate: 'Free for 2 hours, ₹50/hour after',
      level: 'Basement P1-P3',
      available: true
    },
    {
      type: 'Bike Parking',
      spots: 50,
      rate: 'Free',
      level: 'Ground Floor',
      available: true
    },
    {
      type: 'Valet Parking',
      spots: 20,
      rate: '₹100',
      level: 'Main Entrance',
      available: true
    },
    {
      type: 'Handicap Parking',
      spots: 10,
      rate: 'Free',
      level: 'Near Elevator',
      available: true
    }
  ]

  // Nearby landmarks
  const landmarks = [
    { name: 'Stadium', distance: '0.2 km', icon: '🏟️' },
    { name: 'Grand Hotel', distance: '0.3 km', icon: '🏨' },
    { name: 'City Mall', distance: '0.5 km', icon: '🛍️' },
    { name: 'Central Park', distance: '0.7 km', icon: '🌳' },
    { name: 'Metro Station', distance: '0.8 km', icon: '🚇' },
    { name: 'Bus Terminal', distance: '1.0 km', icon: '🚌' }
  ]

  // Filter directions by transport
  const filteredDirections = selectedTransport === 'all' 
    ? directions 
    : directions.filter(d => d.transport === selectedTransport)

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
            How to Find{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Us
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Multiple ways to reach our store. Choose the most convenient option for you.
          </p>
        </div>
      </section>

      {/* Store Address Card */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 text-center backdrop-blur-lg border border-white/20">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-3xl font-bold text-white mb-2">Sports Elite Store</h2>
            <p className="text-xl text-gray-300 mb-4">
              123 Sports Avenue, Stadium Road, Mumbai - 400001
            </p>
            <div className="flex justify-center gap-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Open Today 9AM-9PM</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Free Parking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🗺️ Interactive Map
            </button>
            <button
              onClick={() => setActiveTab('directions')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'directions'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🧭 Directions
            </button>
            <button
              onClick={() => setActiveTab('parking')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'parking'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🅿️ Parking
            </button>
            <button
              onClick={() => setActiveTab('landmarks')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'landmarks'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🏛️ Nearby Landmarks
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg border border-white/20">
            {/* Map Tab */}
            {activeTab === 'map' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Interactive Map</h2>
                
                {/* Map Placeholder */}
                <div className="aspect-w-16 aspect-h-9 bg-white/5 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🗺️</div>
                    <p className="text-gray-400 text-lg">Google Maps Integration</p>
                    <p className="text-gray-500 mt-2">123 Sports Avenue, Mumbai - 400001</p>
                    
                    {/* Quick Actions */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                      <a
                        href="https://maps.google.com/?q=123+Sports+Avenue+Mumbai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-colors"
                      >
                        Open in Google Maps
                      </a>
                      <a
                        href="https://maps.apple.com/?address=123+Sports+Avenue+Mumbai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-colors"
                      >
                        Open in Apple Maps
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">📍</div>
                    <h3 className="text-white font-semibold mb-1">Exact Location</h3>
                    <p className="text-gray-400 text-sm">Pinpoint accuracy</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🛣️</div>
                    <h3 className="text-white font-semibold mb-1">Live Traffic</h3>
                    <p className="text-gray-400 text-sm">Real-time updates</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">📱</div>
                    <h3 className="text-white font-semibold mb-1">Street View</h3>
                    <p className="text-gray-400 text-sm">360° virtual tour</p>
                  </div>
                </div>
              </div>
            )}

            {/* Directions Tab */}
            {activeTab === 'directions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Directions</h2>
                  
                  {/* Transport Filter */}
                  <div className="flex gap-2">
                    {transportModes.map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedTransport(mode.id)}
                        className={`p-2 rounded-lg transition-all ${
                          selectedTransport === mode.id
                            ? 'bg-green-500/20 text-green-400 border-2 border-green-400'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                        title={mode.name}
                      >
                        <span className="text-xl">{mode.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDirections.map((direction) => (
                    <div
                      key={direction.id}
                      className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{direction.icon}</span>
                        <h3 className="text-xl font-bold text-white">{direction.title}</h3>
                      </div>

                      <div className="space-y-3 mb-4">
                        {direction.steps.map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <span className="text-green-400 font-bold">{index + 1}.</span>
                            <p className="text-gray-300">{step}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-white/10">
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">Duration</p>
                          <p className="text-white font-semibold">{direction.duration}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">Estimated Fare</p>
                          <p className="text-green-400 font-semibold">{direction.fare}</p>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-blue-400">
                        💡 {direction.tips}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parking Tab */}
            {activeTab === 'parking' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Parking Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parkingInfo.map((parking, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{parking.type}</h3>
                        {parking.available ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                            Full
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Spots:</span>
                          <span className="text-white">{parking.spots}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rate:</span>
                          <span className="text-green-400">{parking.rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Level:</span>
                          <span className="text-white">{parking.level}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Parking Tips */}
                <div className="bg-blue-500/10 rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Parking Tips</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Free parking for first 2 hours with purchase of ₹1000+</li>
                    <li>• Valet parking available at main entrance</li>
                    <li>• EV charging stations in basement P2</li>
                    <li>• Handicap parking near elevator on all levels</li>
                    <li>• Peak hours: Weekends 11AM-6PM</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Landmarks Tab */}
            {activeTab === 'landmarks' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Nearby Landmarks</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {landmarks.map((landmark, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center gap-4">
                      <span className="text-3xl">{landmark.icon}</span>
                      <div>
                        <h3 className="text-white font-semibold">{landmark.name}</h3>
                        <p className="text-green-400 text-sm">{landmark.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Area Map */}
                <div className="mt-6 bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Area Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🏦</span>
                      <p className="text-gray-300 text-sm">5+ Banks</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🏧</span>
                      <p className="text-gray-300 text-sm">10+ ATMs</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">☕</span>
                      <p className="text-gray-300 text-sm">8+ Cafes</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🏥</span>
                      <p className="text-gray-300 text-sm">2 Hospitals</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/contact"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📞</span>
              <h3 className="text-white font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm">Contact our support team</p>
            </Link>

            <Link
              href="/products"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">🛍️</span>
              <h3 className="text-white font-semibold mb-2">Shop Now</h3>
              <p className="text-gray-400 text-sm">Browse our products</p>
            </Link>

            <Link
              href="/about"
              className="bg-white/5 hover:bg-white/10 rounded-lg p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">ℹ️</span>
              <h3 className="text-white font-semibold mb-2">About Us</h3>
              <p className="text-gray-400 text-sm">Learn more about our store</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Info Footer */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Store Location managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
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