'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from './product-card'

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
}

interface RelatedProductsProps {
  currentProductId: string
  category?: string
  tags?: string[]
  limit?: number
  title?: string
  onAddToCart?: (id: string) => void
  onAddToWishlist?: (id: string) => void
  className?: string
}

export default function RelatedProducts({
  currentProductId,
  category,
  tags = [],
  limit = 4,
  title = 'You May Also Like',
  onAddToCart,
  onAddToWishlist,
  className = ''
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 800))

        // Mock related products based on category and tags
        const mockProducts: RelatedProduct[] = [
          {
            id: '2',
            name: 'Adidas Predator Edge',
            slug: 'adidas-predator-edge',
            price: 22999,
            comparePrice: 25999,
            image: '/images/n2.jpeg',
            category: 'Football',
            rating: 4.3,
            reviewCount: 76
          },
          {
            id: '3',
            name: 'SG Test Cricket Bat',
            slug: 'sg-test-cricket-bat',
            price: 15999,
            comparePrice: 18999,
            image: '/images/n3.jpeg',
            category: 'Cricket',
            rating: 4.8,
            reviewCount: 92
          },
          {
            id: '4',
            name: 'Adidas Cricket Helmet',
            slug: 'adidas-cricket-helmet',
            price: 4999,
            comparePrice: 5999,
            image: '/images/n4.jpeg',
            category: 'Cricket',
            rating: 4.4,
            reviewCount: 34
          },
          {
            id: '5',
            name: 'Nike Air Jordan',
            slug: 'nike-air-jordan',
            price: 18999,
            comparePrice: 21999,
            image: '/images/n5.jpeg',
            category: 'Basketball',
            rating: 4.9,
            reviewCount: 156
          },
          {
            id: '6',
            name: 'Yonex EZONE 100',
            slug: 'yonex-ezone-100',
            price: 15999,
            comparePrice: 17999,
            image: '/images/n6.jpeg',
            category: 'Tennis',
            rating: 4.6,
            reviewCount: 42
          }
        ]

        // Filter out current product and filter by category/tags
        let filtered = mockProducts.filter(p => p.id !== currentProductId)
        
        if (category) {
          // Prioritize same category products
          const sameCategory = filtered.filter(p => p.category === category)
          const otherCategory = filtered.filter(p => p.category !== category)
          filtered = [...sameCategory, ...otherCategory]
        }

        // Limit the number of products
        setProducts(filtered.slice(0, limit))
      } catch (err) {
        setError('Failed to load related products')
        console.error('Error fetching related products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, category, tags, limit])

  // Loading skeleton
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, index) => (
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
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-green-400 hover:text-green-300"
        >
          Try Again
        </button>
      </div>
    )
  }

  // No products found
  if (products.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link
          href={`/shop/products${category ? `?category=${category}` : ''}`}
          className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
        >
          View All
          <span>→</span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>

      {/* View More Button (Mobile) */}
      <div className="text-center sm:hidden">
        <Link
          href={`/shop/products${category ? `?category=${category}` : ''}`}
          className="inline-block px-6 py-2 bg-white/10 text-white rounded-lg 
                   hover:bg-white/20 transition-colors"
        >
          Browse More Products
        </Link>
      </div>
    </div>
  )
}