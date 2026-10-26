---json
{
  "title": "Dip chart calculator for petrol pump tanks: read litres between two lines",
  "metaTitle": "Dip chart calculator: dip to litres",
  "description": "Type two rows from your own tank's dip chart and your dip in between to get the litres, worked in a straight line with the sum shown. No chart is held here.",
  "answer": "Type two neighbouring rows from your own tank's calibration chart (dip and litres for each) and your dip reading in between. The tool reads the litres in a straight line between the rows and shows the sum. Only your tank's own calibrated chart counts: every tank has its own, and this page carries none. The Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers, ask for each tank's product and water dip every morning {{1.3}}.",
  "faq": [
    { "q": "How to read a dip chart at a petrol pump?", "a": "Find your dip in the dip column of your tank's own chart and read the litres beside it. If the dip falls between two lines, the tool reads the litres in a straight line between them. That is general practice, not an MDG rule." },
    { "q": "Does MDG give a petrol pump dip chart?", "a": "No. MDG does not use the term. It asks for the product and water dip of each tank every morning {{1.3}}. Use the calibrated chart that belongs to your tank, and ask your oil company if you do not have it." },
    { "q": "Dip to litre conversion: can one chart serve all tanks?", "a": "No. Tanks differ in size and shape, so the same dip means different litres in different tanks. Only your tank's own calibrated chart gives the litres." },
    { "q": "What if my dip is between two lines of the chart?", "a": "Take the two rows either side of it and type them with your dip. General practice, not an MDG rule: the closer the two rows, the closer the result is to the chart." },
    { "q": "How do I take the water out of the litres?", "a": "General practice, not an MDG rule: read the litres for the water dip from the same chart, using this tool again with the rows around the water dip, and type them in the water box. Do this only if your dip reading is the whole liquid height, water included. MDG asks for the water dip daily {{1.4.1(b)}}." },
    { "q": "Can I use millimetres instead of centimetres?", "a": "Yes. Use the same unit in all three dip boxes and the litres come out the same." },
    { "q": "Does the calculator save what I type?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." }
  ],
  "related": ["stock-what-is-dip", "stock-daily-register", "stock-variation", "tanker-water-finding-paste"],
  "updated": "2026-10-26"
}
---
Read the litres for a dip that falls between two lines of your own tank's chart.

## Read the litres for your dip

<div class="tool" id="dp">
<style>#dp .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0 16px}#dp .g>div{display:flex;flex-direction:column;justify-content:flex-end}</style>
<p style="margin:0 0 4px"><b>Use your own tank's chart.</b> Every tank has its own. No chart is held here.</p>
<div class="g">
<div><label for="dp-d1">Row 1: dip (cm)</label><input id="dp-d1" type="text" inputmode="decimal" autocomplete="off" placeholder="dip on the line below yours"></div>
<div><label for="dp-l1">Row 1: litres</label><input id="dp-l1" type="text" inputmode="decimal" autocomplete="off" placeholder="its litres"></div>
<div><label for="dp-d2">Row 2: dip (cm)</label><input id="dp-d2" type="text" inputmode="decimal" autocomplete="off" placeholder="dip on the line above yours"></div>
<div><label for="dp-l2">Row 2: litres</label><input id="dp-l2" type="text" inputmode="decimal" autocomplete="off" placeholder="its litres"></div>
</div>
<label for="dp-r">Your dip reading<small>In the same unit as the rows, for example 120.5</small></label>
<input id="dp-r" type="text" inputmode="decimal" autocomplete="off" placeholder="your dip">
<label for="dp-w">Water in the tank, in litres (optional)<small>Only if your dip is the whole liquid height, water included. Read the water's litres from the same chart.</small></label>
<input id="dp-w" type="text" inputmode="decimal" autocomplete="off" placeholder="leave empty if none">
<button type="button" id="dp-go">Read the litres</button>
<div class="out" id="dp-out" role="status" aria-live="polite">Type the two rows and your dip, then press the button.</div>
<noscript><p>This calculator needs JavaScript. The sum: litres = L1 + (dip - d1) × (L2 - L1) ÷ (d2 - d1).</p></noscript>
</div>

## How to use it

1. In your tank's own chart, find the two lines either side of your dip. Copy the dip and litres of each.
2. Type your dip reading in the same unit.
3. Press the button. The litres come with the sum, so you can check it by hand.

The sum is litres = L1 + (dip − d1) × (L2 − L1) ÷ (d2 − d1), where row 1 is the lower one.

For example, with made-up rows that belong to no tank: 120 cm is 9,000 litres and 121 cm is 9,060 litres. A dip of 120.5 is halfway, so 9,000 + 0.5 × 60 = 9,030 litres. With 40 litres of water taken off, the product is 8,990 litres.

> **Note:** only your tank's own calibrated chart counts, and reading in a straight line between two lines is general practice, not an MDG rule.

## What MDG asks for

MDG does not use the words dip chart. It asks for the product and water dip of each tank every morning {{1.3}}, and for the water dip daily {{1.4.1(b)}}. The stock check starts from the opening dip and ends at the closing dip {{annexure 9}} {{5.1.11}}.

See [what a dip is](@stock-what-is-dip), the [daily stock register](@stock-daily-register) and [stock variation](@stock-variation).
