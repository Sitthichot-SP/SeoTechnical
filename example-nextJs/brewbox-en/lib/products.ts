// lib/products.ts — Mock data standing in for a real API

export interface Product {
  slug: string
  name: string
  description: string
  price: number
  origin: string
  capsules: number
  imageUrl: string
  inStock: boolean
  updatedAt: string
  rating: number
  reviewCount: number
}

export const products: Product[] = [
  {
    slug: 'single-origin',
    name: 'Single Origin',
    description: 'Single-origin coffee with a distinct flavor — fruit and floral notes, perfect for beginners.',
    price: 290,
    origin: 'Ethiopia Yirgacheffe',
    capsules: 10,
    imageUrl: '/capsule-single.jpg',
    inStock: true,
    updatedAt: '2025-01-01T00:00:00Z',
    rating: 4.8,
    reviewCount: 428,
  },
  {
    slug: 'house-blend',
    name: 'House Blend',
    description: "BrewBox's signature blend — smooth, with notes of chocolate and caramel, easy to drink every day.",
    price: 490,
    origin: 'Brazil + Colombia',
    capsules: 20,
    imageUrl: '/capsule-blend.jpg',
    inStock: true,
    updatedAt: '2025-01-01T00:00:00Z',
    rating: 4.9,
    reviewCount: 612,
  },
  {
    slug: 'monthly-box',
    name: 'Monthly Box',
    description: 'Monthly subscription — fresh coffee every month, sourced from renowned farms worldwide, save up to 20%.',
    price: 790,
    origin: 'Rotating Origins',
    capsules: 40,
    imageUrl: '/capsule-subscription.jpg',
    inStock: true,
    updatedAt: '2025-01-01T00:00:00Z',
    rating: 4.9,
    reviewCount: 244,
  },
]

export function getProduct(slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null
}

export const reviews = [
  { author: 'Napa', location: 'Bangkok', text: 'The coffee is amazing, honestly better than my neighborhood café. Tried Ethiopia and got hooked.' },
  { author: 'Thanawat', location: 'Chiang Mai', text: "I've been on the Monthly Box for 3 months now, totally worth it. I get to try new coffee every month, and shipping is fast too." },
  { author: 'Panisara', location: 'Khon Kaen', text: 'The capsules are compostable so I never feel guilty drinking it. Great coffee, nice packaging too.' },
]
