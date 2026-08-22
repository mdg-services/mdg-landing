# Graph Report - mdg-landing  (2026-08-22)

## Corpus Check
- 115 files · ~63,548 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 541 nodes · 1045 edges · 48 communities (28 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `71c8a81b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AssistPanel.tsx
- content.ts
- templates.ts
- devDependencies
- scripts
- compilerOptions
- lang.tsx
- compilerOptions
- compilerOptions
- gen-logos.mjs
- MDG Services — Dealer's कवच landing
- Decisions — Landing rebuild (v2)
- en/index.ts
- hi/index.ts
- .i18n-langtest.mjs
- Roadmap — beyond the MVP
- en/numbers.ts
- AssistWidget.tsx
- en/services.ts
- en/extras.ts
- en/nav.ts
- en/why.ts
- en/process.ts
- Assets
- hi/contact.ts
- hi/faq.ts
- hi/footer.ts
- hi/hero.ts
- hi/membership.ts
- hi/meta.ts
- hi/mission.ts
- hi/problem.ts
- hi/training.ts
- hi/ui.ts
- .i18n-dump.mjs
- review.mjs
- tsconfig.json
- vercel.json
- vite.config.ts
- BUILD_LOG.md
- MANUAL_STEPS.md
- og.mjs
- vite-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `useT()` - 39 edges
2. `compilerOptions` - 17 edges
3. `Icon()` - 16 edges
4. `compilerOptions` - 16 edges
5. `AssistPanel()` - 13 edges
6. `Reveal()` - 12 edges
7. `compilerOptions` - 12 edges
8. `scripts` - 10 edges
9. `LangProvider()` - 10 edges
10. `escapeHtml()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `handler()` --calls--> `processCallback()`  [EXTRACTED]
  api/callback.ts → server/callback.ts
- `handler()` --calls--> `processEnrollment()`  [EXTRACTED]
  api/enroll.ts → server/enroll.ts
- `TermsModal()` --calls--> `useT()`  [EXTRACTED]
  src/components/Register.tsx → src/i18n/lang.tsx
- `SuccessCard()` --calls--> `useT()`  [EXTRACTED]
  src/components/Register.tsx → src/i18n/lang.tsx
- `AssistPanel()` --calls--> `useLang()`  [EXTRACTED]
  src/components/assist/AssistPanel.tsx → src/i18n/lang.tsx

## Import Cycles
- None detected.

## Communities (48 total, 20 thin omitted)

### Community 0 - "AssistPanel.tsx"
Cohesion: 0.06
Nodes (67): AssistPanel(), Msg, reasonText(), CallControls(), mmss(), assistDict, callPhaseLabel(), LeadForm() (+59 more)

### Community 1 - "content.ts"
Cohesion: 0.08
Nodes (54): App(), LogoFull(), LogoFullWhite(), LogoMark(), Contact(), Status, Counter(), FAQ() (+46 more)

### Community 2 - "templates.ts"
Cohesion: 0.13
Nodes (28): handler(), handler(), data, processCallback(), button(), dataTable(), EmailContent, escapeHtml() (+20 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (39): autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, autoprefixer (+31 more)

### Community 4 - "scripts"
Cohesion: 0.07
Nodes (29): motion, nodemailer, dependencies, motion, nodemailer, react, react-dom, react-router-dom (+21 more)

### Community 5 - "compilerOptions"
Cohesion: 0.09
Nodes (22): DOM, src, vite/client, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib (+14 more)

### Community 6 - "lang.tsx"
Cohesion: 0.16
Nodes (19): LanguageToggle(), ORDER, clearQuery(), Ctx, DICTS, fromQuery(), isLang(), Lang (+11 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (20): vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (17): api/**/*.ts, server/**/*.ts, compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution (+9 more)

### Community 9 - "gen-logos.mjs"
Cohesion: 0.17
Nodes (8): bf, bm, full, makeIcon(), mark, markBlack, resizeW(), [srcFull, srcMark]

### Community 10 - "MDG Services — Dealer's कवच landing"
Cohesion: 0.18
Nodes (10): Editing content, Email backend, MDG Services — Dealer's कवच landing, Run, Stack, Structure, The August 2026 pass, Theme (+2 more)

### Community 11 - "Decisions — Landing rebuild (v2)"
Cohesion: 0.22
Nodes (8): Brand & theme (from brochure), Content & structure, Dealer enrolment page (`/register`), Decisions — Landing rebuild (v2), Email backend (enrolment), Scope, Skills / tooling, Stack

### Community 12 - "en/index.ts"
Cohesion: 0.31
Nodes (5): SiteType, assist, en, register, register

### Community 13 - "hi/index.ts"
Cohesion: 0.31
Nodes (5): marquee, assist, hi, marquee, Dict

### Community 15 - "Roadmap — beyond the MVP"
Cohesion: 0.29
Nodes (6): Known constraints carried from this build, Phase 1 — Make it convert, Phase 2 — Trust & proof, Phase 3 — Reach, Phase 4 — Content depth, Roadmap — beyond the MVP

### Community 16 - "en/numbers.ts"
Cohesion: 0.33
Nodes (5): StatId, numbers, StatCopy, stats, numbers

### Community 17 - "AssistWidget.tsx"
Cohesion: 0.53
Nodes (5): AssistPanel, AssistWidget(), remember(), stillMotion(), wasDismissed()

### Community 18 - "en/services.ts"
Cohesion: 0.40
Nodes (4): ServiceId, ServiceCard, services, services

### Community 19 - "en/extras.ts"
Cohesion: 0.50
Nodes (3): ExtraId, extras, extras

### Community 20 - "en/nav.ts"
Cohesion: 0.50
Nodes (3): NavId, nav, nav

### Community 21 - "en/why.ts"
Cohesion: 0.50
Nodes (3): PillarId, why, why

### Community 22 - "en/process.ts"
Cohesion: 0.50
Nodes (3): StepId, process, process

### Community 23 - "Assets"
Cohesion: 0.50
Nodes (3): Assets, If you later want real photography (optional), What's in the repo

## Knowledge Gaps
- **158 isolated node(s):** `[url, out, lang]`, `errors`, `fails`, `ok`, `name` (+153 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useT()` connect `content.ts` to `AssistWidget.tsx`, `lang.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Icon()` connect `content.ts` to `AssistPanel.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `[url, out, lang]`, `errors`, `fails` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AssistPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057455540355677154 - nodes in this community are weakly interconnected._
- **Should `content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07815126050420168 - nodes in this community are weakly interconnected._
- **Should `templates.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13205128205128205 - nodes in this community are weakly interconnected._