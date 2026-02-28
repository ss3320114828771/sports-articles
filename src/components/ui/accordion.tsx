'use client'

import { useState } from 'react'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: string
  disabled?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultExpanded?: string[]
  variant?: 'default' | 'bordered' | 'separated'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onExpand?: (id: string) => void
  onCollapse?: (id: string) => void
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  variant = 'default',
  size = 'md',
  className = '',
  onExpand,
  onCollapse
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded)

  // Toggle item
  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      if (prev.includes(itemId)) {
        onCollapse?.(itemId)
        return prev.filter(id => id !== itemId)
      } else {
        onExpand?.(itemId)
        if (allowMultiple) {
          return [...prev, itemId]
        } else {
          return [itemId]
        }
      }
    })
  }

  // Expand all
  const expandAll = () => {
    if (allowMultiple) {
      setExpandedItems(items.map(item => item.id))
    }
  }

  // Collapse all
  const collapseAll = () => {
    setExpandedItems([])
  }

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return {
          container: 'border border-white/20 rounded-lg overflow-hidden',
          item: 'border-b border-white/20 last:border-b-0'
        }
      case 'separated':
        return {
          container: 'space-y-2',
          item: 'border border-white/20 rounded-lg'
        }
      default:
        return {
          container: '',
          item: ''
        }
    }
  }

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'py-2 px-3 text-sm',
          icon: 'text-base',
          content: 'py-2 px-3 text-sm'
        }
      case 'lg':
        return {
          button: 'py-4 px-6 text-lg',
          icon: 'text-2xl',
          content: 'py-4 px-6 text-base'
        }
      default:
        return {
          button: 'py-3 px-4 text-base',
          icon: 'text-xl',
          content: 'py-3 px-4 text-sm'
        }
    }
  }

  const variantStyles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  return (
    <div className={`${variantStyles.container} ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id)

        return (
          <div
            key={item.id}
            className={`
              ${variantStyles.item}
              ${item.disabled ? 'opacity-50' : ''}
              transition-all duration-200
            `}
          >
            {/* Header Button */}
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              className={`
                w-full flex items-center justify-between
                ${sizeStyles.button}
                bg-white/5 hover:bg-white/10
                transition-colors
                ${item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${isExpanded ? 'bg-white/10' : ''}
              `}
              disabled={item.disabled}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className={sizeStyles.icon}>{item.icon}</span>
                )}
                <span className="font-medium text-white">{item.title}</span>
              </div>
              
              <span className={`
                transform transition-transform duration-200
                ${isExpanded ? 'rotate-180' : ''}
                ${sizeStyles.icon}
              `}>
                ▼
              </span>
            </button>

            {/* Content Panel */}
            {isExpanded && (
              <div
                className={`
                  ${sizeStyles.content}
                  bg-white/5
                  border-t border-white/10
                  animate-slideDown
                `}
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}

      {/* Expand/Collapse All Controls */}
      {allowMultiple && items.length > 1 && (
        <div className="flex justify-end gap-2 mt-2 text-sm">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-green-400 hover:text-green-300 transition-colors"
          >
            Expand All
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
          >
            Collapse All
          </button>
        </div>
      )}
    </div>
  )
}