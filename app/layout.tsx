import Script from 'next/script'
import './globals.css'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safe Tech India | Best Computer Hub in Tamil Nadu & Coimbatore',
  description: "India's trusted digital ecosystem for computer dealers, distributors, and customers in Tamil Nadu. Buy refurbished laptops, desktops, and computer hardware in Coimbatore, Chennai, and Madurai.",
  keywords: [
    'Refurbished Laptops Coimbatore',
    'Computer Dealers Tamil Nadu',
    'Best Laptop Shop Chennai',
    'Safe Tech India',
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
    title: 'Safe Tech India | Top Refurbished Computer Marketplace in Tamil Nadu',
    description: "The ultimate B2B & B2C computer ecosystem. Serving dealers and customers across Coimbatore, Chennai, and all of Tamil Nadu.",
    siteName: 'Safe Tech India',
    images: [{
      url: '/logo.png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe Tech India | Tamil Nadu Computer Marketplace',
    description: "India's trusted marketplace for refurbished computers and accessories.",
    images: ['/logo.png'],
  },
  verification: {
    google: 'google-site-verification=YOUR_VERIFICATION_CODE',
  }
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
      telephone: '+91-XXXXX-XXXXX',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'ta']
    }
  }

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'Safe Tech India Computer Hub',
    image: 'https://safetechindia.org.in/logo.png',
    '@id': 'https://safetechindia.org.in',
    url: 'https://safetechindia.org.in',
    telephone: '+91-XXXXX-XXXXX',
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
