# Manual steps — only what needs you

The landing rebuild is complete, builds clean, and runs locally. These are the
few things I can't (or shouldn't) do without you:

1. **Set the email credentials (required for the enrolment emails to send).**
   The `/register` form now posts to a real serverless function (`api/enroll.ts`)
   that emails the details to **mdgservicesterms@gmail.com** and a welcome note
   to the dealer. It needs a Gmail **App Password** to send:
   - On the Gmail account, turn on 2-Step Verification, then create an App
     Password at https://myaccount.google.com/apppasswords.
   - In **Vercel → Project → Settings → Environment Variables**, add:
     `GMAIL_USER` (the sending account, e.g. `mdgservicesterms@gmail.com`),
     `GMAIL_APP_PASSWORD` (the 16-char app password), and optionally
     `ENROLLMENT_NOTIFY_TO` / `MAIL_FROM_NAME`. See `.env.example`.
   - Without these, production returns an error on submit; locally the dev server
     just logs the emails so the flow stays testable. (Gmail SMTP is fine for
     low volume; if enrolments scale up, switch the transport in
     `server/mailer.ts` to a sender like Resend/SES — the templates don't change.)

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
