# MDG Services — Dealer's कवच landing

Marketing landing page for **MDG Services**, the *Dealer's कवच* program —
compliance, paperwork and on-call support for petrol-pump dealers across India.

It's a **diagram-first** site: the brochure's content is shown as visuals (an
animated कवच shield that absorbs every OMC portal, a before/after comparison, a
bento of the nine service covers, a values spine, a process timeline, animated
stats) rather than long prose, so a dealer understands the offer by scanning.

## Stack

- **Vite + React 19 + TypeScript** (strict)
- **Tailwind CSS 3** — design tokens in `tailwind.config.js`
- **Motion** (Framer Motion) for entrance, scroll-linked and interactive motion
- No external image assets — every visual is SVG/CSS

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serve the production build
npm run lint
```

## Structure

```
src/
  data/content.ts        # ALL copy + data (single source of truth, brochure-derived)
  lib/
    motion.tsx           # <Reveal> / <Stagger> motion wrappers
    anim.ts              # easing, viewport + variant constants
  components/
    Icon.tsx Brand.tsx   # icon set + MDG mark
    Counter.tsx          # in-view animated number
    SectionHeader.tsx
    Navbar.tsx Hero.tsx Marquee.tsx Numbers.tsx Problem.tsx
    Services.tsx MoreServices.tsx WhyUs.tsx Mission.tsx Process.tsx
    Membership.tsx Contact.tsx FAQ.tsx Footer.tsx
  App.tsx main.tsx index.css
```

## Theme

Deep indigo/navy (`#2C2E80`, the brand mark colour) + a gold/amber energy accent
(`#F5A524`, for "Fueling Success"), cool-slate neutrals, one success-green for
"handled" states. Type: Space Grotesk (display) / Inter (body) / Space Mono
(labels) / Tiro Devanagari Hindi (कवच). Respects `prefers-reduced-motion`.

## Editing content

All copy and data live in `src/data/content.ts` — services, extras, values,
pillars, stats, steps, FAQ, contact details. Change it there; components render
from it. See `DECISIONS.md` for why things are the way they are, and
`MANUAL_STEPS.md` / `ROADMAP.md` for what's left.
