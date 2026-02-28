// ============================================
// ORDER STATUS TYPES
// ============================================

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'

export type PaymentMethod = 
  | 'card'
  | 'upi'
  | 'netbanking'
  | 'cod'
  | 'wallet'

export type ShippingMethod = 
  | 'standard'
  | 'express'
  | 'overnight'
  | 'international'

// ============================================
// ORDER ITEM TYPES
// ============================================

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
  discount?: number
  subtotal: number
  createdAt?: string
  updatedAt?: string
}

export interface OrderItemInput {
  productId: string
  quantity: number
  size?: string
  color?: string
  price?: number
}

// ============================================
// ORDER ADDRESS TYPES
// ============================================

export interface OrderAddress {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
}

// ============================================
// ORDER TRACKING TYPES
// ============================================

export interface TrackingEvent {
  date: string
  location: string
  status: string
  description: string
  icon?: string
}

export interface TrackingInfo {
  trackingNumber: string
  provider: string
  status: string
  estimatedDelivery?: string
  deliveredAt?: string
  events: TrackingEvent[]
  trackingUrl?: string
}

// ============================================
// ORDER TYPES
// ============================================

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  userEmail?: string
  userName?: string
  
  // Items
  items: OrderItem[]
  
  // Pricing
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  couponCode?: string
  couponDiscount?: number
  
  // Status
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  shippingMethod?: ShippingMethod
  
  // Addresses
  shippingAddress: OrderAddress
  billingAddress: OrderAddress
  sameAsShipping?: boolean
  
  // Tracking
  trackingNumber?: string
  shippingProvider?: string
  trackingInfo?: TrackingInfo
  estimatedDelivery?: string
  
  // Notes
  notes?: string
  adminNotes?: string
  cancellationReason?: string
  refundReason?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  placedAt?: string
  confirmedAt?: string
  packedAt?: string
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
  refundedAt?: string
}

// ============================================
// ORDER REQUEST TYPES
// ============================================

export interface CreateOrderRequest {
  items: OrderItemInput[]
  shippingAddress: OrderAddress
  billingAddress?: OrderAddress
  sameAsShipping?: boolean
  paymentMethod: PaymentMethod
  couponCode?: string
  notes?: string
}

export interface UpdateOrderRequest {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  trackingNumber?: string
  shippingProvider?: string
  adminNotes?: string
  cancellationReason?: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  reason?: string
}

export interface CancelOrderRequest {
  reason?: string
}

export interface RefundOrderRequest {
  amount?: number
  reason?: string
}

// ============================================
// ORDER RESPONSE TYPES
// ============================================

export interface OrderResponse {
  success: boolean
  message?: string
  data?: Order
  error?: string
  errors?: Record<string, string>
}

export interface OrderListResponse {
  success: boolean
  message?: string
  data: Order[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface OrderStatsResponse {
  success: boolean
  data: OrderStats
}

// ============================================
// ORDER FILTER TYPES
// ============================================

export interface OrderFilters {
  status?: OrderStatus | OrderStatus[]
  paymentStatus?: PaymentStatus | PaymentStatus[]
  paymentMethod?: PaymentMethod
  dateFrom?: string
  dateTo?: string
  search?: string
  userId?: string
  minAmount?: number
  maxAmount?: number
  page?: number
  limit?: number
  sortBy?: 'orderNumber' | 'date' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface DateRange {
  from: string
  to: string
}

// ============================================
// ORDER STATE TYPES (for Redux/Context)
// ============================================

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
  filters: OrderFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

export type OrderAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: OrderFilters }
  | { type: 'CLEAR_ORDERS' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }

// ============================================
// ORDER STATISTICS TYPES
// ============================================

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  refundedOrders: number
  
  todayOrders: number
  todayRevenue: number
  weekOrders: number
  weekRevenue: number
  monthOrders: number
  monthRevenue: number
  yearOrders: number
  yearRevenue: number
  
  ordersByStatus: Record<OrderStatus, number>
  ordersByPaymentMethod: Record<PaymentMethod, number>
  ordersByDate: ChartDataPoint[]
  revenueByDate: ChartDataPoint[]
  topProducts: TopProduct[]
}

export interface TopProduct {
  productId: string
  name: string
  quantity: number
  revenue: number
  image?: string
}

export interface ChartDataPoint {
  date: string
  orders: number
  revenue: number
}

// ============================================
// ORDER CONSTANTS
// ============================================

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  failed: 'Failed'
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'yellow',
  processing: 'blue',
  confirmed: 'purple',
  packed: 'indigo',
  shipped: 'cyan',
  out_for_delivery: 'orange',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray',
  failed: 'red'
}

export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  pending: '⏳',
  processing: '⚙️',
  confirmed: '✅',
  packed: '📦',
  shipped: '🚚',
  out_for_delivery: '🚚',
  delivered: '🎉',
  cancelled: '❌',
  refunded: '💰',
  failed: '⚠️'
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  partially_refunded: 'Partially Refunded'
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'yellow',
  paid: 'green',
  failed: 'red',
  refunded: 'gray',
  partially_refunded: 'purple'
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Credit/Debit Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  cod: 'Cash on Delivery',
  wallet: 'Wallet'
}

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  card: '💳',
  upi: '📱',
  netbanking: '🏦',
  cod: '💵',
  wallet: '👛'
}

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  standard: 'Standard Shipping',
  express: 'Express Shipping',
  overnight: 'Overnight Shipping',
  international: 'International Shipping'
}

// ============================================
// ORDER HELPER FUNCTIONS
// ============================================

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] || status
}

export function getOrderStatusColor(status: OrderStatus): string {
  return ORDER_STATUS_COLORS[status] || 'gray'
}

export function getOrderStatusIcon(status: OrderStatus): string {
  return ORDER_STATUS_ICONS[status] || '📦'
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status] || status
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  return PAYMENT_STATUS_COLORS[status] || 'gray'
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] || method
}

export function getPaymentMethodIcon(method: PaymentMethod): string {
  return PAYMENT_METHOD_ICONS[method] || '💳'
}

export function calculateOrderTotals(items: OrderItemInput[]): {
  subtotal: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => {
    const price = item.price || 0
    return sum + price * item.quantity
  }, 0)
  
  return { subtotal, total: subtotal }
}

export function calculateOrderSummary(order: Order): {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
} {
  return {
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount,
    total: order.total
  }
}

export function isOrderCancellable(order: Order): boolean {
  const cancellableStatuses: OrderStatus[] = ['pending', 'processing', 'confirmed']
  return cancellableStatuses.includes(order.status)
}

export function isOrderRefundable(order: Order): boolean {
  const refundableStatuses: OrderStatus[] = ['delivered', 'cancelled']
  return refundableStatuses.includes(order.status) && order.paymentStatus === 'paid'
}

export function canOrderBeModified(order: Order): boolean {
  const modifiableStatuses: OrderStatus[] = ['pending', 'processing']
  return modifiableStatuses.includes(order.status)
}

export function getOrderProgress(order: Order): number {
  const statusOrder: OrderStatus[] = [
    'pending',
    'processing',
    'confirmed',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered'
  ]
  
  const currentIndex = statusOrder.indexOf(order.status)
  if (currentIndex === -1) return 0
  
  return (currentIndex / (statusOrder.length - 1)) * 100
}

export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber}`
}

export function getOrderDate(order: Order): string {
  return new Date(order.createdAt).toLocaleDateString()
}

export function getOrderTime(order: Order): string {
  return new Date(order.createdAt).toLocaleTimeString()
}

// ============================================
// ORDER SEARCH & FILTER
// ============================================

export function filterOrders(orders: Order[], filters: OrderFilters): Order[] {
  let filtered = [...orders]

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status]
    filtered = filtered.filter(order => statuses.includes(order.status))
  }

  if (filters.paymentStatus) {
    const statuses = Array.isArray(filters.paymentStatus) ? filters.paymentStatus : [filters.paymentStatus]
    filtered = filtered.filter(order => statuses.includes(order.paymentStatus))
  }

  if (filters.paymentMethod) {
    filtered = filtered.filter(order => order.paymentMethod === filters.paymentMethod)
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom)
    filtered = filtered.filter(order => new Date(order.createdAt) >= from)
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo)
    filtered = filtered.filter(order => new Date(order.createdAt) <= to)
  }

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(order => 
      order.orderNumber.toLowerCase().includes(search) ||
      order.userName?.toLowerCase().includes(search) ||
      order.userEmail?.toLowerCase().includes(search) ||
      order.shippingAddress?.firstName.toLowerCase().includes(search) ||
      order.shippingAddress?.lastName.toLowerCase().includes(search)
    )
  }

  if (filters.minAmount !== undefined) {
    filtered = filtered.filter(order => order.total >= filters.minAmount!)
  }

  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter(order => order.total <= filters.maxAmount!)
  }

  return filtered
}

// ============================================
// ORDER STATISTICS FUNCTIONS
// ============================================

export function calculateOrderStats(orders: Order[]): OrderStats {
  const now = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))
  const weekAgo = new Date(now.setDate(now.getDate() - 7))
  const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
  const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1))

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const processingOrders = orders.filter(o => o.status === 'processing').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length
  const refundedOrders = orders.filter(o => o.status === 'refunded').length

  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today).length
  const todayRevenue = orders
    .filter(o => new Date(o.createdAt) >= today)
    .reduce((sum, o) => sum + o.total, 0)

  const weekOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo).length
  const weekRevenue = orders
    .filter(o => new Date(o.createdAt) >= weekAgo)
    .reduce((sum, o) => sum + o.total, 0)

  const monthOrders = orders.filter(o => new Date(o.createdAt) >= monthAgo).length
  const monthRevenue = orders
    .filter(o => new Date(o.createdAt) >= monthAgo)
    .reduce((sum, o) => sum + o.total, 0)

  const yearOrders = orders.filter(o => new Date(o.createdAt) >= yearAgo).length
  const yearRevenue = orders
    .filter(o => new Date(o.createdAt) >= yearAgo)
    .reduce((sum, o) => sum + o.total, 0)

  const ordersByStatus = {} as Record<OrderStatus, number>
  orders.forEach(order => {
    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1
  })

  const ordersByPaymentMethod = {} as Record<PaymentMethod, number>
  orders.forEach(order => {
    ordersByPaymentMethod[order.paymentMethod] = (ordersByPaymentMethod[order.paymentMethod] || 0) + 1
  })

  // Mock data for charts
  const ordersByDate: ChartDataPoint[] = []
  const revenueByDate: ChartDataPoint[] = []

  // Mock top products
  const topProducts: TopProduct[] = []

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    refundedOrders,
    todayOrders,
    todayRevenue,
    weekOrders,
    weekRevenue,
    monthOrders,
    monthRevenue,
    yearOrders,
    yearRevenue,
    ordersByStatus,
    ordersByPaymentMethod,
    ordersByDate,
    revenueByDate,
    topProducts
  }
}

// ============================================
// ORDER MOCK DATA
// ============================================

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    userId: '2',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    items: [
      {
        id: 'item1',
        productId: '1',
        name: 'Nike Mercurial Superfly 9',
        price: 24999,
        quantity: 1,
        image: '/images/n1.jpeg',
        size: 'UK 8',
        color: 'Black/Red',
        subtotal: 24999
      }
    ],
    subtotal: 24999,
    shipping: 99,
    tax: 4499.82,
    discount: 0,
    total: 29597.82,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    trackingNumber: 'DEL123456789',
    shippingProvider: 'Delhivery',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-18T14:20:00Z',
    deliveredAt: '2024-03-18T14:20:00Z'
  }
]