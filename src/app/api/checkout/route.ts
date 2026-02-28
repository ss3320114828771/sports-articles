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

interface CheckoutRequest {
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  paymentMethod: PaymentMethod
  sameAsShipping?: boolean
  couponCode?: string
  notes?: string
}

interface ShippingAddress {
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

type PaymentMethod = 'COD' | 'CARD' | 'UPI' | 'NET_BANKING'

interface CheckoutResponse {
  success: boolean
  message: string
  data?: {
    orderId: string
    orderNumber: string
    amount: number
    paymentIntent?: any
    redirectUrl?: string
  }
  error?: string
  errors?: Record<string, string>
}

interface Order {
  id: string
  orderNumber: string
  userId: string | null
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  orderStatus: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Mock cart storage (in production, use database)
let carts: Map<string, any> = new Map()
let orders: Order[] = []

// Helper: Generate order number
const generateOrderNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${year}${month}${day}-${random}`
}

// Helper: Calculate totals
const calculateTotals = (items: CartItem[], couponCode?: string) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18 // 18% GST
  const shipping = subtotal > 1000 ? 0 : 99
  
  let discount = 0
  if (couponCode === 'WELCOME10') {
    discount = subtotal * 0.1
  } else if (couponCode === 'SPORTS500') {
    discount = 500
  }
  
  const total = subtotal + tax + shipping - discount
  
  return { subtotal, tax, shipping, discount, total }
}

// Helper: Validate shipping address
const validateAddress = (address: ShippingAddress, prefix: string = ''): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!address.firstName?.trim()) {
    errors[`${prefix}firstName`] = 'First name is required'
  } else if (address.firstName.length < 2) {
    errors[`${prefix}firstName`] = 'First name must be at least 2 characters'
  }

  if (!address.lastName?.trim()) {
    errors[`${prefix}lastName`] = 'Last name is required'
  }

  if (!address.email?.trim()) {
    errors[`${prefix}email`] = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
    errors[`${prefix}email`] = 'Invalid email format'
  }

  if (!address.phone?.trim()) {
    errors[`${prefix}phone`] = 'Phone number is required'
  } else if (!/^[6-9]\d{9}$|^\+91[6-9]\d{9}$/.test(address.phone.replace(/\s+/g, ''))) {
    errors[`${prefix}phone`] = 'Invalid phone number'
  }

  if (!address.address?.trim()) {
    errors[`${prefix}address`] = 'Address is required'
  }

  if (!address.city?.trim()) {
    errors[`${prefix}city`] = 'City is required'
  }

  if (!address.state?.trim()) {
    errors[`${prefix}state`] = 'State is required'
  }

  if (!address.pincode?.trim()) {
    errors[`${prefix}pincode`] = 'Pincode is required'
  } else if (!/^\d{6}$/.test(address.pincode)) {
    errors[`${prefix}pincode`] = 'Pincode must be 6 digits'
  }

  if (!address.country?.trim()) {
    errors[`${prefix}country`] = 'Country is required'
  }

  return errors
}

// Helper: Authenticate user
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

// Helper: Process payment (mock)
const processPayment = async (
  method: PaymentMethod,
  amount: number,
  paymentDetails?: any
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000))

  switch (method) {
    case 'COD':
      return { success: true, transactionId: `COD_${Date.now()}` }
    
    case 'CARD':
      // Mock card payment - 90% success rate
      if (Math.random() > 0.1) {
        return { success: true, transactionId: `CARD_${Date.now()}` }
      } else {
        return { success: false, error: 'Payment failed. Please try again.' }
      }
    
    case 'UPI':
      return { 
        success: true, 
        transactionId: `UPI_${Date.now()}`,
        // For UPI, we might want to return a redirect URL
      }
    
    case 'NET_BANKING':
      return { 
        success: true, 
        transactionId: `NB_${Date.now()}`,
        // For net banking, redirect to bank page
      }
    
    default:
      return { success: false, error: 'Invalid payment method' }
  }
}

// POST /api/checkout - Process checkout
export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      sameAsShipping = true,
      couponCode,
      notes 
    } = body

    // Get user ID from session
    const userId = authenticateUser(request)
    const sessionId = request.cookies.get('session_id')?.value

    // Get cart
    const cartId = userId || sessionId
    if (!cartId) {
      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          message: 'No cart found',
          error: 'CART_NOT_FOUND'
        },
        { status: 404 }
      )
    }

    const cart = carts.get(cartId)
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          message: 'Cart is empty',
          error: 'EMPTY_CART'
        },
        { status: 400 }
      )
    }

    // Validate shipping address
    const shippingErrors = validateAddress(shippingAddress, 'shipping.')
    
    // Validate billing address if different
    let billingErrors: Record<string, string> = {}
    if (!sameAsShipping && billingAddress) {
      billingErrors = validateAddress(billingAddress, 'billing.')
    }

    const allErrors = { ...shippingErrors, ...billingErrors }
    if (Object.keys(allErrors).length > 0) {
      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          message: 'Validation failed',
          errors: allErrors
        },
        { status: 400 }
      )
    }

    // Validate payment method
    const validPaymentMethods: PaymentMethod[] = ['COD', 'CARD', 'UPI', 'NET_BANKING']
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          message: 'Invalid payment method',
          error: 'INVALID_PAYMENT_METHOD'
        },
        { status: 400 }
      )
    }

    // Check if COD is available (usually for orders above certain amount)
    if (paymentMethod === 'COD' && cart.total > 50000) {
      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          message: 'COD not available for orders above ₹50,000',
          error: 'COD_UNAVAILABLE'
        },
        { status: 400 }
      )
    }

    // Calculate final totals (with any new coupon)
    const totals = calculateTotals(cart.items, couponCode || cart.couponCode)

    // Create order
    const orderNumber = generateOrderNumber()
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNumber,
      userId,
      items: cart.items,
      ...totals,
      couponCode: couponCode || cart.couponCode,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress!,
      paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Process payment
    const paymentResult = await processPayment(paymentMethod, totals.total)

    if (!paymentResult.success) {
      // Save failed order attempt
      newOrder.paymentStatus = 'FAILED'
      orders.push(newOrder)

      return NextResponse.json<CheckoutResponse>(
        {
          success: false,
          message: paymentResult.error || 'Payment failed',
          error: 'PAYMENT_FAILED'
        },
        { status: 400 }
      )
    }

    // Payment successful
    newOrder.paymentStatus = 'PAID'
    newOrder.orderStatus = 'CONFIRMED'
    orders.push(newOrder)

    // Clear cart after successful order
    carts.delete(cartId)

    // Clear session cookie for guest users
    const response = NextResponse.json<CheckoutResponse>(
      {
        success: true,
        message: 'Order placed successfully',
        data: {
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          amount: newOrder.total,
          paymentIntent: {
            id: paymentResult.transactionId,
            method: paymentMethod
          }
        }
      },
      { status: 201 }
    )

    if (!userId && sessionId) {
      response.cookies.set({
        name: 'session_id',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      })
    }

    // In production, send order confirmation email
    // await sendOrderConfirmationEmail(newOrder)

    return response

  } catch (error) {
    console.error('Error processing checkout:', error)
    return NextResponse.json<CheckoutResponse>(
      {
        success: false,
        message: 'Failed to process checkout',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// GET /api/checkout/validate - Validate checkout (check stock, etc.)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action')

    if (action === 'validate') {
      return await validateCheckout(request)
    }

    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in checkout validation:', error)
    return NextResponse.json<CheckoutResponse>(
      {
        success: false,
        message: 'Validation failed',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// Helper: Validate checkout (check stock, prices, etc.)
async function validateCheckout(request: NextRequest) {
  // Get user ID from session
  const userId = authenticateUser(request)
  const sessionId = request.cookies.get('session_id')?.value

  // Get cart
  const cartId = userId || sessionId
  if (!cartId) {
    return NextResponse.json<CheckoutResponse>(
      {
        success: false,
        message: 'No cart found',
        error: 'CART_NOT_FOUND'
      },
      { status: 404 }
    )
  }

  const cart = carts.get(cartId)
  if (!cart || !cart.items || cart.items.length === 0) {
    return NextResponse.json<CheckoutResponse>(
      {
        success: false,
        message: 'Cart is empty',
        error: 'EMPTY_CART'
      },
      { status: 400 }
    )
  }

  // In production, check:
  // 1. Stock availability for each item
  // 2. Price changes
  // 3. Coupon validity
  // 4. Shipping availability

  const validationResults = {
    isValid: true,
    issues: [] as string[],
    cart: {
      ...cart,
      ...calculateTotals(cart.items, cart.couponCode)
    }
  }

  // Mock stock check
  cart.items.forEach((item: CartItem) => {
    // In production, check actual stock in database
    if (item.quantity > 10) {
      validationResults.isValid = false
      validationResults.issues.push(`${item.name} has limited stock`)
    }
  })

  if (!validationResults.isValid) {
    return NextResponse.json(
      {
        success: false,
        message: 'Cart validation failed',
        data: validationResults
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Cart is valid',
      data: validationResults.cart
    },
    { status: 200 }
  )
}

// GET /api/checkout/payment-methods - Get available payment methods
export async function OPTIONS(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const amount = url.searchParams.get('amount') 
      ? parseFloat(url.searchParams.get('amount')!) 
      : 0

    const paymentMethods = [
      {
        id: 'COD',
        name: 'Cash on Delivery',
        icon: '💵',
        description: 'Pay when you receive your order',
        available: amount <= 50000,
        minAmount: 0,
        maxAmount: 50000
      },
      {
        id: 'CARD',
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Pay using Visa, Mastercard, RuPay',
        available: true,
        minAmount: 0,
        maxAmount: null
      },
      {
        id: 'UPI',
        name: 'UPI',
        icon: '📱',
        description: 'Pay using Google Pay, PhonePe, Paytm',
        available: true,
        minAmount: 0,
        maxAmount: 200000
      },
      {
        id: 'NET_BANKING',
        name: 'Net Banking',
        icon: '🏦',
        description: 'All major banks supported',
        available: true,
        minAmount: 0,
        maxAmount: null
      }
    ]

    return NextResponse.json(
      {
        success: true,
        data: paymentMethods
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch payment methods',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}