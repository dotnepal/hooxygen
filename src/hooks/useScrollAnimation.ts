import { useEffect, useRef } from 'react'

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
  stagger = 0,
  threshold = 0,
}: {
  stagger?: number
  threshold?: number
} = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        if (stagger > 0) {
          const children = el.querySelectorAll<HTMLElement>('.animate-on-scroll')
          children.forEach((child, i) => {
            child.style.animationDelay = `${i * stagger}ms`
            child.dataset.visible = '1'
          })
        } else {
          el.dataset.visible = '1'
        }

        observer.disconnect()
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [stagger, threshold])

  return ref
}
