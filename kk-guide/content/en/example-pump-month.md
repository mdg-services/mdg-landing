---json
{
  "title": "A month of diesel credit: a worked example with figures",
  "metaTitle": "A month of diesel credit: worked example",
  "description": "A made-up month of diesel credit: requests, the light at the nozzle, a rupee warning, a manager's PIN past the limit, one bill and a part payment. Every figure adds up.",
  "answer": "In this made-up month, a transport business with a Rs 2,00,000 limit takes 12 diesel fills on credit, each after a request from its own phone. One fill goes past the limit and needs a manager's PIN. A Rs 2,12,400 bill follows, then a Rs 1,50,000 part payment, and credit opens up again.",
  "faq": [
    { "q": "What if a transporter's credit limit is full at the nozzle?", "a": "It follows the rule the owner set for that transporter. Either a manager can allow the fill with a PIN, as on Day 27 here, or the nozzle shows \"No credit\" and the nozzle man fills for cash." },
    { "q": "Does Khata Kavach record cash fills?", "a": "No. A cash fill, like Day 9 here, does not become a line in the account." },
    { "q": "How much was still owed at the end of the month?", "a": "Bill 1 was Rs 2,12,400. After the Rs 1,50,000 part payment, Rs 62,400 was still due, which is Rs 1,37,600 below the Rs 2,00,000 limit." },
    { "q": "What does the owner see when a fill goes past the limit?", "a": "The fill is saved with the manager's name and marked as over the limit. The owner sees it among the fills to look at for the next 7 days, and the transporter sees the mark on his own phone." }
  ],
  "related": ["examples", "example-dispute", "feature-counter-light", "trade-petrol-pump", "feature-bills"],
  "updated": "2026-10-27"
}
---
> **Example:** a made-up business with made-up figures. It is not a real customer.

## The set-up

Sharma Fuels, a made-up petrol pump, sells diesel on credit to Sharma Roadlines, a made-up transport business with three trucks: UP00 SH 1005, 1006 and 1007. Diesel is Rs 90 a litre on the dispenser. The owner sets a [credit limit](@credit-limit) of Rs 2,00,000. Each request names a truck.

## What happens at the nozzle

Each time a truck needs diesel, Sharma Roadlines sends a request from its own phone. At the nozzle, the nozzle man types the last 4 digits and sees a light. He types the litres and rupees as the dispenser shows them.

- **Day 9, no request.** Truck 1006 arrives with none. By default the light is red, "No credit". The nozzle man fills for cash.
- **Day 16, rupees look wrong.** He types 240 litres but Rs 2,160, a zero short. The phone warns that the rupees look far too low for the litres and asks him to check against the dispenser. He fixes it to Rs 21,600.
- **Day 21, near the limit.** Rs 1,73,700 is owed, about 87 percent of the limit. The owner's Today screen lists Sharma Roadlines as near the limit.
- **Day 27, past the limit.** Rs 2,000 is left; he types Rs 14,400. The light is amber, "Call the manager", and the phone asks for a manager's PIN. The transporter's phone then shows the fill marked as over the limit and allowed by the manager. See [the light at the nozzle](@feature-counter-light).

## The twelve fills

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

On Day 30 the owner makes Bill 1 for the 12 fills: Rs 2,12,400. It goes from the owner's own WhatsApp, on the pump's letterhead, with a UPI QR if the pump has added its UPI ID ([numbered bills](@feature-bills)). Sharma Roadlines pays Rs 1,50,000 by UPI. The owner records the money received on Bill 1.

- Bill 1 shows as part paid, with Rs 62,400 due (2,12,400 minus 1,50,000).
- The limit was Rs 12,400 over. Now Rs 1,37,600 is left (2,00,000 minus 62,400): the Rs 1,50,000 received opened that much credit again.
