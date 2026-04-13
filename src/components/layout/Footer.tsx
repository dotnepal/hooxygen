import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// ─── Logo (white variant for dark background) ──────────────────────────────

function FooterLogo() {
  return (
    <Link to="/" aria-label="HO Oxygen — Home" className="flex items-center gap-2 select-none w-fit">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <ellipse cx="16" cy="7" rx="9" ry="4" fill="var(--color-brand-blue)" />
        <rect x="7" y="7" width="18" height="16" fill="var(--color-brand-blue)" />
        <ellipse cx="16" cy="23" rx="9" ry="4" fill="#1a2f4a" />
        <ellipse cx="16" cy="7" rx="9" ry="4" fill="var(--color-brand-accent)" opacity="0.6" />
        {/* valve cap */}
        <rect x="13" y="2" width="6" height="3" rx="1.5" fill="white" opacity="0.8" />
      </svg>

      <span className="font-display font-bold leading-none">
        <span className="text-brand-accent text-xl">HO</span>
        <span className="text-white text-lg">Oxygen</span>
      </span>
    </Link>
  )
}

// ─── Contact item row ───────────────────────────────────────────────────────

function ContactItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-2 text-white/70 text-sm">
      <span className="mt-0.5 shrink-0 text-brand-accent" aria-hidden="true">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  )
}

// ─── Footer link ────────────────────────────────────────────────────────────

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-white/70 hover:text-white text-sm transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  )
}

// ─── Section heading ────────────────────────────────────────────────────────

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
      {children}
    </h3>
  )
}

// ─── SVG icons ─────────────────────────────────────────────────────────────

const PhoneIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
  </svg>
)


const MapPinIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// ─── Footer ─────────────────────────────────────────────────────────────────

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="bg-brand-dark text-white"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Left: Logo + Contact details ─────────────────────────────── */}
          <div>
            <FooterLogo />
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              Reliable gas supply for medical &amp; industrial use across Nepal.
            </p>

            <div className="mt-6">
              <FooterHeading>{t('footer.contact.title')}</FooterHeading>
              <ul className="space-y-2">
                <ContactItem icon={PhoneIcon} text={t('contact.info.phoneValue')} />
                <ContactItem icon={MapPinIcon} text={t('contact.info.addressValue')} />
              </ul>
            </div>
          </div>

          {/* ── Middle: Quick links ──────────────────────────────── */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2">
              <FooterLink to="/services">{t('nav.services')}</FooterLink>
              <FooterLink to="/contact">{t('nav.contact')}</FooterLink>
              <FooterLink to="/products">{t('nav.products')}</FooterLink>
            </ul>
          </div>

          {/* ── Right: Google Map ─────────────────────────────────────────── */}
          <div>
            <FooterHeading>{t('footer.location.title')}</FooterHeading>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.969076166756!2d81.59749289363711!3d28.055968814062695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3998617a96777295%3A0x1c6f18442e6f62eb!2zSE8gT3h5Z2VuIEluZHVzdHJpZXMgUHZ0IEx0ZCDgpI_gpJou4KSTLiDgpIXgpJXgpY3gpLjgpL_gpJzgpKgg4KSH4KSo4KWN4KSh4KS44KWN4KSf4KWN4KSw4KS_4KScIOCkquCljeCksOCkvi4g4KSy4KS_Lg!5e0!3m2!1sen!2sus!4v1774774756092!5m2!1sen!2sus"
                width="100%"
                height="200"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HO Oxygen Location — Parashpur, Nepalgunj, Nepal"
                aria-label="Google Map showing Parashpur, Nepalgunj, Nepal"
                className="block"
              />
            </div>
          </div>
        </div>

        {/* ── Copyright bar ─────────────────────────────────────────────── */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-center text-sm text-white/50">
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}
