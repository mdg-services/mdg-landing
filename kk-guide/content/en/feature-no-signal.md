---json
{
  "title": "Works with no signal at the counter: what still works and what does not",
  "metaTitle": "Khata app with no signal at the counter",
  "description": "Khata Kavach lets counter staff record a sale with no signal. The sale is saved on the phone and sent when it is online. What needs internet, and what to know.",
  "answer": "At the counter, yes. Once the Business app has been opened with internet, counter staff can find the customer by pickup code, or a vehicle by its last 4 digits, see the light, record a sale with its photo and allow it with a manager's PIN, all with no signal. The sale is saved on the phone and goes when the phone is online. Owner screens need internet, and so does the customer's app when it sends a request.",
  "faq": [
    { "q": "Does this khata app work offline?", "a": "Only the counter side does. Owner screens such as Today, customers, the ledger and bills say \"This page needs internet.\" The customer's app cannot send requests while the customer's phone is offline." },
    { "q": "Can a manager allow a sale when there is no signal?", "a": "Yes. The manager types the PIN on the counter phone, so no signal is needed. One PIN allows one sale, and the sale is marked \"Allowed by\" with the manager's name." },
    { "q": "When does the customer see a sale made with no signal?", "a": "As soon as the counter phone is online again. The phone sends the saved sales on its own, and its photo follows the sale. The customer's app shows the line the next time it refreshes." },
    { "q": "Do I need internet to set up a new counter phone?", "a": "Yes, once. A new phone must be opened with internet so it can load your vehicles, customers and open requests. After that it can open without a signal." }
  ],
  "related": ["feature-counter-light", "feature-requests", "counter-over-limit", "feature-photo", "feature-today"],
  "updated": "2026-10-23"
}
---
## What works at the counter with no signal

A weak signal should not hold up the queue at the counter. In Khata Kavach the sale never waits for the network.

| Job at the counter | With no signal |
|---|---|
| Find the customer by pickup code, or a vehicle by its last 4 digits | Works |
| See the green, amber or red light | Works, from the requests the phone already holds |
| Record the sale and add a photo | Works |
| Allow a sale past the limit with a manager's PIN | Works |
| Fix a sale that has not left the phone yet | Works |
| Owner's Today screen, customers, ledger, bills | Needs internet |
| Customer sending a request | Needs internet |
| Opening the app on a new phone | Needs internet once |

After the staff member taps "Done", the screen says one of two things. Online: "The customer can see it". No signal: "Saved on the phone. Goes when internet returns." The sale is sent as soon as the phone is online. See [the counter light](@feature-counter-light) for what the three colours mean.

## Three limits to know

- **A request may not have arrived.** If the customer sent a request after the counter phone lost signal, the phone cannot see it yet. With no signal and no request on the phone, the light is amber: "This phone has no internet. The customer's request may not have reached this phone yet." A manager can allow it. When the sale reaches the system, it is matched to the customer's open request. If there is none, it is marked "No request". Tap "Refresh" once the signal is back. See [how requests work](@feature-requests).
- **A long time out of touch.** If the counter phone has not updated for a long time, customers and vehicles show amber and need a manager's PIN until it updates. Tap "Refresh" when it is online.
- **Two phones, one limit.** Two counter phones with no signal cannot see each other's sales, so together they can go a little past a customer's limit. Those sales are marked "Over the limit" and show on the owner's [Today screen](@feature-today).
