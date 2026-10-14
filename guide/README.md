# The MDG guide

Plain-language pages that explain the Marketing Discipline Guidelines 2024
(MDG 2024) for petrol pump dealers, in English and Hindi, at
mdgservices.in/mdg/ and /hi/mdg/. The job of the guide: when a dealer, a
manager or a customer asks a question about MDG, in Google or in an AI
assistant, the clearest and most correct answer is ours.

| What | Where |
|---|---|
| Every page, its topic, wave and brief | `guide/inventory.ts` |
| Which day each page goes live (5 a day) | `guide/schedule.ts` |
| Fixed words, notices, disclaimer | `guide/copy.ts` |
| The words of each page | `guide/content/<en|hi>/<id>.md` |
| Calculator and checklist scripts | `guide/tools/<id>.js` |
| Page builder | `scripts/guide-pages.ts` |
| Today's snapshot, served live | `middleware.ts` |
| Source documents (never published, not in git) | `.guide-source/` |

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
nothing half-written can ship. `npm run dev` serves every written page at its
real address.

## How a page file looks

`guide/content/en/density-reference-10am.md` is the reference page: copy its
shape. A file is a JSON header between `---json` and `---`, then Markdown.

```
---json
{
  "title": "The H1, in the words a dealer would search (10-110 chars)",
  "metaTitle": "Shorter title for search results, only if title > 65 chars",
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

- Explain in our own words. Short quotes only (a phrase, or one sentence of up
  to about 25 words, in quotation marks, with its clause). Never copy long
  passages, whole clauses, annexure forms or test-specification tables word for
  word. Facts (figures, deadlines, ranges, lists of what is required) may be
  restated in our words and tables.
- Never host or attach the MDG PDF. The template links to the official copies.
- Name the oil companies in plain text only (IndianOil, Bharat Petroleum,
  Hindustan Petroleum, or IOCL, BPCL, HPCL). No logos. Never suggest they
  endorse, approve or work with MDG Services.
- Never name or describe an individual dealer, outlet, officer or court case
  party. Never print helpline or officer phone numbers.
- Show cause notices, appeals, terminations: general information only. Say a
  lawyer or the oil company should be consulted for a specific case. Never
  draft a reply or tell a dealer what to argue.
- Two versions of a figure (the toilet penalty): show both in one table, name
  the version and date of each, say which is current, and tell the reader to
  confirm with their oil company.

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
