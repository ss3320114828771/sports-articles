import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// Types
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
  expiresAt?: number
}

export interface AddToCartParams {
  productId: string
  name: string
  price: number
  quantity?: number
  image: string
  size?: string
  color?: string
  maxQuantity?: number
}

export interface UpdateQuantityParams {
  itemId: string
  quantity: number
}

export interface ApplyCouponParams {
  code: string
}

// Constants
const CART_COOKIE_NAME = 'cart'
const CART_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days
const FREE_SHIPPING_THRESHOLD = 1000
const SHIPPING_RATE = 99
const TAX_RATE = 0.18 // 18% GST

// Generate cart ID
function generateCartId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Calculate cart totals
export function calculateCartTotals(items: CartItem[]): {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { subtotal, shipping, tax, total, itemCount }
}

// Create new cart
export function createCart(userId?: string): Cart {
  const id = generateCartId()
  const { subtotal, shipping, tax, total, itemCount } = calculateCartTotals([])

  return {
    id,
    userId,
    items: [],
    subtotal,
    shipping,
    tax,
    discount: 0,
    total,
    itemCount,
    expiresAt: Date.now() + CART_EXPIRY
  }
}

// Get cart from cookies (server)
export async function getCart(): Promise<Cart | null> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get(CART_COOKIE_NAME)?.value

  if (!cartCookie) return null

  try {
    return JSON.parse(cartCookie)
  } catch {
    return null
  }
}

// Get cart from request (API)
export function getCartFromRequest(request: NextRequest): Cart | null {
  const cartCookie = request.cookies.get(CART_COOKIE_NAME)?.value

  if (!cartCookie) return null

  try {
    return JSON.parse(cartCookie)
  } catch {
    return null
  }
}

// Save cart to cookies
export async function saveCart(cart: Cart): Promise<void> {
  const cookieStore = await cookies()
  
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CART_EXPIRY / 1000,
    path: '/'
  })
}

// Clear cart
export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}

// Add item to cart
export async function addToCart(params: AddToCartParams): Promise<Cart> {
  const cart = (await getCart()) || createCart()
  
  const {
    productId,
    name,
    price,
    quantity = 1,
    image,
    size,
    color,
    maxQuantity = 99
  } = params

  // Check if item exists
  const existingItemIndex = cart.items.findIndex(
    item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
  )

  if (existingItemIndex >= 0) {
    // Update existing item
    const existingItem = cart.items[existingItemIndex]
    const newQuantity = Math.min(
      existingItem.quantity + quantity,
      maxQuantity
    )
    cart.items[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity
    }
  } else {
    // Add new item
    const newItem: CartItem = {
      id: `${productId}-${Date.now()}`,
      productId,
      name,
      price,
      quantity,
      image,
      size,
      color,
      maxQuantity
    }
    cart.items.push(newItem)
  }

  // Recalculate totals
  const { subtotal, shipping, tax, total, itemCount } = calculateCartTotals(cart.items)
  cart.subtotal = subtotal
  cart.shipping = shipping
  cart.tax = tax
  cart.total = total - cart.discount
  cart.itemCount = itemCount

  await saveCart(cart)
  return cart
}

// Update item quantity
export async function updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
  const cart = await getCart()
  if (!cart) throw new Error('Cart not found')

  const item = cart.items.find(i => i.id === itemId)
  if (!item) throw new Error('Item not found')

  if (quantity < 1) {
    // Remove item
    cart.items = cart.items.filter(i => i.id !== itemId)
  } else {
    // Update quantity
    const finalQuantity = item.maxQuantity && quantity > item.maxQuantity
      ? item.maxQuantity
      : quantity
    item.quantity = finalQuantity
  }

  // Recalculate totals
  const { subtotal, shipping, tax, total, itemCount } = calculateCartTotals(cart.items)
  cart.subtotal = subtotal
  cart.shipping = shipping
  cart.tax = tax
  cart.total = total - cart.discount
  cart.itemCount = itemCount

  await saveCart(cart)
  return cart
}

// Remove item from cart
export async function removeItem(itemId: string): Promise<Cart> {
  const cart = await getCart()
  if (!cart) throw new Error('Cart not found')

  cart.items = cart.items.filter(i => i.id !== itemId)

  // Recalculate totals
  const { subtotal, shipping, tax, total, itemCount } = calculateCartTotals(cart.items)
  cart.subtotal = subtotal
  cart.shipping = shipping
  cart.tax = tax
  cart.total = total - cart.discount
  cart.itemCount = itemCount

  await saveCart(cart)
  return cart
}

// Apply coupon
export async function applyCoupon(code: string): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  const cart = await getCart()
  if (!cart) return { success: false, error: 'Cart not found' }

  // Mock coupon validation
  let discount = 0
  const upperCode = code.toUpperCase()

  if (upperCode === 'WELCOME10') {
    discount = cart.subtotal * 0.1
  } else if (upperCode === 'SPORTS500') {
    discount = 500
  } else {
    return { success: false, error: 'Invalid coupon code' }
  }

  cart.discount = discount
  cart.couponCode = code
  cart.total = cart.subtotal + cart.shipping + cart.tax - discount

  await saveCart(cart)
  return { success: true, cart }
}

// Remove coupon
export async function removeCoupon(): Promise<Cart> {
  const cart = await getCart()
  if (!cart) throw new Error('Cart not found')

  cart.discount = 0
  cart.couponCode = undefined
  cart.total = cart.subtotal + cart.shipping + cart.tax

  await saveCart(cart)
  return cart
}

// Merge carts (for login)
export async function mergeCarts(guestCart: Cart, userCart: Cart): Promise<Cart> {
  // Combine items
  const mergedItems = [...userCart.items]

  for (const guestItem of guestCart.items) {
    const existingItem = mergedItems.find(
      item => 
        item.productId === guestItem.productId &&
        item.size === guestItem.size &&
        item.color === guestItem.color
    )

    if (existingItem) {
      existingItem.quantity = Math.min(
        existingItem.quantity + guestItem.quantity,
        existingItem.maxQuantity || 99
      )
    } else {
      mergedItems.push(guestItem)
    }
  }

  // Create merged cart
  const mergedCart: Cart = {
    ...userCart,
    items: mergedItems
  }

  // Recalculate totals
  const { subtotal, shipping, tax, total, itemCount } = calculateCartTotals(mergedItems)
  mergedCart.subtotal = subtotal
  mergedCart.shipping = shipping
  mergedCart.tax = tax
  mergedCart.total = total - mergedCart.discount
  mergedCart.itemCount = itemCount

  await saveCart(mergedCart)
  return mergedCart
}

// Validate cart (check stock, prices, etc.)
export async function validateCart(): Promise<{ valid: boolean; issues: string[] }> {
  const cart = await getCart()
  if (!cart) return { valid: false, issues: ['Cart not found'] }

  const issues: string[] = []

  for (const item of cart.items) {
    // Mock stock check - replace with actual database check
    if (item.quantity > 10) {
      issues.push(`${item.name} has limited stock`)
    }
  }

  return {
    valid: issues.length === 0,
    issues
  }
}

// Get cart summary
export function getCartSummary(cart: Cart): {
  subtotal: string
  shipping: string
  tax: string
  discount: string
  total: string
  itemCount: number
} {
  const formatPrice = (price: number) => `₹${price.toFixed(2)}`

  return {
    subtotal: formatPrice(cart.subtotal),
    shipping: cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping),
    tax: formatPrice(cart.tax),
    discount: cart.discount > 0 ? `-${formatPrice(cart.discount)}` : '₹0',
    total: formatPrice(cart.total),
    itemCount: cart.itemCount
  }
}

// Check if cart is empty
export function isCartEmpty(cart: Cart | null): boolean {
  return !cart || cart.items.length === 0
}

// Get item count
export function getItemCount(cart: Cart | null): number {
  return cart?.itemCount || 0
}

// Get cart total
export function getCartTotal(cart: Cart | null): number {
  return cart?.total || 0
}