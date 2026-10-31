---json
{
  "title": "Density at 15°C calculator for petrol and diesel (Table 53B)",
  "metaTitle": "Density at 15°C calculator for petrol, diesel",
  "description": "Type the hydrometer reading and the temperature to get the density at 15°C by the ASTM 53B method, and compare it with the invoice density. A helper only.",
  "answer": "Type the hydrometer reading and temperature of the same sample to get the density at 15°C by ASTM Table 53B, the method named in the Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers. It should be within 3.0 kg/m³ of the invoice density {{1.2(iv)}}. A helper only: every dealer must hold the printed table {{1.5(vi)}}, and the table decides.",
  "faq": [
    { "q": "How to calculate density of petrol at 15°C?", "a": "Read the hydrometer and the thermometer on the same sample, then convert with ASTM Table 53B {{1.2(iv)}}. The calculator does that sum and shows one decimal." },
    { "q": "Is this petrol pump density calculator the final answer?", "a": "No. MDG names the ASTM table, not any calculator {{1.2(iv)}}. If the two differ, the printed table, or the figure your oil company works out, decides." },
    { "q": "Which table does MDG name for converting density to 15°C?", "a": "ASTM Table 53B, in the tanker check {{1.2(iv)}}. MDG names no edition, so ask your oil company which one it works from." },
    { "q": "How much can my density differ from the invoice density?", "a": "By no more than 3.0 kg/m³ either way, once converted to 15°C {{1.2(iv)}}. Each tanker compartment is checked on its own {{1.2(viii)}}." },
    { "q": "Does the calculator save or send what I type?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." }
  ],
  "related": ["tools-density-check", "density-invoice-check", "density-register", "density-reference-10am", "density-range"],
  "updated": "2026-10-15"
}
---
Convert one hydrometer reading to 15°C with the ASTM table that MDG names for the tanker check {{1.2(iv)}}.

## Convert a reading to 15°C

<div class="tool" id="dt">
<p style="margin:0 0 4px"><b>A helper only.</b> The printed ASTM Table 53B, or the figure your oil company works out, decides.</p>
<label for="dt-d">Density shown by the hydrometer (kg/m³)</label>
<input id="dt-d" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 748.0">
<label for="dt-t">Temperature of the same sample (°C)</label>
<input id="dt-t" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 30.5">
<label for="dt-i">Invoice density at 15°C (kg/m³), only if you want to compare</label>
<input id="dt-i" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 761.5">
<button type="button" id="dt-go">Convert to 15°C</button>
<div class="out" id="dt-out" role="status" aria-live="polite">Type the readings and press the button.</div>
<noscript><p>This calculator needs JavaScript. Use the printed ASTM table instead.</p></noscript>
</div>

## How to use it

1. Type the hydrometer reading and the temperature of the same sample.
2. To compare with the invoice, type the 15°C density printed on it.
3. Press the button. You get the density at 15°C, the table range used and, with an invoice density, the gap.

The same conversion serves the [tanker density check](@density-invoice-check), the [10 AM reference density](@density-reference-10am) and the [density register](@density-register).

> **Note:** a helper only. Every dealer must hold the printed ASTM table {{1.5(vi)}}, and where it differs from the calculator, the table decides.

## What the calculator does

It follows the working behind ASTM Table 53B, glass correction included, in four density ranges from petrol to heavier diesel. It accepts 653 to 1075 kg/m³ and -18 to 95 °C; outside that, use the printed table.

## How close is it to the printed table?

In our own checks it matched 12 published Table 53B values to within 0.1 kg/m³. That is a note of our testing, not a promise. The printed table shows one decimal, so the last digit can differ. For example (made-up readings):

| Reading (kg/m³) | Temperature | Invoice at 15°C | Calculator at 15°C | Gap | Within 3.0? |
|---|---|---|---|---|---|
| 742.5 | 27 °C | 750.0 | 753.1 | +3.1 | No, but close: confirm in the printed table |

## What to do with the answer

- **Tanker compartment:** a gap over 3.0 kg/m³ is outside the limit {{1.2(iv)}}. If you doubt the quality, contact the supply location or the area field officer for instructions {{1.2(ix)}}.
- **A figure far from normal:** read the instruments again. The density ranges MDG lists {{7.6}} are on the [density range](@density-range) page.
