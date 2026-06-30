# BrewBox — SEO Demo Project (Next.js)

A sample landing page selling coffee capsules, built with Next.js (App Router) to demonstrate correct, real-world SEO implementation. Covers Technical SEO, Dynamic Metadata, Structured Data (Product + Organization + LocalBusiness), and auto-generated Sitemap/Robots.

> The full companion guide is in `seo-presentation-en.md` / `seo-guide-en.html` (provided separately, not included in this zip).

---

## How to Run the Project

### 1. Install dependencies

Requires [Node.js](https://nodejs.org) version 18.18 or later (20+ recommended)

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

The page will hot-reload every time you edit a file under `app/` or `components/`

### 3. Build for production (optional)

If you want to test it the way it would behave once deployed:

```bash
npm run build
npm run start
```

`npm run build` shows you how each route is rendered (Static, SSG, or Server) so you can confirm it matches the intended Rendering Strategy — this is one way to verify Section 10 of the guide in practice.

---

## Pages Included in This Project

| URL | Description |
|---|---|
| `/` | Main landing page — hero, product list, reviews |
| `/products/single-origin` | Product page — dynamic metadata based on slug |
| `/products/house-blend` | Product page |
| `/products/monthly-box` | Product page |
| `/sitemap.xml` | Sitemap auto-generated from the product list in `lib/products.ts` |
| `/robots.txt` | Auto-generated robots.txt |

---

## Key File Structure

```
app/
├── layout.tsx              ← Site-wide metadata + Organization/LocalBusiness schema
├── page.tsx                ← Main landing page + Product schema
├── globals.css             ← All styling
├── sitemap.ts               ← Auto-generates sitemap.xml
├── robots.ts                ← Auto-generates robots.txt
└── products/[slug]/page.tsx ← Product page, dynamic generateMetadata(), SSG

components/
├── ProductCard.tsx          ← Product card with Microdata
└── ReviewCard.tsx           ← Review card with Review schema

lib/
└── products.ts               ← Mock data standing in for a real API (in production, fetch from a database/CMS)
```

---

## SEO Concepts Demonstrated in This Code

- **Dynamic Metadata** — see `app/products/[slug]/page.tsx`, the `generateMetadata()` function sets a unique title/description per product automatically
- **Three types of Structured Data** — Product (on product pages), Organization + LocalBusiness (in `layout.tsx`, present on every page)
- **NAP Consistency** — the address/phone number in the LocalBusiness schema matches what's shown in the footer character-for-character, per the principle explained in the guide
- **SSG (Static Site Generation)** — every product page is pre-rendered at build time via `generateStaticParams()`
- **Auto-generated sitemap/robots** — no need to hand-write XML; Next.js generates them from code

---

## Notes

- All product data is **mock data** in `lib/products.ts` — in a real project, fetch this from an API/database/CMS instead
- Product images in the UI are emoji placeholders (🫘☕📦) so the project runs immediately without needing actual image files
- The domain `brewbox.th` and all business details are fictional, for demonstration purposes only
