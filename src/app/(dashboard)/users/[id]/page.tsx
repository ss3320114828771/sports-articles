'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Types
interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CUSTOMER'
  status: 'Active' | 'Inactive' | 'Blocked'
  createdAt: string
  lastLogin: string
  totalOrders: number
  totalSpent: number
  addresses: Address[]
}

interface Address {
  id: string
  type: 'HOME' | 'WORK' | 'OTHER'
  address: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

interface Order {
  id: string
  orderNumber: string
  date: string
  total: number
  status: string
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Mock user orders
  const [userOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-03-15',
      total: 12599,
      status: 'Delivered'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-005',
      date: '2024-03-10',
      total: 34999,
      status: 'Processing'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-012',
      date: '2024-03-05',
      total: 8999,
      status: 'Shipped'
    }
  ])

  // Mock data - replace with API call
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data based on ID
        const mockUser: User = {
          id: params.id as string,
          name: params.id === '1' ? 'John Doe' : 
                params.id === '2' ? 'Jane Smith' : 
                params.id === '3' ? 'Rahul Sharma' : 
                'Priya Patel',
          email: params.id === '1' ? 'john.doe@example.com' :
                 params.id === '2' ? 'jane.smith@example.com' :
                 params.id === '3' ? 'rahul.sharma@example.com' :
                 'priya.patel@example.com',
          phone: params.id === '1' ? '+91 98765 43210' :
                 params.id === '2' ? '+91 98765 43211' :
                 params.id === '3' ? '+91 98765 43212' :
                 '+91 98765 43213',
          role: params.id === '1' ? 'CUSTOMER' :
                params.id === '2' ? 'MANAGER' :
                params.id === '3' ? 'ADMIN' :
                'CUSTOMER',
          status: params.id === '3' ? 'Inactive' : 'Active',
          createdAt: '2024-01-15',
          lastLogin: '2024-03-16',
          totalOrders: params.id === '1' ? 12 :
                       params.id === '2' ? 8 :
                       params.id === '3' ? 5 : 3,
          totalSpent: params.id === '1' ? 154899 :
                      params.id === '2' ? 89250 :
                      params.id === '3' ? 45750 : 25999,
          addresses: [
            {
              id: 'addr_1',
              type: 'HOME',
              address: '123 Sports Avenue, Apartment 4B',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              country: 'India',
              isDefault: true
            },
            {
              id: 'addr_2',
              type: 'WORK',
              address: '456 Business Park, Floor 12',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400002',
              country: 'India',
              isDefault: false
            }
          ]
        }
        
        setUser(mockUser)
        setSelectedRole(mockUser.role)
        setSelectedStatus(mockUser.status)
      } catch (error) {
        console.error('Error fetching user')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[role]}`}>
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
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    )
  }

  // Update role
  const handleUpdateRole = async () => {
    if (!user) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser({ ...user, role: selectedRole as User['role'] })
      setShowRoleModal(false)
    } catch (error) {
      console.error('Error updating role')
    } finally {
      setIsUpdating(false)
    }
  }

  // Update status
  const handleUpdateStatus = async () => {
    if (!user) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser({ ...user, status: selectedStatus as User['status'] })
      setShowStatusModal(false)
    } catch (error) {
      console.error('Error updating status')
    } finally {
      setIsUpdating(false)
    }
  }

  // Delete user
  const handleDeleteUser = async () => {
    if (!user) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/dashboard/users?deleted=true')
    } catch (error) {
      console.error('Error deleting user')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
          <p className="text-gray-400 mb-6">The user you're looking for doesn't exist.</p>
          <Link 
            href="/dashboard/users"
            className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold"
          >
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

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
            <Link 
              href="/dashboard/users"
              className="text-gray-400 hover:text-white mb-2 inline-block"
            >
              ← Back to Users
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400">Member since {formatDate(user.createdAt)}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-colors"
            >
              👑 Change Role
            </button>
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-semibold transition-colors"
            >
              📊 Change Status
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
            >
              🗑️ Delete User
            </button>
          </div>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Role</p>
            <div className="mt-2">{getRoleBadge(user.role)}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Status</p>
            <div className="mt-2">{getStatusBadge(user.status)}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-white mt-1">{user.totalOrders}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-green-400 mt-1">₹{user.totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/20">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'profile' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'addresses' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Addresses ({user.addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'orders' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'activity' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Activity Log
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 rounded-lg p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white font-semibold text-lg">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Email Address</p>
                  <p className="text-white">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Phone Number</p>
                  <p className="text-white">{user.phone}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Last Login</p>
                  <p className="text-white">{formatDate(user.lastLogin)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Account Created</p>
                  <p className="text-white">{formatDate(user.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="text-white font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Saved Addresses</h3>
                <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                  + Add Address
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((address) => (
                  <div key={address.id} className="bg-white/5 rounded-lg p-4 relative">
                    {address.isDefault && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Default
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {address.type}
                      </span>
                    </div>
                    
                    <p className="text-white mb-1">{address.address}</p>
                    <p className="text-gray-400 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-gray-400 text-sm">{address.country}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <button className="text-blue-400 text-sm hover:text-blue-300">Edit</button>
                      <button className="text-red-400 text-sm hover:text-red-300">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order History</h3>
              
              {userOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-3 text-gray-400">Order #</th>
                        <th className="text-left p-3 text-gray-400">Date</th>
                        <th className="text-left p-3 text-gray-400">Total</th>
                        <th className="text-left p-3 text-gray-400">Status</th>
                        <th className="text-left p-3 text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order) => (
                        <tr key={order.id} className="border-b border-white/10">
                          <td className="p-3">
                            <Link href={`/dashboard/orders/${order.id}`} className="text-blue-400 hover:text-blue-300">
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="p-3 text-gray-300">{order.date}</td>
                          <td className="p-3 text-green-400">₹{order.total.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <Link
                              href={`/dashboard/orders/${order.id}`}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No orders found</p>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">🛒</span>
                  <div>
                    <p className="text-white">Placed order #ORD-2024-001</p>
                    <p className="text-gray-400 text-sm">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-white">Added new address</p>
                    <p className="text-gray-400 text-sm">1 week ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-white">Reviewed product "Nike Mercurial"</p>
                    <p className="text-gray-400 text-sm">2 weeks ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">🔐</span>
                  <div>
                    <p className="text-white">Changed password</p>
                    <p className="text-gray-400 text-sm">3 weeks ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-white">Verified email address</p>
                    <p className="text-gray-400 text-sm">1 month ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Change User Role</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateRole}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded font-semibold"
                >
                  {isUpdating ? 'Updating...' : 'Update Role'}
                </button>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Change User Status</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Select Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded font-semibold"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete User</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-bold text-red-400">{user.name}</span>?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  {isUpdating ? 'Deleting...' : 'Delete User'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
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