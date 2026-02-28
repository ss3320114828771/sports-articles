import { NextRequest, NextResponse } from 'next/server'

// Types
interface PaymentWebhookPayload {
  event: 'payment.success' | 'payment.failed' | 'payment.refunded'
  transactionId: string
  orderId?: string
  orderNumber?: string
  amount: number
  paymentMethod: string
  status: string
  timestamp: string
  signature: string
  metadata?: Record<string, any>
}

interface OrderWebhookPayload {
  event: 'order.created' | 'order.updated' | 'order.cancelled' | 'order.delivered'
  orderId: string
  orderNumber: string
  status: string
  customerEmail: string
  customerName: string
  total: number
  timestamp: string
  signature: string
  metadata?: Record<string, any>
}

interface WebhookResponse {
  success: boolean
  message: string
  error?: string
}

// Mock orders database (in production, use real database)
const orders: any[] = []

// Helper: Verify webhook signature
const verifySignature = (payload: any, signature: string, secret: string): boolean => {
  // In production, implement proper signature verification
  // This is a mock implementation
  const expectedSignature = 'mock_signature_' + JSON.stringify(payload).length
  return signature === expectedSignature || process.env.NODE_ENV === 'development'
}

// Helper: Log webhook events
const logWebhook = (event: string, data: any) => {
  console.log(`[Webhook] ${event} at ${new Date().toISOString()}`, data)
}

// Helper: Send email notification
const sendEmailNotification = async (to: string, subject: string, body: string) => {
  // In production, implement actual email sending
  console.log(`[Email] To: ${to}, Subject: ${subject}`)
  return true
}

// Helper: Update order status
const updateOrderStatus = (orderId: string, status: string, updates: any = {}) => {
  // In production, update in database
  console.log(`[Order] ${orderId} status updated to ${status}`, updates)
  return true
}

// POST /api/webhook/payment - Payment webhook (Razorpay/Paytm/Stripe)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-webhook-signature') || ''
    
    // Get webhook secret from environment
    const webhookSecret = process.env.WEBHOOK_SECRET || 'webhook_secret_123'
    
    // Verify signature
    if (!verifySignature(body, signature, webhookSecret)) {
      logWebhook('INVALID_SIGNATURE', { signature })
      return NextResponse.json<WebhookResponse>(
        {
          success: false,
          message: 'Invalid signature',
          error: 'INVALID_SIGNATURE'
        },
        { status: 401 }
      )
    }

    const { event, transactionId, orderId, amount, paymentMethod } = body

    logWebhook(event, { transactionId, orderId, amount })

    // Handle different payment events
    switch (event) {
      case 'payment.success':
        // Update order payment status
        if (orderId) {
          updateOrderStatus(orderId, 'PAID', {
            paymentStatus: 'PAID',
            paymentMethod,
            transactionId,
            paidAt: new Date().toISOString()
          })

          // Send confirmation email
          await sendEmailNotification(
            'customer@example.com',
            'Payment Successful',
            `Your payment of ₹${amount} was successful. Order ID: ${orderId}`
          )
        }
        break

      case 'payment.failed':
        if (orderId) {
          updateOrderStatus(orderId, 'FAILED', {
            paymentStatus: 'FAILED',
            failureReason: body.reason || 'Unknown'
          })

          // Notify customer
          await sendEmailNotification(
            'customer@example.com',
            'Payment Failed',
            `Your payment of ₹${amount} failed. Please try again.`
          )
        }
        break

      case 'payment.refunded':
        if (orderId) {
          updateOrderStatus(orderId, 'REFUNDED', {
            paymentStatus: 'REFUNDED',
            refundId: body.refundId,
            refundAmount: body.refundAmount,
            refundedAt: new Date().toISOString()
          })

          // Notify customer
          await sendEmailNotification(
            'customer@example.com',
            'Refund Processed',
            `Your refund of ₹${body.refundAmount || amount} has been processed.`
          )
        }
        break

      default:
        logWebhook('UNKNOWN_EVENT', { event })
        return NextResponse.json<WebhookResponse>(
          {
            success: false,
            message: 'Unknown event type',
            error: 'UNKNOWN_EVENT'
          },
          { status: 400 }
        )
    }

    return NextResponse.json<WebhookResponse>(
      {
        success: true,
        message: 'Webhook processed successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json<WebhookResponse>(
      {
        success: false,
        message: 'Failed to process webhook',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/webhook/order - Order webhook (for external systems)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-webhook-signature') || ''
    
    const webhookSecret = process.env.WEBHOOK_SECRET || 'webhook_secret_123'
    
    if (!verifySignature(body, signature, webhookSecret)) {
      return NextResponse.json<WebhookResponse>(
        {
          success: false,
          message: 'Invalid signature',
          error: 'INVALID_SIGNATURE'
        },
        { status: 401 }
      )
    }

    const { event, orderId, orderNumber, status, customerEmail, total } = body

    logWebhook(event, { orderId, orderNumber, status })

    switch (event) {
      case 'order.created':
        // New order created in external system
        orders.push({
          id: orderId,
          orderNumber,
          status,
          customerEmail,
          total,
          createdAt: new Date().toISOString()
        })

        // Send notification to admin
        await sendEmailNotification(
          'admin@sports-elite.com',
          'New Order Created',
          `Order ${orderNumber} has been created for ₹${total}`
        )
        break

      case 'order.updated':
        // Order updated in external system
        updateOrderStatus(orderId, status, {
          updatedAt: new Date().toISOString()
        })
        break

      case 'order.cancelled':
        updateOrderStatus(orderId, 'CANCELLED', {
          cancelledAt: new Date().toISOString(),
          reason: body.reason
        })

        // Notify customer
        await sendEmailNotification(
          customerEmail,
          'Order Cancelled',
          `Your order ${orderNumber} has been cancelled.`
        )
        break

      case 'order.delivered':
        updateOrderStatus(orderId, 'DELIVERED', {
          deliveredAt: new Date().toISOString()
        })

        // Request review
        await sendEmailNotification(
          customerEmail,
          'Rate Your Purchase',
          `Your order ${orderNumber} has been delivered. Please rate your experience.`
        )
        break

      default:
        return NextResponse.json<WebhookResponse>(
          {
            success: false,
            message: 'Unknown event type',
            error: 'UNKNOWN_EVENT'
          },
          { status: 400 }
        )
    }

    return NextResponse.json<WebhookResponse>(
      {
        success: true,
        message: 'Webhook processed successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json<WebhookResponse>(
      {
        success: false,
        message: 'Failed to process webhook',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/webhook/sms - SMS webhook (for delivery updates)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, orderId, trackingNumber, location, status } = body

    logWebhook('SMS_UPDATE', { orderId, trackingNumber, status })

    switch (event) {
      case 'shipment.created':
        updateOrderStatus(orderId, 'SHIPPED', {
          trackingNumber,
          shippedAt: new Date().toISOString()
        })
        break

      case 'shipment.in_transit':
        updateOrderStatus(orderId, 'IN_TRANSIT', {
          currentLocation: location,
          lastUpdate: new Date().toISOString()
        })
        break

      case 'shipment.out_for_delivery':
        updateOrderStatus(orderId, 'OUT_FOR_DELIVERY', {
          status: 'OUT_FOR_DELIVERY',
          expectedDelivery: body.expectedDelivery
        })
        break

      case 'shipment.delivered':
        updateOrderStatus(orderId, 'DELIVERED', {
          deliveredAt: new Date().toISOString(),
          deliverySignature: body.signature
        })
        break

      case 'shipment.failed':
        updateOrderStatus(orderId, 'DELIVERY_FAILED', {
          failureReason: body.reason,
          lastUpdate: new Date().toISOString()
        })
        break

      default:
        return NextResponse.json<WebhookResponse>(
          {
            success: false,
            message: 'Unknown event type',
            error: 'UNKNOWN_EVENT'
          },
          { status: 400 }
        )
    }

    return NextResponse.json<WebhookResponse>(
      {
        success: true,
        message: 'Webhook processed successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json<WebhookResponse>(
      {
        success: false,
        message: 'Failed to process webhook',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// GET /api/webhook/health - Health check endpoint
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const type = url.searchParams.get('type') || 'all'

  const healthStatus = {
    success: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    webhooks: {
      payment: true,
      order: true,
      sms: true
    }
  }

  if (type === 'payment') {
    return NextResponse.json({
      success: true,
      type: 'payment',
      status: 'active',
      timestamp: new Date().toISOString()
    })
  }

  if (type === 'order') {
    return NextResponse.json({
      success: true,
      type: 'order',
      status: 'active',
      timestamp: new Date().toISOString()
    })
  }

  if (type === 'sms') {
    return NextResponse.json({
      success: true,
      type: 'sms',
      status: 'active',
      timestamp: new Date().toISOString()
    })
  }

  return NextResponse.json(healthStatus)
}

// OPTIONS - Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature'
      }
    }
  )
}