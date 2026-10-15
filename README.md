# MDG Services — Dealer's कवच landing

Marketing landing page for **MDG Services**, the *Dealer's कवच* program —
compliance, paperwork and on-call support for petrol-pump dealers across India.

It's a **diagram-first** site: the brochure's content is shown as visuals (an
animated कवच shield that absorbs every OMC portal, a before/after comparison, a
bento of the nine service covers, a values spine, a process timeline, animated
stats) rather than long prose, so a dealer understands the offer by scanning.

## Stack

- **Next.js 16** (App Router, webpack build) + React 19 + TypeScript (strict). Every
  page is server-rendered; `"use client"` is only on the interactive leaves
  (navbar, language switch, forms, call sheet, the assistant).
- **Tailwind CSS 3** — design tokens in `tailwind.config.js`
- Fonts through `next/font/google` (self-hosted), animation in CSS (scroll reveals
  are `data-reveal` marks plus one small observer script)
- No external image assets — every visual is SVG/CSS; logos go through `next/image`
- Deployed on Vercel (`vercel.json`: `"framework": "nextjs"`)

## Run

```bash
npm install
npm run dev            # http://localhost:5180  (film pages are generated first)
npm run build          # film pages + guide check, then next build --webpack
npm run start          # serve the production build on :5180
npm run lint
npm run typecheck      # tsc --noEmit over everything, backend included
npm run guide -- check # every guide page's words against the rules
npm run guide -- schedule
npm run email:preview  # render email templates to ./.email-preview/*.html
```

`MIGRATION_NOTES.md` explains the move from Vite and what behaves differently.

## Structure

```
app/                     # routes (thin files; the work is in src/)
  (en)/                  # English: /, /register, /grievance(s), /guides/…, /tools/…
  hi/                    # Hindi twins under /hi
  api/                   # enroll, callback, grievance, indexnow route handlers
  sitemap.ts robots.ts llms.txt/ not-found.tsx
proxy.ts                 # language redirects, guide release gate, film pages
src/
  data/content.ts        # data only: ids, icons, hrefs, portal names, counter figures
  i18n/
    lang.ts              # Lang, paths, cookie; server.ts getT(); client.tsx useT()
    parity.ts            # check that both dictionaries line up
    en/*.ts hi/*.ts      # ALL copy, one file per section, brochure-derived
  views/                 # HomePage, RegisterPage, GrievancePage (server)
  components/            # sections (server) and interactive leaves (client)
  guides/                # the guide pages: content.ts (rules), model.ts, GuidePage.tsx
  routing/               # pure logic the proxy uses (language, guides, film)
  seo/                   # metadata + JSON-LD
  fonts/                 # next/font setup, English and Hindi
  lib/                   # reveal, enter, presence, api helpers
  index.css              # Tailwind layers, hero/reveal animations, .guide-* styles
guide/                   # inventory, schedule, copy, content/, tools/ (the guides' source)
scripts/                 # film-build.ts (public/film), guide-cli.ts, film-pages.ts, …
server/                  # backend core (Node), used by app/api/*
```

## Email backend

The `/register` enrolment form posts to `POST /api/enroll`, which emails the
details to the MDG inbox and a welcome note to the dealer.

- **Where:** a Next.js route handler (`app/api/enroll/route.ts`), which Vercel runs
  as a Node function. `npm run dev` serves the same route, so it works end-to-end
  locally.
- **Adding another email:** write a `(data) => EmailContent` function in
  `server/emails/templates.ts`, then `sendTemplate(myEmail(data), to)`. The
  transport and branded layout are shared.
- **Transport:** Nodemailer over plain SMTP (provider-agnostic), set up for
  Hostinger, sending from `noreply@mdgservices.in`. Config via env —
  `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM`, `ENROLLMENT_NOTIFY_TO`. See
  `.env.example`. Without credentials the server logs emails instead of
  sending; production requires them. Switching providers touches only the env +
  `server/mailer.ts`.

## Grievances and the admin panel

`/grievance` (also `/grievances`) is where anyone can report a problem. The form
posts to `POST /api/grievance`, which validates it, hands it to the MDG API
(`POST /website/grievances`, so it shows on the admin panel's Grievances page and
comes back with a number like `G-0007`), then sends two emails: an
acknowledgement to the person, in the language they used, with that number, and
the details to the team inbox. The acknowledgement never repeats what they wrote
and promises no reply time.

The `/register` enrolment form is handed to the API the same way
(`POST /website/enrolments`, Registrations page), before its emails go out. That
hand-off can never fail an enrolment; the team's inbox is the backstop, and when
the hand-off failed the team's email says so at the top.

Both hand-offs are server to server with `Authorization: Bearer
$WEBSITE_INTAKE_SECRET` (`server/intake.ts`). The browser only ever talks to this
site. `MDG_API_URL` (default `https://api.mdgservices.in/api/v1`) and the secret
are listed in `.env.example`; see `MANUAL_STEPS.md` step 7.

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

`npm run review` (against a running `npm run start`) renders the page at desktop
and mobile widths and fails on horizontal overflow, broken images, em-dashes, or
console errors.
`npm run og` regenerates the social card.

## Two languages

The URL decides the language of the HTML: `/` is English and `/hi` is Hindi,
and every page has a twin under `/hi` (`/hi/register`, `/hi/grievance`,
`/hi/guides/…`). The server writes `<html lang>` and `data-lang`, so a Hindi
reader never waits for a script to translate the page.

The EN / हिंदी switch is a link to the page's twin; clicking it also keeps the
choice in the `mdg_lang` cookie (one year, `Path=/`) and in localStorage
(`mdg.lang`, which the film pages read). `proxy.ts` then decides when to send a
visitor of an English address to its Hindi twin:

1. `?lang=hi` or `?lang=en` is a choice: redirect to that language's address,
   set the cookie, drop the parameter (so a Hindi link forwarded into a dealer
   WhatsApp group opens in Hindi and stays that way);
2. otherwise the `mdg_lang` cookie, if there is one;
3. otherwise a browser whose first language is Hindi (`Accept-Language`) goes to
   `/hi`. A crawler sends neither, so it reads English at `/` and Hindi at `/hi`.

- Devanagari is not Latin with different glyphs. The Hindi block at the bottom
  of `src/index.css` undoes the three things this page does to Latin type that
  break it: display line-heights (0.94 on `.text-mega`) clip the vowel marks
  that hang above the shirorekha, tracking pulls apart the bar that joins the
  letters of a word, and a headline measure set in `ch` is too narrow for a
  language that runs about 15% longer. It is written flat rather than nested,
  because these dealers are on old Android WebViews.
- Noto Sans Devanagari sits *behind* Inter, Space Grotesk and Space Mono in
  every font stack. On the English page the two Devanagari faces are switched on
  only after the page has loaded (`components/LateFonts.tsx`), so their 185 kB
  never competes with the first paint; on the Hindi page Noto (the page itself)
  comes with the first paint and Tiro is switched on after load.
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
