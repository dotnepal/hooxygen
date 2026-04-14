import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import { Button, Card, Badge, SectionHeader, PhoneLink } from '../components/ui'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { generatePageHead, generateStructuredData } from '../utils/seoHelpers'
import HOHeroImage from '../assets/img/ho-heroimage-747x420.jpg'

export const ssgOptions: SsgOptions = {
  slug: 'index',
  routeUrl: '/',
  Head: () => (
    <>
      <title>HO Oxygen Industries Pvt. Ltd. — Reliable Gas Supply for Medical & Industrial Use across Nepal</title>
      {generatePageHead({
        title: 'HO Oxygen Industries Pvt. Ltd. — Reliable Gas Supply for Medical & Industrial Use across Nepal',
        description: 'HO Oxygen Industries Pvt. Ltd. provides reliable oxygen, nitrogen, and hydrogen gas supply for hospitals, medical facilities, and industrial users across Nepal.',
        url: '/',
        keywords: 'HO Oxygen Industries, oxygen supply Nepal, gas cylinders, medical gas, nitrogen, hydrogen, Nepalgunj gas supplier, Banke district',
      })}
      {generateStructuredData()}
    </>
  ),
  context: async (children) => {
    const { withSSGLayout } = await import('../i18n/ssgContext')
    return withSSGLayout(children, '/')
  },
};

// ─── Hero ──────────────────────────────────────────────────────────────────

function HomeHero() {
  const { t } = useTranslation()
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand-blue) 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
        paddingBottom: 'clamp(4rem, 10vw, 7rem)',
      }}
    >
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight">
            {t('home.hero.tagline')}
          </h1>
          <p className="mt-5 text-base sm:text-lg font-body text-white/75 max-w-lg leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button as="a" href="/contact" size="lg">
              {t('home.hero.cta.contact')}
            </Button>
            <Button as="a" href="/products" variant="outline" size="lg" className="border-white text-white hover:bg-green hover:text-brand-blue">
              {t('home.hero.cta.products')}
            </Button>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div className="hidden lg:flex justify-center">
          <img
            src={HOHeroImage}
            alt="HO Oxygen Industries gas production facility in Nepalgunj, Nepal"
            loading="eager"
            className="rounded-2xl shadow-2xl"
            width={747}
            height={420}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Gas Highlights ────────────────────────────────────────────────────────

const GAS_ICONS = {
  oxygen: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fontSize="16" fill="currentColor" fontWeight="700">O₂</text>
    </svg>
  ),
  nitrogen: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fontSize="16" fill="currentColor" fontWeight="700">N₂</text>
    </svg>
  ),
  hydrogen: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fontSize="16" fill="currentColor" fontWeight="700">H₂</text>
    </svg>
  ),
  carbondioxide: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fontSize="13" fill="currentColor" fontWeight="700">CO₂</text>
    </svg>
  ),
  argon: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fontSize="16" fill="currentColor" fontWeight="700">Ar</text>
    </svg>
  ),
}

function GasHighlights() {
  const { t } = useTranslation()
  const gases = [
    'oxygen', 
    'argon',
    'carbondioxide', 
    'hydrogen', 
    'nitrogen', 
  ] as const
  const headerRef = useScrollAnimation<HTMLDivElement>()
  const gridRef = useScrollAnimation<HTMLDivElement>({ stagger: 120 })

  return (
    <section aria-labelledby="gases-heading" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="animate-on-scroll mb-12">
          <SectionHeader
            eyebrow={t('common.learnMore')}
            title={t('home.gas.sectionTitle')}
            align="center"
          />
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gases.map((gas) => (
            <Card key={gas} hover as="article" className="animate-on-scroll flex flex-col items-start gap-4">
              <div className="p-3 rounded-xl bg-brand-light text-brand-blue">
                {GAS_ICONS[gas]}
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-brand-dark">
                  {t(`home.gas.${gas}.title`)}
                </h3>
                <p className="mt-2 font-body text-brand-steel leading-relaxed">
                  {t(`home.gas.${gas}.desc`)}
                </p>
              </div>
              <Button as="a" href="/products" variant="ghost" size="sm" className="mt-auto -ml-2">
                {t('home.gas.learnMore')} →
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Services Strip ────────────────────────────────────────────────────────

function ServicesStrip() {
  const { t } = useTranslation()
  const services = [
    { key: 'rent', icon: '🔄' },
    { key: 'sale', icon: '🛒' },
    { key: 'refilling', icon: '⚡' },
    { key: 'bulkOrders', icon: '📦' },
    { key: 'delivery', icon: '🚚' },
  ] as const
  const headerRef = useScrollAnimation<HTMLDivElement>()
  const badgesRef = useScrollAnimation<HTMLDivElement>({ stagger: 80 })

  return (
    <section
      aria-labelledby="services-heading"
      className="py-12 px-6"
      style={{ background: 'var(--color-brand-light)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="animate-on-scroll mb-10">
          <SectionHeader
            title={t('home.services.sectionTitle')}
            align="center"
          />
        </div>
        <div ref={badgesRef} className="flex flex-wrap justify-center gap-4">
          {services.map(({ key, icon }) => (
            <Badge key={key} variant="primary" className="animate-on-scroll gap-2 px-5 py-3 text-base">
              <span aria-hidden="true">{icon}</span>
              {t(`home.services.${key}`)}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Trust Gallery ─────────────────────────────────────────────────────────

const TRUST_IMAGES = [
  {
    src: 'https://placehold.co/400x280/1e3a5f/ffffff?text=Hospital+Partner',
    alt: 'Hospital partner facility',
  },
  {
    src: 'https://placehold.co/400x280/1e40af/ffffff?text=Certified+Storage',
    alt: 'Certified gas storage facility',
  },
  {
    src: 'https://placehold.co/400x280/3b82f6/ffffff?text=Safe+Delivery',
    alt: 'Safe gas delivery operations',
  },
] as const

function TrustGallery() {
  const { t } = useTranslation()
  const headerRef = useScrollAnimation<HTMLDivElement>()
  const gridRef = useScrollAnimation<HTMLDivElement>({ stagger: 120 })

  return (
    <section aria-label="Trusted Partner" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="animate-on-scroll mb-12">
          <SectionHeader
            eyebrow={t('common.learnMore')}
            title={t('home.trust.sectionTitle')}
            align="center"
          />
        </div>
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TRUST_IMAGES.map((img) => (
            <Card key={img.src} flush hover as="figure" className="animate-on-scroll">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={400}
                height={280}
                className="w-full h-52 object-cover"
              />
            </Card>
          ))}
        </div>
        <p className="mt-10 text-center font-body text-lg font-semibold text-brand-dark">
          {t('home.trust.tagline')}
        </p>
      </div>
    </section>
  )
}

// ─── Call Now CTA ──────────────────────────────────────────────────────────

function CallNowCTA() {
  const { t } = useTranslation()
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section
      aria-label="Call now for immediate assistance"
      className="py-16 px-6 bg-brand-light text-center"
    >
      <div ref={ref} className="animate-on-scroll max-w-4xl mx-auto">
        <p className="text-lg font-body text-brand-dark mb-6">
          {t('cta.questions')}
        </p>
        <PhoneLink
          phone="+9779858030326"
          display={t('cta.callNow')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-display font-semibold rounded-lg hover:bg-brand-dark transition-all hover:shadow-lg text-lg"
          icon={true}
        />
      </div>
    </section>
  )
}

// ─── CTA Banner ────────────────────────────────────────────────────────────

function CTABanner() {
  const { t } = useTranslation()
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section
      aria-label="Call to action"
      className="py-20 px-6 text-center"
      style={{
        background:
          'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand-blue) 100%)',
      }}
    >
      <div ref={ref} className="animate-on-scroll">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
          {t('home.cta.title')}
        </h2>
        <div className="mt-8">
          <Button
            as="a"
            href="/contact"
            size="lg"
            className="text-white border-0 shadow-lg bg-teal-700 hover:bg-teal-900"
          >
            {t('home.cta.button')}
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main id="main-content" className="page-transition">
      <HomeHero />
      <GasHighlights />
      <ServicesStrip />
      <CallNowCTA />
      <TrustGallery />
      <CTABanner />
    </main>
  )
}
