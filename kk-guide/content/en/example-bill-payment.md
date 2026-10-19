---json
{
  "title": "A bill and a part payment: a worked example",
  "metaTitle": "A bill and a part payment: worked example",
  "description": "A made-up bill sent on WhatsApp and part paid by UPI: what Part paid shows, how much credit opens again, and what changes when no bill is chosen.",
  "answer": "A made-up business makes Bill 7 for Rs 1,35,000 and sends it from its own WhatsApp. The customer pays Rs 50,000 by UPI. Recorded on Bill 7, the bill shows Part paid with Rs 85,000 due, and Rs 50,000 of credit opens up again. Recorded with no bill chosen, the money clears the oldest unpaid line first.",
  "faq": [
    { "q": "What does Part paid mean on a bill?", "a": "Some money has been recorded against the bill and the rest is still due. A bill shows Unpaid, Part paid, Paid or Cancelled, and always shows how much is still due." },
    { "q": "Does Khata Kavach take or hold the customer's money?", "a": "No. The customer pays the business directly, and the business records it. Khata Kavach never lends and never holds money. When the business has added a UPI ID, the customer's app shows \"Pay … by UPI\", which opens the customer's own UPI app." },
    { "q": "How do I record money against the right bill?", "a": "Open the bill and tap \"Money received\". The amount starts at what is still due on that bill, and you can change it. Money recorded from the customer's page with \"Record a payment\" is not tied to a bill." },
    { "q": "What if a customer pays more than the bill?", "a": "The extra shows as an advance with the business." },
    { "q": "Can I change a bill after sending it?", "a": "No. The owner cancels it with a reason, its sales go back to unbilled, and a new bill is made. The cancelled bill's number is not used again." }
  ],
  "related": ["examples", "feature-bills", "paid-reminder-messages", "credit-bills", "example-pump-month"],
  "updated": "2026-10-19"
}
---
> **Example:** a made-up business with made-up figures. It is not a real customer.

## The bill

Sharma Traders, a made-up fuel business, sells diesel at Rs 90 a litre to Gupta Transport, a made-up transport business with a credit limit of Rs 2,00,000. Gupta Transport still owes Rs 40,000 on an older Bill 3. From Day 1 to Day 15 it takes five sales:

| Day | Litres | Rupees |
|---|---|---|
| 1 | 300 | 27,000 |
| 4 | 250 | 22,500 |
| 8 | 400 | 36,000 |
| 11 | 200 | 18,000 |
| 14 | 350 | 31,500 |
| **Total** | **1,500** | **1,35,000** |

On Day 15 the owner taps "Make a bill" for those days. It becomes Bill 7: Rs 1,35,000. "Send on WhatsApp" opens the owner's own WhatsApp with the message ready, and the PDF carries a UPI QR for the amount due, if the business has added its UPI ID. It is a numbered bill, not a GST tax invoice. See [numbered bills](@feature-bills). Gupta Transport now owes Rs 1,75,000 (40,000 + 1,35,000), so Rs 25,000 of credit is left.

## The part payment

Gupta Transport pays Rs 50,000 to Sharma Traders by UPI. Khata Kavach does not see that payment, so the owner records it. Where the owner records it changes what each bill shows:

| | Bill 3 | Bill 7 | Owed in all | Credit left |
|---|---|---|---|---|
| Before the payment | 40,000 due | 1,35,000 due | 1,75,000 | 25,000 |
| Rs 50,000 on Bill 7 | 40,000 due | Part paid, 85,000 due | 1,25,000 | 75,000 |
| Rs 50,000, no bill chosen | Paid | Part paid, 1,25,000 due | 1,25,000 | 75,000 |

- **On Bill 7.** Money recorded against a bill clears that bill's sales first: 1,35,000 minus 50,000 leaves 85,000.
- **No bill chosen.** Recorded from the customer's page, the money clears the oldest unpaid line first. Bill 3's 40,000 is paid in full, and the other 10,000 goes to the oldest line on Bill 7: 1,35,000 minus 10,000 leaves 1,25,000.

Either way the total owed is Rs 1,25,000 and the credit left is Rs 75,000: the Rs 50,000 received opened that much credit again. Only the bill it is counted against differs. If the customer is paying a particular bill, record the money on that bill.
