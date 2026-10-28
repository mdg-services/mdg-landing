---json
{
  "title": "The light at the nozzle and the credit limit: green, amber or red before fuel goes in",
  "metaTitle": "Light at the nozzle and credit limit",
  "description": "How Khata Kavach checks the credit limit at the nozzle: a green, amber or red light, a manager's PIN for one fill, and what the owner sees.",
  "answer": "Before fuel goes in, the pump's phone shows one light for the truck. Green, \"You can fill\", shows the credit left and what was asked. Amber, \"Call the manager\", needs a manager's PIN for that one fill. Red, \"No credit\", says why and \"You can fill for cash.\" The owner sets each transporter's limit, and the Today screen lists the fills that went past it.",
  "faq": [
    { "q": "How does a credit limit check at the nozzle work?", "a": "The nozzle man types the last 4 digits of the truck number. The phone shows a light using the transporter's limit, what he owes and whether he sent a request. When the nozzle man types the rupees, the phone checks them against the credit left." },
    { "q": "Who can type the manager's PIN?", "a": "An owner or a manager, on the pump's phone. A nozzle man cannot. One PIN allows one fill, and the next fill asks for it again." },
    { "q": "Does the light work with no signal?", "a": "Yes at the nozzle, once the app has been opened with internet at least once. The manager's PIN works with no signal too." },
    { "q": "What if the pump's phone has not updated for a long time?", "a": "After a long time out of touch, trucks turn amber and need a manager's PIN until the phone updates. Refresh when it is online." },
    { "q": "Can the owner stop credit to one transporter?", "a": "Yes. The owner can freeze the account. The light then shows red, and the Transporter app says credit is stopped." }
  ],
  "related": ["features", "feature-requests", "counter-over-limit", "feature-today"],
  "updated": "2026-10-27"
}
---
## The three lights

| Light | Words on the screen | What the nozzle man does |
|---|---|---|
| Green | "You can fill". The credit left in whole rupees, what was asked, and how long the request is valid. | Fills, types the rupees (the litres fill in), taps Done. |
| Amber | "Call the manager", with the reason. The manager must type his PIN to allow this fill. | Asks the manager to type his PIN, or calls the owner. |
| Red | "No credit", the reason in big words, then "You can fill for cash." | Fills for cash, calls the owner, or refreshes. |

Nozzle men never see a transporter's phone number. On a red limit screen they see what the transporter owes.

## Why a light is amber or red

- No request for this truck today. Red by default, as in [transporter requests](@feature-requests). The owner can set a transporter to a manager's PIN (amber).
- The credit limit is used up.
- The transporter's account is frozen.
- This truck is not on the transporter's list of trucks.
- The transporter has not accepted the terms yet.
- This phone has no internet. The transporter's request may not have reached it yet, so the light is amber.

## What happens at the limit

The owner chooses, for each transporter, what happens when the limit is full. The transporter's page shows the rule: a manager can allow it, or no credit, cash only.

1. The light turns amber, or red if the owner chose cash only.
2. On amber, an owner or a manager types a PIN on the pump's phone and picks their own name.
3. The fill is recorded as allowed by that name, and marked as over the limit.
4. The transporter sees the mark on his copy of the line. The owner sees the fill on the Today screen, among the fills to look at.

Then the nozzle man types the rupees. If the rupees pass the credit left, amber needs a manager's PIN. Red says the fill cannot go on credit: take cash, or check the rupees again.

> **Note:** Khata Kavach never decides who gets credit. The owner sets every limit, and the light shows those rules at the nozzle.

## What the owner can check

| Question | Where to look |
|---|---|
| Who went past the limit? | The fills to look at on Today, from the last 7 days. |
| Who is near the limit? | The near-or-past-the-limit list on Today: transporters at 80 percent or more. |

See [the owner's Today screen](@feature-today) and [what staff do when a transporter is over the limit](@counter-over-limit).
