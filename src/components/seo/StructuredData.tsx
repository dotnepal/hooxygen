export function StructuredData() {
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

  return (
    <>
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
    </>
  )
}
