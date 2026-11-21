# Odia meaning check: pricing, refund, shipping, terms, register terms, 4 guide pages, 2 pump-guide pages

For the native Odia reviewer. Date of check: 21 Nov 2026.

## How the check was done

Each Odia file was read first, without the English open, and written out as a plain English back-translation. Only then was the English source opened and compared sentence by sentence. The focus was on things that cost a dealer money or trust: numbers, day counts, amounts, conditions (if / unless / only), negations ("do not"), who pays, who must act, refund and cancellation rules, deadlines, promises, and legal duties. Style was ignored.

As a second check, every number in each Odia file was compared with the English file by a script. All numbers match. The only gaps are harmless: "1st / 2nd / 3rd" written as words in Odia, and the title of the petrol density page repeating "15°C 720-775".

Files covered (11): pricing, refund, shipping, terms, the `terms` list in register, and the guide pages penalties, density-petrol, stock-variation, inspection, and the pump-guide pages money and dealership-eligibility.

## Changes made

The checker made none. Afterwards two wording doubts (items 1 and 2 below) were fixed by hand: refund.ts now says "...ଭୁଲରେ କଟିଥିଲେ କିମ୍ବା ଏହା ଆପଣଙ୍କ ପ୍ରଥମ ମାସ ହୋଇଥିଲେ ଛଡ଼ା" (an exception, "except when charged in error or it is the first month"), and terms.ts says the access can be paused "ଅସ୍ଥାୟୀ ଭାବେ" (temporarily). Item 3 is a difference in the English texts themselves and was left alone.

Original result of the checker: none. In every file the Odia carries the same meaning as the English on amounts, days, conditions, refund rules, who pays and who acts. No Odia file was edited.

| File | Odia before | Odia now | Why |
|---|---|---|---|
| (none) | | | |

## Unsure items (for a native reader to confirm)

None of these changes a number or reverses a rule. Each is a place where the wording might be read in a way the English does not intend.

| # | File | Odia sentence | English | Doubt |
|---|---|---|---|---|
| 1 | `src/i18n/or/refund.ts` (section "How to cancel", closing paragraph) | ଆରମ୍ଭ ହୋଇସାରିଥିବା ମାସର କିଛି ଅଂଶ ଆମେ ଫେରାଉ ନାହିଁ, ଯଦି ନ ହୁଏ ଯେ ତାହା ଭୁଲରେ କଟିଛି, କିମ୍ବା ତାହା ଆପଣଙ୍କ ପ୍ରଥମ ମାସ (ତଳେ ଦେଖନ୍ତୁ)। | We do not refund part of a month that has begun, unless it was charged in error or it is your first month (see below). | The "ଯଦି ନ ହୁଏ ଯେ" ("if it is not the case that") is clumsy for "unless". A reader could take it the wrong way round, as if the exceptions were conditions for NOT refunding. This is a refund rule, so a plain "ଛଡ଼ା" ("except when it was charged in error or is the first month") may be safer. |
| 2 | `src/i18n/or/terms.ts` (section 5, payment, fourth point) | ... ପେମେଣ୍ଟ ନ ହେବା ପର୍ଯ୍ୟନ୍ତ ଆପଣଙ୍କ ଆକ୍ସେସ ବନ୍ଦ କରିପାରିବୁ। | ... we may pause your access until it is paid. | Two doubts. (a) "ନ ହେବା ପର୍ଯ୍ୟନ୍ତ" is meant as "until it is paid", but it can also read as "for as long as it is not paid". Both mean about the same here, but "ହେବା ପର୍ଯ୍ୟନ୍ତ" is plainer. (b) ବନ୍ଦ is "stop / close", the English says "pause". "ଅସ୍ଥାୟୀ ଭାବେ ବନ୍ଦ" would match better. |
| 3 | `src/i18n/or/terms.ts` section 11 versus the `terms` list in `src/i18n/or/register.ts` (last clause) | Terms page: ଗୁରୁଗ୍ରାମ, ହରିୟାଣାର ଅଦାଲତ. Register clause 10: ଦିଲ୍ଲୀର ଅଦାଲତ. | Terms page: courts at Gurugram, Haryana. Register clause 10: courts at Delhi. | Not a translation fault. The Odia copies the English faithfully, and the two English texts name different cities. The owner should confirm which court applies to which document. It matters if a dispute ever reaches court. |
| 4 | `guide/content/or/stock-variation.md` (table "The allowances you can count" and nearby text) | "ଅନୁମତି" used for "allowance", for example ଆପଣ ଯେଉଁ ଅନୁମତି ଗଣିପାରିବେ, ଅନ୍ୟ ଅନୁମତି, ଅନୁମତି ସୀମା | "allowances you can count", "other allowances", "permissible limit" | ଅନୁମତି usually means "permission". For a stock figure that is subtracted from the loss, a word like ଛାଡ଼ ("relief / margin") may be clearer to a dealer. One word is used for two ideas (allowance and permitted limit). The numbers and the worked example (600 x 0.75% + 200 x 0.60% = 5.7 KL) are correct. |
| 5 | `src/i18n/or/shipping.ts` (good to know, third point) | ... ଆମେ ଦେଖିନେବୁ। | ... and we will sort it out. | "ଦେଖିନେବୁ" is "we will have a look / see to it". "Sort it out" promises a fix. Slightly softer in Odia. The promise is not removed. |

## Also noted (not an Odia problem)

- The English pricing page still carries a note that "for one outlet" is the writer's own reading of the price (the file's header comment marks it as an open item for the owner). The Odia says "for one outlet" as well, so Odia and English agree. The owner should still confirm that the Rs 3,000 is per outlet.
- The Odia terms page and register clauses say the Odia is only a convenience and the English binds. The wording of that notice was not part of this check.
