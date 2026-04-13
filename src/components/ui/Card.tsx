import type { ElementType, ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  /** Enable the hover-lift animation (translateY -4px + deeper shadow). */
  hover?: boolean
  /** Override the root element. Defaults to `div`. */
  as?: ElementType
  className?: string
  /** If true, removes default padding so the consumer controls inner spacing. */
  flush?: boolean
}

/**
 * Card — base container with brand shadow and optional hover-lift effect.
 *
 * Usage:
 *   <Card hover>...</Card>
 *   <Card as="article" hover className="p-8">...</Card>
 *   <Card flush><img .../><div className="p-6">...</div></Card>
 */
export default function Card({
  children,
  hover = false,
  as: Tag = 'div',
  className = '',
  flush = false,
}: CardProps) {
  const base = 'bg-white rounded-card overflow-hidden'
  const shadow = 'shadow-card'
  const hoverClass = hover
    ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover cursor-pointer'
    : ''
  const padding = flush ? '' : 'p-6'

  return (
    <Tag className={`${base} ${shadow} ${hoverClass} ${padding} ${className}`}>
      {children}
    </Tag>
  )
}
