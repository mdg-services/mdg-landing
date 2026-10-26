---json
{
  "title": "Credit limit calculator: how much udhar to give a customer",
  "metaTitle": "Credit limit calculator for a regular customer",
  "description": "Work out a credit limit for a regular customer at your pump from his monthly purchase and your credit days, with the working shown. A rule of thumb, in rupees.",
  "answer": "Type what the customer fills with you on credit in a month and the credit days you give. The calculator works out monthly purchase × credit days ÷ 30, halves it for a new customer, rounds down to the nearest Rs 1,000, and keeps it within what you say you could carry if they paid a month late. A rule of thumb to start from; the final figure is your decision.",
  "faq": [
    { "q": "How much credit should I give a customer?", "a": "About what they buy from you in one credit period. For Rs 3,00,000 a month on 15 days' credit, that is Rs 1,50,000. Start a new customer at half." },
    { "q": "Udhar ki limit kitni rakhe?", "a": "There is no fixed number: it is your own business decision. Start from the rule of thumb, then ask: could I carry this whole amount if this customer paid a month late? Put that figure in the last box." },
    { "q": "Why does it round down?", "a": "A round figure is easier for nozzle men to remember and check, and rounding down keeps you on the safe side. A figure under Rs 1,000 rounds down to the nearest Rs 100 instead." },
    { "q": "Does the calculator save what I type?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." },
    { "q": "Where do I keep the limit once I have it?", "a": "In your khata or sheet, next to the transporter's name, in rupees. Khata Kavach keeps a rupee limit for each transporter and checks it at the nozzle before fuel goes in." }
  ],
  "related": ["credit-limit", "tool-khata-format", "counter-over-limit", "credit-who"],
  "updated": "2026-10-27"
}
---
A starting credit limit for one regular customer of your pump, with the working shown.

## Work out a limit

<div class="tool" id="cl">
<label for="cl-m">What this customer fills with you on credit in a normal month (Rs)</label>
<input id="cl-m" type="text" inputmode="numeric" autocomplete="off" placeholder="for example 3,00,000 or 3 lakh">
<label for="cl-d">Credit days you give</label>
<select id="cl-d"><option value="7">7 days</option><option value="15" selected>15 days</option><option value="30">30 days</option><option value="45">45 days</option><option value="60">60 days</option></select>
<label for="cl-n"><input id="cl-n" type="checkbox"> A new customer (start at half)</label>
<label for="cl-c">Optional: the most you could carry if this customer paid a month late (Rs)</label>
<input id="cl-c" type="text" inputmode="numeric" autocomplete="off" placeholder="leave empty if unsure">
<button type="button" id="cl-go">Work out the limit</button>
<div class="out" id="cl-out" role="status" aria-live="polite">Type the monthly figure and press the button.</div>
<noscript><p>This calculator needs JavaScript. The rule: monthly purchase × credit days ÷ 30, half for a new customer.</p></noscript>
</div>

## How it works

1. **The rule of thumb:** monthly purchase × credit days ÷ 30. That is about what the customer fills with you in one credit period.
2. **A new customer** starts at half, and rises after a few months of on-time payment.
3. **Rounded down** to the nearest Rs 1,000, or to the nearest Rs 100 when the figure is under Rs 1,000.
4. **Your own cap:** if you could not carry the result should this customer pay a month late, your figure wins.

For example, with made-up figures:

| Monthly purchase | Credit days | New customer? | Your cap | Limit |
|---|---|---|---|---|
| Rs 3,00,000 | 15 | No | None | Rs 1,50,000 |
| Rs 1,25,000 | 30 | Yes | None | Rs 62,000 |
| Rs 4,50,000 | 15 | No | Rs 1,50,000 | Rs 1,50,000 |

## After you set it

- Keep it in rupees, not litres, because the price moves. [How to set a credit limit](@credit-limit) explains the rule in full.
- Decide in advance who may allow a fill past it: see [a customer over the limit](@counter-over-limit).
- Look at it again after two or three months: raise it after on-time payment, lower it if payments slip.
- Write it next to the transporter's name in your khata, or on the Customers tab of the [udhar khata format](@tool-khata-format).
