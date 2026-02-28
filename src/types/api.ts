// ============================================
// COMMON API TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: Record<string, string>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

// ============================================
// AUTH API TYPES
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
  acceptTerms?: boolean
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'manager' | 'customer'
  avatar?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

// ============================================
// PRODUCT API TYPES
// ============================================

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  costPrice?: number
  sku: string
  barcode?: string
  quantity: number
  categoryId: string
  categoryName: string
  brandId?: string
  brandName?: string
  images: ProductImage[]
  variants: ProductVariant[]
  tags: string[]
  weight?: number
  dimensions?: string
  material?: string
  color?: string
  size?: string
  gender?: 'male' | 'female' | 'unisex' | 'kids'
  ageGroup?: 'adult' | 'youth' | 'kid' | 'infant'
  isFeatured: boolean
  isPublished: boolean
  isDigital: boolean
  downloadLink?: string
  views: number
  soldCount: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  isPrimary: boolean
}

export interface ProductVariant {
  id: string
  productId: string
  size?: string
  color?: string
  price: number
  stock: number
  sku: string
  image?: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  categoryId: string
  brandId?: string
  quantity?: number
  images?: ProductImage[]
  variants?: ProductVariant[]
  tags?: string[]
  isPublished?: boolean
  isFeatured?: boolean
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  tags?: string[]
  inStock?: boolean
  isFeatured?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular'
  page?: number
  limit?: number
}

// ============================================
// ORDER API TYPES
// ============================================

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  couponCode?: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethodType
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  shippingProvider?: string
  notes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
  deliveredAt?: string
  cancelledAt?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

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

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export type PaymentMethodType = 
  | 'card'
  | 'upi'
  | 'netbanking'
  | 'cod'
  | 'wallet'

export interface Address {
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
}

export interface CreateOrderRequest {
  items: OrderItem[]
  shippingAddress: Address
  billingAddress?: Address
  paymentMethod: PaymentMethodType
  couponCode?: string
  notes?: string
}

export interface UpdateOrderRequest {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  trackingNumber?: string
  shippingProvider?: string
  adminNotes?: string
}

export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  dateFrom?: string
  dateTo?: string
  search?: string
  userId?: string
  page?: number
  limit?: number
}

// ============================================
// CATEGORY API TYPES
// ============================================

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  parentId: string | null
  parentName?: string
  productCount: number
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
  image?: string
  parentId?: string
  isActive?: boolean
  order?: number
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

// ============================================
// BRAND API TYPES
// ============================================

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
  productCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBrandRequest {
  name: string
  description?: string
  logo?: string
  website?: string
  isActive?: boolean
}

export interface UpdateBrandRequest extends Partial<CreateBrandRequest> {}

// ============================================
// COUPON API TYPES
// ============================================

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
  applicableProducts?: string[]
  applicableCategories?: string[]
  createdAt: string
  updatedAt: string
}

export type CouponType = 'percentage' | 'fixed' | 'free_shipping'

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
  applicableProducts?: string[]
  applicableCategories?: string[]
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {}

// ============================================
// CART API TYPES
// ============================================

export interface Cart {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  couponCode?: string
  itemCount: number
  expiresAt: number
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
  maxQuantity?: number
}

export interface AddToCartRequest {
  productId: string
  quantity?: number
  size?: string
  color?: string
}

export interface UpdateCartItemRequest {
  itemId: string
  quantity: number
}

export interface ApplyCouponRequest {
  code: string
}

// ============================================
// USER API TYPES
// ============================================

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  addresses: Address[]
  orders: number
  spent: number
  joined: string
  lastActive: string
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// ============================================
// REVIEW API TYPES
// ============================================

export interface Review {
  id: string
  userId: string
  userName: string
  productId: string
  productName: string
  rating: number
  title?: string
  content: string
  images?: string[]
  isVerified: boolean
  isApproved: boolean
  helpful: number
  createdAt: string
  updatedAt: string
}

export interface CreateReviewRequest {
  productId: string
  rating: number
  title?: string
  content: string
  images?: string[]
}

export interface ReviewFilters {
  productId?: string
  userId?: string
  rating?: number
  isApproved?: boolean
  page?: number
  limit?: number
}

// ============================================
// WISHLIST API TYPES
// ============================================

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  addedAt: string
}

export interface WishlistResponse {
  items: WishlistItem[]
  count: number
}

// ============================================
// DASHBOARD API TYPES
// ============================================

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  pendingOrders: number
  lowStock: number
  recentOrders: Order[]
  topProducts: TopProduct[]
  revenueData: ChartData[]
  ordersData: ChartData[]
}

export interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  image: string
}

export interface ChartData {
  label: string
  value: number
}

// ============================================
// PAYMENT API TYPES
// ============================================

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  clientSecret?: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  paymentIntent?: PaymentIntent
}

export interface PaymentMethodInfo {
  id: string
  type: PaymentMethodType
  last4?: string
  brand?: string
}

// ============================================
// SHIPPING API TYPES
// ============================================

export interface ShippingRate {
  id: string
  name: string
  price: number
  estimatedDays: string
  provider: string
}

export interface TrackingInfo {
  trackingNumber: string
  provider: string
  status: string
  estimatedDelivery?: string
  deliveredAt?: string
  events: TrackingEvent[]
}

export interface TrackingEvent {
  date: string
  location: string
  status: string
  description: string
}

// ============================================
// UPLOAD API TYPES
// ============================================

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

export interface UploadError {
  code: string
  message: string
}

// ============================================
// SEARCH API TYPES
// ============================================

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
  query: string
}

export interface SearchFilters {
  query: string
  type?: 'products' | 'orders' | 'users'
  page?: number
  limit?: number
}

// ============================================
// NOTIFICATION API TYPES
// ============================================

export interface Notification {
  id: string
  userId: string
  type: 'order' | 'promo' | 'alert' | 'system'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
}

export interface NotificationResponse {
  notifications: Notification[]
  unreadCount: number
}