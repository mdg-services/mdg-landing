---json
{
  "title": "Petrol pump dealer margin calculator: monthly margin and profit per litre",
  "metaTitle": "Dealer margin calculator: monthly and per litre",
  "description": "Type your own sales, the margin per KL from your oil company's letter and your monthly costs to see the month's margin, what is left and the margin per litre.",
  "answer": "Type your monthly sales of petrol and diesel, the margin per KL from your own oil company's latest margin letter, and your monthly costs. The tool gives the gross margin, what is left after costs and the margin per litre. It holds no rate of its own. General practice, not an MDG rule: the oil company sets and revises the margin, and it differs by company and product. The Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers, are not where a margin is set.",
  "faq": [
    { "q": "Petrol pump dealer margin per litre: how is it worked out?", "a": "Divide the margin per KL by 1,000, because 1 KL is 1,000 litres. For example, a made-up Rs 1,000 per KL is Rs 1 per litre. Take your own per-KL figure from your oil company's latest letter; the tool supplies none." },
    { "q": "What is the petrol pump dealer commission per litre in 2026?", "a": "This page states no rate. Margins are set and revised by the oil company and differ by company and product, so read your latest margin letter or ask your oil company. A rate quoted elsewhere may be out of date." },
    { "q": "Petrol pump dealer ko kitna commission milta hai?", "a": "It depends on the oil company, the product and the date. Type your own figures in the tool to see what they come to on your monthly sales." },
    { "q": "Petrol pump dealer profit per litre and income: is margin the same as profit?", "a": "No. The margin is what the oil company allows on each KL. Profit is what is left after your costs: salaries, power, rent, interest and the rest. The tool shows both, for the month and per litre." },
    { "q": "Which costs should I put in?", "a": "What you pay in a normal month to run the pump: salaries, power, rent, loan interest and anything else. The result stops before income tax and leaves out lubricant or shop income." },
    { "q": "Does the calculator save what I type?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." }
  ],
  "related": ["tools-stock-variation", "stock-shrinkage-tva", "stock-variation", "mdg-every-oil-company"],
  "updated": "2026-10-26"
}
---
Work out a pump's monthly margin and what is left of it, from your own figures.

## Work out the month

<div class="tool" id="dm">
<style>#dm .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0 16px}#dm .g>div{display:flex;flex-direction:column;justify-content:flex-end}#dm select{max-width:100%}</style>
<p style="margin:0 0 4px"><b>Your own numbers only.</b> The tool holds no margin rate. Take the margin per KL from your oil company's latest margin letter.</p>
<label for="dm-u">Sales below are in</label>
<select id="dm-u"><option value="k">KL</option><option value="l">Litres</option></select>
<div class="g">
<div><label for="dm-ms">Petrol (MS) sold in a month</label><input id="dm-ms" type="text" inputmode="decimal" autocomplete="off" placeholder="your monthly petrol sales"></div>
<div><label for="dm-mm">Petrol margin, Rs per KL</label><input id="dm-mm" type="text" inputmode="decimal" autocomplete="off" placeholder="from your margin letter"></div>
<div><label for="dm-hs">Diesel (HSD) sold in a month</label><input id="dm-hs" type="text" inputmode="decimal" autocomplete="off" placeholder="your monthly diesel sales"></div>
<div><label for="dm-hm">Diesel margin, Rs per KL</label><input id="dm-hm" type="text" inputmode="decimal" autocomplete="off" placeholder="from your margin letter"></div>
</div>
<p style="margin:16px 0 0"><b>Costs in a month, in rupees (optional)</b></p>
<div class="g">
<div><label for="dm-c1">Salaries</label><input id="dm-c1" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="dm-c2">Power</label><input id="dm-c2" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="dm-c3">Rent</label><input id="dm-c3" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="dm-c4">Loan interest</label><input id="dm-c4" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="dm-c5">Other costs</label><input id="dm-c5" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
<button type="button" id="dm-go">Work out the month</button>
<div class="out" id="dm-out" role="status" aria-live="polite">Type the sales and margin for at least one fuel, then press the button.</div>
<noscript><p>This calculator needs JavaScript. The sum: KL sold × margin per KL, less the month's costs.</p></noscript>
</div>

## How the sum works

1. **Each fuel:** KL sold × the margin per KL.
2. **Gross margin:** petrol plus diesel.
3. **What is left:** gross margin less the month's costs.
4. **Per litre:** gross margin, or what is left, divided by the litres sold.

For example, with made-up round numbers that are not anyone's real margin: 100 KL of petrol at Rs 1,000 per KL and 200 KL of diesel at Rs 500 per KL. The margin is Rs 1,00,000 + Rs 1,00,000 = Rs 2,00,000. Costs of Rs 1,40,000 leave Rs 60,000. On 300 KL, which is 3,00,000 litres, that is Rs 0.67 a litre before costs and Rs 0.20 after.

## Where the margin figure comes from

General practice, not an MDG rule: the oil company sets the margin per KL for each product and revises it from time to time, and it differs by company. Read the latest margin letter from your oil company, or ask it. This page and the tool carry no rate.

> **Note:** the result is only as good as the margin you type. If the rate changed during the month, work out each part of the month on its own.

How far the rules differ between companies is on [MDG for every oil company](@mdg-every-oil-company).
