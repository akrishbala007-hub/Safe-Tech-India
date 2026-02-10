import Script from 'next/script'
import './globals.css'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://safetechindia.org.in'),
  alternates: {
    canonical: '/',
  },
  title: 'Safe Tech India - Official Website | Premium Refurbished Laptops & Hardware',
  description: "India's trusted digital ecosystem for computer dealers and customers. Buy verified refurbished laptops, desktops, and hardware. Developed by Grace Finnovation Private Limited.",
  keywords: [
    'Refurbished Laptops Coimbatore',
    'Computer Dealers Tamil Nadu',
    'Best Laptop Shop Chennai',
    'Safe Tech India Official',
    'Grace Finnovation',
    'Used Computers Madurai',
    'Computer Hardware Wholesale Tamil Nadu',
    'Second hand laptops Coimbatore'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://safetechindia.org.in',
    title: 'Safe Tech India - Official Website | Premium Refurbished Laptops',
    description: "The ultimate B2B & B2C computer ecosystem. Serving dealers and customers across Coimbatore, Chennai, and all of Tamil Nadu. A Grace Finnovation initiative.",
    siteName: 'Safe Tech India',
    images: [{
      url: '/logo.png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe Tech India | Official Website',
    description: "India's trusted marketplace for refurbished computers. A Grace Finnovation initiative.",
    images: ['/logo.png'],
  },
  // verification: {
  //   google: 'verified-via-dns', 
  // }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Safe Tech India',
    url: 'https://safetechindia.org.in',
    logo: 'https://safetechindia.org.in/logo.png',
    sameAs: [
      'https://www.facebook.com/safetechindia',
      'https://www.instagram.com/safetechindia'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91 96007 07601',
      email: 'williamjohnson@gracefinnovation.com',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'ta']
    }
  }

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'Safe Tech India',
    image: 'https://safetechindia.org.in/logo.png',
    '@id': 'https://safetechindia.org.in',
    url: 'https://safetechindia.org.in',
    telephone: '+91 96007 07601',
    email: 'williamjohnson@gracefinnovation.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Town Hall',
      addressLocality: 'Coimbatore',
      addressRegion: 'TN',
      postalCode: '641001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 10.9967,
      longitude: 76.9628
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '10:00',
      closes: '20:00'
    },
    sameAs: 'https://safetechindia.org.in'
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {children}
          <Footer />
        </div>
        <WhatsAppFloat />
      </body>
    </html>
  )
}
