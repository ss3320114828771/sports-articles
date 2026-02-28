'use client'

import { useState } from 'react'

interface TabItem {
  id: string
  label: string
  icon?: string
  badge?: number
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'underlined' | 'pills' | 'boxed'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
  children?: React.ReactNode
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  children
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return
    
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'underlined':
        return {
          container: 'border-b border-white/10',
          tab: (isActive: boolean) => `
            ${isActive ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}
          `
        }
      case 'pills':
        return {
          container: '',
          tab: (isActive: boolean) => `
            rounded-lg
            ${isActive 
              ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' 
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }
          `
        }
      case 'boxed':
        return {
          container: 'border border-white/20 rounded-lg p-1',
          tab: (isActive: boolean) => `
            rounded-md
            ${isActive 
              ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' 
              : 'text-gray-400 hover:text-white'
            }
          `
        }
      default:
        return {
          container: '',
          tab: (isActive: boolean) => `
            ${isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'}
          `
        }
    }
  }

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm gap-1.5'
      case 'lg':
        return 'px-6 py-3 text-lg gap-2.5'
      default:
        return 'px-4 py-2 text-base gap-2'
    }
  }

  const variantStyles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyles.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              flex items-center justify-center
              ${sizeStyles}
              ${fullWidth ? 'flex-1' : ''}
              font-medium transition-all duration-200
              ${variantStyles.tab(activeTab === tab.id)}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {tab.icon && <span className="text-lg">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`
                ml-1 px-1.5 py-0.5 text-xs rounded-full
                ${activeTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/10 text-gray-400'
                }
              `}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Tab Panel Component
interface TabPanelProps {
  id: string
  activeId?: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ id, activeId, children, className = '' }: TabPanelProps) {
  if (id !== activeId) return null
  
  return (
    <div className={className}>
      {children}
    </div>
  )
}