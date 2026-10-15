---json
{
  "title": "Density at 15°C calculator for petrol and diesel (Table 53B)",
  "description": "Type the hydrometer reading and the temperature to get the density at 15°C by the ASTM 53B method, and compare it with the invoice density. A helper only.",
  "answer": "Type the density your hydrometer shows and the temperature of the same sample. The calculator gives the density at 15°C by the ASTM Table 53B method that the Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers, point to. It can also set the result beside the invoice density, which should not differ by more than 3.0 kg/m³ {{1.2(iv)}}. It is a helper only. Every dealer must hold the printed ASTM table {{1.5(vi)}}, and where the calculator and that table differ, the table, or the figure your oil company works out, decides.",
  "faq": [
    { "q": "How to calculate density of petrol at 15°C?", "a": "Take the hydrometer reading and the temperature of the same sample, then convert the reading to 15°C with the ASTM density table (Table 53B) {{1.2(iv)}}. The calculator on this page does that sum and shows the result to one decimal. Keep the printed table at the outlet as well, because MDG requires every dealer to hold it {{1.5(vi)}}." },
    { "q": "Is this petrol pump density calculator the final answer?", "a": "No. It is a helper. If its figure and the printed ASTM Table 53B differ, the table, or the figure your oil company works out, decides. MDG names the table, not any calculator {{1.2(iv)}} {{1.5(vi)}}." },
    { "q": "Which table does MDG name for converting density to 15°C?", "a": "ASTM Table 53B. MDG 2024 names it in the tanker check, where the converted density is compared with the invoice density {{1.2(iv)}}. MDG names no edition, so check with your oil company which edition it works from." },
    { "q": "How much can my density differ from the invoice density?", "a": "By no more than 3.0 kg/m³ either way, once the reading has been converted to 15°C with the ASTM table {{1.2(iv)}}. Each tanker compartment is sampled and checked on its own {{1.2(viii)}}." },
    { "q": "Does the calculator work for diesel as well as petrol?", "a": "Yes. Table 53B is for refined products in general, so it covers both. The calculator picks the range from the density itself: petrol-weight fuels, a short transition zone, kerosene and lighter diesel, and heavier diesel and fuel oil. It accepts readings from 653 to 1075 kg/m³ and from -18 to 95 °C." },
    { "q": "Why must density be stated at 15°C?", "a": "Fuel expands as it warms, so the same fuel reads lighter on a hot afternoon than on a cold morning. Stating every reading at 15°C makes readings comparable, and MDG asks the dealer to record the 15°C figure {{1.4.1(c)}} {{1.2(xiv)}}. This is a general explanation, not MDG text." },
    { "q": "Where do I record the density at 15°C?", "a": "In the density register. Three entries rest on it: the first sample of the day, drawn before sales begin {{1.4.1(c)}}; the density and temperature of each tanker compartment {{1.2(viii)}}; and the sample of the mixed stock after the tanker has been unloaded {{1.2(xiv)}}. MDG asks for the register to be kept for the current and previous financial year {{5.1.12}}." },
    { "q": "Does the calculator save or send what I type?", "a": "No. The sum is worked out on your own phone or computer. Nothing you type is stored or sent anywhere." }
  ],
  "related": ["density-invoice-check", "density-register", "density-reference-10am", "density-range"],
  "updated": "2026-10-15"
}
---
This page converts a hydrometer reading to the density at 15°C. It follows the ASTM density table that the Marketing Discipline Guidelines 2024 (MDG 2024) name for the tanker check {{1.2(iv)}}. MDG 2024 is the set of rules the oil companies apply to their dealers under the dealership agreement.

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

1. Read the hydrometer and the thermometer on the same sample, and type both in.
2. To compare with the invoice, type the 15°C density printed on it. The limit MDG sets is a gap of 3.0 kg/m³ either way between the converted figure and the invoice figure {{1.2(iv)}}.
3. Press the button. You get the density at 15°C, the range of the table that was used and, if you gave an invoice density, the gap.

The same conversion is used at three points of the working day:

- **Each tanker compartment, before unloading.** A separate sample is drawn from every compartment, and its density and temperature go in the register {{1.2(viii)}}. The steps are on the [tanker density check](@density-invoice-check) page.
- **The first sample of the day.** It is drawn at a pump nozzle and recorded before the first sale {{1.4.1(c)}}.
- **The mixed stock after unloading.** At least 50 litres are run through the pump first, then a nozzle sample is taken {{1.2(xiv)}}. See the [reference density rule](@density-reference-10am).

Where the answer goes in the book is on the [density register](@density-register) page.

> **Note:** this is a helper. If it and the printed ASTM Table 53B differ, the table, or the figure your oil company works out, decides.

## What the calculator does

MDG names ASTM Table 53B for the conversion {{1.2(iv)}} and requires every outlet to hold calibrated hydrometers and thermometers and a copy of the ASTM conversion table {{1.5(vi)}}. The calculator follows the working behind that table in three steps:

1. **It corrects the reading for the glass of the hydrometer.** The glass itself expands as it warms. The printed 1980 tables build this correction in, so the calculator does too.
2. **It works out how much the fuel itself expands.** This depends on how heavy the fuel is, so the calculator uses one of four ranges: petrol-weight fuels up to about 770 kg/m³, a short transition zone up to 787.5, kerosene and lighter diesel up to 838.5, and heavier diesel and fuel oil above that. Diesel can fall in either of the last two.
3. **It repeats until the answer stops changing.** The expansion depends on the density at 15°C, which is the very thing being looked for, so the sum is repeated until it settles.

It accepts a hydrometer reading from 653 to 1075 kg/m³ and a temperature from -18 to 95 °C. For anything outside that, use the printed table.

## How close is it to the printed table?

In our own checks the calculator matched 12 published Table 53B values to within 0.1 kg/m³. They run from 737 to 842 kg/m³ and from 9 to 30.5 °C, across the petrol range, the transition zone and the kerosene and diesel ranges. We also compared the fuel expansion step with 43 published volume correction factors, for fuels of 730, 800 and 840 kg/m³ at -40 to 41 °C, and every one agreed to within the rounding of the four decimals printed. This is a note of our testing, not a promise, and the printed table decides.

Below are three illustrations. The readings are made up and the results come from this calculator, not from the printed table. Your own readings, your own table.

| Hydrometer reading | Temperature | Invoice density at 15°C | Calculator gives, at 15°C | Gap | Within 3.0? |
|---|---|---|---|---|---|
| 752.0 kg/m³ | 29 °C | 763.0 kg/m³ | 764.3 kg/m³ | +1.3 | Yes |
| 742.5 kg/m³ | 27 °C | 750.0 kg/m³ | 753.1 kg/m³ | +3.1 | No, but close: confirm in the printed table |
| 828.0 kg/m³ | 31 °C | 837.5 kg/m³ | 839.1 kg/m³ | +1.6 | Yes |

Three limits to know:

- **The printed table shows one decimal.** The last digit can differ between the calculator and the book.
- **The edition matters.** MDG names Table 53B and no edition. Table 53B comes from the 1980 ASTM tables, and a newer ASTM edition (2004) leaves out the glass correction and expects it to be made before use. This is general information, not MDG text. Check the current edition with your oil company. If it or an inspector works from another edition or its own software, its figure decides.
- **A wrong reading gives a wrong answer.** The result is only as good as the hydrometer and thermometer behind it. MDG asks for both to be calibrated and kept in working order {{1.5(vi)}}.

## What to do with the answer

- **Tanker compartment:** compare with the invoice density. A gap of up to 3.0 kg/m³ either way meets the check {{1.2(iv)}}. If you doubt the quality of the product, MDG says to contact the supply location or the area field officer for further instructions {{1.2(ix)}}. Confirm with your oil company how it wants a compartment outside the limit handled.
- **Morning and after-tanker entries:** write the 15°C figure in the density register {{1.4.1(c)}} {{1.2(xiv)}}. MDG treats a missing reference density at inspection as a major irregularity {{8.3}}, and sales and supplies of all products are suspended at once while samples are tested {{5.1.9}}. The actions in Chapter 8 are the minimum, and the oil company may take higher action {{8.5.1}}. The oil company has to establish an irregularity before it acts against a dealer {{8.5.2}}. See the [penalties page](@penalties).
- **A figure far from normal:** MDG's table of lab tests lists the density limits for fuel at 15°C: petrol 720–775 kg/m³, diesel 810–845 kg/m³ and biodiesel blends 820–860 kg/m³ {{7.6}}. The diesel figure carries a note: for fuel from Assam crude, any relaxation of the range, and its time frame, may follow notifications of the Government of India {{7.6}}. Behind these figures are the Indian Standards IS 2796, IS 17586 and IS 17021 for petrol, IS 1460 for diesel and IS 16531 for biodiesel blends. They are revised from time to time, so check the current version. A result well outside the limits is a reason to read the hydrometer and thermometer again. See [density range](@density-range).

This calculator is a helper. The printed ASTM table, or your oil company's own calculation, decides.
