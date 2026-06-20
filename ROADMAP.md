# Roadmap — beyond the MVP

The rebuilt landing page is the MVP. Future, phased work:

## Phase 1 — Make it convert
- Real lead-capture backend for the callback form (see `MANUAL_STEPS.md` #2),
  with spam protection and a thank-you email.
- "Get the app" / app-store entry point and a click-to-call CTA (high-intent in
  this audience). Support lives in the app, not a third-party chat channel.
- Analytics + basic conversion events (call clicks, form submits, CTA clicks).

## Phase 2 — Trust & proof
- Real dealer testimonials / logos of OMCs served (with permission).
- A short "case in numbers" block per region (states served, on-time rate).
- Replace illustrative metrics in `data/content.ts` with audited figures.

## Phase 3 — Reach
- Hindi-first language toggle (the audience is Hindi-belt heavy; the brand
  already leans bilingual). Content is centralised in `data/content.ts`, so a
  second locale is a clean addition.
- SEO: per-section structured data, sitemap, OG image, faster font loading.
- A `/services/[id]` detail route per program cover for long-tail search.

## Phase 4 — Content depth
- A simple blog/notices section for compliance deadline updates (genuine value
  to dealers, strong SEO).
- Downloadable one-pager that mirrors the brochure.

## Known constraints carried from this build
- Bundle is ~118 kB gzip (mostly `motion`). Fine for a marketing page; if it
  ever matters, lazy-load below-the-fold motion or drop to CSS-only animation.
- Illustrative figures (1,400+ dealers, 14 states, "≈11 hrs/week", "22 min")
  read as real and on-brand but should be confirmed against actual data.
