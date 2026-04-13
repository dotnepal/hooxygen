import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import { Button, Badge, SectionHeader, PageHero } from '../components/ui'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export const ssgOptions: SsgOptions = {
  slug: 'about',
  routeUrl: '/about',
  Head: () => (
    <>
      <title>About Us — HO Oxygen</title>
      <meta
        name="description"
        content="Learn about HO Oxygen — our story, team, and commitment to safe, reliable gas supply across Nepal."
      />
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
            <Button as="a" href="/contact" size="md">
              {t('common.contactUs')}
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <img
            src="https://placehold.co/540x380/1e3a5f/ffffff?text=Our+Facility"
            alt="HO Oxygen facility"
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
    <section aria-label="Service Areas" className="py-16 px-6 bg-white">
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main id="main-content" className="page-transition">
      <AboutHero />
      <CompanyStory />
      <ServiceAreas />
    </main>
  )
}
