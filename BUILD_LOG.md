# Build log — Landing rebuild (v2)

- [x] Phase 0 — Safeguard prior WIP (checkpoint commit on `rebuild/landing-v2`)
- [x] Phase 0 — Decisions logged (`DECISIONS.md`)
- [x] Phase 1 — Design system (tailwind navy/gold tokens, global CSS, fonts, `motion` dep)
- [x] Phase 2 — Primitives (Reveal/Stagger, Counter, SectionHeader, Icon set, Brand mark)
- [x] Phase 2 — Sections (hero shield diagram, marquee, numbers, problem before/after,
      services bento, more-services, why-us, mission/values spine, process timeline,
      membership, contact, faq)
- [x] Phase 2 — Shell (navbar, footer, App + scroll progress)
- [x] Phase 3 — QA: typecheck ✓, lint ✓, build ✓ (378 kB JS / 118 kB gzip),
      dev boot ✓, no console errors
- [x] Phase 3 — Visual pass: every section screenshotted on desktop (1280) and
      mobile (375); FAQ accordion + contact callback form interaction verified
- [x] Phase 4 — Anti-slop / devex review pass: fixed reduced-motion gating on
      the Hero's infinite Framer loops, bumped low-contrast note text
      (navy-200→navy-100), added `inert` to the closed mobile menu, dropped dead
      `.bg-grid` CSS, added `text-balance` to wrapping headlines
- [x] Phase 5 — Committed in logical chunks (local only, branch `rebuild/landing-v2`)
- [x] Phase 5 — Handoff report + MANUAL_STEPS written
