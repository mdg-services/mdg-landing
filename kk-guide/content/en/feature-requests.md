---json
{
  "title": "Customer requests: the customer asks before the goods go out",
  "metaTitle": "Customer request before credit: how it works",
  "description": "How a customer request works in Khata Kavach: the customer asks from their phone, the counter sees it, and no request means no credit by default.",
  "answer": "In Khata Kavach a credit sale starts with a request from the customer's own phone: one per vehicle, or one with a 4-digit pickup code, as the owner chooses. The counter sees the request and, if the account is in order, shows a green light. By default, with no request the light is red, \"No credit\", and staff can serve for cash. For chosen customers, the owner can let a manager's PIN allow a sale without a request, or trust a regular customer up to his limit.",
  "faq": [
    { "q": "Does the customer send a request for every credit sale?", "a": "Yes, by default. One request covers one sale. If part of it is given, the request is used up and the rest is not carried over." },
    { "q": "What if the customer forgets to send a request?", "a": "The counter light is red. Staff can serve for cash, ask the driver to get the customer to send a request and tap Refresh, or tell the owner, who will ask the customer." },
    { "q": "Can a customer change a request?", "a": "No. The customer cancels it with \"Cancel this request\" and sends a new one. Once the goods are given, the request is used and cannot be cancelled." },
    { "q": "A vehicle arrives at 2 a.m. on a request made the evening before. Does it count?", "a": "Yes, if the request is still valid. \"Today\" means the business's day, which starts at 6 a.m. by default." },
    { "q": "Does a request mean the customer is approved for credit?", "a": "No. A request is just an ask. The business's limit for that customer and the counter light decide whether goods go out on credit." }
  ],
  "related": ["features", "feature-counter-light", "counter-driver", "feature-customer-app"],
  "updated": "2026-10-23"
}
---
## What the customer does

The customer opens a link from the business and taps "I agree" once. What they send follows the owner's choice of how the counter knows the customer.

**By vehicle number: one request for each vehicle.** Tap "Send requests" and answer "Which vehicles need goods today?" Pick the item, say how much (in the item's own unit, in "Rupees", or "As needed") and check "Valid till", today by default.

**By code or name: one request for one item.** Tap "Send requests", pick the item, say how much, and add "For whom / where" if you like, such as "Raju, site 2". The app shows "Your pickup code", four digits, and "Send on WhatsApp" passes it to whoever collects.

A customer who sent a request by mistake taps "Cancel this request", or "Made a mistake? Take them all back". If a rupee request may take the balance over the limit, the app warns "Your balance may go over the limit". It is a warning only; the counter checks the limit.

## What the counter sees

By vehicle number, the home screen lists "To serve today: N vehicles", each with a chip. By code or name, staff type the code in "Code or customer name", and the right code shows "Code matches" and the light. Picked by name instead, the screen says "Ask for the code", and a manager's PIN can allow it. A wrong code is refused.

| Chip | Light | What staff do |
|---|---|---|
| "Can serve" | Green: "You can serve" | Check "To give" and tap "Enter sale". |
| "Needs PIN" | Amber: "Call the manager" | A manager types a PIN. See [the counter light](@feature-counter-light). |
| "No credit" | Red | "You can serve for cash." |

## When there is no request

The owner sets this for each customer, under "With no request":

- **"No credit"** (the default): red.
- **"Manager PIN"**: amber. The sale is marked "No request" and "Manager allowed it", and the customer sees both marks.
- **"Trust him"**: any staff can give goods on his name, with no request or code, up to his limit, which always applies. New customers of a gas agency, wholesaler or dairy start here.

## Why this takes the stress off the owner

By default, credit goes out only against a request the customer sent. A sale beyond what was asked is marked "More than requested", and the owner sees it. The request sits on the customer's phone and in the shared record, so both sides see what was asked for. See [what a driver collecting on credit needs](@counter-driver).
