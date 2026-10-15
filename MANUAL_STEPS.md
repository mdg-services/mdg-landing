# Manual steps — only what needs you

What only the owner can do for mdgservices.in. Open items first; finished ones
are kept below as the record of how to redo them.

## Open

### Add the firewall limit on the call-back form (Vercel dashboard)

The call-back endpoint (`/api/callback`) emails the team inbox once per request.
The code already drops what a script fills in, refuses posts from other sites,
ignores the same number sent twice in 10 minutes, and turns one address away
after 5 sends in 10 minutes. That last count lives in each server copy's memory,
and Vercel runs several copies that share nothing, so it slows a flood rather
than capping it. The exact cap is a firewall rule. On 9 Oct 2026 the project had
no firewall rule at all; check before assuming it has been added since.

- **Vercel → mdg-landing → Firewall → Configure → + New Rule.**
- Name: `callback per IP`. If: **Request Path** equals `/api/callback`
  **and** **Method** equals `POST`. Then: **Rate Limit**.
- **Fixed Window**, Time Window **600 s** (10 minutes, the most Hobby and
  Pro allow), Request Limit **5**, key **IP**, action **Default (429)**.
- **Save Rule → Review Changes → Publish.** Hobby allows one rate-limit rule
  per project; this should be it.
- The firewall counts every post, refused ones included, and counts each
  region separately. A visitor it turns away sees the homepage form's error
  with its "Or call us now" link, which opens the call choice.

### Annexure I

The Terms refer to *Annexure I* (services and rates). `/register` names it and
offers a call instead of showing it. Send the content if it should appear on the
page.

### Confirm the hello@mdgservices.in mailbox exists

`hello@mdgservices.in` is printed in the site's footer, and replies to the
grievance acknowledgement go there. If the mailbox does not exist, those
replies bounce.

### Analytics, if wanted

The homepage has no analytics or tag manager; only the film pages measure
views. Add GA4 or Plausible to `index.html` if you want traffic data.

## Done (reference)

### Email credentials (SMTP)

Set on Vercel and sending. Every form (call-back, register, grievance and the
film pages' call-back) sends through this one mailbox. To change the password or
set it up again:

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

### The website's link to the admin panel (`WEBSITE_INTAKE_SECRET`)

Done 14 Oct 2026: the secret is set on the backend and on Vercel (Production
only), and a test grievance, G-0001, reached the admin panel. Repeat these steps
to change the secret.

The grievance form (`/grievance`) and the "Register your pump" form
(`/register`, and the app's sign-up screen) also hand each submission to the
MDG API, so they show on the admin panel's **Grievances** and **Registrations**
pages. The website's server does this, never the visitor's browser.

- Make the secret with `openssl rand -hex 32`. That prints 64 characters; the
  backend refuses anything under 32.
- In **Vercel → mdg-landing → Settings → Environment Variables**, set
  `WEBSITE_INTAKE_SECRET=<that value>` and tick **Production only**, leaving
  Preview and Development unticked. It must be **exactly the same value** as
  the `WEBSITE_INTAKE_SECRET` set on the backend (`mdg-backend`'s environment
  on the server), or every hand-off is refused. Preview deployments get no
  secret on purpose: they fail closed (`/grievance` shows "could not send")
  instead of writing test submissions into the production admin list.
- **Change both sides together**, then redeploy the website (Vercel applies a
  changed variable only to new deployments) and restart the backend. Until
  both match, `/grievance` shows "could not send" to everyone (a grievance that
  cannot reach the admin panel must not look sent), while `/register` carries
  on emailing the team inbox and the admin list misses those registrations.
  When a registration does not reach the admin list for any reason, the
  team's email says so in its subject (`[not on admin list]`) and at the top,
  so it can be added by hand.
- Optional: `MDG_API_URL`. Leave it unset; it defaults to
  `https://api.mdgservices.in/api/v1`. Set it only to point a preview
  deployment at another backend.
- The acknowledgement the reporter gets by email uses the same SMTP
  credentials as above. Without them the grievance is still saved, and its
  number is shown on screen with a note to write it down.
- Like the call-back form, `/api/grievance` is protected by in-memory limits (5
  per address and 3 per email address in 10 minutes) that slow a flood rather
  than cap it, and `/api/enroll` by the same kind (5 per address and 3 per
  mobile number in 10 minutes). The exact cap for grievances is the backend's
  own, which counts across every server copy. A firewall rule here would be the
  other exact cap, but Hobby allows only one rate-limit rule per project and the
  call-back form should have it.
