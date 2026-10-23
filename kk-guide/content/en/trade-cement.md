---json
{
  "title": "Cement dealer credit management: building material on credit",
  "metaTitle": "Cement dealer credit management",
  "description": "How a cement or building material dealer keeps contractor credit in order: one rupee limit across items, a pickup code per request, each item in its own unit, one bill.",
  "answer": "Credit is common in cement and building material. A CRISIL survey of over 100 cement dealers in 13 states, published on 18 May 2020 and reported by Moneylife {{CRISIL survey via Moneylife, 18 May 2020}}, found that 95% give credit to retailers and key end-users such as contractors. To keep it under control: one limit in rupees for each contractor across all items, a request and pickup code for each collection, each item in its own unit, and a bill for a period. Prefer vehicle numbers? The owner can switch the counter to those.",
  "faq": [
    { "q": "How much credit should a cement dealer give a contractor?", "a": "A common rule of thumb is monthly purchases times credit days divided by 30. For Rs 3,00,000 a month on 15 days, that is Rs 1,50,000. It is not a law. Start lower for a new contractor." },
    { "q": "Can sand, steel and bricks go on the same bill as cement?", "a": "Yes. One bill lists every credit sale in the period, with a \"By item\" summary when there is more than one item. Each item keeps its own unit." },
    { "q": "What if the contractor's supervisor collects the goods?", "a": "The contractor passes the 4-digit pickup code to whoever collects: a supervisor, a labourer or a hired tractor. Staff type the code and see \"Code matches\" and the light." },
    { "q": "What if a contractor pays part of a bill?", "a": "Type it in as \"Money received\" on that bill. The bill shows \"Part paid\" with what is still due, and that much credit opens up again." },
    { "q": "Does Khata Kavach track my cement stock?", "a": "No. It records what was sold on credit and money received, not what is in the godown. Keep your stock register or billing software for that." }
  ],
  "related": ["trades", "credit-limit", "example-contractor-limit", "trade-contractor", "feature-bills"],
  "updated": "2026-10-23"
}
---
## Credit is how this trade runs

A CRISIL survey of over 100 cement dealers in 13 states, published on 18 May 2020 and reported by Moneylife {{CRISIL survey via Moneylife, 18 May 2020}}, found that 95% give credit to retailers and key end-users such as contractors (CRISIL's own release was not available to us). The cost of credit is money tied up and the risk of not being paid. A limit and a record keep both in view.

## What is different in this trade

- **Many items, each in its own unit.** Cement in bags, sand in tonnes, steel in kg, bricks in pieces.
- **Different people collect.** A site supervisor, a labourer or a hired tractor may collect on different days.
- **One limit.** Set the [credit limit](@credit-limit) in rupees across all items, because rates move.
- **Billing for a period.** You choose the days a bill covers.

## A made-up bill

An example with made-up figures. It is not a real customer. A contractor collects four items in one period:

| Item | Quantity | Rupees |
|---|---|---|
| Cement | 130 bags | 52,650 |
| Sand | 12 tonnes | 14,400 |
| Steel bars | 800 kg | 48,000 |
| Bricks | 5,000 pieces | 40,000 |
| **Total** | | **1,55,050** |

With a limit of Rs 5,00,000 and nothing owed before, Rs 3,44,950 of credit is left (5,00,000 minus 1,55,050).

## How Khata Kavach handles it

1. By default, the contractor sends a request from their own phone: the item, how much, and "For whom / where". The app gives it a 4-digit "Your pickup code" to send on WhatsApp to whoever collects.
2. At the counter, staff type the code in "Code or customer name", see "Code matches" and a green, amber or red light, type the quantity and the rupees exactly as given, and tap "Done". See [the counter light](@feature-counter-light).
3. One limit covers every item. By default, past the limit a manager's PIN is needed, and the owner's Today screen flags the sale.
4. Make a bill in a tap. Each line shows the item, quantity, rupees and, if the counter added a name, who took it ("Taken by Raju"), so the contractor can match it to site records. Send it from your own WhatsApp.

The Khata Kavach bill is a numbered bill, not a GST tax invoice. Issue the tax invoice from your billing software. The contractor pays you directly, and Khata Kavach never lends or holds money.
