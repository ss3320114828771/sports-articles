'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CUSTOMER'
  status: 'Active' | 'Inactive' | 'Blocked'
  orders: number
  spent: number
  joined: string
  lastActive: string
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Hafiz Sajid Syed',
      email: 'sajid.syed@gmail.com',
      phone: '+91 98765 43210',
      role: 'SUPER_ADMIN',
      status: 'Active',
      orders: 156,
      spent: 489999,
      joined: '2023-01-15',
      lastActive: '2024-03-16'
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43211',
      role: 'CUSTOMER',
      status: 'Active',
      orders: 23,
      spent: 75999,
      joined: '2023-06-20',
      lastActive: '2024-03-15'
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 98765 43212',
      role: 'MANAGER',
      status: 'Active',
      orders: 0,
      spent: 0,
      joined: '2023-09-10',
      lastActive: '2024-03-16'
    },
    {
      id: '4',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43213',
      role: 'ADMIN',
      status: 'Active',
      orders: 0,
      spent: 0,
      joined: '2023-11-05',
      lastActive: '2024-03-14'
    },
    {
      id: '5',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98765 43214',
      role: 'CUSTOMER',
      status: 'Inactive',
      orders: 5,
      spent: 12999,
      joined: '2024-01-22',
      lastActive: '2024-02-28'
    },
    {
      id: '6',
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '+91 98765 43215',
      role: 'CUSTOMER',
      status: 'Blocked',
      orders: 2,
      spent: 4599,
      joined: '2024-02-10',
      lastActive: '2024-02-15'
    }
  ])

  // Get unique roles for filter
  const roles = ['ALL', ...new Set(users.map(u => u.role))]

  // Filter users
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    
    // Role filter
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    
    // Status filter
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Handle delete
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle status
  const toggleStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' | 'Blocked' }
        : u
    ))
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': 'bg-purple-500/20 text-purple-400',
      'ADMIN': 'bg-red-500/20 text-red-400',
      'MANAGER': 'bg-blue-500/20 text-blue-400',
      'CUSTOMER': 'bg-green-500/20 text-green-400'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[role]}`}>
        {role.replace('_', ' ')}
      </span>
    )
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-green-500/20 text-green-400',
      'Inactive': 'bg-yellow-500/20 text-yellow-400',
      'Blocked': 'bg-red-500/20 text-red-400'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    )
  }

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'Active').length
  const inactiveUsers = users.filter(u => u.status === 'Inactive').length
  const blockedUsers = users.filter(u => u.status === 'Blocked').length
  const totalOrders = users.reduce((sum, u) => sum + u.orders, 0)
  const totalRevenue = users.reduce((sum, u) => sum + u.spent, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-6">
      {/* Bismillah */}
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Users</h1>
            <p className="text-gray-400">Manage your customers and staff</p>
          </div>
          
          <Link
            href="/dashboard/users/new"
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold hover:scale-105 transition-all"
          >
            ➕ Add New User
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs">Total</p>
            <p className="text-xl font-bold text-white">{totalUsers}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs">Active</p>
            <p className="text-xl font-bold text-green-400">{activeUsers}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs">Inactive</p>
            <p className="text-xl font-bold text-yellow-400">{inactiveUsers}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs">Blocked</p>
            <p className="text-xl font-bold text-red-400">{blockedUsers}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs">Orders</p>
            <p className="text-xl font-bold text-blue-400">{totalOrders}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-xs">Revenue</p>
            <p className="text-xl font-bold text-purple-400">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">User</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Contact</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Role</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Orders</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Spent</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Joined</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Last Active</th>
                  <th className="text-left p-4 text-gray-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white text-sm">{user.email}</p>
                          <p className="text-gray-400 text-xs">{user.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">{getRoleBadge(user.role)}</td>
                      <td className="p-4">{getStatusBadge(user.status)}</td>
                      <td className="p-4 text-white">{user.orders}</td>
                      <td className="p-4 text-green-400">₹{user.spent.toLocaleString()}</td>
                      <td className="p-4 text-gray-300">{user.joined}</td>
                      <td className="p-4 text-gray-300">{user.lastActive}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/users/${user.id}`}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                            title="View"
                          >
                            👁️
                          </Link>
                          <button
                            onClick={() => toggleStatus(user)}
                            className={`p-2 rounded transition-colors ${
                              user.status === 'Active'
                                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                            }`}
                            title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'Active' ? '🔴' : '🟢'}
                          </button>
                          <Link
                            href={`/dashboard/users/${user.id}/edit`}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-400 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-3">Role Distribution</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span className="text-gray-300 text-sm flex-1">Super Admin</span>
                <span className="text-white font-semibold">
                  {users.filter(u => u.role === 'SUPER_ADMIN').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <span className="text-gray-300 text-sm flex-1">Admin</span>
                <span className="text-white font-semibold">
                  {users.filter(u => u.role === 'ADMIN').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-gray-300 text-sm flex-1">Manager</span>
                <span className="text-white font-semibold">
                  {users.filter(u => u.role === 'MANAGER').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-300 text-sm flex-1">Customer</span>
                <span className="text-white font-semibold">
                  {users.filter(u => u.role === 'CUSTOMER').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-3">Status Distribution</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-300 text-sm flex-1">Active</span>
                <span className="text-white font-semibold">{activeUsers}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-300 text-sm flex-1">Inactive</span>
                <span className="text-white font-semibold">{inactiveUsers}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <span className="text-gray-300 text-sm flex-1">Blocked</span>
                <span className="text-white font-semibold">{blockedUsers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg text-center">
          <p className="text-sm text-gray-400">
            Administrator: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete User</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-bold text-red-400">{selectedUser.name}</span>?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded font-semibold"
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