'use client'

import { useState } from 'react'
import ProductCard from './product-card'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isNew?: boolean
  discount?: number
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  columns?: 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
  showLoadMore?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  onAddToCart?: (id: string) => void
  onAddToWishlist?: (id: string) => void
  emptyMessage?: string
  className?: string
}

export default function ProductGrid({
  products,
  loading = false,
  columns = 4,
  gap = 'md',
  showLoadMore = false,
  onLoadMore,
  hasMore = false,
  onAddToCart,
  onAddToWishlist,
  emptyMessage = 'No products found',
  className = ''
}: ProductGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Get grid columns class
  const getGridClass = () => {
    const baseClass = 'grid'
    
    switch (columns) {
      case 2:
        return `${baseClass} grid-cols-1 sm:grid-cols-2`
      case 3:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
      case 4:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
      case 5:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`
      case 6:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-6`
      default:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
    }
  }

  // Get gap class
  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-2 sm:gap-3'
      case 'md':
        return 'gap-4 sm:gap-5 lg:gap-6'
      case 'lg':
        return 'gap-6 sm:gap-7 lg:gap-8'
      default:
        return 'gap-4 sm:gap-5 lg:gap-6'
    }
  }

  // Handle image error
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={`${getGridClass()} ${getGapClass()} ${className}`}>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-white/20"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-6 bg-white/20 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Product Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-400">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Product Grid */}
      <div className={`${getGridClass()} ${getGapClass()}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            comparePrice={product.comparePrice}
            image={product.image}
            category={product.category}
            rating={product.rating}
            reviewCount={product.reviewCount}
            isNew={product.isNew}
            discount={product.discount}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 
                     text-white rounded-lg font-semibold transition-all
                     hover:scale-105"
          >
            Load More Products
          </button>
        </div>
      )}

      {/* End of Results */}
      {showLoadMore && !hasMore && products.length > 0 && (
        <p className="text-center text-gray-500 text-sm mt-8">
          You've reached the end of the list
        </p>
      )}
    </div>
  )
}