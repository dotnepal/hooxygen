import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import { Button, Card, SectionHeader, PageHero } from '../components/ui'
import { PRODUCTS, type GasKey } from '../data/products'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { generatePageHead, generateStructuredData } from '../utils/seoHelpers'

export const ssgOptions: SsgOptions = {
  slug: 'products',
  routeUrl: '/products',
  Head: () => (
    <>
      <title>Products & Services — HO Oxygen</title>
      {generatePageHead({
        title: 'Products & Services — HO Oxygen',
        description: 'Explore oxygen, nitrogen, and hydrogen gas cylinders available for rent and sale. Refilling, bulk orders, and delivery services across Nepal.',
        url: '/products',
        keywords: 'oxygen cylinder, nitrogen gas, CO₂ supply, CO2 supply Nepal, argon gas Nepal, industrial gas cylinders',
      })}
      {generateStructuredData()}
    </>
  ),
  context: async (children) => {
    const { withSSGLayout } = await import('../i18n/ssgContext')
    return withSSGLayout(children, '/products')
  },
};

// ─── Service icons ──────────────────────────────────────────────────────────

const SERVICE_ICONS = {
  refilling: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <path
        d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline
        points="32,8 32,16 24,16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bulk: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      <rect x="6" y="20" width="28" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="12" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="6" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
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
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function ProductsHero() {
  const { t } = useTranslation()
  return (
    <PageHero
      title={t('products.hero.title')}
      subtitle={t('products.hero.subtitle')}
    />
  )
}

// ─── Gas Tabs ───────────────────────────────────────────────────────────────

function GasTabs() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<GasKey>('oxygen')

  const activeProduct = PRODUCTS.find((p) => p.key === activeTab)!

  return (
    <section aria-label="Gas Products" className="bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tab bar */}
        <div className="flex border-b border-gray-200 overflow-x-auto" role="tablist" aria-label="Gas types">
          {PRODUCTS.map(({ key: gas }) => (
            <button
              key={gas}
              role="tab"
              aria-selected={activeTab === gas}
              aria-controls={`tabpanel-${gas}`}
              id={`tab-${gas}`}
              onClick={() => setActiveTab(gas)}
              className={[
                'px-6 py-4 font-body font-medium text-base transition-colors border-b-2 -mb-px whitespace-nowrap',
                activeTab === gas
                  ? 'border-brand-blue text-brand-blue font-semibold'
                  : 'border-transparent text-brand-steel hover:text-brand-blue hover:border-brand-blue/30',
              ].join(' ')}
            >
              {t(`products.tabs.${gas}`)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="py-10"
        >
          <p className="font-body text-brand-steel leading-relaxed text-base sm:text-lg max-w-3xl">
            {t(`products.${activeTab}.desc`)}
          </p>

          {/* Use cases */}
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-1">
            {activeProduct.useCases.map((useCase) => (
              <li
                key={useCase}
                className="flex items-center gap-2 font-body text-sm text-brand-dark"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0" aria-hidden="true" />
                {useCase}
              </li>
            ))}
          </ul>

          <div className="mt-8 md:hidden flex flex-col gap-3">
            {activeProduct.cylinders.map((row) => (
              <div
                key={row.size}
                className="rounded-xl border border-gray-100 shadow-sm bg-white p-5 flex flex-col gap-4"
              >
                {/* Size badge + capacity/weight */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light font-display font-bold text-brand-blue text-lg">
                    {row.size}
                  </span>
                  <div className="text-right">
                    <p className="font-body text-xs text-brand-steel uppercase tracking-wide">{t('products.table.capacity')}</p>
                    <p className="font-body font-semibold text-brand-dark">{row.capacity}</p>
                  </div>
                </div>

                {/* Availability + CTA */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <span className={[
                    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-body font-medium',
                    row.rent ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600',
                  ].join(' ')}>
                    {row.rent ? '✓' : '✗'} {t('products.table.rent')}
                  </span>
                  <span className={[
                    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-body font-medium',
                    row.sale ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600',
                  ].join(' ')}>
                    {row.sale ? '✓' : '✗'} {t('products.table.sale')}
                  </span>
                  <Button as="a" href="/contact" variant="outline" size="sm" className="ml-auto">
                    {t('products.pricing.contact')}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 hidden md:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[560px] text-sm font-body">
              <thead>
                <tr style={{ background: 'var(--color-brand-light)' }}>
                  {(['size', 'capacity', 'rent', 'sale', 'pricing'] as const).map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-5 py-3 text-left font-display font-semibold text-brand-dark text-xs uppercase tracking-wide"
                    >
                      {t(`products.table.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeProduct.cylinders.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-4 font-semibold text-brand-dark">{row.size}</td>
                    <td className="px-5 py-4 text-brand-steel">{row.capacity}</td>
                    <td className="px-5 py-4">
                      {row.rent ? <span className="font-bold text-emerald-600">✓</span> : <span className="text-gray-600">✗</span>}
                    </td>
                    <td className="px-5 py-4">
                      {row.sale ? <span className="font-bold text-emerald-600">✓</span> : <span className="text-gray-600">✗</span>}
                    </td>
                    <td className="px-5 py-4">
                      <Button as="a" href="/contact" variant="outline" size="sm">
                        {t('products.pricing.contact')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Services Section ───────────────────────────────────────────────────────

function ServicesSection() {
  const { t } = useTranslation()
  const services = ['refilling', 'bulk', 'delivery'] as const
  const headerRef = useScrollAnimation<HTMLDivElement>()
  const gridRef = useScrollAnimation<HTMLDivElement>({ stagger: 120 })

  return (
    <section
      aria-label="Our Services"
      className="py-20 px-6"
      style={{ background: 'var(--color-brand-light)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="animate-on-scroll mb-12">
          <SectionHeader
            title={t('products.services.title')}
            align="center"
          />
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((key) => (
            <Card key={key} hover as="article" className="animate-on-scroll flex flex-col items-start gap-4">
              <div className="p-3 rounded-xl bg-brand-light text-brand-blue">
                {SERVICE_ICONS[key]}
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-brand-dark">
                  {t(`products.services.${key}.title`)}
                </h3>
                <p className="mt-1 font-body text-sm text-brand-dark leading-relaxed">
                  {t(`products.services.${key}.desc`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <main id="main-content" className="page-transition">
      <ProductsHero />
      <GasTabs />
      <ServicesSection />
    </main>
  )
}
