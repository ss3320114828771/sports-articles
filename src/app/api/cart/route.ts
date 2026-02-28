import { NextRequest, NextResponse } from 'next/server'

// Types
interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    size?: string
    color?: string
  }
}

interface Cart {
  id: string
  userId: string | null
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  createdAt: string
  updatedAt: string
}

interface CartResponse {
  success: boolean
  message: string
  data?: Cart
  error?: string
}

// Mock cart storage (in production, use database)
let carts: Map<string, Cart> = new Map()

// Helper: Calculate cart totals
const calculateTotals = (items: CartItem[], couponCode?: string): Partial<Cart> => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Simple tax calculation (18% GST)
  const tax = subtotal * 0.18
  
  // Shipping calculation
  const shipping = subtotal > 1000 ? 0 : 99
  
  // Simple discount calculation (mock)
  let discount = 0
  if (couponCode === 'WELCOME10') {
    discount = subtotal * 0.1
  } else if (couponCode === 'SPORTS500') {
    discount = 500
  }
  
  const total = subtotal + tax + shipping - discount
  
  return {
    subtotal,
    tax,
    shipping,
    discount,
    total
  }
}

// Helper: Get or create cart
const getOrCreateCart = (userId: string | null, sessionId?: string): Cart => {
  const cartId = userId || sessionId || `guest_${Date.now()}`
  
  if (!carts.has(cartId)) {
    carts.set(cartId, {
      id: cartId,
      userId,
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return carts.get(cartId)!
}

// Helper: Authenticate user (mock)
const authenticateUser = (request: NextRequest): string | null => {
  const userInfo = request.cookies.get('user_info')?.value
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return user.id
    } catch {
      return null
    }
  }
  return null
}

// GET /api/cart - Retrieve cart
export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookie or query
    const sessionId = request.cookies.get('session_id')?.value || 
                      request.nextUrl.searchParams.get('session') || undefined
    
    // Try to authenticate user
    const userId = authenticateUser(request)
    
    // Get or create cart
    const cart = getOrCreateCart(userId, sessionId)

    // Set session cookie if not exists
    const response = NextResponse.json<CartResponse>(
      {
        success: true,
        message: 'Cart retrieved successfully',
        data: cart
      },
      { status: 200 }
    )

    if (!request.cookies.get('session_id') && !userId) {
      response.cookies.set({
        name: 'session_id',
        value: cart.id,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/'
      })
    }

    return response

  } catch (error) {
    console.error('Error retrieving cart:', error)
    return NextResponse.json<CartResponse>(
      {
        success: false,
        message: 'Failed to retrieve cart',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, name, price, quantity = 1, image, variant } = body

    // Validate required fields
    if (!productId || !name || !price) {
      return NextResponse.json<CartResponse>(
        {
          success: false,
          message: 'Missing required fields',
          error: 'INVALID_REQUEST'
        },
        { status: 400 }
      )
    }

    // Validate quantity
    if (quantity < 1 || quantity > 99) {
      return NextResponse.json<CartResponse>(
        {
          success: false,
          message: 'Quantity must be between 1 and 99',
          error: 'INVALID_QUANTITY'
        },
        { status: 400 }
      )
    }

    // Get session and user info
    const sessionId = request.cookies.get('session_id')?.value
    const userId = authenticateUser(request)
    
    // Get cart
    const cart = getOrCreateCart(userId, sessionId)

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && 
              JSON.stringify(item.variant) === JSON.stringify(variant)
    )

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        productId,
        name,
        price,
        quantity,
        image: image || '/images/placeholder.jpg',
        variant
      }
      cart.items.push(newItem)
    }

    // Recalculate totals
    const totals = calculateTotals(cart.items, cart.couponCode)
    Object.assign(cart, totals)
    cart.updatedAt = new Date().toISOString()

    // Update cart in storage
    carts.set(cart.id, cart)

    return NextResponse.json<CartResponse>(
      {
        success: true,
        message: 'Item added to cart successfully',
        data: cart
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json<CartResponse>(
      {
        success: false,
        message: 'Failed to add item to cart',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, quantity, couponCode } = body

    // Get session and user info
    const sessionId = request.cookies.get('session_id')?.value
    const userId = authenticateUser(request)
    
    // Get cart
    const cart = getOrCreateCart(userId, sessionId)

    // Handle coupon code
    if (couponCode !== undefined) {
      cart.couponCode = couponCode || undefined
    }

    // Handle item quantity update
    if (itemId && quantity !== undefined) {
      const itemIndex = cart.items.findIndex(item => item.id === itemId)
      
      if (itemIndex === -1) {
        return NextResponse.json<CartResponse>(
          {
            success: false,
            message: 'Item not found in cart',
            error: 'ITEM_NOT_FOUND'
          },
          { status: 404 }
        )
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1)
      } else if (quantity > 99) {
        return NextResponse.json<CartResponse>(
          {
            success: false,
            message: 'Quantity cannot exceed 99',
            error: 'INVALID_QUANTITY'
          },
          { status: 400 }
        )
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity
      }
    }

    // Recalculate totals
    const totals = calculateTotals(cart.items, cart.couponCode)
    Object.assign(cart, totals)
    cart.updatedAt = new Date().toISOString()

    // Update cart in storage
    carts.set(cart.id, cart)

    return NextResponse.json<CartResponse>(
      {
        success: true,
        message: 'Cart updated successfully',
        data: cart
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json<CartResponse>(
      {
        success: false,
        message: 'Failed to update cart',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const itemId = url.searchParams.get('itemId')
    const clear = url.searchParams.get('clear')

    // Get session and user info
    const sessionId = request.cookies.get('session_id')?.value
    const userId = authenticateUser(request)
    
    // Get cart
    const cart = getOrCreateCart(userId, sessionId)

    if (clear === 'true') {
      // Clear entire cart
      cart.items = []
      cart.couponCode = undefined
    } else if (itemId) {
      // Remove specific item
      const itemIndex = cart.items.findIndex(item => item.id === itemId)
      
      if (itemIndex === -1) {
        return NextResponse.json<CartResponse>(
          {
            success: false,
            message: 'Item not found in cart',
            error: 'ITEM_NOT_FOUND'
          },
          { status: 404 }
        )
      }

      cart.items.splice(itemIndex, 1)
    } else {
      return NextResponse.json<CartResponse>(
        {
          success: false,
          message: 'Missing itemId or clear parameter',
          error: 'INVALID_REQUEST'
        },
        { status: 400 }
      )
    }

    // Recalculate totals
    const totals = calculateTotals(cart.items, cart.couponCode)
    Object.assign(cart, totals)
    cart.updatedAt = new Date().toISOString()

    // Update cart in storage
    carts.set(cart.id, cart)

    return NextResponse.json<CartResponse>(
      {
        success: true,
        message: clear === 'true' ? 'Cart cleared successfully' : 'Item removed from cart',
        data: cart
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json<CartResponse>(
      {
        success: false,
        message: 'Failed to remove item from cart',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// PATCH /api/cart - Merge guest cart with user cart after login
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestSessionId } = body

    // Get authenticated user
    const userId = authenticateUser(request)
    
    if (!userId) {
      return NextResponse.json<CartResponse>(
        {
          success: false,
          message: 'User not authenticated',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    // Get guest cart
    const guestCart = guestSessionId ? carts.get(guestSessionId) : null
    
    // Get or create user cart
    let userCart = carts.get(userId)
    
    if (!userCart) {
      userCart = {
        id: userId,
        userId,
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      carts.set(userId, userCart)
    }

    // Merge guest cart items into user cart
    if (guestCart && guestCart.items.length > 0) {
      guestCart.items.forEach(guestItem => {
        const existingItem = userCart!.items.find(
          item => item.productId === guestItem.productId && 
                  JSON.stringify(item.variant) === JSON.stringify(guestItem.variant)
        )

        if (existingItem) {
          existingItem.quantity += guestItem.quantity
        } else {
          const newItem = {
            ...guestItem,
            id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
          }
          userCart!.items.push(newItem)
        }
      })

      // Recalculate totals
      const totals = calculateTotals(userCart.items, userCart.couponCode)
      Object.assign(userCart, totals)
      userCart.updatedAt = new Date().toISOString()

      // Delete guest cart
      if (guestSessionId) {
        carts.delete(guestSessionId)
      }
    }

    return NextResponse.json<CartResponse>(
      {
        success: true,
        message: 'Carts merged successfully',
        data: userCart
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error merging carts:', error)
    return NextResponse.json<CartResponse>(
      {
        success: false,
        message: 'Failed to merge carts',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}