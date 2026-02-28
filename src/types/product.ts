// ============================================
// SIMPLE PRODUCT TYPES
// ============================================

export type ProductStatus = 'draft' | 'published' | 'archived'

export interface ProductImage {
  id: string
  url: string
  isPrimary: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  quantity: number
  categoryId: string
  categoryName: string
  brandId?: string
  brandName?: string
  images: ProductImage[]
  tags: string[]
  status: ProductStatus
  isFeatured: boolean
  isPublished: boolean
  views: number
  soldCount: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  sku: string
  categoryId: string
  brandId?: string
  quantity?: number
  isPublished?: boolean
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductFilters {
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'newest'
  page?: number
  limit?: number
}

export interface ProductResponse {
  success: boolean
  data?: Product | Product[]
  error?: string
}

export interface ProductListResponse {
  success: boolean
  data: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Simple helper functions
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

export function isInStock(product: Product): boolean {
  return product.quantity > 0
}

export function getMainImage(product: Product): string | undefined {
  const primary = product.images?.find(img => img.isPrimary)
  return primary?.url || product.images?.[0]?.url
}