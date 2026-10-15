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
  (1800-891-3496) and mdgservices.in contact details. The number came off the
  site on 23 Aug 2026 and came back on 9 Oct as one choice in the call sheet; it
  now lives only in `src/lib/tollFree.ts`.

## Dealer enrolment page (`/register`)
- **D11.** Added `react-router-dom` and a second route, `/register`, holding the
  Terms & Conditions (verbatim from the dealer agreement) followed by the
  enrolment form. Kept it a client-side route (SPA) with a `vercel.json` rewrite
  so deep links resolve. The landing's "Reserve your slot" CTA and a footer link
  point to it.
- **D12.** T&C text is the signed agreement's ten clauses, word for word. They
  live in `src/i18n/en/register.ts`, with the Hindi translation in
  `src/i18n/hi/register.ts`, and are copied into
  `mdg-client/src/features/register/terms.ts` for the app's sign-up screen:
  change a clause in all three together. Legal wording is otherwise untouched;
  the comment above `terms` in `register.ts` lists the edits made.
- **D13.** The enrolment form validates client-side (required fields + a required
  "agree" checkbox gating submit), then posts to the email backend below.

## Email backend (enrolment)
- **D14.** Backend = **Vercel Serverless Functions** co-located with the site
  (`api/enroll.ts`), not a separate service. The landing already deploys on
  Vercel, so this auto-scales, needs no extra infra/CORS, and ships together.
- **D15.** Layered for reuse — the HTTP layer is a thin adapter over a
  transport-agnostic core:
  - `server/validation.ts` — Zod schema, single source of truth for the payload.
  - `server/emails/layout.ts` — one branded HTML shell + helpers (`wrapEmail`,
    `dataTable`, `button`…); every email renders through it.
  - `server/emails/templates.ts` — pure `data → EmailContent` functions. **Adding
    a new email = add one function here** and `sendTemplate(it, to)`.
  - `server/mailer.ts` — singleton Nodemailer transport + `sendTemplate()`.
  - `server/enroll.ts` — `processEnrollment()`: validate → fan out notification +
    welcome concurrently. Called by both `api/enroll.ts` (prod) and a Vite dev
    middleware (`vite.config.ts`), so local `npm run dev` exercises the real path.
    Since 14 Oct it also hands each enrolment to the MDG API (`server/intake.ts`)
    so it shows on the admin Registrations page; a failed hand-off never fails
    the enrolment (see D22).
- **D16.** Transport = **Nodemailer over plain SMTP** (provider-agnostic),
  configured for **Hostinger** by default and sending from the domain mailbox
  `noreply@mdgservices.in` (good SPF/DKIM deliverability, no third-party email
  API). All transport config is env-driven (`SMTP_HOST/PORT/SECURE/USER/PASS`,
  `MAIL_FROM`), so switching providers (Gmail/Resend/SES) only changes env +
  `server/mailer.ts`; templates/validation/logic are unchanged. Without creds the
  dev mailer logs instead of sending (testable locally); in prod, missing creds
  are a hard error.
- **D17.** No secrets in the repo — creds come from env (`.env.example`,
  `.gitignore` blocks `.env*`). Backend is type-checked via
  `tsconfig.server.json` (`npm run typecheck:api`) and linted as Node, separate
  from the browser/React config. `npm run email:preview` renders templates to
  `.email-preview/` for visual QA.

## Skills / tooling
- **D10.** `ui-ux-pro-max` and `taste-skill` are already installed locally as
  skills, so they are referenced directly rather than cloned into the repo
  (the `/build-product` clone-and-pin step is satisfied by the local install).

## Later decisions (Aug–Oct 2026)

The detail for each lives where it is named.

- **D18.** English and Hindi. A dealer who never touches the switch follows
  their phone's language; the first touch makes the choice theirs. Aug 2026.
  See "Two languages" in `README.md`.
- **D19.** A website assistant (chat, voice note, live call), lazy-loaded so a
  visitor who never opens it never downloads it. ADR 0009; the runbook is
  `docs/ASSIST_RUNBOOK.md`.
- **D20.** The film pages (`/film`, `/film/short`) are plain static pages, not
  part of the React app; the video streams from S3, and `middleware.ts` picks
  Hindi or English (Hindi unless the visitor chose). ADR 0015.
- **D21.** A spam guard on the call-back form, 9 Oct: every post carries
  `elapsed`, a hidden box catches scripts, JSON only, and in-memory limits. The
  exact cap is a Vercel firewall rule only the owner can add (`MANUAL_STEPS.md`).
- **D22.** Grievances and enrolments are handed to the MDG API server to server
  with a shared secret, 14 Oct, so the admin panel lists them. The browser never
  talks to the API for these two forms, and the team's inbox stays the backstop.
  The assistant's grievance form is separate: it posts to the API itself.
- **D23.** The app's sign-up screen posts to `/api/enroll` from another origin,
  6 Oct, so the site answers CORS for `ENROLL_ALLOWED_ORIGINS` and tags the form
  `source: "app"`.
