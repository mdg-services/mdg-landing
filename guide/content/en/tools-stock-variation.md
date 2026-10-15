---json
{
  "title": "Stock variation calculator for petrol pumps (MDG 2024)",
  "metaTitle": "Petrol pump stock variation calculator",
  "description": "Enter your dips, receipts and meter sales to see your stock variation against the 4% limit, handling loss and shrinkage or TVA. A helper only.",
  "answer": "Enter the dips, receipts and meter sales. The calculator sets the gap between book stock and your closing dip against the limit in the Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers: 4% of tank stock, with the handling loss on sales and any shrinkage or TVA taken into account {{5.1.11}} {{annexure 9}}. A helper only: your oil company's calculation decides.",
  "faq": [
    { "q": "How is stock variation calculated at a petrol pump?", "a": "Work out the stock the books say should be in the tank, then compare it with the closing dip. The gap is the variation, set against 4% of the closing dip {{annexure 9}} {{5.1.11}}." },
    { "q": "Is the 4% worked out on opening stock or closing stock?", "a": "On the closing dip {{annexure 9}}. The clause itself says \"4 % of tank stock\" {{5.1.11}}." },
    { "q": "Why does the calculator say the result depends?", "a": "It means the shortage is within the limit only if your oil company counts the handling loss with the 4%. Ask it how it counts {{5.1.11}}." },
    { "q": "Does the calculator save or send my figures?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." }
  ],
  "related": ["stock-variation", "stock-shrinkage-tva", "stock-positive-negative", "stock-daily-register"],
  "updated": "2026-10-15"
}
---
Check one product's stock variation against the MDG limit {{5.1.11}}. What the limit means is on the [permissible limit](@stock-variation) page.

## Work out the variation

<div class="tool" id="sv">
<style>#sv .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0 16px}#sv .g>div{display:flex;flex-direction:column;justify-content:flex-end}@media(min-width:640px){#sv .g2{grid-template-columns:repeat(2,minmax(0,1fr))}}#sv .v.top{margin:0 0 12px}#sv select{max-width:100%}#sv small{display:block;color:#5D5F86;font-weight:400}#sv .r{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid #E4E6F1}#sv .r b{text-align:right;white-space:nowrap}#sv .v{margin:12px 0 0;padding:10px 12px;border-radius:8px;background:#fff;border:1px solid #C5C7ED;font-weight:600}#sv .n{margin:8px 0 0;font-size:14.5px;font-weight:400;color:#3D3F66}</style>
<p style="margin:0 0 4px"><b>A helper only.</b> Your oil company's own working decides. Use the totals for one product at a time.</p>
<div class="g">
<div><label for="sv-p">Product</label><select id="sv-p"><option value="ms">Petrol (MS)</option><option value="hsd">Diesel (HSD)</option></select></div>
<div><label for="sv-u">Quantities below are in</label><select id="sv-u"><option value="1">Litres</option><option value="1000">Kilolitres (KL)</option></select></div>
</div>
<div class="g g2">
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
<p class="v top" id="sv-v1" style="display:none"></p>
<p class="v top" id="sv-v2" style="display:none"></p>
<p class="v top" id="sv-v3" style="display:none"></p>
<div class="r"><span>C. Shrinkage or TVA deducted</span><b id="o-c"></b></div>
<div class="r"><span>D. Book stock after receipts (A + B - C)</span><b id="o-d"></b></div>
<div class="r"><span>F. Book stock at the end (D - E)</span><b id="o-f"></b></div>
<div class="r"><span>G. Dip at the end of the period</span><b id="o-g"></b></div>
<div class="r"><span>Variation (G - F) <span id="o-vd"></span></span><b id="o-v"></b></div>
<div class="r"><span>Part 1: 4% of tank stock (4% of G)</span><b id="o-4"></b></div>
<div class="r"><span>Part 2: handling loss on sales (used for a shortage only)</span><b id="o-h"></b></div>
<p class="n" id="sv-gain" style="display:none"></p>
<p class="n" id="sv-cp" style="display:none"></p>
<p class="n" id="sv-cn" style="display:none"></p>
<p class="n" id="sv-rg" style="display:none"></p>
<p class="n">A helper only. Your oil company's own working, and its inspection, decide.</p>
</div>
<noscript><p>This calculator needs JavaScript.</p></noscript>
</div>

## The sum

- **Book stock:** A (start dip) + B (received) - C (shrinkage or TVA, if any) - E (meter sales) = F {{annexure 9}}.
- **Variation:** G (end dip) - F.
- **Limit:** 4% of G {{5.1.11}} {{annexure 9}}.

## What counts toward the limit

Handling loss on sales: petrol (MS) 0.75% up to an annual average of 600 KL, then 0.60%; diesel (HSD) 0.25% up to 600 KL, then 0.20% {{5.1.11}}. Shrinkage or TVA is taken off as C only where and when it applies {{5.1.11}} {{annexure 9}}.

The calculator reads the two directions like this:

- **Gain (tank holds more):** set against 4% of G alone. The clause does not say how the handling loss applies to a gain, so it is not added {{5.1.11}}.
- **Shortage (tank holds less):** set against 4% of G, then 4% plus the handling loss. In between, the result is "depends".

Type the shrinkage or TVA allowance (rupees per KL) with the net price, or the percentage your oil company gives; [shrinkage and TVA](@stock-shrinkage-tva) explains it.

> **Note:** the sample percentages in Annexures 8 and 10 rest on 1998 prices {{annexure 8}} {{annexure 10}}. Do not use them for your outlet; take the figures from your oil company.

## An example

A made-up petrol outlet, in litres, with annual average sales under 600 KL:

- Start dip 16,000; received 20,000; shrinkage 0.52% (an example figure), so C is 104; meter sales 32,000; end dip 3,600.
- F is 16,000 + 20,000 - 104 - 32,000 = 3,896, so the variation is 3,600 - 3,896 = -296.
- 4% of G is 144. With the handling loss (0.75% of 32,000 = 240) it is 384.
- 296 is above 144 and below 384: the result is "depends".

## What MDG leaves to your oil company

- **The 600 KL line.** MDG gives 600 KL as an annual average, not how it applies to your period. Above 600 KL the calculator shows a range; type the part your oil company counts in the first 600 KL for one figure.
- **A shortage.** Whether the handling loss counts with "up to 4%" {{5.1.11}}.
- **Tank or product.** MDG does not say which the check uses.

The oil company must establish an irregularity before it acts {{8.5.2}}. See [penalties](@penalties) and the [daily stock register](@stock-daily-register).
