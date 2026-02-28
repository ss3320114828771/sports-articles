'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  userRole?: 'super_admin' | 'admin' | 'manager' | 'customer'
  userName?: string
  userEmail?: string
  className?: string
}

export default function Sidebar({
  isOpen = true,
  onClose,
  userRole = 'customer',
  userName = 'Guest User',
  userEmail = 'guest@example.com',
  className = ''
}: SidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard'])

  // Toggle menu expansion
  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    )
  }

  // Navigation items based on user role
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      roles: ['super_admin', 'admin', 'manager', 'customer']
    },
    {
      name: 'Products',
      icon: '📦',
      roles: ['super_admin', 'admin', 'manager'],
      children: [
        { name: 'All Products', href: '/dashboard/products', icon: '📋' },
        { name: 'Add New', href: '/dashboard/products/new', icon: '➕' },
        { name: 'Categories', href: '/dashboard/categories', icon: '📁' },
        { name: 'Brands', href: '/dashboard/brands', icon: '🏷️' }
      ]
    },
    {
      name: 'Orders',
      icon: '🛒',
      roles: ['super_admin', 'admin', 'manager'],
      children: [
        { name: 'All Orders', href: '/dashboard/orders', icon: '📋' },
        { name: 'Pending', href: '/dashboard/orders?status=pending', icon: '⏳' },
        { name: 'Processing', href: '/dashboard/orders?status=processing', icon: '⚙️' },
        { name: 'Delivered', href: '/dashboard/orders?status=delivered', icon: '✅' }
      ]
    },
    {
      name: 'Customers',
      href: '/dashboard/customers',
      icon: '👥',
      roles: ['super_admin', 'admin', 'manager']
    },
    {
      name: 'Marketing',
      icon: '📢',
      roles: ['super_admin', 'admin'],
      children: [
        { name: 'Coupons', href: '/dashboard/coupons', icon: '🎫' },
        { name: 'Newsletter', href: '/dashboard/newsletter', icon: '📧' }
      ]
    },
    {
      name: 'Reports',
      icon: '📊',
      roles: ['super_admin', 'admin', 'manager'],
      children: [
        { name: 'Sales', href: '/dashboard/reports/sales', icon: '💰' },
        { name: 'Inventory', href: '/dashboard/reports/inventory', icon: '📦' }
      ]
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: '⚙️',
      roles: ['super_admin', 'admin']
    }
  ]

  // Filter items by user role
  const filteredItems = navItems.filter(item => 
    item.roles.includes(userRole)
  )

  // Check if item is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  // Check if any child is active
  const hasActiveChild = (children?: { href: string }[]) => {
    return children?.some(child => pathname.startsWith(child.href)) || false
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64
          bg-gradient-to-b from-purple-900 to-indigo-900
          border-r border-white/10 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          z-50 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-0
          ${className}
        `}
      >
        {/* Logo Area */}
        <div className="sticky top-0 bg-purple-900/95 backdrop-blur-lg border-b border-white/10 p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-xl font-bold text-white">Sports Elite</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 
                          rounded-full flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedMenus.includes(item.name.toLowerCase())
            const active = hasChildren 
              ? hasActiveChild(item.children)
              : isActive(item.href!)

            return (
              <div key={item.name} className="space-y-1">
                {/* Menu Item */}
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.name.toLowerCase())}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg
                      transition-colors
                      ${active
                        ? 'bg-green-500/20 text-green-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-colors
                      ${active
                        ? 'bg-green-500/20 text-green-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}

                {/* Child Items */}
                {hasChildren && isExpanded && (
                  <div className="ml-8 space-y-1">
                    {item.children?.map((child) => {
                      const childActive = isActive(child.href)

                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg
                            transition-colors
                            ${childActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }
                          `}
                        >
                          <span className="text-sm">{child.icon}</span>
                          <span className="text-sm">{child.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sticky bottom-0 bg-purple-900/95 backdrop-blur-lg border-t border-white/10 p-4">
          <p className="text-xs text-gray-500 text-center">
            Version 1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}