import { useEffect, useState } from 'react'

/**
 * Returns true once the page has scrolled past `threshold` pixels.
 * Used by Navbar to show/hide the drop shadow.
 */
export function useScrolled(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      const next = window.scrollY > threshold
      setScrolled((prev) => (prev === next ? prev : next))
    }

    // Set initial value on mount (handles page load at a scrolled position)
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
