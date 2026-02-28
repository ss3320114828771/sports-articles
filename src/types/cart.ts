// ============================================
// CART ITEM TYPES
// ============================================

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
  discount?: number
  subtotal?: number
}

export interface CartItemInput {
  productId: string
  quantity?: number
  size?: string
  color?: string
}

// ============================================
// CART TYPES
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
  couponDiscount?: number
  itemCount: number
  expiresAt?: number
  createdAt?: string
  updatedAt?: string
}

export interface CartSummary {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  itemCount: number
  savings: number
}

// ============================================
// CART COUPON TYPES
// ============================================

export interface CartCoupon {
  code: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  discount: number
  description?: string
}

export interface ApplyCouponResult {
  success: boolean
  discount?: number
  coupon?: CartCoupon
  error?: string
}

// ============================================
// CART REQUEST/RESPONSE TYPES
// ============================================

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

export interface RemoveFromCartRequest {
  itemId: string
}

export interface ApplyCouponRequest {
  code: string
}

export interface CartResponse {
  success: boolean
  message?: string
  data?: Cart
  error?: string
}

export interface CartListResponse {
  success: boolean
  data: Cart[]
  pagination?: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// ============================================
// CART STATE TYPES (for Redux/Context)
// ============================================

export interface CartState {
  cart: Cart | null
  isLoading: boolean
  isUpdating: boolean
  error: string | null
  isInitialized: boolean
}

export type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPDATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'APPLY_COUPON'; payload: CartCoupon }
  | { type: 'REMOVE_COUPON' }

// ============================================
// CART CONSTANTS
// ============================================

export const CART_CONSTANTS = {
  MAX_QUANTITY: 10,
  MIN_QUANTITY: 1,
  FREE_SHIPPING_THRESHOLD: 1000,
  SHIPPING_RATE: 99,
  TAX_RATE: 0.18,
  CART_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  MAX_ITEMS: 50
} as const

export const CART_STORAGE_KEY = 'cart'
export const CART_COOKIE_NAME = 'cart'

// ============================================
// CART CALCULATION TYPES
// ============================================

export interface CartCalculationInput {
  items: CartItem[]
  couponCode?: string
  shipping?: number
  tax?: number
}

export interface CartCalculationResult {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  itemCount: number
  savings: number
}

// ============================================
// CART VALIDATION TYPES
// ============================================

export interface CartValidationError {
  itemId?: string
  productId?: string
  message: string
  code: string
}

export interface CartValidationResult {
  isValid: boolean
  errors: CartValidationError[]
  warnings: CartValidationError[]
}

// ============================================
// CART HELPER FUNCTIONS
// ============================================

export function calculateItemSubtotal(item: CartItem): number {
  return item.price * item.quantity
}

export function calculateItemDiscount(item: CartItem): number {
  if (!item.discount) return 0
  return (item.price * item.quantity * item.discount) / 100
}

export function calculateCartTotals(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0)
  const shipping = subtotal > CART_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : CART_CONSTANTS.SHIPPING_RATE
  const tax = subtotal * CART_CONSTANTS.TAX_RATE
  const discount = items.reduce((sum, item) => sum + calculateItemDiscount(item), 0)
  const total = subtotal + shipping + tax - discount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const savings = discount

  return { subtotal, shipping, tax, discount, total, itemCount, savings }
}

export function isCartEmpty(cart: Cart | null): boolean {
  return !cart || cart.items.length === 0
}

export function getCartItemCount(cart: Cart | null): number {
  return cart?.itemCount || 0
}

export function getCartTotal(cart: Cart | null): number {
  return cart?.total || 0
}

export function findCartItem(
  cart: Cart | null,
  productId: string,
  size?: string,
  color?: string
): CartItem | undefined {
  return cart?.items.find(
    item =>
      item.productId === productId &&
      item.size === size &&
      item.color === color
  )
}

export function isItemInCart(
  cart: Cart | null,
  productId: string,
  size?: string,
  color?: string
): boolean {
  return !!findCartItem(cart, productId, size, color)
}

export function getItemQuantity(
  cart: Cart | null,
  productId: string,
  size?: string,
  color?: string
): number {
  const item = findCartItem(cart, productId, size, color)
  return item?.quantity || 0
}

export function canAddToCart(
  cart: Cart | null,
  productId: string,
  quantity: number = 1,
  size?: string,
  color?: string
): { allowed: boolean; reason?: string } {
  if (!cart) return { allowed: true }

  const currentItem = findCartItem(cart, productId, size, color)
  const currentQuantity = currentItem?.quantity || 0
  const maxQuantity = currentItem?.maxQuantity || CART_CONSTANTS.MAX_QUANTITY

  if (currentQuantity + quantity > maxQuantity) {
    return {
      allowed: false,
      reason: `Maximum quantity (${maxQuantity}) reached`
    }
  }

  if (cart.items.length >= CART_CONSTANTS.MAX_ITEMS && !currentItem) {
    return {
      allowed: false,
      reason: `Cart cannot have more than ${CART_CONSTANTS.MAX_ITEMS} items`
    }
  }

  return { allowed: true }
}

// ============================================
// CART FORMATTING FUNCTIONS
// ============================================

export function formatCartItemName(item: CartItem): string {
  let name = item.name
  if (item.size) name += ` - Size: ${item.size}`
  if (item.color) name += ` - Color: ${item.color}`
  return name
}

export function getCartSummaryText(cart: Cart | null): string {
  if (!cart || cart.items.length === 0) return 'Cart is empty'
  return `${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''} • ₹${cart.total.toLocaleString()}`
}

export function getCartStatus(cart: Cart | null): 'empty' | 'hasItems' | 'expired' {
  if (!cart) return 'empty'
  if (cart.expiresAt && Date.now() > cart.expiresAt) return 'expired'
  return cart.items.length > 0 ? 'hasItems' : 'empty'
}

// ============================================
// CART VALIDATION FUNCTIONS
// ============================================

export function validateCartItems(items: CartItem[]): CartValidationResult {
  const errors: CartValidationError[] = []
  const warnings: CartValidationError[] = []

  items.forEach(item => {
    if (item.quantity < CART_CONSTANTS.MIN_QUANTITY) {
      errors.push({
        itemId: item.id,
        productId: item.productId,
        message: `Quantity cannot be less than ${CART_CONSTANTS.MIN_QUANTITY}`,
        code: 'INVALID_QUANTITY'
      })
    }

    if (item.quantity > (item.maxQuantity || CART_CONSTANTS.MAX_QUANTITY)) {
      errors.push({
        itemId: item.id,
        productId: item.productId,
        message: `Quantity cannot exceed ${item.maxQuantity || CART_CONSTANTS.MAX_QUANTITY}`,
        code: 'MAX_QUANTITY_EXCEEDED'
      })
    }

    if (item.price <= 0) {
      warnings.push({
        itemId: item.id,
        productId: item.productId,
        message: 'Item has invalid price',
        code: 'INVALID_PRICE'
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// ============================================
// CART MOCK DATA
// ============================================

export const mockCartItems: CartItem[] = [
  {
    id: 'item_1',
    productId: '1',
    name: 'Nike Mercurial Superfly 9',
    price: 24999,
    quantity: 1,
    image: '/images/n1.jpeg',
    size: 'UK 8',
    color: 'Black/Red',
    maxQuantity: 10,
    subtotal: 24999
  },
  {
    id: 'item_2',
    productId: '2',
    name: 'SG Test Cricket Bat',
    price: 15999,
    quantity: 2,
    image: '/images/n3.jpeg',
    size: 'Short Handle',
    color: 'Natural',
    maxQuantity: 5,
    subtotal: 31998
  }
]

export const mockCart: Cart = {
  id: 'cart_123',
  items: mockCartItems,
  subtotal: 56997,
  shipping: 0,
  tax: 10259.46,
  discount: 0,
  total: 67256.46,
  itemCount: 3,
  expiresAt: Date.now() + CART_CONSTANTS.CART_EXPIRY,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const mockEmptyCart: Cart = {
  id: 'cart_empty',
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
  expiresAt: Date.now() + CART_CONSTANTS.CART_EXPIRY,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}