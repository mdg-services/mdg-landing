---json
{
  "title": "A contractor's Rs 50,000 limit, bag by bag: a worked example",
  "metaTitle": "A Rs 50,000 contractor limit: worked example",
  "description": "A made-up week at a building material dealer: cement by the bag, sand by the tonne and steel by the kilo against one Rs 50,000 limit, with a part payment.",
  "answer": "One credit limit in rupees covers every item a contractor takes. In this made-up week the limit is Rs 50,000, and cement in bags, sand in tonnes and steel in kilos all count against it. A part payment opens credit again, and one request is taken back before any goods go out.",
  "faq": [
    { "q": "Can one credit limit cover cement, sand and steel together?", "a": "Yes. The limit is a rupee figure for the customer, not a number of bags. Each item keeps its own unit, such as bags, tonnes or kilos, and every sale counts in rupees against the same limit." },
    { "q": "Does the app keep a rate list for cement and sand?", "a": "No. Counter staff type the quantity and the rupees of what was given. The app shows the rate those two figures work out to, as a check." },
    { "q": "What if the contractor sends a request by mistake?", "a": "While the request is open, the contractor can cancel it from their own phone, as on Thursday here. Once the goods are given, the request is used and cannot be cancelled." },
    { "q": "Where does the contractor see how much credit is left?", "a": "On the home screen of the customer app, under \"Available credit\", with the limit beside it. The owner sees what is owed against the limit on the customer's page." }
  ],
  "related": ["examples", "example-dispute", "trade-cement", "credit-limit", "feature-requests"],
  "updated": "2026-10-23"
}
---
> **Example:** a made-up business with made-up figures. It is not a real customer.

## The set-up

A made-up building material dealer sells to a made-up contractor on credit. The owner sets a [credit limit](@credit-limit) of Rs 50,000 for the contractor. This dealer works by pickup code: the contractor sends a request for each load, the app gives it a 4-digit code, and the contractor passes the code to whoever collects, here his labourer Raju. Nothing is owed on Monday. Rates in this example: cement Rs 400 a bag, sand Rs 1,100 a tonne, steel Rs 65 a kilo.

## The week

| Day | What happens | Quantity | Rupees | Owed after |
|---|---|---|---|---|
| Mon | Cement | 50 bags | 20,000 | 20,000 |
| Tue | Sand | 10 tonnes | 11,000 | 31,000 |
| Wed | Steel | 200 kg | 13,000 | 44,000 |
| Thu | Request for 40 bags taken back | none | 0 | 44,000 |
| Thu | Payment received | | -30,000 | 14,000 |
| Fri | Cement | 60 bags | 24,000 | 38,000 |
| Sat | Sand | 8 tonnes | 8,800 | 46,800 |

Sales come to Rs 76,800 (20,000 + 11,000 + 13,000 + 24,000 + 8,800). Less the Rs 30,000 received, Rs 46,800 is owed. Credit left is 50,000 minus 46,800, which is Rs 3,200.

## Why each line went the way it did

- **By default, every sale starts with a request.** Before each sale the contractor sends a request from the customer app: one item, how much, and "For whom / where" (for example "Raju, site 2"). The app gives it "Your pickup code", which he sends on WhatsApp to whoever collects. Cement is asked in bags, sand in tonnes. At the counter, staff type the code in "Code or customer name" and see "Code matches" and the light. The counter adds "Collected by" Raju, so the line reads "Taken by Raju". See [customer requests](@feature-requests).
- **Wednesday, near the limit.** After the steel, Rs 44,000 is owed, 88 percent of the limit. The owner's Today screen lists the contractor under "Near or past the limit", with "Ask for payment on WhatsApp".
- **Thursday, a request taken back.** The contractor sends a request for 40 bags, then taps "Cancel this request". No goods went out, so there is no sale.
- **Thursday, a payment.** The contractor pays Rs 30,000 to the dealer. The owner records it as "Payment received". Credit left rises from Rs 6,000 to Rs 36,000.
- **Friday and Saturday.** Rs 24,000 and Rs 8,800 are both within the credit left, so the light stays green.

See [cement and building material](@trade-cement) for how this trade sets up its items.
