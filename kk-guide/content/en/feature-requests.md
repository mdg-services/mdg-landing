---json
{
  "title": "Transporter requests: the transporter asks before the truck fills",
  "metaTitle": "Transporter request before credit: how it works",
  "description": "How a transporter request works in Khata Kavach: he asks from his phone, the nozzle man sees it, and no request means no credit by default.",
  "answer": "In Khata Kavach a credit fill starts with a request from the transporter's own phone: one per truck, in litres, in rupees or for a full tank. The nozzle man sees the request and, if the account is in order, a green light. By default, with no request the light is red, \"No credit\", and he can fill for cash. For chosen transporters, the owner can let a manager's PIN allow a fill without a request.",
  "faq": [
    { "q": "Does the transporter send a request for every credit fill?", "a": "Yes, by default. One request covers one fill. If the truck takes less than asked, the request is used up and the rest is not carried over." },
    { "q": "What if the transporter forgets to send a request?", "a": "The light is red. The nozzle man can fill for cash, ask the driver to get the transporter to send a request and refresh the screen, or tell the owner, who will call the transporter." },
    { "q": "Can a transporter change a request?", "a": "No. He cancels it and sends a new one. Once the truck has filled, the request is used and cannot be cancelled." },
    { "q": "A truck arrives at 2 a.m. on a request made the evening before. Does it count?", "a": "Yes, if the request is still valid. \"Today\" means the pump's day, which starts at 6 a.m. by default." },
    { "q": "Does a request mean the transporter is approved for credit?", "a": "No. A request is just an ask. The pump's limit for that transporter and the light decide whether fuel goes in on credit." }
  ],
  "related": ["features", "feature-counter-light", "counter-driver", "feature-customer-app"],
  "updated": "2026-10-27"
}
---
## What the transporter does

The transporter opens the invite link the pump sent on WhatsApp and agrees to the terms once. After that, each day, he taps "Send requests" and answers "Which trucks need fuel today?"

**One request for each truck.** For every truck he picks the fuel (diesel, petrol, premium diesel or premium petrol) and answers "How much to fill?": litres, rupees or a full tank. The request is valid for today unless he picks another day.

A transporter who sent a request by mistake cancels it. If a request in rupees may take the balance over the limit, the app warns him. It is a warning only; the nozzle checks the limit.

## What the nozzle man sees

The home screen lists the trucks to fill today. He types the last 4 digits of the truck number and sees one light.

| Light | Words on the screen | What the nozzle man does |
|---|---|---|
| Green | "You can fill" | Checks what was asked, types the rupees (the litres fill in), taps Done. |
| Amber | "Call the manager" | A manager types a PIN. See [the light at the nozzle](@feature-counter-light). |
| Red | "No credit" | "You can fill for cash." |

## When there is no request

The owner sets this for each transporter:

- **"No credit"** (the default): red.
- **A manager's PIN**: amber. The fill is marked "No request" and "Manager allowed it", and the transporter sees both marks.

## Why this takes the stress off the owner

By default, credit goes out only against a request the transporter sent. A fill of more than was asked is marked, and the owner sees it. The request sits on the transporter's phone and in the shared record, so both sides see what was asked for. See [what a driver who fills on credit needs](@counter-driver).
