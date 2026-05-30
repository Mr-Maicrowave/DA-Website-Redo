# DA Tuition Website

Marketing and content site for **DA Tuition**, a K-12 tutoring service based in Canley Heights, NSW. Built with React, TypeScript, and Vite. Winner, *Outstanding Education Service*, Fairfield City Local Business Awards 2025.

## Business

- **Address:** Level 1/229 Canley Vale Rd, Canley Heights NSW 2166
- **Phone:** 0401 940 207
- **Hours:** Tue-Fri 5pm-9pm, Sat 9am-6pm, Sun 10am-7pm
- **Model:** Small-group tutoring (3-5 students)
- **Track record:** 20+ years, 650+ students helped since 2005, 393 5-star Google reviews

## Tech Stack

- **React 18.3** + **TypeScript** + **Vite 5** (SWC)
- **Tailwind CSS 3** + **shadcn/ui** (Radix UI primitives)
- **React Router v6**, **TanStack Query**, **React Hook Form** + **Zod**
- **Framer Motion** for transitions, **react-markdown** + `rehype-raw` + `remark-gfm` for article content
- **react-helmet-async** for per-page SEO meta
- **Puppeteer** for the production smoke test

## Quick Start

```bash
npm install
npm run dev          # http://localhost:8080
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 8080 |
| `npm run build` | Generates sitemap, runs `tsc --noEmit`, then builds for production |
| `npm run build:dev` | Faster development-mode build (no typecheck gate) |
| `npm run typecheck` | TypeScript compile check, no emit |
| `npm run lint` | ESLint flat-config |
| `npm run preview` | Serve the production build locally |
| `npm run sitemap` | Regenerate `public/sitemap.xml` from route config |
| `npm run smoke` | Puppeteer-based route sweep against the deployed site |
| `npm run optimize:newsletters` | Image optimization for newsletter assets |

Note: `npm run build` will fail if `tsc --noEmit` fails. Missing imports break the build before Vite runs.

## Project Structure

```
src/
├── components/          Page-section components (Hero, Navigation, Footer, ...)
│   ├── ui/              shadcn/ui primitives (40+)
│   ├── articles/        Markdown rendering (SectionedMarkdown, ...)
│   ├── reviews/         DualRowCarousel, ReviewModal, ReviewCarouselCard
│   └── teachers/        Teacher profiles and filtering
├── pages/               Route components (subjects/, programs/, locations/)
├── data/                Static content (reviews.json, teachers.ts)
├── hooks/               Custom hooks (use-mobile, use-toast)
├── lib/                 Utilities + markdown sectionizer
├── styles/              da-colors.css, pastel.css
└── App.tsx              Route configuration

public/
├── articles/            18 educational articles (markdown) + articles-index.json
└── Photos and Videos/   Media assets

scripts/                 generate-sitemap.mjs, smoke-test.mjs, optimize-newsletters.js
docs/                    SEO + content workflow docs
context/                 Design principles, style guide, review agent brief
```

## Routes

### Core
- `/` Home
- `/articles`, `/articles/:slug` Educational blog (18 articles)
- `/success-stories`, `/testimonials/:slug` Reviews and testimonials
- `/interview` Consultation booking
- `/principal-reflections` Principal's writing
- `/faq`, `/privacy-policy`

### Programs & subjects
- `/subjects` (overview)
- `/subjects/english`, `/mathematics`, `/science`, `/business-studies`, `/legal-studies`
- `/programs/primary-school`, `/programs/high-school`, `/programs/hsc`
- `/hsc-excellence`, `/learning-formats`, `/why-choose-da`, `/our-approach`

### Local SEO landing pages
- `/tutoring-canley-heights`
- `/tutoring-cabramatta`
- `/tutoring-fairfield`
- `/tutoring-canley-vale`
- `/tutoring-smithfield`
- `/tutoring-lansvale`

### Aliases / redirects
- `/reviews`, `/appreciation-advice`, `/testimonials` → `/success-stories`
- `/teachers`, `/our-teachers` → `/find-teacher`

## Content

- **Articles:** 18 entries in `public/articles/articles-index.json`. Markdown lives in `public/articles/`. The article viewer uses `SectionedMarkdown` to split content at H2/H3 boundaries and apply per-category card layouts.
- **Reviews:** 393 real 5-star Google reviews in `src/data/reviews.json`. Rendered through a dual-row carousel with opposing scroll directions.
- **Testimonials:** Long-form parent / student stories with dedicated `/testimonials/:slug` pages.

## Design System

- **Brand colors:** Blue / Orange / Green palette (see `src/styles/da-colors.css`)
- **Subject card themes:** Pastel per subject (`src/styles/pastel.css`)
- **Section transitions:** Each section is wrapped in a gradient `<div>` in `Index.tsx` whose end color matches the next section's start color. Components themselves are background-transparent. See `CLAUDE.md` for the full color flow.
- **Animations:** `fade-in`, `slide-up`, `float`, 3D `flip-card` for teacher profiles
- **Path alias:** `@/` → `src/` (see `vite.config.ts`, `tsconfig.json`)

## SEO

- Per-route meta via `react-helmet-async`
- `sitemap.xml` generated from route config at build time (`scripts/generate-sitemap.mjs`)
- Suburb landing pages for local search
- `/privacy-policy` published
- Structured data + GSC/Bing/GA4 wiring tracked in `docs/seo/`

## Deployment

Deployed to **Vercel**. Production smoke test (`npm run smoke`) and a GitHub Action sweep the live routes via Puppeteer after every deploy.

## Quality Bar

No automated test suite. Verification before shipping:

1. `npm run lint`
2. `npm run build` (typecheck + production build)
3. `npm run dev` and click through the affected pages
4. `npm run smoke` against the deployed URL

For larger UI changes, follow the design-review workflow in `context/design-principles.md`.

## Author

Built and maintained by **Jared Huynh** ([@JaredHuynhning](https://github.com/JaredHuynhning)).

## License

Proprietary. All rights reserved by DA Tuition.
