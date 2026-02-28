// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  parentId: string | null
  parentName?: string
  productCount: number
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CategoryFormData {
  name: string
  slug?: string
  description: string
  image?: string
  parentId?: string | null
  isActive?: boolean
  order?: number
}

export interface CreateCategoryRequest {
  name: string
  description: string
  image?: string
  parentId?: string | null
  isActive?: boolean
  order?: number
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CategoryFilters {
  search?: string
  parentId?: string | null
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: 'name' | 'order' | 'productCount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// ============================================
// CATEGORY HIERARCHY TYPES
// ============================================

export interface CategoryNode extends Category {
  children: CategoryNode[]
  level: number
  path: string
}

export interface CategoryTree {
  root: CategoryNode[]
  flat: Category[]
  levels: number
}

export interface CategoryPath {
  id: string
  name: string
  slug: string
  level: number
}

// ============================================
// CATEGORY RESPONSE TYPES
// ============================================

export interface CategoryResponse {
  success: boolean
  message?: string
  data?: Category | Category[]
  error?: string
  errors?: Record<string, string>
}

export interface CategoryListResponse {
  success: boolean
  message?: string
  data: Category[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface CategoryTreeResponse {
  success: boolean
  data: CategoryNode[]
}

// ============================================
// CATEGORY STATE TYPES (for Redux/Context)
// ============================================

export interface CategoryState {
  categories: Category[]
  currentCategory: Category | null
  categoryTree: CategoryNode[]
  isLoading: boolean
  error: string | null
  filters: CategoryFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

export type CategoryAction =
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_CURRENT_CATEGORY'; payload: Category | null }
  | { type: 'SET_CATEGORY_TREE'; payload: CategoryNode[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: CategoryFilters }
  | { type: 'CLEAR_CATEGORIES' }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }

// ============================================
// CATEGORY CONSTANTS
// ============================================

export const CATEGORY_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'order', label: 'Display Order' },
  { value: 'productCount', label: 'Products' },
  { value: 'createdAt', label: 'Date Added' }
] as const

export const CATEGORY_STATUS_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' }
] as const

// ============================================
// CATEGORY HELPER FUNCTIONS
// ============================================

export function isCategoryActive(category: Category): boolean {
  return category.isActive
}

export function getCategoryImageUrl(category: Category): string {
  return category.image || '/images/categories/placeholder.jpg'
}

export function getCategoryProductCount(category: Category): string {
  return `${category.productCount} ${category.productCount === 1 ? 'product' : 'products'}`
}

export function getCategoryStatus(category: Category): 'active' | 'inactive' {
  return category.isActive ? 'active' : 'inactive'
}

export function getCategoryStatusColor(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'green' : 'gray'
}

export function getCategoryStatusBadge(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'Active' : 'Inactive'
}

export function getCategoryDescription(category: Category): string {
  return category.description || 'No description available'
}

export function getCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function isParentCategory(category: Category): boolean {
  return category.parentId === null
}

export function isSubCategory(category: Category): boolean {
  return category.parentId !== null
}

// ============================================
// CATEGORY TREE FUNCTIONS
// ============================================

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>()
  const roots: CategoryNode[] = []

  // First pass: create nodes
  categories.forEach(cat => {
    categoryMap.set(cat.id, {
      ...cat,
      children: [],
      level: 0,
      path: cat.name
    })
  })

  // Second pass: build tree
  categories.forEach(cat => {
    const node = categoryMap.get(cat.id)!
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      const parent = categoryMap.get(cat.parentId)!
      node.level = parent.level + 1
      node.path = `${parent.path} > ${cat.name}`
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  // Sort roots by order
  return roots.sort((a, b) => a.order - b.order)
}

export function flattenCategoryTree(nodes: CategoryNode[]): Category[] {
  const result: Category[] = []

  function traverse(node: CategoryNode) {
    const { children, ...category } = node
    result.push(category)
    children.forEach(traverse)
  }

  nodes.forEach(traverse)
  return result
}

export function getCategoryPath(categories: Category[], targetId: string): CategoryPath[] {
  const path: CategoryPath[] = []
  let currentId: string | null = targetId

  while (currentId) {
    const category = categories.find(c => c.id === currentId)
    if (!category) break

    path.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
      level: path.length
    })

    currentId = category.parentId
  }

  return path
}

export function getChildCategories(categories: Category[], parentId: string): Category[] {
  return categories
    .filter(c => c.parentId === parentId)
    .sort((a, b) => a.order - b.order)
}

export function getParentCategory(categories: Category[], childId: string): Category | undefined {
  const child = categories.find(c => c.id === childId)
  if (!child?.parentId) return undefined
  return categories.find(c => c.id === child.parentId)
}

export function getSiblingCategories(categories: Category[], categoryId: string): Category[] {
  const category = categories.find(c => c.id === categoryId)
  if (!category) return []
  return categories
    .filter(c => c.parentId === category.parentId && c.id !== categoryId)
    .sort((a, b) => a.order - b.order)
}

export function getRootCategories(categories: Category[]): Category[] {
  return categories
    .filter(c => c.parentId === null)
    .sort((a, b) => a.order - b.order)
}

export function getLeafCategories(categories: Category[]): Category[] {
  const parentIds = new Set(categories.map(c => c.parentId).filter(Boolean))
  return categories.filter(c => !parentIds.has(c.id))
}

// ============================================
// CATEGORY SEARCH & FILTER
// ============================================

export interface CategorySearchResult {
  categories: Category[]
  total: number
  query: string
}

export function searchCategories(categories: Category[], query: string): CategorySearchResult {
  const searchTerm = query.toLowerCase()
  const filtered = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm) ||
    cat.description.toLowerCase().includes(searchTerm) ||
    cat.slug.includes(searchTerm)
  )

  return {
    categories: filtered,
    total: filtered.length,
    query
  }
}

export function filterCategories(
  categories: Category[],
  filters: CategoryFilters
): Category[] {
  let filtered = [...categories]

  if (filters.search) {
    const searchResult = searchCategories(filtered, filters.search)
    filtered = searchResult.categories
  }

  if (filters.parentId !== undefined) {
    filtered = filtered.filter(cat => cat.parentId === filters.parentId)
  }

  if (filters.isActive !== undefined) {
    filtered = filtered.filter(cat => cat.isActive === filters.isActive)
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0
      if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (filters.sortBy === 'order') {
        comparison = a.order - b.order
      } else if (filters.sortBy === 'productCount') {
        comparison = a.productCount - b.productCount
      } else if (filters.sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })
  }

  return filtered
}

// ============================================
// CATEGORY STATISTICS
// ============================================

export interface CategoryStats {
  totalCategories: number
  activeCategories: number
  parentCategories: number
  subCategories: number
  totalProducts: number
  topCategories: TopCategory[]
  categoryDistribution: CategoryDistribution[]
}

export interface TopCategory {
  id: string
  name: string
  productCount: number
  image?: string
}

export interface CategoryDistribution {
  name: string
  count: number
  percentage: number
}

export function calculateCategoryStats(categories: Category[]): CategoryStats {
  const activeCategories = categories.filter(c => c.isActive)
  const parentCategories = categories.filter(c => c.parentId === null)
  const subCategories = categories.filter(c => c.parentId !== null)
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0)

  const topCategories = [...categories]
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 5)
    .map(c => ({
      id: c.id,
      name: c.name,
      productCount: c.productCount,
      image: c.image
    }))

  const categoryDistribution = parentCategories
    .map(c => ({
      name: c.name,
      count: c.productCount,
      percentage: totalProducts ? (c.productCount / totalProducts) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalCategories: categories.length,
    activeCategories: activeCategories.length,
    parentCategories: parentCategories.length,
    subCategories: subCategories.length,
    totalProducts,
    topCategories,
    categoryDistribution
  }
}

// ============================================
// CATEGORY VALIDATION
// ============================================

export interface CategoryValidationErrors {
  name?: string
  slug?: string
  description?: string
  parentId?: string
}

export function validateCategory(data: CategoryFormData): CategoryValidationErrors {
  const errors: CategoryValidationErrors = {}

  if (!data.name) {
    errors.name = 'Category name is required'
  } else if (data.name.length < 2) {
    errors.name = 'Category name must be at least 2 characters'
  } else if (data.name.length > 50) {
    errors.name = 'Category name must be less than 50 characters'
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
  }

  if (!data.description) {
    errors.description = 'Description is required'
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
  } else if (data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters'
  }

  if (data.parentId === 'self') {
    errors.parentId = 'Category cannot be its own parent'
  }

  return errors
}

// ============================================
// CATEGORY MOCK DATA
// ============================================

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Sports Equipment',
    slug: 'sports-equipment',
    description: 'All types of sports equipment',
    image: '/images/categories/sports-equipment.jpg',
    parentId: null,
    productCount: 156,
    isActive: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Football',
    slug: 'football',
    description: 'Football boots, balls, and accessories',
    image: '/images/categories/football.jpg',
    parentId: '1',
    parentName: 'Sports Equipment',
    productCount: 45,
    isActive: true,
    order: 1,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Cricket',
    slug: 'cricket',
    description: 'Cricket bats, balls, and protective gear',
    image: '/images/categories/cricket.jpg',
    parentId: '1',
    parentName: 'Sports Equipment',
    productCount: 38,
    isActive: true,
    order: 2,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
]

export const mockCategoryTree: CategoryNode[] = [
  {
    id: '1',
    name: 'Sports Equipment',
    slug: 'sports-equipment',
    description: 'All types of sports equipment',
    image: '/images/categories/sports-equipment.jpg',
    parentId: null,
    productCount: 156,
    isActive: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    children: [
      {
        id: '2',
        name: 'Football',
        slug: 'football',
        description: 'Football boots, balls, and accessories',
        image: '/images/categories/football.jpg',
        parentId: '1',
        productCount: 45,
        isActive: true,
        order: 1,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        children: [],
        level: 1,
        path: 'Sports Equipment > Football'
      },
      {
        id: '3',
        name: 'Cricket',
        slug: 'cricket',
        description: 'Cricket bats, balls, and protective gear',
        image: '/images/categories/cricket.jpg',
        parentId: '1',
        productCount: 38,
        isActive: true,
        order: 2,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
        children: [],
        level: 1,
        path: 'Sports Equipment > Cricket'
      }
    ],
    level: 0,
    path: 'Sports Equipment'
  }
]