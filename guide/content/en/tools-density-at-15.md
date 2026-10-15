---json
{
  "title": "Density at 15°C calculator for petrol and diesel (Table 53B)",
  "description": "Type the hydrometer reading and the temperature to get the density at 15°C by the ASTM 53B method, and check it against the invoice within ±3.0 kg/m³.",
  "answer": "Type the density your hydrometer shows and the temperature of the same sample. The calculator gives the density at 15°C by the ASTM Table 53B method that MDG 2024 names, and can compare it with the invoice density, which must be within ±3.0 kg/m³ {{1.2(iv)}}. It is a helper only. The printed ASTM table, or the figure your oil company works out, decides {{1.5(vi)}}.",
  "faq": [
    { "q": "How to calculate density of petrol at 15°C?", "a": "Read the hydrometer and the thermometer on the same sample, then reduce the reading to 15°C with the ASTM density table (Table 53B) {{1.2(iv)}}. The calculator on this page does the same sum and shows the result to one decimal. Keep the printed table at the outlet too, because MDG asks every dealer to have it {{1.5(vi)}}." },
    { "q": "Is this petrol pump density calculator the official answer?", "a": "No. It is a helper. If its figure and the printed ASTM Table 53B differ, the table, or the figure your oil company works out, decides. MDG names the table, not any calculator {{1.2(iv)}} {{1.5(vi)}}." },
    { "q": "Which table does MDG name for converting density to 15°C?", "a": "ASTM Table 53B. MDG 2024 names it when it asks the dealer to check that the density at 15°C is within ±3.0 kg/m³ of the invoice density {{1.2(iv)}}." },
    { "q": "How much can my density differ from the invoice density?", "a": "The density at 15°C, worked out with the ASTM table, must be within ±3.0 kg/m³ of the invoice density {{1.2(iv)}}. Each compartment's sample is checked on its own {{1.2(viii)}}." },
    { "q": "Does the calculator work for diesel as well as petrol?", "a": "Yes. Table 53B is for refined products in general, so it covers both. The calculator picks the right range from the density itself: petrol-weight fuels, a short transition zone, kerosene and lighter diesel, and heavier diesel and fuel oil. It accepts readings from 653 to 1075 kg/m³ and from -18 to 95 °C." },
    { "q": "Why must density be stated at 15°C?", "a": "Fuel expands as it warms, so the same fuel reads lower on a hot day and higher on a cold morning. MDG therefore records density at 15°C and asks the dealer to convert a reading with the ASTM table {{1.2(iv)}} {{1.4.1(c)}}. The reason is a general explanation, not MDG text." },
    { "q": "Where do I record the density at 15°C?", "a": "In the density register. MDG asks for the morning density at 15°C before sales start, for each tanker compartment's density and temperature, and for the density of the mixed product after decanting {{1.4.1(c)}} {{1.2(viii)}} {{1.2(xiv)}}. The register is kept for the current and previous financial year {{5.1.12}}." },
    { "q": "Does the calculator save or send what I type?", "a": "No. The sum is worked out on your own phone or computer. Nothing you type is stored or sent anywhere." }
  ],
  "related": ["density-invoice-check", "density-register", "density-reference-10am", "density-range"],
  "updated": "2026-10-15"
}
---
This page works out the density at 15°C from a hydrometer reading, the way the Marketing Discipline Guidelines 2024 (MDG 2024) ask a dealer to do it with the ASTM density table {{1.2(iv)}}.

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

1. Read the density on the hydrometer and the temperature on the thermometer, for the same sample. Type both in.
2. If you want to compare with the invoice, type the density at 15°C printed on the invoice. MDG asks for the converted figure to be within ±3.0 kg/m³ of it {{1.2(iv)}}.
3. Press the button. The answer shows the density at 15°C, the range of the table that was used and, if you typed an invoice density, the difference.

MDG asks for a density at 15°C in three places, and the same sum serves all of them:

- **Every tanker compartment**, before decanting. Each compartment is checked on its own for density and temperature and recorded in the register {{1.2(viii)}}. The steps are on the [tanker density check](@density-invoice-check) page.
- **The morning sample** from the pump nozzle, recorded before daily sales start {{1.4.1(c)}}.
- **The mixed product after decanting**, taken from the nozzle once at least 50 litres have gone through the pump {{1.2(xiv)}}. See the [reference density rule](@density-reference-10am).

Where the answer goes in the book is on the [density register](@density-register) page.

> **Note:** this is a helper. If it and the printed ASTM Table 53B differ, the table, or the figure your oil company works out, decides.

## What the calculator does

MDG names ASTM Table 53B for the conversion {{1.2(iv)}} and requires every dealer to have calibrated hydrometers and thermometers and the ASTM Density Conversion Table {{1.5(vi)}}. The calculator follows the working behind that table in three steps:

1. **It corrects the reading for the glass of the hydrometer.** The glass itself expands as it warms. The printed 1980 tables build this correction in, so the calculator does too.
2. **It works out how much the fuel itself expands.** This depends on how heavy the fuel is, so the calculator uses one of four ranges: petrol-weight fuels up to about 770 kg/m³, a short transition zone up to 787.5, kerosene and lighter diesel up to 838.5, and heavier diesel and fuel oil above that. Diesel can fall in either of the last two.
3. **It repeats until the answer stops changing.** The expansion depends on the density at 15°C, which is the very thing being looked for, so the sum is repeated until it settles.

It accepts a hydrometer reading from 653 to 1075 kg/m³ and a temperature from -18 to 95 °C. For anything outside that, use the printed table.

## How close is it to the printed table?

We checked the calculator against 12 densities that were published as Table 53B values. They run from 737 to 842 kg/m³ and from 9 to 30.5 °C, across the petrol range, the transition zone and the kerosene and diesel ranges. It matched each of them to within 0.1 kg/m³. We also checked the fuel expansion step against 43 published volume correction factors, worked out from the API tables for fuels of 730, 800 and 840 kg/m³ at temperatures from -40 to 41 °C. Every one agreed to within the rounding of the four decimals printed. Three of the 12 densities, for example:

| Hydrometer reading | Temperature | Calculator gives, at 15°C |
|---|---|---|
| 747.0 kg/m³ | 18 °C | 749.7 kg/m³ |
| 837.0 kg/m³ | 22 °C | 841.8 kg/m³ |
| 835.0 kg/m³ | 9 °C | 830.8 kg/m³ |

These are examples to test the page, not figures for your outlet. Your own readings, your own table.

Three limits to know:

- **The printed table shows one decimal.** The last digit can differ between the calculator and the book.
- **The edition matters.** MDG names Table 53B, which comes from the 1980 ASTM tables. A newer ASTM edition (2004) does not include the glass correction and expects it to be made before use. If your oil company or an inspector uses a different edition or its own software, its figure decides.
- **A wrong reading gives a wrong answer.** The result is only as good as the hydrometer and thermometer behind it. MDG asks for both to be calibrated and kept in working order {{1.5(vi)}}.

## What to do with the answer

- **Tanker compartment:** compare with the invoice density. Within ±3.0 kg/m³ meets the check {{1.2(iv)}}. If you doubt the quality of the product, MDG says to contact the supply location or the concerned area field officer for instructions {{1.2(ix)}}. It gives no further steps, so confirm with your oil company how it wants a compartment outside the limit handled.
- **Morning and after-tanker entries:** write the 15°C figure in the density register {{1.4.1(c)}} {{1.2(xiv)}}. A missing reference density at inspection stops sales and supplies of all products {{5.1.9}}.
- **A figure far from normal:** MDG prints the density limits a lab tests against: petrol 720–775 kg/m³, diesel 810–845 kg/m³ and biodiesel blends 820–860 kg/m³, all at 15°C {{7.6}}. A result well outside them is a reason to read the hydrometer and thermometer again. See [density range](@density-range).
