'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Types
interface StatCard {
  id: string
  title: string
  value: number | string
  icon: string
  color: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'pink'
  trend?: {
    value: number
    isPositive: boolean
  }
  link?: string
  subtitle?: string
}

interface StatsCardsProps {
  cards?: StatCard[]
  loading?: boolean
  columns?: 2 | 3 | 4 | 6
  onCardClick?: (cardId: string) => void
  className?: string
}

export default function StatsCards({
  cards: propCards,
  loading = false,
  columns = 4,
  onCardClick,
  className = ''
}: StatsCardsProps) {
  const [cards, setCards] = useState<StatCard[]>([])
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Default cards if none provided
  useEffect(() => {
    if (propCards) {
      setCards(propCards)
    } else {
      // Mock data
      setCards([
        {
          id: '1',
          title: 'Total Revenue',
          value: '₹4,589,999',
          icon: '💰',
          color: 'green',
          trend: { value: 12.5, isPositive: true },
          subtitle: 'Last 30 days'
        },
        {
          id: '2',
          title: 'Total Orders',
          value: '1,567',
          icon: '🛒',
          color: 'blue',
          trend: { value: 8.2, isPositive: true },
          subtitle: 'Last 30 days'
        },
        {
          id: '3',
          title: 'Total Customers',
          value: '3,245',
          icon: '👥',
          color: 'purple',
          trend: { value: 5.3, isPositive: true },
          subtitle: 'New this month'
        },
        {
          id: '4',
          title: 'Total Products',
          value: '234',
          icon: '📦',
          color: 'yellow',
          trend: { value: 2.1, isPositive: true },
          subtitle: 'In stock'
        },
        {
          id: '5',
          title: 'Pending Orders',
          value: '23',
          icon: '⏳',
          color: 'red',
          trend: { value: 5, isPositive: false },
          link: '/dashboard/orders?status=pending'
        },
        {
          id: '6',
          title: 'Low Stock',
          value: '12',
          icon: '⚠️',
          color: 'yellow',
          link: '/dashboard/products?stock=low'
        }
      ])
    }
  }, [propCards])

  // Get color classes
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, gradient: string }> = {
      green: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        gradient: 'from-green-500 to-green-600'
      },
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        gradient: 'from-blue-500 to-blue-600'
      },
      yellow: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        gradient: 'from-yellow-500 to-yellow-600'
      },
      red: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        gradient: 'from-red-500 to-red-600'
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        gradient: 'from-purple-500 to-purple-600'
      },
      pink: {
        bg: 'bg-pink-500/10',
        text: 'text-pink-400',
        gradient: 'from-pink-500 to-pink-600'
      }
    }
    return colors[color] || colors.blue
  }

  // Get grid columns class
  const getGridClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 6: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }
  }

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // Handle card click
  const handleCardClick = (card: StatCard) => {
    if (card.link) {
      window.location.href = card.link
    } else if (onCardClick) {
      onCardClick(card.id)
    }
  }

  if (loading) {
    return (
      <div className={`grid ${getGridClass()} gap-4 ${className}`}>
        {[...Array(columns)].map((_, i) => (
          <div
            key={i}
            className="bg-white/10 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-white/20 rounded w-20"></div>
                <div className="h-8 bg-white/20 rounded w-24"></div>
                <div className="h-3 bg-white/20 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${getGridClass()} gap-4 ${className}`}>
      {cards.map((card) => {
        const colors = getColorClasses(card.color)
        const isHovered = hoveredCard === card.id

        return (
          <div
            key={card.id}
            className={`
              relative overflow-hidden rounded-xl p-6
              ${card.link || onCardClick ? 'cursor-pointer' : ''}
              transition-all duration-300 transform
              ${isHovered ? 'scale-105 shadow-xl' : ''}
            `}
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`
            }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(card)}
          >
            {/* Background Gradient */}
            <div
              className={`
                absolute inset-0 opacity-10 transition-opacity duration-300
                ${isHovered ? 'opacity-20' : ''}
              `}
              style={{
                background: `linear-gradient(135deg, ${
                  card.color === 'green' ? '#4ade80' :
                  card.color === 'blue' ? '#3b82f6' :
                  card.color === 'yellow' ? '#facc15' :
                  card.color === 'red' ? '#ef4444' :
                  card.color === 'purple' ? '#a855f7' :
                  '#ec4899'
                } 0%, transparent 100%)`
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                  </p>
                </div>
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                  ${colors.bg} transition-transform duration-300
                  ${isHovered ? 'scale-110 rotate-3' : ''}
                `}>
                  {card.icon}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs">
                {/* Trend */}
                {card.trend && (
                  <div className="flex items-center gap-1">
                    <span className={card.trend.isPositive ? 'text-green-400' : 'text-red-400'}>
                      {card.trend.isPositive ? '↑' : '↓'}
                    </span>
                    <span className={card.trend.isPositive ? 'text-green-400' : 'text-red-400'}>
                      {card.trend.value}%
                    </span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                )}

                {/* Subtitle */}
                {card.subtitle && !card.trend && (
                  <span className="text-gray-500">{card.subtitle}</span>
                )}

                {/* Link Indicator */}
                {card.link && (
                  <span className="text-gray-400 hover:text-white transition-colors">
                    View →
                  </span>
                )}
              </div>

              {/* Progress Ring (for certain stats) */}
              {card.id === '5' && (
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-red-400"
                      strokeDasharray={`${(23 / 100) * 251.2} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              )}

              {card.id === '6' && (
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-yellow-400"
                      strokeDasharray={`${(12 / 50) * 251.2} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Glow Effect on Hover */}
            {isHovered && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${
                    card.color === 'green' ? '#4ade80' :
                    card.color === 'blue' ? '#3b82f6' :
                    card.color === 'yellow' ? '#facc15' :
                    card.color === 'red' ? '#ef4444' :
                    card.color === 'purple' ? '#a855f7' :
                    '#ec4899'
                  } 0%, transparent 70%)`
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}