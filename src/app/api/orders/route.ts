import { NextRequest, NextResponse } from 'next/server'

// Types
interface OrderItem {
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

interface Order {
  id: string
  orderNumber: string
  userId: string | null
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  paymentMethod: 'COD' | 'CARD' | 'UPI' | 'NET_BANKING'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  orderStatus: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  trackingNumber?: string
  shippingProvider?: string
  notes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
  deliveredAt?: string
  cancelledAt?: string
}

interface OrdersResponse {
  success: boolean
  message: string
  data?: Order | Order[]
  error?: string
  errors?: Record<string, string>
  pagination?: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Mock orders database
let orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-240315-0001',
    userId: '2',
    items: [
      {
        id: 'item_1',
        productId: '1',
        name: 'Nike Mercurial Superfly 9',
        price: 24999,
        quantity: 1,
        image: '/images/n1.jpeg',
        variant: { size: 'UK 8', color: 'Black/Red' }
      }
    ],
    subtotal: 24999,
    tax: 4499.82,
    shipping: 99,
    discount: 0,
    total: 29597.82,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
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
      email: 'john.doe@example.com',
      phone: '9876543210',
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    trackingNumber: 'DEL123456789',
    shippingProvider: 'Delhivery',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-18T14:20:00Z',
    deliveredAt: '2024-03-18T14:20:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-240316-0002',
    userId: '3',
    items: [
      {
        id: 'item_2',
        productId: '3',
        name: 'SG Test Cricket Bat',
        price: 15999,
        quantity: 1,
        image: '/images/n3.jpeg'
      },
      {
        id: 'item_3',
        productId: '4',
        name: 'Adidas Cricket Helmet',
        price: 4999,
        quantity: 1,
        image: '/images/n4.jpeg'
      }
    ],
    subtotal: 20998,
    tax: 3779.64,
    shipping: 0,
    discount: 500,
    total: 24277.64,
    couponCode: 'SPORTS500',
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '9876543211',
      address: '456 Park Ave',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    billingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '9876543211',
      address: '456 Park Ave',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    createdAt: '2024-03-16T11:45:00Z',
    updatedAt: '2024-03-16T11:45:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-240316-0003',
    userId: '2',
    items: [
      {
        id: 'item_4',
        productId: '5',
        name: 'Nike Air Jordan',
        price: 18999,
        quantity: 1,
        image: '/images/n5.jpeg'
      }
    ],
    subtotal: 18999,
    tax: 3419.82,
    shipping: 99,
    discount: 0,
    total: 22517.82,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
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
      email: 'john.doe@example.com',
      phone: '9876543210',
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    createdAt: '2024-03-16T15:20:00Z',
    updatedAt: '2024-03-16T15:20:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-240314-0004',
    userId: '4',
    items: [
      {
        id: 'item_5',
        productId: '2',
        name: 'Adidas Predator Edge',
        price: 22999,
        quantity: 1,
        image: '/images/n2.jpeg'
      }
    ],
    subtotal: 22999,
    tax: 4139.82,
    shipping: 0,
    discount: 0,
    total: 27138.82,
    shippingAddress: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543212',
      address: '789 Lake Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    billingAddress: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543212',
      address: '789 Lake Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    trackingNumber: 'BLU987654321',
    shippingProvider: 'Blue Dart',
    createdAt: '2024-03-14T09:15:00Z',
    updatedAt: '2024-03-15T16:30:00Z'
  },
  {
    id: '5',
    orderNumber: 'ORD-240313-0005',
    userId: '5',
    items: [
      {
        id: 'item_6',
        productId: '6',
        name: 'Yonex EZONE 100',
        price: 15999,
        quantity: 1,
        image: '/images/n6.jpeg'
      }
    ],
    subtotal: 15999,
    tax: 2879.82,
    shipping: 99,
    discount: 0,
    total: 18977.82,
    shippingAddress: {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@example.com',
      phone: '9876543213',
      address: '321 Garden Street',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      country: 'India'
    },
    billingAddress: {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@example.com',
      phone: '9876543213',
      address: '321 Garden Street',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      country: 'India'
    },
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    orderStatus: 'CANCELLED',
    cancelledAt: '2024-03-14T10:00:00Z',
    notes: 'Changed mind, wants different size',
    createdAt: '2024-03-13T14:30:00Z',
    updatedAt: '2024-03-14T10:00:00Z'
  }
]

// Helper: Generate order number
const generateOrderNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const count = (orders.length + 1).toString().padStart(4, '0')
  return `ORD-${year}${month}${day}-${count}`
}

// Helper: Authenticate user
const authenticateUser = (request: NextRequest): { id: string; role: string } | null => {
  const userInfo = request.cookies.get('user_info')?.value
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return { id: user.id, role: user.role }
    } catch {
      return null
    }
  }
  return null
}

// Helper: Check if user is admin
const isAdmin = (user: { role: string } | null): boolean => {
  if (!user) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)
}

// Helper: Validate order status update
const validateStatusUpdate = (currentStatus: string, newStatus: string): { valid: boolean; message?: string } => {
  const validTransitions: Record<string, string[]> = {
    'PENDING': ['PROCESSING', 'CONFIRMED', 'CANCELLED'],
    'PROCESSING': ['CONFIRMED', 'PACKED', 'CANCELLED'],
    'CONFIRMED': ['PACKED', 'CANCELLED'],
    'PACKED': ['SHIPPED', 'CANCELLED'],
    'SHIPPED': ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    'OUT_FOR_DELIVERY': ['DELIVERED', 'CANCELLED'],
    'DELIVERED': ['REFUNDED'],
    'CANCELLED': [],
    'REFUNDED': []
  }

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    return { 
      valid: false, 
      message: `Cannot transition from ${currentStatus} to ${newStatus}` 
    }
  }

  return { valid: true }
}

// GET /api/orders - Get orders
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const userId = url.searchParams.get('userId')
    const status = url.searchParams.get('status')
    const paymentStatus = url.searchParams.get('paymentStatus')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const search = url.searchParams.get('search')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const sortBy = url.searchParams.get('sortBy') || 'createdAt'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    // Authenticate user
    const user = authenticateUser(request)

    // Get single order by ID
    if (id) {
      const order = orders.find(o => o.id === id)
      
      if (!order) {
        return NextResponse.json<OrdersResponse>(
          {
            success: false,
            message: 'Order not found',
            error: 'NOT_FOUND'
          },
          { status: 404 }
        )
      }

      // Check authorization (users can only see their own orders, admins can see all)
      if (!isAdmin(user) && order.userId !== user?.id) {
        return NextResponse.json<OrdersResponse>(
          {
            success: false,
            message: 'Unauthorized',
            error: 'UNAUTHORIZED'
          },
          { status: 401 }
        )
      }

      return NextResponse.json<OrdersResponse>(
        {
          success: true,
          message: 'Order retrieved successfully',
          data: order
        },
        { status: 200 }
      )
    }

    // Filter orders
    let filteredOrders = [...orders]

    // Filter by user (non-admins can only see their orders)
    if (!isAdmin(user)) {
      filteredOrders = filteredOrders.filter(o => o.userId === user?.id)
    }

    // Filter by userId (admin only)
    if (userId && isAdmin(user)) {
      filteredOrders = filteredOrders.filter(o => o.userId === userId)
    }

    // Filter by status
    if (status) {
      const statuses = status.split(',')
      filteredOrders = filteredOrders.filter(o => statuses.includes(o.orderStatus))
    }

    // Filter by payment status
    if (paymentStatus) {
      const paymentStatuses = paymentStatus.split(',')
      filteredOrders = filteredOrders.filter(o => paymentStatuses.includes(o.paymentStatus))
    }

    // Filter by date range
    if (startDate) {
      filteredOrders = filteredOrders.filter(o => o.createdAt >= startDate)
    }
    if (endDate) {
      filteredOrders = filteredOrders.filter(o => o.createdAt <= endDate)
    }

    // Search by order number or customer name
    if (search) {
      const searchLower = search.toLowerCase()
      filteredOrders = filteredOrders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.shippingAddress.firstName.toLowerCase().includes(searchLower) ||
        o.shippingAddress.lastName.toLowerCase().includes(searchLower) ||
        o.shippingAddress.email.toLowerCase().includes(searchLower)
      )
    }

    // Sort orders
    filteredOrders.sort((a: any, b: any) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      const modifier = sortOrder === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * modifier
      }
      return (aVal - bVal) * modifier
    })

    // Pagination
    const total = filteredOrders.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedOrders = filteredOrders.slice(start, start + limit)

    return NextResponse.json<OrdersResponse>(
      {
        success: true,
        message: 'Orders retrieved successfully',
        data: paginatedOrders,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error retrieving orders:', error)
    return NextResponse.json<OrdersResponse>(
      {
        success: false,
        message: 'Failed to retrieve orders',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create order (usually from checkout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      notes
    } = body

    // Validate required fields
    if (!items || !items.length) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Order items are required',
          error: 'INVALID_REQUEST'
        },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Shipping address is required',
          error: 'INVALID_REQUEST'
        },
        { status: 400 }
      )
    }

    // Authenticate user
    const user = authenticateUser(request)

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: OrderItem) => 
      sum + (item.price * item.quantity), 0
    )
    const tax = subtotal * 0.18
    const shipping = subtotal > 1000 ? 0 : 99
    
    let discount = 0
    if (couponCode === 'WELCOME10') {
      discount = subtotal * 0.1
    } else if (couponCode === 'SPORTS500') {
      discount = 500
    }
    
    const total = subtotal + tax + shipping - discount

    // Create order
    const orderNumber = generateOrderNumber()
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNumber,
      userId: user?.id || null,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      couponCode,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    orders.push(newOrder)

    return NextResponse.json<OrdersResponse>(
      {
        success: true,
        message: 'Order created successfully',
        data: newOrder
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json<OrdersResponse>(
      {
        success: false,
        message: 'Failed to create order',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// PUT /api/orders - Update order (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check authorization
    const user = authenticateUser(request)
    if (!isAdmin(user)) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Order ID is required',
          error: 'MISSING_ID'
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const orderIndex = orders.findIndex(o => o.id === id)

    if (orderIndex === -1) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Order not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    const existingOrder = orders[orderIndex]
    const updates: Partial<Order> = {}

    // Update order status
    if (body.orderStatus && body.orderStatus !== existingOrder.orderStatus) {
      const validation = validateStatusUpdate(existingOrder.orderStatus, body.orderStatus)
      if (!validation.valid) {
        return NextResponse.json<OrdersResponse>(
          {
            success: false,
            message: validation.message || 'Invalid status transition',
            error: 'INVALID_STATUS'
          },
          { status: 400 }
        )
      }
      updates.orderStatus = body.orderStatus
      
      // Set timestamps based on status
      if (body.orderStatus === 'DELIVERED') {
        updates.deliveredAt = new Date().toISOString()
      } else if (body.orderStatus === 'CANCELLED') {
        updates.cancelledAt = new Date().toISOString()
      }
    }

    // Update payment status
    if (body.paymentStatus && body.paymentStatus !== existingOrder.paymentStatus) {
      updates.paymentStatus = body.paymentStatus
    }

    // Update tracking info
    if (body.trackingNumber !== undefined) {
      updates.trackingNumber = body.trackingNumber
    }
    if (body.shippingProvider !== undefined) {
      updates.shippingProvider = body.shippingProvider
    }

    // Update notes
    if (body.adminNotes !== undefined) {
      updates.adminNotes = body.adminNotes
    }

    updates.updatedAt = new Date().toISOString()

    // Apply updates
    const updatedOrder = { ...existingOrder, ...updates }
    orders[orderIndex] = updatedOrder

    return NextResponse.json<OrdersResponse>(
      {
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json<OrdersResponse>(
      {
        success: false,
        message: 'Failed to update order',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/orders - Delete order (admin only, rarely used)
export async function DELETE(request: NextRequest) {
  try {
    // Check authorization
    const user = authenticateUser(request)
    if (!isAdmin(user)) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Order ID is required',
          error: 'MISSING_ID'
        },
        { status: 400 }
      )
    }

    const orderIndex = orders.findIndex(o => o.id === id)

    if (orderIndex === -1) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Order not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Remove order
    orders.splice(orderIndex, 1)

    return NextResponse.json<OrdersResponse>(
      {
        success: true,
        message: 'Order deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json<OrdersResponse>(
      {
        success: false,
        message: 'Failed to delete order',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// PATCH /api/orders - Bulk update (admin only)
export async function PATCH(request: NextRequest) {
  try {
    // Check authorization
    const user = authenticateUser(request)
    if (!isAdmin(user)) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, orderIds, ...data } = body

    if (!action || !orderIds || !Array.isArray(orderIds)) {
      return NextResponse.json<OrdersResponse>(
        {
          success: false,
          message: 'Invalid request format',
          error: 'INVALID_REQUEST'
        },
        { status: 400 }
      )
    }

    switch (action) {
      case 'update-status':
        // Update status for multiple orders
        if (!data.orderStatus) {
          return NextResponse.json<OrdersResponse>(
            {
              success: false,
              message: 'Order status is required',
              error: 'INVALID_REQUEST'
            },
            { status: 400 }
          )
        }

        orderIds.forEach((orderId: string) => {
          const order = orders.find(o => o.id === orderId)
          if (order) {
            order.orderStatus = data.orderStatus
            order.updatedAt = new Date().toISOString()
            
            if (data.orderStatus === 'DELIVERED') {
              order.deliveredAt = new Date().toISOString()
            } else if (data.orderStatus === 'CANCELLED') {
              order.cancelledAt = new Date().toISOString()
            }
          }
        })
        break

      case 'update-payment':
        // Update payment status for multiple orders
        if (!data.paymentStatus) {
          return NextResponse.json<OrdersResponse>(
            {
              success: false,
              message: 'Payment status is required',
              error: 'INVALID_REQUEST'
            },
            { status: 400 }
          )
        }

        orderIds.forEach((orderId: string) => {
          const order = orders.find(o => o.id === orderId)
          if (order) {
            order.paymentStatus = data.paymentStatus
            order.updatedAt = new Date().toISOString()
          }
        })
        break

      case 'add-tracking':
        // Add tracking info to multiple orders
        if (!data.trackingNumber || !data.shippingProvider) {
          return NextResponse.json<OrdersResponse>(
            {
              success: false,
              message: 'Tracking number and provider are required',
              error: 'INVALID_REQUEST'
            },
            { status: 400 }
          )
        }

        orderIds.forEach((orderId: string) => {
          const order = orders.find(o => o.id === orderId)
          if (order) {
            order.trackingNumber = data.trackingNumber
            order.shippingProvider = data.shippingProvider
            order.updatedAt = new Date().toISOString()
          }
        })
        break

      default:
        return NextResponse.json<OrdersResponse>(
          {
            success: false,
            message: 'Invalid action',
            error: 'INVALID_ACTION'
          },
          { status: 400 }
        )
    }

    return NextResponse.json<OrdersResponse>(
      {
        success: true,
        message: 'Orders updated successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating orders:', error)
    return NextResponse.json<OrdersResponse>(
      {
        success: false,
        message: 'Failed to update orders',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}