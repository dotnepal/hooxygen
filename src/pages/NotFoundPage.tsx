import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import { Button, PageHero } from '../components/ui'
import { generatePageHead, generateStructuredData } from '../utils/seoHelpers'

export const ssgOptions: SsgOptions = {
  slug: '404',
  routeUrl: '/404',
  Head: () => (
    <>
      <title>Page Not Found — HO Oxygen</title>
      {generatePageHead({
        title: 'Page Not Found — HO Oxygen',
        description: "The page you're looking for doesn't exist or has moved. Return to the HO Oxygen homepage or contact us.",
        url: '/404',
        noindex: true,
      })}
      {generateStructuredData()}
    </>
  ),
  context: async (children) => {
    const { withSSGLayout } = await import('../i18n/ssgContext')
    return withSSGLayout(children, '/404')
  },
};

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <main id="main-content" className="page-transition">
      <PageHero
        title={t('notFound.hero.title')}
        subtitle={t('notFound.hero.subtitle')}
      />
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-8">{t('notFound.message')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button as="a" href="/" variant="primary">{t('notFound.home')}</Button>
            <Button as="a" href="/contact" variant="outline">{t('notFound.contact')}</Button>
          </div>
          <p className="mt-8 text-gray-700">
            {t('notFound.browse')}{' '}
            <a href="/products" className="text-brand-blue underline font-medium">{t('notFound.products')}</a>
            {' · '}
            <a href="/services" className="text-brand-blue underline font-medium">{t('notFound.services')}</a>
          </p>
        </div>
      </section>
    </main>
  )
}
