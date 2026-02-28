// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format date to DD/MM/YYYY HH:MM
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Format date to Month DD, YYYY
 */
export function formatDateLong(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format date to Month DD, YYYY at HH:MM
 */
export function formatDateTimeLong(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format date to YYYY-MM-DD (ISO format)
 */
export function formatDateISO(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) {
    return 'just now'
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`
  } else if (diffWeek < 4) {
    return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`
  } else if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`
  } else {
    return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`
  }
}

// ============================================
// DATE PARSING
// ============================================

/**
 * Parse date string to Date object
 */
export function parseDate(dateStr: string): Date | null {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Parse DD/MM/YYYY string to Date object
 */
export function parseDMY(dateStr: string): Date | null {
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  
  const d = new Date(year, month, day)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Parse YYYY-MM-DD string to Date object
 */
export function parseYMD(dateStr: string): Date | null {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

// ============================================
// DATE COMPARISON
// ============================================

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
  const d = new Date(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return d.toDateString() === yesterday.toDateString()
}

/**
 * Check if date is tomorrow
 */
export function isTomorrow(date: Date | string): boolean {
  const d = new Date(date)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return d.toDateString() === tomorrow.toDateString()
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  return new Date(date) < new Date()
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  return new Date(date) > new Date()
}

/**
 * Check if date is between two dates
 */
export function isBetween(date: Date | string, start: Date | string, end: Date | string): boolean {
  const d = new Date(date)
  const s = new Date(start)
  const e = new Date(end)
  return d >= s && d <= e
}

/**
 * Compare two dates
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareDates(a: Date | string, b: Date | string): number {
  const dateA = new Date(a).getTime()
  const dateB = new Date(b).getTime()
  if (dateA < dateB) return -1
  if (dateA > dateB) return 1
  return 0
}

// ============================================
// DATE MANIPULATION
// ============================================

/**
 * Add days to date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Add months to date
 */
export function addMonths(date: Date | string, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

/**
 * Add years to date
 */
export function addYears(date: Date | string, years: number): Date {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
  return d
}

/**
 * Get start of day (00:00:00)
 */
export function startOfDay(date: Date | string): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day (23:59:59)
 */
export function endOfDay(date: Date | string): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

/**
 * Get start of year
 */
export function startOfYear(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), 0, 1)
}

/**
 * Get end of year
 */
export function endOfYear(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999)
}

// ============================================
// DATE DIFFERENCES
// ============================================

/**
 * Get difference in days between two dates
 */
export function diffDays(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  const diffMs = Math.abs(d1 - d2)
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Get difference in hours between two dates
 */
export function diffHours(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  const diffMs = Math.abs(d1 - d2)
  return Math.floor(diffMs / (1000 * 60 * 60))
}

/**
 * Get difference in minutes between two dates
 */
export function diffMinutes(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  const diffMs = Math.abs(d1 - d2)
  return Math.floor(diffMs / (1000 * 60))
}

/**
 * Get difference in months between two dates
 */
export function diffMonths(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.abs(d1.getMonth() - d2.getMonth() + 
    12 * (d1.getFullYear() - d2.getFullYear()))
}

/**
 * Get difference in years between two dates
 */
export function diffYears(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.abs(d1.getFullYear() - d2.getFullYear())
}

// ============================================
// DATE VALIDATION
// ============================================

/**
 * Check if string is a valid date
 */
export function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr)
  return d instanceof Date && !isNaN(d.getTime())
}

/**
 * Check if year is leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/**
 * Get days in month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: Date | string): boolean {
  const d = new Date(date)
  const day = d.getDay()
  return day === 0 || day === 6
}

/**
 * Check if date is weekday
 */
export function isWeekday(date: Date | string): boolean {
  return !isWeekend(date)
}

// ============================================
// DATE RANGES
// ============================================

export interface DateRange {
  start: Date
  end: Date
}

/**
 * Get current week range
 */
export function getCurrentWeek(): DateRange {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start: startOfDay(start), end: endOfDay(end) }
}

/**
 * Get current month range
 */
export function getCurrentMonth(): DateRange {
  const now = new Date()
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  }
}

/**
 * Get current year range
 */
export function getCurrentYear(): DateRange {
  const now = new Date()
  return {
    start: startOfYear(now),
    end: endOfYear(now)
  }
}

/**
 * Get last 7 days range
 */
export function getLast7Days(): DateRange {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  return { start: startOfDay(start), end: endOfDay(end) }
}

/**
 * Get last 30 days range
 */
export function getLast30Days(): DateRange {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return { start: startOfDay(start), end: endOfDay(end) }
}

/**
 * Get last 90 days range
 */
export function getLast90Days(): DateRange {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 90)
  return { start: startOfDay(start), end: endOfDay(end) }
}

// ============================================
// DATE CONSTANTS
// ============================================

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const

export const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

// ============================================
// DATE HELPERS
// ============================================

/**
 * Get age from birthdate
 */
export function getAge(birthDate: Date | string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Get day name
 */
export function getDayName(date: Date | string, short: boolean = false): string {
  const d = new Date(date)
  const index = d.getDay()
  return short ? SHORT_DAYS[index] : DAYS_OF_WEEK[index]
}

/**
 * Get month name
 */
export function getMonthName(date: Date | string, short: boolean = false): string {
  const d = new Date(date)
  const index = d.getMonth()
  return short ? SHORT_MONTHS[index] : MONTHS[index]
}

/**
 * Get quarter of year
 */
export function getQuarter(date: Date | string): number {
  const d = new Date(date)
  return Math.floor(d.getMonth() / 3) + 1
}

/**
 * Get week number of year
 */
export function getWeekNumber(date: Date | string): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7)
  const week1 = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

/**
 * Get ISO week date
 */
export function getISOWeekDate(date: Date | string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const week = getWeekNumber(d).toString().padStart(2, '0')
  const day = (d.getDay() || 7).toString()
  return `${year}-W${week}-${day}`
}