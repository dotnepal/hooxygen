import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { SsgOptions } from 'vite-plugin-ssg/utils'
import { Button, PageHero, SectionHeader } from '../components/ui'
import { generatePageHead, generateStructuredData } from '../utils/seoHelpers'

export const ssgOptions: SsgOptions = {
  slug: 'contact',
  routeUrl: '/contact',
  Head: () => (
    <>
      <title>Contact Us — HO Oxygen Industries Pvt. Ltd.</title>
      <meta
        name="description"
        content="Get in touch with HO Oxygen Industries Pvt. Ltd. to place a gas order, request a quote, or ask about our services."
      />
      {generatePageHead({
        title: 'Contact Us — HO Oxygen Industries Pvt. Ltd.',
        description: 'Get in touch with HO Oxygen Industries Pvt. Ltd. to place a gas order, request a quote, or ask about our services.',
        url: '/contact',
        keywords: 'contact us, gas inquiry, order cylinders Nepal',
      })}
      {generateStructuredData()}
    </>
  ),
  context: async (children) => {
    const { withSSGLayout } = await import('../i18n/ssgContext')
    return withSSGLayout(children, '/contact')
  },
};

// ─── Global Turnstile type ────────────────────────────────────────────────────

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

type ContactFormData = {
  name: string
  email: string
  phone: string
  company: string
  gasType: string
  requirementType: string
  message: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-lg border px-4 py-3 font-body text-sm bg-white',
    'focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent',
    'transition-colors placeholder:text-gray-600',
    hasError ? 'border-red-400' : 'border-gray-200',
  ].join(' ')
}

function StatusBanner({ type, message }: { type: 'success' | 'error'; message: string }) {
  const isSuccess = type === 'success'
  return (
    <div
      role="alert"
      className={[
        'flex items-center gap-3 rounded-lg border p-4 text-sm',
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800',
      ].join(' ')}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
        {isSuccess ? (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        )}
      </svg>
      {message}
    </div>
  )
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function ContactHero() {
  const { t } = useTranslation()
  return (
    <PageHero
      title={t('contact.hero.title')}
      subtitle={t('contact.hero.subtitle')}
    />
  )
}

// ─── Contact Form ────────────────────────────────────────────────────────────

function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const widgetRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>()

  useEffect(() => {
    if (!containerRef.current || widgetRef.current) return

    if (!window.turnstile) {
      console.warn('[Turnstile] window.turnstile is not available yet. Widget will not mount.')
      return
    }

    widgetRef.current = window.turnstile.render(containerRef.current, {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      theme: 'light',
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(null),
      'error-callback': () => setTurnstileToken(null),
    })

    return () => {
      if (widgetRef.current) {
        window.turnstile?.remove(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    if (!turnstileToken) {
      setStatus('error')
      return
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })
      if (res.ok) {
        setStatus('success')
        reset()
        setTurnstileToken(null)
        if (widgetRef.current) window.turnstile?.reset(widgetRef.current)
      } else {
        setStatus('error')
        if (widgetRef.current) window.turnstile?.reset(widgetRef.current)
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {status === 'success' && <StatusBanner type="success" message={t('contact.form.success')} />}
      {status === 'error' && <StatusBanner type="error" message={t('contact.form.error')} />}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block font-body font-medium text-brand-dark text-sm mb-1">
          {t('contact.form.name')} <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder={t('contact.form.namePlaceholder')}
          className={inputClass(!!errors.name)}
          {...register('name', {
            required: t('contact.form.required'),
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-body font-medium text-brand-dark text-sm mb-1">
          {t('contact.form.email')} <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('contact.form.emailPlaceholder')}
          className={inputClass(!!errors.email)}
          {...register('email', {
            required: t('contact.form.required'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />
        {errors.email && (
          <p role="alert" className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-body font-medium text-brand-dark text-sm mb-1">
          {t('contact.form.phone')} <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder={t('contact.form.phonePlaceholder')}
          className={inputClass(!!errors.phone)}
          {...register('phone', {
            required: t('contact.form.required'),
            minLength: { value: 7, message: 'Please enter a valid phone number' },
          })}
        />
        {errors.phone && (
          <p role="alert" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block font-body font-medium text-brand-dark text-sm mb-1">
          {t('contact.form.company')} <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          id="company"
          type="text"
          autoComplete="organization"
          placeholder={t('contact.form.companyPlaceholder')}
          className={inputClass(!!errors.company)}
          {...register('company', { required: t('contact.form.required') })}
        />
        {errors.company && (
          <p role="alert" className="mt-1 text-xs text-red-600">{errors.company.message}</p>
        )}
      </div>

      {/* Gas Type + Requirement — 2 columns on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="gasType" className="block font-body font-medium text-brand-dark text-sm mb-1">
            {t('contact.form.gasType')}
          </label>
          <select
            id="gasType"
            className={inputClass(false)}
            {...register('gasType')}
          >
            <option value="">{t('contact.form.gasTypePlaceholder')}</option>
            <option value="oxygen">{t('contact.form.gasOptions.oxygen')}</option>
            <option value="argon">{t('contact.form.gasOptions.argon')}</option>
            <option value="carbondioxide">{t('contact.form.gasOptions.carbondioxide')}</option>
            <option value="hydrogen">{t('contact.form.gasOptions.hydrogen')}</option>
            <option value="nitrogen">{t('contact.form.gasOptions.nitrogen')}</option>
            <option value="other">{t('contact.form.gasOptions.other')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="requirementType" className="block font-body font-medium text-brand-dark text-sm mb-1">
            {t('contact.form.requirement')}
          </label>
          <select
            id="requirementType"
            className={inputClass(false)}
            {...register('requirementType')}
          >
            <option value="">{t('contact.form.requirementPlaceholder')}</option>
            <option value="rent">{t('contact.form.requirementOptions.rent')}</option>
            <option value="sale">{t('contact.form.requirementOptions.sale')}</option>
            <option value="both">{t('contact.form.requirementOptions.both')}</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-body font-medium text-brand-dark text-sm mb-1">
          {t('contact.form.message')}
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder={t('contact.form.messagePlaceholder')}
          className={[inputClass(false), 'resize-none'].join(' ')}
          {...register('message')}
        />
      </div>

      {/* Cloudflare Turnstile */}
      <div ref={containerRef} className="min-h-[65px]" aria-label="Bot verification" />

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || !turnstileToken}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? t('common.loading') : t('contact.form.submit')}
      </Button>
    </form>
  )
}

// ─── Contact Info ────────────────────────────────────────────────────────────

function ContactInfo() {
  const { t } = useTranslation()

  const items = [
    {
      label: t('contact.info.phone'),
      value: t('contact.info.phoneValue'),
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
          <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: t('contact.info.address'),
      value: t('contact.info.addressValue'),
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
        </svg>
      ),
    },
  ] as const

  return (
    <aside aria-label="Contact information">
      <SectionHeader
        title={t('contact.info.title')}
        align="left"
        className="mb-6"
      />
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <span className="mt-0.5 flex-shrink-0 text-brand-blue">{item.icon}</span>
            <div>
              <p className="font-body font-medium text-brand-dark text-sm">{item.label}</p>
              <p className="font-body text-brand-steel text-sm mt-0.5">{item.value}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Map */}
      <div className="mt-6">
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm h-56">
          <iframe
	    title="HO Oxygen Location - Parashpur-17, Nepalgunj, Nepal"
           aria-label="Google Map showing Parashpur, Nepalgunj, Nepal"
	    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.969076166756!2d81.59749289363711!3d28.055968814062695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3998617a96777295%3A0x1c6f18442e6f62eb!2zSE8gT3h5Z2VuIEluZHVzdHJpZXMgUHZ0IEx0ZCDgpI_gpJou4KSTLiDgpIXgpJXgpY3gpLjgpL_gpJzgpKgg4KSH4KSo4KWN4KSh4KS44KWN4KSf4KWN4KSw4KS_4KScIOCkquCljeCksOCkvi4g4KSy4KS_Lg!5e0!3m2!1sen!2sus!4v1774774756092!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <br/>
      {/* Submission notice */}
      <div className="mt-4 rounded-xl border-2 border-orange-400 bg-orange-50 p-4 text-center">
        <p className="font-body font-semibold text-orange-600 text-sm leading-relaxed">
          {t('contact.notice.wait')}
        </p>
      </div>
    </aside>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <main id="main-content" className="page-transition">
      <ContactHero />
      <section aria-label="Contact form and information" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </main>
  )
}
