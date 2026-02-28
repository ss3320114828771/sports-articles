// ============================================
// OBJECT HELPERS
// ============================================

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}

/**
 * Remove empty values from object (null, undefined, empty string)
 */
export function removeEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => 
      v !== null && v !== undefined && v !== ''
    )
  ) as Partial<T>
}

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key]
    return acc
  }, {} as Pick<T, K>)
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && key in target) {
      output[key] = deepMerge(target[key] as any, source[key] as any)
    } else {
      output[key] = source[key] as any
    }
  }
  
  return output
}

// ============================================
// ARRAY HELPERS
// ============================================

/**
 * Group array by key
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc: Record<string, T[]>, item: T) => {
    const groupKey = String(item[key])
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {})
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

/**
 * Unique array by key
 */
export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set()
  return arr.filter(item => {
    const val = item[key]
    if (seen.has(val)) return false
    seen.add(val)
    return true
  })
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Toggle item in array (add if not exists, remove if exists)
 */
export function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item)
    ? arr.filter(i => i !== item)
    : [...arr, item]
}

// ============================================
// STRING HELPERS
// ============================================

/**
 * Generate random string
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number, ellipsis: string = '...'): string {
  if (str.length <= length) return str
  return str.slice(0, length) + ellipsis
}

/**
 * Extract numbers from string
 */
export function extractNumbers(str: string): number[] {
  return (str.match(/\d+/g) || []).map(Number)
}

/**
 * Check if string contains only numbers
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str)
}

/**
 * Check if string is valid email
 */
export function isValidEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

// ============================================
// NUMBER HELPERS
// ============================================

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * Random number between min and max (inclusive)
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Round to decimal places
 */
export function round(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN')
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

// ============================================
// FUNCTION HELPERS
// ============================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Memoize function
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map()
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Once function (only runs once)
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false
  let result: ReturnType<T>
  
  return ((...args: Parameters<T>) => {
    if (!called) {
      result = func(...args)
      called = true
    }
    return result
  }) as T
}

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Save to localStorage
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Get from localStorage
 */
export function getStorage<T>(key: string, defaultValue?: T): T | undefined {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

/**
 * Remove from localStorage
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

/**
 * Clear localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

// ============================================
// COOKIE HELPERS
// ============================================

/**
 * Set cookie
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}

/**
 * Get cookie
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === name) return value
  }
  return null
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// ============================================
// URL HELPERS
// ============================================

/**
 * Get query params from URL
 */
export function getQueryParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/**
 * Build URL with query params
 */
export function buildUrl(base: string, params: Record<string, any>): string {
  const url = new URL(base, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })
  return url.toString()
}

/**
 * Check if current path matches
 */
export function isActivePath(path: string, currentPath: string, exact: boolean = false): boolean {
  if (exact) return path === currentPath
  return currentPath.startsWith(path)
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Check if value is a valid phone number (Indian)
 */
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))
}

/**
 * Check if value is a valid pincode (Indian)
 */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode)
}

/**
 * Check if value is a valid GST number
 */
export function isValidGST(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)
}

// ============================================
// COLOR HELPERS
// ============================================

/**
 * Generate random hex color
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * Lighten color
 */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) + Math.round(2.55 * percent)
  const g = ((num >> 8) & 0x00FF) + Math.round(2.55 * percent)
  const b = (num & 0x0000FF) + Math.round(2.55 * percent)
  
  return '#' + (
    0x1000000 +
    (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 +
    (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x100 +
    (b < 255 ? (b < 1 ? 0 : b) : 255)
  ).toString(16).slice(1)
}

/**
 * Darken color
 */
export function darkenColor(hex: string, percent: number): string {
  return lightenColor(hex, -percent)
}

// ============================================
// PROMISE HELPERS
// ============================================

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry promise N times
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    await sleep(delay)
    return retry(fn, retries - 1, delay)
  }
}

/**
 * Timeout promise
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ])
}

// ============================================
// MISC HELPERS
// ============================================

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Scroll to element
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

/**
 * Detect mobile device
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detect touch device
 */
export function isTouchDevice(): boolean {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
}

/**
 * Get device type
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}