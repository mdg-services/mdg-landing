---json
{
  "title": "Is my density good? Check a petrol or diesel density against MDG 2024",
  "metaTitle": "Is my density good? Petrol and diesel checker",
  "description": "Type a petrol or diesel density such as 748 or 828 and see whether it is inside the MDG 2024 range at 15°C, with temperature conversion and an optional invoice check.",
  "answer": "Type the density from the board or the hydrometer, pick petrol or diesel, and the checker says whether it is inside the range of the Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers: petrol 720–775 kg/m³, diesel 810–845 (820–860 for B8–B20 blends), all at 15°C {{7.6}}. Add the temperature to convert a warm reading, and the invoice density to check the ±3.0 gap {{1.2(iv)}}. A helper only: the printed ASTM table decides {{1.2(iv)}} {{1.5(vi)}}.",
  "faq": [
    { "q": "Is diesel density 821, 824, 825 or 828 good or bad?", "a": "All four are inside both diesel ranges, 810–845 and 820–860, when they are the 15°C figure {{7.6}}. MDG ranks no figure inside a range above another." },
    { "q": "Is petrol density 748 or 750 good or bad?", "a": "Both are inside the petrol range, 720–775 kg/m³ at 15°C {{7.6}}. Neither is better or worse under MDG; for a tanker, the test is a match with the invoice within ±3.0 {{1.2(iv)}}." },
    { "q": "Is petrol density 742 or 760 okay?", "a": "Both are inside 720–775 as 15°C figures {{7.6}}. If a reading came from a warm sample, convert it first: 760.0 read at 35°C is 776.5 at 15°C, which is outside." },
    { "q": "How do I know if my diesel density is good?", "a": "Type it with the fuel and, if it was not read at 15°C, the temperature. Inside 810–845 (820–860 for B8–B20 blends) meets the range {{7.6}}; for a tanker, match the invoice within ±3.0 {{1.2(iv)}}." },
    { "q": "Which diesel range do I pick, up to B7 or B8–B20?", "a": "MDG lists both ranges but does not say which one your supply falls under {{7.6}}. Ask your oil company." },
    { "q": "Does the checker save or send what I type?", "a": "No. The check is worked out on your own phone or computer, and nothing you type is stored or sent." }
  ],
  "related": ["density-petrol", "density-diesel", "tools-density-at-15", "density-by-state", "density-range", "density-high-or-low"],
  "updated": "2026-10-31"
}
---
Check one density number against the ranges MDG 2024 lists {{7.6}} and, if you type it, against the invoice {{1.2(iv)}}.

## Check your density

<div class="tool" id="dc">
<p style="margin:0 0 4px"><b>A helper only.</b> The printed ASTM Table 53B, or the figure your oil company works out, decides.</p>
<label for="dc-f">Fuel</label>
<select id="dc-f"><option value="p">Petrol (MS)</option><option value="d">Diesel (HSD), up to B7</option><option value="b">Diesel blended with biodiesel, B8 to B20</option></select>
<label for="dc-d">Density you read (kg/m³)</label>
<input id="dc-d" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 828">
<label for="dc-t">Temperature of the same sample (°C), only if it was not read at 15°C</label>
<input id="dc-t" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 30">
<label for="dc-i">Invoice density at 15°C (kg/m³), only if you want to compare</label>
<input id="dc-i" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 831.5">
<button type="button" id="dc-go">Check my density</button>
<div class="out" id="dc-out" role="status" aria-live="polite">Pick the fuel, type the density and press the button.</div>
<noscript><p>This checker needs JavaScript. Use the ranges in the tables below and the printed ASTM table.</p></noscript>
</div>

## How to use it

1. Pick the fuel. For diesel, pick up to B7 or the B8–B20 blend; if you are not sure, ask your oil company.
2. Type the density you read. If it came from a hydrometer at a temperature other than 15°C, type that temperature too.
3. To compare with the invoice, type its 15°C density. Press the button.

## Common numbers people ask about

These are taken as densities at 15°C. The tables show only whether a number is inside the range {{7.6}}. MDG calls no number inside a range better than another.

| Diesel density at 15°C | Up to B7 (810–845) | B8–B20 blend (820–860) |
|---|---|---|
| 815 | Inside | Outside |
| 818 | Inside | Outside |
| 821 | Inside | Inside |
| 824 | Inside | Inside |
| 828 | Inside | Inside |
| 832 | Inside | Inside |
| 840 | Inside | Inside |
| 850 | Outside | Inside |

| Petrol density at 15°C | Petrol (720–775) |
|---|---|
| 742 | Inside |
| 745 | Inside |
| 748 | Inside |
| 750 | Inside |
| 755 | Inside |
| 760 | Inside |
| 770 | Inside |
| 780 | Outside |

## A number read at 30°C is not the 15°C figure

Warm fuel reads lower on the hydrometer, so convert before you compare {{1.2(iv)}}. For example (made-up samples, worked with the [15°C calculator](@tools-density-at-15)):

| Fuel | Hydrometer reads | Sample temperature | Density at 15°C | Against the range |
|---|---|---|---|---|
| Diesel | 818.0 | 30°C | 828.5 | Inside |
| Petrol | 742.0 | 35°C | 759.7 | Inside |
| Petrol | 760.0 | 35°C | 776.5 | Outside |

## What the checker uses

The ranges are petrol 720–775, diesel up to B7 810–845 and B8–B20 blends 820–860 kg/m³ at 15°C {{7.6}}, and the invoice limit is ±3.0 kg/m³ {{1.2(iv)}}. The conversion is the ASTM Table 53B working of the 15°C calculator. More on each fuel: [petrol density](@density-petrol), [diesel density](@density-diesel) and the [density range](@density-range).

A footnote to the 810–845 diesel range says a relaxation for fuel from Assam crude may follow Government notices. MDG prints no relaxed figure, and the checker applies none: ask your oil company {{7.6}}.

General practice, not an MDG rule: if a number is outside, read the hydrometer and the thermometer again. For a tanker you still doubt, MDG says to contact the supply location or the area field officer {{1.2(ix)}}.

> **Note:** a helper only. Every dealer must hold the printed ASTM table {{1.5(vi)}}, and where it differs from the checker, the table decides {{1.2(iv)}}.
