// ============================================
// USER ENUMS
// ============================================

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'customer'
export type UserStatus = 'active' | 'inactive' | 'blocked'
export type UserGender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

// ============================================
// USER ADDRESS TYPES
// ============================================

export interface UserAddress {
  id: string
  type: 'home' | 'work' | 'other'
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  state: string
  pincode: string
  country: string
  phone: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface UserAddressInput {
  type: 'home' | 'work' | 'other'
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  state: string
  pincode: string
  country: string
  phone: string
  isDefault?: boolean
}

// ============================================
// USER PAYMENT METHOD TYPES
// ============================================

export interface UserPaymentMethod {
  id: string
  type: 'card' | 'upi' | 'wallet'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

// ============================================
// USER NOTIFICATION PREFERENCES
// ============================================

export interface UserNotificationPreferences {
  email: {
    orders: boolean
    promotions: boolean
    newsletter: boolean
    account: boolean
  }
  push: {
    orders: boolean
    promotions: boolean
  }
  sms: {
    orders: boolean
    promotions: boolean
  }
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  avatar?: string
  gender?: UserGender
  dateOfBirth?: string
  
  // Addresses
  addresses: UserAddress[]
  defaultAddressId?: string
  
  // Statistics
  orders: number
  totalSpent: number
  wishlistCount: number
  reviewCount: number
  
  // Preferences
  newsletter: boolean
  marketingEmails: boolean
  notificationPreferences: UserNotificationPreferences
  
  // Timestamps
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
}

// ============================================
// USER PROFILE TYPES
// ============================================

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  gender?: UserGender
  dateOfBirth?: string
  addresses: UserAddress[]
  defaultAddressId?: string
  notificationPreferences: UserNotificationPreferences
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  avatar?: string
  gender?: UserGender
  dateOfBirth?: string
}

// ============================================
// USER PASSWORD TYPES
// ============================================

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

// ============================================
// USER REGISTRATION/LOGIN TYPES
// ============================================

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  acceptTerms: boolean
}

export interface AuthResponse {
  user: User
  token: string
}

// ============================================
// USER RESPONSE TYPES
// ============================================

export interface UserResponse {
  success: boolean
  message?: string
  data?: User | User[]
  error?: string
  errors?: Record<string, string>
}

export interface UserListResponse {
  success: boolean
  message?: string
  data: User[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// ============================================
// USER FILTER TYPES
// ============================================

export interface UserFilters {
  search?: string
  role?: UserRole | UserRole[]
  status?: UserStatus | UserStatus[]
  dateFrom?: string
  dateTo?: string
  sortBy?: 'name' | 'email' | 'createdAt' | 'orders' | 'totalSpent'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// ============================================
// USER STATE TYPES (for Redux/Context)
// ============================================

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type UserAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_ADDRESS'; payload: UserAddress }
  | { type: 'UPDATE_ADDRESS'; payload: UserAddress }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }

// ============================================
// USER CONSTANTS
// ============================================

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  customer: 'Customer'
}

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'purple',
  admin: 'red',
  manager: 'blue',
  customer: 'green'
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  blocked: 'Blocked'
}

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  active: 'green',
  inactive: 'yellow',
  blocked: 'red'
}

export const USER_GENDER_LABELS: Record<UserGender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say'
}

// ============================================
// USER HELPER FUNCTIONS
// ============================================

export function getUserRoleLabel(role: UserRole): string {
  return USER_ROLE_LABELS[role] || role
}

export function getUserRoleColor(role: UserRole): string {
  return USER_ROLE_COLORS[role] || 'gray'
}

export function getUserStatusLabel(status: UserStatus): string {
  return USER_STATUS_LABELS[status] || status
}

export function getUserStatusColor(status: UserStatus): string {
  return USER_STATUS_COLORS[status] || 'gray'
}

export function getUserGenderLabel(gender: UserGender): string {
  return USER_GENDER_LABELS[gender] || gender
}

export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getUserDisplayName(user: User): string {
  return user.name
}

export function getUserPrimaryEmail(user: User): string {
  return user.email
}

export function getUserPrimaryPhone(user: User): string {
  return user.phone || 'Not provided'
}

export function getUserDefaultAddress(user: User): UserAddress | undefined {
  if (!user.defaultAddressId) return user.addresses[0]
  return user.addresses.find(addr => addr.id === user.defaultAddressId)
}

export function formatUserJoinDate(user: User): string {
  return new Date(user.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatUserLastLogin(user: User): string {
  if (!user.lastLoginAt) return 'Never'
  return new Date(user.lastLoginAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function isUserActive(user: User): boolean {
  return user.status === 'active'
}

export function isUserAdmin(user: User): boolean {
  return user.role === 'admin' || user.role === 'super_admin'
}

export function isUserSuperAdmin(user: User): boolean {
  return user.role === 'super_admin'
}

export function canUserManageUsers(user: User): boolean {
  return user.role === 'super_admin' || user.role === 'admin'
}

export function canUserManageProducts(user: User): boolean {
  return user.role === 'super_admin' || user.role === 'admin' || user.role === 'manager'
}

// ============================================
// USER SEARCH & FILTER
// ============================================

export function filterUsers(users: User[], filters: UserFilters): User[] {
  let filtered = [...users]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search)
    )
  }

  if (filters.role) {
    const roles = Array.isArray(filters.role) ? filters.role : [filters.role]
    filtered = filtered.filter(user => roles.includes(user.role))
  }

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status]
    filtered = filtered.filter(user => statuses.includes(user.status))
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom)
    filtered = filtered.filter(user => new Date(user.createdAt) >= from)
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo)
    filtered = filtered.filter(user => new Date(user.createdAt) <= to)
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0
      if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (filters.sortBy === 'email') {
        comparison = a.email.localeCompare(b.email)
      } else if (filters.sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (filters.sortBy === 'orders') {
        comparison = a.orders - b.orders
      } else if (filters.sortBy === 'totalSpent') {
        comparison = a.totalSpent - b.totalSpent
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })
  }

  return filtered
}

// ============================================
// USER STATISTICS
// ============================================

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  blockedUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  usersByRole: Record<UserRole, number>
  usersByStatus: Record<UserStatus, number>
  topCustomers: TopCustomer[]
}

export interface TopCustomer {
  id: string
  name: string
  email: string
  orders: number
  totalSpent: number
  avatar?: string
}

export function calculateUserStats(users: User[]): UserStats {
  const now = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))
  const weekAgo = new Date(now.setDate(now.getDate() - 7))
  const monthAgo = new Date(now.setMonth(now.getMonth() - 1))

  const activeUsers = users.filter(u => u.status === 'active').length
  const inactiveUsers = users.filter(u => u.status === 'inactive').length
  const blockedUsers = users.filter(u => u.status === 'blocked').length

  const newUsersToday = users.filter(u => new Date(u.createdAt) >= today).length
  const newUsersThisWeek = users.filter(u => new Date(u.createdAt) >= weekAgo).length
  const newUsersThisMonth = users.filter(u => new Date(u.createdAt) >= monthAgo).length

  const usersByRole = {} as Record<UserRole, number>
  users.forEach(user => {
    usersByRole[user.role] = (usersByRole[user.role] || 0) + 1
  })

  const usersByStatus = {} as Record<UserStatus, number>
  users.forEach(user => {
    usersByStatus[user.status] = (usersByStatus[user.status] || 0) + 1
  })

  const topCustomers = [...users]
    .filter(u => u.role === 'customer')
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      orders: u.orders,
      totalSpent: u.totalSpent,
      avatar: u.avatar
    }))

  return {
    totalUsers: users.length,
    activeUsers,
    inactiveUsers,
    blockedUsers,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth,
    usersByRole,
    usersByStatus,
    topCustomers
  }
}

// ============================================
// USER VALIDATION
// ============================================

export interface UserValidationErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  acceptTerms?: string
}

export function validateUser(data: RegisterRequest): UserValidationErrors {
  const errors: UserValidationErrors = {}

  if (!data.name) {
    errors.name = 'Name is required'
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (data.name.length > 50) {
    errors.name = 'Name must be less than 50 characters'
  }

  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!data.password) {
    errors.password = 'Password is required'
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (data.phone && !/^[6-9]\d{9}$/.test(data.phone)) {
    errors.phone = 'Invalid phone number'
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions'
  }

  return errors
}

// ============================================
// USER MOCK DATA
// ============================================

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@gmail.com',
    phone: '+91 98765 43210',
    role: 'super_admin',
    status: 'active',
    addresses: [],
    orders: 156,
    totalSpent: 489999,
    wishlistCount: 23,
    reviewCount: 45,
    newsletter: true,
    marketingEmails: false,
    notificationPreferences: {
      email: { orders: true, promotions: true, newsletter: true, account: true },
      push: { orders: true, promotions: false },
      sms: { orders: true, promotions: false }
    },
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2024-03-10T14:20:00Z',
    lastLoginAt: '2024-03-16T09:30:00Z',
    emailVerifiedAt: '2023-01-15T10:35:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43211',
    role: 'customer',
    status: 'active',
    addresses: [],
    orders: 23,
    totalSpent: 75999,
    wishlistCount: 12,
    reviewCount: 8,
    newsletter: true,
    marketingEmails: true,
    notificationPreferences: {
      email: { orders: true, promotions: true, newsletter: true, account: true },
      push: { orders: true, promotions: true },
      sms: { orders: false, promotions: false }
    },
    createdAt: '2023-06-20T11:45:00Z',
    updatedAt: '2024-03-15T16:20:00Z',
    lastLoginAt: '2024-03-15T16:20:00Z',
    emailVerifiedAt: '2023-06-20T11:50:00Z'
  }
]