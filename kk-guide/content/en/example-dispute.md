---json
{
  "title": "A disputed sale: 40 bags or 50? A worked example",
  "description": "A made-up contractor says only 40 bags went out, not 50. What both phones show, how a manager corrects the line with a reason, and what stays on the record.",
  "answer": "A made-up contractor says only 40 bags were loaded, not 50. The sale line shows who served, the time and the photo the counter added. The manager finds a typing mistake and corrects it with a reason. The wrong line stays on both phones, marked struck out, and a new line carries the right figures.",
  "faq": [
    { "q": "How does a customer raise a doubt about a sale?", "a": "The customer sees every line on their own phone and calls the business. The owner or a manager can then correct a wrong line, with a reason, as a new line." },
    { "q": "Does the old line disappear after a correction?", "a": "No. Once the sale has reached the customer's phone, nothing is edited. The old line stays, marked struck out, and the new line sits below it, so both sides can see what changed." },
    { "q": "Can a sale be corrected after a bill is made?", "a": "Not while it is on a bill. The owner cancels the bill first, then the sale is corrected, then a new bill is made. The cancelled bill's number is not used again." }
  ],
  "related": ["examples", "counter-disputes", "feature-corrections", "feature-photo", "example-contractor-limit"],
  "updated": "2026-10-23"
}
---
> **Example:** a made-up business with made-up figures. It is not a real customer.

## The set-up

A made-up building material dealer sells cement at Rs 400 a bag to a made-up contractor on credit, with a limit of Rs 50,000. The contractor needs cement and sends a request for 50 bags. The app gives it a 4-digit pickup code, which the contractor passes to Raju, who collects with a hired tractor. Rs 10,000 is already owed.

## What both phones show

At 10:40 am, "Staff A" (a made-up name) records the sale. The line on the dealer's phone and the contractor's phone reads:

- **Sale:** 50 bags, Rs 20,000. Given by Staff A on the pickup code ("Code matches"). The counter added "Collected by" Raju, so the line reads "Taken by Raju".
- **Photo:** the loaded tractor, added by the counter.
- **Flags:** none. 50 bags matches the request, so "More than requested" does not show.

The app did not catch the mistake. It cannot know what is on the tractor. The contractor sees the line and calls the dealer: only 40 bags went on.

## How the line is corrected

The manager opens the sale and looks at the photo: 40 bags. Staff A had typed the requested 50. The manager taps "Correct this sale", writes the reason "Typed 50, load was 40", chooses "Cancel it and enter the right sale", and enters 40 bags and Rs 16,000. No bill has been made yet.

| Line | Bags | Rupees | Owed after |
|---|---|---|---|
| Owed before | | | 10,000 |
| Sale by Staff A | 50 | 20,000 | 30,000 |
| That sale, struck out | -50 | -20,000 | 10,000 |
| New sale, entered by the manager | 40 | 16,000 | 26,000 |

The contractor's phone shows the first sale as "Struck out", then the new line. The contractor sees the reason too, beside the struck-out line and the new line. The contractor owes Rs 26,000 (10,000 + 16,000). See [what a correction looks like](@feature-corrections).

## If the record was right

Say the photo shows 50 bags on the tractor. The owner shows the contractor the line, the time, who served and the photo, and keeps the sale as it is. Nothing is changed.

For more on this, see [a disputed credit sale](@counter-disputes) and [the optional photo with a sale](@feature-photo).
