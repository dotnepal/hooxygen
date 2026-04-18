import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import hoOxygenAbout from '../assets/img/ho-oxygen-about-540x380.jpg'
import { Badge, Button, PageHero, PhoneLink, SectionHeader } from '../components/ui'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { generatePageHead, generateStructuredData } from '../utils/seoHelpers'

export const ssgOptions: SsgOptions = {
  slug: 'about',
  routeUrl: '/about',
  Head: () => (
    <>
      <title>About Us — HO Oxygen</title>
      {generatePageHead({
        title: 'About Us — HO Oxygen',
        description: 'Learn about HO Oxygen — our story, team, and commitment to safe, reliable gas supply across Nepal.',
        url: '/about',
        keywords: 'HO Oxygen, gas company Nepal, service areas, Nepalgunj, Parashpur, Banke district, Lumbini province',
      })}
      {generateStructuredData()}
    </>
  ),
  context: async (children) => {
    const { withSSGLayout } = await import('../i18n/ssgContext')
    return withSSGLayout(children, '/about')
  },
};

// ─── Hero ───────────────────────────────────────────────────────────────────

function AboutHero() {
  const { t } = useTranslation()
  return (
    <PageHero
      title={t('about.hero.title')}
      subtitle={t('about.hero.subtitle')}
    />
  )
}

// ─── Company Story ──────────────────────────────────────────────────────────

function CompanyStory() {
  const { t } = useTranslation()
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section aria-label="Our Story" className="py-20 px-6 bg-white">
      <div ref={ref} className="animate-on-scroll max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeader
            eyebrow="Since 2005"
            title={t('about.story.title')}
            align="left"
            className="mb-6"
          />
          <p className="font-body text-brand-steel leading-relaxed text-base sm:text-lg">
            {t('about.story.body')}
          </p>
          <div className="mt-8">
            <Button as="a" href="/contact">
              {t('common.contactUs')}
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <img
            src={hoOxygenAbout}
            alt="HO Oxygen Industries storage and operations facility"
            loading="lazy"
            width={540}
            height={380}
            className="rounded-2xl shadow-card w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

// ─── Service Areas ──────────────────────────────────────────────────────────

const AREA_ICONS = {
  local: '📍',
  regional: '🗺️',
  national: '🇳🇵',
} as const

function ServiceAreas() {
  const { t } = useTranslation()
  const areas = ['local', 'regional', 'national'] as const
  const headerRef = useScrollAnimation<HTMLDivElement>()
  const badgesRef = useScrollAnimation<HTMLDivElement>({ stagger: 100 })

  return (
    <section aria-label="Service Areas" className="pt-0 pb-16 sm:pt-8 sm:pb-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="animate-on-scroll mb-10">
          <SectionHeader
            title={t('about.areas.title')}
            align="center"
          />
        </div>
        <div ref={badgesRef} className="flex flex-wrap justify-center gap-4">
          {areas.map((area) => (
            <Badge key={area} variant="primary" className="animate-on-scroll gap-2 px-6 py-3 text-base">
              <span aria-hidden="true">{AREA_ICONS[area]}</span>
              {t(`about.areas.${area}`)}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Call Now CTA ──────────────────────────────────────────────────────────

function CallNowSection() {
  const { t } = useTranslation()
  const ref = useScrollAnimation<HTMLDivElement>()

  return (
    <section
      aria-label="Call now for assistance"
      className="py-16 px-6 bg-brand-light"
    >
      <div ref={ref} className="animate-on-scroll max-w-4xl mx-auto text-center">
        <h2 className="font-display font-semibold text-brand-dark text-2xl sm:text-3xl mb-4">
          {t('cta.questions')}
        </h2>
        <p className="font-body text-brand-steel mb-8">
          {t('cta.callUsToday')}
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main id="main-content" className="page-transition">
      <AboutHero />
      <CompanyStory />
      <ServiceAreas />
      <CallNowSection />
    </main>
  )
}
