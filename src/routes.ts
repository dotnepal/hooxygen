import { lazy } from 'react'

/**
 * Single source of truth for all application routes.
 * Consumed by:
 *   1. createBrowserRouter in App.tsx (runtime navigation)
 *   2. vite.config.ts SSG includedRoutes (build-time pre-rendering)
 *   3. Navbar component (iterates for nav links)
 */
export const ROUTES = [
  {
    path: '/',
    labelKey: 'nav.home',
    component: lazy(() => import('./pages/HomePage')),
  },
  {
    path: '/services',
    labelKey: 'nav.services',
    component: lazy(() => import('./pages/ServicesPage')),
  },
  {
    path: '/products',
    labelKey: 'nav.products',
    component: lazy(() => import('./pages/ProductsPage')),
  },
  {
    path: '/about',
    labelKey: 'nav.about',
    component: lazy(() => import('./pages/AboutPage')),
  },
  {
    path: '/contact',
    labelKey: 'nav.contact',
    component: lazy(() => import('./pages/ContactPage')),
  },
  {
    path: '/faq',
    labelKey: 'nav.faq',
    component: lazy(() => import('./pages/FAQPage')),
  },
] as const

export const ROUTE_PATHS = ROUTES.map((r) => r.path)
export type RoutePath = (typeof ROUTES)[number]['path']
