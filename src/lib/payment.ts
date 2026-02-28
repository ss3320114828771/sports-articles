// Payment types
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  clientSecret?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod'
  last4?: string
  brand?: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  paymentIntent?: PaymentIntent
}

export interface CreateOrderParams {
  amount: number
  currency?: string
  paymentMethod: string
  orderId?: string
  customerEmail?: string
  customerName?: string
}

// Payment providers
type PaymentProvider = 'razorpay' | 'stripe' | 'paytm' | 'phonepe'

// Configuration
const PAYMENT_PROVIDER = (process.env.PAYMENT_PROVIDER || 'razorpay') as PaymentProvider
const CURRENCY = process.env.PAYMENT_CURRENCY || 'INR'

// Mock payment processing
export async function createPaymentIntent(params: CreateOrderParams): Promise<PaymentResult> {
  console.log('💳 Creating payment intent:', params)

  // Mock successful payment
  return {
    success: true,
    transactionId: `txn_${Date.now()}`,
    paymentIntent: {
      id: `pi_${Date.now()}`,
      amount: params.amount,
      currency: params.currency || CURRENCY,
      status: 'succeeded'
    }
  }
}

// Process payment
export async function processPayment(
  paymentMethod: string,
  amount: number,
  orderId?: string
): Promise<PaymentResult> {
  console.log('💳 Processing payment:', { paymentMethod, amount, orderId })

  // Mock payment processing
  if (paymentMethod === 'cod') {
    return {
      success: true,
      transactionId: `cod_${Date.now()}`,
      paymentIntent: {
        id: `pi_${Date.now()}`,
        amount,
        currency: CURRENCY,
        status: 'pending'
      }
    }
  }

  // Simulate success/failure
  const success = Math.random() > 0.1 // 90% success rate

  if (success) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      paymentIntent: {
        id: `pi_${Date.now()}`,
        amount,
        currency: CURRENCY,
        status: 'succeeded'
      }
    }
  } else {
    return {
      success: false,
      error: 'Payment failed. Please try again.'
    }
  }
}

// Verify payment
export async function verifyPayment(paymentId: string): Promise<PaymentResult> {
  console.log('✅ Verifying payment:', paymentId)

  // Mock verification
  return {
    success: true,
    transactionId: paymentId,
    paymentIntent: {
      id: paymentId,
      amount: 0,
      currency: CURRENCY,
      status: 'succeeded'
    }
  }
}

// Refund payment
export async function refundPayment(
  transactionId: string,
  amount?: number
): Promise<PaymentResult> {
  console.log('💰 Refunding payment:', { transactionId, amount })

  // Mock refund
  return {
    success: true,
    transactionId: `refund_${Date.now()}`,
    paymentIntent: {
      id: transactionId,
      amount: amount || 0,
      currency: CURRENCY,
      status: 'succeeded'
    }
  }
}

// Get payment methods
export function getPaymentMethods(amount: number = 0): PaymentMethod[] {
  const methods: PaymentMethod[] = [
    { id: 'card', type: 'card' },
    { id: 'upi', type: 'upi' },
    { id: 'netbanking', type: 'netbanking' },
    { id: 'wallet', type: 'wallet' }
  ]

  // Add COD for orders under ₹50,000
  if (amount <= 50000) {
    methods.push({ id: 'cod', type: 'cod' })
  }

  return methods
}

// Format amount for payment gateway
export function formatAmount(amount: number): number {
  // Convert to smallest currency unit (paise for INR)
  return Math.round(amount * 100)
}

// Format amount from gateway
export function parseAmount(amount: number): number {
  // Convert from smallest currency unit
  return amount / 100
}

// Validate UPI ID
export function isValidUpiId(upiId: string): boolean {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/
  return upiRegex.test(upiId)
}

// Validate card number (Luhn algorithm)
export function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  if (!/^\d{16}$/.test(digits)) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Validate expiry date
export function isValidExpiry(month: string, year: string): boolean {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const expMonth = parseInt(month)
  const expYear = parseInt(year) + 2000 // Assuming YY format

  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false
  if (expMonth < 1 || expMonth > 12) return false

  return true
}

// Validate CVV
export function isValidCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

// Get card brand
export function getCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')

  if (/^4/.test(digits)) return 'visa'
  if (/^5[1-5]/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits)) return 'amex'
  if (/^6(?:011|5)/.test(digits)) return 'discover'
  if (/^35/.test(digits)) return 'jcb'
  if (/^30[0-5]|^36|^38|^39/.test(digits)) return 'diners'

  return 'unknown'
}

// Get payment provider instance
export function getPaymentProvider(provider?: PaymentProvider) {
  const activeProvider = provider || PAYMENT_PROVIDER

  switch (activeProvider) {
    case 'razorpay':
      return {
        name: 'Razorpay',
        createOrder: async (params: CreateOrderParams) => {
          // Razorpay integration would go here
          return createPaymentIntent(params)
        }
      }
    case 'stripe':
      return {
        name: 'Stripe',
        createOrder: async (params: CreateOrderParams) => {
          // Stripe integration would go here
          return createPaymentIntent(params)
        }
      }
    default:
      return {
        name: 'Mock Provider',
        createOrder: createPaymentIntent
      }
  }
}

// Calculate transaction fee
export function calculateFee(amount: number, provider?: PaymentProvider): number {
  const rates = {
    razorpay: 0.02, // 2%
    stripe: 0.029, // 2.9% + fixed
    paytm: 0.019, // 1.9%
    phonepe: 0.019 // 1.9%
  }

  const providerRate = provider ? rates[provider] : 0.02
  return amount * providerRate
}

// Generate payment receipt HTML
export function generateReceiptHtml(transactionId: string, amount: number, date: Date): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .receipt { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .header { text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
        .amount { font-size: 24px; color: #667eea; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>Payment Receipt</h1>
          <p>Sports Elite</p>
        </div>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Amount:</strong> ₹${amount.toLocaleString()}</p>
        <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${date.toLocaleTimeString()}</p>
        <p><strong>Status:</strong> Successful</p>
        <div class="footer">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </body>
    </html>
  `
}