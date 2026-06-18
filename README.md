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
npm run dev            # http://localhost:5173  (includes the /api dev server)
npm run build          # tsc -b && vite build  → dist/
npm run preview        # serve the production build
npm run lint
npm run typecheck:api  # type-check the serverless backend (server/ + api/)
npm run email:preview  # render email templates to ./.email-preview/*.html
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

api/
  enroll.ts              # Vercel serverless fn — POST /api/enroll (thin adapter)
server/                  # transport-agnostic backend core (Node)
  validation.ts          # Zod payload schema (single source of truth)
  enroll.ts              # processEnrollment(): validate → fan out emails
  mailer.ts              # Nodemailer transport + sendTemplate()
  emails/
    layout.ts            # one branded HTML shell + helpers
    templates.ts         # pure data → EmailContent (add new emails here)
```

## Email backend

The `/register` enrolment form posts to `POST /api/enroll`, which emails the
details to the MDG inbox and a welcome note to the dealer.

- **Where:** Vercel Serverless Function (`api/enroll.ts`). Locally, a Vite dev
  middleware serves the same route by calling the same core, so `npm run dev`
  works end-to-end.
- **Adding another email:** write a `(data) => EmailContent` function in
  `server/emails/templates.ts`, then `sendTemplate(myEmail(data), to)`. The
  transport and branded layout are shared.
- **Config:** set `GMAIL_USER` + `GMAIL_APP_PASSWORD` (Google App Password) and
  optionally `ENROLLMENT_NOTIFY_TO` / `MAIL_FROM_NAME`. See `.env.example`.
  Without credentials the dev server logs emails instead of sending; production
  requires them. Swapping Gmail for Resend/SES touches only `server/mailer.ts`.

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
