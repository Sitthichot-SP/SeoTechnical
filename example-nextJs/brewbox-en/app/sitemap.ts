import { MetadataRoute } from 'next'
import { products } from '@/lib/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `https://www.brewbox.th/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: 'https://www.brewbox.th', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://www.brewbox.th/products', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...productRoutes,
  ]
}
