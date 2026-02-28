'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Types
interface ProductImage {
  id: string
  url: string
  isPrimary: boolean
}

interface ProductVariant {
  id: string
  size: string
  color: string
  price: number
  stock: number
  sku: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  costPrice: number | null
  sku: string
  barcode: string | null
  quantity: number
  categoryId: string
  categoryName: string
  brandId: string | null
  brandName: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  tags: string[]
  weight: number | null
  dimensions: string | null
  material: string | null
  color: string | null
  size: string | null
  gender: string | null
  ageGroup: string | null
  isFeatured: boolean
  isPublished: boolean
  isDigital: boolean
  downloadLink: string | null
  views: number
  soldCount: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Mock data - replace with API call
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock product data
        const mockProduct: Product = {
          id: params.id as string,
          name: 'Nike Mercurial Superfly 9',
          slug: 'nike-mercurial-superfly-9',
          description: 'Elite football boots for speed and precision. The Nike Mercurial Superfly 9 delivers enhanced traction and control for explosive speed. Featuring a redesigned Air Zoom unit and grippy texture for better ball control.',
          price: 24999,
          comparePrice: 29999,
          costPrice: 18000,
          sku: 'NK-FB-001',
          barcode: '1234567890123',
          quantity: 50,
          categoryId: 'cat_1',
          categoryName: 'Football',
          brandId: 'brand_1',
          brandName: 'Nike',
          images: [
            { id: 'img_1', url: '/images/products/n1.jpeg', isPrimary: true },
            { id: 'img_2', url: '/images/products/n2.jpeg', isPrimary: false },
            { id: 'img_3', url: '/images/products/n3.jpeg', isPrimary: false }
          ],
          variants: [
            { id: 'var_1', size: 'UK 7', color: 'Black/Red', price: 24999, stock: 10, sku: 'NK-FB-001-7' },
            { id: 'var_2', size: 'UK 8', color: 'Black/Red', price: 24999, stock: 15, sku: 'NK-FB-001-8' },
            { id: 'var_3', size: 'UK 9', color: 'Black/Red', price: 24999, stock: 8, sku: 'NK-FB-001-9' },
            { id: 'var_4', size: 'UK 10', color: 'Black/Red', price: 24999, stock: 5, sku: 'NK-FB-001-10' }
          ],
          tags: ['football', 'boots', 'nike', 'mercurial'],
          weight: 0.22,
          dimensions: '30x20x15 cm',
          material: 'Synthetic',
          color: 'Black/Red',
          size: 'UK 7-12',
          gender: 'MALE',
          ageGroup: 'ADULT',
          isFeatured: true,
          isPublished: true,
          isDigital: false,
          downloadLink: null,
          views: 15420,
          soldCount: 325,
          rating: 4.5,
          reviewCount: 128,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-03-10T14:20:00Z'
        }
        
        setProduct(mockProduct)
        setSelectedImage(mockProduct.images.find(img => img.isPrimary)?.url || mockProduct.images[0]?.url || null)
      } catch (error) {
        console.error('Error fetching product')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!product?.comparePrice) return 0
    return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
  }

  // Handle publish toggle
  const handlePublishToggle = async () => {
    if (!product) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProduct({ ...product, isPublished: !product.isPublished })
      setShowPublishModal(false)
    } catch (error) {
      console.error('Error updating product')
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle delete
  const handleDeleteProduct = async () => {
    if (!product) return
    
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Navigate back to products list after delete
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error deleting product')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
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
            href="/dashboard/products"
            className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-6">
      {/* Bismillah */}
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link 
              href="/dashboard/products"
              className="text-gray-400 hover:text-white mb-2 inline-block"
            >
              ← Back to Products
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-gray-400">SKU: {product.sku}</p>
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/dashboard/products/${product.id}/edit`}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-colors"
            >
              ✏️ Edit Product
            </Link>
            <button
              onClick={() => setShowPublishModal(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                product.isPublished 
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
              }`}
            >
              {product.isPublished ? '📢 Unpublish' : '📢 Publish'}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Status</p>
            <p className={`text-lg font-semibold mt-1 ${product.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
              {product.isPublished ? 'Published' : 'Draft'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Stock</p>
            <p className={`text-lg font-semibold mt-1 ${product.quantity > 10 ? 'text-green-400' : product.quantity > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {product.quantity} units
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Sold</p>
            <p className="text-lg font-semibold mt-1 text-white">{product.soldCount}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Views</p>
            <p className="text-lg font-semibold mt-1 text-white">{product.views.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Rating</p>
            <p className="text-lg font-semibold mt-1 text-yellow-400">★ {product.rating} ({product.reviewCount})</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/20">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'details' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('variants')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'variants' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Variants ({product.variants.length})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'images' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Images ({product.images.length})
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'seo' 
                ? 'text-green-400 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SEO
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 rounded-lg p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Images */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Product Images</h3>
                
                {/* Main Image */}
                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  {selectedImage ? (
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">📷</span>
                      </div>
                      {/* Uncomment when you have actual images */}
                      {/* <Image
                        src={selectedImage}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      /> */}
                    </div>
                  ) : (
                    <span className="text-6xl">📷</span>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      className={`aspect-square bg-white/5 rounded-lg flex items-center justify-center border-2 ${
                        selectedImage === image.url ? 'border-green-400' : 'border-transparent'
                      }`}
                    >
                      <span className="text-2xl">📷</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle Column - Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-semibold">{product.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Slug</p>
                    <p className="text-white">{product.slug}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Description</p>
                    <p className="text-white">{product.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Category</p>
                      <p className="text-white">{product.categoryName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Brand</p>
                      <p className="text-white">{product.brandName || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Specs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Pricing & Specifications</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Price</p>
                      <p className="text-green-400 font-bold text-xl">{formatCurrency(product.price)}</p>
                    </div>
                    {product.comparePrice && (
                      <div>
                        <p className="text-gray-400 text-sm">Compare Price</p>
                        <p className="text-gray-400 line-through">{formatCurrency(product.comparePrice)}</p>
                        <p className="text-green-400 text-sm">{getDiscountPercentage()}% off</p>
                      </div>
                    )}
                  </div>
                  
                  {product.costPrice && (
                    <div>
                      <p className="text-gray-400 text-sm">Cost Price</p>
                      <p className="text-white">{formatCurrency(product.costPrice)}</p>
                      <p className="text-green-400 text-sm">Profit: {formatCurrency(product.price - product.costPrice)}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">SKU</p>
                      <p className="text-white font-mono">{product.sku}</p>
                    </div>
                    {product.barcode && (
                      <div>
                        <p className="text-gray-400 text-sm">Barcode</p>
                        <p className="text-white font-mono">{product.barcode}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {product.weight && (
                      <div>
                        <p className="text-gray-400 text-sm">Weight</p>
                        <p className="text-white">{product.weight} kg</p>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <p className="text-gray-400 text-sm">Dimensions</p>
                        <p className="text-white">{product.dimensions}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {product.material && (
                      <div>
                        <p className="text-gray-400 text-sm">Material</p>
                        <p className="text-white">{product.material}</p>
                      </div>
                    )}
                    {product.color && (
                      <div>
                        <p className="text-gray-400 text-sm">Color</p>
                        <p className="text-white">{product.color}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {product.gender && (
                      <div>
                        <p className="text-gray-400 text-sm">Gender</p>
                        <p className="text-white">{product.gender}</p>
                      </div>
                    )}
                    {product.ageGroup && (
                      <div>
                        <p className="text-gray-400 text-sm">Age Group</p>
                        <p className="text-white">{product.ageGroup}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product Variants</h3>
              
              {product.variants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-3 text-gray-400">SKU</th>
                        <th className="text-left p-3 text-gray-400">Size</th>
                        <th className="text-left p-3 text-gray-400">Color</th>
                        <th className="text-left p-3 text-gray-400">Price</th>
                        <th className="text-left p-3 text-gray-400">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant) => (
                        <tr key={variant.id} className="border-b border-white/10">
                          <td className="p-3 text-white font-mono">{variant.sku}</td>
                          <td className="p-3 text-white">{variant.size}</td>
                          <td className="p-3 text-white">{variant.color}</td>
                          <td className="p-3 text-green-400">{formatCurrency(variant.price)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              variant.stock > 10 ? 'bg-green-500/20 text-green-400' :
                              variant.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {variant.stock} units
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No variants available</p>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product Images</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="relative">
                    <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                    {image.isPrimary && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">SEO Information</h3>
              
              <div className="space-y-4 max-w-2xl">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Meta Title</p>
                  <p className="text-white">{product.name} - Sports Elite</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Meta Description</p>
                  <p className="text-white">{product.description.substring(0, 160)}...</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Meta Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">URL Slug</p>
                  <p className="text-white font-mono">https://sports-elite.com/products/{product.slug}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p>Created: {formatDate(product.createdAt)}</p>
          </div>
          <div>
            <p>Last Updated: {formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Product</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-bold text-red-400">{product.name}</span>?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteProduct}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-semibold"
                >
                  {isUpdating ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">{product.isPublished ? '📢' : '📝'}</div>
              <h2 className="text-xl font-bold text-white mb-2">
                {product.isPublished ? 'Unpublish Product' : 'Publish Product'}
              </h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to {product.isPublished ? 'unpublish' : 'publish'} {product.name}?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handlePublishToggle}
                  disabled={isUpdating}
                  className={`flex-1 px-4 py-2 rounded font-semibold ${
                    product.isPublished 
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                  }`}
                >
                  {isUpdating ? 'Processing...' : product.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}