export type FaqCategory = 'safety' | 'ordering' | 'delivery' | 'rental' | 'payment' | 'emergency'

export type FaqItem = {
  id: number
  category: FaqCategory
  question: string
  answer: string
}

export const FAQ_DATA: readonly FaqItem[] = [
  // ── Safety ─────────────────────────────────────────────────────────────────
  {
    id: 1,
    category: 'safety',
    question: 'How should I store gas cylinders safely?',
    answer:
      'Store cylinders upright and secured with a chain or strap to prevent tipping. Keep them in a well-ventilated area away from heat sources, open flames, and direct sunlight. Never store oxygen cylinders near flammable materials or oils.',
  },
  {
    id: 2,
    category: 'safety',
    question: 'What should I do if I suspect a gas leak?',
    answer:
      'Leave the area immediately and do not use any electrical switches or open flames. Ventilate the space by opening doors and windows if safe to do so. Contact our emergency support line and, if necessary, call the local fire department. Never attempt to stop a leak yourself.',
  },

  // ── Ordering ───────────────────────────────────────────────────────────────
  {
    id: 3,
    category: 'ordering',
    question: 'How do I place an order?',
    answer:
      'You can place an order by calling our office directly, sending an email, or submitting the inquiry form on our Contact page. Provide the gas type, cylinder size, quantity, and your delivery address. Our team will confirm availability and delivery schedule within 24 hours.',
  },
  {
    id: 4,
    category: 'ordering',
    question: 'What gases and cylinder sizes are available?',
    answer:
      'We supply Oxygen, Nitrogen, and Hydrogen gas in small (S), medium (M), large (L), and extra-large (XL) cylinders. Oxygen cylinders range from 1.5 L to 47 L capacity. See our Products page for a full size and availability table.',
  },

  // ── Delivery ───────────────────────────────────────────────────────────────
  {
    id: 5,
    category: 'delivery',
    question: 'What are your delivery timeframes?',
    answer:
      'We offer same-day delivery within Nepalgunj for orders placed before noon. Regional deliveries (Banke, Bardiya, and surrounding districts) typically take 2–4 business days. National deliveries to remote areas may take up to 7 days. Contact us for a precise estimate.',
  },
  {
    id: 6,
    category: 'delivery',
    question: 'Do you deliver to hospitals and clinics directly?',
    answer:
      'Yes. We regularly deliver to hospitals, clinics, and homecare providers. For recurring medical orders, we can set up scheduled deliveries so your facility is never without supply. Contact our team to discuss a delivery plan.',
  },

  // ── Rental ─────────────────────────────────────────────────────────────────
  {
    id: 7,
    category: 'rental',
    question: 'How does the cylinder rental process work?',
    answer:
      'When you rent a cylinder, you pay a refundable security deposit in addition to the gas cost. The cylinder remains our property. When you need a refill, return the empty cylinder and receive a full one. Return the cylinder at any time to get your deposit back.',
  },
  {
    id: 8,
    category: 'rental',
    question: 'Can I purchase a cylinder instead of renting?',
    answer:
      'Yes, most cylinder sizes are available for outright purchase. Once purchased, the cylinder belongs to you and you only pay for refilling. Check our Products page for per-size rent and sale availability. Contact us for current pricing.',
  },

  // ── Payment ────────────────────────────────────────────────────────────────
  {
    id: 9,
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept cash, bank transfer, and mobile payment (eSewa, Khalti). For institutional customers (hospitals, government facilities), we also offer invoice-based monthly billing with a 30-day payment term. Contact our accounts team to set up a billing account.',
  },
  {
    id: 10,
    category: 'payment',
    question: 'Do you display prices on the website?',
    answer:
      'Prices are not listed on the website because they vary based on cylinder size, quantity, delivery distance, and current gas availability. Please use the Contact form or call us for a customised quote. We aim to respond to all pricing inquiries within one business day.',
  },

  // ── Emergency ──────────────────────────────────────────────────────────────
  {
    id: 11,
    category: 'emergency',
    question: 'Is emergency oxygen supply available outside business hours?',
    answer:
      'Yes. For medical facilities with critical oxygen needs, we provide 24/7 emergency supply. Contact our emergency line and we will arrange urgent delivery or pickup. Please identify your facility and the urgency level when you call.',
  },
  {
    id: 12,
    category: 'emergency',
    question: 'What should a hospital do if they run critically low on oxygen?',
    answer:
      'Call our emergency support number immediately. Our on-call team prioritises medical oxygen requests. While waiting for delivery, reduce non-essential oxygen usage where clinically safe. Do not wait until supply is fully exhausted — contact us as soon as reserves drop below 25%.',
  },
]
