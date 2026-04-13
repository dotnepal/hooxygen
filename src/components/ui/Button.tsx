import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white-outline'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-blue text-white hover:bg-brand-dark shadow-sm hover:shadow-md',
  secondary:
    'bg-brand-light text-brand-blue hover:bg-brand-blue hover:text-white border border-brand-blue/20',
  outline:
    'border-2 border-brand-blue text-brand-blue bg-transparent hover:bg-brand-blue hover:text-white',
  ghost:
    'text-brand-blue bg-transparent hover:bg-brand-light',
  'white-outline':
    'border-2 border-white text-white bg-transparent hover:bg-white/15',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
}

const BASE =
  'inline-flex items-center justify-center gap-2 font-body font-medium min-h-[44px] min-w-[44px] transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2 cursor-pointer select-none'

// ─── Button rendered as <a> ───────────────────────────────────────────────

type LinkButtonProps = {
  as: 'a'
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>

// ─── Button rendered as <button> ─────────────────────────────────────────

type NativeButtonProps = {
  as?: 'button'
  href?: never
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

type ButtonProps = LinkButtonProps | NativeButtonProps

/**
 * Polymorphic Button component.
 *
 * Usage:
 *   <Button variant="primary" size="lg">Contact Us</Button>
 *   <Button as="a" href="/contact" variant="outline">Learn More</Button>
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`

  if (rest.as === 'a') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, ...anchorRest } = rest as LinkButtonProps
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as, ...btnRest } = rest as NativeButtonProps
  return (
    <button className={classes} {...btnRest}>
      {children}
    </button>
  )
}
