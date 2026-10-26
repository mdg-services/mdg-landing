---json
{
  "title": "Works with no signal at the nozzle: what still works and what does not",
  "metaTitle": "Khata app with no signal at the nozzle",
  "description": "Khata Kavach lets the nozzle man record a fill with no signal. The fill is saved on the phone and sent when it is online. What needs internet, and what to know.",
  "answer": "At the nozzle, yes. Once the Pump app has been opened with internet, the nozzle man can find a truck by the last 4 digits of its number, see the light, record a fill with its photo and allow it with a manager's PIN, all with no signal. The fill is saved on the phone and goes when the phone is online. Owner screens need internet, and so does the Transporter app when it sends a request.",
  "faq": [
    { "q": "Does this khata app work offline?", "a": "Only the nozzle side does. Owner screens such as Today, transporters, the ledger and bills say they need internet. The Transporter app cannot send requests while the transporter's phone is offline." },
    { "q": "Can a manager allow a fill when there is no signal?", "a": "Yes. The manager types the PIN on the pump's phone, so no signal is needed. One PIN allows one fill, and the fill is marked with the manager's name." },
    { "q": "When does the transporter see a fill made with no signal?", "a": "As soon as the pump's phone is online again. The phone sends the saved fills on its own, and the photo follows the fill. The Transporter app shows the line the next time it refreshes." },
    { "q": "Do I need internet to set up a new pump phone?", "a": "Yes, once. A new phone must be opened with internet so it can load your transporters, their trucks and open requests. After that it can open without a signal." }
  ],
  "related": ["feature-counter-light", "feature-requests", "counter-over-limit", "feature-photo", "feature-today"],
  "updated": "2026-10-27"
}
---
## What works at the nozzle with no signal

A weak signal should not hold up the queue at the pump. In Khata Kavach the fill never waits for the network.

| Job at the nozzle | With no signal |
|---|---|
| Find a truck by the last 4 digits of its number | Works |
| See the green, amber or red light | Works, from the requests the phone already holds |
| Record the fill and add a photo | Works |
| Allow a fill past the limit with a manager's PIN | Works |
| Fix a fill that has not left the phone yet | Works |
| Owner's Today screen, transporters, ledger, bills | Needs internet |
| Transporter sending a request | Needs internet |
| Opening the app on a new phone | Needs internet once |

After the nozzle man taps Done, the screen says one of two things. Online: the transporter can see the fill. No signal: "Saved on the phone. Goes when internet returns." The fill is sent as soon as the phone is online. See [the light at the nozzle](@feature-counter-light) for what the three colours mean.

## Three limits to know

- **A request may not have arrived.** If the transporter sent a request after the pump's phone lost signal, the phone cannot see it yet. With no signal and no request on the phone, the light is amber: this phone has no internet, and the request may not have reached it yet. A manager can allow it. When the fill reaches the system, it is matched to the transporter's open request. If there is none, it is marked "No request". Refresh once the signal is back. See [how requests work](@feature-requests).
- **A long time out of touch.** If the pump's phone has not updated for a long time, transporters and trucks show amber and need a manager's PIN until it updates. Refresh when it is online.
- **Two phones, one limit.** Two pump phones with no signal cannot see each other's fills, so together they can go a little past a transporter's limit. Those fills are marked as over the limit and show on the owner's [Today screen](@feature-today).
