// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate email with detailed error message
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  return { isValid: true }
}

// ============================================
// PASSWORD VALIDATION
// ============================================

export interface PasswordRequirements {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  maxLength?: number
}

/**
 * Validate password strength
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = {}
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  const {
    minLength = 8,
    maxLength = 50,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = requirements

  if (!password) {
    errors.push('Password is required')
    return { isValid: false, errors }
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`)
  }

  if (password.length > maxLength) {
    errors.push(`Password must be less than ${maxLength} characters`)
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Check if password is strong
 */
export function isStrongPassword(password: string): boolean {
  const result = validatePassword(password)
  return result.isValid
}

// ============================================
// PHONE VALIDATION
// ============================================

/**
 * Check if phone number is valid (Indian)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^[6-9]\d{9}$/.test(cleaned)
}

/**
 * Validate phone number with detailed error
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' }
  }
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length !== 10) {
    return { isValid: false, error: 'Phone number must be 10 digits' }
  }
  
  if (!/^[6-9]/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must start with 6, 7, 8, or 9' }
  }
  
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must contain only digits' }
  }
  
  return { isValid: true }
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

// ============================================
// NAME VALIDATION
// ============================================

/**
 * Validate name
 */
export function validateName(
  name: string,
  options: { min?: number; max?: number; required?: boolean } = {}
): { isValid: boolean; error?: string } {
  const { min = 2, max = 50, required = true } = options

  if (required && !name) {
    return { isValid: false, error: 'Name is required' }
  }

  if (name && name.length < min) {
    return { isValid: false, error: `Name must be at least ${min} characters` }
  }

  if (name && name.length > max) {
    return { isValid: false, error: `Name must be less than ${max} characters` }
  }

  if (name && !/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: 'Name contains invalid characters' }
  }

  return { isValid: true }
}

// ============================================
// PINCODE VALIDATION
// ============================================

/**
 * Check if pincode is valid (Indian)
 */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode)
}

/**
 * Validate pincode
 */
export function validatePincode(pincode: string): { isValid: boolean; error?: string } {
  if (!pincode) {
    return { isValid: false, error: 'Pincode is required' }
  }
  
  if (!/^\d{6}$/.test(pincode)) {
    return { isValid: false, error: 'Pincode must be 6 digits' }
  }
  
  return { isValid: true }
}

// ============================================
// URL VALIDATION
// ============================================

/**
 * Check if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate URL
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: 'URL is required' }
  }
  
  if (!isValidUrl(url)) {
    return { isValid: false, error: 'Invalid URL format' }
  }
  
  return { isValid: true }
}

// ============================================
// DATE VALIDATION
// ============================================

/**
 * Check if date is valid
 */
export function isValidDate(date: string): boolean {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: string): boolean {
  const d = new Date(date)
  const now = new Date()
  return d > now
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: string): boolean {
  const d = new Date(date)
  const now = new Date()
  return d < now
}

/**
 * Validate date
 */
export function validateDate(date: string): { isValid: boolean; error?: string } {
  if (!date) {
    return { isValid: false, error: 'Date is required' }
  }
  
  if (!isValidDate(date)) {
    return { isValid: false, error: 'Invalid date format' }
  }
  
  return { isValid: true }
}

// ============================================
// NUMBER VALIDATION
// ============================================

/**
 * Validate number
 */
export function validateNumber(
  value: any,
  options: { min?: number; max?: number; integer?: boolean; required?: boolean } = {}
): { isValid: boolean; error?: string } {
  const { min, max, integer = false, required = true } = options

  if (required && (value === undefined || value === null || value === '')) {
    return { isValid: false, error: 'Value is required' }
  }

  if (value === undefined || value === null || value === '') {
    return { isValid: true }
  }

  const num = Number(value)

  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' }
  }

  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: 'Must be an integer' }
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `Must be at least ${min}` }
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Must be at most ${max}` }
  }

  return { isValid: true }
}

// ============================================
// PRICE VALIDATION
// ============================================

/**
 * Validate price
 */
export function validatePrice(price: any): { isValid: boolean; error?: string } {
  return validateNumber(price, { min: 0, required: true })
}

// ============================================
// QUANTITY VALIDATION
// ============================================

/**
 * Validate quantity
 */
export function validateQuantity(
  quantity: any,
  maxQuantity?: number
): { isValid: boolean; error?: string } {
  const result = validateNumber(quantity, { min: 1, integer: true, required: true })
  
  if (!result.isValid) return result

  if (maxQuantity !== undefined && Number(quantity) > maxQuantity) {
    return { isValid: false, error: `Quantity cannot exceed ${maxQuantity}` }
  }

  return { isValid: true }
}

// ============================================
// SKU VALIDATION
// ============================================

/**
 * Validate SKU
 */
export function validateSku(sku: string): { isValid: boolean; error?: string } {
  if (!sku) {
    return { isValid: false, error: 'SKU is required' }
  }
  
  if (sku.length < 3 || sku.length > 20) {
    return { isValid: false, error: 'SKU must be 3-20 characters' }
  }
  
  if (!/^[A-Z0-9-]+$/.test(sku)) {
    return { isValid: false, error: 'SKU can only contain uppercase letters, numbers, and hyphens' }
  }
  
  return { isValid: true }
}

// ============================================
// COUPON CODE VALIDATION
// ============================================

/**
 * Validate coupon code
 */
export function validateCouponCode(code: string): { isValid: boolean; error?: string } {
  if (!code) {
    return { isValid: false, error: 'Coupon code is required' }
  }
  
  if (code.length < 3 || code.length > 20) {
    return { isValid: false, error: 'Coupon code must be 3-20 characters' }
  }
  
  if (!/^[A-Z0-9]+$/.test(code)) {
    return { isValid: false, error: 'Coupon code can only contain uppercase letters and numbers' }
  }
  
  return { isValid: true }
}

// ============================================
// ADDRESS VALIDATION
// ============================================

export interface Address {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}

/**
 * Validate address
 */
export function validateAddress(address: Address): Record<string, string> {
  const errors: Record<string, string> = {}

  // Name validation
  if (address.firstName !== undefined) {
    const nameResult = validateName(address.firstName)
    if (!nameResult.isValid) errors.firstName = nameResult.error!
  }

  if (address.lastName !== undefined) {
    const nameResult = validateName(address.lastName)
    if (!nameResult.isValid) errors.lastName = nameResult.error!
  }

  // Email validation
  if (address.email !== undefined) {
    const emailResult = validateEmail(address.email)
    if (!emailResult.isValid) errors.email = emailResult.error!
  }

  // Phone validation
  if (address.phone !== undefined) {
    const phoneResult = validatePhone(address.phone)
    if (!phoneResult.isValid) errors.phone = phoneResult.error!
  }

  // Required fields
  if (address.address !== undefined && !address.address) {
    errors.address = 'Address is required'
  }

  if (address.city !== undefined && !address.city) {
    errors.city = 'City is required'
  }

  if (address.state !== undefined && !address.state) {
    errors.state = 'State is required'
  }

  // Pincode validation
  if (address.pincode !== undefined) {
    const pincodeResult = validatePincode(address.pincode)
    if (!pincodeResult.isValid) errors.pincode = pincodeResult.error!
  }

  return errors
}

// ============================================
// LOGIN VALIDATION
// ============================================

/**
 * Validate login form
 */
export function validateLogin(
  email: string,
  password: string
): Record<string, string> {
  const errors: Record<string, string> = {}

  const emailResult = validateEmail(email)
  if (!emailResult.isValid) errors.email = emailResult.error!

  if (!password) {
    errors.password = 'Password is required'
  }

  return errors
}

// ============================================
// REGISTRATION VALIDATION
// ============================================

/**
 * Validate registration form
 */
export function validateRegistration(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone?: string
): Record<string, string> {
  const errors: Record<string, string> = {}

  // Name validation
  const nameResult = validateName(name)
  if (!nameResult.isValid) errors.name = nameResult.error!

  // Email validation
  const emailResult = validateEmail(email)
  if (!emailResult.isValid) errors.email = emailResult.error!

  // Password validation
  const passwordResult = validatePassword(password)
  if (!passwordResult.isValid) {
    errors.password = passwordResult.errors[0]
  }

  // Confirm password
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  // Phone validation (optional)
  if (phone) {
    const phoneResult = validatePhone(phone)
    if (!phoneResult.isValid) errors.phone = phoneResult.error!
  }

  return errors
}

// ============================================
// PRODUCT VALIDATION
// ============================================

export interface ProductData {
  name?: string
  description?: string
  price?: any
  sku?: string
  categoryId?: string
  quantity?: any
}

/**
 * Validate product data
 */
export function validateProduct(data: ProductData): Record<string, string> {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name) {
    errors.name = 'Product name is required'
  } else if (data.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters'
  }

  // Description validation
  if (!data.description) {
    errors.description = 'Description is required'
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }

  // Price validation
  const priceResult = validatePrice(data.price)
  if (!priceResult.isValid) errors.price = priceResult.error!

  // SKU validation
  if (!data.sku) {
    errors.sku = 'SKU is required'
  }

  // Category validation
  if (!data.categoryId) {
    errors.categoryId = 'Category is required'
  }

  // Quantity validation (optional)
  if (data.quantity !== undefined) {
    const quantityResult = validateQuantity(data.quantity)
    if (!quantityResult.isValid) errors.quantity = quantityResult.error!
  }

  return errors
}

// ============================================
// CARD VALIDATION
// ============================================

/**
 * Validate card number (Luhn algorithm)
 */
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

/**
 * Validate card expiry
 */
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

/**
 * Validate CVV
 */
export function isValidCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

/**
 * Get card brand
 */
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

// ============================================
// GST VALIDATION
// ============================================

/**
 * Validate GST number (Indian)
 */
export function isValidGST(gst: string): boolean {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstRegex.test(gst)
}

// ============================================
// PAN VALIDATION
// ============================================

/**
 * Validate PAN number (Indian)
 */
export function isValidPAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

// ============================================
// AADHAAR VALIDATION
// ============================================

/**
 * Validate Aadhaar number (Indian)
 */
export function isValidAadhaar(aadhaar: string): boolean {
  const cleaned = aadhaar.replace(/\D/g, '')
  return /^\d{12}$/.test(cleaned)
}

// ============================================
// IFSC CODE VALIDATION
// ============================================

/**
 * Validate IFSC code
 */
export function isValidIFSC(ifsc: string): boolean {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  return ifscRegex.test(ifsc)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Sanitize input (remove HTML tags)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Check if string is empty
 */
export function isEmpty(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim() === ''
}

/**
 * Check if value is numeric
 */
export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value)
}