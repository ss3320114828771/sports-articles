'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'super_admin' | 'admin' | 'manager' | 'customer'
  status: 'active' | 'inactive' | 'blocked'
  orders: number
  spent: number
  joined: string
  lastActive: string
  avatar?: string
}

interface UserTableProps {
  users: User[]
  onView?: (userId: string) => void
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  onStatusChange?: (userId: string, status: string) => void
  onRoleChange?: (userId: string, role: string) => void
  showActions?: boolean
  className?: string
}

export default function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onRoleChange,
  showActions = true,
  className = ''
}: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<keyof User>('joined')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [newRole, setNewRole] = useState('')
  const itemsPerPage = 10

  // Get unique roles for filter
  const roles = ['all', ...new Set(users.map(u => u.role))]

  // Filter users
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    
    // Role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handle sort
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id))
    }
  }

  // Handle select user
  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // Handle delete
  const handleDelete = (userId: string) => {
    setUserToDelete(userId)
    setShowDeleteModal(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (userToDelete && onDelete) {
      onDelete(userToDelete)
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  // Handle role change
  const handleRoleChange = (user: User) => {
    setUserToEdit(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  // Confirm role change
  const confirmRoleChange = () => {
    if (userToEdit && onRoleChange && newRole) {
      onRoleChange(userToEdit.id, newRole)
      setShowRoleModal(false)
      setUserToEdit(null)
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Get role badge color
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'super_admin': 'bg-purple-500/20 text-purple-400',
      'admin': 'bg-red-500/20 text-red-400',
      'manager': 'bg-blue-500/20 text-blue-400',
      'customer': 'bg-green-500/20 text-green-400'
    }
    return colors[role] || 'bg-gray-500/20 text-gray-400'
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-500/20 text-green-400',
      'inactive': 'bg-yellow-500/20 text-yellow-400',
      'blocked': 'bg-red-500/20 text-red-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      'active': '✅',
      'inactive': '⏸️',
      'blocked': '🚫'
    }
    return icons[status] || '❓'
  }

  // Get sort icon
  const getSortIcon = (field: keyof User) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Users</h2>
        
        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-400">
              {selectedUsers.length} selected
            </span>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
              Update Status
            </button>
            <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 
                     rounded-lg text-white placeholder-gray-400 
                     focus:outline-none focus:border-green-400"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                   text-white focus:outline-none focus:border-green-400"
        >
          {roles.map(role => (
            <option key={role} value={role}>
              {role === 'all' ? 'All Roles' : role.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                   text-white focus:outline-none focus:border-green-400"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              {/* Checkbox */}
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-green-500"
                />
              </th>
              
              {/* User */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <span className="flex items-center gap-1">
                  User {getSortIcon('name')}
                </span>
              </th>
              
              {/* Contact */}
              <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                Contact
              </th>
              
              {/* Role */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <span className="flex items-center gap-1">
                  Role {getSortIcon('role')}
                </span>
              </th>
              
              {/* Status */}
              <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                Status
              </th>
              
              {/* Orders */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('orders')}
              >
                <span className="flex items-center gap-1">
                  Orders {getSortIcon('orders')}
                </span>
              </th>
              
              {/* Spent */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('spent')}
              >
                <span className="flex items-center gap-1">
                  Spent {getSortIcon('spent')}
                </span>
              </th>
              
              {/* Joined */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('joined')}
              >
                <span className="flex items-center gap-1">
                  Joined {getSortIcon('joined')}
                </span>
              </th>
              
              {/* Last Active */}
              <th 
                className="p-4 text-left text-gray-400 font-semibold text-sm cursor-pointer"
                onClick={() => handleSort('lastActive')}
              >
                <span className="flex items-center gap-1">
                  Last Active {getSortIcon('lastActive')}
                </span>
              </th>
              
              {/* Actions */}
              {showActions && (
                <th className="p-4 text-left text-gray-400 font-semibold text-sm">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {paginatedUsers.map((user) => (
              <tr 
                key={user.id} 
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                {/* Checkbox */}
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="w-4 h-4 accent-green-500"
                  />
                </td>
                
                {/* User */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 
                                  rounded-full flex items-center justify-center text-white text-sm">
                      {user.avatar || user.name.charAt(0)}
                    </div>
                    <span className="text-white text-sm font-medium">{user.name}</span>
                  </div>
                </td>
                
                {/* Contact */}
                <td className="p-4">
                  <div>
                    <p className="text-white text-sm">{user.email}</p>
                    <p className="text-gray-400 text-xs">{user.phone}</p>
                  </div>
                </td>
                
                {/* Role */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </td>
                
                {/* Status */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(user.status)}`}>
                    <span>{getStatusIcon(user.status)}</span>
                    <span>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                  </span>
                </td>
                
                {/* Orders */}
                <td className="p-4 text-gray-300 text-sm">
                  {user.orders}
                </td>
                
                {/* Spent */}
                <td className="p-4 text-green-400 font-semibold text-sm">
                  {formatPrice(user.spent)}
                </td>
                
                {/* Joined */}
                <td className="p-4 text-gray-300 text-sm">
                  {formatDate(user.joined)}
                </td>
                
                {/* Last Active */}
                <td className="p-4 text-gray-300 text-sm">
                  {formatDate(user.lastActive)}
                </td>
                
                {/* Actions */}
                {showActions && (
                  <td className="p-4">
                    <div className="flex gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(user.id)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg 
                                   text-blue-400 transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                      )}
                      
                      {onEdit && (
                        <Link
                          href={`/dashboard/users/${user.id}/edit`}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg 
                                   text-purple-400 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                      )}
                      
                      {onRoleChange && (
                        <button
                          onClick={() => handleRoleChange(user)}
                          className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg 
                                   text-yellow-400 transition-colors"
                          title="Change Role"
                        >
                          👑
                        </button>
                      )}
                      
                      {onStatusChange && (
                        <select
                          value={user.status}
                          onChange={(e) => onStatusChange(user.id, e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded 
                                   text-white text-xs focus:outline-none focus:border-green-400"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg 
                                   text-red-400 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 bg-white/10 rounded-lg text-white disabled:opacity-50 
                     disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            ←
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 bg-white/10 rounded-lg text-white disabled:opacity-50 
                     disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            →
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 
                           text-red-400 rounded-lg font-semibold transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 
                           text-gray-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && userToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-bold text-white mb-2">Change User Role</h3>
              <p className="text-gray-300 mb-4">
                Update role for <span className="text-green-400">{userToEdit.name}</span>
              </p>
              
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white mb-6 focus:outline-none focus:border-green-400"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="customer">Customer</option>
              </select>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmRoleChange}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 
                           text-green-400 rounded-lg font-semibold transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 
                           text-gray-400 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {sortedUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-400">No users found</p>
        </div>
      )}
    </div>
  )
}