// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Format number as currency (Indian Rupee)
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/**
 * Format number as currency with decimal places
 */
export function formatCurrencyDecimal(amount: number, decimals: number = 2): string {
  return `₹${amount.toFixed(decimals).toLocaleString()}`
}

/**
 * Format number as compact currency (K, L, Cr)
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`
  }
  return `₹${amount}`
}

/**
 * Format number as words (e.g., 1500 -> 1.5K)
 */
export function formatNumberCompact(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN')
}

/**
 * Format number with decimal places
 */
export function formatDecimal(num: number, decimals: number = 2): string {
  return num.toFixed(decimals)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format number as ordinal (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

/**
 * Format file size (bytes to human readable)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// ============================================
// TEXT FORMATTING
// ============================================

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  if (!str) return ''
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  if (!str) return ''
  const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']
  
  return str.toLowerCase().split(' ').map((word, index) => {
    if (index > 0 && smallWords.includes(word)) {
      return word
    }
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join(' ')
}

/**
 * Convert string to slug (URL friendly)
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number, ellipsis: string = '...'): string {
  if (text.length <= length) return text
  return text.slice(0, length) + ellipsis
}

/**
 * Get initials from name
 */
export function getInitials(name: string, maxChars: number = 2): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, maxChars)
}

/**
 * Mask email address (e.g., j***@example.com)
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  
  const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 1)
  return `${maskedLocal}@${domain}`
}

/**
 * Mask phone number (e.g., 98765*****)
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 6) return phone
  
  const visible = cleaned.slice(0, 5)
  const masked = '*'.repeat(cleaned.length - 5)
  return visible + masked
}

/**
 * Format phone number as XXX-XXX-XXXX
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

// ============================================
// ADDRESS FORMATTING
// ============================================

/**
 * Format address as single line
 */
export function formatAddressLine(address: {
  address: string
  apartment?: string
  city: string
  state: string
  pincode: string
}): string {
  const parts = [
    address.address,
    address.apartment,
    `${address.city}, ${address.state} ${address.pincode}`
  ].filter(Boolean)
  
  return parts.join(', ')
}

/**
 * Format address as multi-line
 */
export function formatAddressMultiline(address: {
  address: string
  apartment?: string
  city: string
  state: string
  pincode: string
  country?: string
}): string {
  const lines = [
    address.address,
    address.apartment,
    `${address.city}, ${address.state} ${address.pincode}`,
    address.country
  ].filter(Boolean)
  
  return lines.join('\n')
}

// ============================================
// DURATION FORMATTING
// ============================================

/**
 * Format seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format seconds to human readable (e.g., 2h 30m)
 */
export function formatDurationHuman(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// ============================================
// LIST FORMATTING
// ============================================

/**
 * Format array as comma separated list with "and"
 */
export function formatList(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  
  const last = items.pop()
  return `${items.join(', ')}, and ${last}`
}

/**
 * Format array as bullet points
 */
export function formatBulletList(items: string[]): string {
  return items.map(item => `• ${item}`).join('\n')
}

// ============================================
// JSON FORMATTING
// ============================================

/**
 * Pretty print JSON
 */
export function formatJSON(data: any): string {
  return JSON.stringify(data, null, 2)
}

/**
 * Minify JSON
 */
export function minifyJSON(data: any): string {
  return JSON.stringify(data)
}

// ============================================
// TEMPLATE FORMATTING
// ============================================

/**
 * Replace placeholders in template string
 */
export function formatTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match
  })
}

// ============================================
// SIZE FORMATTING
// ============================================

/**
 * Format dimensions (e.g., 10 x 20 x 30 cm)
 */
export function formatDimensions(length: number, width: number, height: number, unit: string = 'cm'): string {
  return `${length} × ${width} × ${height} ${unit}`
}

/**
 * Format weight
 */
export function formatWeight(weight: number, unit: string = 'kg'): string {
  return `${weight} ${unit}`
}

// ============================================
// RATING FORMATTING
// ============================================

/**
 * Format rating with stars
 */
export function formatRating(rating: number, max: number = 5): string {
  const fullStars = '★'.repeat(Math.floor(rating))
  const halfStar = rating % 1 >= 0.5 ? '½' : ''
  const emptyStars = '☆'.repeat(max - Math.ceil(rating))
  return fullStars + halfStar + emptyStars
}

/**
 * Format rating as number with max
 */
export function formatRatingNumber(rating: number, max: number = 5): string {
  return `${rating.toFixed(1)}/${max}`
}

// ============================================
// COLOR FORMATTING
// ============================================

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// ============================================
// CONSTANTS
// ============================================

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$'
} as const

export const UNITS = {
  length: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
  weight: ['g', 'kg', 't', 'oz', 'lb'],
  volume: ['ml', 'l', 'gal'],
  area: ['sq m', 'sq ft', 'acre']
} as const

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Pad number with leading zeros
 */
export function padNumber(num: number, length: number = 2): string {
  return num.toString().padStart(length, '0')
}

/**
 * Format boolean as Yes/No
 */
export function formatBoolean(value: boolean): string {
  return value ? 'Yes' : 'No'
}

/**
 * Format boolean as On/Off
 */
export function formatToggle(value: boolean): string {
  return value ? 'On' : 'Off'
}

/**
 * Format boolean as Active/Inactive
 */
export function formatStatus(value: boolean): string {
  return value ? 'Active' : 'Inactive'
}

/**
 * Format any value to string safely
 */
export function formatValue(value: any): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/**
 * Trim and clean text
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .replace(/[^\w\s]/g, '')
}