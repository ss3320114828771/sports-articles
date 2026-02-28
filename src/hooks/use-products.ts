'use client'

import { useState, useEffect, useCallback } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  category: string
  categoryId: string
  brand: string
  brandId: string
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  tags: string[]
  isNew?: boolean
  isFeatured?: boolean
  createdAt: string
  updatedAt: string
}

interface ProductsState {
  products: Product[]
  currentProduct: Product | null
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  featuredProducts: Product[]
  newArrivals: Product[]
  bestSellers: Product[]
}

interface ProductsFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  tags?: string[]
  inStock?: boolean
  isFeatured?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular'
  page?: number
  limit?: number
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    featuredProducts: [],
    newArrivals: [],
    bestSellers: []
  })

  // Fetch products with filters
  const fetchProducts = useCallback(async (filters: ProductsFilters = {}) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const queryParams = new URLSearchParams()
      
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.brand) queryParams.append('brand', filters.brand)
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString())
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.tags) queryParams.append('tags', filters.tags.join(','))
      if (filters.inStock) queryParams.append('inStock', 'true')
      if (filters.isFeatured) queryParams.append('isFeatured', 'true')
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())

      const response = await fetch(`/api/products?${queryParams.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products')
      }

      setState(prev => ({
        ...prev,
        products: data.products,
        totalCount: data.total,
        currentPage: data.page,
        totalPages: data.pages,
        isLoading: false
      }))

      return { success: true, data: data.products }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch products' }
    }
  }, [])

  // Fetch single product
  const fetchProduct = useCallback(async (productId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product')
      }

      setState(prev => ({
        ...prev,
        currentProduct: data.product,
        isLoading: false
      }))

      return { success: true, product: data.product }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch product' }
    }
  }, [])

  // Fetch product by slug
  const fetchProductBySlug = useCallback(async (slug: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/products/slug/${slug}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product')
      }

      setState(prev => ({
        ...prev,
        currentProduct: data.product,
        isLoading: false
      }))

      return { success: true, product: data.product }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false
      }))
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch product' }
    }
  }, [])

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async (limit: number = 4) => {
    try {
      const response = await fetch(`/api/products/featured?limit=${limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch featured products')
      }

      setState(prev => ({
        ...prev,
        featuredProducts: data.products
      }))

      return { success: true, products: data.products }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch featured products' 
      }
    }
  }, [])

  // Fetch new arrivals
  const fetchNewArrivals = useCallback(async (limit: number = 4) => {
    try {
      const response = await fetch(`/api/products/new?limit=${limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch new arrivals')
      }

      setState(prev => ({
        ...prev,
        newArrivals: data.products
      }))

      return { success: true, products: data.products }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch new arrivals' 
      }
    }
  }, [])

  // Fetch best sellers
  const fetchBestSellers = useCallback(async (limit: number = 4) => {
    try {
      const response = await fetch(`/api/products/best-sellers?limit=${limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch best sellers')
      }

      setState(prev => ({
        ...prev,
        bestSellers: data.products
      }))

      return { success: true, products: data.products }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch best sellers' 
      }
    }
  }, [])

  // Search products
  const searchProducts = useCallback(async (query: string, filters: ProductsFilters = {}) => {
    return fetchProducts({ ...filters, search: query })
  }, [fetchProducts])

  // Get related products
  const getRelatedProducts = useCallback(async (productId: string, category?: string, limit: number = 4) => {
    try {
      const response = await fetch(`/api/products/related/${productId}?category=${category}&limit=${limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch related products')
      }

      return { success: true, products: data.products }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch related products' 
      }
    }
  }, [])

  // Get products by category
  const getProductsByCategory = useCallback(async (categoryId: string, filters: ProductsFilters = {}) => {
    return fetchProducts({ ...filters, category: categoryId })
  }, [fetchProducts])

  // Get products by brand
  const getProductsByBrand = useCallback(async (brandId: string, filters: ProductsFilters = {}) => {
    return fetchProducts({ ...filters, brand: brandId })
  }, [fetchProducts])

  // Filter helpers
  const filterByPriceRange = useCallback((min: number, max: number) => {
    return state.products.filter(p => p.price >= min && p.price <= max)
  }, [state.products])

  const filterByRating = useCallback((minRating: number) => {
    return state.products.filter(p => p.rating >= minRating)
  }, [state.products])

  const filterByTags = useCallback((tags: string[]) => {
    return state.products.filter(p => 
      tags.some(tag => p.tags.includes(tag))
    )
  }, [state.products])

  const filterInStock = useCallback(() => {
    return state.products.filter(p => p.stock > 0)
  }, [state.products])

  // Sort helpers
  const sortByPriceAsc = useCallback(() => {
    return [...state.products].sort((a, b) => a.price - b.price)
  }, [state.products])

  const sortByPriceDesc = useCallback(() => {
    return [...state.products].sort((a, b) => b.price - a.price)
  }, [state.products])

  const sortByRating = useCallback(() => {
    return [...state.products].sort((a, b) => b.rating - a.rating)
  }, [state.products])

  const sortByNewest = useCallback(() => {
    return [...state.products].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [state.products])

  const sortByPopularity = useCallback(() => {
    return [...state.products].sort((a, b) => b.reviewCount - a.reviewCount)
  }, [state.products])

  // Pagination helpers
  const goToPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }))
    return fetchProducts({ page })
  }, [fetchProducts])

  const nextPage = useCallback(() => {
    if (state.currentPage < state.totalPages) {
      return goToPage(state.currentPage + 1)
    }
  }, [state.currentPage, state.totalPages, goToPage])

  const prevPage = useCallback(() => {
    if (state.currentPage > 1) {
      return goToPage(state.currentPage - 1)
    }
  }, [state.currentPage, goToPage])

  return {
    // State
    products: state.products,
    currentProduct: state.currentProduct,
    isLoading: state.isLoading,
    error: state.error,
    totalCount: state.totalCount,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    featuredProducts: state.featuredProducts,
    newArrivals: state.newArrivals,
    bestSellers: state.bestSellers,

    // Fetch actions
    fetchProducts,
    fetchProduct,
    fetchProductBySlug,
    fetchFeaturedProducts,
    fetchNewArrivals,
    fetchBestSellers,
    searchProducts,
    getRelatedProducts,
    getProductsByCategory,
    getProductsByBrand,

    // Filter helpers
    filterByPriceRange,
    filterByRating,
    filterByTags,
    filterInStock,

    // Sort helpers
    sortByPriceAsc,
    sortByPriceDesc,
    sortByRating,
    sortByNewest,
    sortByPopularity,

    // Pagination
    goToPage,
    nextPage,
    prevPage
  }
}