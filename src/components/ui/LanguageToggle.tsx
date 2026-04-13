import { useTranslation } from 'react-i18next'
import type { SupportedLang } from '../../i18n'

/**
 * Language toggle button — switches between English (en) and Nepali (ne).
 * Persists the selection to localStorage via i18next-browser-languagedetector.
 *
 * Used in: Navbar (F-004), and wherever a standalone toggle is needed.
 */
export default function LanguageToggle({
  transparent = false,
}: {
  transparent?: boolean
}) {
  const { i18n } = useTranslation()

  const currentLang = i18n.language.startsWith('ne') ? 'ne' : 'en'
  const nextLang: SupportedLang = currentLang === 'en' ? 'ne' : 'en'
  const flag = currentLang === 'en' ? '🇳🇵' : '🇬🇧'
  const label = currentLang === 'en' ? 'NP' : 'EN'

  function handleToggle() {
    i18n.changeLanguage(nextLang)
    document.documentElement.lang = nextLang === 'ne' ? 'ne' : 'en'
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${nextLang === 'ne' ? 'Nepali' : 'English'}`}
      className={[
        'inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-1 rounded-md border font-body font-medium text-sm transition-colors',
        transparent
          ? 'border-white/60 text-white hover:bg-white/15 hover:border-white'
          : 'border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
      ].join(' ')}
    >
      <span aria-hidden="true">{flag}</span> {label}
    </button>
  )
}
