'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * A hook that tracks media query matches
 * @param query The media query string
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [query, matches])

  return matches
}

/**
 * A hook that tracks multiple media queries
 * @param queries Object of media query labels and queries
 * @returns Object with query matches
 */
export function useMediaQueries<T extends Record<string, string>>(
  queries: T
): Record<keyof T, boolean> {
  const [matches, setMatches] = useState<Record<keyof T, boolean>>(
    Object.keys(queries).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<keyof T, boolean>)
  )

  useEffect(() => {
    const mediaQueries = Object.entries(queries).map(([key, query]) => ({
      key,
      media: window.matchMedia(query)
    }))

    // Set initial values
    setMatches(
      mediaQueries.reduce(
        (acc, { key, media }) => ({ ...acc, [key]: media.matches }),
        {} as Record<keyof T, boolean>
      )
    )

    // Create listeners
    const listeners = mediaQueries.map(({ key, media }) => {
      const listener = (event: MediaQueryListEvent) => {
        setMatches(prev => ({ ...prev, [key]: event.matches }))
      }
      media.addEventListener('change', listener)
      return { media, listener }
    })

    // Cleanup
    return () => {
      listeners.forEach(({ media, listener }) => {
        media.removeEventListener('change', listener)
      })
    }
  }, [queries])

  return matches
}

/**
 * Predefined breakpoints
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * A hook that tracks if the screen is above a breakpoint
 * @param breakpoint The breakpoint key
 * @returns Whether the screen is above the breakpoint
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`)
}

/**
 * A hook that tracks if the screen is below a breakpoint
 * @param breakpoint The breakpoint key
 * @returns Whether the screen is below the breakpoint
 */
export function useBreakpointDown(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(max-width: ${breakpoints[breakpoint]})`)
}

/**
 * A hook that tracks if the screen is between two breakpoints
 * @param min The minimum breakpoint
 * @param max The maximum breakpoint
 * @returns Whether the screen is between the breakpoints
 */
export function useBreakpointBetween(min: Breakpoint, max: Breakpoint): boolean {
  return useMediaQuery(
    `(min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]})`
  )
}

/**
 * A hook that tracks if the screen is mobile
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.md})`)
}

/**
 * A hook that tracks if the screen is tablet
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`
  )
}

/**
 * A hook that tracks if the screen is desktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`)
}

/**
 * A hook that tracks color scheme preference
 */
export function useColorSchemePreference(): 'light' | 'dark' {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  const isLight = useMediaQuery('(prefers-color-scheme: light)')
  
  if (isDark) return 'dark'
  if (isLight) return 'light'
  return 'light' // default
}

/**
 * A hook that tracks reduced motion preference
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * A hook that tracks contrast preference
 */
export function useContrastPreference(): 'no-preference' | 'more' | 'less' {
  const more = useMediaQuery('(prefers-contrast: more)')
  const less = useMediaQuery('(prefers-contrast: less)')
  
  if (more) return 'more'
  if (less) return 'less'
  return 'no-preference'
}

/**
 * A hook that tracks orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const isPortrait = useMediaQuery('(orientation: portrait)')
  return isPortrait ? 'portrait' : 'landscape'
}

/**
 * A hook that tracks if the device is touch-enabled
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)')
}

/**
 * A hook that tracks if the device has a fine pointer (mouse)
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/**
 * A hook that tracks if the device has hover capability
 */
export function useHasHover(): boolean {
  return useMediaQuery('(hover: hover)')
}

/**
 * A hook that tracks display resolution
 */
export function useResolution(): { width: number; height: number; dpr: number } {
  const [resolution, setResolution] = useState({ width: 0, height: 0, dpr: 0 })

  useEffect(() => {
    const updateResolution = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio
      })
    }

    updateResolution()
    window.addEventListener('resize', updateResolution)
    
    return () => window.removeEventListener('resize', updateResolution)
  }, [])

  return resolution
}