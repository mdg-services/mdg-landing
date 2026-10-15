---json
{
  "title": "Stock variation calculator for petrol pumps (MDG 2024)",
  "description": "Enter your dips, receipts and meter sales to work out stock variation the way MDG Annexure 9 does, set against the 4% limit, handling loss and shrinkage or TVA.",
  "answer": "Enter the opening dip, receipts, sales as per meter and closing dip. The calculator builds the book stock the way Annexure 9 does, finds the gap to the closing dip and sets it against the limit: 4% of tank stock, plus the handling loss on sales for a shortage, with shrinkage or TVA taken off the book where they apply {{5.1.11}} {{annexure 9}}. Where MDG leaves a point to the oil company, the calculator says so. It is a helper only. Your oil company's own working decides.",
  "faq": [
    { "q": "How is stock variation calculated at a petrol pump?", "a": "Take the opening dip, add the receipts, take off shrinkage or TVA where they apply, then take off the sales as per meter. That is the closing stock as per book. Compare it with the closing dip. The gap is the variation, and it is set against 4% of the tank stock and the other allowances {{5.1.11}} {{annexure 9}}." },
    { "q": "What is the stock variation formula in MDG Annexure 9?", "a": "Book stock is opening dip plus receipts, less the shrinkage percentage applied to the receipts, less sales as per meter. This closing stock as per book is compared with the closing stock as per dip, within plus or minus 4% of the dip figure {{annexure 9}}." },
    { "q": "Is the 4% worked out on opening stock or closing stock?", "a": "Annexure 9 works it on the closing stock as per dip, which the annexure calls G {{annexure 9}}. The clause itself says \"4 % of tank stock\" {{5.1.11}}." },
    { "q": "How is the shrinkage allowance worked out?", "a": "The allowance in rupees per KL is divided by the net price, meaning the price before commission, taxes and the allowance. That percentage is applied to the total receipts of the period under inspection {{annexure 8}}. The annexure samples print their percentages to two decimals, and the calculator rounds the same way." },
    { "q": "What is TVA in petrol pump stock variation?", "a": "TVA is the temperature variation allowance. The oil company shows it on each invoice as a credit. Its percentage of the net price is applied only to the quantity received for which TVA was allowed in the invoices, and it is generally revised every quarter {{annexure 10}}." },
    { "q": "Which handling loss rate applies to my sales?", "a": "For petrol (MS), 0.75% of the quantity sold up to an annual average of 600 KL and 0.60% beyond it. For diesel (HSD), 0.25% up to 600 KL and 0.20% beyond it {{5.1.11}}. MDG does not say over what period the 600 KL is counted, so ask your oil company." },
    { "q": "Why does the calculator sometimes say the result depends on how the allowances are counted?", "a": "For a negative variation, the clause words the limit as \"up to 4%\" and does not say in that sentence whether the handling loss is counted with it {{5.1.11}}. When the shortage falls between the 4% alone and the 4% plus the handling loss, the answer depends on how your oil company counts, so the calculator shows both readings." },
    { "q": "Is this calculator the official stock variation check?", "a": "No. It is a helper. The oil company's inspection working decides, and an irregularity must be established before any action is taken {{5.1.11}} {{8.5.2}}." },
    { "q": "Does the calculator save or send my figures?", "a": "No. The sum is worked out on your own phone or computer. Nothing you type is stored or sent anywhere." }
  ],
  "related": ["stock-variation", "stock-shrinkage-tva", "stock-positive-negative", "stock-daily-register"],
  "updated": "2026-10-15"
}
---
This page works out the stock variation of one product from your own dips and meter readings, using the method in Annexures 8 to 10 of the Marketing Discipline Guidelines 2024 (MDG 2024) and the limit in clause 5.1.11 {{5.1.11}}. For what the limit means and what follows when it is crossed, see [stock variation: the permissible limit](@stock-variation).

## Work out the variation

<div class="tool" id="sv">
<style>#sv .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0 16px}#sv select{max-width:100%}#sv small{display:block;color:#5D5F86;font-weight:400}#sv .r{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid #E4E6F1}#sv .r b{text-align:right;white-space:nowrap}#sv .v{margin:12px 0 0;padding:10px 12px;border-radius:8px;background:#fff;border:1px solid #C5C7ED;font-weight:600}#sv .n{margin:8px 0 0;font-size:14.5px;font-weight:400;color:#3D3F66}</style>
<p style="margin:0 0 4px"><b>A helper only.</b> Your oil company's own working decides. Use the totals for one product at a time.</p>
<div class="g">
<div><label for="sv-p">Product</label><select id="sv-p"><option value="ms">Petrol (MS)</option><option value="hsd">Diesel (HSD)</option></select></div>
<div><label for="sv-u">Quantities below are in</label><select id="sv-u"><option value="1">Litres</option><option value="1000">Kilolitres (KL)</option></select></div>
</div>
<div class="g">
<div><label for="sv-a">A. Opening stock by dip</label><input id="sv-a" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-b">B. Receipts in the period</label><input id="sv-b" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-e">E. Sales as per meter</label><input id="sv-e" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-g">G. Closing stock by dip</label><input id="sv-g" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
<label for="sv-s">Shrinkage allowance or TVA</label>
<select id="sv-s"><option value="">Does not apply</option><option value="s">Shrinkage allowance applies</option><option value="t">TVA applies</option></select>
<div id="sv-sx" style="display:none">
<div class="g">
<div><label for="sv-sa">Allowance, Rs per KL</label><input id="sv-sa" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-sp">Net price, Rs per KL<small>before commission, taxes and the allowance</small></label><input id="sv-sp" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-sc">Or the percentage your oil company gives<small>if filled, it replaces the allowance and net price boxes</small></label><input id="sv-sc" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-sq">Quantity it applies to<small>empty means all receipts. For TVA, only what carried the TVA credit.</small></label><input id="sv-sq" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
</div>
<div class="g">
<div><label for="sv-v">Annual average sales, in KL<small>as your oil company counts it against the 600 KL line</small></label><input id="sv-v" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-w">Only if above 600: part of this period's sales counted in the first 600 KL<small>same unit as the quantities above</small></label><input id="sv-w" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
<button type="button" id="sv-go">Work out the variation</button>
<p class="v" id="sv-err" style="display:none" role="alert"></p>
<div class="out" id="sv-out" style="display:none" role="status" aria-live="polite">
<div class="r"><span>C. Shrinkage or TVA taken off the book</span><b id="o-c"></b></div>
<div class="r"><span>D. Book stock after receipts (A + B - C)</span><b id="o-d"></b></div>
<div class="r"><span>F. Closing stock as per book (D - E)</span><b id="o-f"></b></div>
<div class="r"><span>G. Closing stock by dip</span><b id="o-g"></b></div>
<div class="r"><span>Variation (G - F) <span id="o-vd"></span></span><b id="o-v"></b></div>
<div class="r"><span>Part 1: 4% of tank stock (4% of G)</span><b id="o-4"></b></div>
<div class="r"><span>Part 2: handling loss on sales (used for a shortage only)</span><b id="o-h"></b></div>
<p class="v" id="sv-v1" style="display:none"></p>
<p class="v" id="sv-v2" style="display:none"></p>
<p class="v" id="sv-v3" style="display:none"></p>
<p class="n" id="sv-gain" style="display:none"></p>
<p class="n" id="sv-cp" style="display:none"></p>
<p class="n" id="sv-cn" style="display:none"></p>
<p class="n" id="sv-rg" style="display:none"></p>
<p class="n">A helper only. Your oil company's own working, and its inspection, decide.</p>
</div>
<noscript><p>This calculator needs JavaScript.</p></noscript>
</div>

## The sum, step by step

Annexure 9 sets out the method, and the calculator follows it with the same letters {{annexure 9}}.

| Letter | What it is | How it is worked out |
|---|---|---|
| A | Opening stock by dip | Your opening dip, in litres |
| B | Receipts | Product received in the period |
| C | Shrinkage or TVA | A percentage of the receipts, only where and when it applies |
| D | Book stock | A + B - C |
| E | Sales | As per the meter |
| F | Closing stock as per book | D - E |
| G | Closing stock as per dip | Your closing dip |
| | The test | F against G, within plus or minus 4% of G |

The calculator shows the gap as G - F. A plus sign means the tank holds more than the books. A minus sign means it holds less. MDG does not define "positive" and "negative"; this is how the trade uses them.

## What counts toward the limit

| Part | Figure | Where it comes from |
|---|---|---|
| Normal operating variation | 4% of tank stock. Annexure 9 works it on the closing dip, G | {{5.1.11}} {{annexure 9}} |
| Handling loss, petrol (MS) | 0.75% of the quantity sold up to an annual average of 600 KL, 0.60% on the additional quantity | {{5.1.11}} |
| Handling loss, diesel (HSD) | 0.25% up to 600 KL, 0.20% on the additional quantity | {{5.1.11}} |
| Shrinkage or TVA | Taken off the book stock as C, only where and when it applies | {{5.1.11}} {{annexure 9}} |

The calculator reads these as follows.

- **Positive variation (tank holds more).** It is set against 4% of G. The handling loss is not added, because the clause calls it a loss and does not say how it applies to a gain. This is stricter than adding it to the limit.
- **Negative variation (tank holds less).** It is first set against 4% of G alone. If it is larger, it is set against the 4% plus the handling loss. A shortage between the two is shown as "depends", because the clause words the limit for a negative variation as "up to 4%" and does not say in that sentence whether the handling loss is counted {{5.1.11}}.
- **Shrinkage or TVA** is taken off the book stock, as the annexure does, so it reduces a shortage and adds to a gain {{annexure 9}}.

## Where the shrinkage or TVA percentage comes from

The percentage is not a figure MDG fixes for all outlets. The oil company gives you an allowance in rupees per KL for your location, and the annexures turn it into a percentage.

- **Shrinkage allowance:** divide the allowance by the net price, the price before commission, taxes and the allowance. Apply the percentage to the total receipts of the period under inspection {{annexure 8}}.
- **TVA:** the same division. Apply the percentage only to the quantity received for which TVA was allowed in the invoices. TVA shows on each invoice as a credit, and it is generally revised every quarter {{annexure 10}}.

You can type the allowance and the net price, or the percentage your oil company gives you. The calculator rounds a worked-out percentage to two decimals, the way the annexures print theirs.

> **Note:** the sample percentages printed in Annexures 8 and 10 come from 1998 prices and are illustrations only {{annexure 8}} {{annexure 10}}. Never use them for your outlet. Take the allowance and the net price from your oil company's price build-up or invoices.

## Three worked examples

These are made-up outlets, for illustration. Quantities are in litres. In all three the annual average sales are below 600 KL, for example 450 KL typed into that box.

| | Example 1: diesel | Example 2: petrol | Example 3: diesel |
|---|---|---|---|
| A. Opening dip | 18,000 | 20,000 | 10,000 |
| B. Receipts | 12,000 | 24,000 | 15,000 |
| Shrinkage allowance | none | 0.63%, an example figure | none |
| E. Sales per meter | 25,500 | 40,000 | 22,000 |
| G. Closing dip | 4,400 | 3,600 | 3,500 |
| C. Taken off the book | 0 | 151 | 0 |
| F. Closing stock per book | 4,500 | 3,849 | 3,000 |
| Variation (G - F) | -100 | -249 | +500 |
| 4% of G | 176 | 144 | 140 |
| Handling loss on sales | 64 | 300 | 55 |
| Result | Within the limit on every reading | Depends: within only if the handling loss counts with the 4% | Beyond the limit |

Example 2 shows why the calculator may say "depends". The shortage of 249 litres is more than the 4% alone (144 litres) but less than the 4% plus the handling loss (444 litres). Which reading applies is for your oil company to say.

## What MDG leaves to your oil company

The calculator does not fill these gaps with a guess. It shows the part as a range, or asks you to type the oil company's figure.

- **The 600 KL line.** MDG does not say over what period the annual average is counted, or how a period's sales are split between the two rates. If your annual average is above 600 KL, the calculator shows the handling loss as a range, from every litre at the lower rate to every litre at the higher one. Type the part your oil company counts in the first 600 KL to get one figure.
- **A negative variation.** The "up to 4%" wording, as above {{5.1.11}}.
- **A positive variation.** How the handling loss applies to a gain {{5.1.11}}.
- **The shrinkage or TVA percentage and the quantity it applies to.** These come from your oil company and your invoices {{annexure 8}} {{annexure 10}}.
- **Tank or product.** MDG does not say whether the check is made per tank or per product. Ask your oil company, then enter the figures the same way.

Where the text is unclear, confirm with your oil company before you rely on any figure.

## After the number

A variation beyond the permissible limit is an irregularity the oil company must establish before it takes action {{8.5.2}}. If the sample passes the quality tests, it is a major irregularity {{8.3}}. The amounts and steps are on the [penalties page](@penalties) and the [positive and negative variation page](@stock-positive-negative). The entries the check is built on are in the [daily stock register](@stock-daily-register).
