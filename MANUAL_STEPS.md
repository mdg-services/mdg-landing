# Manual steps — only what needs you

The landing rebuild is complete, builds clean, and runs locally. These are the
few things I can't (or shouldn't) do without you:

1. **Set the email credentials (required for the enrolment emails to send).**
   The `/register` form posts to a serverless function (`api/enroll.ts`) that
   emails the details to **mdgservicesterms@gmail.com** and a welcome note to the
   dealer, sending from **noreply@mdgservices.in** via Hostinger SMTP.
   - In **Hostinger hPanel → Emails → Email Accounts** (for the `mdgservices.in`
     domain), create the mailbox `noreply@mdgservices.in` and set a password (or
     use "Change password" on an existing one). That password *is* the SMTP
     password — Hostinger has no separate "app password".
   - In **Vercel → Project → Settings → Environment Variables**, add:
     `SMTP_USER=noreply@mdgservices.in`, `SMTP_PASS=<the mailbox password>`,
     and (already defaulted, override only if needed) `SMTP_HOST=smtp.hostinger.com`,
     `SMTP_PORT=465`, `SMTP_SECURE=true`, `MAIL_FROM=noreply@mdgservices.in`,
     `ENROLLMENT_NOTIFY_TO=mdgservicesterms@gmail.com`. See `.env.example`.
   - Without these, production returns an error on submit; locally the dev server
     logs the emails so the flow stays testable. Sending from the domain's own
     mailbox (vs a Gmail relay) also gives clean SPF/DKIM deliverability. To
     switch providers later, only `server/mailer.ts` / the `SMTP_*` vars change —
     templates and logic don't.

2. **Verify the contact details are real.** The brochure's toll-free number
   `1800-345-6512`, `mdgservices.in`, and `hello@mdgservices.in` are carried over
   verbatim. Confirm they're live before launch. (`hello@` is an assumed address.)

3. **Wire the callback form too (optional).** The "Leave my number" form in
   `src/components/Contact.tsx` still only shows a success state — it doesn't send
   anything. It can reuse the same backend: add a template in
   `server/emails/templates.ts` and a tiny `api/callback.ts` mirroring
   `api/enroll.ts`. (The enrolment form is fully wired; this is the one leftover.)

4. **Annexure – I.** The Terms reference *Annexure – I* (services + rates). Send
   me that content if it should appear on the `/register` page.

5. **Optional — photography & analytics.** The design is self-contained (SVG/CSS,
   no stock images — see `ASSETS.md`). No analytics/tag manager is wired in; add
   GA4 / Plausible to `index.html` if you want traffic data.
