---json
{
  "title": "Stock variation calculator for petrol pumps (MDG 2024)",
  "description": "Enter your dips, receipts and meter sales to see your stock variation against the 4% limit, handling loss and shrinkage or TVA. A helper only.",
  "answer": "Enter the dip at the start, the receipts, the sales on the meters and the dip at the end. The calculator works out the book stock, finds its gap to your closing dip and sets that gap against the limit in the Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers: 4% of tank stock, with the handling loss on sales and any shrinkage or TVA taken into account {{5.1.11}} {{annexure 9}}. Where MDG leaves a point open, such as whether the handling loss counts with the 4% for a shortage, the calculator says so and shows both readings. It is a helper only. Your oil company's own calculation decides.",
  "faq": [
    { "q": "How is stock variation calculated at a petrol pump?", "a": "Start with the opening dip, add what was received, take off shrinkage or TVA where they apply, then take off the sales shown on the meters. That gives the stock the books say should be in the tank. The gap between it and the closing dip is the variation, and it is judged against 4% of tank stock plus the other allowances {{5.1.11}} {{annexure 9}}." },
    { "q": "What is the stock variation formula in MDG Annexure 9?", "a": "Annexure 9 builds the book closing stock from the opening dip and the receipts, less the shrinkage share and less the meter sales. It then lets that figure differ from the closing dip by up to 4% of the dip figure, either way {{annexure 9}}." },
    { "q": "Is the 4% worked out on opening stock or closing stock?", "a": "On the closing dip. Annexure 9 sets the 4% against the closing stock as per dip {{annexure 9}}. The clause itself says \"4 % of tank stock\" {{5.1.11}}." },
    { "q": "How is the shrinkage allowance worked out?", "a": "The oil company gives an allowance in rupees per KL for your location. Divide it by the net price, which is the price before commission, taxes and the allowance are added, and you get a percentage. Apply that percentage to everything received in the period being checked {{annexure 8}}. The calculator rounds the percentage to two decimals, as the annexures do." },
    { "q": "What is TVA in petrol pump stock variation?", "a": "TVA is the temperature variation allowance. It appears on the oil company's invoice as a credit. It becomes a percentage in the same way as shrinkage, and counts only for the litres on which the invoices actually gave the TVA credit. It is generally revised every quarter {{annexure 10}}." },
    { "q": "Which handling loss rate applies to my sales?", "a": "Petrol (MS): 0.75% of sales up to an annual average of 600 KL, and 0.60% on the quantity beyond that. Diesel (HSD): 0.25% up to 600 KL and 0.20% beyond it {{5.1.11}}. MDG gives the 600 KL as an annual average and does not say how that is applied to the period you are checking, so ask your oil company." },
    { "q": "Why does the calculator sometimes say the result depends on how the allowances are counted?", "a": "For a negative variation, the clause words the limit as \"up to 4%\" and does not say in that sentence whether the handling loss is counted with it {{5.1.11}}. When the shortage falls between the 4% alone and the 4% plus the handling loss, the answer depends on how your oil company counts, so the calculator shows both readings." },
    { "q": "Does this calculator replace the oil company's own stock check?", "a": "No. It is a helper. The oil company's own working decides, and the oil company has to establish an irregularity before it acts against a dealer {{5.1.11}} {{8.5.2}}." },
    { "q": "Does the calculator save or send my figures?", "a": "No. The sum is worked out on your own phone or computer. Nothing you type is stored or sent anywhere." }
  ],
  "related": ["stock-variation", "stock-shrinkage-tva", "stock-positive-negative", "stock-daily-register"],
  "updated": "2026-10-15"
}
---
This page works out the stock variation of one product from your own dips and meter readings. It follows the limit in clause 5.1.11 of the Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers under the dealership agreement, and the method shown in its Annexures 8 to 10 {{5.1.11}}. For what the limit means and what follows when it is crossed, see [stock variation: the permissible limit](@stock-variation). The calculator is a helper, and your oil company's own calculation decides.

## Work out the variation

<div class="tool" id="sv">
<style>#sv .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0 16px}#sv select{max-width:100%}#sv small{display:block;color:#5D5F86;font-weight:400}#sv .r{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid #E4E6F1}#sv .r b{text-align:right;white-space:nowrap}#sv .v{margin:12px 0 0;padding:10px 12px;border-radius:8px;background:#fff;border:1px solid #C5C7ED;font-weight:600}#sv .n{margin:8px 0 0;font-size:14.5px;font-weight:400;color:#3D3F66}</style>
<p style="margin:0 0 4px"><b>A helper only.</b> Your oil company's own working decides. Use the totals for one product at a time.</p>
<div class="g">
<div><label for="sv-p">Product</label><select id="sv-p"><option value="ms">Petrol (MS)</option><option value="hsd">Diesel (HSD)</option></select></div>
<div><label for="sv-u">Quantities below are in</label><select id="sv-u"><option value="1">Litres</option><option value="1000">Kilolitres (KL)</option></select></div>
</div>
<div class="g">
<div><label for="sv-a">A. Dip at the start of the period</label><input id="sv-a" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-b">B. Product received in the period</label><input id="sv-b" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-e">E. Sales on the pump meters</label><input id="sv-e" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-g">G. Dip at the end of the period</label><input id="sv-g" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
<label for="sv-s">Shrinkage allowance or TVA</label>
<select id="sv-s"><option value="">Does not apply</option><option value="s">Shrinkage allowance applies</option><option value="t">TVA applies</option></select>
<div id="sv-sx" style="display:none">
<div class="g">
<div><label for="sv-sa">Allowance, Rs per KL</label><input id="sv-sa" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-sp">Net price, Rs per KL<small>the price before commission, taxes and the allowance are added</small></label><input id="sv-sp" type="text" inputmode="decimal" autocomplete="off"></div>
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
<div class="r"><span>C. Shrinkage or TVA deducted</span><b id="o-c"></b></div>
<div class="r"><span>D. Book stock after receipts (A + B - C)</span><b id="o-d"></b></div>
<div class="r"><span>F. Book stock at the end (D - E)</span><b id="o-f"></b></div>
<div class="r"><span>G. Dip at the end of the period</span><b id="o-g"></b></div>
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

## How the sum runs

The calculator builds the stock the books say you should hold, then compares it with what the dip shows. It follows the method of Annexure 9 in this order {{annexure 9}}:

1. Start with the dip at the beginning of the period (A) and add everything received (B).
2. Where shrinkage or TVA applies, take its share off the receipts (C). The result is the book stock after receipts (D).
3. Take off the sales shown on the pump meters (E). What is left is the stock the books say should be in the tank (F).
4. Compare F with the dip at the end of the period (G). The gap, G minus F, is the variation. The test is whether the gap stays within plus or minus 4% of G.

A plus sign means the tank holds more than the books. A minus sign means it holds less. MDG does not define "positive" and "negative" variation in these words; this is how the trade uses them.

## What counts toward the limit

| Part | Figure | Where it comes from |
|---|---|---|
| Normal operating variation | 4% of tank stock. Annexure 9 works it on the closing dip, G | {{5.1.11}} {{annexure 9}} |
| Handling loss on sales (petrol: evaporation and handling) | Petrol (MS): 0.75% up to an annual average of 600 KL, then 0.60%. Diesel (HSD): 0.25% up to 600 KL, then 0.20% | {{5.1.11}} |
| Shrinkage or TVA | Deducted from the book stock as C, only where and when it applies | {{5.1.11}} {{annexure 9}} |

The calculator reads these as follows.

- **Positive variation (tank holds more).** It is set against 4% of G. The handling loss is not added, because the clause calls it a loss and does not say how it would apply to a gain. This leaves less room than adding it to the limit.
- **Negative variation (tank holds less).** It is first set against 4% of G alone. If the shortage is larger, it is set against the 4% plus the handling loss. A shortage between the two is shown as "depends". For a negative variation the clause words the limit as "up to 4%" and does not say in that sentence whether the handling loss counts with it {{5.1.11}}.
- **Shrinkage or TVA** is taken off the book stock, as the annexure does, so it reduces a shortage and adds to a gain {{annexure 9}}.

## Where the shrinkage or TVA percentage comes from

MDG does not fix one percentage for all outlets. Your oil company gives an allowance in rupees per KL for your location, and the annexures show how to turn it into a percentage.

- **Shrinkage allowance:** divide the allowance by the net price, which is the price before commission, taxes and the allowance are added. Apply the percentage to everything received in the period being checked {{annexure 8}}.
- **TVA:** the same division. The percentage counts only for the litres on which the invoices gave the TVA credit. The invoice carries TVA as a credit, and it is generally revised every quarter {{annexure 10}}.

You can type the allowance and the net price, or the percentage your oil company gives you. The calculator rounds a worked-out percentage to two decimals, the way the annexures do.

> **Note:** the sample percentages printed in Annexures 8 and 10 are illustrations built on 1998 prices {{annexure 8}} {{annexure 10}}. Do not use them for your outlet. Take the allowance and the net price from your oil company's price build-up or invoices.

## Three worked examples

These are made-up outlets with figures of our own, for illustration. Quantities are in litres. In all three the annual average sales are below 600 KL, for example 450 KL typed into that box.

| | Example 1: diesel | Example 2: petrol | Example 3: diesel |
|---|---|---|---|
| A. Dip at the start | 14,000 | 16,000 | 9,000 |
| B. Received | 10,000 | 20,000 | 14,000 |
| Shrinkage allowance | none | 0.52%, an example figure | none |
| E. Sales on the meters | 19,200 | 32,000 | 20,500 |
| G. Dip at the end | 4,700 | 3,600 | 3,000 |
| C. Deducted | 0 | 104 | 0 |
| F. Book stock at the end | 4,800 | 3,896 | 2,500 |
| Variation (G - F) | -100 | -296 | +500 |
| 4% of G | 188 | 144 | 120 |
| Handling loss on sales | 48 | 240 | 51 |
| Result | Within the limit on every reading | Depends: within only if the handling loss counts with the 4% | Beyond the limit |

Example 2 shows why the calculator may say "depends". The shortage of 296 litres is more than the 4% alone (144 litres) but less than the 4% plus the handling loss (384 litres). Which reading applies is for your oil company to say.

## What MDG leaves to your oil company

The calculator does not fill these gaps with a guess. It shows the part as a range, or asks you to type the oil company's figure.

- **The 600 KL line.** MDG gives the 600 KL as an annual average. It does not say how that average is applied to the period you are checking, or how one period's sales are split between the two rates. If your annual average is above 600 KL, the calculator shows the handling loss as a range, from every litre at the lower rate to every litre at the higher one. Type the part your oil company counts in the first 600 KL to get one figure.
- **A negative variation.** The "up to 4%" wording, as above {{5.1.11}}.
- **A positive variation.** How the handling loss applies to a gain {{5.1.11}}.
- **The shrinkage or TVA percentage and the quantity it applies to.** These come from your oil company and your invoices {{annexure 8}} {{annexure 10}}.
- **Tank or product.** MDG does not say whether the check is made per tank or per product. Ask your oil company, then enter the figures the same way.

Where the text is unclear, confirm with your oil company before you rely on any figure.

## After the number

A variation beyond the permissible limit is an irregularity that the oil company has to establish before it takes any action {{8.5.2}}. If the sample passes the quality tests, MDG classes it as major {{8.3}}. The actions in Chapter 8 are the minimum, and the oil company may take higher action {{8.5.1}}. The amounts and steps are on the [penalties page](@penalties) and the [positive and negative variation page](@stock-positive-negative). The entries the check is built on are in the [daily stock register](@stock-daily-register).
