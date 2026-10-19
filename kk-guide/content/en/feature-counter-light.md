---json
{
  "title": "The counter light and credit limit: green, amber or red before goods go out",
  "metaTitle": "Counter light and credit limit at the counter",
  "description": "How Khata Kavach checks the credit limit at the counter: a green, amber or red light, a manager's PIN for one sale, and what the owner sees.",
  "answer": "Before goods go out, the counter phone shows one light for the vehicle. Green, \"You can serve\", shows the credit left and what to give. Amber, \"Call the manager\", needs a manager's PIN for that one sale. Red, \"No credit\", says why and \"You can serve for cash.\" The owner sets each customer's limit, and the Today screen lists the sales that went past it.",
  "faq": [
    { "q": "How does a credit limit check at the counter work?", "a": "Staff type the last 4 digits of the vehicle. The phone shows a light using the customer's limit, what they owe and whether they sent a request. When staff type the rupees, the phone checks them against the credit left." },
    { "q": "Who can type the manager's PIN?", "a": "An owner or a manager, on the counter phone. Counter staff cannot. One PIN allows one sale, and the next sale asks for it again." },
    { "q": "Does the light work with no signal?", "a": "Yes at the counter, once the app has been opened with internet at least once. The manager's PIN works with no signal too." },
    { "q": "What if the counter phone has not updated for a long time?", "a": "After a long time out of touch, vehicles turn amber and need a manager's PIN until the phone updates. Tap Refresh when it is online." },
    { "q": "Can the owner stop credit to one customer?", "a": "Yes. The owner can freeze the account. The customer's vehicles then show red, and the customer app says no goods will be given." }
  ],
  "related": ["features", "feature-requests", "counter-over-limit", "feature-today"],
  "updated": "2026-10-19"
}
---
## The three lights

| Light | Words on the screen | What staff do |
|---|---|---|
| Green | "You can serve". "Credit left" in whole rupees, "To give" with the request's quantity, "Request valid till". | Tap "Enter sale". |
| Amber | "Call the manager", with the reason. "The manager must type his PIN to allow this sale." | Tap "Manager PIN", or "Call the owner". |
| Red | "No credit", the reason in big words, then "You can serve for cash." | Serve for cash, tap "Call the owner", or tap "Refresh". |

Counter staff never see a customer's phone number. On a red limit screen they see what the customer owes ("Owes").

## Why a light is amber or red

- No request for this vehicle today. Red by default, as explained in [customer requests](@feature-requests).
- The credit limit is used up.
- The customer's account is frozen.
- This vehicle is not on the business's list.
- The customer has not accepted the terms yet.
- This phone has no internet. The customer's request may not have reached it yet, so the light is amber.

## What happens at the limit

The owner chooses, for each customer, what happens when the limit is full. The customer's page in the business app shows the rule: "When the limit is full: a manager can allow it", or "no credit, cash only".

1. The light turns amber, or red if the owner chose cash only.
2. On amber, an owner or a manager types a PIN on the counter phone. They pick their own name ("Which manager?").
3. The sale form opens and the sale is recorded as "Allowed by" that name.
4. The sale carries an "Over the limit" mark.
5. The customer sees the mark on their copy of the line. The owner sees the sale under "Look at these" on the Today screen.

Staff type the rupees at the end. If the rupees pass the credit left, amber needs a manager's PIN. Red says "Cannot go on credit" and "Take cash, or check the rupees again".

> **Note:** Khata Kavach never decides who gets credit. The owner sets every limit. The light shows the owner's own rules at the counter.

## What the owner can check

| Question | Where to look |
|---|---|
| Who went past the limit? | "Look at these" on Today shows flagged sales from the last 7 days. |
| Who is near the limit? | "Near or past the limit" lists customers at 80 percent or more. |
| Which manager allowed it? | On the sale line: "Allowed by" with the name. |

See [the owner's Today screen](@feature-today) and [what staff do when a customer is over the limit](@counter-over-limit).
