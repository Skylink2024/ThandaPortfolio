# Brike Web (`brikeweb.co.za`)

Official website for **Brike Web** — modern websites for Cape Town small businesses. Core promise: **Your website first. You pay when you love it.**

## Phase 1 status

Layout, navigation, footer, theme, smooth scroll, floating WhatsApp, mobile sticky CTA, and 404 are in place. Homepage content sections start in Phase 2.

### Scripts

```bash
npm run dev        # local development
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # vitest
npm run e2e        # playwright
npm run format     # prettier --write .
```

### Where to edit things

| What | File |
|---|---|
| Business details / WhatsApp / socials | `data/site.ts` |
| Packages & extras | `data/pricing.ts` |
| Portfolio projects | `data/projects.ts` |
| Testimonials (empty until real) | `data/testimonials.ts` |
| FAQ | `data/faq.ts` |
| Builder presets / industries | `data/builder.ts` |
| Design tokens | `src/styles/tokens.css` |

### Replace these assets

- `public/logo.png` / `public/logo-mark.png` — official logo installed
- `public/thanda.jpg` — TODO(Thanda): your photo
- `public/og-image.png` — TODO(Thanda): final 1200×630 social preview (generated OG route also exists)

Dev-only tokens page: `/dev/tokens` (noindex).

### Stack notes

- Next.js App Router + Tailwind CSS v4
- Themes via `next-themes` (`attribute="data-theme"`)
- Fonts: Plus Jakarta Sans (headings), Inter (body), JetBrains Mono (prices)
