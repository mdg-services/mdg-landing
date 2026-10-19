---json
{
  "title": "Numbered bills, with a UPI QR when you add a UPI ID, sent from your own WhatsApp",
  "metaTitle": "Numbered credit bill, sent from your WhatsApp",
  "description": "Make a numbered PDF bill for a customer's credit sales in a tap. It carries your letterhead, and a UPI QR if you add your UPI ID. You send it from your own WhatsApp.",
  "answer": "In Khata Kavach the owner or a manager makes a bill from a customer's unbilled sales in a tap. The PDF carries your letterhead, every sale, the total in figures and words, and, if you added a UPI ID, a UPI QR for exactly what is still due. Send it from your own WhatsApp. Record money received against the bill and it shows paid (or part paid), and that much credit opens again. It is a bill, not a GST tax invoice.",
  "faq": [
    { "q": "Can my GSTIN print on the bill?", "a": "Yes, if you enter them. The PDF is titled \"BILL\" and splits out no tax, so it is not a GST tax invoice." },
    { "q": "Udhar reminder app: does Khata Kavach send my customers reminders by itself? (udhar reminder app)", "a": "No. \"Send a reminder\" opens your own WhatsApp with a message ready, and you press send." },
    { "q": "Does the customer pay through Khata Kavach?", "a": "No. \"Pay ₹X by UPI\" opens the customer's own UPI app with the amount filled in, and the money goes from their bank to yours. The button shows only if you added a UPI ID. You record what you received." },
    { "q": "Can I carry on from my paper bill book's numbers?", "a": "Yes. The owner can set a prefix such as SF/26-27/ and move \"Next bill number\" to where your book stopped." },
    { "q": "Who can open a bill link?", "a": "Anyone who holds the link can open that bill, and the link does not expire. Share it with the customer alone." },
    { "q": "Can I cancel a bill?", "a": "The owner can, with a reason. Managers cannot. The sales go back to unbilled, the number is never reused, and you can make a new bill." }
  ],
  "related": ["features", "example-bill-payment", "credit-bills", "feature-customer-app"],
  "updated": "2026-10-19"
}
---
## Make a bill in a tap

On a customer's page, the owner or a manager taps "Make a bill". The bill covers every sale of that customer not yet on a bill, for the days you choose. By default that runs from the oldest unbilled sale to today. A bill cannot cover days that have not come yet.

## What is on the PDF

| Part | What it shows |
|---|---|
| Top | "BILL", your letterhead: name, address, phone, logo, and GSTIN and PAN if you entered them. "Bill to" with the customer's name on the bill. |
| Lines | Number, day, vehicle, item, quantity, rate and amount for each sale. With more than one item, a "By item" summary. |
| Total | In figures and in words. |
| How to pay | Your bank details if entered, and a UPI QR for exactly the amount still due. |
| Foot | Your own note, "For [your business]", "Authorised signatory", and "Computer-made bill. Made with Khata Kavach." |

A "PAID" or "CANCELLED" stamp appears when it applies. The UPI QR needs a UPI ID in your business details. Without one, the PDF has no QR.

## Numbering

One counter runs for the whole business, not one per customer. A number is never used again, even after a cancel.

## Send, remind, and record

1. Tap "Send on WhatsApp". It opens your own WhatsApp with the bill number, amount, period, number of sales, due day, the PDF link and your UPI ID. Khata Kavach sends nothing itself.
2. When a bill is past its due day, tap "Send a reminder" for a message with what is still due.
3. When money arrives, open the bill and tap "Money received". Say how it was paid: cash, UPI, bank or cheque.

> **Note:** Record the money on the bill. Money recorded without choosing a bill clears the customer's oldest unpaid line first, which may be an older sale not on this bill.

For example (made-up figures): Bill 1 is ₹50,000. You record ₹20,000 against it. Bill 1 shows "Part paid" with ₹30,000 due, and the customer's credit left rises by ₹20,000.

## What the customer sees

The customer's "Bills" tab lists every bill, filtered "Unpaid" or "All", each marked Unpaid, Part paid, Paid or Cancelled, with "Past due" when it is late. Opening a bill shows items, quantities and "Open the PDF". While money is due, and if you added a UPI ID, "Pay ₹X by UPI" appears. After paying, the customer tells you. Once you record it, the bill shows paid.

See [what a kachcha and a pakka bill mean](@credit-bills) and [a bill with a part payment, worked through](@example-bill-payment).
