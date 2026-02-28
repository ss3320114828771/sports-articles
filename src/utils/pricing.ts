// ============================================
// PRICE CALCULATIONS
// ============================================

/**
 * Calculate discount amount
 */
export function calculateDiscount(price: number, discount: number, type: 'percentage' | 'fixed' = 'percentage'): number {
  if (type === 'percentage') {
    return (price * discount) / 100
  }
  return Math.min(discount, price)
}

/**
 * Calculate price after discount
 */
export function calculatePriceAfterDiscount(price: number, discount: number, type: 'percentage' | 'fixed' = 'percentage'): number {
  const discountAmount = calculateDiscount(price, discount, type)
  return price - discountAmount
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice === 0) return 0
  return ((originalPrice - discountedPrice) / originalPrice) * 100
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(cost: number, sellingPrice: number): number {
  if (sellingPrice === 0) return 0
  return ((sellingPrice - cost) / sellingPrice) * 100
}

/**
 * Calculate markup percentage
 */
export function calculateMarkup(cost: number, sellingPrice: number): number {
  if (cost === 0) return 0
  return ((sellingPrice - cost) / cost) * 100
}

/**
 * Calculate tax amount
 */
export function calculateTax(price: number, taxRate: number): number {
  return (price * taxRate) / 100
}

/**
 * Calculate price including tax
 */
export function calculatePriceWithTax(price: number, taxRate: number): number {
  return price + calculateTax(price, taxRate)
}

/**
 * Calculate price excluding tax
 */
export function calculatePriceExcludingTax(priceWithTax: number, taxRate: number): number {
  return priceWithTax / (1 + taxRate / 100)
}

// ============================================
// CART CALCULATIONS
// ============================================

/**
 * Calculate cart subtotal
 */
export function calculateSubtotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(subtotal: number, threshold: number = 1000, rate: number = 99): number {
  return subtotal >= threshold ? 0 : rate
}

/**
 * Calculate cart total
 */
export function calculateCartTotal(
  subtotal: number,
  shipping: number,
  tax: number,
  discount: number = 0
): number {
  return subtotal + shipping + tax - discount
}

/**
 * Calculate savings
 */
export function calculateSavings(originalTotal: number, discountedTotal: number): number {
  return originalTotal - discountedTotal
}

// ============================================
// PRICE FORMATTING
// ============================================

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = 'INR'): string {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥'
  }
  
  const symbol = symbols[currency] || '₹'
  return `${symbol}${price.toLocaleString('en-IN')}`
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number, currency: string = 'INR'): string {
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`
}

/**
 * Format discount
 */
export function formatDiscount(discount: number, type: 'percentage' | 'fixed' = 'percentage'): string {
  if (type === 'percentage') {
    return `${discount}% off`
  }
  return `${formatPrice(discount)} off`
}

/**
 * Format savings
 */
export function formatSavings(savings: number, currency: string = 'INR'): string {
  return `Save ${formatPrice(savings, currency)}`
}

// ============================================
// PRICE COMPARISON
// ============================================

/**
 * Compare prices
 */
export function comparePrices(price1: number, price2: number): 'cheaper' | 'expensive' | 'equal' {
  if (price1 < price2) return 'cheaper'
  if (price1 > price2) return 'expensive'
  return 'equal'
}

/**
 * Find lowest price
 */
export function findLowestPrice(prices: number[]): number {
  return Math.min(...prices)
}

/**
 * Find highest price
 */
export function findHighestPrice(prices: number[]): number {
  return Math.max(...prices)
}

/**
 * Calculate average price
 */
export function calculateAveragePrice(prices: number[]): number {
  if (prices.length === 0) return 0
  const sum = prices.reduce((acc, price) => acc + price, 0)
  return sum / prices.length
}

// ============================================
// PRICE VALIDATION
// ============================================

/**
 * Check if price is valid
 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price >= 0 && isFinite(price)
}

/**
 * Check if discount is valid
 */
export function isValidDiscount(discount: number, type: 'percentage' | 'fixed' = 'percentage'): boolean {
  if (type === 'percentage') {
    return discount >= 0 && discount <= 100
  }
  return discount >= 0
}

/**
 * Validate price range
 */
export function isValidPriceRange(min: number, max: number): boolean {
  return min >= 0 && max >= min
}

// ============================================
// PRICE ROUNDING
// ============================================

/**
 * Round to nearest
 */
export function roundToNearest(price: number, nearest: number = 1): number {
  return Math.round(price / nearest) * nearest
}

/**
 * Round up to nearest
 */
export function roundUpToNearest(price: number, nearest: number = 1): number {
  return Math.ceil(price / nearest) * nearest
}

/**
 * Round down to nearest
 */
export function roundDownToNearest(price: number, nearest: number = 1): number {
  return Math.floor(price / nearest) * nearest
}

/**
 * Round to 2 decimal places
 */
export function roundToTwoDecimals(price: number): number {
  return Math.round(price * 100) / 100
}

// ============================================
// PRICE CONSTANTS
// ============================================

export const PRICE_CONSTANTS = {
  FREE_SHIPPING_THRESHOLD: 1000,
  SHIPPING_RATE: 99,
  TAX_RATE: 18,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MIN_PRICE: 0,
  DECIMAL_PLACES: 2
} as const

// ============================================
// GST CALCULATIONS (Indian Tax)
// ============================================

/**
 * Calculate CGST (Central GST)
 */
export function calculateCGST(price: number, gstRate: number = 18): number {
  return (price * (gstRate / 2)) / 100
}

/**
 * Calculate SGST (State GST)
 */
export function calculateSGST(price: number, gstRate: number = 18): number {
  return (price * (gstRate / 2)) / 100
}

/**
 * Calculate IGST (Integrated GST)
 */
export function calculateIGST(price: number, gstRate: number = 18): number {
  return (price * gstRate) / 100
}

/**
 * Calculate total GST
 */
export function calculateTotalGST(price: number, gstRate: number = 18): {
  cgst: number
  sgst: number
  igst: number
  total: number
} {
  const totalGST = (price * gstRate) / 100
  return {
    cgst: totalGST / 2,
    sgst: totalGST / 2,
    igst: totalGST,
    total: totalGST
  }
}

// ============================================
// EMI CALCULATIONS
// ============================================

/**
 * Calculate EMI
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 12 / 100
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  return roundToTwoDecimals(emi)
}

/**
 * Calculate total interest
 */
export function calculateTotalInterest(principal: number, emi: number, tenureMonths: number): number {
  return (emi * tenureMonths) - principal
}

/**
 * Calculate total payment
 */
export function calculateTotalPayment(principal: number, emi: number, tenureMonths: number): number {
  return emi * tenureMonths
}

// ============================================
// BULK PRICING
// ============================================

export interface BulkPricingTier {
  minQuantity: number
  maxQuantity: number
  discount: number
  discountType: 'percentage' | 'fixed'
}

/**
 * Calculate bulk price
 */
export function calculateBulkPrice(
  unitPrice: number,
  quantity: number,
  tiers: BulkPricingTier[]
): number {
  const tier = tiers.find(t => quantity >= t.minQuantity && quantity <= t.maxQuantity)
  
  if (!tier) {
    return unitPrice * quantity
  }
  
  const discount = tier.discountType === 'percentage'
    ? (unitPrice * quantity * tier.discount) / 100
    : tier.discount * quantity
  
  return (unitPrice * quantity) - discount
}

/**
 * Calculate savings from bulk purchase
 */
export function calculateBulkSavings(
  unitPrice: number,
  quantity: number,
  discountedPrice: number
): number {
  return (unitPrice * quantity) - discountedPrice
}

// ============================================
// MEMBERSHIP PRICING
// ============================================

export interface MembershipTier {
  name: string
  discount: number
  minSpent?: number
}

/**
 * Calculate membership price
 */
export function calculateMembershipPrice(
  price: number,
  membershipTier: MembershipTier
): number {
  const discount = (price * membershipTier.discount) / 100
  return price - discount
}

// ============================================
// COUPON CALCULATIONS
// ============================================

export interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase?: number
  maxDiscount?: number
}

/**
 * Calculate coupon discount
 */
export function calculateCouponDiscount(
  subtotal: number,
  coupon: Coupon
): number {
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return 0
  }
  
  let discount = coupon.type === 'percentage'
    ? (subtotal * coupon.value) / 100
    : coupon.value
  
  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount)
  }
  
  return Math.min(discount, subtotal)
}

/**
 * Check if coupon is applicable
 */
export function isCouponApplicable(
  subtotal: number,
  coupon: Coupon
): boolean {
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return false
  }
  return true
}

// ============================================
// PROFIT CALCULATIONS
// ============================================

export interface ProfitAnalysis {
  revenue: number
  cost: number
  grossProfit: number
  grossMargin: number
  netProfit: number
  netMargin: number
  expenses: number
}

/**
 * Calculate profit analysis
 */
export function calculateProfitAnalysis(
  sellingPrice: number,
  costPrice: number,
  quantity: number,
  expenses: number = 0
): ProfitAnalysis {
  const revenue = sellingPrice * quantity
  const cost = costPrice * quantity
  const grossProfit = revenue - cost
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0
  const netProfit = grossProfit - expenses
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0

  return {
    revenue,
    cost,
    grossProfit,
    grossMargin,
    netProfit,
    netMargin,
    expenses
  }
}

// ============================================
// PRICE BREAKDOWN
// ============================================

export interface PriceBreakdown {
  basePrice: number
  discount: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  savings: number
}

/**
 * Calculate price breakdown
 */
export function calculatePriceBreakdown(
  basePrice: number,
  quantity: number,
  discountPercent: number = 0,
  taxRate: number = 18,
  shippingCost: number = 0
): PriceBreakdown {
  const subtotal = basePrice * quantity
  const discount = (subtotal * discountPercent) / 100
  const afterDiscount = subtotal - discount
  const tax = (afterDiscount * taxRate) / 100
  const total = afterDiscount + tax + shippingCost
  const savings = discount

  return {
    basePrice,
    discount,
    subtotal,
    tax,
    shipping: shippingCost,
    total,
    savings
  }
}

// ============================================
// PRICE COMPARISON WITH COMPETITORS
// ============================================

export interface CompetitorPrice {
  name: string
  price: number
  url?: string
}

/**
 * Compare with competitors
 */
export function compareWithCompetitors(
  ourPrice: number,
  competitors: CompetitorPrice[]
): {
  cheapest: CompetitorPrice | null
  mostExpensive: CompetitorPrice | null
  average: number
  ourRank: number
  priceDifference: Record<string, number>
} {
  if (competitors.length === 0) {
    return {
      cheapest: null,
      mostExpensive: null,
      average: 0,
      ourRank: 1,
      priceDifference: {}
    }
  }

  const allPrices = [ourPrice, ...competitors.map(c => c.price)]
  const cheapest = competitors.reduce((min, c) => c.price < min.price ? c : min, competitors[0])
  const mostExpensive = competitors.reduce((max, c) => c.price > max.price ? c : max, competitors[0])
  const average = allPrices.reduce((sum, p) => sum + p, 0) / allPrices.length
  
  const sortedPrices = [...allPrices].sort((a, b) => a - b)
  const ourRank = sortedPrices.indexOf(ourPrice) + 1

  const priceDifference: Record<string, number> = {}
  competitors.forEach(c => {
    priceDifference[c.name] = ourPrice - c.price
  })

  return {
    cheapest,
    mostExpensive,
    average,
    ourRank,
    priceDifference
  }
}

// ============================================
// PRICE HISTORY
// ============================================

export interface PriceHistoryEntry {
  date: string
  price: number
}

/**
 * Calculate price trend
 */
export function calculatePriceTrend(history: PriceHistoryEntry[]): {
  lowest: PriceHistoryEntry | null
  highest: PriceHistoryEntry | null
  average: number
  change: number
  percentageChange: number
} {
  if (history.length === 0) {
    return {
      lowest: null,
      highest: null,
      average: 0,
      change: 0,
      percentageChange: 0
    }
  }

  const lowest = history.reduce((min, h) => h.price < min.price ? h : min)
  const highest = history.reduce((max, h) => h.price > max.price ? h : max)
  const average = history.reduce((sum, h) => sum + h.price, 0) / history.length
  
  const firstPrice = history[0].price
  const lastPrice = history[history.length - 1].price
  const change = lastPrice - firstPrice
  const percentageChange = firstPrice > 0 ? (change / firstPrice) * 100 : 0

  return {
    lowest,
    highest,
    average,
    change,
    percentageChange
  }
}