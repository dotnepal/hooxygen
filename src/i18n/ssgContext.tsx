/**
 * SSG context helper.
 *
 * During SSG (vite-plugin-ssg static prerender), `main.tsx` is not executed so
 * i18next is not initialised via initReactI18next. withSSGLayout wraps each
 * page in I18nextProvider + StaticRouter + Navbar/Footer, mirroring the runtime
 * RootLayout so the pre-rendered HTML matches the live app structure.
 * StaticRouter receives the exact page URL so NavLink active state is correct
 * in the static HTML without JavaScript.
 */
import { I18nextProvider } from 'react-i18next'
import type { ReactNode } from 'react'
import i18n from './index'

export async function withSSGLayout(children: ReactNode, routeUrl: string): Promise<ReactNode> {
  const [{ StaticRouter }, { default: Navbar }, { default: Footer }, { default: SkipToContentLink }] =
    await Promise.all([
      import('react-router-dom/server'),
      import('../components/layout/Navbar'),
      import('../components/layout/Footer'),
      import('../components/layout/SkipToContentLink'),
    ])

  return (
    <I18nextProvider i18n={i18n}>
      <StaticRouter location={routeUrl}>
        <SkipToContentLink />
        <Navbar />
        {children}
        <Footer />
      </StaticRouter>
    </I18nextProvider>
  )
}
