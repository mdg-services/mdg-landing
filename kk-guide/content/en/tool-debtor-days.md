---json
{
  "title": "Debtor days calculator: how long your transporters really take to pay",
  "metaTitle": "Debtor days calculator and meaning",
  "description": "Work out a pump's debtor days from the udhar outstanding and the diesel given on credit, see what the number means, and compare it with your credit days.",
  "answer": "Debtor days tell you, on average, how many days of your credit sales are still unpaid. Type your udhar outstanding today and your credit sales (fuel given on credit) over the last 30, 90 or 365 days. Debtor days = outstanding ÷ credit sales × days. Compare the result with the credit days you give: if it is well above them, transporters are paying late on average.",
  "faq": [
    { "q": "What is debtor days?", "a": "The average number of days it takes your transporters to pay you. A debtor is someone who owes you money, here a transporter. It is outstanding ÷ credit sales × the days in the period." },
    { "q": "Debtors days formula: do I count cash fills?", "a": "No. Count only credit sales. Cash fills are paid on the spot, so adding them makes debtor days look better than it is." },
    { "q": "Debtor days kitna hona chahiye?", "a": "There is no number right for everyone. Compare it with the credit days you give: close to them or below is fine, and far above means transporters pay late on average." },
    { "q": "Debtors days meaning in Hindi?", "a": "ग्राहकों से पैसा आने में औसतन लगने वाले दिन। The Hindi page of this calculator explains it in Hindi." },
    { "q": "Which period should I pick: 30, 90 or 365 days?", "a": "Start with 90. Use 30 when your credit given is steady from month to month, and 365 to smooth out busy and slow seasons." },
    { "q": "Does the calculator save my figures?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." }
  ],
  "related": ["paid-ageing", "paid-stop-credit", "paid-outstanding-overdue", "tool-credit-limit", "tool-late-interest"],
  "updated": "2026-10-27"
}
---
Debtor days in plain words: on average, how many days of your credit sales are still waiting to be paid. For a petrol pump whose regular customers take diesel on credit.

## Work out your debtor days

<div class="tool" id="dd">
<label for="dd-o">Total udhar outstanding today, from all transporters (Rs)</label>
<input id="dd-o" type="text" inputmode="numeric" autocomplete="off" placeholder="for example 4,50,000 or 4.5 lakh">
<label for="dd-s">Your credit sales in the period below (Rs)<small>Fuel given on credit only. Leave out cash fills.</small></label>
<input id="dd-s" type="text" inputmode="numeric" autocomplete="off" placeholder="for example 9,00,000 or 9 lakh">
<label for="dd-p">The period those credit sales cover</label>
<select id="dd-p"><option value="30">Last 30 days</option><option value="90" selected>Last 90 days</option><option value="365">Last 365 days</option></select>
<label for="dd-c">Optional: the credit days you give (days)</label>
<input id="dd-c" type="text" inputmode="numeric" autocomplete="off" placeholder="for example 15">
<button type="button" id="dd-go">Work out debtor days</button>
<div class="out" id="dd-out" role="status" aria-live="polite">Fill the boxes and press the button.</div>
<noscript><p>This calculator needs JavaScript. The sum: udhar outstanding ÷ credit sales in the period × days in the period.</p></noscript>
</div>

## What it means

**Debtor days = udhar outstanding today ÷ credit sales in the period × days in the period.**

Your credit days are what you agreed. Debtor days is what happens in practice. At or below your credit days, transporters pay in time on average. Above them, some transporters pay late, and the further above, the later.

With made-up figures: Rs 4,50,000 outstanding, Rs 9,00,000 of credit sales in 90 days, 15 credit days given.

| Step | Working | Result |
|---|---|---|
| Credit sales a day | 9,00,000 ÷ 90 | Rs 10,000 |
| Debtor days | 4,50,000 ÷ 10,000 | 45 days |
| Outstanding expected at 15 days | 15 × 10,000 | Rs 1,50,000 |
| Waiting longer than agreed | 4,50,000 − 1,50,000 | Rs 3,00,000 |

## Read it with care

- **It is an average.** One big late transporter can hide behind many on-time ones. [Ageing](@paid-ageing) shows each transporter's old money.
- **It is rough when credit jumps.** A big run of credit fills this week raises what is outstanding before it is due.
- **No standard figure.** Compare it only with your own credit days. We give no standard number. The calculator says "well after" once debtor days is more than one and a half times your credit days: a rough marker of ours, not a standard.
- **A long result.** If debtor days is longer than the period you picked, some of the outstanding is older than the sales you counted. Try 365 days, or check your figures.

## What to do next

If it is well above your credit days, find who is behind it: split each transporter's balance into [overdue and not yet due](@paid-outstanding-overdue), then [age it](@paid-ageing). Send a [reminder](@paid-reminder-messages) to each late transporter, and set a rule for [when to stop credit](@paid-stop-credit). A shorter credit period or a lower [credit limit](@tool-credit-limit) tends to shrink the number for the next round.
