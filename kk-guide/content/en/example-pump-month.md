---json
{
  "title": "A month of diesel credit: a worked example with figures",
  "metaTitle": "A month of diesel credit: worked example",
  "description": "A made-up month of diesel credit: requests, the counter light, a typo warning, a manager's PIN past the limit, one bill and a part payment. Every figure adds up.",
  "answer": "In this made-up month, a transport business with a Rs 2,00,000 limit takes 12 diesel sales on credit, each after a request from its own phone. One sale goes past the limit and needs a manager's PIN. A Rs 2,12,400 bill follows, then a Rs 1,50,000 part payment, and credit opens up again.",
  "faq": [
    { "q": "What if a customer's credit limit is full at the counter?", "a": "It follows the rule the owner set for that customer. Either a manager can allow the sale with a PIN, as on Day 27 here, or the counter shows \"No credit\" and staff sell for cash." },
    { "q": "Does Khata Kavach record cash sales?", "a": "No. A cash sale, like Day 9 here, does not become a line in the account. The account is for credit sales and money received, with corrections as new lines." },
    { "q": "How much was still owed at the end of the month?", "a": "Bill 1 was Rs 2,12,400. After the Rs 1,50,000 part payment, Rs 62,400 was still due, which is Rs 1,37,600 below the Rs 2,00,000 limit." },
    { "q": "What does the owner see when a sale goes past the limit?", "a": "The sale is saved with the manager's name and flagged \"Over the limit\". The owner sees it in \"Look at these\" for the next 7 days, and the customer sees the flag on their own phone." }
  ],
  "related": ["examples", "example-contractor-limit", "feature-counter-light", "trade-petrol-pump", "feature-bills"],
  "updated": "2026-10-23"
}
---
> **Example:** a made-up business with made-up figures. It is not a real customer.

## The set-up

Sharma Traders, a made-up fuel business, sells diesel on credit to Sharma Roadlines, a made-up transport business with three trucks: UP00 SH 1005, 1006 and 1007. The rate is Rs 90 a litre. The owner sets a [credit limit](@credit-limit) of Rs 2,00,000. A fuel business works by vehicle number, so each request names a truck. Other trades work by a 4-digit pickup code: see [a contractor's limit](@example-contractor-limit).

## What happens at the counter

Each time a truck needs diesel, Sharma Roadlines sends a request from its own phone. At the counter, staff type the last 4 digits and see a light.

- **Day 9, no request.** Truck 1006 arrives with none. By default the light is red, "No credit". Staff sell for cash.
- **Day 16, a typo.** Staff type 240 L but Rs 2,160, a zero short. The phone says: "That works out to ₹9.00/L. Check the quantity and rupees against what was given." They fix it to Rs 21,600.
- **Day 21, near the limit.** Rs 1,73,700 is owed, about 87 percent of the limit. The owner's Today screen lists Sharma Roadlines under "Near or past the limit".
- **Day 27, past the limit.** Rs 2,000 is left; staff type Rs 14,400. The phone asks for a manager's PIN. The customer's phone then shows the sale flagged "Over the limit" and "Manager allowed it". See [the counter light](@feature-counter-light).

## The twelve sales

| Day | Truck | Litres | Rupees |
|---|---|---|---|
| 2 | 1005 | 150 | 13,500 |
| 2 | 1006 | 200 | 18,000 |
| 4 | 1007 | 120 | 10,800 |
| 6 | 1005 | 200 | 18,000 |
| 8 | 1006 | 180 | 16,200 |
| 11 | 1005 | 220 | 19,800 |
| 13 | 1007 | 160 | 14,400 |
| 16 | 1006 | 240 | 21,600 |
| 18 | 1005 | 260 | 23,400 |
| 21 | 1007 | 200 | 18,000 |
| 24 | 1006 | 270 | 24,300 |
| 27 | 1005 | 160 | 14,400 |
| **Total** | | **2,360** | **2,12,400** |

## The bill and the part payment

On Day 30 the owner makes Bill 1 for the 12 sales: Rs 2,12,400. It goes from the owner's own WhatsApp, with a UPI QR if the business has added its UPI ID ([numbered bills](@feature-bills)). Sharma Roadlines pays Rs 1,50,000 by UPI. The owner taps "Money received" on Bill 1 and types it in.

- Bill 1 shows "Part paid", with Rs 62,400 due (2,12,400 minus 1,50,000).
- The limit was Rs 12,400 over. Now Rs 1,37,600 is left (2,00,000 minus 62,400): the Rs 1,50,000 received opened that much credit again.
