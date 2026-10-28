# The Khata Kavach pages

Plain-language pages for petrol pump owners who give fuel on credit (udhar) to
transporters, fleet owners and other regular customers, and keep the account,
in English and Hindi, at mdgservices.in/khata-kavach/… and
/hi/khata-kavach/…. Their job: when a pump owner (or the transporter who buys
from one) asks Google or an AI assistant a question about giving credit,
keeping the khata, getting paid, or which credit app fits, the clearest and
most honest answer is ours, and it shows where Khata Kavach fits.

Since 27 Oct 2026 Khata Kavach is for petrol pumps only (it was briefly offered
to any trade, 19 to 26 Oct). Every page speaks to a pump and its customers.

They run on the same machine as the MDG guides (`guide/`, `src/guides/`): one
renderer, one set of rules, one release gate. Only the data is separate.

| What | Where |
|---|---|
| Every page, its topic, wave and brief | `kk-guide/inventory.ts` |
| Which day each page goes live (5 a day, own calendar) | `kk-guide/schedule.ts` |
| Fixed words, notice, disclaimer, the Khata Kavach box | `kk-guide/copy.ts` |
| The words of each page | `kk-guide/content/<en|hi>/<id>.md` |
| How the two collections differ (look, tags, rules) | `src/guides/collections.ts` |
| Page rules and rendering (shared) | `src/guides/` (`content.ts`, `model.ts`, `GuidePage.tsx`) |

Commands, from `mdg-landing/`:

```bash
npm run guide -- check
```

```bash
npm run guide -- check kk:en/hub
```

```bash
npm run guide -- schedule kk
```

## How a page file looks

The same shape as the MDG guides (see `guide/README.md`): a JSON header
between `---json` and `---`, then Markdown.

- No `# ` heading in the body; at least two `## ` sections.
- 3 to 10 FAQ items, phrased the way people search.
- Links to other pages: `[words](@page-id)`. Never write a URL to our own pages by hand.
- **Source tags**: `{{Limitation Act 1963, Art. 14}}` draws a small source chip.
  Use one after every legal rule, figure or deadline (2 to 60 characters,
  letters, digits and plain punctuation).
- External links only to official sources (indiacode.nic.in, a government
  site, or the other app's own website or store listing).
- The template adds, so do not write: the notice at the top, the "facts
  checked" date, the short-answer box, the section lists, the FAQ block,
  related pages, the Khata Kavach box and the disclaimer.

## Length: crisp, one question per page

Same limits as the MDG guides: a topic's main page 450-700 words, other pages
300-550; the build fails above 800 (main) / 650 (others), Hindi ×1.6. If a
topic needs more, it becomes two pages. Shape: the short answer; the one table
or step list that carries it; at most one short example; 3-5 FAQs.

## Positioning: what every page should leave behind

The owner's words: Khata Kavach is **really simple and straightforward**; it
**takes the stress off the person who gives credit**; it **gives both sides
visibility** of every sale; and it is **clearly different** from other khata
apps. Show this with facts, never with adjectives.

The true differences, in the order they matter:

1. The transporter asks first. Every credit fill starts with a request from
   the transporter's phone, one per truck: litres, rupees, or a full tank. No
   request, no credit by default; per transporter the owner can let a manager's
   PIN allow a fill without one.
2. One shared line, seen by both. Nothing is edited: a correction is a new
   line, so both sides see what changed.
3. The limit is checked at the nozzle, before fuel goes in: a green, amber or
   red light, and a manager's PIN to go past it. The owner sees every one.
4. The owner's Today screen answers the daily questions: credit given today,
   money received, still owed, who is near the limit, which fills look wrong.
5. The nozzle stays simple: the last 4 digits of the truck number, one light,
   type the rupees from the dispenser and the litres fill in at the day's rate
   (he can correct them), Done. Each morning from 6 a.m. the first person to
   open the Pump app types each fuel's rate, or takes yesterday's with one tap;
   an owner or manager corrects it. The transporter sees no rate list. Nozzle
   men never see a transporter's phone number.
6. No signal at the nozzle? The fill is saved on the phone and sent later.
7. A photo with a fill (number plate, slip), if the nozzle man takes one.
8. A numbered bill in a tap, on the pump's letterhead, with a UPI QR, sent
   from the pump's own WhatsApp. Money received against a bill marks it paid.
9. It never lends and never holds money.
10. Hindi first. A pump starts on its own in the Pump app in about a minute;
    a person at MDG answers the phone, 9am to 9pm, every day.
11. Everyone signs in with a 6-digit PIN. Owners (pump and transporter) prove
    an email with a code sent to it. A transporter has an owner and, if he
    wants, managers (munshis) with their own phones and PINs; only the owner
    accepts a pump's terms and adds people. The pump's invite link works once.

**Who it is for, honestly:** petrol pumps (of any oil company) that give
diesel and petrol on credit to regular customers who come in their own trucks
or vehicles: transporters, fleet owners, bus and tractor owners, contractors'
machines. And the transporter on the other side, who uses the Transporter app
to send requests and see every fill. It sells the four fuels
only (diesel, petrol, premium diesel, premium petrol), by the litre. Do not
write that it suits shops, other trades or walk-in customers.

### The two apps and their words

| | Pump app (Khata Kavach Pump, पंप ऐप) | Transporter app (Khata Kavach Transporter, ट्रांसपोर्टर ऐप) |
|---|---|---|
| Who | The owner, managers, nozzle men | The transporter and his staff |
| What | Fill on credit by truck number, the light, Today, transporters, limits, requests, bills, payments, staff | Daily requests per truck, every fill, bills with a UPI button, what is owed, trucks |
| Starts | "Set up your pump" (अपना पंप जोड़ो) on the first screen | An invite link from the pump on WhatsApp |

At the nozzle: the nozzle man types the last 4 digits of the truck number
("गाड़ी का नंबर"), sees the light and how much credit is left, types litres and
rupees off the dispenser, taps Done. Both phones show the fill.

## Product claims: never write these

| Never | Write instead |
|---|---|
| free, a price, "starting at", "try free" | "Call us; the price depends on your business." |
| "on Google Play", "download from the Play Store", iPhone app | "Both apps open in the phone's browser. Android apps are coming to Google Play." |
| AI, smart, automatic fraud detection | "It marks sales that look wrong (more than requested, over the limit…)." |
| GST invoice, tax invoice, e-invoice, GST-ready | "A numbered bill, not a GST tax invoice." |
| instant, real time | "as soon as the phone is online" |
| the whole app works offline | "works with no signal at the counter" |
| automatic reminders, "we message your customers" | "one tap opens your own WhatsApp with the message ready" |
| staff cannot see balances or limits | "nozzle men never see a transporter's phone number" |
| stops fraud, ends disputes, zero leakage | "a wrong fill shows up on both phones, with who filled and a photo" |
| legally valid, court proof, audit-ready | say nothing about legal weight |
| users, "trusted by", testimonials, real case studies | examples are made up and say so |
| loan, credit score, BNPL, "we collect your dues" | "Khata Kavach keeps the account. It never lends or holds money." |
| 24x7 | "9am to 9pm, every day" |
| business, customer, counter staff, sale, "any trade", items or units | pump, transporter (or customer), nozzle man, fill; the four fuels by the litre |
| oil company names as partners, "IOCL-approved" | "For pumps of any oil company. Not connected with any oil company." |
| how it is built: servers, database, sync timing, libraries | outcomes only |

## Other apps: comparison rules

(The legal research of 19 Oct sets these; see the Legal section.)

- Facts about another app come only from its own website, help pages or store
  listing, each checked on the page's `updated` date. Write "we did not find X
  on its website", never "it cannot do X".
- Say plainly where the other app is stronger (installs, GST invoices, free
  tier, iPhone app, lending, languages). A comparison that only praises us is
  not believed and is not fair.
- Compare like with like: a credit book with a credit book; a billing app's
  ledger with our ledger. No logos, no screenshots of their apps.
- No "best", "simplest", "number one" about Khata Kavach. "Which fits" beats
  "which is best".
- Their names in plain text, as they write them. Never suggest any connection.

## Examples ("case studies")

No real business is verified as a customer, so there are no real case studies.
Example pages walk one made-up pump through a real situation with the real
screens, and say at the top: "An example with a made-up pump and made-up
figures." Use the site's made-up names (Sharma Fuels, Sharma Roadlines,
Gupta Transport, plate UP00 SH 1005) or new obviously made-up ones. Never say
"saved X%", "cut disputes by…", or any result.

## Voice

Plain words, short sentences, active voice, the pump owner's own
questions. Lead with what it means for them. Real figures in examples. No
filler. Hindi pages: natural Hindi a trader in UP, Bihar, Rajasthan or MP
speaks, in Devanagari, with the words the apps use (पंप, ट्रांसपोर्टर, नोज़ल मैन,
गाड़ी, भराई / फ़िल, रिक्वेस्ट, उधार की सीमा, बिल, पैसे मिले); PIN, WhatsApp, UPI,
PDF in Latin letters; the searched Hinglish phrasing in FAQ questions.

What Hindi searchers type (Google and YouTube suggestions, 19 Oct 2026):

- **उधार first.** "उधार खाता", "उधार का हिसाब", "उधार वसूली". उधारी for the debt
  side ("उधारी कैसे वसूल करें").
- **Never "क्रेडिट" in a Hindi title or heading.** In Hindi searches it means
  credit cards, credit scores and loans. Say "उधार की सीमा", not "क्रेडिट
  लिमिट" (the app's own screen word "लिमिट में बचा" may be quoted as a screen
  word).
- **"बही खाता" only as "बही खाता ऐप" or "डिजिटल बही खाता".** On its own it is a
  school-accounting and Diwali-puja word.
- **हिसाब / हिसाब किताब** is the everyday word: use it beside खाता.
- **App searches are typed in Roman script**: put "udhar khata app", "udhar ka
  hisab rakhne wala app" and similar in the Hindi page's FAQ or body as typed.
- **Speak to the pump owner, not to someone who lent money to a friend.**
  Many "udhar wapas" searches are personal loans: say in the first lines that
  the page is for a pump and its regular customers (transporters, fleets).
- Never: shayari, totke, mantra, "किस दिन उधार न दें". "उधार बंद" posters only
  on the poster page (`tool-udhar-poster`, added 26 Oct 2026 at the owner's
  request), where most posters are about credit with a limit, a slip and old
  dues cleared, not about refusing credit.

## Legal

From the legal research of 19 Oct 2026 (ASCI Code, October 2026 edition; CCPA
Guidelines 2022; Trade Marks Act ss.29(8) and 30(1); Dabur v Colortek, Reckitt
v HUL, Havells v Khaitan). Research, not a lawyer's opinion. Every page on our
own site is an advertisement in ASCI's sense, and ASCI protects business
readers too.

### Comparisons (ASCI Chapter IV; CCPA 12)

- One clearly named aspect at a time, like with like (same plan tier, said
  plainly: "their free plan"), factual, provable from a dated source we hold.
- No running down, by words, tone or implication, of a named app or of the
  whole category ("other apps are complicated", "paper is stupid"). Write our
  fact; let the table carry the contrast.
- No "better than X", "X alternative: why we win", "unlike X…".
- Every comparison table: neutral yes / no / partly (no red crosses on their
  column only), rows where they are stronger included, and directly under the
  table in the page's own language: "Facts about [X] from [X]'s own website
  and app listing, checked on [date]. Tell us if anything has changed."
- Competitor names in visible text only (title, headings, body, table). Never
  in image alt text or anything a reader cannot see. No logos, icons,
  screenshots, taglines or look-alike colours.
- Never name an oil company, bank or government body as if it endorses us.
  "For pumps of any oil company. Not connected with any oil company."

### Claims (ASCI 1.1-1.6; CCPA 4, 7, 12)

- No "best", "No. 1", "most trusted", "first", "only" about Khata Kavach.
  Describe the feature instead ("one screen, three colours").
- No "free", "starting at", "from as low as". Pricing: "Call us."
- No saving or result figures ("save 2 hours", "cut bad debt 40%", "customers
  pay faster"). Describe the mechanism.
- No guarantees: never "recover your udhar", "zero bad debt", "risk-free".

### Examples and case studies (CCPA 13-14; ASCI 1.3, 1.4, AI-content guideline)

- First line of every example page, as a quote block: "> **Example:** a
  made-up pump with made-up figures. It is not a real customer." (Hindi:
  "> **उदाहरण:** काल्पनिक पंप, काल्पनिक आँकड़े। यह कोई असली ग्राहक नहीं है।")
- Role labels or obviously made-up names (Sharma Fuels, Sharma Roadlines,
  Gupta Transport, plate UP00 SH 1005). No town that makes it look real, no
  photo of a person, no quotes from a "customer".
- Figures only to show the arithmetic ("if 10 vehicles each take…"), never as
  an outcome the reader will get.

### Lending, payments, credit data (RBI; PSS Act; CIC Act)

- Never: "we give credit", loan, BNPL, "finance your customers", "pay through
  Khata Kavach", wallet, gateway, "we collect payments", credit score, credit
  report, defaulter list, blacklist.
- Always: "You set the credit limit for each customer. Khata Kavach never lends
  and never holds money. The customer pays you directly; you record it."

### Law pages (Part B of the research)

General information, never advice. Every law page ends its body with:
"General information, not legal advice. For your own case, speak to an
advocate or a chartered accountant." (Hindi: "यह सामान्य जानकारी है,
कानूनी सलाह नहीं। अपने मामले के लिए किसी एडवोकेट या चार्टर्ड अकाउंटेंट से
बात करें।") Use only these settled points, each with its source tag, and say
what is uncertain:

| Topic | Safe to state | Say it is uncertain |
|---|---|---|
| Time limit | 3 years from delivery when no credit period was agreed {{Limitation Act 1963, Art. 14}}; 3 years from the end of an agreed credit period {{Limitation Act 1963, Art. 15}}. A written, signed acknowledgment before the period ends starts it afresh {{Limitation Act 1963, s.18}}; a part payment does too, only with a written acknowledgment of it by the payer {{Limitation Act 1963, s.19}}. | When many deliveries run on one account, courts differ on when the clock starts. Whether an in-app confirmation counts as a signed acknowledgment is not settled: say "may help as evidence". |
| Cheque bounce | Presented within its validity (3 months in practice); written demand within 30 days of the bank's return memo; the drawer has 15 days to pay; complaint within 1 month after that {{NI Act 1881, s.138}} {{NI Act 1881, s.142}}. Up to 2 years' jail or fine up to twice the amount, or both. | Security cheques and disputed or time-barred debts may fall outside. |
| MSME 45 days | Written to protect micro and small suppliers with Udyam registration: pay within the agreed date, at most 45 days, or 15 days with no agreement {{MSMED Act 2006, s.15}}; after that, compound interest at three times the RBI bank rate {{MSMED Act 2006, s.16}}; claims through the MSME ODR portal. Buyers' tax deduction waits until payment {{Income-tax Act, s.43B(h)}}. | Whether a trader (a pump, a dealer) qualifies is doubtful: say so. The 2026 amendment's new timelines may not be in force: do not describe them. |
| Recovery steps | A written demand is usual practice; commercial disputes of Rs 3 lakh or more need mediation tried first {{Commercial Courts Act 2015, s.12A}}; a summary suit is a faster route where a written contract or bill supports a fixed sum {{CPC, Order XXXVII}}. | No small-causes rupee limits, court fees or timelines. Whether a khata counts as a written contract is not settled. |
| Electronic records | A phone or server record can be evidence, normally with a certificate {{BSA 2023, s.63}}. | Never "court-ready", "legally valid", "admissible". |
| GST | GST is due on supply even if the customer has not paid {{CGST Act 2017, s.12}}; a buyer who has not paid within 180 days of the invoice must reverse the input tax credit and can re-claim it once paid {{CGST Act 2017, s.16(2)}}. An unregistered seller may not charge GST on a bill {{CGST Act 2017, s.32}}. Petrol and diesel are outside GST (state VAT and central excise apply). | GST relief on a debt written off: say nothing. Registration thresholds: say "check the current limit". |
| Interest | Safest when agreed in writing before the sale; where nothing is agreed, a court decides {{Interest Act 1978, s.3}}. | Caps under state money-lending laws: say nothing. |

Never on any page: "resets the time limit", "makes udhar legally binding",
"customer cannot deny", "MSME law makes your customers pay in 45 days" (to a
trader), "cheque bounce means jail", "we recover your money".
