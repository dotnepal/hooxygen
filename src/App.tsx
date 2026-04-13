import { Suspense, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from './routes'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SkipToContentLink from './components/layout/SkipToContentLink'

// ─── Root layout shell ─────────────────────────────────────────────────────
function RootLayout() {
  const { i18n } = useTranslation()

  // Sync HTML attributes with active language so FOUC-prevention CSS and
  // assistive technology both see the correct language on every change.
  useEffect(() => {
    const langValue = i18n.language.startsWith('ne') ? 'ne' : 'en'
    document.documentElement.lang = langValue
    document.documentElement.setAttribute('data-lang', langValue)
    document.documentElement.classList.add('lang-ready')
  }, [i18n.language])

  return (
    <>
      <ScrollRestoration />
      <SkipToContentLink />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: ROUTES.map((route) => ({
      path: route.path === '/' ? undefined : route.path,
      index: route.path === '/',
      element: (
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <route.component />
        </Suspense>
      ),
    })),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
