'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  homeLabel?: string
  homeIcon?: string
  separator?: string
  maxItems?: number
  showHome?: boolean
  className?: string
}

export default function Breadcrumbs({
  items,
  homeLabel = 'Home',
  homeIcon = '🏠',
  separator = '/',
  maxItems = 0,
  showHome = true,
  className = ''
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    
    const breadcrumbs: BreadcrumbItem[] = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/')
      
      // Format label from path
      let label = path
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
      
      // Special case for IDs (keep as is)
      if (/^[0-9a-f]{8,}$/i.test(path) || /^\d+$/.test(path)) {
        label = `#${path}`
      }

      return { label, href }
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  // Apply max items limit
  const displayedItems = maxItems > 0 && breadcrumbItems.length > maxItems
    ? [
        ...breadcrumbItems.slice(0, maxItems - 1),
        { label: '...', href: '#', icon: '⋯' }
      ]
    : breadcrumbItems

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {/* Home Link */}
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>{homeIcon}</span>
              <span className="hidden sm:inline">{homeLabel}</span>
            </Link>
            {breadcrumbItems.length > 0 && (
              <span className="mx-2 text-gray-600">{separator}</span>
            )}
          </li>
        )}

        {/* Breadcrumb Items */}
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1

          return (
            <li key={item.href + index} className="flex items-center">
              {isLast ? (
                <span className="text-white font-medium flex items-center gap-1">
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                  <span className="mx-2 text-gray-600">{separator}</span>
                </>
              )}
            </li>
          )
        })}
      </ol>

      {/* Schema.org markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.label,
              item: `https://sports-elite.com${item.href}`
            }))
          })
        }}
      />
    </nav>
  )
}