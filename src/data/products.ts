export type GasKey = 'oxygen' | 'nitrogen' | 'hydrogen'| 'carbondioxide' | 'argon'

export type CylinderRow = {
  size: string
  capacity: string
  weight: string
  rent: boolean
  sale: boolean
}

export type GasProduct = {
  key: GasKey
  /** English-only placeholder use cases — not in i18n (content, not UI labels). */
  useCases: readonly string[]
  cylinders: readonly CylinderRow[]
}

export const PRODUCTS: readonly GasProduct[] = [
  {
    key: 'oxygen',
    useCases: [
      'Medical oxygen therapy',
      'Hospital ventilators & ICU',
      'Homecare & ambulance',
      'Industrial cutting & welding',
    ],
    cylinders: [
      { size: 'Small',  capacity: '10 L', weight: '3 kg',  rent: true,  sale: true  },
      { size: 'Medium',  capacity: '25 L',   weight: '8 kg',  rent: true,  sale: true  },
      { size: 'Big',  capacity: '47 L',  weight: '15 kg', rent: true,  sale: true  },
    ],
  },

  {
    key: 'argon',
    useCases: [
      'Industrial processes',
      'Research & laboratories',
      'Chemical synthesis',
      'Fuel cell applications',
    ],
    cylinders: [
      { size: 'Small',  capacity: '10 L', weight: '3 kg',  rent: true,  sale: true  },
      { size: 'Medium',  capacity: '25 L',   weight: '8 kg',  rent: true,  sale: true  },
      { size: 'Big',  capacity: '47 L',  weight: '15 kg', rent: true,  sale: true  },
    ],
  },
  {
    key: 'carbondioxide',
    useCases: [
      'Industrial processes',
      'Research & laboratories',
      'Chemical synthesis',
      'Fuel cell applications',
    ],
    cylinders: [
      { size: 'Small',  capacity: '10 L', weight: '3 kg',  rent: true,  sale: true  },
      { size: 'Medium',  capacity: '25 L',   weight: '8 kg',  rent: true,  sale: true  },
      { size: 'Big',  capacity: '47 L',  weight: '15 kg', rent: true,  sale: true  },
    ],
  },

  {
    key: 'hydrogen',
    useCases: [
      'Industrial processes',
      'Research & laboratories',
      'Chemical synthesis',
      'Fuel cell applications',
    ],
    cylinders: [
      { size: 'Small',  capacity: '10 L', weight: '3 kg',  rent: true,  sale: true  },
      { size: 'Medium',  capacity: '25 L',   weight: '8 kg',  rent: true,  sale: true  },
      { size: 'Big',  capacity: '47 L',  weight: '15 kg', rent: true,  sale: true  },
    ],
  },
  {
    key: 'nitrogen',
    useCases: [
      'Industrial manufacturing',
      'Food packaging & preservation',
      'Laboratory & research',
      'Metal fabrication',
    ],
    cylinders: [
      { size: 'Small',  capacity: '10 L', weight: '3 kg',  rent: true,  sale: true  },
      { size: 'Medium',  capacity: '25 L',   weight: '8 kg',  rent: true,  sale: true  },
      { size: 'Big',  capacity: '47 L',  weight: '15 kg', rent: true,  sale: true  },
    ],
  },
]
