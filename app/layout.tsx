import './globals.css'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safe Tech India',
  description: "India's #1 Dedicated Marketplace for Computer Dealers & Wholesalers. Buy & Sell Refurbished Laptops, Desktops & Accessories.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://safetechindia.org.in',
    title: 'Safe Tech India | B2B & B2C Computer Marketplace',
    description: "India's trusted marketplace for refurbished computers. Join our network of verified dealers and service engineers.",
    siteName: 'Safe Tech India',
    images: [{
      url: '/logo.png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe Tech India',
    description: "India's trusted marketplace for refurbished computers.",
    images: ['/logo.png'],
  },
  keywords: ['Refurbished Laptops', 'Computer Dealers India', 'B2B Marketplace', 'Safe Tech India'],
  verification: {
    google: 'google-site-verification=YOUR_VERIFICATION_CODE', // Replace with your code
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
