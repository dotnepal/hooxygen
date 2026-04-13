type SectionHeaderProps = {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  /** Optional eyebrow label shown above the title in brand-accent. */
  eyebrow?: string
  className?: string
}

const ALIGN_CLASSES = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

/**
 * SectionHeader — consistent heading block used across all page sections.
 *
 * Layout (when present):
 *   [eyebrow label]   ← small caps, brand-accent color
 *   [title]           ← h2, Sora display font
 *   [accent bar]      ← 3px brand-blue underline bar
 *   [subtitle]        ← body copy, brand-steel color
 *
 * Usage:
 *   <SectionHeader title="Our Gases" subtitle="Serving Nepal." align="center" />
 *   <SectionHeader eyebrow="About Us" title="Our Story" />
 */
export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  eyebrow,
  className = '',
}: SectionHeaderProps) {
  const alignClass = ALIGN_CLASSES[align]

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-body font-semibold tracking-widest uppercase text-brand-blue">
          {eyebrow}
        </span>
      )}

      <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark leading-tight">
        {title}
      </h2>

      {/* Accent bar */}
      <div
        className={`h-1 w-12 bg-brand-accent rounded-full ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''}`}
        aria-hidden="true"
      />

      {subtitle && (
        <p className="text-base sm:text-lg font-body text-brand-steel max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
