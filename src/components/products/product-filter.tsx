'use client'

import { useState } from 'react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterSection {
  id: string
  title: string
  type: 'checkbox' | 'radio' | 'range' | 'rating'
  options?: FilterOption[]
  min?: number
  max?: number
}

interface ProductFilterProps {
  categories?: FilterOption[]
  brands?: FilterOption[]
  priceRange?: { min: number; max: number }
  onFilterChange?: (filters: any) => void
  onSortChange?: (sort: string) => void
  className?: string
}

export default function ProductFilter({
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 100000 },
  onFilterChange,
  onSortChange,
  className = ''
}: ProductFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [price, setPrice] = useState(priceRange.max)
  const [sortBy, setSortBy] = useState('popular')
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Handle brand change
  const handleBrandChange = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating)
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        brands: selectedBrands,
        rating: selectedRating,
        maxPrice: price
      })
    }
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedRating(null)
    setPrice(priceRange.max)
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    if (onSortChange) {
      onSortChange(e.target.value)
    }
  }

  return (
    <div className={`bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Filter Content */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Sort By */}
        <div>
          <h4 className="text-white font-semibold mb-3">Sort By</h4>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 
                     rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="w-4 h-4 accent-green-500"
                    />
                    <span className="text-gray-300 hover:text-white transition-colors">
                      {category.label}
                    </span>
                  </div>
                  {category.count && (
                    <span className="text-sm text-gray-500">({category.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3">Brands</h4>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      className="w-4 h-4 accent-green-500"
                    />
                    <span className="text-gray-300 hover:text-white transition-colors">
                      {brand.label}
                    </span>
                  </div>
                  {brand.count && (
                    <span className="text-sm text-gray-500">({brand.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <h4 className="text-white font-semibold mb-3">Price Range</h4>
          <div className="space-y-3">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">₹0</span>
              <span className="text-white">Max: ₹{price.toLocaleString('en-IN')}</span>
              <span className="text-gray-400">₹{priceRange.max.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="text-white font-semibold mb-3">Rating</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 accent-green-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-400 ml-1">& Up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 
                     text-white rounded-lg font-semibold hover:scale-105 
                     transition-all"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 
                     text-white rounded-lg font-semibold transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden w-full mt-4 px-4 py-2 bg-white/10 text-white 
                 rounded-lg font-semibold flex items-center justify-center gap-2"
      >
        <span>🔍</span>
        {isExpanded ? 'Hide Filters' : 'Show Filters'}
      </button>
    </div>
  )
}