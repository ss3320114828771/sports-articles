// ============================================
// EXPORT ALL TYPES FROM ALL MODULES
// ============================================

// API Types
export * from './api'

// Brand 

// Product Types




// ============================================
// COMMON SHARED TYPES
// ============================================

export type ID = string
export type Timestamp = string
export type DateString = string
export type Currency = number
export type Percentage = number
export type Rating = 1 | 2 | 3 | 4 | 5
export type SortOrder = 'asc' | 'desc'

// ============================================
// ADDRESS TYPES
// ============================================

export interface Address {
  id?: string
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
  isDefault?: boolean
  type?: 'home' | 'work' | 'other'
}

export interface AddressFormData {
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
  isDefault?: boolean
  type?: 'home' | 'work' | 'other'
}

// ============================================
// IMAGE TYPES
// ============================================

export interface Image {
  id: string
  url: string
  alt?: string
  width?: number
  height?: number
  size?: number
  format?: string
  createdAt?: Timestamp
}

export interface UploadedImage {
  url: string
  filename: string
  size: number
  mimeType: string
}

// ============================================
// PRICE TYPES
// ============================================

export interface PriceRange {
  min: number
  max: number
}

export interface PriceInfo {
  original: number
  current: number
  discount?: number
  discountPercentage?: number
}

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationInfo
}

// ============================================
// FILTER TYPES
// ============================================

export interface DateRange {
  from?: DateString
  to?: DateString
}

export interface SearchParams {
  query?: string
  filters?: Record<string, any>
  sort?: string
  order?: SortOrder
  page?: number
  limit?: number
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

// ============================================
// SELECT OPTION TYPES
// ============================================

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  icon?: string
  description?: string
}

export interface GroupedSelectOption<T = string> {
  label: string
  options: SelectOption<T>[]
}

// ============================================
// STATUS TYPES
// ============================================

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface StatusState {
  status: Status
  message?: string
  error?: string
}

// ============================================
// THEME TYPES
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system'

export interface Theme {
  mode: ThemeMode
  primaryColor?: string
  fontSize?: 'sm' | 'md' | 'lg'
  roundedCorners?: boolean
  animations?: boolean
}

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavItem {
  name: string
  href: string
  icon?: string
  badge?: number
  disabled?: boolean
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href: string
  icon?: string
}

// ============================================
// META TYPES
// ============================================

export interface MetaData {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
}

export interface SeoData {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage?: string
}

// ============================================
// ERROR TYPES
// ============================================

export interface AppError {
  code: string
  message: string
  details?: any
  stack?: string
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

// ============================================
// CONFIG TYPES
// ============================================

export interface AppConfig {
  name: string
  url: string
  apiUrl: string
  environment: 'development' | 'staging' | 'production'
  version: string
}

export interface FeatureFlags {
  wishlist: boolean
  reviews: boolean
  compare: boolean
  newsletter: boolean
  liveChat: boolean
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string>
}

export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
  details?: any
}

// ============================================
// STORAGE TYPES
// ============================================

export interface StorageItem<T> {
  value: T
  expiresAt?: number
  createdAt: number
}

// ============================================
// EVENT TYPES
// ============================================

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

export interface PageViewEvent {
  path: string
  title?: string
  referrer?: string
}

// ============================================
// CHART TYPES
// ============================================

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  fill?: boolean
}

// ============================================
// TABLE TYPES
// ============================================

export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  filterable?: boolean
  hidden?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => React.ReactNode
}

export interface TableSort {
  column: string
  direction: SortOrder
}

export interface TableFilter {
  column: string
  value: any
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith'
}

// ============================================
// FORM TYPES
// ============================================

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: SelectOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
}

export interface FormErrors {
  [key: string]: string
}

export interface FormState {
  values: Record<string, any>
  errors: FormErrors
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// ============================================
// MODAL TYPES
// ============================================

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnClickOutside?: boolean
  showCloseButton?: boolean
}

// ============================================
// TOAST TYPES
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  title?: string
  duration?: number
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
}

// ============================================
// CONSTANTS
// ============================================

export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  limit: 10,
  sortOrder: 'asc'
}

export const STATUS_COLORS = {
  success: 'green',
  error: 'red',
  warning: 'yellow',
  info: 'blue'
} as const

export const CURRENCIES: Record<string, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error })
  }
}

export function createErrorResponse(error: string, code?: string, details?: any): ApiErrorResponse {
  return {
    success: false,
    error,
    ...(code && { code }),
    ...(details && { details })
  }
}

export function createPaginationInfo(
  total: number,
  page: number,
  limit: number
): PaginationInfo {
  const totalPages = Math.ceil(total / limit)
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  return {
    data,
    pagination: createPaginationInfo(total, page, limit)
  }
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.INR
  return `${currencyInfo.symbol}${amount.toLocaleString('en-IN')}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

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