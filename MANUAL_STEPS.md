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
   `1800-891-3496`, `mdgservices.in`, and `hello@mdgservices.in` are carried over
   verbatim. Confirm they're live before launch. (`hello@` is an assumed address.)

3. **Both forms are now wired.** The homepage "Leave my number" form posts to
   `POST /api/callback` and emails the name + number to `ENROLLMENT_NOTIFY_TO`
   (same inbox as enrolments). It uses the same SMTP credentials — nothing extra
   to configure beyond step 1.

4. **Annexure – I.** The Terms reference *Annexure – I* (services + rates). Send
   me that content if it should appear on the `/register` page.

5. **Optional — photography & analytics.** The design is self-contained (SVG/CSS,
   no stock images — see `ASSETS.md`). No analytics/tag manager is wired in; add
   GA4 / Plausible to `index.html` if you want traffic data.

6. **Add the firewall limit on the call-back form (Vercel dashboard).** The
   call-back endpoint (`/api/callback`) emails the team inbox once per request.
   The code already drops what a script fills in, refuses posts from other
   sites, ignores the same number sent twice in 10 minutes, and turns one
   address away after 5 sends in 10 minutes. That last count lives in each
   server copy's memory, and Vercel runs several copies that share nothing, so
   it slows a flood rather than capping it. The exact cap is a firewall rule:
   - **Vercel → mdg-landing → Firewall → Configure → + New Rule.**
   - Name: `callback per IP`. If: **Request Path** equals `/api/callback`
     **and** **Method** equals `POST`. Then: **Rate Limit**.
   - **Fixed Window**, Time Window **600 s** (10 minutes, the most Hobby and
     Pro allow), Request Limit **5**, key **IP**, action **Default (429)**.
   - **Save Rule → Review Changes → Publish.** Hobby allows one rate-limit rule
     per project; this should be it.
   - The firewall counts every post, refused ones included, and counts each
     region separately. A visitor it turns away sees the form's "could not
     send" message with the toll-free number beside it.
