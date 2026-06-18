# Decisions — Landing rebuild (v2)

Diagram-first rebuild of the MDG Services / Dealer's कवच landing page. Source of
truth for content + theme is the dealer brochure (Canva, "Dealer's कवच").

## Scope
- **D1.** Scope is the `mdg-landing` surface only — not the full multi-repo
  product. `/build-product`'s pipeline was right-sized to: brand/content
  extraction (brochure) → design system → cohesive build → QA → anti-slop. A
  marketing landing is a single-surface design task; fanning it out to many
  agents would cause design drift, so it is built by one hand against one token
  system.

## Stack
- **D2.** Keep the existing stack — Vite + React 19 + TypeScript + Tailwind 3.
  It already builds and deploys to Vercel; switching to Next.js would be churn
  for no gain on a static marketing page.
- **D3.** Add `motion` (Framer Motion) for orchestrated entrance, scroll-linked,
  and interactive diagram animation. Replaces the hand-rolled IntersectionObserver
  reveal hooks. Respects `prefers-reduced-motion`.

## Brand & theme (from brochure)
- **D4.** Adopt the brochure's **deep indigo/navy** as primary (`#2C2E80`,
  taken from the brand favicon) with a full tint scale. This replaces the prior
  warm-paper/cream editorial theme.
- **D5.** Add a **gold/amber energy accent** (`#F5A524`) — ties to "Fueling
  Success / Your Satisfaction Fuels Our Energy" and keeps the palette
  distinctive (navy + gold + slate), away from the generic AI purple-glass look.
  One success-green is used only for "handled/done" diagram states.
- **D6.** Type: **Space Grotesk** (display, structural/technical feel) + **Inter**
  (body) + **Space Mono** (data/eyebrow labels) + **Tiro Devanagari Hindi** (कवच).
  Drops the Fraunces serif — a grotesk reads more "structural/diagrammatic".

## Content & structure
- **D7.** Page is **diagram-first**, not reading-first. Each brochure data block
  becomes a visual: shield/कवच hero, converging-portals problem diagram, the 9
  "Program Service covers" as an interactive structured grid, "More services"
  bubble cluster, Why-choose-us tiles, Mission & Values cluster, animated process
  timeline, animated stat counters.
- **D8.** Preserve the strong, brochure-faithful copy already written in the
  prior version; restructure it into diagrams rather than long prose lists. Drop
  the text-heavy "typical week" reading list (too content-oriented — the exact
  complaint).
- **D9.** Faithfully represent all 9 brochure service categories + the 4 "More
  services" + 7 Mission values + 4 Why-us pillars. Keep the brochure's toll-free
  (1800-345-6512) and mdgservices.in contact details.

## Dealer enrolment page (`/register`)
- **D11.** Added `react-router-dom` and a second route, `/register`, holding the
  Terms & Conditions (verbatim from the dealer agreement) followed by the
  enrolment form. Kept it a client-side route (SPA) with a `vercel.json` rewrite
  so deep links resolve. The landing's "Reserve your slot" CTA and a footer link
  point to it.
- **D12.** T&C text is stored verbatim in `data/content.ts` (`TERMS`); the only
  edit is de-duplicating an obvious "It is It is" typo and normalising
  "MAJEOUR"→"MAJEURE". Legal wording is otherwise untouched.
- **D13.** The enrolment form validates client-side (required fields + a required
  "agree" checkbox gating submit) and shows a success state, but like the contact
  form it does **not** post anywhere yet — see `MANUAL_STEPS.md`.

## Skills / tooling
- **D10.** `ui-ux-pro-max` and `taste-skill` are already installed locally as
  Claude skills, so they are referenced directly rather than cloned into the repo
  (the `/build-product` clone-and-pin step is satisfied by the local install).
