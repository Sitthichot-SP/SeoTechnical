import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brewbox.th'),
  title: {
    default: 'BrewBox — Premium Coffee Capsules, Delivered',
    template: '%s | BrewBox',
  },
  description: 'Specialty-grade coffee capsules sourced from top farms. Starting at ฿290/box. Free shipping nationwide.',
  robots: { index: true, follow: true },
  authors: [{ name: 'BrewBox Thailand', url: 'https://www.brewbox.th' }],
  openGraph: {
    type: 'website',
    siteName: 'BrewBox',
    locale: 'en_US',
    title: 'BrewBox — Premium Coffee Capsules, Delivered',
    description: 'Specialty coffee capsules from ฿290, free shipping nationwide',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'BrewBox premium coffee capsules' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrewBox — Premium Coffee Capsules',
    description: 'Specialty coffee capsules from ฿290, free shipping nationwide',
    images: ['/og-image.jpg'],
  },
  icons: { icon: '/favicon.ico' },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BrewBox Thailand',
  url: 'https://www.brewbox.th',
  logo: 'https://www.brewbox.th/logo.png',
  sameAs: ['https://www.facebook.com/brewboxth', 'https://www.instagram.com/brewboxth'],
}

// LocalBusiness schema — included because BrewBox has a real office/pickup
// location in Silom in addition to nationwide shipping. Pure online-only
// businesses with no physical location should NOT include this schema.
// NAP (Name, Address, Phone) must match the footer exactly — see Section 13.3 NAP Consistency
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'BrewBox Thailand',
  image: 'https://www.brewbox.th/storefront.jpg',
  url: 'https://www.brewbox.th',
  telephone: '+66-2-000-1234',
  priceRange: '฿฿',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Silom Road',
    addressLocality: 'Bang Rak',
    addressRegion: 'Bangkok',
    postalCode: '10500',
    addressCountry: 'TH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.7244,
    longitude: 100.5347,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1284',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
