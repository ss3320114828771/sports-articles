// ============================================
// APP CONFIGURATION
// ============================================

export const APP = {
  NAME: 'Sports Elite',
  SHORT_NAME: 'SportsElite',
  DESCRIPTION: 'Your premier destination for quality sports equipment',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  ENV: process.env.NODE_ENV || 'development',
  VERSION: '1.0.0'
} as const

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: '/',
  
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout'
  },
  
  // Shop routes
  SHOP: {
    HOME: '/shop',
    PRODUCTS: '/shop/products',
    PRODUCT_DETAIL: (slug: string) => `/shop/products/${slug}`,
    CATEGORIES: '/shop/categories',
    CATEGORY: (slug: string) => `/shop/categories/${slug}`,
    CART: '/shop/cart',
    CHECKOUT: '/shop/checkout',
    WISHLIST: '/shop/wishlist',
    ORDERS: '/shop/orders',
    ORDER_DETAIL: (id: string) => `/shop/orders/${id}`
  },
  
  // Dashboard routes
  DASHBOARD: {
    HOME: '/dashboard',
    PRODUCTS: '/dashboard/products',
    PRODUCT_NEW: '/dashboard/products/new',
    PRODUCT_EDIT: (id: string) => `/dashboard/products/${id}/edit`,
    ORDERS: '/dashboard/orders',
    ORDER_DETAIL: (id: string) => `/dashboard/orders/${id}`,
    CUSTOMERS: '/dashboard/customers',
    CATEGORIES: '/dashboard/categories',
    BRANDS: '/dashboard/brands',
    COUPONS: '/dashboard/coupons',
    SETTINGS: '/dashboard/settings'
  },
  
  // Static pages
  ABOUT: '/about',
  CONTACT: '/contact',
  DIRECTIONS: '/directions',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  FAQ: '/faqs',
  SHIPPING: '/shipping',
  RETURNS: '/returns'
} as const

// ============================================
// API ENDPOINTS
// ============================================

export const API = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    FEATURED: '/api/products/featured',
    NEW: '/api/products/new',
    BEST_SELLERS: '/api/products/best-sellers',
    RELATED: (id: string) => `/api/products/${id}/related`,
    SEARCH: '/api/products/search'
  },
  
  CATEGORIES: {
    LIST: '/api/categories',
    DETAIL: (id: string) => `/api/categories/${id}`
  },
  
  BRANDS: {
    LIST: '/api/brands',
    DETAIL: (id: string) => `/api/brands/${id}`
  },
  
  ORDERS: {
    LIST: '/api/orders',
    DETAIL: (id: string) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    UPDATE: (id: string) => `/api/orders/${id}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    TRACK: (id: string) => `/api/orders/${id}/track`
  },
  
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart',
    UPDATE: '/api/cart',
    REMOVE: (id: string) => `/api/cart/${id}`,
    CLEAR: '/api/cart/clear',
    COUPON: '/api/cart/coupon'
  },
  
  WISHLIST: {
    GET: '/api/wishlist',
    ADD: '/api/wishlist',
    REMOVE: (id: string) => `/api/wishlist/${id}`,
    CLEAR: '/api/wishlist/clear'
  },
  
  CHECKOUT: {
    PROCESS: '/api/checkout',
    VALIDATE: '/api/checkout/validate',
    PAYMENT_METHODS: '/api/checkout/payment-methods'
  },
  
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
    ORDERS: '/api/user/orders'
  }
} as const

// ============================================
// NAVIGATION
// ============================================

export const NAVIGATION = {
  MAIN: [
    { name: 'Home', href: ROUTES.HOME, icon: '🏠' },
    { name: 'Products', href: ROUTES.SHOP.PRODUCTS, icon: '📦' },
    { name: 'Categories', href: ROUTES.SHOP.CATEGORIES, icon: '📁' },
    { name: 'About', href: ROUTES.ABOUT, icon: 'ℹ️' },
    { name: 'Contact', href: ROUTES.CONTACT, icon: '📞' }
  ],
  
  SHOP: [
    { name: 'All Products', href: ROUTES.SHOP.PRODUCTS },
    { name: 'New Arrivals', href: '/shop/new-arrivals' },
    { name: 'Best Sellers', href: '/shop/best-sellers' },
    { name: 'Deals', href: '/shop/deals' }
  ],
  
  CATEGORIES: [
    { name: 'Football', href: ROUTES.SHOP.CATEGORY('football'), icon: '⚽' },
    { name: 'Cricket', href: ROUTES.SHOP.CATEGORY('cricket'), icon: '🏏' },
    { name: 'Basketball', href: ROUTES.SHOP.CATEGORY('basketball'), icon: '🏀' },
    { name: 'Tennis', href: ROUTES.SHOP.CATEGORY('tennis'), icon: '🎾' },
    { name: 'Swimming', href: ROUTES.SHOP.CATEGORY('swimming'), icon: '🏊' },
    { name: 'Boxing', href: ROUTES.SHOP.CATEGORY('boxing'), icon: '🥊' }
  ],
  
  BRANDS: [
    { name: 'Nike', href: '/shop/brands/nike' },
    { name: 'Adidas', href: '/shop/brands/adidas' },
    { name: 'Puma', href: '/shop/brands/puma' },
    { name: 'SG', href: '/shop/brands/sg' },
    { name: 'Yonex', href: '/shop/brands/yonex' },
    { name: 'Speedo', href: '/shop/brands/speedo' }
  ],
  
  DASHBOARD: {
    ADMIN: [
      { name: 'Dashboard', href: ROUTES.DASHBOARD.HOME, icon: '📊' },
      { name: 'Products', href: ROUTES.DASHBOARD.PRODUCTS, icon: '📦' },
      { name: 'Orders', href: ROUTES.DASHBOARD.ORDERS, icon: '🛒' },
      { name: 'Customers', href: ROUTES.DASHBOARD.CUSTOMERS, icon: '👥' },
      { name: 'Categories', href: ROUTES.DASHBOARD.CATEGORIES, icon: '📁' },
      { name: 'Coupons', href: ROUTES.DASHBOARD.COUPONS, icon: '🎫' },
      { name: 'Settings', href: ROUTES.DASHBOARD.SETTINGS, icon: '⚙️' }
    ],
    CUSTOMER: [
      { name: 'Dashboard', href: ROUTES.DASHBOARD.HOME, icon: '📊' },
      { name: 'My Orders', href: ROUTES.SHOP.ORDERS, icon: '📦' },
      { name: 'Wishlist', href: ROUTES.SHOP.WISHLIST, icon: '❤️' },
      { name: 'Profile', href: '/account/profile', icon: '👤' }
    ]
  },
  
  FOOTER: {
    COMPANY: [
      { name: 'About Us', href: ROUTES.ABOUT },
      { name: 'Contact Us', href: ROUTES.CONTACT },
      { name: 'Store Location', href: ROUTES.DIRECTIONS },
      { name: 'Careers', href: '/careers' }
    ],
    HELP: [
      { name: 'FAQs', href: ROUTES.FAQ },
      { name: 'Shipping Info', href: ROUTES.SHIPPING },
      { name: 'Returns Policy', href: ROUTES.RETURNS },
      { name: 'Size Guide', href: '/size-guide' }
    ],
    LEGAL: [
      { name: 'Privacy Policy', href: ROUTES.PRIVACY },
      { name: 'Terms of Service', href: ROUTES.TERMS },
      { name: 'Cookie Policy', href: '/cookies' }
    ]
  }
} as const

// ============================================
// PRODUCT CONSTANTS
// ============================================

export const PRODUCT = {
  SORT_OPTIONS: [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ] as const,
  
  PER_PAGE: [12, 24, 36, 48] as const,
  DEFAULT_PER_PAGE: 12,
  
  REVIEW_SORT: [
    { value: 'newest', label: 'Newest' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' },
    { value: 'helpful', label: 'Most Helpful' }
  ] as const,
  
  STOCK_STATUS: {
    IN_STOCK: 'in_stock',
    LOW_STOCK: 'low_stock',
    OUT_OF_STOCK: 'out_of_stock',
    PRE_ORDER: 'pre_order'
  } as const
} as const

// ============================================
// ORDER CONSTANTS
// ============================================

export const ORDER = {
  STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  } as const,
  
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  } as const,
  
  PAYMENT_METHODS: {
    CARD: 'card',
    UPI: 'upi',
    NET_BANKING: 'netbanking',
    COD: 'cod',
    WALLET: 'wallet'
  } as const
} as const

// ============================================
// USER CONSTANTS
// ============================================

export const USER = {
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    CUSTOMER: 'customer'
  } as const,
  
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BLOCKED: 'blocked'
  } as const
} as const

// ============================================
// CART CONSTANTS
// ============================================

export const CART = {
  MAX_QUANTITY: 10,
  FREE_SHIPPING_THRESHOLD: 1000,
  SHIPPING_RATE: 99,
  TAX_RATE: 0.18,
  SESSION_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_ITEMS: 50
} as const

// ============================================
// COUPON CONSTANTS
// ============================================

export const COUPON = {
  TYPES: {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed',
    FREE_SHIPPING: 'free_shipping'
  } as const,
  
  APPLICABLE_TO: {
    ALL: 'all',
    CATEGORY: 'category',
    PRODUCT: 'product',
    BRAND: 'brand'
  } as const
} as const

// ============================================
// PAYMENT CONSTANTS
// ============================================

export const PAYMENT = {
  METHODS: [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
    { id: 'wallet', name: 'Wallet', icon: '👛' }
  ] as const,
  
  CURRENCY: {
    INR: 'INR',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP'
  } as const,
  
  CURRENCY_SYMBOL: {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  } as const
} as const

// ============================================
// SHIPPING CONSTANTS
// ============================================

export const SHIPPING = {
  ZONES: [
    { id: 'domestic', name: 'Domestic', rate: 99 },
    { id: 'international', name: 'International', rate: 999 }
  ] as const,
  
  PROVIDERS: [
    { id: 'delhivery', name: 'Delhivery' },
    { id: 'bluedart', name: 'Blue Dart' },
    { id: 'dtdc', name: 'DTDC' },
    { id: 'fedex', name: 'FedEx' },
    { id: 'indiapPost', name: 'India Post' }
  ] as const,
  
  ESTIMATED_DAYS: {
    domestic: '3-5',
    international: '7-14'
  } as const
} as const

// ============================================
// VALIDATION CONSTANTS
// ============================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PINCODE_REGEX: /^\d{6}$/
} as const

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMAT = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  ISO_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  MONTH_YEAR: 'MMMM YYYY',
  YEAR: 'YYYY'
} as const

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  THEME: 'theme',
  CART: 'cart',
  WISHLIST: 'wishlist',
  USER: 'user',
  TOKEN: 'token',
  RECENT_SEARCHES: 'recent_searches',
  PREFERENCES: 'preferences'
} as const

// ============================================
// COOKIE NAMES
// ============================================

export const COOKIE_NAMES = {
  SESSION: 'auth_session',
  USER: 'auth_user',
  CART: 'cart',
  THEME: 'theme'
} as const

// ============================================
// THEME CONSTANTS
// ============================================

export const THEME = {
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  } as const,
  
  COLORS: {
    PRIMARY: '#10b981',
    SECONDARY: '#3b82f6',
    SUCCESS: '#22c55e',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6'
  } as const
} as const

// ============================================
// SOCIAL LINKS
// ============================================

export const SOCIAL = {
  FACEBOOK: 'https://facebook.com/sports.elite',
  TWITTER: 'https://twitter.com/sports_elite',
  INSTAGRAM: 'https://instagram.com/sports.elite',
  YOUTUBE: 'https://youtube.com/sports-elite',
  LINKEDIN: 'https://linkedin.com/company/sports-elite'
} as const

// ============================================
// CONTACT INFO
// ============================================

export const CONTACT = {
  EMAIL: 'sajid.syed@gmail.com',
  PHONE: '+91 98765 43210',
  ADDRESS: {
    street: '123 Sports Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India'
  },
  HOURS: {
    weekday: '9:00 AM - 9:00 PM',
    weekend: '10:00 AM - 6:00 PM',
    sunday: 'Closed'
  }
} as const

// ============================================
// ADMIN INFO
// ============================================

export const ADMIN = {
  NAME: 'Hafiz Sajid Syed',
  EMAIL: 'sajid.syed@gmail.com',
  ROLE: 'super_admin'
} as const

// ============================================
// MESSAGES
// ============================================

export const MESSAGES = {
  SUCCESS: {
    ADDED_TO_CART: 'Product added to cart successfully',
    REMOVED_FROM_CART: 'Product removed from cart',
    WISHLIST_ADDED: 'Added to wishlist',
    WISHLIST_REMOVED: 'Removed from wishlist',
    ORDER_PLACED: 'Order placed successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully'
  },
  
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please login to continue',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'The requested resource was not found',
    VALIDATION: 'Please check your input and try again'
  },
  
  EMPTY: {
    CART: 'Your cart is empty',
    WISHLIST: 'Your wishlist is empty',
    ORDERS: 'No orders found',
    PRODUCTS: 'No products found',
    SEARCH: 'No results found for your search'
  }
} as const

// ============================================
// SEO
// ============================================

export const SEO = {
  DEFAULT: {
    TITLE: 'Sports Elite - Premium Sports Equipment',
    DESCRIPTION: 'Buy premium sports equipment online. Football, cricket, basketball, and more.',
    KEYWORDS: 'sports, football, cricket, basketball, sports equipment',
    OG_IMAGE: '/images/og-image.jpg'
  }
} as const

// ============================================
// ANALYTICS
// ============================================

export const ANALYTICS = {
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN
} as const

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURES = {
  WISHLIST: true,
  REVIEWS: true,
  COMPARE: false,
  NEWSLETTER: true,
  LIVE_CHAT: false
} as const