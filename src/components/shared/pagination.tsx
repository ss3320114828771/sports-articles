'use client'

import { useState, useEffect } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  showPageNumbers?: boolean
  showTotal?: boolean
  totalItems?: number
  pageSize?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'simple' | 'advanced' | 'minimal'
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  showTotal = false,
  totalItems,
  pageSize,
  size = 'md',
  variant = 'advanced',
  className = ''
}: PaginationProps) {
  const [pages, setPages] = useState<(number | string)[]>([])

  // Generate page numbers with ellipsis
  useEffect(() => {
    const generatePages = () => {
      const totalNumbers = siblingCount * 2 + 3
      const totalBlocks = totalNumbers + 2

      if (totalPages <= totalBlocks) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

      const showLeftEllipsis = leftSiblingIndex > 2
      const showRightEllipsis = rightSiblingIndex < totalPages - 1

      if (!showLeftEllipsis && showRightEllipsis) {
        const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1)
        return [...leftRange, '...', totalPages]
      }

      if (showLeftEllipsis && !showRightEllipsis) {
        const rightRange = Array.from(
          { length: 3 + 2 * siblingCount },
          (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
        )
        return [1, '...', ...rightRange]
      }

      if (showLeftEllipsis && showRightEllipsis) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        )
        return [1, '...', ...middleRange, '...', totalPages]
      }

      return []
    }

    setPages(generatePages())
  }, [currentPage, totalPages, siblingCount])

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'w-8 h-8 text-sm',
          icon: 'text-sm',
          text: 'text-xs'
        }
      case 'lg':
        return {
          button: 'w-12 h-12 text-lg',
          icon: 'text-xl',
          text: 'text-base'
        }
      default:
        return {
          button: 'w-10 h-10 text-base',
          icon: 'text-lg',
          text: 'text-sm'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'simple':
        return {
          active: 'bg-gradient-to-r from-green-400 to-blue-500 text-white',
          inactive: 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
        }
      case 'minimal':
        return {
          active: 'text-green-400 font-bold',
          inactive: 'text-gray-500 hover:text-white'
        }
      default:
        return {
          active: 'bg-gradient-to-r from-green-400 to-blue-500 text-white',
          inactive: 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
        }
    }
  }

  const variantStyles = getVariantStyles()

  // Calculate range
  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : 0
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : 0

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Total Items Info */}
      {showTotal && totalItems && (
        <div className={`text-gray-400 ${sizeClasses.text}`}>
          Showing {startItem} - {endItem} of {totalItems} items
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* First Page */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`
              ${sizeClasses.button} rounded-lg transition-all
              ${variantStyles.inactive}
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:scale-105
            `}
            aria-label="First page"
          >
            <span className={sizeClasses.icon}>⏮️</span>
          </button>
        )}

        {/* Previous Page */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              ${sizeClasses.button} rounded-lg transition-all
              ${variantStyles.inactive}
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:scale-105
            `}
            aria-label="Previous page"
          >
            <span className={sizeClasses.icon}>←</span>
          </button>
        )}

        {/* Page Numbers */}
        {showPageNumbers && pages.map((page, index) => (
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className={`${sizeClasses.button} flex items-center justify-center text-gray-500`}
            >
              ⋯
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`
                ${sizeClasses.button} rounded-lg font-semibold transition-all
                ${currentPage === page ? variantStyles.active : variantStyles.inactive}
                hover:scale-105
              `}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}

        {/* Next Page */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              ${sizeClasses.button} rounded-lg transition-all
              ${variantStyles.inactive}
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:scale-105
            `}
            aria-label="Next page"
          >
            <span className={sizeClasses.icon}>→</span>
          </button>
        )}

        {/* Last Page */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`
              ${sizeClasses.button} rounded-lg transition-all
              ${variantStyles.inactive}
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:scale-105
            `}
            aria-label="Last page"
          >
            <span className={sizeClasses.icon}>⏭️</span>
          </button>
        )}
      </div>

      {/* Mobile Page Indicator */}
      <div className="sm:hidden text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}