'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface DropdownItem {
  label: string
  value?: string
  icon?: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  width?: 'auto' | 'sm' | 'md' | 'lg' | 'full'
  closeOnSelect?: boolean
  className?: string
}

export default function Dropdown({
  trigger,
  items,
  placement = 'bottom-left',
  width = 'auto',
  closeOnSelect = true,
  className = ''
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return

    if (item.onClick) {
      item.onClick()
    }

    if (closeOnSelect) {
      setIsOpen(false)
    }
  }

  // Get placement styles
  const getPlacementStyles = () => {
    switch (placement) {
      case 'bottom-left':
        return 'top-full left-0 mt-2'
      case 'bottom-right':
        return 'top-full right-0 mt-2'
      case 'top-left':
        return 'bottom-full left-0 mb-2'
      case 'top-right':
        return 'bottom-full right-0 mb-2'
      default:
        return 'top-full left-0 mt-2'
    }
  }

  // Get width styles
  const getWidthStyles = () => {
    switch (width) {
      case 'sm':
        return 'w-32'
      case 'md':
        return 'w-48'
      case 'lg':
        return 'w-64'
      case 'full':
        return 'w-full'
      default:
        return 'w-auto min-w-[160px]'
    }
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50
            ${getPlacementStyles()}
            ${getWidthStyles()}
            bg-gradient-to-b from-purple-900 to-indigo-900
            rounded-lg shadow-xl
            border border-white/20
            overflow-hidden
            animate-fadeIn
          `}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <div key={index}>
                {item.divider ? (
                  <div className="my-1 border-t border-white/10" />
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2
                      text-sm text-gray-300
                      hover:bg-white/10 hover:text-white
                      transition-colors
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon && <span className="text-base">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={`
                      w-full flex items-center gap-2 px-4 py-2
                      text-sm text-gray-300 text-left
                      hover:bg-white/10 hover:text-white
                      transition-colors
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {item.icon && <span className="text-base">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}