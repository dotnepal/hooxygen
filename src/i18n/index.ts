import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en.json'
import np from './np.json'

/**
 * i18n configuration for HO Oxygen.
 *
 * Languages: English (en) + Nepali (ne)
 * - Translations are bundled into the JS bundle (no HTTP fetch at runtime)
 * - Language preference is persisted to localStorage via LanguageDetector
 * - Detection order: localStorage → navigator language → fallback to 'en'
 */
export const i18nReady = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ne: { translation: np },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ne'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ho-gas-lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
export type SupportedLang = 'en' | 'ne'
