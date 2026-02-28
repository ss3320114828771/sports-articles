'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// Types
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  sku: string
  category: string
  brand: string
  images: string[]
  sizes: string[]
  colors: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  features: string[]
}

interface Review {
  id: string
  user: string
  rating: number
  date: string
  comment: string
}

export default function ProductDetailsPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [addedToCart, setAddedToCart] = useState(false)

  // Mock product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock product based on ID
        const mockProduct: Product = {
          id: params.id as string,
          name: params.id === '1' ? 'Nike Mercurial Superfly 9' :
                params.id === '2' ? 'Adidas Predator Edge' :
                params.id === '3' ? 'SG Test Cricket Bat' :
                params.id === '4' ? 'Adidas Cricket Helmet' :
                params.id === '5' ? 'Nike Air Jordan' :
                'Yonex EZONE 100',
          slug: 'product-slug',
          description: 'Experience unparalleled performance with this premium sports equipment. Designed for athletes who demand the best, this product combines cutting-edge technology with superior craftsmanship.',
          price: params.id === '1' ? 24999 :
                 params.id === '2' ? 22999 :
                 params.id === '3' ? 15999 :
                 params.id === '4' ? 4999 :
                 params.id === '5' ? 18999 :
                 15999,
          comparePrice: params.id === '1' ? 29999 :
                        params.id === '2' ? 25999 :
                        params.id === '3' ? 18999 :
                        params.id === '4' ? 5999 :
                        params.id === '5' ? 21999 :
                        17999,
          sku: params.id === '1' ? 'NK-FB-001' :
               params.id === '2' ? 'AD-FB-002' :
               params.id === '3' ? 'SG-CR-001' :
               params.id === '4' ? 'AD-CR-002' :
               params.id === '5' ? 'NK-BB-001' :
               'YN-TN-001',
          category: params.id === '1' ? 'Football' :
                    params.id === '2' ? 'Football' :
                    params.id === '3' ? 'Cricket' :
                    params.id === '4' ? 'Cricket' :
                    params.id === '5' ? 'Basketball' :
                    'Tennis',
          brand: params.id === '1' ? 'Nike' :
                 params.id === '2' ? 'Adidas' :
                 params.id === '3' ? 'SG' :
                 params.id === '4' ? 'Adidas' :
                 params.id === '5' ? 'Nike' :
                 'Yonex',
          images: ['/images/n1.jpeg', '/images/n2.jpeg', '/images/n3.jpeg', '/images/n4.jpeg'],
          sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
          colors: ['Black/Red', 'White/Blue', 'Black/Gold', 'Silver'],
          rating: 4.5,
          reviewCount: 128,
          inStock: true,
          features: [
            'Premium quality materials',
            'Professional grade performance',
            'Lightweight design',
            'Enhanced durability',
            'Comfort fit',
            '1 year warranty'
          ]
        }
        
        setProduct(mockProduct)
      } catch (error) {
        console.error('Error loading product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  // Mock reviews
  const reviews: Review[] = [
    {
      id: '1',
      user: 'John D.',
      rating: 5,
      date: '2024-02-15',
      comment: 'Excellent product! Exceeded my expectations. Highly recommended.'
    },
    {
      id: '2',
      user: 'Sarah M.',
      rating: 4,
      date: '2024-02-10',
      comment: 'Great quality, fits perfectly. Would buy again.'
    },
    {
      id: '3',
      user: 'Mike R.',
      rating: 5,
      date: '2024-02-05',
      comment: 'Best purchase I\'ve made this year. Worth every penny.'
    }
  ]

  // Handle add to cart
  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  // Handle buy now
  const handleBuyNow = () => {
    // Navigate to checkout
    window.location.href = '/shop/checkout'
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!product?.comparePrice) return 0
    return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/shop/products"
            className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Bismillah */}
      <div className="text-center py-6 bg-black/20">
        <h2 className="text-xl md:text-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      {/* Breadcrumb */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
            <span className="text-gray-600">›</span>
            <Link href="/shop/products" className="text-gray-400 hover:text-white">Products</Link>
            <span className="text-gray-600">›</span>
            <Link href={`/shop/categories/${product.category.toLowerCase()}`} className="text-gray-400 hover:text-white">{product.category}</Link>
            <span className="text-gray-600">›</span>
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="bg-white/10 rounded-2xl p-8 mb-4 flex items-center justify-center aspect-square">
                <span className="text-8xl opacity-50">📷</span>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-white/10 rounded-lg p-2 aspect-square flex items-center justify-center border-2 transition-all ${
                      selectedImage === index ? 'border-green-400' : 'border-transparent'
                    }`}
                  >
                    <span className="text-3xl">📷</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Title & Brand */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-400">Brand: <span className="text-white">{product.brand}</span></span>
                <span className="text-gray-400">SKU: <span className="text-white">{product.sku}</span></span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`text-xl ${star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-400">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-400">{formatPrice(product.price)}</span>
                  {product.comparePrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm font-semibold">
                        {getDiscountPercentage()}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedSize === size
                            ? 'border-green-400 bg-green-500/20 text-white'
                            : 'border-white/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-green-400 bg-green-500/20 text-white'
                            : 'border-white/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20"
                  >
                    −
                  </button>
                  <span className="w-16 text-center text-white text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-400 ml-2">(Max 10)</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <p className="text-green-400">✓ In Stock</p>
                ) : (
                  <p className="text-red-400">✗ Out of Stock</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
                >
                  Buy Now
                </button>
              </div>

              {/* Added to Cart Message */}
              {addedToCart && (
                <div className="mb-6 p-3 bg-green-500/20 border border-green-500 rounded-lg">
                  <p className="text-green-400 text-center">✓ Added to cart successfully!</p>
                </div>
              )}

              {/* Key Features */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 rounded-2xl p-6">
            {/* Tab Headers */}
            <div className="flex border-b border-white/20 mb-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'description'
                    ? 'text-green-400 border-b-2 border-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'specifications'
                    ? 'text-green-400 border-b-2 border-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-green-400 border-b-2 border-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reviews ({product.reviewCount})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-300 leading-relaxed">{product.description}</p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Brand</p>
                    <p className="text-white font-semibold">{product.brand}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white font-semibold">{product.category}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">SKU</p>
                    <p className="text-white font-semibold">{product.sku}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Material</p>
                    <p className="text-white font-semibold">Premium Quality</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Warranty</p>
                    <p className="text-white font-semibold">1 Year</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Country of Origin</p>
                    <p className="text-white font-semibold">India</p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-semibold">{review.user}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(item => (
              <Link
                key={item}
                href={`/shop/products/${item}`}
                className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all text-center"
              >
                <div className="aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-4xl">📷</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Product Name</h3>
                <p className="text-green-400 font-bold">₹24,999</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Info */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Product managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}