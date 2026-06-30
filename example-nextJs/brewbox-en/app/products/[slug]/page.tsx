import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProduct, products } from '@/lib/products'

interface Props { params: { slug: string } }

// Dynamic Metadata — Google sees a unique title/description for every product
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct(params.slug)
  if (!product) return { title: 'Product Not Found', robots: { index: false, follow: false } }

  return {
    title: product.name,   // template from layout: "Single Origin | BrewBox"
    description: `${product.description} ฿${product.price}, free shipping nationwide.`,
    alternates: { canonical: `https://www.brewbox.th/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | BrewBox`,
      description: product.description,
      url: `https://www.brewbox.th/products/${product.slug}`,
    },
  }
}

// SSG — pre-render every slug at build time
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

const emojis: Record<string, string> = {
  'single-origin': '🫘',
  'house-blend': '☕',
  'monthly-box': '📦',
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug)
  if (!product) notFound()   // returns a correct HTTP 404

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: 'BrewBox' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'THB',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Main menu">
          <a href="/" className="logo">BrewBox</a>
          <ul className="nav-links">
            <li><a href="/#products">Products</a></li>
            <li><a href="/#reviews">Reviews</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content">
        <div className="product-page">
          <Link href="/" className="back-link">← Back to home</Link>

          <article itemScope itemType="https://schema.org/Product">
            <div className="product-hero-emoji" aria-hidden="true">
              {emojis[product.slug] ?? '☕'}
            </div>

            {/* Only one h1 = product name = the primary keyword of this page */}
            <h1 itemProp="name">{product.name}</h1>
            <p className="product-desc" itemProp="description">{product.description}</p>
            <p className="product-origin">🌍 {product.origin} · {product.capsules} capsules</p>

            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content="THB" />
              <meta itemProp="price" content={String(product.price)} />
              <link itemProp="availability" href={product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
              <p className="product-price">฿{product.price.toLocaleString()}</p>
              {product.inStock
                ? <button className="add-to-cart" type="button">Add to Cart</button>
                : <p>Out of stock</p>
              }
            </div>
          </article>
        </div>
      </main>

      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-brand">BrewBox</div>
            <p className="footer-copy">© 2025 BrewBox Thailand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
