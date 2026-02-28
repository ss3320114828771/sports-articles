'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Types
interface NavItem {
  name: string
  href: string
  icon: string
  badge?: number
  roles?: string[]
  children?: NavItem[]
}

interface SidebarNavProps {
  userRole?: string
  collapsed?: boolean
  onToggle?: () => void
  className?: string
}

export default function SidebarNav({ 
  userRole = 'admin',
  collapsed = false,
  onToggle,
  className = ''
}: SidebarNavProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Navigation items configuration
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      roles: ['super_admin', 'admin', 'manager', 'customer']
    },
    {
      name: 'Products',
      href: '/dashboard/products',
      icon: '📦',
      badge: 156,
      roles: ['super_admin', 'admin', 'manager'],
      children: [
        { name: 'All Products', href: '/dashboard/products', icon: '📋' },
        { name: 'Add New', href: '/dashboard/products/new', icon: '➕' },
        { name: 'Categories', href: '/dashboard/categories', icon: '📁' },
        { name: 'Brands', href: '/dashboard/brands', icon: '🏷️' },
        { name: 'Inventory', href: '/dashboard/inventory', icon: '📊' }
      ]
    },
    {
      name: 'Orders',
      href: '/dashboard/orders',
      icon: '🛒',
      badge: 12,
      roles: ['super_admin', 'admin', 'manager'],
      children: [
        { name: 'All Orders', href: '/dashboard/orders', icon: '📋' },
        { name: 'Pending', href: '/dashboard/orders?status=pending', icon: '⏳' },
        { name: 'Processing', href: '/dashboard/orders?status=processing', icon: '⚙️' },
        { name: 'Shipped', href: '/dashboard/orders?status=shipped', icon: '🚚' },
        { name: 'Delivered', href: '/dashboard/orders?status=delivered', icon: '✅' },
        { name: 'Cancelled', href: '/dashboard/orders?status=cancelled', icon: '❌' }
      ]
    },
    {
      name: 'Customers',
      href: '/dashboard/customers',
      icon: '👥',
      badge: 1243,
      roles: ['super_admin', 'admin', 'manager']
    },
    {
      name: 'Marketing',
      href: '/dashboard/marketing',
      icon: '📢',
      roles: ['super_admin', 'admin'],
      children: [
        { name: 'Coupons', href: '/dashboard/coupons', icon: '🎫', badge: 5 },
        { name: 'Newsletter', href: '/dashboard/newsletter', icon: '📧' },
        { name: 'Banners', href: '/dashboard/banners', icon: '🖼️' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' }
      ]
    },
    {
      name: 'Content',
      href: '/dashboard/content',
      icon: '📝',
      roles: ['super_admin', 'admin'],
      children: [
        { name: 'Pages', href: '/dashboard/pages', icon: '📄' },
        { name: 'Blog', href: '/dashboard/blog', icon: '✍️' },
        { name: 'Testimonials', href: '/dashboard/testimonials', icon: '⭐' },
        { name: 'FAQs', href: '/dashboard/faqs', icon: '❓' }
      ]
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: '📊',
      roles: ['super_admin', 'admin', 'manager'],
      children: [
        { name: 'Sales Report', href: '/dashboard/reports/sales', icon: '💰' },
        { name: 'Inventory Report', href: '/dashboard/reports/inventory', icon: '📦' },
        { name: 'Customer Report', href: '/dashboard/reports/customers', icon: '👥' },
        { name: 'Tax Report', href: '/dashboard/reports/tax', icon: '📋' }
      ]
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: '⚙️',
      roles: ['super_admin', 'admin'],
      children: [
        { name: 'General', href: '/dashboard/settings/general', icon: '🏠' },
        { name: 'Payment', href: '/dashboard/settings/payment', icon: '💳' },
        { name: 'Shipping', href: '/dashboard/settings/shipping', icon: '🚚' },
        { name: 'Tax', href: '/dashboard/settings/tax', icon: '💰' },
        { name: 'Email', href: '/dashboard/settings/email', icon: '📧' },
        { name: 'SEO', href: '/dashboard/settings/seo', icon: '🔍' }
      ]
    }
  ]

  // Filter items by user role
  const filteredItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  )

  // Auto-expand parent of current path
  useEffect(() => {
    const parentsToExpand = filteredItems
      .filter(item => item.children?.some(child => pathname.startsWith(child.href)))
      .map(item => item.name)
    
    setExpandedItems(prev => [...new Set([...prev, ...parentsToExpand])])
  }, [pathname, filteredItems])

  // Toggle expanded state
  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  // Check if item is active
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Check if any child is active
  const hasActiveChild = (children?: NavItem[]) => {
    return children?.some(child => pathname.startsWith(child.href)) || false
  }

  return (
    <aside className={`bg-gradient-to-b from-purple-900 to-indigo-900 border-r border-white/10 ${className}`}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          {!collapsed && (
            <span className="text-xl font-bold text-white">Sports Elite</span>
          )}
        </Link>
        
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="text-xl">{collapsed ? '→' : '←'}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {filteredItems.map((item) => {
          const active = isActive(item.href)
          const expanded = expandedItems.includes(item.name)
          const hasChildren = item.children && item.children.length > 0
          const anyChildActive = hasActiveChild(item.children)

          return (
            <div key={item.name} className="space-y-1">
              {/* Parent Item */}
              <div>
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg
                      transition-all duration-200 group
                      ${active || anyChildActive
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="font-medium truncate">{item.name}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {!collapsed && (
                      <span className="text-xs">
                        {expanded ? '▼' : '▶'}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg
                      transition-all duration-200 group
                      ${active
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="font-medium truncate">{item.name}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </Link>
                )}
              </div>

              {/* Child Items */}
              {hasChildren && expanded && !collapsed && (
                <div className="ml-8 space-y-1">
                  {item.children?.map((child) => {
                    const childActive = pathname === child.href

                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`
                          flex items-center justify-between px-3 py-2 rounded-lg
                          transition-all duration-200
                          ${childActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm">{child.icon}</span>
                          <span className="text-sm truncate">{child.name}</span>
                          {child.badge && (
                            <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 
                          rounded-full flex items-center justify-center text-white font-bold">
              HS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">Hafiz Sajid</p>
              <p className="text-xs text-gray-400 truncate capitalize">{userRole}</p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              ⚙️
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}