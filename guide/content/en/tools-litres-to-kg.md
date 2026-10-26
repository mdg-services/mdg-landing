---json
{
  "title": "Litres to kg for diesel and petrol: 1 litre diesel kitne kg",
  "metaTitle": "Litres to kg: diesel and petrol converter",
  "description": "Change litres to kg, or kg to litres, for diesel and petrol. A litre of diesel is about 0.83 kg. Type the density from your invoice for your own load.",
  "answer": "1 litre of diesel weighs about 0.83 kg and 1 litre of petrol about 0.75 kg. The exact figure comes from the density: kg = litres × density (kg/m³) ÷ 1,000. The Marketing Discipline Guidelines 2024 (MDG 2024), the oil companies' rules for their dealers, list diesel at 810 to 845 kg/m³ and petrol at 720 to 775 kg/m³ at 15°C {{7.6}}. That is 0.810 to 0.845 kg a litre for diesel and 0.720 to 0.775 kg for petrol.",
  "faq": [
    { "q": "1 litre diesel kitne kg hota hai?", "a": "About 0.83 kg. MDG 2024 puts diesel at 810 to 845 kg/m³ at 15°C, so a litre weighs 0.810 to 0.845 kg {{7.6}}. The density on your invoice gives the exact figure for your load." },
    { "q": "1 litre petrol weight in kg?", "a": "About 0.75 kg. MDG 2024 puts petrol at 720 to 775 kg/m³ at 15°C, so a litre weighs 0.720 to 0.775 kg {{7.6}}." },
    { "q": "Diesel kg to litre: how do I convert?", "a": "Multiply the kg by 1,000 and divide by the density. For example, 4,150 kg at 830 kg/m³ is 4,150 × 1,000 ÷ 830 = 5,000 litres." },
    { "q": "Diesel density kg to liter: which density do I use?", "a": "The density at 15°C on your invoice or in your density register. With the box empty, the tool uses the middle of the MDG range {{7.6}}, which is only a guide." },
    { "q": "Does temperature change how much a litre weighs?", "a": "Yes, slightly. General knowledge, not MDG text: fuel expands when it warms, so a warm litre holds a little less fuel, and weighs a little less, than a litre at 15°C." },
    { "q": "Does the converter save what I type?", "a": "No. The sum is worked out on your own phone or computer, and nothing you type is stored or sent." }
  ],
  "related": ["tools-density-at-15", "density-range", "density-temperature", "product-names"],
  "updated": "2026-10-26"
}
---
Change litres to kg, or kg to litres, for diesel (HSD) or petrol (MS).

## Convert litres and kg

<div class="tool" id="lk">
<label for="lk-f">Fuel</label>
<select id="lk-f"><option value="0">Diesel (HSD)</option><option value="1">Petrol (MS)</option></select>
<label for="lk-m">Convert</label>
<select id="lk-m"><option value="l2k">Litres to kg</option><option value="k2l">kg to litres</option></select>
<label for="lk-a">Quantity (litres, KL or kg)</label>
<input id="lk-a" type="text" inputmode="decimal" autocomplete="off" value="1" placeholder="for example 5,000 or 12 KL">
<label for="lk-d">Density at 15°C (kg/m³), optional<small>From your invoice or density register. Left empty, the middle of the MDG range for the fuel is used.</small></label>
<input id="lk-d" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 827.5">
<button type="button" id="lk-go">Convert</button>
<div class="out" id="lk-out" role="status" aria-live="polite">Press the button to see what 1 litre of diesel weighs, or change the boxes first.</div>
<noscript><p>This converter needs JavaScript. The sum: kg = litres × density (kg/m³) ÷ 1,000.</p></noscript>
</div>

## How the sum works

Density is the weight of 1,000 litres (one cubic metre) in kg. At a density of 830, 1,000 litres weigh 830 kg. So:

- **Litres to kg:** litres × density ÷ 1,000.
- **kg to litres:** kg × 1,000 ÷ density.

For example (a made-up load): 5,000 litres of diesel at 830 kg/m³ weigh 5,000 × 830 ÷ 1,000 = 4,150 kg. Going back, 4,150 × 1,000 ÷ 830 = 5,000 litres.

Use the density at 15°C from your invoice or [density register](@density-register). If the box is empty, the tool uses the middle of the range MDG 2024 lists {{7.6}}: 827.5 for diesel, 747.5 for petrol. To bring a hydrometer reading to 15°C first, use the [density at 15°C calculator](@tools-density-at-15).

## Weight in kg across the MDG range

The column heads are densities at 15°C in kg/m³ {{7.6}}. Diesel here is BS VI diesel up to B7; biodiesel blends B8 to B20 run 820 to 860 {{7.6}}.

| Litres | Diesel 810 | Diesel 827.5 | Diesel 845 | Petrol 720 | Petrol 747.5 | Petrol 775 |
|---|---|---|---|---|---|---|
| 1 | 0.81 | 0.8275 | 0.845 | 0.72 | 0.7475 | 0.775 |
| 10 | 8.1 | 8.275 | 8.45 | 7.2 | 7.475 | 7.75 |
| 100 | 81 | 82.75 | 84.5 | 72 | 74.75 | 77.5 |
| 1,000 | 810 | 827.5 | 845 | 720 | 747.5 | 775 |

> **Note:** a litre is a volume, so it shifts with temperature, and the result is close rather than exact. For what the ranges mean, see the [density range](@density-range) page.
