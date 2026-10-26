---json
{
  "title": "Late payment interest calculator: interest on an overdue customer payment",
  "metaTitle": "Late payment interest calculator for udhar",
  "description": "Work out interest on a late customer payment from the amount, the days late and your own yearly rate, simple or monthly compounding, with the working shown.",
  "answer": "Type the amount that is late, the days late (or the date it was due) and the yearly rate you agreed with the customer. The calculator works out simple interest, amount × rate × days ÷ 365, or monthly compounding, and shows every step. It suggests no rate: the rate is yours. The clearest case for charging interest is when the customer agreed to it in writing before the sale.",
  "faq": [
    { "q": "How do I calculate interest on a late payment?", "a": "Multiply the amount by the yearly rate and by the days late, then divide by 365. With a made-up 10% a year, Rs 73,000 that is 60 days late gives Rs 1,200." },
    { "q": "Udhar par byaj kaise nikale?", "a": "Type the amount, the days late and your yearly rate in the boxes above. If your rate is per month, multiply it by 12: 2% a month is 24% a year." },
    { "q": "What rate of interest can I charge on late payment?", "a": "The rate you agreed with the customer before the sale. This page does not suggest one. Where nothing was agreed, a court decides {{Interest Act 1978, s.3}}." },
    { "q": "Simple or compound interest: which one do I use?", "a": "The one the customer agreed to. If the bill or your terms say nothing about compounding, work out simple interest." },
    { "q": "Does the calculator save what I type?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." },
    { "q": "Does Khata Kavach add interest to what a customer owes?", "a": "No. Khata Kavach keeps the account: sales, payments and what is owed. It does not add interest, and it never lends or holds money." }
  ],
  "related": ["paid-interest", "credit-agreement", "paid-msme", "tool-debtor-days", "paid-reminder-messages"],
  "updated": "2026-10-26"
}
---
Interest on a late customer payment, worked out from your own rate, with every step shown. For a business whose regular customers buy on credit.

## Work out the interest

<div class="tool" id="li">
<label for="li-a">Amount that is late (Rs)</label>
<input id="li-a" type="text" inputmode="numeric" autocomplete="off" placeholder="for example 73,000 or 73 thousand">
<label for="li-n">Days late</label>
<input id="li-n" type="text" inputmode="numeric" autocomplete="off" placeholder="for example 60">
<label for="li-d">Or the date the money was due</label>
<input id="li-d" type="date">
<label for="li-r">Yearly interest rate you agreed (%)<small>If your rate is per month, multiply it by 12: 2% a month is 24% a year. This page suggests no rate.</small></label>
<input id="li-r" type="text" inputmode="decimal" autocomplete="off" placeholder="type your rate">
<label for="li-m">Kind of interest</label>
<select id="li-m"><option value="simple" selected>Simple interest</option><option value="monthly">Monthly compounding</option></select>
<label for="li-b">Optional: what you pay on your own borrowing (% a year)</label>
<input id="li-b" type="text" inputmode="decimal" autocomplete="off" placeholder="leave empty if you do not borrow">
<button type="button" id="li-go">Work out the interest</button>
<div class="out" id="li-out" role="status" aria-live="polite">Fill the boxes and press the button.</div>
<noscript><p>This calculator needs JavaScript. Simple interest = amount × yearly rate × days late ÷ 365.</p></noscript>
</div>

## How it works

1. **Simple interest:** amount × yearly rate × days late ÷ 365.
2. **Monthly compounding:** every full 30 days adds one twelfth of the yearly rate to what is owed, and the next month's interest is worked on the bigger total. Leftover days, under 30, are added at simple interest on the total so far.
3. **Rounded** to the nearest rupee.
4. **What it costs you:** if you type what you pay on your own borrowing, the calculator also shows what the late money costs you at that rate, whether or not you charge the customer.

With a made-up rate of 10% a year, not a rate to use: Rs 73,000, 60 days late.

| Kind | Working | Interest |
|---|---|---|
| Simple | Rs 73,000 × 10% × 60 ÷ 365 | Rs 1,200 |
| Monthly compounding | Rs 73,000 grows by 10% ÷ 12 = 0.833% a month for 2 months, to Rs 74,222 | Rs 1,222 |

## Can you charge it?

The clearest case is when the customer agreed to interest in writing before the sale: on the bill, in your terms or on your [credit form](@credit-agreement). Write the rate and the day it starts. Where nothing was agreed, a court decides {{Interest Act 1978, s.3}}. The full picture: [interest on udhar](@paid-interest).

A supplier with Udyam registration has a separate rule on late payment, which this calculator does not work out. See the [MSME 45-day rule](@paid-msme); whether a trader qualifies is doubtful.

General practice, not a rule: interest is often hard to collect. Credit days, a limit and a clear reminder come first. See [reminder messages](@paid-reminder-messages) and [when to stop credit](@paid-stop-credit).

General information, not legal advice. For your own case, speak to an advocate or a chartered accountant.
