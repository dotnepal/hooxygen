import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../../routes'
import { useScrolled } from '../../hooks/useScrolled'
import LanguageToggle from '../ui/LanguageToggle'
import Button from '../ui/Button'

// ─── Logo ──────────────────────────────────────────────────────────────────

function Logo({ transparent = false, onClick }: { transparent?: boolean; onClick?: () => void }) {
  const fills = transparent
    ? { body: 'white', bottom: 'rgba(255,255,255,0.7)', cap: 'rgba(255,255,255,0.6)', glow: 'rgba(255,255,255,0.4)' }
    : { body: 'var(--color-brand-blue)', bottom: 'var(--color-brand-dark)', cap: 'var(--color-brand-dark)', glow: 'var(--color-brand-accent)' }

  return (
    <NavLink to="/" aria-label="HO Oxygen — Home" className="flex items-center gap-2 select-none" onClick={onClick}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
        <ellipse cx="16" cy="7" rx="9" ry="4" fill={fills.body} />
        <rect x="7" y="7" width="18" height="16" fill={fills.body} />
        <ellipse cx="16" cy="23" rx="9" ry="4" fill={fills.bottom} />
        <ellipse cx="16" cy="7" rx="9" ry="4" fill={fills.glow} opacity="0.6" />
        <rect x="13" y="2" width="6" height="3" rx="1.5" fill={fills.cap} />
      </svg>
      <span className="font-display font-bold leading-none">
        <span className={transparent ? 'text-white text-xl' : 'text-brand-blue text-xl'}>HO</span>
        <span className={transparent ? 'text-white/80 text-lg' : 'text-brand-dark text-lg'}> Oxygen</span>
      </span>
    </NavLink>
  )
}

// ─── Desktop nav pill link ──────────────────────────────────────────────────

function DesktopNavLink({
  to,
  children,
  transparent,
}: {
  to: string
  children: React.ReactNode
  transparent: boolean
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'font-body font-medium text-sm rounded-full px-4 py-1.5 transition-colors duration-200',
          transparent
            ? isActive
              ? 'bg-white/20 text-white'
              : 'text-white/80 hover:bg-white/15 hover:text-white'
            : isActive
              ? 'bg-brand-blue text-white'
              : 'text-brand-dark hover:bg-brand-light hover:text-brand-blue',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

// ─── Mobile nav link (inside dropdown) ─────────────────────────────────────

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center w-full px-5 py-3 rounded-lg font-body font-medium text-base transition-colors duration-150',
          isActive
            ? 'bg-brand-light text-brand-blue font-semibold'
            : 'text-brand-dark hover:bg-brand-light/70 hover:text-brand-blue',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

// ─── Hamburger / Close icon ────────────────────────────────────────────────

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200"
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { t } = useTranslation()
  const scrolled = useScrolled(20)
  const [isOpen, setIsOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Close dropdown on ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  function closeDropdown() {
    setIsOpen(false)
    hamburgerRef.current?.focus()
  }

  const transparent = !scrolled

  return (
    <header className="relative">
      {/* ── Main bar ───────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white shadow-nav'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <Logo transparent={transparent} />

          {/* Desktop pill links */}
          <ul
            role="list"
            className="hidden md:flex items-center gap-1"
          >
            {ROUTES.filter((route) => route.path !== '/faq').map((route) => (
              <li key={route.path}>
                <DesktopNavLink to={route.path} transparent={transparent}>
                  {t(route.labelKey)}
                </DesktopNavLink>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* CTA button — desktop only */}
            <Button
              as="a"
              href="/contact"
              size="sm"
              variant={transparent ? 'white-outline' : 'primary'}
              className="hidden md:inline-flex"
            >
              {t('common.contactUs')}
            </Button>

            {/* Language toggle — visible on all sizes */}
            <LanguageToggle transparent={transparent} />

            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              type="button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-dropdown"
              onClick={() => setIsOpen((v) => !v)}
              className={[
                'md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg transition-colors',
                transparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-brand-dark hover:bg-brand-light',
              ].join(' ')}
            >
              <MenuIcon open={isOpen} />
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown panel ─────────────────────────────── */}
        <div
          id="mobile-dropdown"
          aria-label="Navigation menu"
          aria-hidden={!isOpen}
          className={[
            'md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-xl overflow-hidden',
            'transition-all duration-200 ease-out',
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none',
          ].join(' ')}
        >
          {/* Nav links */}
          <nav aria-label="Mobile navigation" className="px-3 pt-3 pb-2 flex flex-col gap-0.5">
            {ROUTES.filter((route) => route.path !== '/faq').map((route) => (
              <MobileNavLink key={route.path} to={route.path} onClick={closeDropdown}>
                {t(route.labelKey)}
              </MobileNavLink>
            ))}
          </nav>

          {/* Divider + CTA + language row */}
          <div className="border-t border-slate-100 mx-3 mt-1 mb-3 pt-3 flex items-center justify-between gap-3">
            <Button
              as="a"
              href="/contact"
              size="sm"
              variant="primary"
              className="flex-1 justify-center"
              onClick={closeDropdown}
            >
              {t('common.contactUs')}
            </Button>
            <LanguageToggle />
          </div>
        </div>
      </nav>

      {/* ── Backdrop (mobile only) ──────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={closeDropdown}
        className={[
          'fixed inset-0 z-40 bg-brand-dark/30 md:hidden transition-opacity duration-200',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />
    </header>
  )
}
