import type { ReactNode } from 'react'

type PageHeroProps = {
  title: string
  subtitle?: string
  /** Optional slot for breadcrumbs, CTAs, or other content below the subtitle. */
  children?: ReactNode
  className?: string
}

/**
 * PageHero — full-width banner for inner pages (About, Products, Contact, FAQ).
 *
 * Visual design:
 *   - Deep blue gradient: brand-dark → brand-blue, with a subtle radial glow
 *   - Decorative geometric grid pattern (CSS background) for texture
 *   - Diagonal clip-path on the bottom edge to break the rectangular silhouette
 *   - Large h1 in white using Sora display font
 *   - Optional subtitle in a semi-transparent white
 *
 * Usage:
 *   <PageHero title="About HO Oxygen" subtitle="Our story and mission." />
 *   <PageHero title="Get In Touch"><Button as="a" href="tel:+977...">Call Us</Button></PageHero>
 */
export default function PageHero({
  title,
  subtitle,
  children,
  className = '',
}: PageHeroProps) {
  return (
    <section
      aria-label={`${title} — page banner`}
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand-blue) 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)',
        paddingBottom: 'clamp(3rem, 8vw, 6rem)',
      }}
    >
      {/* ── Decorative dot-grid texture ────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Radial glow — top right ────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)',
        }}
      />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-8 sm:pt-40 sm:pb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-base sm:text-lg font-body text-white/75 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
