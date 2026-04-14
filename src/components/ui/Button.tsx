import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'


type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white-outline'

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



const BASE =
  'inline-flex items-center justify-center gap-2 font-body font-medium min-h-[44px] min-w-[44px] transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2 cursor-pointer select-none text-sm sm:text-base lg:text-lg rounded-md sm:rounded-lg lg:rounded-xl px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4'

// ─── Button rendered as <a> ───────────────────────────────────────────────


type LinkButtonProps = {
  as: 'a'
  href: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>

// ─── Button rendered as <button> ─────────────────────────────────────────


type NativeButtonProps = {
  as?: 'button'
  href?: never
  variant?: ButtonVariant
  className?: string
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>


type ButtonProps = (LinkButtonProps | NativeButtonProps) & {
  customPadding?: boolean
}

/**
 * Polymorphic Button component.
 *
 * Usage:
 *   <Button variant="primary">Contact Us</Button>
 *   <Button as="a" href="/contact" variant="outline">Learn More</Button>
 *
 * Sizing and padding should be controlled via Tailwind classes in className prop for full responsive control.
 */
export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    className = '',
    children,
    customPadding = false,
    ...rest
  } = props

  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${className}`

  if ((rest as LinkButtonProps).as === 'a') {
    // Remove customPadding from anchorRest
    const { as, customPadding: _customPadding, ...anchorRest } = rest as LinkButtonProps & { customPadding?: boolean }
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    )
  }

  // Remove customPadding from btnRest
  const { as, customPadding: _customPadding, ...btnRest } = rest as NativeButtonProps & { customPadding?: boolean }
  return (
    <button className={classes} {...btnRest}>
      {children}
    </button>
  )
}
