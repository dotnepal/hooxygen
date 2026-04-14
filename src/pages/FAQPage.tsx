import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import { Badge, PageHero } from '../components/ui'
import { FAQ_DATA, type FaqCategory } from '../data/faq'
import { generatePageHead, generateStructuredData } from '../utils/seoHelpers'

export const ssgOptions: SsgOptions = {
  slug: 'faq',
  routeUrl: '/faq',
  Head: () => (
    <>
      <title>FAQ — HO Oxygen</title>
      {generatePageHead({
        title: 'FAQ — HO Oxygen',
        description: 'Frequently asked questions about gas safety, ordering, delivery, rental, and payment at HO Oxygen.',
        url: '/faq',
        keywords: 'gas safety, delivery time, cylinder rental FAQ, pricing, cylinder safety Nepal, gas rental FAQ, oxygen delivery FAQ',
      })}
      {generateStructuredData()}
    </>
  ),
  context: async (children) => {
    const { withSSGLayout } = await import('../i18n/ssgContext')
    return withSSGLayout(children, '/faq')
  },
};

const CATEGORIES: Array<FaqCategory | 'all'> = [
  'all',
  ...[...new Set(FAQ_DATA.map((item) => item.category))],
]

// ─── Hero ───────────────────────────────────────────────────────────────────

function FAQHero() {
  const { t } = useTranslation()
  return (
    <PageHero
      title={t('faq.hero.title')}
      subtitle={t('faq.hero.subtitle')}
    />
  )
}

// ─── Category Filter ─────────────────────────────────────────────────────────

type CategoryFilterProps = {
  active: FaqCategory | 'all'
  onChange: (cat: FaqCategory | 'all') => void
}

function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const { t } = useTranslation()
  return (
    <div className="py-8 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              interactive
              variant={active === cat ? 'primary' : 'outline'}
              aria-pressed={active === cat}
              onClick={() => onChange(cat)}
              className="px-4 py-2 text-sm"
            >
              {t(`faq.categories.${cat}`)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Accordion ───────────────────────────────────────────────────────────────

type AccordionProps = {
  items: typeof FAQ_DATA[number][]
}

function Accordion({ items }: AccordionProps) {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState<number | null>(null)

  if (items.length === 0) {
    return (
      <p className="text-center font-body text-brand-steel py-12">
        {t('faq.noResults')}
      </p>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-body-${item.id}`}
              id={`faq-btn-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between py-5 text-left font-body font-medium text-brand-dark text-base hover:text-brand-blue transition-colors gap-4"
            >
              <span>{item.question}</span>
              {/* Plus / minus icon */}
              <span
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-current transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                  <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>

            {/* Animated body — grid-template-rows trick (no JS height measurement) */}
            <div
              id={`faq-body-${item.id}`}
              role="region"
              aria-labelledby={`faq-btn-${item.id}`}
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.28s ease',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <p className="pb-5 font-body text-brand-steel leading-relaxed text-sm sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory | 'all'>('all')

  const filtered =
    activeCategory === 'all'
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeCategory)

  return (
    <main id="main-content" className="page-transition">
      <FAQHero />
      <CategoryFilter
        active={activeCategory}
        onChange={(cat) => setActiveCategory(cat)}
      />
      <section
        aria-label="FAQ accordion"
        className="py-4 pb-16 px-6 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <Accordion items={[...filtered]} />
        </div>
      </section>
    </main>
  )
}
