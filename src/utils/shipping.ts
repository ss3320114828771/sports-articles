// ============================================
// SHIPPING TYPES
// ============================================

export interface ShippingAddress {
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

export interface ShippingRate {
  id: string
  name: string
  price: number
  estimatedDays: string
  provider: string
  description?: string
  logo?: string
  isFree?: boolean
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  states?: string[]
  cities?: string[]
  pincodes?: string[]
  rate: number
  freeShippingThreshold?: number
  estimatedDays: string
}

export interface ShippingPackage {
  id: string
  name: string
  length: number
  width: number
  height: number
  weight: number
  maxWeight: number
  price: number
}

export interface ShippingLabel {
  trackingNumber: string
  provider: string
  url: string
  cost: number
  estimatedDelivery: string
}

export interface TrackingEvent {
  date: string
  time: string
  location: string
  status: string
  description: string
  icon?: string
}

export interface TrackingInfo {
  trackingNumber: string
  provider: string
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  estimatedDelivery?: string
  deliveredAt?: string
  events: TrackingEvent[]
  recipient?: string
  address?: string
}

// ============================================
// SHIPPING CONSTANTS
// ============================================

export const SHIPPING_PROVIDERS = {
  DELHIVERY: { id: 'delhivery', name: 'Delhivery', logo: '/images/shipping/delhivery.png' },
  BLUE_DART: { id: 'bluedart', name: 'Blue Dart', logo: '/images/shipping/bluedart.png' },
  DTDC: { id: 'dtdc', name: 'DTDC', logo: '/images/shipping/dtdc.png' },
  FEDEX: { id: 'fedex', name: 'FedEx', logo: '/images/shipping/fedex.png' },
  INDIA_POST: { id: 'indiapost', name: 'India Post', logo: '/images/shipping/indiapost.png' },
  XPRESSBEES: { id: 'xpressbees', name: 'XpressBees', logo: '/images/shipping/xpressbees.png' }
} as const

export const SHIPPING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  RETURNED: 'returned'
} as const

export const SHIPPING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed: 'Delivery Failed',
  returned: 'Returned'
}

export const SHIPPING_STATUS_COLORS: Record<string, string> = {
  pending: 'yellow',
  processing: 'blue',
  picked_up: 'purple',
  in_transit: 'indigo',
  out_for_delivery: 'orange',
  delivered: 'green',
  failed: 'red',
  returned: 'gray'
}

export const SHIPPING_STATUS_ICONS: Record<string, string> = {
  pending: '⏳',
  processing: '⚙️',
  picked_up: '📦',
  in_transit: '🚚',
  out_for_delivery: '🚚',
  delivered: '✅',
  failed: '❌',
  returned: '↩️'
}

// ============================================
// SHIPPING ZONES (India)
// ============================================

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone_1',
    name: 'Local (Within City)',
    countries: ['India'],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    rate: 50,
    freeShippingThreshold: 500,
    estimatedDays: '1-2 days'
  },
  {
    id: 'zone_2',
    name: 'Metro Cities',
    countries: ['India'],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'],
    rate: 70,
    freeShippingThreshold: 800,
    estimatedDays: '2-3 days'
  },
  {
    id: 'zone_3',
    name: 'State Capital',
    countries: ['India'],
    rate: 100,
    freeShippingThreshold: 1000,
    estimatedDays: '3-5 days'
  },
  {
    id: 'zone_4',
    name: 'Other Cities',
    countries: ['India'],
    rate: 150,
    freeShippingThreshold: 1500,
    estimatedDays: '4-6 days'
  },
  {
    id: 'zone_5',
    name: 'Remote Areas',
    countries: ['India'],
    rate: 200,
    freeShippingThreshold: 2000,
    estimatedDays: '5-7 days'
  },
  {
    id: 'zone_6',
    name: 'International',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'UAE', 'Singapore'],
    rate: 1000,
    freeShippingThreshold: 10000,
    estimatedDays: '7-14 days'
  }
]

// ============================================
// SHIPPING PACKAGES
// ============================================

export const SHIPPING_PACKAGES: ShippingPackage[] = [
  {
    id: 'pkg_small',
    name: 'Small Box',
    length: 30,
    width: 20,
    height: 15,
    weight: 0.5,
    maxWeight: 1,
    price: 50
  },
  {
    id: 'pkg_medium',
    name: 'Medium Box',
    length: 40,
    width: 30,
    height: 20,
    weight: 1,
    maxWeight: 3,
    price: 80
  },
  {
    id: 'pkg_large',
    name: 'Large Box',
    length: 50,
    width: 40,
    height: 30,
    weight: 2,
    maxWeight: 5,
    price: 120
  },
  {
    id: 'pkg_extra_large',
    name: 'Extra Large Box',
    length: 60,
    width: 50,
    height: 40,
    weight: 3,
    maxWeight: 10,
    price: 200
  }
]

// ============================================
// SHIPPING CALCULATIONS
// ============================================

/**
 * Calculate shipping cost based on address and subtotal
 */
export function calculateShippingCost(
  address: Partial<ShippingAddress>,
  subtotal: number,
  weight: number = 1
): ShippingRate[] {
  const rates: ShippingRate[] = []
  
  // Find applicable zone
  const zone = SHIPPING_ZONES.find(z => 
    z.countries.includes(address.country || 'India') &&
    (!z.cities || z.cities.includes(address.city || ''))
  ) || SHIPPING_ZONES[3] // Default to other cities

  // Calculate base rate
  let baseRate = zone.rate

  // Add weight-based charges
  if (weight > 1) {
    baseRate += Math.ceil(weight - 1) * 20
  }

  // Check for free shipping
  const isFree = subtotal >= (zone.freeShippingThreshold || Infinity)

  // Standard shipping
  rates.push({
    id: 'standard',
    name: 'Standard Shipping',
    price: isFree ? 0 : baseRate,
    estimatedDays: zone.estimatedDays,
    provider: 'Delhivery',
    isFree
  })

  // Express shipping (if available)
  if (subtotal > 1000) {
    rates.push({
      id: 'express',
      name: 'Express Shipping',
      price: baseRate + 50,
      estimatedDays: '1-2 days',
      provider: 'Blue Dart',
      description: 'Guaranteed next day delivery'
    })
  }

  return rates
}

/**
 * Calculate shipping cost based on package
 */
export function calculatePackageShipping(
  pkg: ShippingPackage,
  address: Partial<ShippingAddress>
): number {
  const zone = SHIPPING_ZONES.find(z => 
    z.countries.includes(address.country || 'India')
  ) || SHIPPING_ZONES[3]

  return pkg.price + zone.rate
}

/**
 * Calculate volumetric weight
 */
export function calculateVolumetricWeight(
  length: number,
  width: number,
  height: number,
  factor: number = 5000
): number {
  return (length * width * height) / factor
}

/**
 * Calculate shipping weight (actual vs volumetric)
 */
export function calculateShippingWeight(
  actualWeight: number,
  length: number,
  width: number,
  height: number
): number {
  const volumetric = calculateVolumetricWeight(length, width, height)
  return Math.max(actualWeight, volumetric)
}

// ============================================
// SHIPPING VALIDATION
// ============================================

/**
 * Validate pincode
 */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode)
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))
}

/**
 * Validate shipping address
 */
export function validateShippingAddress(address: ShippingAddress): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!address.firstName) {
    errors.firstName = 'First name is required'
  }

  if (!address.lastName) {
    errors.lastName = 'Last name is required'
  }

  if (!address.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
    errors.email = 'Invalid email format'
  }

  if (!address.phone) {
    errors.phone = 'Phone number is required'
  } else if (!isValidPhone(address.phone)) {
    errors.phone = 'Invalid phone number'
  }

  if (!address.address) {
    errors.address = 'Address is required'
  }

  if (!address.city) {
    errors.city = 'City is required'
  }

  if (!address.state) {
    errors.state = 'State is required'
  }

  if (!address.pincode) {
    errors.pincode = 'Pincode is required'
  } else if (!isValidPincode(address.pincode)) {
    errors.pincode = 'Pincode must be 6 digits'
  }

  if (!address.country) {
    errors.country = 'Country is required'
  }

  return errors
}

// ============================================
// TRACKING FUNCTIONS
// ============================================

/**
 * Generate mock tracking events
 */
export function generateTrackingEvents(status: string): TrackingEvent[] {
  const now = new Date()
  const events: TrackingEvent[] = []

  const date = (daysAgo: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    return d
  }

  // Order placed
  events.push({
    date: date(5).toLocaleDateString(),
    time: '10:30 AM',
    location: 'Mumbai',
    status: 'Order Placed',
    description: 'Your order has been placed and is being processed',
    icon: '📦'
  })

  // Picked up
  events.push({
    date: date(4).toLocaleDateString(),
    time: '02:15 PM',
    location: 'Mumbai',
    status: 'Picked Up',
    description: 'Shipment picked up by courier partner',
    icon: '📦'
  })

  // In transit
  events.push({
    date: date(3).toLocaleDateString(),
    time: '09:45 AM',
    location: 'Pune Hub',
    status: 'In Transit',
    description: 'Shipment reached Pune hub',
    icon: '🚚'
  })

  if (status === 'delivered') {
    events.push({
      date: date(1).toLocaleDateString(),
      time: '11:20 AM',
      location: 'Mumbai',
      status: 'Out for Delivery',
      description: 'Shipment out for delivery',
      icon: '🚚'
    })

    events.push({
      date: date(0).toLocaleDateString(),
      time: '03:30 PM',
      location: 'Mumbai',
      status: 'Delivered',
      description: 'Your package has been delivered',
      icon: '✅'
    })
  }

  return events
}

/**
 * Track shipment by tracking number
 */
export async function trackShipment(trackingNumber: string): Promise<TrackingInfo> {
  // Mock API call - replace with actual tracking API
  await new Promise(resolve => setTimeout(resolve, 1000))

  const statuses: Array<'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'> = [
    'pending', 'in_transit', 'out_for_delivery', 'delivered'
  ]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    trackingNumber,
    provider: 'Delhivery',
    status: randomStatus,
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    events: generateTrackingEvents(randomStatus),
    recipient: 'John Doe',
    address: '123 Main St, Mumbai - 400001'
  }
}

// ============================================
// SHIPPING LABEL
// ============================================

/**
 * Generate shipping label
 */
export async function generateShippingLabel(
  orderId: string,
  address: ShippingAddress,
  package_: ShippingPackage
): Promise<ShippingLabel> {
  // Mock API call - replace with actual label generation
  await new Promise(resolve => setTimeout(resolve, 2000))

  const trackingNumber = `DEL${Date.now()}${Math.floor(Math.random() * 1000)}`

  return {
    trackingNumber,
    provider: 'Delhivery',
    url: `https://example.com/label/${trackingNumber}`,
    cost: package_.price,
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }
}

// ============================================
// SHIPPING FORMATTING
// ============================================

/**
 * Format shipping address
 */
export function formatShippingAddress(address: ShippingAddress): string {
  const parts = [
    `${address.firstName} ${address.lastName}`,
    address.address,
    address.apartment,
    `${address.city}, ${address.state} ${address.pincode}`,
    address.country,
    `Phone: ${address.phone}`
  ].filter(Boolean)

  return parts.join('\n')
}

/**
 * Format shipping status
 */
export function formatShippingStatus(status: string): string {
  return SHIPPING_STATUS_LABELS[status] || status
}

/**
 * Get shipping status color
 */
export function getShippingStatusColor(status: string): string {
  return SHIPPING_STATUS_COLORS[status] || 'gray'
}

/**
 * Get shipping status icon
 */
export function getShippingStatusIcon(status: string): string {
  return SHIPPING_STATUS_ICONS[status] || '📦'
}

// ============================================
// SHIPPING HELPERS
// ============================================

/**
 * Check if shipping is free
 */
export function isFreeShipping(subtotal: number, threshold: number = 1000): boolean {
  return subtotal >= threshold
}

/**
 * Calculate delivery date
 */
export function calculateDeliveryDate(shippingDays: number): string {
  const date = new Date()
  date.setDate(date.getDate() + shippingDays)
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

/**
 * Get estimated delivery range
 */
export function getEstimatedDeliveryRange(minDays: number, maxDays: number): string {
  const minDate = calculateDeliveryDate(minDays)
  const maxDate = calculateDeliveryDate(maxDays)
  return `Between ${minDate} and ${maxDate}`
}

/**
 * Calculate shipping insurance cost
 */
export function calculateShippingInsurance(subtotal: number): number {
  return subtotal * 0.005 // 0.5% of order value
}

/**
 * Calculate COD charges
 */
export function calculateCODCharges(subtotal: number): number {
  if (subtotal < 1000) return 50
  if (subtotal < 5000) return 100
  return 150
}

// ============================================
// ADDRESS AUTOCOMPLETE
// ============================================

/**
 * Mock address autocomplete
 */
export async function autocompleteAddress(query: string): Promise<ShippingAddress[]> {
  // Mock API call - replace with Google Places API or similar
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!query) return []

  return [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    }
  ]
}

// ============================================
// PINCODE SERVICEABILITY
// ============================================

/**
 * Check if pincode is serviceable
 */
export function isPincodeServiceable(pincode: string): boolean {
  // Mock check - replace with actual pincode database
  const serviceablePincodes = ['400001', '400002', '400003', '110001', '560001', '700001']
  return serviceablePincodes.includes(pincode)
}

/**
 * Get serviceable pincodes by city
 */
export function getServiceablePincodes(city: string): string[] {
  // Mock data - replace with actual database
  const pincodes: Record<string, string[]> = {
    'Mumbai': ['400001', '400002', '400003', '400004', '400005'],
    'Delhi': ['110001', '110002', '110003', '110004', '110005'],
    'Bangalore': ['560001', '560002', '560003', '560004', '560005'],
    'Chennai': ['600001', '600002', '600003', '600004', '600005'],
    'Kolkata': ['700001', '700002', '700003', '700004', '700005']
  }

  return pincodes[city] || []
}