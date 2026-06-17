# Manual steps — only what needs you

The landing rebuild is complete, builds clean, and runs locally. These are the
few things I can't (or shouldn't) do without you:

1. **Verify the contact details are real.** The brochure's toll-free number
   `1800-345-6512`, `mdgservices.in`, and `hello@mdgservices.in` are carried
   over verbatim. Confirm they're live before this goes public. (The email is an
   assumed address — replace if MDG uses a different one.)

2. **Wire the callback form to a real backend.** The "Leave my number" form
   currently shows a success state client-side only — it does **not** send the
   lead anywhere. Point it at a real endpoint (Formspree / a serverless function
   / the MDG backend) before launch. See `src/components/Contact.tsx`
   (`handleSubmit`). Until then it's a demo, not a working lead capture.

3. **Push to the remote.** Work is committed locally on branch
   `rebuild/landing-v2`. Review it, then merge to `main` and push when you're
   ready. (Per your standing instruction I did not push.)

4. **Optional — real photography.** The design is fully self-contained (SVG +
   CSS, no stock images), which keeps it fast and on-brand. If you later want
   real outlet/team photos (as in the brochure), see `ASSETS.md` for where they'd
   slot in and generation/sourcing prompts.

5. **Optional — analytics.** No analytics/tag manager is wired in. Add GA4 /
   Plausible / your choice to `index.html` if you want traffic data.
