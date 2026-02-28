'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Types
interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  pendingOrders: number
  lowStock: number
  todayOrders: number
  todayRevenue: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customer: string
  amount: number
  status: string
  date: string
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  image: string
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStock: 0,
    todayOrders: 0,
    todayRevenue: 0
  })

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Mock data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock stats
        setStats({
          totalProducts: 234,
          totalOrders: 1567,
          totalUsers: 3245,
          totalRevenue: 4589999,
          pendingOrders: 23,
          lowStock: 12,
          todayOrders: 45,
          todayRevenue: 189999
        })

        // Mock recent orders
        setRecentOrders([
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            customer: 'John Doe',
            amount: 24999,
            status: 'Delivered',
            date: '2024-03-16'
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            customer: 'Jane Smith',
            amount: 15999,
            status: 'Processing',
            date: '2024-03-16'
          },
          {
            id: '3',
            orderNumber: 'ORD-2024-003',
            customer: 'Rahul Sharma',
            amount: 45999,
            status: 'Shipped',
            date: '2024-03-15'
          },
          {
            id: '4',
            orderNumber: 'ORD-2024-004',
            customer: 'Priya Patel',
            amount: 8999,
            status: 'Pending',
            date: '2024-03-15'
          },
          {
            id: '5',
            orderNumber: 'ORD-2024-005',
            customer: 'Amit Kumar',
            amount: 12999,
            status: 'Delivered',
            date: '2024-03-14'
          }
        ])

        // Mock top products
        setTopProducts([
          {
            id: '1',
            name: 'Nike Mercurial Superfly 9',
            sales: 156,
            revenue: 3899844,
            image: 'n1.jpeg'
          },
          {
            id: '2',
            name: 'SG Test Cricket Bat',
            sales: 98,
            revenue: 1567902,
            image: 'n3.jpeg'
          },
          {
            id: '3',
            name: 'Adidas Predator Edge',
            sales: 87,
            revenue: 2000913,
            image: 'n2.jpeg'
          },
          {
            id: '4',
            name: 'Nike Air Jordan',
            sales: 76,
            revenue: 1443924,
            image: 'n5.jpeg'
          },
          {
            id: '5',
            name: 'Yonex EZONE 100',
            sales: 65,
            revenue: 1039935,
            image: 'n6.jpeg'
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Delivered': 'bg-green-500/20 text-green-400',
      'Processing': 'bg-blue-500/20 text-blue-400',
      'Shipped': 'bg-purple-500/20 text-purple-400',
      'Pending': 'bg-yellow-500/20 text-yellow-400',
      'Cancelled': 'bg-red-500/20 text-red-400'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, Hafiz Sajid! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setSelectedPeriod('day')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              selectedPeriod === 'day'
                ? 'bg-green-500/20 text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-green-500/20 text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-green-500/20 text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className="text-xs text-gray-400">+12.5%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-green-400 mt-2">↑ 8.2% from last month</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🛒</span>
            <span className="text-xs text-gray-400">+5.3%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
          <p className="text-xs text-green-400 mt-2">↑ 12 new today</p>
        </div>

        {/* Total Users */}
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👥</span>
            <span className="text-xs text-gray-400">+3.7%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          <p className="text-xs text-green-400 mt-2">↑ 24 new this week</p>
        </div>

        {/* Total Products */}
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📦</span>
            <span className="text-xs text-gray-400">+2.1%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Products</p>
          <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
          <p className="text-xs text-yellow-400 mt-2">{stats.lowStock} low stock items</p>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Orders */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Today's Orders</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-white">{stats.todayOrders}</p>
            <p className="text-sm text-yellow-400">{stats.pendingOrders} pending</p>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Today's Revenue</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.todayRevenue)}</p>
            <p className="text-sm text-green-400">+5.2%</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-purple-400">3.24%</p>
            <p className="text-sm text-green-400">↑ 0.5%</p>
          </div>
        </div>
      </div>

      {/* Charts Section (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📈</span>
              <p className="text-gray-400">Revenue chart will be displayed here</p>
              <p className="text-xs text-gray-500 mt-2">Using Recharts or similar library</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Orders Overview</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📊</span>
              <p className="text-gray-400">Orders chart will be displayed here</p>
              <p className="text-xs text-gray-500 mt-2">Using Recharts or similar library</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <Link 
              href="/dashboard/orders"
              className="text-sm text-green-400 hover:text-green-300"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/10">
                    <td className="py-3">
                      <Link 
                        href={`/dashboard/orders/${order.id}`}
                        className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-white">{order.customer}</td>
                    <td className="py-3 text-green-400">{formatCurrency(order.amount)}</td>
                    <td className="py-3">{getStatusBadge(order.status)}</td>
                    <td className="py-3 text-gray-400 text-sm">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{product.name}</p>
                  <p className="text-gray-400 text-xs">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm font-semibold">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>

          <Link 
            href="/dashboard/products"
            className="block text-center mt-4 text-sm text-green-400 hover:text-green-300"
          >
            View All Products →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/products/new"
          className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-center transition-colors border border-white/10"
        >
          <span className="text-3xl block mb-2">➕</span>
          <span className="text-white text-sm font-medium">Add Product</span>
        </Link>

        <Link
          href="/dashboard/orders"
          className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-center transition-colors border border-white/10"
        >
          <span className="text-3xl block mb-2">📋</span>
          <span className="text-white text-sm font-medium">View Orders</span>
        </Link>

        <Link
          href="/dashboard/categories/new"
          className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-center transition-colors border border-white/10"
        >
          <span className="text-3xl block mb-2">📁</span>
          <span className="text-white text-sm font-medium">Add Category</span>
        </Link>

        <Link
          href="/dashboard/coupons/new"
          className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-center transition-colors border border-white/10"
        >
          <span className="text-3xl block mb-2">🎫</span>
          <span className="text-white text-sm font-medium">Add Coupon</span>
        </Link>
      </div>

      {/* Admin Info */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg text-center border border-white/10">
        <p className="text-sm text-gray-400">
          Logged in as: <span className="text-yellow-400">Hafiz Sajid Syed</span> (Super Admin)
        </p>
        <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
      </div>
    </div>
  )
}