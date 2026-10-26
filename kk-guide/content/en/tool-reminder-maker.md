---json
{
  "title": "Payment reminder maker: a ready WhatsApp message for a credit customer",
  "metaTitle": "Payment reminder message maker for WhatsApp",
  "description": "Make a payment reminder message in Hindi, English or Hinglish, polite, firm or final, then copy it or open it in your own WhatsApp. We store and send nothing.",
  "answer": "Type the customer's name, the amount, the bill number and the date it was due. Pick a tone (polite, firm or final) and a language (Hindi, English or Hinglish). The maker writes the message, you can edit it, and one tap copies it or opens your own WhatsApp with it ready. You press send. This page stores and sends nothing; the text goes to WhatsApp only when you tap the button.",
  "faq": [
    { "q": "Payment reminder message in Hindi: how do I make one?", "a": "Pick Hindi in the language box, fill in the name, the amount and the dates, and press the button. The message comes out in Hindi, ready to copy or to open in WhatsApp." },
    { "q": "Payment reminder message on WhatsApp: how do I send it?", "a": "Press \"Open in WhatsApp\". WhatsApp opens with the message ready. You choose the customer's chat and press send. This page never sees the customer's number." },
    { "q": "Baki paisa message kaise likhe?", "a": "Name the bill and the exact amount, ask for a date, and say thank you. Pick Hinglish if you want the message in Roman letters, the way you would type it to a customer." },
    { "q": "Does it send the message for me?", "a": "No. It writes the message. You send it from your own WhatsApp, one customer at a time." },
    { "q": "Can the message mention police, court or interest?", "a": "No. All three tones stay on the bill, the amount and a date. A written demand comes later: see [the steps for unpaid dues](@paid-legal-steps)." },
    { "q": "Does the maker keep the customer names I type?", "a": "No. The message is made on your own phone or computer. We store nothing and receive nothing. The text goes to WhatsApp only if you tap \"Open in WhatsApp\"." }
  ],
  "related": ["paid-reminder-messages", "paid-stop-credit", "paid-kal-dunga", "paid-outstanding-letter", "tool-statement"],
  "updated": "2026-10-26"
}
---
A reminder for one credit customer, ready in about a minute. For a business whose regular customers buy on credit.

## Make the message

<div class="tool" id="rm">
<label for="rm-n">Customer's name, as you would say it</label>
<input id="rm-n" type="text" autocomplete="off" placeholder="for example Gupta ji">
<label for="rm-a">Amount still open (Rs)</label>
<input id="rm-a" type="text" inputmode="numeric" autocomplete="off" placeholder="for example 48,500">
<label for="rm-b">Optional: bill number or numbers</label>
<input id="rm-b" type="text" autocomplete="off" placeholder="for example 14">
<label for="rm-d">Optional: the date it was due</label>
<input id="rm-d" type="date">
<label for="rm-by">Optional: ask them to pay by (used in the firm and final tones)</label>
<input id="rm-by" type="date">
<label for="rm-biz">Optional: your business name, to sign the message</label>
<input id="rm-biz" type="text" autocomplete="off" placeholder="for example Sharma Traders">
<label for="rm-t">Tone</label>
<select id="rm-t"><option value="polite" selected>Polite: the first reminder</option><option value="firm">Firm: the second reminder</option><option value="final">Final: before you stop new credit</option></select>
<label for="rm-l">Language</label>
<select id="rm-l"><option value="en" selected>English</option><option value="hi">Hindi</option><option value="hl">Hinglish</option></select>
<button type="button" id="rm-go">Make the message</button>
<div class="out" id="rm-out" role="status" aria-live="polite">Fill in the amount and press the button.</div>
<label for="rm-msg">Your message: you can change any word</label>
<textarea id="rm-msg" rows="7" placeholder="Your message appears here."></textarea>
<div id="rm-act" hidden><p><button type="button" id="rm-copy">Copy the message</button></p><p><a id="rm-wa" href="https://wa.me/" target="_blank" rel="noopener">Open in WhatsApp with this message</a></p></div>
<noscript><p>This maker needs JavaScript. The seven messages on the reminder messages page can be copied by hand.</p></noscript>
</div>

## The three tones

| Tone | When to use it | What it says |
|---|---|---|
| Polite | The first reminder, on or just after the due day | The amount, the bill and the date it was due. Please pay and tell us. |
| Firm | A second reminder, or after a missed promise | That nothing has come yet. Asks for a pay-by date, or a call today. |
| Final | The last request, before you stop new credit | That new credit will stop until the amount is cleared. Asks for a call. |

None of them mentions police, court or interest. Those do not belong in a chat message.

## Before you send

- One customer at a time, from your own WhatsApp. No groups, no broadcast.
- Read it once. Check the name, the amount and the dates.
- If the customer gives a date, note it and wait for that date.
- Keep the chat as part of your record.
- Decide your rule first: [when to stop credit](@paid-stop-credit). Send the final tone only if you will do what it says.

More wordings, including a thank-you after payment: [seven reminder messages](@paid-reminder-messages). A written letter: [outstanding payment letter](@paid-outstanding-letter). A customer who always says "kal dunga": [what to do](@paid-kal-dunga).

Khata Kavach's "Ask for payment on WhatsApp" button does the same inside the app, with the amount owed and the limit filled in. You press send. Khata Kavach sends nothing itself.
