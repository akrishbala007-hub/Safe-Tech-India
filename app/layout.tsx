import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safe Tech India | Premium Refurbished Computers',
  description: 'Safe Tech India dealers, trusted quality. Find the best computer accessories in your city.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
