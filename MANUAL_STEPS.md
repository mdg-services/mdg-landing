# Manual steps — only what needs you

The landing rebuild is complete, builds clean, and runs locally. These are the
few things I can't (or shouldn't) do without you:

1. **Verify the contact details are real.** The brochure's toll-free number
   `1800-345-6512`, `mdgservices.in`, and `hello@mdgservices.in` are carried
   over verbatim. Confirm they're live before this goes public. (The email is an
   assumed address — replace if MDG uses a different one.)

2. **Wire the two forms to a real backend.** Both the "Leave my number" callback
   form (`src/components/Contact.tsx`) and the **dealer enrolment form** at
   `/register` (`src/components/Register.tsx`) currently show a success state
   client-side only — they do **not** send anything anywhere. Point them at a
   real endpoint (Formspree / a serverless function / the MDG backend) before
   launch. Until then they're demos, not working lead/enrolment capture. The
   enrolment form also references **Annexure – I** (services + rates) from the
   agreement — supply that content if it should appear on the page.

3. **Push to the remote.** Work is committed locally on branch
   `rebuild/landing-v2`. Review it, then merge to `main` and push when you're
   ready. (Per your standing instruction I did not push.)

4. **Optional — real photography.** The design is fully self-contained (SVG +
   CSS, no stock images), which keeps it fast and on-brand. If you later want
   real outlet/team photos (as in the brochure), see `ASSETS.md` for where they'd
   slot in and generation/sourcing prompts.

5. **Optional — analytics.** No analytics/tag manager is wired in. Add GA4 /
   Plausible / your choice to `index.html` if you want traffic data.
