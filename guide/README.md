# The MDG guide

Plain-language pages that explain the Marketing Discipline Guidelines 2024
(MDG 2024) for petrol pump dealers, in English and Hindi, at
mdgservices.in/guides/ and /hi/guides/ (tools at /tools/ and /hi/tools/). The job of the guide: when a dealer, a
manager or a customer asks a question about MDG, in Google or in an AI
assistant, the clearest and most correct answer is ours.

| What | Where |
|---|---|
| Every page, its topic, wave and brief | `guide/inventory.ts` |
| Which day each page goes live (5 a day) | `guide/schedule.ts` |
| Fixed words, notices, disclaimer | `guide/copy.ts` |
| The words of each page | `guide/content/<en|hi>/<id>.md` |
| Calculator and checklist scripts | `guide/tools/<id>.js` |
| Page rules and rendering | `src/guides/` (`content.ts` rules, `model.ts`, `GuidePage.tsx`) |
| Release gate (404 before a page's day) | `proxy.ts` → `src/routing/` |
| Source documents (never published, not in git) | `.guide-source/` |
| The Khata Kavach pages (same machine, own data and calendar) | `kk-guide/` (see `kk-guide/README.md`); what differs per set is in `src/guides/collections.ts` |

Commands, from `mdg-landing/`:

```bash
npm run guide -- check
```

```bash
npm run guide -- check en/density-reference-10am
```

```bash
npm run guide -- preview
```

```bash
npm run guide -- schedule
```

`npm run build` fails if any page is missing or breaks a rule below, so
nothing half-written can ship. `npm run dev` serves the site; pages appear on
their release day (see `MIGRATION_NOTES.md` for the fake-date preview).

## How a page file looks

`guide/content/en/density-reference-10am.md` is the reference page: copy its
shape. A file is a JSON header between `---json` and `---`, then Markdown.

```
---json
{
  "title": "The H1, in the words a dealer would search (10-110 chars)",
  "metaTitle": "Search-result title, at most 50 chars, needed when title > 50",
  "description": "One or two sentences for search results and cards (70-170 chars).",
  "answer": "2-3 sentences that answer the page's main question on their own, with the numbers and {{clause}} tags (80-700 chars).",
  "faq": [ { "q": "A real question people search", "a": "A complete answer of 1-3 sentences, with {{clause}} tags." } ],
  "related": ["other-page-id"],
  "updated": "2026-10-15"
}
---
## First section
...
```

- **No `# ` heading** in the body. The title is the page's only H1.
- At least two `## ` sections. Use `### ` inside a section if needed.
- **3 to 10 FAQ items**, phrased the way people search (the inventory's
  `queries` are real searches; use them). Each answer stands alone.
- **Clause tags:** `{{5.1.9}}` renders as "MDG 5.1.9". `{{2012:8.3}}` renders as
  "MDG 2012 8.3". `{{circular}}` renders as "Circular 20.03.2025".
  `{{annexure 1}}` renders as "Annexure 1". Put one after every rule, figure or
  deadline, at the end of the sentence.
- **Links to other guide pages:** `[words](@page-id)`. The builder points it at
  the right language and drops the link (keeping the words) if that page is not
  live yet. Never write a guide URL by hand.
- **Tables** for anything compared or listed with figures. GFM table syntax.
- `> **Note:**` blockquotes for the one thing a dealer must not miss. At most
  two per page.
- The template adds, so do not write: the notice at the top, the "checked"
  date, the short-answer box, the video cards, the list of pages in a section,
  the FAQ section, related pages, the official PDF links, the Dealer Kavach
  box and the disclaimer.

## Length and shape: crisp, one question per page

The owner's rule: "Do not bloat the page. Make it crisp. If a topic needs more,
break it into multiple pages."

- **One page answers one dealer question.** If it needs more than its length,
  it becomes two pages (a new entry in `inventory.ts`), not a longer page.
- **Length, body plus FAQ:** a topic's main page 450-700 words; every other page
  300-550; the glossary one line per term. The build fails above 800 (main),
  650 (others), 1,100 (glossary), 750 (tools) English words; Hindi limits are
  1.6 times these, because Hindi spends more words on the same meaning.
- **Shape:** the short answer; then the one table or step list that carries the
  answer; then at most one short example; then 3-5 FAQs, each answer one or two
  sentences that do not repeat the body.
- **Never re-explain** what MDG is or how it binds dealers: the template's
  notice does that on every page. Link to another page instead of repeating it.
- **Penalty qualifiers:** wherever a penalty ladder or penalty figure appears,
  put `{{penalty-note}}` on its own line straight after it. It renders the
  standard note (minimum amounts, 8.5.1; established first, 8.5.2; five-year
  count incl. the previous guideline, 8.5.5). Do not write those out in prose.

## Accuracy: the rules that matter most

These pages affect a dealer's licence and money. One wrong figure costs more
trust than the whole guide earns.

1. **Every rule, number, deadline and penalty must be in the source text**
   (`.guide-source/mdg-2024.txt`, the circular, or MDG 2012 for comparisons),
   with its clause tag. If you cannot find it in the source, it does not go on
   the page.
2. **Never invent procedure.** If you explain how something is commonly done
   and MDG does not say it, label it: "In practice, many dealers..." or
   "General practice, not an MDG rule:".
3. **Quote the clause numbers exactly** as the source prints them, e.g. 5.1.14(b),
   8.4, 1.2(xiv).
4. **Current vs old rules:** MDG 2024 (effective 24.10.2024) is current. MDG
   2012 (last amended 30.11.2022, Ver. 7) is replaced. Only mention 2012 to
   compare, and always say which version a figure comes from.
5. **Worked examples** use plausible, clearly illustrative figures and must
   follow the rule exactly. Say "for example". Never invent a conversion from
   the ASTM table: tell the reader to use the table.
6. **Where MDG is unclear or leaves it to the oil company**, say so plainly and
   tell the reader to confirm with their oil company. Do not guess.

## Legal: what we may and may not publish

From the legal review (15 Oct 2026). Copying is the real risk, not explaining.

- **Explain from the dealer's question** (what must I do, by when, what happens
  if I don't), never by walking the guideline clause by clause in its own
  order. If a paragraph could be laid beside the clause and matched sentence
  for sentence, rewrite it.
- **Facts are free; words are not.** Amounts, deadlines, ranges and clause
  numbers may be stated. The sentences, tables and examples must be ours.
  Quote only a short phrase where the exact words matter: 15 words at most, in
  quotation marks, with the clause number. Never quote an operative penalty
  sentence, a list or a schedule.
- **Never reproduce the full list of minor irregularities (8.4) or a whole
  penalty schedule in the guideline's own order and grouping.** Group by our
  own topics, in our own words, and give each page the figures its question
  needs.
- **Annexure forms, labels and formats:** describe in our own words what each
  must record. Never copy a form. No screenshots of any guideline or oil
  company page.
- **Indian Standards (IS 2796, IS 17586, IS 17021, IS 1460, IS 16531):** name
  the standard and tell the reader to check the current version. Never copy a
  test table. The density ranges MDG 2024 itself lists may be stated as a
  figure with its clause.
- **Links:** never link to iocl.com (IndianOil's linking policy asks for
  permission first): write "iocl.com" as plain text. The template links the
  BPCL-hosted PDF. Never host the PDF.
- **Name the document in full** the first time on a page: "Marketing Discipline
  Guidelines 2024 (MDG 2024)". Describe it as the oil companies' rules for
  dealers, which bind them through the dealership agreement. Do not
  call them "a law", and never suggest they are not binding.
- Name IndianOil, BPCL and HPCL in plain text only, at most once in a title or
  description, never as the lead word. No logos. Never write that MDG
  Services or Dealer Kavach is official, authorised, approved, certified,
  recognised or a partner.
- Never call the 20.03.2025 circular "IndianOil's circular": it is a joint
  format for all three oil companies, and it sets no penalty of its own.
- **Keep the qualifiers** next to every penalty: the amounts are the minimum
  and the oil company may take higher action {{8.5.1}}; an irregularity must
  be established first {{8.5.2}}; the 45-day and 90-day timelines say
  "preferably"; the five-year count includes the previous guideline {{8.5.5}};
  the appeal in {{8.9}} is for termination only.
- **Show cause, appeal and termination pages** say only what the document says
  and end with: "General information, not legal advice. For your own notice,
  speak to an advocate or your oil company." No reply templates, no "you
  should argue", no outcome promises.
- **Examples** use made-up outlets, marked "for example" or "illustration".
  Never name a real dealer, outlet, officer or court case party. Never print
  helpline or officer phone numbers.
- **No opinions** on the oil companies or their rules ("harsh", "unfair",
  "trap"). Say what the clause says and stop.
- **Never write** "complete guide", "guaranteed", "100% accurate".
- **Toilet penalty:** MDG 2024 is the rule, shown first. The MDG 2012 figure (as
  amended to 30.11.2022) may be shown below it, clearly labelled "older
  guideline, replaced on 24.10.2024". Never present any figure as a 2025
  Parliament figure. Court matters on toilet access go in a separate dated
  note that says the position changed during 2025 and to check the latest;
  never say an order is in force or final. Say "all customers and transit
  travellers", never "the public".

## Voice

- Plain words, short sentences, active voice. Name who does what: "The dealer
  records...", "The inspector asks for...". Write for a busy pump owner who
  knows the business and has no time to decode.
- Lead with what it means for the dealer, then the rule.
- Real figures from the rule, never "X days" or "some amount".
- No filler, no "In this article", no "It is important to note".
- Each page covers its brief completely and stops. Typical length: a topic's
  main page 900-1,600 words; other pages 500-1,100 words.
- Outcomes only about MDG Services. Never describe how our service works, what
  we log into, systems, schedules or software. The template's closing box is
  the only sales line; do not add another.
- Never call anything AI.

## Hindi pages

- Same facts, numbers, clause tags and links as the checked English page. Not
  a word-for-word translation: write natural Hindi a pump owner in UP, Bihar,
  Rajasthan or MP speaks, in Devanagari.
- Keep common English trade words the way dealers say them, in Devanagari:
  डेंसिटी, टैंकर, नोज़ल, डिप, स्टॉक रजिस्टर, सैंपल, इंस्पेक्शन/निरीक्षण,
  सस्पेंशन, शो कॉज़ नोटिस. Write abbreviations in Latin (MDG, OMC, HSD, MS).
- Use the Roman-script search phrasing in the FAQ questions or headings where
  people search that way, e.g. "petrol pump me density kitni honi chahiye".
- Numbers in the usual Indian style (Rs 10,000; 1,00,000), Latin digits.
- The title and description are in Hindi; the JSON keys stay in English.

## After writing

Run `node node_modules/.cache/guide-cli.mjs check <lang>/<id>` for each page
(or `npm run guide -- check <lang>/<id>`) and fix every problem it reports.
