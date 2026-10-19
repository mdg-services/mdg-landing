---json
{
  "title": "Customer requests: the customer asks before the goods go out",
  "metaTitle": "Customer request before credit: how it works",
  "description": "How a customer request works in Khata Kavach: the customer asks from their phone, the counter sees it, and no request means no credit by default.",
  "answer": "In Khata Kavach every credit sale starts with a request from the customer's own phone, one per vehicle. The counter sees the request and, if the account is in order, shows a green light. By default, with no request the light is red, \"No credit\", and staff can serve for cash. The owner can let a manager allow a sale without a request, for chosen customers.",
  "faq": [
    { "q": "Does the customer send a request for every credit sale?", "a": "Yes, by default. One request covers one sale. If part of it is given, the request is used up and the rest is not carried over." },
    { "q": "What if the customer forgets to send a request?", "a": "The counter light is red. Staff can serve for cash, ask the driver to get the customer to send a request and tap Refresh, or tell the owner, who will ask the customer." },
    { "q": "Can a customer change a request?", "a": "No. The customer cancels it with \"Cancel this request\" and sends a new one. Once the goods are given, the request is used and cannot be cancelled." },
    { "q": "A vehicle arrives at 2 a.m. on a request made the evening before. Does it count?", "a": "Yes, if the request is still valid. \"Today\" means the business's day, which starts at 6 a.m. by default." },
    { "q": "Does a request mean the customer is approved for credit?", "a": "No. A request is just an ask. The business's limit for that customer and the counter light decide whether goods go out on credit." }
  ],
  "related": ["features", "feature-counter-light", "counter-driver", "feature-customer-app"],
  "updated": "2026-10-19"
}
---
## What the customer does

The customer opens a link from the business, reads the terms once and taps "I agree". After that, sending a request takes a few taps.

1. Tap "Send requests". The screen asks "Which vehicles need goods today?"
2. Pick vehicles: "All N vehicles", "Same as last time" (yesterday's vehicles and amounts), or search by vehicle number. A vehicle that already has an open request today is left out.
3. Say how much: in the item's own unit (litres, bags, kg), in "Rupees", or "As needed". For items sold by the litre, the third choice reads "Full tank". Use one amount for every vehicle, or a different one for each.
4. Pick the item from the business's list.
5. Check "Valid till". It is today unless the customer picks tomorrow or the day after.
6. Send. Up to 200 vehicles go in one batch. The Send button waits for internet and reads "When online" until then.

A customer who sent a request by mistake taps "Made a mistake? Take them all back", or "Cancel this request" on one. If a rupee request may take the balance over the limit, the app warns "Your balance may go over the limit". It is a warning, nothing more. The limit is checked at the counter.

## What the counter sees

The home screen lists "To serve today: N vehicles", each with a chip.

| Chip | Light | What staff do |
|---|---|---|
| "Can serve" | Green: "You can serve" | Check "To give" (for example 50 bags) and tap "Enter sale". |
| "Needs PIN" | Amber: "Call the manager" | A manager types a PIN. See [the counter light](@feature-counter-light). |
| "No credit" | Red | "You can serve for cash." |

A vehicle with no request comes up red with "No request for this vehicle today".

## When the owner allows no-request sales

The owner can switch on "A manager can allow a sale without a request" for chosen customers. Their vehicles then show amber, and a manager types a PIN. The sale is marked "No request" and "Manager allowed it", and the customer sees both marks. It stays off unless the owner turns it on.

## Why this takes the stress off the owner

By default, credit goes out only against a request the customer sent. A sale beyond what was asked is marked "More than requested", and the owner sees it. The request sits on the customer's own phone and in the shared record, so both sides can see what was asked for. See [what a driver collecting on credit needs](@counter-driver).
