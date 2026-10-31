---json
{
  "title": "Diesel and petrol density chart by temperature: 15°C, 30°C, 35°C and 40°C",
  "metaTitle": "Diesel density chart by temperature (15–45°C)",
  "description": "Type the density at 15°C and see what a hydrometer reads at 10 to 45°C for diesel or petrol, worked out from ASTM Table 53B. A helper, not a printed chart.",
  "answer": "Type the density at 15°C and the tool shows what a hydrometer reads in a sample at 10 to 45°C, by running the ASTM Table 53B conversion backwards. Fuel gets lighter as it warms: for example, a diesel of 830.0 kg/m³ at 15°C reads 819.5 at 30°C. The Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers, compare density at 15°C {{1.2(iv)}}, so a hot or cold reading is converted before it is compared.",
  "faq": [
    { "q": "Diesel density at 30 deg C: what will the hydrometer read?", "a": "It depends on the density at 15°C. For example, a diesel of 830.0 kg/m³ at 15°C reads about 819.5 at 30°C and 812.5 at 40°C. Type your own density in the tool." },
    { "q": "Petrol density at 40 °C?", "a": "For example, a petrol of 747.5 kg/m³ at 15°C reads about 725.2 at 40°C. In these examples petrol loses more per °C than diesel does." },
    { "q": "Is there a diesel density chart with temperature in a PDF?", "a": "MDG prints none. It requires every dealer to hold the ASTM density conversion table {{1.5(vi)}} and names Table 53B for the tanker check {{1.2(iv)}}. This tool works the values out for your density instead of copying a table." },
    { "q": "Why does the hydrometer read lower in hot weather?", "a": "Fuel expands as it warms, so the same fuel weighs less per litre. MDG compares density at 15°C {{1.2(iv)}}, so a hot-day reading is converted before it is compared." },
    { "q": "At what temperature is the density recorded in the register?", "a": "At 15°C. The morning density from the pump nozzle {{1.4.1(c)}} and the density after each tanker {{1.2(xiv)}} are both recorded at 15°C." },
    { "q": "Is this table the final answer?", "a": "No. If it differs from the printed ASTM table, the table decides {{1.2(iv)}} {{1.5(vi)}}. If your oil company gives another figure, ask which one to use." }
  ],
  "related": ["tools-density-check", "tools-density-at-15", "density-temperature", "density-range", "density-register"],
  "updated": "2026-10-31"
}
---
This is the [density at 15°C calculator](@tools-density-at-15) run the other way: from the density at 15°C to what the hydrometer shows.

## What the hydrometer reads at each temperature

<div class="tool" id="dh">
<p style="margin:0 0 4px"><b>A helper only.</b> The printed ASTM Table 53B, or the figure your oil company works out, decides.</p>
<label for="dh-f">Fuel</label>
<select id="dh-f"><option value="d">Diesel (HSD)</option><option value="p">Petrol (MS)</option></select>
<label for="dh-d">Density at 15°C (kg/m³)</label>
<input id="dh-d" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 830">
<label for="dh-t">Another temperature (°C), optional</label>
<input id="dh-t" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 32">
<button type="button" id="dh-go">Show the table</button>
<div class="out" id="dh-out" role="status" aria-live="polite">Type the density at 15°C and press the button.</div>
<noscript><p>This tool needs JavaScript. Use the printed ASTM Table 53B instead.</p></noscript>
</div>

## How to read it

The hydrometer shows the density of the sample at the sample's own temperature. MDG compares density at 15°C {{1.2(iv)}}, and the morning density you record is also the figure at 15°C {{1.4.1(c)}}. So a reading taken warm is converted with the ASTM table, which every dealer must hold {{1.5(vi)}}.

The table here goes the other way. If the invoice says 830.0 at 15°C and your sample is at 30°C, the hydrometer should read near 819.5. A reading far from that means look again at the hydrometer and the thermometer.

For example, with made-up densities at 15°C:

| Sample temperature | Diesel 830.0 | Petrol 747.5 |
|---|---|---|
| 10 °C | 833.5 | 751.9 |
| 15 °C | 830.0 | 747.5 |
| 20 °C | 826.5 | 743.1 |
| 25 °C | 823.0 | 738.6 |
| 30 °C | 819.5 | 734.2 |
| 35 °C | 816.0 | 729.7 |
| 40 °C | 812.5 | 725.2 |
| 45 °C | 808.9 | 720.7 |

> **Note:** these are worked out by the tool, not copied from the ASTM table. The last digit can differ from the printed table, and the table decides.

The limits for a tanker check are on the [invoice density check](@density-invoice-check) page, and why the same fuel reads differently by time of day is on [density and temperature](@density-temperature).
