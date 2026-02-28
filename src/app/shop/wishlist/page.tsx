'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  comparePrice: number | null
  image: string
  brand: string
  category: string
  inStock: boolean
  addedDate: string
}

export default function WishlistPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Mock wishlist data
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      productId: '1',
      name: 'Nike Mercurial Superfly 9',
      price: 24999,
      comparePrice: 29999,
      image: '/images/n1.jpeg',
      brand: 'Nike',
      category: 'Football',
      inStock: true,
      addedDate: '2024-03-15'
    },
    {
      id: '2',
      productId: '3',
      name: 'SG Test Cricket Bat',
      price: 15999,
      comparePrice: 18999,
      image: '/images/n3.jpeg',
      brand: 'SG',
      category: 'Cricket',
      inStock: true,
      addedDate: '2024-03-14'
    },
    {
      id: '3',
      productId: '5',
      name: 'Nike Air Jordan',
      price: 18999,
      comparePrice: 21999,
      image: '/images/n5.jpeg',
      brand: 'Nike',
      category: 'Basketball',
      inStock: false,
      addedDate: '2024-03-10'
    },
    {
      id: '4',
      productId: '6',
      name: 'Yonex EZONE 100',
      price: 15999,
      comparePrice: 17999,
      image: '/images/n6.jpeg',
      brand: 'Yonex',
      category: 'Tennis',
      inStock: true,
      addedDate: '2024-03-08'
    },
    {
      id: '5',
      productId: '2',
      name: 'Adidas Predator Edge',
      price: 22999,
      comparePrice: 25999,
      image: '/images/n2.jpeg',
      brand: 'Adidas',
      category: 'Football',
      inStock: true,
      addedDate: '2024-03-05'
    },
    {
      id: '6',
      productId: '4',
      name: 'Adidas Cricket Helmet',
      price: 4999,
      comparePrice: 5999,
      image: '/images/n4.jpeg',
      brand: 'Adidas',
      category: 'Cricket',
      inStock: false,
      addedDate: '2024-03-01'
    }
  ])

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(wishlistItems.map(item => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle select item
  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, itemId])
      if (selectedItems.length + 1 === wishlistItems.length) {
        setSelectAll(true)
      }
    }
  }

  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId))
    setSelectedItems(selectedItems.filter(id => id !== itemId))
    if (selectAll) {
      setSelectAll(false)
    }
  }

  // Handle remove selected
  const handleRemoveSelected = () => {
    setWishlistItems(wishlistItems.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
    setSelectAll(false)
  }

  // Handle add to cart
  const handleAddToCart = (itemId: string) => {
    // Add to cart logic here
    console.log('Added to cart:', itemId)
  }

  // Handle add all to cart
  const handleAddAllToCart = () => {
    // Add all to cart logic here
    console.log('Added all to cart')
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // Calculate discount percentage
  const getDiscountPercentage = (price: number, comparePrice: number | null) => {
    if (!comparePrice) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
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

      {/* Header */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Wishlist</h1>
              <p className="text-gray-400">{wishlistItems.length} items saved</p>
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="flex gap-3">
                {selectedItems.length > 0 && (
                  <>
                    <button
                      onClick={handleRemoveSelected}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
                    >
                      Remove Selected ({selectedItems.length})
                    </button>
                    <button
                      onClick={handleAddAllToCart}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-colors"
                    >
                      Add All to Cart
                    </button>
                  </>
                )}
                <Link
                  href="/shop/products"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Wishlist Items */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {wishlistItems.length === 0 ? (
            <div className="bg-white/10 rounded-2xl p-12 text-center">
              <div className="text-8xl mb-6">❤️</div>
              <h2 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h2>
              <p className="text-gray-400 mb-8">Save items you love to your wishlist and find them here.</p>
              <Link
                href="/shop/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="bg-white/10 rounded-xl p-4 mb-4 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 accent-green-500"
                  />
                  <span className="text-white">Select All ({wishlistItems.length} items)</span>
                </label>
                
                {selectedItems.length > 0 && (
                  <span className="text-sm text-gray-400">
                    {selectedItems.length} selected
                  </span>
                )}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white/10 rounded-xl overflow-hidden border transition-all ${
                      selectedItems.includes(item.id)
                        ? 'border-green-400 bg-green-500/5'
                        : 'border-white/20 hover:border-green-400'
                    }`}
                  >
                    <div className="relative">
                      {/* Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-5 h-5 accent-green-500"
                        />
                      </div>

                      {/* Product Image */}
                      <Link href={`/shop/products/${item.productId}`}>
                        <div className="aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                          <span className="text-6xl opacity-50">📷</span>
                        </div>
                      </Link>

                      {/* Stock Status */}
                      <div className="absolute top-3 right-3">
                        {item.inStock ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Brand & Category */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400">{item.brand}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{item.category}</span>
                      </div>

                      {/* Product Name */}
                      <Link href={`/shop/products/${item.productId}`}>
                        <h3 className="text-white font-semibold mb-2 hover:text-green-400 transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-green-400">
                          {formatPrice(item.price)}
                        </span>
                        {item.comparePrice && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(item.comparePrice)}
                            </span>
                            <span className="text-xs text-red-400">
                              -{getDiscountPercentage(item.price, item.comparePrice)}%
                            </span>
                          </>
                        )}
                      </div>

                      {/* Added Date */}
                      <p className="text-xs text-gray-500 mb-4">
                        Added on {item.addedDate}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          disabled={!item.inStock}
                          className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Remove from wishlist"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-8 bg-white/10 rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-gray-400 mb-1">Total Items: {wishlistItems.length}</p>
                    <p className="text-gray-400">Items in Stock: {wishlistItems.filter(i => i.inStock).length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatPrice(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(item => (
                <Link
                  key={item}
                  href={`/shop/products/${item}`}
                  className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all group"
                >
                  <div className="aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">📷</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Product Name</h3>
                  <p className="text-green-400 font-bold">₹24,999</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/shop/products"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">🛍️</span>
              <h3 className="text-white font-semibold mb-2">Continue Shopping</h3>
              <p className="text-gray-400 text-sm">Browse more products</p>
            </Link>

            <Link
              href="/shop/categories"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📁</span>
              <h3 className="text-white font-semibold mb-2">Browse Categories</h3>
              <p className="text-gray-400 text-sm">Shop by category</p>
            </Link>

            <Link
              href="/contact"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-all"
            >
              <span className="text-4xl mb-3 block">📞</span>
              <h3 className="text-white font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm">Contact support</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Info */}
      <footer className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            Wishlist managed by: <span className="text-yellow-400">Hafiz Sajid Syed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">sajid.syed@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}