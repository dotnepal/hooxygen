import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'primary' | 'outline' | 'success' | 'warning'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-brand-light text-brand-blue border border-brand-blue/20',
  outline: 'bg-transparent border-2 border-brand-blue text-brand-blue',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
}

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  /** Makes the badge interactive (adds hover state and cursor-pointer). */
  interactive?: boolean
  onClick?: () => void
  'aria-pressed'?: boolean
}

/**
 * Badge — pill-shaped label for categories, service areas, status indicators.
 *
 * Usage:
 *   <Badge variant="primary">Medical</Badge>
 *   <Badge variant="outline" interactive onClick={fn}>Ordering</Badge>
 *   <Badge variant="success">Available</Badge>
 */
export default function Badge({
  children,
  variant = 'default',
  className = '',
  interactive = false,
  onClick,
  'aria-pressed': ariaPressedProp,
}: BadgeProps) {
  const base = 'inline-flex items-center justify-center px-3 py-1 text-sm font-body font-medium rounded-full'
  const interactiveClass = interactive
    ? 'cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95 min-h-[36px]'
    : ''

  if (interactive || onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={ariaPressedProp}
        className={`${base} ${VARIANT_CLASSES[variant]} ${interactiveClass} ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <span className={`${base} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </span>
  )
}
