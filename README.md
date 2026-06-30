# SEO for Websites — Developer & Designer Guide

> This document covers Technical SEO from the fundamentals to real-world implementation, with concrete Before/After examples and a way to verify the results yourself at every step.

---

## 1. Why Should Dev & Designer Care About SEO?

SEO isn't just the Marketing team's job — most of the SEO problems found on real-world websites come directly from code and design.

According to [Web Almanac 2025](https://almanac.httparchive.org/en/2025/seo), which analyzes millions of websites worldwide:

- Only **65%** of pages use canonical tags correctly
- **10%** of pages have invalid HTML elements in `<head>`, which can cause crawlers to miss the title, meta description, or canonical tag entirely
- Only **48%** of mobile pages pass all three Core Web Vitals at once (2025 data)

| Common Problem | Root Cause | Responsible |
|---|---|---|
| Slow page load | Unoptimized images, large JS bundle | Dev |
| Layout shift | Poor CSS/font loading | Dev + Designer |
| Bot can't read content | Pure CSR, no SSR | Dev |
| Poor structure | No Semantic HTML | Dev + Designer |
| Missing Meta / OG tags | Forgotten or not known to matter | Dev |

---

## 2. Core Web Vitals — Metrics Google Actually Uses

Google uses these 3 metrics to measure "real user experience" (Real User Monitoring), and they're used directly as a ranking signal. They're measured at the **75th percentile** of real visitors over the last 28 days — meaning 75% of visits need a "good" experience for the page to pass.

### LCP — Largest Contentful Paint
- **What it is:** Time for the largest content element on the page to finish loading (usually hero image or h1)
- **Target:** ≤ 2.5 seconds (this is the official threshold from Google, unchanged since it was introduced)
- **How to fix:**
  - Use `<link rel="preload">` on hero images
  - Don't lazy-load images above the fold
  - Use CDN and appropriate image formats (WebP/AVIF)

```html
<!-- ✅ Correct: preload hero image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- ❌ Wrong: lazy-load above the fold image -->
<img src="/hero.jpg" loading="lazy">
```

### CLS — Cumulative Layout Shift
- **What it is:** Total amount of layout shifts during page load
- **Target:** ≤ 0.1
- **How to fix:**
  - Always set `width` and `height` on every `<img>`
  - Reserve font space before loading (font-display: swap)
  - Don't inject content above existing content

```html
<!-- ✅ Correct: specify dimensions on every image -->
<img src="photo.webp" width="800" height="600" alt="...">

<!-- ❌ Wrong: no dimensions -->
<img src="photo.jpg">
```

### INP — Interaction to Next Paint
- **What it is:** Response speed to button press / click (replaced FID in March 2024)
- **Target:** ≤ 200ms
- **How to fix:**
  - Avoid heavy JS on the main thread
  - Use `requestIdleCallback` for non-urgent tasks
  - Code splitting — only load what's needed

> Note: INP is currently the metric that "fails most often" because it measures every interaction throughout the page's lifetime, not just the first one like the old FID. Sites that used to pass FID may not pass INP.

### How to Verify
1. Open Chrome DevTools → **Lighthouse** tab → select "Navigation" mode → click Analyze page load
2. Check the LCP, CLS, and TBT numbers (lab data — simulated locally, not real users)
3. For real user data (field data), open [PageSpeed Insights](https://pagespeed.web.dev) and paste a live, deployed URL — only sites with enough traffic will show CrUX data
4. If your site doesn't have enough traffic yet, rely on **Lighthouse lab data alone** for now and aim to pass within that
5. Re-check after every performance fix you deploy — numbers can shift because network conditions vary between test runs, so run at least 3 times and look at the average

---

## 3. HTML Semantics — The Foundation You Can't Skip

Google reads pages through HTML. If the structure is poor, bots can't understand the content.

### Correct Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AunJai Café | Quality Coffee in Bangkok</title>
  <meta name="description" content="Warm atmosphere café in the heart of Sukhumvit. Open daily 7:00–21:00. Quiet seating perfect for working.">
</head>
<body>

  <header>
    <nav aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/menu">Menu</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>AunJai Café</h1>          <!-- Only 1 per page -->
      <p>Freshly roasted coffee every week...</p>

      <section>
        <h2>Recommended Menu</h2>
        <h3>Hot Coffee</h3>
        <h3>Iced Coffee</h3>
      </section>
    </article>
  </main>

  <aside>
    <h2>Related Articles</h2>
  </aside>

  <footer>
    <address>123 Sukhumvit Rd, Bangkok</address>
  </footer>

</body>
</html>
```

### Heading Hierarchy — Rules You Must Never Break

```
✅ Correct                 ❌ Wrong
h1: Page title             h1: Page title
  h2: Major heading          h3: Skipped level  ← Never do this
    h3: Sub-heading          h2: Back up
  h2: Major heading 2        h1: Two h1 tags    ← Never do this
```

### How to Verify
1. Open the live page → press `Ctrl+U` (View Page Source) — check whether the HTML actually sent from the server has `<header>`, `<nav>`, `<main>`, `<footer>` (not just what shows up in DevTools Elements after rendering, since CSR pages get filled in afterward by JS)
2. Use a Chrome extension like **"HeadingsMap"** or **"Web Developer"** to view the full heading outline of a page in one view, and confirm there's a single h1 with no skipped levels
3. Run Lighthouse's **Accessibility** tab — if the heading hierarchy is wrong, you'll see a clear warning like "Heading elements are not in a sequentially-descending order"
4. Test with a screen reader (e.g. VoiceOver on Mac, NVDA on Windows) — if navigating by heading feels confusing, the structure has a real problem, not just a theoretical one

---

## 4. Meta Tags — The First Thing Google Sees

### Essential Meta Tags

```html
<!-- Title: Most important, 50-60 chars, put main keyword first -->
<title>Fresh Coffee AunJai | Sukhumvit Café Bangkok</title>

<!-- Description: 120-158 chars, compelling enough to click -->
<meta name="description" content="Freshly roasted coffee weekly, cozy atmosphere, free WiFi, open daily 7:00–21:00, near BTS Asok">

<!-- Canonical: Prevent duplicate content -->
<link rel="canonical" href="https://www.aunjai-cafe.com/menu">

<!-- Open Graph: Control preview on Facebook/Line -->
<meta property="og:title" content="AunJai Café">
<meta property="og:description" content="Freshly roasted coffee every week">
<meta property="og:image" content="https://www.aunjai-cafe.com/og-image.jpg">
<meta property="og:url" content="https://www.aunjai-cafe.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AunJai Café">
```

> The character-length guidelines above are **commonly used industry conventions**, not fixed rules from Google — Google has never published an exact number, but content that's too long simply gets truncated in the SERP (roughly ~60 characters for titles, ~155-160 characters for descriptions on desktop).

### How to Verify
1. Use a free tool like [SERP Snippet Optimizer](https://www.highervisibility.com/seo/tools/serp-snippet-optimizer/), or just search your brand name directly on Google and check whether the title/description gets cut off
2. Open **Google Search Console** → **Pages** menu → check which pages are flagged for duplicate title/description
3. Test Open Graph with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — paste the URL and click "Scrape Again" to see the actual preview Facebook/Line will display
4. Verify the canonical tag by viewing page source and confirming `<link rel="canonical">` actually points to the correct URL for that page (not accidentally pointing to a different page — a common mistake)

---

## 5. Structured Data (Schema.org) — Unlock Rich Snippets

Makes Google display special information in search results such as star ratings, opening hours, prices.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "AunJai Café",
  "description": "Quality coffee, warm atmosphere",
  "url": "https://www.aunjai-cafe.com",
  "telephone": "+66-2-123-4567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Sukhumvit Rd",
    "addressLocality": "Bangkok",
    "addressCountry": "TH"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "07:00",
      "closes": "21:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247"
  }
}
</script>
```

**Possible result in Google (not guaranteed):**
```
AunJai Café
★★★★★ 4.8 (247 reviews) · Café
Open now · Closes 21:00
123 Sukhumvit Rd, Bangkok
```

> Important: correctly adding Structured Data doesn't guarantee Google will display a Rich Snippet — Google decides on its own whether to show one, based on context and overall site quality. What we control is making sure the schema is "correct and ready," not the outcome itself.

### How to Verify
1. Paste a URL with schema into Google's [Rich Results Test](https://search.google.com/test/rich-results) directly — it will confirm whether the schema parses correctly and list any errors/warnings
2. Use the [Schema Markup Validator](https://validator.schema.org/) from Schema.org itself to check syntax against spec
3. After deploying, wait for Google to re-crawl the page (this can take days to weeks), then check Google Search Console → **Enhancements** to see if the schema type you added shows up
4. The actual Rich Snippet on SERP may not appear immediately, and may never appear if Google decides the site isn't authoritative enough yet — don't expect instant results right after adding schema

---

## 6. Image Optimization — What Devs Often Overlook

```html
<!-- ✅ Full best practice -->
<picture>
  <!-- AVIF for modern browsers -->
  <source srcset="/coffee.avif" type="image/avif">
  <!-- WebP for older browsers -->
  <source srcset="/coffee.webp" type="image/webp">
  <!-- JPEG fallback -->
  <img
    src="/coffee.jpg"
    alt="Latte art heart, AunJai Café Sukhumvit"
    width="800"
    height="600"
    loading="lazy"
  >
</picture>
```

**Image checklist:**
- `alt` on every image — describe the image accurately, not "image1.jpg"
- Always set `width` and `height` — prevents CLS
- `loading="lazy"` for images below the fold
- `fetchpriority="high"` for hero images
- File size: general images under 100KB, hero under 200KB (a general guideline — adjust based on actual resolution needs)

### How to Verify
1. Open Chrome DevTools → **Network** tab → filter by "Img" → reload the page → check the actual file size of each image in the Size column
2. Use Google's [Squoosh](https://squoosh.app) to compare before/after compression sizes interactively right in the browser
3. Run Lighthouse → check the **"Properly size images"** and **"Serve images in next-gen formats"** sections — they'll tell you exactly which images to fix and how many KB you'd save
4. Check all alt text on the page with an accessibility checker extension like **axe DevTools** — it will list images missing alt or with meaningless alt text (e.g. alt="image")

---

## 7. Rendering Strategy — Choose Correctly

| Strategy | SEO | Speed | Use Case |
|---|---|---|---|
| **SSG** (Static Site Gen) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Blog, landing page, docs |
| **SSR** (Server-Side Render) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | E-commerce, news, dynamic content |
| **ISR** (Incremental Static Regen) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Data that changes occasionally |
| **CSR** (Client-Side Render) | ⭐⭐ | ⭐⭐⭐ | Dashboard, apps requiring login |

> **Simple rule:** If content needs to be indexed by Google → never use pure CSR

### How to Verify
1. Temporarily disable JavaScript in Chrome (DevTools → Cmd/Ctrl+Shift+P → type "Disable JavaScript") and reload — if the main content disappears entirely, the page relies completely on CSR, which is risky for SEO
2. Use **URL Inspection** in Google Search Console → click "View Crawled Page" → check the actual HTML Googlebot sees and compare it with what a user sees
3. Compare View Page Source (`Ctrl+U`) against Inspect Element (`F12`) — if they're very different (e.g. source is empty but inspect shows full content), the content is entirely JS-rendered
4. If you just migrated to SSR/SSG, wait 1-2 weeks and check Google Search Console → **Coverage report** to see if the number of indexed pages has increased

---

## 8. Technical Checklist Before Launch

### robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://www.yoursite.com/sitemap.xml
```

### sitemap.xml (Critical for dynamic sites)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aunjai-cafe.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.aunjai-cafe.com/menu</loc>
    <lastmod>2025-01-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Pre-launch Checklist
- [ ] HTTPS on production
- [ ] Unique `<title>` and `<meta description>` on every page
- [ ] Canonical tag on every page
- [ ] Sitemap.xml created and submitted in Google Search Console
- [ ] robots.txt is not blocking important pages
- [ ] Structured data passes [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Core Web Vitals pass Lighthouse (LCP < 2.5s, CLS < 0.1)
- [ ] Every image has alt text
- [ ] Clean URL structure, no strange parameters
- [ ] 404 page returns proper HTTP status code

### How to Verify
1. Test robots.txt by opening `https://yourdomain.com/robots.txt` directly in a browser — confirm the syntax is correct and you're not accidentally blocking pages you want indexed
2. Submit your sitemap via Google Search Console → **Sitemaps** menu → enter the path and click Submit — it will report how many URLs parsed successfully and any errors
3. Run all 4 Lighthouse categories (Performance, Accessibility, Best Practices, SEO) at least once before launch and save the baseline scores to compare against post-launch
4. Test an actual 404 by visiting a URL that doesn't exist, then check DevTools → Network to confirm the response status code is really `404`, not a soft 404 returning `200` with a "not found" message

---

## 9. Tools You Need to Know

| Tool | Purpose | Price |
|---|---|---|
| Google Search Console | Monitor indexing, errors, performance | Free |
| PageSpeed Insights | Measure Core Web Vitals | Free |
| Lighthouse (DevTools) | Full audit across all dimensions | Free |
| Rich Results Test | Test Structured Data | Free |
| Screaming Frog | Crawl site to find issues | Free (500 URLs) |
| Ahrefs / SEMrush | Keyword research, backlinks | Paid |

---

## 10. SEO by Rendering Strategy — How to Write It in the Real World

> **Same concept across every stack** — but complexity and code style differ because "where HTML is generated" differs

```
SSR / SSG / Next.js  →  HTML built on Server  →  Bot receives complete HTML immediately  ✅
CSR / SPA            →  HTML built in Browser →  Bot receives empty HTML, must wait for JS ⚠️
```

---

### 10.1 Next.js / Nuxt (Recommended — Best SEO)

#### Static Metadata (pages where data doesn't change)

```tsx
// app/menu/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coffee Menu | AunJai Café',
  description: 'Freshly roasted coffee weekly, starting at 65 THB',
  openGraph: {
    title: 'Coffee Menu | AunJai Café',
    images: ['/og-menu.jpg'],
  },
  alternates: {
    canonical: 'https://aunjai-cafe.com/menu',
  },
}

export default function MenuPage() {
  return <main>...</main>
}
```

#### Dynamic Metadata (pages where data comes from DB)

```tsx
// app/menu/[slug]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch data from Backend API then generate dynamic metadata
  const item = await fetch(`https://api.aunjai.com/menu/${params.slug}`)
    .then(r => r.json())

  return {
    title: `${item.name} | AunJai Café`,
    description: item.description,
    openGraph: {
      images: [item.imageUrl],
    },
  }
}
```

#### Dynamic Sitemap (Auto-generate from DB)

```tsx
// app/sitemap.ts
export default async function sitemap() {
  const menuItems = await fetch('https://api.aunjai.com/menu/all')
    .then(r => r.json())

  const menuRoutes = menuItems.map(item => ({
    url: `https://aunjai-cafe.com/menu/${item.slug}`,
    lastModified: item.updatedAt,
    priority: 0.8,
  }))

  return [
    { url: 'https://aunjai-cafe.com/', priority: 1.0 },
    { url: 'https://aunjai-cafe.com/menu', priority: 0.9 },
    ...menuRoutes,  // every menu page auto-generated
  ]
}
```

#### Structured Data Component

```tsx
// components/ProductSchema.tsx
export function ProductSchema({ item }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": item.name,
    "offers": {
      "@type": "Offer",
      "price": item.price,
      "priceCurrency": "THB",
      "availability": item.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

#### ISR — Pages update automatically without full rebuild

```tsx
// revalidate every 60 seconds
export const revalidate = 60

export default async function MenuItemPage({ params }) {
  const item = await fetch(`https://api.aunjai.com/menu/${params.slug}`)
    .then(r => r.json())

  return <ProductSchema item={item} />
}
```

#### How to Verify — Next.js specific
1. Run `npm run build` and read the terminal output — Next.js reports each route as `○ Static`, `● SSG`, or `λ Server`, matching what you intended
2. View source (`view-source:`) of the deployed page and confirm the `<title>` and `<meta>` tags set in `generateMetadata()` actually appear in the raw HTML sent (not just what you see in DevTools after hydration)
3. Test the auto-generated `/sitemap.xml` and `/robots.txt` by visiting them directly — verify the URL list is complete and formatted correctly per the sitemap protocol

---

### 10.2 SPA (Pure React / Vue) — Problems and Solutions

#### Core Problem: Bot Only Sees Empty HTML

```html
<!-- This is ALL Googlebot sees -->
<html>
  <body>
    <div id="root"></div>   <!-- Empty — content not yet rendered -->
    <script src="/bundle.js"></script>
  </body>
</html>
```

#### Solution 1: React Helmet (Only fixes Meta Tags)

```tsx
import { Helmet } from 'react-helmet-async'

function MenuPage({ item }) {
  return (
    <>
      <Helmet>
        <title>{item.name} | AunJai Café</title>
        <meta name="description" content={item.description} />
        <link rel="canonical" href={`https://aunjai.com/menu/${item.slug}`} />
      </Helmet>
      <main>...</main>
    </>
  )
}
```

> ⚠️ **Limitation:** Helmet only fixes Meta Tags — if body content is still CSR, the bot still can't read it

#### Solution 2: Dynamic Rendering (Recommended if migration isn't possible)

Detect User-Agent and route bots to pre-rendered HTML

```nginx
# nginx.conf
map $http_user_agent $is_bot {
  default     0;
  ~Googlebot  1;
  ~bingbot    1;
  ~Twitterbot 1;
}

server {
  location / {
    if ($is_bot) {
      proxy_pass http://prerender-service;  # Bot gets pre-rendered HTML
    }
    try_files $uri /index.html;            # Regular users get SPA
  }
}
```

#### How to Verify — SPA specific
1. Run `curl -A "Googlebot" https://yoursite.com` from the terminal to simulate what Googlebot sees — compare it against what real users see in a browser
2. Check Google Search Console → URL Inspection → "View Crawled Page" → "More Info" tab → "HTTP Response" to verify the content Google has stored matches the real page
3. If using Dynamic Rendering, check nginx/prerender service logs to confirm bots are actually being routed correctly, not falling through to the empty SPA by accident (e.g. if the user-agent string format changes)

---

### 10.3 Headless CMS + Frontend (Contentful / Sanity + Next.js)

Common in organizations where the Content team needs to edit data themselves

```
Content Team → CMS (Contentful / Sanity)
                      │
                   Webhook trigger
                      │
              Next.js ISR revalidate   ← Pages update automatically
                      │
                  CDN Cache            ← Fastest, best SEO
```

```tsx
// Fetch data from Sanity + generate metadata
export async function generateMetadata({ params }) {
  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug: params.slug }
  )

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [urlFor(post.mainImage).width(1200).height(630).url()],
    },
  }
}
```

#### How to Verify
1. Edit data in the CMS and time how long it takes for the webhook to fire and the page to actually revalidate within the configured window (e.g. 60 seconds as in the example)
2. Check the webhook endpoint logs (e.g. Vercel deployment logs) to confirm revalidation triggers successfully every time content is published from the CMS
3. If a page doesn't update as expected, first check whether it's stale CDN cache (try a hard refresh or purge the cache) rather than assuming the revalidation logic is broken

---

### 10.4 What the Backend Is Responsible For

Backend doesn't just send data — it has direct SEO responsibilities

| Responsibility | Example | SEO Impact |
|---|---|---|
| Correct HTTP Status Codes | 404 returns `404`, not `200` with empty page | Bot knows page doesn't exist |
| 301 vs 302 Redirect | Permanent URL change → `301` | Link equity passes correctly |
| Response Headers | `Cache-Control`, `ETag` | CDN and bot cache correctly |
| API sends complete SEO fields | slug, title, description, imageUrl | Frontend can set meta correctly |

```js
// Express.js — Correct Status Codes
app.get('/menu/:slug', async (req, res) => {
  const item = await db.menu.findBySlug(req.params.slug)

  if (!item) {
    return res.status(404).json({ error: 'Not found' })
    // ✅ Returns actual 404, not 200 + error message
  }

  if (item.slug !== req.params.slug) {
    return res.redirect(301, `/menu/${item.slug}`)
    // ✅ 301 if slug changed
  }

  res.json(item)
})
```

#### How to Verify
1. Use `curl -I https://yoursite.com/some-fake-url` to see the raw HTTP status code from the terminal without a browser in the way (some browsers hide parts of the redirect chain)
2. Audit the full redirect chain using Screaming Frog or an extension like **"Redirect Path"** — watch out for chains longer than 2-3 hops, which waste crawl budget
3. Check response headers via DevTools → Network → click any request → "Headers" tab to confirm `Cache-Control` is set as intended

---

### 10.5 Summary — Who Does What

```
Frontend Dev
├── Choose Rendering Strategy (SSR / SSG / ISR)
├── Dynamic Meta + OG tags per stack
├── Structured Data component
├── Image optimization
└── Core Web Vitals (LCP, CLS, INP)

Backend Dev
├── Correct HTTP Status Code on every endpoint
├── Redirect 301 / 302 logic
├── API sends complete SEO fields (slug, meta, og, imageUrl)
└── Generate sitemap.xml from DB

DevOps / Infra
├── CDN + Cache headers
├── HTTPS
└── Dynamic Rendering setup (if using legacy SPA)
```

---

## 11. Content SEO — The Pillar That Technical SEO Alone Can't Replace

> Everything before this section is **Technical SEO** — it makes a page readable to Google. But even flawless Technical SEO won't rank a page if there's no **content that actually answers what people are searching for**.

Google has stated directly that its ranking systems prioritize **"helpful, people-first content,"** not content written purely to game search engines. In short: write for the reader first, and let SEO follow from that.

### 11.1 Keyword Research — Know Before You Write, Don't Guess

Before writing any article, you need to know **what people actually search for** — not what you assume they'd search for.

**Free or low-cost tools that work well:**
- [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/) — Free, requires a Google Ads account (you don't need to run actual ads to view the data)
- [Google Search Console](https://search.google.com/search-console) → **Performance** tab — look at queries your site already ranks for but hasn't fully optimized (the "almost ranking" pages are the easiest wins)
- [AnswerThePublic](https://answerthepublic.com) — see real questions people search around a single keyword
- Google Autocomplete — type a term into the Google search box and read the suggestions; the easiest, free keyword research method there is

### 11.2 Search Intent — Write to Match What People Actually Want

Intent generally falls into 4 categories, and content needs to match the intent behind each keyword.

| Intent | Example keyword | What to write |
|---|---|---|
| **Informational** | "how to brew espresso" | Step-by-step how-to article |
| **Navigational** | "AunJai Café" | A clear, easy-to-find brand homepage |
| **Commercial** | "best coffee capsule brand" | Comparison or review article |
| **Transactional** | "buy coffee capsules free shipping" | Product page with a clear buy button |

> Common mistake: writing a sales-focused (transactional) page for a keyword that's purely informational. Google will see the content as a mismatch for what the searcher wanted, and won't push it up in rankings.

### 11.3 E-E-A-T — The Framework Google Uses to Assess Content Quality

E-E-A-T stands for **Experience, Expertise, Authoritativeness, Trust** — a framework that appears in Google's [Search Quality Rater Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

> Important nuance: E-E-A-T is **not a direct, measurable ranking factor** with its own score. It's a conceptual framework used by both human quality raters and Google's ranking algorithms to assess overall site quality — especially for **YMYL** content (Your Money or Your Life — content affecting health, finance, legal matters, safety, and as of a 2025 update, content related to elections and public institutions as well), where Google applies its strictest standards.

**Concrete things you can actually do to build E-E-A-T:**
- **Experience** — show the writer has hands-on experience: real photos from testing a product, a genuine case study
- **Expertise** — include an author bio with a real name, credentials, or relevant experience, instead of attributing posts to a vague "Team"
- **Authoritativeness** — earn backlinks from credible sites in the same field, get cited by other publications
- **Trust** — use HTTPS, provide clear contact information, cite verifiable sources/statistics, avoid factual errors that could mislead readers

> On AI-generated content: Google doesn't ban AI-assisted writing. But content that reads as purely AI-generated, with no human review, no original insight, or no firsthand data, tends to be classified as low quality. What Google cares about is whether the final result is accurate, trustworthy, and has someone accountable for it — not whether AI was involved in producing it.

### 11.4 Good Content Structure — Writing for Both Readers and Google

```
✅ Good structure
h1: Main heading (matches search intent)
  Opening paragraph: answers the core question immediately, no preamble
  h2: Sub-topic 1
    Detailed content
  h2: Sub-topic 2
    Detailed content
  Summary / FAQ at the end
```

**Writing principles that help SEO:**
- Answer the core question within the first 1-2 sentences — both readers and Google's AI Overview want a fast answer
- Use h2/h3 to break content into sections based on questions readers likely have, not based on how you'd prefer to ramble through the topic
- Length isn't a quality signal — a short article that fully answers the question beats a long one that circles around it
- Updating stale content is better than abandoning it — Google weighs content that's actively maintained and current

### 11.5 Internal Linking — Help Google Understand Your Site Structure

```html
<!-- ✅ Good internal link: descriptive anchor text -->
<a href="/menu/single-origin">Single Origin coffee from Ethiopia</a>

<!-- ❌ Bad: anchor text that says nothing -->
<a href="/menu/single-origin">Click here</a>
```

- Link from blog articles to related product/service pages — this passes authority and guides readers toward conversion
- New pages should be linked from somewhere else on the site — don't leave them as orphan pages with no internal links pointing in
- Use anchor text that describes the destination, not generic phrases like "click here" or "read more"

### How to Verify
1. Check which keywords your site already ranks for via Google Search Console → **Performance** → look at the Position and CTR columns to find queries "almost on page one" (position 11-20) worth optimizing further
2. Test whether content matches search intent by typing your target keyword into Google directly and seeing what kind of content ranks in positions 1-5 (articles, product pages, videos) — then build something comparable
3. Use [Hemingway Editor](https://hemingwayapp.com) or a similar tool to check readability and flag overly long sentences
4. Track results in Google Search Console over a 4-8 week window after publishing or editing content — SEO is a long-term process, results won't show up within a few days

---

## 12. Off-Page SEO — What Happens Outside Your Website

> Sections 1-11 cover everything you do "on your own site." But Google also looks at **what the rest of the web says about you** — a signal you can't directly control, yet it heavily influences ranking.

Search Engine Ranking Factors research has found that off-page signals account for more than 50% of total ranking factor weight, and Backlinko's data shows the #1 result in Google has on average 3.8x more backlinks than positions 2-10.

### 12.1 Backlinks — Why They Still Matter in 2025-2026

A backlink is a link from another site pointing to yours, functioning like a "recommendation" — the more credible the linking site, the stronger the trust signal it sends to Google.

> Important nuance: Google emphasizes that **quality matters far more than quantity** — a single backlink from a credible site in your field is worth more than hundreds of links from low-quality directories, and buying/selling links or using automated link schemes directly violates Google's guidelines, risking a manual action or de-indexing.

**Safe, effective ways to build backlinks:**
- **Digital PR** — create content with original data/statistics and pitch it to media or blogs in your industry for citation
- **Guest posting** — write articles for other sites in your field in exchange for a backlink in the author bio or body
- **Resource page links** — sites running "best tools for..." lists often welcome submissions
- **Broken link building** — find dead links on other sites and offer your content as a replacement
- **Anchor text diversity** — mix branded anchors (brand name), exact match, and natural language; don't repeat the same phrase on every link

```html
<!-- ✅ Good anchor text: descriptive and varied -->
<a href="https://aunjai-cafe.com">AunJai Café</a>
<a href="https://aunjai-cafe.com/menu">Specialty coffee menu from AunJai</a>

<!-- ❌ Same anchor text repeated everywhere, can look manipulative -->
<a href="https://aunjai-cafe.com">Click here</a>
<a href="https://aunjai-cafe.com">Click here</a>
```

### 12.2 Brand Mentions & Social Signals

While likes/shares on social media aren't a direct ranking factor, they have meaningful indirect effects — heavily shared content has a higher chance of being noticed and cited as a backlink elsewhere, and being mentioned frequently (even without a link) is a "credibility" signal that Google's Quality Raters factor into their E-E-A-T assessment, especially mentions on Wikipedia or major news outlets.

### How to Verify
1. Use [Google Search Console](https://search.google.com/search-console) → **Links** menu to see backlinks Google has already recorded (free, though less complete than paid tools)
2. Use a free tool like [Ahrefs Backlink Checker](https://ahrefs.com/backlink-checker) (partial free access) to get a rough view of your backlink profile
3. Audit your backlinks periodically — if you find a large number of links from spam sites you didn't build, consider using Google Search Console's [Disavow Tool](https://search.google.com/search-console/disavow-links)
4. Track unlinked brand mentions with a tool like Google Alerts (free) and consider reaching out to request a link

---

## 13. Local SEO — Critical for Businesses with a Physical Location

> If a business has a physical location (restaurant, café, clinic, retail store), **Local SEO isn't optional — it's a primary channel.** 2026 data shows 46% of all Google searches carry local intent, and 76% of people who search "near me" visit a business within 24 hours.

### 13.1 Google Business Profile (GBP) — The Single Most Important Local SEO Tool

Google uses three primary factors to determine Local Pack ranking, [as stated officially by Google itself](https://support.google.com/business/answer/7091):

| Factor | What it means | How much you control |
|---|---|---|
| **Relevance** | How well the profile matches what's searched | Fully controllable — fill in complete, accurate info |
| **Distance** | How far the business is from the searcher | Not controllable (except via service area settings) |
| **Prominence** | How well-known/credible the business is | Controllable via reviews, backlinks, citations |

> 2025 data shows Google Business Profile signals account for the largest share of Local Pack ranking weight (roughly 32%, per the Whitespark/BrightLocal Local Search Ranking Factors survey), and profiles that are 100% complete get 7x more clicks than incomplete ones.

**Checklist for a complete GBP:**
- [ ] Choose the primary category that matches the business as precisely as possible (the single highest-impact factor of all)
- [ ] Add relevant secondary categories (businesses using 4+ categories average better map rankings)
- [ ] Fill in name, address, phone, and hours completely and accurately, 100%
- [ ] Add real photos, updated regularly (profiles with more photos get up to 70% more location visits)
- [ ] Post Google Posts regularly — signals the business is still active
- [ ] **Never** stuff keywords into the business name that don't match the legal name/signage — Google's August 2025 Spam Update directly penalizes this ("Business Name Stuffing")

### 13.2 Reviews — The Second Most Powerful Factor

Reviews account for roughly 16% of local ranking weight and directly affect conversion — 87-98% of consumers read reviews before choosing a business.

**How to manage reviews correctly:**
- Ask real customers for reviews via QR code, email, or directly after service
- Respond to every review, positive and negative, professionally — responses are an engagement signal Google factors in
- **Never** buy fake reviews — Google's spam filters can detect them, and if a large batch gets removed, your count could drop below the 10-review threshold, hurting your ranking

### 13.3 NAP Consistency — Keeping Basic Info Aligned

NAP stands for **Name, Address, Phone** — it needs to match everywhere the business appears online (your own site, Facebook, GBP, various directories).

> Data shows 64% of small businesses have at least one NAP inconsistency across major directories — if phone numbers or addresses don't match across platforms, Google and AI systems get "confused" and lose confidence in that data.

### 13.4 Local Schema Markup

Use LocalBusiness schema (same concept as the example in Section 5) to confirm business information clearly to Google, helping it appear in rich results like opening hours and review scores.

### How to Verify
1. Search for your own business using terms a real customer would use (e.g. "coffee shop near me") from a mobile device to check whether you appear in the Local Pack (top 3 with map)
2. Use [Google Business Profile Performance](https://business.google.com) to view monthly searches, clicks, and direction requests
3. Check NAP consistency by searching your business name + phone number on Google and comparing the data shown across different sources
4. Check for duplicate GBP listings (often created accidentally), since they split your signals and hurt ranking

---

## 14. Competitive Analysis & Measurement — Closing the SEO Loop

> Technical, Content, Off-Page, Local — all four pillars covered so far are meaningless without knowing **what competitors are doing** and **whether your efforts are actually working**.

### 14.1 Content Gap Analysis — Find What Competitors Have That You Don't

```
Simple Gap Analysis Process
1. Identify your SEO competitors (not necessarily your business competitors — any site fighting for the same ranking is an SEO competitor)
2. Compare keywords competitors rank for that you don't
3. Compare content depth — where do competitors answer questions more thoroughly than you?
4. Compare backlink profiles — where are competitors earning links that you aren't?
5. Prioritize: tackle the gaps with "high opportunity + actually achievable" first
```

> Keyword gap analysis alone isn't enough — sometimes the real gap is a missing "journey stage." A site might have only transactional (sales) content but nothing answering questions from the consideration stage, when people are still comparing options.

### 14.2 SEO KPIs Worth Tracking

| Level | KPI | Where to Measure |
|---|---|---|
| **Visibility** | Impressions, average position | Google Search Console |
| **Capture** | Clicks, CTR | Google Search Console |
| **Engagement** | Time on page, bounce rate | Google Analytics 4 |
| **Outcome** | Conversions, leads, sales | Google Analytics 4 + CRM |

> Caution: don't measure success by "did traffic go up" alone — traffic that doesn't convert doesn't mean SEO is working. Always trace results down to the outcome level.

### 14.3 What Timeline to Expect

SEO doesn't produce instant results — set expectations that match reality.

```
Months 1-3:   Technical fixes deployed, content publishing begins, Google starts indexing
Months 3-6:   Early movement in rankings for lower-competition keywords
Months 6-12:  Noticeably clearer results overall, E-E-A-T and backlinks start accumulating
12+ months:   Compounding returns — older content keeps performing without repeated investment
```

### How to Verify
1. Set up [Google Analytics 4](https://analytics.google.com) connected to Google Search Console to see both visibility and conversion data in one place
2. Build a list of 3-5 real SEO competitors (verified by searching your actual target keywords, not guessed from business competitors) and track their rankings against yours monthly
3. Review results every 4-8 weeks, not daily — SEO has normal short-term volatility, and checking too frequently causes unnecessary alarm
4. Re-run a technical audit every quarter, since sites that ship code frequently can regress without anyone noticing

---

## 15. Summary — Priority Order

```
High priority + Quick wins:
├── Add Title, Meta Description, Canonical to every page
├── Use correct Semantic HTML
├── Add alt text to every image
└── Add width/height to every <img>

High priority + Takes time:
├── Adjust Rendering Strategy (SSR/SSG)
├── Add Structured Data
├── Optimize Core Web Vitals
└── Create Sitemap + submit in Search Console

Can do later:
├── Image formats (AVIF/WebP)
├── Advanced caching strategy
└── International SEO (hreflang)
```

---

## A Note on Data Accuracy

- Core Web Vitals thresholds (LCP ≤2.5s, CLS ≤0.1, INP ≤200ms) are official figures from Google, verified against live documentation at [Google Search Central](https://developers.google.com/search/docs/appearance/core-web-vitals) and [web.dev](https://web.dev/articles/vitals) — these have not changed since INP replaced FID in March 2024
- The Web Almanac statistics in Section 1 are sourced from the [Web Almanac 2025 SEO chapter](https://almanac.httparchive.org/en/2025/seo) by HTTP Archive
- Title/description length guidelines (50-60 / 120-158 characters) are **commonly used industry best practices**, not fixed rules from Google
- The Lighthouse scores and load times shown in `seo-demo.html` are **fictional examples for demonstration purposes only**, not results from measuring a real website. If presenting this material, make clear these are illustrative, not an actual benchmark.
- The E-E-A-T and YMYL content in Section 11 is sourced from Google's [Search Quality Rater Guidelines, latest revision (September 2025)](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — verified against the live documentation at the time of writing
- The Off-Page SEO (Section 12) and Local SEO (Section 13) statistics are sourced from the BrightLocal/Whitespark Local Search Ranking Factors survey, Backlinko's off-page SEO guide, and the Google Business Profile Help Center — these are industry-wide figures; actual numbers will vary by business type and local competition

---

*This document is part of the SEO Presentation Demo for Dev & Designer teams*
*Before/After web demo is in `seo-demo.html`*
