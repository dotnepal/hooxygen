import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import PageHero from '../components/ui/PageHero'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { generatePageHead, generateStructuredData } from '../utils/seoHelpers'

export const ssgOptions: SsgOptions = {
  slug: 'services',
  routeUrl: '/services',
  Head: () => (
    <>
      <title>Our Services — HO Oxygen</title>
      <meta
        name="description"
        content="HO Oxygen offers cylinder rental, sales, refilling, bulk orders, same-day delivery, and customer pickup across Nepal."
      />
      {generatePageHead({
        title: 'Our Services — HO Oxygen',
        description: 'HO Oxygen offers cylinder rental, sales, refilling, bulk orders, same-day delivery, and customer pickup across Nepal.',
        url: '/services',
        keywords: 'gas delivery Nepal, cylinder refill, bulk orders, rental, sales',
      })}
      {generateStructuredData()}
    </>
  ),
  context: async (children) => {
    const { withSSGLayout } = await import('../i18n/ssgContext')
    return withSSGLayout(children, '/services')
  },
};

// ─── SVG Icons ──────────────────────────────────────────────────────────────

function RentIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function SaleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function RefillingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

function BulkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function DeliveryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function PickupIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

// ─── Service data ────────────────────────────────────────────────────────────

const SERVICE_ICONS = [RentIcon, SaleIcon, RefillingIcon, BulkIcon, DeliveryIcon, PickupIcon]
const SERVICE_KEYS = ['rent', 'sale', 'refilling', 'bulk', 'delivery', 'pickup'] as const

// ─── Why Choose Us data ──────────────────────────────────────────────────────

const WHY_US_ICONS = {
  safety: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <path
        d="M20 4L6 10v10c0 8.284 5.948 15.978 14 18 8.052-2.022 14-9.716 14-18V10L20 4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polyline
        points="13,21 18,26 27,15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  certified: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
      <polyline
        points="13,20 18,25 27,14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  delivery: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <rect x="2" y="12" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M26 16h6l4 6v6h-10V16z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="30" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 12v8l5 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

function WhyChooseUs() {
  const { t } = useTranslation()
  const items = ['safety', 'certified', 'delivery', 'support'] as const
  const headerRef = useScrollAnimation<HTMLDivElement>()
  const gridRef = useScrollAnimation<HTMLDivElement>({ stagger: 100 })

  return (
    <section
      aria-label="Why Choose Us"
      className="py-20 px-6 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="animate-on-scroll mb-12">
          <SectionHeader
            title={t('about.whyUs.title')}
            align="center"
          />
        </div>
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <Card key={item} hover as="article" className="animate-on-scroll flex flex-col items-start gap-4">
              <div className="p-3 rounded-xl bg-brand-light text-brand-blue">
                {WHY_US_ICONS[item]}
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-brand-dark">
                  {t(`about.whyUs.${item}`)}
                </h3>
                <p className="mt-1 font-body text-sm text-brand-steel leading-relaxed">
                  {t(`about.whyUs.${item}Desc`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ServicesPage ────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const { t } = useTranslation()
  const cardsRef = useScrollAnimation<HTMLDivElement>({ stagger: 80 })

  return (
    <main id="main-content">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <PageHero
        title={t('services.hero.title')}
        subtitle={t('services.hero.subtitle')}
      />

      {/* ── Services grid ────────────────────────────────────────── */}
      <section
        id="services-heading"
        aria-labelledby="services-heading"
        className="max-w-6xl mx-auto px-6 py-16 sm:py-20"
      >
        <SectionHeader
          title={t('services.sectionTitle')}
        />

        <div
          ref={cardsRef}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICE_KEYS.map((key, i) => {
            const Icon = SERVICE_ICONS[i]
            return (
              <div key={key} className="animate-on-scroll">
                <Card hover className="h-full flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand-blue shrink-0">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-brand-dark text-lg leading-snug">
                      {t(`services.${key}.title`)}
                    </h3>
                    <p className="mt-2 font-body text-brand-steel text-sm leading-relaxed">
                      {t(`services.${key}.desc`)}
                    </p>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section
        aria-label="Call to action"
        className="bg-brand-light"
      >
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-brand-dark text-3xl sm:text-4xl leading-tight">
            {t('services.cta.title')}
          </h2>
          <p className="mt-4 font-body text-brand-dark text-base sm:text-lg">
            {t('services.cta.subtitle')}
          </p>
          <div className="mt-8">
            <Button as="a" href="/contact" size="lg" variant="primary">
              {t('services.cta.button')}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <WhyChooseUs />
    </main>
  )
}
