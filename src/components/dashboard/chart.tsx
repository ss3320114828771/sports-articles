'use client'

import { useState } from 'react'

// Types
interface DataPoint {
  label: string
  value: number
  color?: string
}

interface ChartProps {
  type?: 'line' | 'bar' | 'pie' | 'area'
  data: DataPoint[]
  title?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  className?: string
}

export default function Chart({
  type = 'line',
  data,
  title,
  height = 300,
  showLegend = true,
  showGrid = true,
  className = ''
}: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Colors for chart elements
  const colors = [
    'from-green-400 to-blue-500',
    'from-yellow-400 to-orange-500',
    'from-purple-400 to-pink-500',
    'from-red-400 to-pink-500',
    'from-indigo-400 to-purple-500',
    'from-blue-400 to-cyan-500'
  ]

  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.value), 1)

  // Format value
  const formatValue = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
    return `₹${value}`
  }

  // Render line chart
  const renderLineChart = () => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - (d.value / maxValue) * 80
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {showGrid && [0, 25, 50, 75].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}

        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
          opacity="0.2"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - (d.value / maxValue) * 80
          const isHovered = hoveredIndex === i

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isHovered ? "2.5" : "1.5"}
                fill="white"
                stroke="url(#gradient)"
                strokeWidth="1"
                className="transition-all cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredIndex(i)
                  setTooltipPos({ x: e.clientX, y: e.clientY })
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // Render bar chart
  const renderBarChart = () => {
    return (
      <div className="relative w-full h-full flex items-end justify-around gap-2">
        {data.map((d, i) => {
          const height = (d.value / maxValue) * 80
          const isHovered = hoveredIndex === i
          const colorIndex = i % colors.length

          return (
            <div
              key={i}
              className="relative flex-1 flex flex-col items-center group"
              onMouseEnter={(e) => {
                setHoveredIndex(i)
                setTooltipPos({ x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Bar */}
              <div
                className={`w-full bg-gradient-to-t ${colors[colorIndex]} rounded-t-lg transition-all duration-300
                          ${isHovered ? 'opacity-100 scale-105' : 'opacity-80'}`}
                style={{ height: `${height}%` }}
              />
              
              {/* Label */}
              <span className="absolute -bottom-6 text-xs text-gray-400 rotate-45 origin-left">
                {d.label}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  // Render pie chart
  const renderPieChart = () => {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    let currentAngle = 0

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
        {data.map((d, i) => {
          const percentage = d.value / total
          const angle = percentage * 360
          const startAngle = currentAngle
          const endAngle = currentAngle + angle
          currentAngle = endAngle

          const startRad = (startAngle * Math.PI) / 180
          const endRad = (endAngle * Math.PI) / 180

          const x1 = 50 + 40 * Math.cos(startRad)
          const y1 = 50 + 40 * Math.sin(startRad)
          const x2 = 50 + 40 * Math.cos(endRad)
          const y2 = 50 + 40 * Math.sin(endRad)

          const largeArcFlag = angle > 180 ? 1 : 0
          const colorIndex = i % colors.length
          const isHovered = hoveredIndex === i

          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={`url(#pieGradient${i})`}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
              className={`transition-all cursor-pointer ${isHovered ? 'opacity-100 scale-105' : 'opacity-80'}`}
              onMouseEnter={(e) => {
                setHoveredIndex(i)
                setTooltipPos({ x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <title>{`${d.label}: ${formatValue(d.value)}`}</title>
            </path>
          )
        })}

        {/* Gradient definitions */}
        <defs>
          {data.map((_, i) => {
            const colorIndex = i % colors.length
            const [from, to] = colors[colorIndex].split(' ')
            return (
              <linearGradient key={i} id={`pieGradient${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={from.replace('from-', '')} />
                <stop offset="100%" stopColor={to.replace('to-', '')} />
              </linearGradient>
            )
          })}
        </defs>
      </svg>
    )
  }

  // Render area chart
  const renderAreaChart = () => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - (d.value / maxValue) * 80
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {showGrid && [0, 25, 50, 75].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}

        {/* Area */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#areaGradient)"
          opacity="0.8"
        />

        {/* Top line */}
        <polyline
          points={points}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - (d.value / maxValue) * 80
          const isHovered = hoveredIndex === i

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isHovered ? "2.5" : "1.5"}
              fill="white"
              stroke="url(#areaGradient)"
              strokeWidth="1"
              className="transition-all cursor-pointer"
              onMouseEnter={(e) => {
                setHoveredIndex(i)
                setTooltipPos({ x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // Render legend
  const renderLegend = () => {
    if (!showLegend) return null

    return (
      <div className="flex flex-wrap gap-4 mt-4">
        {data.map((d, i) => {
          const colorIndex = i % colors.length
          const isHovered = hoveredIndex === i

          return (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm transition-all cursor-pointer
                        ${isHovered ? 'scale-105' : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[colorIndex]}`} />
              <span className="text-gray-300">{d.label}</span>
              <span className="text-white font-semibold">{formatValue(d.value)}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // Render tooltip
  const renderTooltip = () => {
    if (hoveredIndex === null || !data[hoveredIndex]) return null

    return (
      <div
        className="fixed z-50 bg-black/90 text-white px-3 py-2 rounded-lg text-sm pointer-events-none
                   transform -translate-x-1/2 -translate-y-full"
        style={{ left: tooltipPos.x, top: tooltipPos.y - 10 }}
      >
        <p className="font-semibold">{data[hoveredIndex].label}</p>
        <p className="text-green-400">{formatValue(data[hoveredIndex].value)}</p>
      </div>
    )
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Title */}
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}

      {/* Chart Container */}
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        {showGrid && (
          <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>{formatValue(maxValue)}</span>
            <span>{formatValue(maxValue * 0.75)}</span>
            <span>{formatValue(maxValue * 0.5)}</span>
            <span>{formatValue(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
        )}

        {/* Chart */}
        <div className="w-full h-full">
          {type === 'line' && renderLineChart()}
          {type === 'bar' && renderBarChart()}
          {type === 'pie' && renderPieChart()}
          {type === 'area' && renderAreaChart()}
        </div>
      </div>

      {/* Legend */}
      {renderLegend()}

      {/* Tooltip */}
      {renderTooltip()}

      {/* No data message */}
      {data.length === 0 && (
        <div className="flex items-center justify-center h-48 text-gray-400">
          No data available
        </div>
      )}
    </div>
  )
}