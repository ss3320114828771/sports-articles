'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
  brand?: string
}

interface ProductSearchProps {
  onSearch?: (query: string) => void
  onResultSelect?: (result: SearchResult) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export default function ProductSearch({
  onSearch,
  onResultSelect,
  placeholder = 'Search products...',
  autoFocus = false,
  className = ''
}: ProductSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5))
    }
  }, [])

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    
    searchTimeout.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [query])

  // Perform search
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: 'Nike Mercurial Superfly 9',
          slug: 'nike-mercurial-superfly-9',
          price: 24999,
          image: '/images/n1.jpeg',
          category: 'Football',
          brand: 'Nike'
        },
        {
          id: '2',
          name: 'Adidas Predator Edge',
          slug: 'adidas-predator-edge',
          price: 22999,
          image: '/images/n2.jpeg',
          category: 'Football',
          brand: 'Adidas'
        },
        {
          id: '3',
          name: 'SG Test Cricket Bat',
          slug: 'sg-test-cricket-bat',
          price: 15999,
          image: '/images/n3.jpeg',
          category: 'Cricket',
          brand: 'SG'
        }
      ].filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      )

      setResults(mockResults)
      
      if (onSearch) {
        onSearch(searchQuery)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query)
      router.push(`/shop/products?search=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  // Handle result select
  const handleResultSelect = (result: SearchResult) => {
    saveRecentSearch(query)
    if (onResultSelect) {
      onResultSelect(result)
    } else {
      router.push(`/shop/products/${result.slug}`)
    }
    setShowResults(false)
    setQuery('')
  }

  // Save recent search
  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // Handle recent search click
  const handleRecentClick = (search: string) => {
    setQuery(search)
    performSearch(search)
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 
                   rounded-lg text-white placeholder-gray-400 
                   focus:outline-none focus:border-green-400 transition-colors"
          autoFocus={autoFocus}
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (query.length >= 2 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b 
                      from-purple-900 to-indigo-900 rounded-lg shadow-xl 
                      border border-white/20 overflow-hidden z-50">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-block w-6 h-6 border-2 border-white 
                            border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultSelect(result)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/10 
                           transition-colors text-left"
                >
                  {/* Image Placeholder */}
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 
                                to-blue-500/20 rounded-lg flex-shrink-0 
                                flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{result.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">{result.category}</span>
                      {result.brand && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400">{result.brand}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-green-400 font-semibold whitespace-nowrap">
                    {formatPrice(result.price)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-2">No products found</p>
              <p className="text-sm text-gray-500">
                Try different keywords or check spelling
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && query.length < 2 && recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(search)}
                  className="w-full flex items-center gap-2 px-3 py-2 
                           hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <span className="text-gray-400">🕒</span>
                  <span className="text-gray-300 flex-1">{search}</span>
                  <span className="text-xs text-gray-500">→</span>
                </button>
              ))}
            </div>
          )}

          {/* View All Results */}
          {results.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={handleSubmit}
                className="w-full text-center text-sm text-green-400 
                         hover:text-green-300 py-2"
              >
                View all {results.length} results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}