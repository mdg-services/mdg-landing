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
  data/content.ts        # data only: ids, icons, hrefs, portal names, counter figures
  i18n/
    lang.tsx             # <LangProvider>, useT(), useLang(), the preference rules
    parity.ts            # dev-only check that both dictionaries line up
    en/*.ts hi/*.ts      # ALL copy, one file per section, brochure-derived
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
- **Transport:** Nodemailer over plain SMTP (provider-agnostic), set up for
  Hostinger, sending from `noreply@mdgservices.in`. Config via env —
  `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM`, `ENROLLMENT_NOTIFY_TO`. See
  `.env.example`. Without credentials the dev server logs emails instead of
  sending; production requires them. Switching providers touches only the env +
  `server/mailer.ts`.

## Theme

Deep indigo/navy (`#2C2E80`, the brand mark colour) + a gold/amber energy accent
(`#F5A524`, for "Fueling Success"), cool-slate neutrals, one success-green for
"handled" states. Type: Space Grotesk (display) / Inter (body) / Space Mono
(labels) / Tiro Devanagari Hindi (कवच). Respects `prefers-reduced-motion`.

## The August 2026 pass

A correctness and hygiene pass over the existing page. No new sections survived
the review; what changed is what the page claims.

- **The animated bars under the stat figures were fake.** `BARS = [0.94, 0.68,
  0.82, 0.6]` was a hard-coded constant rendered as if it were data, on a page
  arguing that our numbers are checkable. Gone.
- **The four headline stats were illustrative** and were flagged as such in
  `ROADMAP.md`. They are replaced with figures that can be produced on demand.
- **"24/7 support" contradicted "9am to 9pm"** elsewhere on the same page. The
  hours are 9am to 9pm.
- **"Avg. targets hit: 112%"** could not be sourced and is gone.
- **Every em-dash in visible copy** was rewritten into a full stop, a comma or
  a colon.
- **Devanagari was being clipped.** The display line-height of 1.02 crops the
  marks that sit above the shirorekha, so `पंप खुलने से पहले।` rendered as
  `पप खुलन स पहल।`. `.deva` now carries its own line-height.
- Added the Hindi training-library section, cache and security headers, a
  canonical URL and a real `og:image`.

### What this page deliberately does not say

The page sells the outcome, never the method. It does not describe how work
reaches us, how reports are produced, or what any internal tool looks like, and
it carries no screenshots of anything a customer does not already see. Keep it
that way: a marketing page is the wrong place to publish operational detail.

`npm run review` renders the page at desktop and mobile widths and fails on
horizontal overflow, broken images, em-dashes, or console errors.
`npm run og` regenerates the social card.

## Two languages

The page reads in English or Hindi, and which one a dealer gets is decided in
this order:

1. what they last chose here, if they ever chose;
2. otherwise whatever their phone or browser is set to.

A dealer who never touches the switch keeps following their phone on every
visit. The moment they touch it, that choice is theirs and the phone stops
deciding. `?lang=hi` counts as touching it, so a Hindi link forwarded into a
dealer WhatsApp group opens in Hindi and stays that way; the parameter is then
stripped off the URL. The choice is kept in `localStorage` under `mdg.lang`,
and a browser that refuses storage falls back to the phone's language rather
than breaking.

- Devanagari is not Latin with different glyphs. The Hindi block at the bottom
  of `src/index.css` undoes the three things this page does to Latin type that
  break it: display line-heights (0.94 on `.text-mega`) clip the vowel marks
  that hang above the shirorekha, tracking pulls apart the bar that joins the
  letters of a word, and a headline measure set in `ch` is too narrow for a
  language that runs about 15% longer. It is written flat rather than nested,
  because these dealers are on old Android WebViews.
- Noto Sans Devanagari sits *behind* Inter, Space Grotesk and Space Mono in
  every font stack. Each of its `@font-face` rules carries a `unicode-range`,
  so a reader on the English page never reaches it and never downloads it.
  Tiro Devanagari Hindi stays the face for the कवच brand marks only.
- The Terms & Conditions are translated so a Hindi reader can understand what
  they are agreeing to, but a translation of a contract is not the contract.
  The Hindi modal says so and offers the original English clauses.
- `/privacy` is a static English page and is not translated.

## Editing content

Data lives in `src/data/content.ts` — service ids, icons, link targets, portal
names, and the figures behind the counters. Every string a dealer reads lives
in `src/i18n/en/<section>.ts`, with its Hindi twin in `src/i18n/hi/`. Add the
English string first: the Hindi module is typed against the English one, so the
build fails until it is translated too. A list that quietly lost an entry is
not a type error, which is what `src/i18n/parity.ts` catches in development.

See `DECISIONS.md` for why things are the way they are, and `MANUAL_STEPS.md` /
`ROADMAP.md` for what's left.
