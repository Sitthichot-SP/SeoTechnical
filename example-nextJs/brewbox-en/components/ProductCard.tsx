import Link from 'next/link'
import type { Product } from '@/lib/products'

const emojis: Record<string, string> = {
  'single-origin': '🫘',
  'house-blend': '☕',
  'monthly-box': '📦',
}

export function ProductCard({ slug, name, description, price, origin, capsules }: Product) {
  return (
    <article className="product-card" itemScope itemType="https://schema.org/Product">
      <div className="card-emoji" aria-hidden="true">{emojis[slug] ?? '☕'}</div>
      <div className="card-body">
        <h3 itemProp="name">{name}</h3>
        <p className="card-desc" itemProp="description">{description}</p>
        <div className="card-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <link itemProp="availability" href="https://schema.org/InStock" />
          <meta itemProp="priceCurrency" content="THB" />
          <meta itemProp="price" content={String(price)} />
          ฿{price.toLocaleString()}
        </div>
        <p className="card-origin">🌍 {origin} · {capsules} capsules</p>
        <Link href={`/products/${slug}`} className="card-link" aria-label={`View details for ${name}`}>
          View details →
        </Link>
      </div>
    </article>
  )
}
