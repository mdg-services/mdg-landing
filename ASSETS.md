# Assets

This landing page ships **zero external image assets** by design — every visual
is SVG or CSS (the कवच shield diagram, the icon set, the brand mark, the
before/after diagram, the process timeline). That keeps it fast, crisp at any
DPR, and fully on-brand without stock-photo slop.

## What's in the repo
- `public/favicon.svg` — navy chip + MDG cupped-hands mark.
- `public/logo.svg`, `public/logo-mark.svg` — brand lockups (currentColor).
- The MDG mark is also inlined as a React component in `src/components/Brand.tsx`
  so it can recolour for light/dark surfaces.
- All section icons live in `src/components/Icon.tsx` (one stroke-based set).

## If you later want real photography (optional)
The brochure uses warm office/forecourt photos. If you want to reintroduce them,
the natural slots are: the Hero right column (instead of/behind the shield
diagram) and a band near "Why us" or "Mission". Keep them duotoned toward the
navy palette so they don't fight the UI.

Generation/sourcing prompt (for an AI image tool or a stock search):
> "Indian petrol pump / fuel station forecourt at golden hour, a confident
> dealer-owner in business-casual reviewing a tablet, warm and professional,
> shallow depth of field, space for a deep-navy duotone treatment. Also: a calm
> modern back-office with staff on phones/computers (support desk feel)."

Export at 2x, WebP, and apply a navy duotone (`#1A1B4B` shadows → `#F5A524`
highlights at low opacity) for cohesion.
