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
- Logos are PNGs in `public/` (full logo and mark, each with a white version
  for navy surfaces), shown by `Brand.tsx`. Section icons are SVG in
  `Icon.tsx`; the diagrams are SVG/CSS.

## Run

```bash
npm install
npm run dev            # http://localhost:5180  (includes the /api dev server and the film pages)
npm run build          # tsc -b && vite build  → dist/
npm run preview        # serve the production build
npm run lint
npm run typecheck:api  # type-check the serverless backend (server/ + api/)
npm run email:preview  # render email templates to ./.email-preview/*.html
npm run og             # the homepage's social card, public/og.png
npm run og:film        # the film pages' link-preview cards, public/film/og-*.jpg
npm run logos:gen -- <full-logo.png> <mark.png>   # remake the logo PNGs
```

Type-check with `npx tsc -b` (what `npm run build` runs). A bare
`npx tsc --noEmit` checks nothing here: the root `tsconfig.json` only points at
the other two.

## Structure

```
src/
  data/content.ts        # data only: ids, icons, hrefs, portal names, counter figures
  i18n/
    lang.tsx             # <LangProvider>, useT(), useLang(), the preference rules
    parity.ts            # dev-only check that both dictionaries line up
    en/*.ts hi/*.ts      # ALL copy, one file per section, brochure-derived
  lib/
    motion.tsx anim.ts   # <Reveal> / <Stagger> wrappers; easing + variant constants
    tollFree.ts          # the toll-free number, and the only place that knows it
    assistCall.ts        # "call us" events: open the call choice, start the assistant's call
    assistApi.ts         # the assistant's calls to the MDG API
    pageTitle.ts         # tab title per page, in the language on screen
    submissionId.ts      # one id per filled-in form, so a re-send is not a second form
  types/assist.ts        # the assistant's API shapes, copied from shared/src/types/assist.ts
  components/
    Icon.tsx Brand.tsx   # icon set + the logo PNGs
    Counter.tsx SectionHeader.tsx LanguageToggle.tsx
    Navbar.tsx Hero.tsx Marquee.tsx Numbers.tsx Problem.tsx
    Services.tsx MoreServices.tsx WhyUs.tsx Mission.tsx Process.tsx
    Membership.tsx Training.tsx Contact.tsx FAQ.tsx Footer.tsx
    CallUs.tsx CallSheet.tsx   # every "call us", and the choice it opens
    Register.tsx         # /register: the terms, then the enrolment form
    Grievance.tsx        # /grievance
    assist/              # the website assistant (lazy-loaded)
  film/                  # the film pages: films.json, page.css, player.ts
  App.tsx main.tsx index.css

api/                     # Vercel serverless functions, thin adapters over server/
  enroll.ts callback.ts grievance.ts
server/                  # transport-agnostic backend core (Node)
  validation.ts          # Zod payload schemas (single source of truth)
  enroll.ts              # processEnrollment(): validate → hand to the API → emails
  callback.ts            # processCallback(): spam guard → one email to the team
  grievance.ts           # processGrievance(): validate → hand to the API → two emails
  intake.ts              # postIntake(): server-to-server hand-off to the MDG API
  cors.ts                # which other sites may post the enrolment form
  recent.ts              # in-memory per-address / per-number counts
  env.ts result.ts       # typed env access; the shared result shape
  mailer.ts              # Nodemailer transport + sendTemplate()
  emails/
    layout.ts            # one branded HTML shell + helpers
    templates.ts         # pure data → EmailContent (add new emails here)

middleware.ts            # film pages only: language pick + a coarse location cookie
scripts/                 # film-pages.ts (build step), og.mjs, og-film.mjs,
                         # gen-logos.mjs, render-emails.ts, review.mjs
public/                  # logos, favicon, og.png, assist-bot.png, privacy.html,
                         # film/ (link-preview cards and the mark)
```

## Email backend

Three forms post to this site's own functions, and each emails the team inbox
(`ENROLLMENT_NOTIFY_TO`):

| Route | Who posts it | What it sends |
|---|---|---|
| `POST /api/enroll` | `/register`, and the Dealer Kavach app's sign-up screen | the details to the team, a welcome note to the dealer |
| `POST /api/callback` | the homepage's "Leave my number", the film pages, the assistant's fallback | the name and number to the team |
| `POST /api/grievance` | `/grievance` | see below |

- **Where:** Vercel Serverless Functions (`api/*.ts`). Locally, a Vite dev
  middleware serves the same routes by calling the same core, so `npm run dev`
  works end-to-end.
- **The app's sign-up screen** is the client web app on another origin, so
  `/api/enroll` answers CORS for the origins in `ENROLL_ALLOWED_ORIGINS` and
  the form arrives tagged `source: "app"`. Its Terms & Conditions are a word-for-word
  copy in `mdg-client/src/features/register/terms.ts`: change a clause in
  `src/i18n/{en,hi}/register.ts` and there in the same pass.
- **The call-back guard.** Each valid call-back is one email, so
  `/api/callback` accepts JSON only (415 otherwise), quietly drops a post with
  the hidden `website` box filled in or sent under 2 s after the page opened
  (every caller must send `elapsed`), ignores the same number twice in 10
  minutes, and turns one address away after 5 sends in 10 minutes. Those counts
  live in each function copy's memory, so they slow a flood rather than cap it;
  the exact cap is the firewall rule in `MANUAL_STEPS.md`.
- **Adding another email:** write a `(data) => EmailContent` function in
  `server/emails/templates.ts`, then `sendTemplate(myEmail(data), to)`. The
  transport and branded layout are shared.
- **Transport:** Nodemailer over plain SMTP (provider-agnostic), set up for
  Hostinger, sending from `noreply@mdgservices.in`. Config via env —
  `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM`, `ENROLLMENT_NOTIFY_TO`. See
  `.env.example`. Without credentials the dev server logs emails instead of
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
are listed in `.env.example`; changing the secret is in `MANUAL_STEPS.md`.

## Calling us

Every "call us" on the site (`CallUs.tsx`) opens `CallSheet.tsx`: a choice
between the toll-free 1800-891-3496 on the visitor's own phone and the
assistant's spoken call in the tab. On the page the number lives only in
`src/lib/tollFree.ts`, so it cannot creep back as loose text. The film pages
(`scripts/film-pages.ts`) and the emails (`server/emails/layout.ts`) carry their
own copies: a new number means changing all three. `/?call=1` opens the sheet
on arrival; the film pages' "Talk to us on the website" link goes there.

## Assistant

A chat, voice-note and live-call assistant sits on every page
(`src/components/assist/`). The launcher is tiny and the panel is behind
`lazy()`, so a visitor who never opens it never downloads it. It talks to the
MDG API at `https://api.mdgservices.in/api/v1`; set `VITE_ASSIST_API_BASE` only
to point a local build at a local backend. It can also register a grievance
about MDG, in chat and on a call (`GrievanceForm.tsx`); that goes straight to
the MDG API, not through `/api/grievance`. Design: ADR 0009
(`docs/ADR/0009-landing-assistant.md`); operating it: `docs/ASSIST_RUNBOOK.md`
(both in the main repo).

## Film pages

`/film` (the full film) and `/film/short` are plain static pages, not part of
the React app, so a cheap phone on 2G sees the poster before the app would have
loaded. `scripts/film-pages.ts` builds them from `src/film/` (the `film-pages`
plugin in `vite.config.ts`), each in Hindi and English. `middleware.ts` picks
the file from `?lang=` or the site's `mdg_lang` cookie and defaults to Hindi,
because the films are in Hindi; `vercel.json` redirects `/film/en` and
`/film/short/en` to the same page with `?lang=en`. The video itself streams from
the `mdg-films` S3 bucket. Views are counted by anonymous beacons from
`src/film/player.ts`; the homepage counts nothing.

To publish a re-cut: package it with `marketing/films/web/package.mjs`, paste
its `film.json` into `src/film/films.json`, run `npm run og:film`, rebuild and
deploy. Design: ADR 0015 and `docs/films/FILM_PAGES_SPEC.md` (main repo).

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
- **The four headline stats were illustrative.** They are replaced with
  figures that can be produced on demand.
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
stripped off the URL. The choice is kept in `localStorage` under `mdg.lang`
and in the `mdg_lang` cookie, which the film pages' server reads, so a choice
made on either counts on both. A browser that refuses both falls back to the
phone's language rather than breaking. The film pages are the one exception to
following the phone: with no choice made they open in Hindi.

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

## Deploy

From this folder: `vercel --prod --yes --force`. `--force` skips Vercel's build
cache, which has served the previous bundle under a deploy marked Ready. Never
`vercel deploy --prebuilt` with an old `.vercel/output`: it uploads that folder
as it is, and once shipped a day-old build. Either way, check the deploy landed:
the `/assets/index-*.js` name in the HTML that mdgservices.in serves must be the
one your build made.

## Not done yet

- **Analytics.** The homepage has none; only the film pages measure views.
- **Testimonials.** None exist, and none may be invented.
- **The hero's "1,400+ pumps" and "14 states"** (`src/i18n/*/hero.ts`) are
  still unconfirmed.
- **A page per service** (`/services/<id>`), a sitemap, structured data for
  search, and a notices section for compliance deadlines.
- **Annexure I** (services and rates) is not on `/register`; see
  `MANUAL_STEPS.md`.

See `DECISIONS.md` for why things are the way they are, and `MANUAL_STEPS.md`
for what only the owner can do.
