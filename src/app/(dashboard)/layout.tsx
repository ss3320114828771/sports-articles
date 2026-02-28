'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Types
interface NavItem {
  name: string
  href: string
  icon: string
  badge?: number
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [pathname, isMobile])

  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Products', href: '/dashboard/products', icon: '📦', badge: 156 },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛒', badge: 12 },
    { name: 'Categories', href: '/dashboard/categories', icon: '📁', badge: 8 },
    { name: 'Brands', href: '/dashboard/brands', icon: '🏷️', badge: 15 },
    { name: 'Coupons', href: '/dashboard/coupons', icon: '🎫', badge: 5 },
    { name: 'Users', href: '/dashboard/users', icon: '👥', badge: 1243 },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' }
  ]

  // Handle logout
  const handleLogout = () => {
    setShowLogoutModal(false)
    // Add your logout logic here
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white/10 backdrop-blur-lg p-3 rounded-lg text-white"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="block">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Sports Elite
            </h1>
            <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              HS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">Hafiz Sajid Syed</p>
              <p className="text-gray-400 text-xs truncate">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-l-4 border-green-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {item.badge > 999 ? '999+' : item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`md:ml-64 min-h-screen transition-all duration-300 ${
        isSidebarOpen && isMobile ? 'blur-sm' : ''
      }`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center justify-end px-4 md:px-8 py-4">
            {/* Right side items */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Messages */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">✉️</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                    HS
                  </div>
                  <span className="hidden md:block text-white">Hafiz Sajid</span>
                  <span className="text-gray-400 text-sm">▼</span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-purple-900 to-indigo-900 rounded-lg shadow-xl border border-white/10 py-1 z-50">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <span>👤</span>
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </Link>
                    <hr className="border-white/10 my-1" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        setShowLogoutModal(true)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          {/* Bismillah at top of each page */}
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white opacity-75">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h2>
          </div>
          
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6 border border-white/20">
            <div className="text-center">
              <div className="text-5xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-white mb-2">Logout</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}