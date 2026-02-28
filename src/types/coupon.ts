// ============================================
// COUPON TYPES
// ============================================

export type CouponType = 'percentage' | 'fixed' | 'free_shipping'
export type CouponStatus = 'active' | 'inactive' | 'expired'
export type CouponApplicableTo = 'all' | 'category' | 'product' | 'brand'

export interface Coupon {
  id: string
  code: string
  description: string
  type: CouponType
  value: number
  minPurchase: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  perUserLimit: number
  startDate: string
  endDate: string
  isActive: boolean
  applicableTo: CouponApplicableTo
  applicableIds?: string[]
  createdAt: string
  updatedAt: string
}

export interface CouponFormData {
  code: string
  description: string
  type: CouponType
  value: number
  minPurchase?: number
  maxDiscount?: number
  usageLimit?: number
  perUserLimit?: number
  startDate: string
  endDate: string
  isActive?: boolean
  applicableTo?: CouponApplicableTo
  applicableIds?: string[]
}

export interface CreateCouponRequest {
  code: string
  description: string
  type: CouponType
  value: number
  minPurchase?: number
  maxDiscount?: number
  usageLimit?: number
  perUserLimit?: number
  startDate: string
  endDate: string
  isActive?: boolean
  applicableTo?: CouponApplicableTo
  applicableIds?: string[]
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {}

export interface CouponFilters {
  search?: string
  type?: CouponType
  status?: CouponStatus
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: 'code' | 'value' | 'usedCount' | 'startDate' | 'endDate'
  sortOrder?: 'asc' | 'desc'
}

// ============================================
// COUPON RESPONSE TYPES
// ============================================

export interface CouponResponse {
  success: boolean
  message?: string
  data?: Coupon | Coupon[]
  error?: string
  errors?: Record<string, string>
}

export interface CouponListResponse {
  success: boolean
  message?: string
  data: Coupon[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface ValidateCouponResponse {
  valid: boolean
  discount?: number
  message?: string
  coupon?: Coupon
}

// ============================================
// COUPON STATE TYPES (for Redux/Context)
// ============================================

export interface CouponState {
  coupons: Coupon[]
  currentCoupon: Coupon | null
  isLoading: boolean
  error: string | null
  filters: CouponFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

export type CouponAction =
  | { type: 'SET_COUPONS'; payload: Coupon[] }
  | { type: 'SET_CURRENT_COUPON'; payload: Coupon | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: CouponFilters }
  | { type: 'CLEAR_COUPONS' }
  | { type: 'ADD_COUPON'; payload: Coupon }
  | { type: 'UPDATE_COUPON'; payload: Coupon }
  | { type: 'DELETE_COUPON'; payload: string }

// ============================================
// COUPON CONSTANTS
// ============================================

export const COUPON_TYPES = [
  { value: 'percentage', label: 'Percentage (%)', icon: '%' },
  { value: 'fixed', label: 'Fixed Amount (₹)', icon: '₹' },
  { value: 'free_shipping', label: 'Free Shipping', icon: '🚚' }
] as const

export const COUPON_STATUS_OPTIONS = [
  { value: 'all', label: 'All Coupons' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
  { value: 'expired', label: 'Expired Only' }
] as const

export const COUPON_APPLICABLE_TO = [
  { value: 'all', label: 'All Products' },
  { value: 'category', label: 'Specific Categories' },
  { value: 'product', label: 'Specific Products' },
  { value: 'brand', label: 'Specific Brands' }
] as const

export const COUPON_SORT_OPTIONS = [
  { value: 'code', label: 'Code' },
  { value: 'value', label: 'Discount Value' },
  { value: 'usedCount', label: 'Usage Count' },
  { value: 'startDate', label: 'Start Date' },
  { value: 'endDate', label: 'End Date' }
] as const

// ============================================
// COUPON HELPER FUNCTIONS
// ============================================

export function isCouponActive(coupon: Coupon): boolean {
  const now = new Date()
  const start = new Date(coupon.startDate)
  const end = new Date(coupon.endDate)
  
  return coupon.isActive && now >= start && now <= end
}

export function isCouponExpired(coupon: Coupon): boolean {
  return new Date(coupon.endDate) < new Date()
}

export function isCouponUpcoming(coupon: Coupon): boolean {
  return new Date(coupon.startDate) > new Date()
}

export function getCouponStatus(coupon: Coupon): CouponStatus {
  if (!coupon.isActive) return 'inactive'
  if (isCouponExpired(coupon)) return 'expired'
  return 'active'
}

export function getCouponStatusColor(status: CouponStatus): string {
  const colors = {
    active: 'green',
    inactive: 'gray',
    expired: 'red'
  }
  return colors[status]
}

export function getCouponStatusBadge(status: CouponStatus): string {
  const badges = {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired'
  }
  return badges[status]
}

export function getCouponTypeIcon(type: CouponType): string {
  const icons = {
    percentage: '%',
    fixed: '₹',
    free_shipping: '🚚'
  }
  return icons[type]
}

export function getCouponTypeLabel(type: CouponType): string {
  const labels = {
    percentage: 'Percentage Off',
    fixed: 'Fixed Amount Off',
    free_shipping: 'Free Shipping'
  }
  return labels[type]
}

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === 'percentage') {
    const discount = (subtotal * coupon.value) / 100
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  }
  
  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, subtotal)
  }
  
  if (coupon.type === 'free_shipping') {
    return 0 // Shipping discount handled separately
  }
  
  return 0
}

export function canApplyCoupon(
  coupon: Coupon,
  subtotal: number,
  userId?: string,
  userUsageCount: number = 0
): { allowed: boolean; reason?: string } {
  
  if (!coupon.isActive) {
    return { allowed: false, reason: 'Coupon is inactive' }
  }

  if (isCouponExpired(coupon)) {
    return { allowed: false, reason: 'Coupon has expired' }
  }

  if (new Date(coupon.startDate) > new Date()) {
    return { allowed: false, reason: 'Coupon is not yet active' }
  }

  if (subtotal < coupon.minPurchase) {
    return { 
      allowed: false, 
      reason: `Minimum purchase of ₹${coupon.minPurchase} required` 
    }
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { allowed: false, reason: 'Coupon usage limit reached' }
  }

  if (userUsageCount >= coupon.perUserLimit) {
    return { allowed: false, reason: 'You have already used this coupon' }
  }

  return { allowed: true }
}

// ============================================
// COUPON SEARCH & FILTER
// ============================================

export interface CouponSearchResult {
  coupons: Coupon[]
  total: number
  query: string
}

export function searchCoupons(coupons: Coupon[], query: string): CouponSearchResult {
  const searchTerm = query.toLowerCase()
  const filtered = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm) ||
    coupon.description.toLowerCase().includes(searchTerm)
  )

  return {
    coupons: filtered,
    total: filtered.length,
    query
  }
}

export function filterCoupons(
  coupons: Coupon[],
  filters: CouponFilters
): Coupon[] {
  let filtered = [...coupons]

  if (filters.search) {
    const searchResult = searchCoupons(filtered, filters.search)
    filtered = searchResult.coupons
  }

  if (filters.type) {
    filtered = filtered.filter(c => c.type === filters.type)
  }

  if (filters.status) {
    filtered = filtered.filter(c => getCouponStatus(c) === filters.status)
  }

  if (filters.isActive !== undefined) {
    filtered = filtered.filter(c => c.isActive === filters.isActive)
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0
      
      if (filters.sortBy === 'code') {
        comparison = a.code.localeCompare(b.code)
      } else if (filters.sortBy === 'value') {
        comparison = a.value - b.value
      } else if (filters.sortBy === 'usedCount') {
        comparison = a.usedCount - b.usedCount
      } else if (filters.sortBy === 'startDate') {
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      } else if (filters.sortBy === 'endDate') {
        comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })
  }

  return filtered
}

// ============================================
// COUPON STATISTICS
// ============================================

export interface CouponStats {
  totalCoupons: number
  activeCoupons: number
  inactiveCoupons: number
  expiredCoupons: number
  totalUsage: number
  totalDiscount: number
  topCoupons: TopCoupon[]
  usageByType: UsageByType[]
}

export interface TopCoupon {
  id: string
  code: string
  usedCount: number
  totalDiscount: number
}

export interface UsageByType {
  type: CouponType
  count: number
  percentage: number
}

export function calculateCouponStats(coupons: Coupon[]): CouponStats {
  const activeCoupons = coupons.filter(c => isCouponActive(c))
  const inactiveCoupons = coupons.filter(c => !c.isActive && !isCouponExpired(c))
  const expiredCoupons = coupons.filter(c => isCouponExpired(c))
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0)
  
  // Mock total discount calculation
  const totalDiscount = coupons.reduce((sum, c) => sum + (c.usedCount * c.value), 0)

  const topCoupons = [...coupons]
    .sort((a, b) => b.usedCount - a.usedCount)
    .slice(0, 5)
    .map(c => ({
      id: c.id,
      code: c.code,
      usedCount: c.usedCount,
      totalDiscount: c.usedCount * c.value
    }))

  const typeCount = {
    percentage: coupons.filter(c => c.type === 'percentage').length,
    fixed: coupons.filter(c => c.type === 'fixed').length,
    free_shipping: coupons.filter(c => c.type === 'free_shipping').length
  }

  const usageByType: UsageByType[] = Object.entries(typeCount).map(([type, count]) => ({
    type: type as CouponType,
    count,
    percentage: coupons.length ? (count / coupons.length) * 100 : 0
  }))

  return {
    totalCoupons: coupons.length,
    activeCoupons: activeCoupons.length,
    inactiveCoupons: inactiveCoupons.length,
    expiredCoupons: expiredCoupons.length,
    totalUsage,
    totalDiscount,
    topCoupons,
    usageByType
  }
}

// ============================================
// COUPON VALIDATION
// ============================================

export interface CouponValidationErrors {
  code?: string
  description?: string
  value?: string
  minPurchase?: string
  maxDiscount?: string
  perUserLimit?: string
  startDate?: string
  endDate?: string
}

export function validateCoupon(data: CouponFormData): CouponValidationErrors {
  const errors: CouponValidationErrors = {}

  if (!data.code) {
    errors.code = 'Coupon code is required'
  } else if (!/^[A-Z0-9]+$/.test(data.code)) {
    errors.code = 'Code can only contain uppercase letters and numbers'
  } else if (data.code.length < 3 || data.code.length > 20) {
    errors.code = 'Code must be 3-20 characters'
  }

  if (!data.description) {
    errors.description = 'Description is required'
  }

  if (data.type !== 'free_shipping') {
    if (!data.value || data.value <= 0) {
      errors.value = 'Discount value must be greater than 0'
    }
    if (data.type === 'percentage' && data.value > 100) {
      errors.value = 'Percentage cannot exceed 100%'
    }
  }

  if (data.minPurchase && data.minPurchase < 0) {
    errors.minPurchase = 'Minimum purchase cannot be negative'
  }

  if (data.maxDiscount && data.maxDiscount < 0) {
    errors.maxDiscount = 'Maximum discount cannot be negative'
  }

  if (data.perUserLimit && data.perUserLimit < 1) {
    errors.perUserLimit = 'Per user limit must be at least 1'
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required'
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required'
  } else if (data.startDate && data.endDate < data.startDate) {
    errors.endDate = 'End date must be after start date'
  }

  return errors
}

// ============================================
// COUPON MOCK DATA
// ============================================

export const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    description: '10% off on first order',
    type: 'percentage',
    value: 10,
    minPurchase: 1000,
    maxDiscount: 500,
    usageLimit: 1000,
    usedCount: 245,
    perUserLimit: 1,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    applicableTo: 'all',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'SPORTS500',
    description: '₹500 off on orders above ₹5000',
    type: 'fixed',
    value: 500,
    minPurchase: 5000,
    usageLimit: 500,
    usedCount: 128,
    perUserLimit: 1,
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    isActive: true,
    applicableTo: 'all',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    type: 'free_shipping',
    value: 0,
    minPurchase: 1000,
    usageLimit: 1000,
    usedCount: 567,
    perUserLimit: 1,
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    isActive: true,
    applicableTo: 'all',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
]