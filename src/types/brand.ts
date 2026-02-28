// ============================================
// BRAND TYPES
// ============================================

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
  productCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BrandFormData {
  name: string
  slug?: string
  logo?: string
  description?: string
  website?: string
  isActive?: boolean
}

export interface CreateBrandRequest {
  name: string
  description?: string
  logo?: string
  website?: string
  isActive?: boolean
}

export interface UpdateBrandRequest extends Partial<CreateBrandRequest> {}

export interface BrandFilters {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: 'name' | 'productCount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface BrandStats {
  totalBrands: number
  activeBrands: number
  totalProducts: number
  topBrands: TopBrand[]
}

export interface TopBrand {
  id: string
  name: string
  logo?: string
  productCount: number
}

// ============================================
// BRAND RESPONSE TYPES
// ============================================

export interface BrandResponse {
  success: boolean
  message?: string
  data?: Brand | Brand[]
  error?: string
  errors?: Record<string, string>
}

export interface BrandListResponse {
  success: boolean
  message?: string
  data: Brand[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// ============================================
// BRAND STATE TYPES (for Redux/Context)
// ============================================

export interface BrandState {
  brands: Brand[]
  currentBrand: Brand | null
  isLoading: boolean
  error: string | null
  filters: BrandFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

// ============================================
// BRAND ACTIONS
// ============================================

export interface FetchBrandsAction {
  type: 'FETCH_BRANDS'
  payload?: BrandFilters
}

export interface FetchBrandAction {
  type: 'FETCH_BRAND'
  payload: string // brand id or slug
}

export interface CreateBrandAction {
  type: 'CREATE_BRAND'
  payload: CreateBrandRequest
}

export interface UpdateBrandAction {
  type: 'UPDATE_BRAND'
  payload: {
    id: string
    data: UpdateBrandRequest
  }
}

export interface DeleteBrandAction {
  type: 'DELETE_BRAND'
  payload: string // brand id
}

// ============================================
// BRAND CONSTANTS
// ============================================

export const BRAND_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'productCount', label: 'Products' },
  { value: 'createdAt', label: 'Date Added' }
] as const

export const BRAND_STATUS_OPTIONS = [
  { value: 'all', label: 'All Brands' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' }
] as const

// ============================================
// HELPER FUNCTIONS
// ============================================

export function isBrandActive(brand: Brand): boolean {
  return brand.isActive
}

export function getBrandLogoUrl(brand: Brand): string {
  return brand.logo || '/images/brands/placeholder.png'
}

export function getBrandWebsite(brand: Brand): string | undefined {
  return brand.website
}

export function formatBrandName(brand: Brand): string {
  return brand.name
}

export function getBrandProductCount(brand: Brand): string {
  return `${brand.productCount} ${brand.productCount === 1 ? 'product' : 'products'}`
}

export function getBrandStatus(brand: Brand): 'active' | 'inactive' {
  return brand.isActive ? 'active' : 'inactive'
}

export function getBrandStatusColor(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'green' : 'gray'
}

export function getBrandStatusBadge(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'Active' : 'Inactive'
}

export function getBrandDescription(brand: Brand): string {
  return brand.description || 'No description available'
}

export function getBrandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ============================================
// BRAND VALIDATION
// ============================================

export interface BrandValidationErrors {
  name?: string
  slug?: string
  website?: string
}

export function validateBrand(data: BrandFormData): BrandValidationErrors {
  const errors: BrandValidationErrors = {}

  if (!data.name) {
    errors.name = 'Brand name is required'
  } else if (data.name.length < 2) {
    errors.name = 'Brand name must be at least 2 characters'
  } else if (data.name.length > 50) {
    errors.name = 'Brand name must be less than 50 characters'
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = 'Please enter a valid URL (including http:// or https://)'
  }

  return errors
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ============================================
// BRAND SEARCH
// ============================================

export interface BrandSearchResult {
  brands: Brand[]
  total: number
  query: string
}

export function searchBrands(brands: Brand[], query: string): BrandSearchResult {
  const searchTerm = query.toLowerCase()
  const filtered = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm) ||
    brand.description?.toLowerCase().includes(searchTerm) ||
    brand.slug.includes(searchTerm)
  )

  return {
    brands: filtered,
    total: filtered.length,
    query
  }
}

// ============================================
// BRAND SORTING
// ============================================

export type BrandSortField = 'name' | 'productCount' | 'createdAt'
export type BrandSortOrder = 'asc' | 'desc'

export function sortBrands(
  brands: Brand[],
  field: BrandSortField = 'name',
  order: BrandSortOrder = 'asc'
): Brand[] {
  return [...brands].sort((a, b) => {
    let comparison = 0

    if (field === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (field === 'productCount') {
      comparison = a.productCount - b.productCount
    } else if (field === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }

    return order === 'asc' ? comparison : -comparison
  })
}

// ============================================
// BRAND FILTERING
// ============================================

export function filterBrands(
  brands: Brand[],
  filters: BrandFilters
): Brand[] {
  let filtered = [...brands]

  if (filters.search) {
    const searchResult = searchBrands(filtered, filters.search)
    filtered = searchResult.brands
  }

  if (filters.isActive !== undefined) {
    filtered = filtered.filter(brand => brand.isActive === filters.isActive)
  }

  if (filters.sortBy) {
    filtered = sortBrands(filtered, filters.sortBy, filters.sortOrder)
  }

  return filtered
}

// ============================================
// BRAND STATISTICS
// ============================================

export function calculateBrandStats(brands: Brand[]): BrandStats {
  const activeBrands = brands.filter(b => b.isActive)
  const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0)

  const topBrands = [...brands]
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 5)
    .map(b => ({
      id: b.id,
      name: b.name,
      logo: b.logo,
      productCount: b.productCount
    }))

  return {
    totalBrands: brands.length,
    activeBrands: activeBrands.length,
    totalProducts,
    topBrands
  }
}

// ============================================
// BRAND MOCK DATA
// ============================================

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Nike',
    slug: 'nike',
    logo: '/images/brands/nike.png',
    description: 'Leading sports brand with innovative products',
    website: 'https://www.nike.com',
    productCount: 145,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Adidas',
    slug: 'adidas',
    logo: '/images/brands/adidas.png',
    description: 'German sports brand known for quality',
    website: 'https://www.adidas.com',
    productCount: 132,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Puma',
    slug: 'puma',
    logo: '/images/brands/puma.png',
    description: 'Sports lifestyle brand',
    website: 'https://www.puma.com',
    productCount: 89,
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'SG',
    slug: 'sg',
    logo: '/images/brands/sg.png',
    description: 'Cricket equipment specialist',
    website: 'https://www.sgcricket.com',
    productCount: 56,
    isActive: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Yonex',
    slug: 'yonex',
    logo: '/images/brands/yonex.png',
    description: 'Badminton and tennis expert',
    website: 'https://www.yonex.com',
    productCount: 48,
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
]