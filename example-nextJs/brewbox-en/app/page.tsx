import type { Metadata } from 'next'
import { products, reviews } from '@/lib/products'
import { ProductCard } from '@/components/ProductCard'
import { ReviewCard } from '@/components/ReviewCard'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.brewbox.th' },
  openGraph: { url: 'https://www.brewbox.th' },
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'BrewBox Premium Coffee Capsules',
  description: 'Specialty-grade coffee capsules sourced from top farms worldwide.',
  brand: { '@type': 'Brand', name: 'BrewBox' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'THB', price: '290',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9', reviewCount: '1284',
  },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Main menu">
          <a href="/" className="logo" aria-label="BrewBox home">BrewBox</a>
          <ul className="nav-links">
            <li><a href="#products">Products</a></li>
            <li><a href="#features">Why BrewBox</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-inner">
          <h1 id="hero-heading">
            Specialty<span>Coffee Capsules</span><br />Delivered to Your Door
          </h1>
          <p className="hero-desc">
            Beans sourced from top farms across 12 countries, freshly packed into capsules every week.
            Compatible with all Nespresso machines.
          </p>
          <a href="#products" className="btn">Shop Packages</a>
          <a href="#features" className="btn btn-outline">About BrewBox</a>
          <span className="hero-emoji" aria-hidden="true">☕</span>
        </div>
      </section>

      <div className="rating-strip" role="status" aria-label="Product review rating">
        ★★★★★ 4.9 · Over 1,284 customer reviews · Free shipping nationwide
      </div>

      <main id="main-content">
        <section className="products" id="products" aria-labelledby="products-heading">
          <div className="container">
            <h2 id="products-heading">Choose Your Perfect Package</h2>
            <p className="section-sub">3 tiers of coffee capsules for every lifestyle</p>
            <div className="product-grid">
              {products.map((p) => <ProductCard key={p.slug} {...p} />)}
            </div>
          </div>
        </section>

        <section className="features" id="features" aria-labelledby="features-heading">
          <div className="container">
            <h2 id="features-heading">Why BrewBox</h2>
            <p className="section-sub">Proven quality, trusted by over 50,000 customers</p>
            <div className="feature-grid">
              {[
                { icon: '☕', title: 'Specialty Grade', desc: 'Only beans scoring SCA 80+ make it into every batch.' },
                { icon: '📦', title: 'Freshly Packed', desc: 'Roasted and packed into capsules weekly, guaranteed fresh.' },
                { icon: '🚚', title: 'Free Nationwide Shipping', desc: 'Express delivery within 24 hours, on every order, no minimum.' },
                { icon: '♻️', title: 'Compostable Capsules', desc: '100% biodegradable within 12 weeks. Better for the planet.' },
              ].map((f) => (
                <div key={f.title} className="feature-item">
                  <div className="feature-icon" aria-hidden="true">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reviews" id="reviews" aria-labelledby="reviews-heading">
          <div className="container">
            <h2 id="reviews-heading">Real Customer Reviews</h2>
            <p className="section-sub">★★★★★ 4.9 average from 1,284 reviews</p>
            <div className="review-grid">
              {reviews.map((r) => <ReviewCard key={r.author} {...r} />)}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">BrewBox</div>
            <p className="footer-copy">© 2025 BrewBox Thailand. All rights reserved.</p>
          </div>
          <address>
            <strong style={{ color: '#fff' }}>Contact Us</strong><br />
            <a href="mailto:hello@brewbox.th">hello@brewbox.th</a><br />
            <a href="tel:+6620001234">02-000-1234</a><br />
            123 Silom Road, Bang Rak, Bangkok 10500
          </address>
        </div>
      </footer>
    </>
  )
}
