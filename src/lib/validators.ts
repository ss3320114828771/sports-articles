// ============================================
// EMAIL VALIDATION
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

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
}

export function validatePassword(
  password: string,
  requirements: PasswordRequirements = {}
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  const {
    minLength = 8,
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

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function isStrongPassword(password: string): boolean {
  const result = validatePassword(password)
  return result.isValid
}

// ============================================
// PHONE VALIDATION
// ============================================

export function isValidPhone(phone: string): boolean {
  // Indian phone numbers (10 digits, starting with 6-9)
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' }
  }
  if (!isValidPhone(phone)) {
    return { isValid: false, error: 'Invalid phone number (10 digits required)' }
  }
  return { isValid: true }
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{5})(\d{5})$/)
  if (match) {
    return `${match[1]} ${match[2]}`
  }
  return phone
}

// ============================================
// NAME VALIDATION
// ============================================

export function validateName(
  name: string,
  options: { min?: number; max?: number } = {}
): { isValid: boolean; error?: string } {
  const { min = 2, max = 50 } = options

  if (!name) {
    return { isValid: false, error: 'Name is required' }
  }
  if (name.length < min) {
    return { isValid: false, error: `Name must be at least ${min} characters` }
  }
  if (name.length > max) {
    return { isValid: false, error: `Name must be less than ${max} characters` }
  }
  if (!/^[a-zA-Z\s-']+$/.test(name)) {
    return { isValid: false, error: 'Name contains invalid characters' }
  }
  return { isValid: true }
}

// ============================================
// PINCODE VALIDATION
// ============================================

export function isValidPincode(pincode: string): boolean {
  // Indian pincode (6 digits)
  const pincodeRegex = /^\d{6}$/
  return pincodeRegex.test(pincode)
}

export function validatePincode(pincode: string): { isValid: boolean; error?: string } {
  if (!pincode) {
    return { isValid: false, error: 'Pincode is required' }
  }
  if (!isValidPincode(pincode)) {
    return { isValid: false, error: 'Pincode must be 6 digits' }
  }
  return { isValid: true }
}

// ============================================
// URL VALIDATION
// ============================================

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

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

export function isValidDate(date: string): boolean {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}

export function isFutureDate(date: string): boolean {
  const d = new Date(date)
  const now = new Date()
  return d > now
}

export function isPastDate(date: string): boolean {
  const d = new Date(date)
  const now = new Date()
  return d < now
}

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

export function validateNumber(
  value: number,
  options: { min?: number; max?: number; integer?: boolean } = {}
): { isValid: boolean; error?: string } {
  const { min, max, integer = false } = options

  if (value === undefined || value === null) {
    return { isValid: false, error: 'Value is required' }
  }

  if (isNaN(value)) {
    return { isValid: false, error: 'Must be a valid number' }
  }

  if (integer && !Number.isInteger(value)) {
    return { isValid: false, error: 'Must be an integer' }
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `Must be at least ${min}` }
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `Must be at most ${max}` }
  }

  return { isValid: true }
}

// ============================================
// PRICE VALIDATION
// ============================================

export function validatePrice(price: number): { isValid: boolean; error?: string } {
  return validateNumber(price, { min: 0, integer: false })
}

// ============================================
// QUANTITY VALIDATION
// ============================================

export function validateQuantity(
  quantity: number,
  maxQuantity?: number
): { isValid: boolean; error?: string } {
  const result = validateNumber(quantity, { min: 1, integer: true })
  if (!result.isValid) return result

  if (maxQuantity !== undefined && quantity > maxQuantity) {
    return { isValid: false, error: `Quantity cannot exceed ${maxQuantity}` }
  }

  return { isValid: true }
}

// ============================================
// SKU VALIDATION
// ============================================

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

export function validateAddress(address: Address): Record<string, string> {
  const errors: Record<string, string> = {}

  if (address.firstName !== undefined) {
    const nameResult = validateName(address.firstName)
    if (!nameResult.isValid) errors.firstName = nameResult.error!
  }

  if (address.lastName !== undefined) {
    const nameResult = validateName(address.lastName)
    if (!nameResult.isValid) errors.lastName = nameResult.error!
  }

  if (address.email !== undefined) {
    const emailResult = validateEmail(address.email)
    if (!emailResult.isValid) errors.email = emailResult.error!
  }

  if (address.phone !== undefined) {
    const phoneResult = validatePhone(address.phone)
    if (!phoneResult.isValid) errors.phone = phoneResult.error!
  }

  if (address.address !== undefined && !address.address) {
    errors.address = 'Address is required'
  }

  if (address.city !== undefined && !address.city) {
    errors.city = 'City is required'
  }

  if (address.state !== undefined && !address.state) {
    errors.state = 'State is required'
  }

  if (address.pincode !== undefined) {
    const pincodeResult = validatePincode(address.pincode)
    if (!pincodeResult.isValid) errors.pincode = pincodeResult.error!
  }

  return errors
}

// ============================================
// FORM VALIDATION
// ============================================

export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
  message?: string
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export function validateForm(
  data: Record<string, any>,
  schema: ValidationSchema
): Record<string, string> {
  const errors: Record<string, string> = {}

  Object.keys(schema).forEach(field => {
    const rules = schema[field]
    const value = data[field]

    if (rules.required && !value) {
      errors[field] = rules.message || `${field} is required`
      return
    }

    if (value) {
      if (rules.min !== undefined && value.length < rules.min) {
        errors[field] = rules.message || `${field} must be at least ${rules.min} characters`
      }

      if (rules.max !== undefined && value.length > rules.max) {
        errors[field] = rules.message || `${field} must be less than ${rules.max} characters`
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || `${field} is invalid`
      }

      if (rules.custom && !rules.custom(value)) {
        errors[field] = rules.message || `${field} is invalid`
      }
    }
  })

  return errors
}

// ============================================
// LOGIN VALIDATION
// ============================================

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

export function validateRegistration(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone?: string
): Record<string, string> {
  const errors: Record<string, string> = {}

  const nameResult = validateName(name)
  if (!nameResult.isValid) errors.name = nameResult.error!

  const emailResult = validateEmail(email)
  if (!emailResult.isValid) errors.email = emailResult.error!

  const passwordResult = validatePassword(password)
  if (!passwordResult.isValid) {
    errors.password = passwordResult.errors[0]
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (phone) {
    const phoneResult = validatePhone(phone)
    if (!phoneResult.isValid) errors.phone = phoneResult.error!
  }

  return errors
}

// ============================================
// PRODUCT VALIDATION
// ============================================

export function validateProduct(product: any): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!product.name) {
    errors.name = 'Product name is required'
  } else if (product.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters'
  }

  const priceResult = validatePrice(product.price)
  if (!priceResult.isValid) errors.price = priceResult.error!

  if (!product.sku) {
    errors.sku = 'SKU is required'
  }

  if (!product.categoryId) {
    errors.categoryId = 'Category is required'
  }

  if (product.quantity !== undefined) {
    const quantityResult = validateQuantity(product.quantity)
    if (!quantityResult.isValid) errors.quantity = quantityResult.error!
  }

  return errors
}

// ============================================
// ORDER VALIDATION
// ============================================

export function validateOrder(order: any): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!order.items || order.items.length === 0) {
    errors.items = 'Order must contain at least one item'
  }

  const priceResult = validatePrice(order.total)
  if (!priceResult.isValid) errors.total = priceResult.error!

  const addressErrors = validateAddress(order.shippingAddress || {})
  Object.assign(errors, addressErrors)

  return errors
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}