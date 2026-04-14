import { Fragment } from 'react'

interface SeoMetadata {
  title: string
  description: string
  url: string
  image?: string
  type?: string
  keywords?: string
}

export function generateHreflangTags(url: string) {
  const baseUrl = 'https://www.hooxygen.com.np'
  return (
    <>
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${url}`} />
      <link rel="alternate" hrefLang="ne" href={`${baseUrl}${url}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${url}`} />
    </>
  )
}

export function generatePageHead(metadata: SeoMetadata) {
  const baseUrl = 'https://www.hooxygen.com.np'
  const image = metadata.image || `${baseUrl}/og-image-default.jpg`
  const absoluteUrl = `${baseUrl}${metadata.url}`
  const type = metadata.type || 'website'

  return (
    <Fragment>
      {/* Open Graph Tags */}
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="HO Oxygen Industries" />
      <meta property="og:locale" content="en_NP" />
      <meta property="og:locale:alternate" content="ne_NP" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={absoluteUrl} />

      {/* Hreflang Tags for Bilingual Support */}
      {generateHreflangTags(metadata.url)}

      {/* Robots & Additional SEO */}
      <meta name="robots" content="index, follow" />
      {metadata.keywords && <meta name="keywords" content={metadata.keywords} />}
    </Fragment>
  )
}

// JSON-LD Structured Data for global head
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HO Oxygen Industries Pvt. Ltd.',
  url: 'https://www.hooxygen.com.np',
  logo: 'https://www.hooxygen.com.np/logo.svg',
  description:
    'Gas supply company offering oxygen, nitrogen, hydrogen, CO2, and argon',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    telephone: '+977-9858030326',
    email: 'info@hooxygen.com.np',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'HO Oxygen Industries Pvt. Ltd.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Parashpur-17, Nepalgunj',
    addressLocality: 'Nepalgunj',
    addressRegion: 'Lumbini Province, Banke',
    addressCountry: 'NP',
  },
  telephone: '+977-9858030326',
  url: 'https://www.hooxygen.com.np',
  areaServed: ['NP'],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
}

export function generateStructuredData() {
  return (
    <Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
    </Fragment>
  )
}
