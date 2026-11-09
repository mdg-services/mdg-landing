# The Petrol pump guide

Plain-language pages on getting, licensing and running a petrol pump in India,
for people who want to open one and for dealers who run one, in English and
Hindi, at mdgservices.in/petrol-pump/… and /hi/petrol-pump/…. Their job: when
someone asks Google or a chat-style search "how do I open a petrol pump", "which
licences does a pump need", "how does the dealer commission work", the clearest,
most correct and best-sourced answer is ours.

Separate from the MDG guides (`guide/`, which explain one document, MDG 2024) and
the Khata Kavach pages (`kk-guide/`). The same machine renders all three
(`src/guides/`): one renderer, one set of rules, one release gate. Only the data
is separate. Built on 9 Nov 2026.

| What | Where |
|---|---|
| Every page, its topic and brief | `pump-guide/inventory.ts` |
| Which day each page goes live (10 a day, own calendar) | `pump-guide/schedule.ts` |
| Pages already live, frozen on their day | `pump-guide/release-history.ts` (written by `npm run guide -- freeze pump`) |
| Fixed words, notice, disclaimer | `pump-guide/copy.ts` |
| The words of each page | `pump-guide/content/<en|hi>/<id>.md` |
| Topics waiting to be written | `pump-guide/topics.csv` |
| How the three collections differ (look, tags, rules) | `src/guides/collections.ts` |
| Page rules and rendering (shared) | `src/guides/` (`content.ts`, `model.ts`, `GuidePage.tsx`) |

Commands, from `mdg-landing/`:

```bash
npm run guide -- check
```

```bash
npm run guide -- check pump:en/dealership
```

```bash
npm run guide -- schedule pump
```

```bash
npm run guide -- freeze pump
```

## How a page file looks

The same shape as the MDG guides (`guide/README.md`): a JSON header between
`---json` and `---`, then Markdown.

```
---json
{
  "title": "The H1, in the words a reader would search (10-110 chars)",
  "metaTitle": "Search-result title, at most 50 chars, needed when title > 50",
  "description": "One or two sentences for search results (70-170 chars).",
  "answer": "2-3 sentences that answer the page's main question on their own, with the key figures and source tags (80-700 chars).",
  "faq": [ { "q": "A real question people search", "a": "A complete answer of 1-3 sentences, with source tags." } ],
  "related": ["other-page-id"],
  "updated": "2026-11-09"
}
---
## First section
...
```

- No `# ` heading in the body; at least two `## ` sections. 3 to 10 FAQ items, in
  the words people type (the inventory's `queries` are real searches; use them).
- Links to other pages of this guide: `[words](@page-id)`. Never write a URL to
  our own guide pages by hand. The only hand-written internal links allowed are
  to live MDG guide pages (`/guides/...`, `/hi/guides/...` in Hindi) that exist;
  check the path in `guide/inventory.ts` first.
- The template adds, so do not write: the notice at the top, the "facts checked"
  date (it prints `updated`), the short-answer box, the section lists, the FAQ
  block, related pages, the Dealer Kavach box and the disclaimer.
- `related`: the first four render, so put the closest pages first.

## The dating and sourcing rule (the most important rule)

This guide is about facts that change: fees, guidelines, rates, notifications.
So:

1. **Every fact names its source.** After every rule, figure, fee, deadline,
   percentage or "must" put a source tag: `{{Petroleum Rules 2002, rule 144}}`,
   `{{Legal Metrology Act 2009, s.48}}`, `{{RS answer 2 Dec 2024}}`,
   `{{OMC dealer guidelines 2018}}`. 2 to 60 characters; letters, digits and
   `. , ( ) ' & / : -` only (no %, no #, no rupee sign inside a tag).
2. **Open the source that day.** Read it with WebFetch or WebSearch on the day
   you write. Never write a figure, fee, distance, age, date, rate or rule from
   memory or from a blog. A blog may point you to the primary source; the page
   cites the primary source.
3. **Allowed sources:** laws and rules (indiacode.nic.in, peso.gov.in,
   consumeraffairs.nic.in), Parliament answers (eparlib.sansad.in,
   rsdebate.nic.in, sansad.in), ministries and regulators (petroleum.nic.in,
   pib.gov.in, cpcb.nic.in, cbic-gst.gov.in, powermin.gov.in, bis.gov.in,
   oisd.gov.in, mopng.gov.in), the Petroleum Planning and Analysis Cell
   (ppac.gov.in, the petroleum ministry's own analysis cell, for the dealer
   commission table), tribunal and court documents on official sites
   (greentribunal.gov.in), and an oil company's own published guideline or
   dealership page (Hindustan Petroleum, Bharat Petroleum, Nayara, Jio-bp, Shell).
   **Never link iocl.com** (a rule of the site; the build fails on it). You may
   name Indian Oil in words, and cite a Parliament answer that mentions it.
   Commercial blogs are never a source.
4. **State the date.** In the body say "as on 9 November 2026" (the date you
   checked) beside any figure that can change, and set `updated` to that date.
   When a figure differs by oil company or state, say so and show a small table;
   never present one company's or state's rule as the rule everywhere.
5. **If you cannot find a primary source for a point, leave the point out.**
   Say what the reader should check and where ("the current fee is on the PESO
   site under licence fees"). A page with fewer, solid facts beats one with a
   guessed number. Never invent a figure to fill a table.
6. **Mark practice as practice.** Where a point is common practice and not a
   rule, write "in practice" or "usually" and give no source tag.
7. **End the page with a short `## Where this comes from` section**: 2 to 5
   official links as Markdown links (URL on the official site), one line each
   saying what it contains.
8. **Keep a facts ledger** (outside the repo): for each page a JSON file in
   `/Users/dissu/pump-ledger/<id>.json`: a list of
   `{ "claim", "source_url", "quote", "checked": "2026-11-09" }`, the quote being
   the words on the source that support the claim. The checker reads it.

## What a page must never do

- Promise or hint at a dealership, a licence, an income or a profit. No "earn
  lakhs", no "guaranteed", no "assured". A commission or cost figure is what the
  source states on its date, never what a pump will earn or spend.
- Say or suggest that MDG Services sells, arranges, books or allots dealerships,
  land, licences or approvals. Where a page tells a reader how to get a
  dealership, it says it is only through the oil companies' own advertisements
  and that payment to anyone for one is a fraud sign.
- Give legal, tax or financial advice. Say "ask an advocate / chartered
  accountant / the oil company".
- Use superlatives we cannot prove ("best", "cheapest", "easiest").
- Describe how our own service works internally, or mention how the page
  was written. Mention Dealer Kavach only in the template's closing box.
- Use a real person's or a real dealer's name. Examples are made up and say so.

## Length: crisp, one question per page

A topic's main page (type Pillar) 450-700 words; other pages 300-550. The build
fails above 800 (main) / 650 (others); Hindi is allowed 1.6 times as many words.
Counted: the body (without markup and tags) plus the questions and answers. If a
topic needs more, split it into a new page (add it to `topics.csv`).

## Hindi

Write natural Hindi for a reader in a town, not a translation. Keep what people
type in English as it is: PESO, NOC, GST, KL, E20, CNG, EV, OMC names. Hindi H1
and title lead with the words people search in Hindi ("पेट्रोल पंप कैसे खोलें").
The Hindi page says the same as the English one, with the same source tags and
the same figures (a figure never differs between the two). A Hindi page needs
Devanagari in its body.

The word counter splits Devanagari at vowel signs and counts every link
address as words, so a Hindi page counts about 1.9 times its English words,
while the limit is only 1.6 times (main page 1,280, others 1,040). Write Hindi
compactly, keep "Where this comes from" to 2-3 links, and check each file with
the checker before adding anything.

Where a point holds only for the public sector oil companies (the MDG 2024
guideline), the page says so once, in words.

## Adding pages later (the daily routine)

1. `npm run guide -- freeze pump` first: it pins every page that is live today
   to its day, so adding pages cannot move one.
2. Add the new page to `pump-guide/inventory.ts` (end of the list, `wave: 2`),
   write its `en` and `hi` files, mark its row in `topics.csv` as `written`.
3. `npm run guide -- check` must report 0 missing and 0 problems; then
   `npm run build`.
4. `npm run guide -- schedule pump` shows the new pages from tomorrow, ten a day.
5. Deploy; the site releases each day's pages at 00:00 India time by itself.
