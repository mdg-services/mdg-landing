/**
 * The {{…}} tags a page's Markdown may carry, drawn as small chips after the
 * Markdown becomes HTML, and the MDG penalty note.
 *
 *  - MDG: a clause of the guideline. {{5.1.9}} -> "MDG 5.1.9", {{2012:8.3}} ->
 *    "MDG 2012 8.3", {{circular}} -> "Circular 20.03.2025", {{annexure 1}} ->
 *    "MDG Annexure 1", words -> "MDG 2024, cover page".
 *  - Khata Kavach: the source of a fact, written out: {{Limitation Act 1963,
 *    Art. 14}}, {{MSMED Act 2006, s.16}}. Drawn as written.
 *
 * Pure string work: no React, no Node APIs.
 */
import type { Lang } from "./collection";

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** {{5.1.9}} -> a clause tag. */
export function mdgClauseTags(html: string, lang: Lang): string {
  return html.replace(/\{\{([^}]+)\}\}/g, (_, raw: string) => {
    const t = raw.trim();
    let label: string;
    if (/^circular$/i.test(t)) label = lang === "hi" ? "सर्कुलर 20.03.2025" : "Circular 20.03.2025";
    else if (t.startsWith("2012:")) label = `MDG 2012 ${t.slice(5)}`;
    else if (/^annexure/i.test(t)) label = `MDG Annexure ${t.replace(/^annexure\s*/i, "")}`;
    else if (/^[0-9]/.test(t)) label = `MDG ${t}`;
    // Words, not a clause number: "cover page", "introduction", "chapter 6, item 4"
    else label = `MDG 2024, ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
    return `<span class="cl">${esc(label)}</span>`;
  });
}

export function mdgTagOk(tag: string): boolean {
  return /^(2012:)?[0-9A-Za-z.()–\-, ]+$|^circular$|^annexure [0-9a-z]+$|^penalty-note$/i.test(tag.trim());
}

/**
 * The compact note a penalty page can ask for with `{{penalty-note}}` on a
 * line of its own: the three qualifiers that belong beside every penalty
 * amount, in the page's language. The clause numbers are ordinary `{{…}}` tags,
 * so they draw as clause chips like every other reference (the words are the
 * content owner's, as shipped in the static pages on main).
 */
export const PENALTY_NOTE: Record<Lang, string> = {
  en: "These amounts are the minimum: the oil company may take higher action, up to termination {{8.5.1}}. An irregularity must be established first {{8.5.2}}. Instances are counted over five years, including the previous guideline {{8.5.5}}.",
  hi: "ये रकम कम से कम की कार्रवाई हैं: तेल कंपनी इससे ज़्यादा कार्रवाई कर सकती है, टर्मिनेशन तक {{8.5.1}}। कार्रवाई से पहले अनियमितता साबित होनी चाहिए {{8.5.2}}। गिनती पाँच साल की होती है, पिछली गाइडलाइन समेत {{8.5.5}}।",
};

export function mdgPenaltyNotes(md: string, lang: Lang): string {
  const box = `<aside class="penalty-note" lang="${lang}"><p>${esc(PENALTY_NOTE[lang])}</p></aside>`;
  return md.replace(/^[ \t]*\{\{\s*penalty-note\s*\}\}[ \t]*$/gim, `\n${box}\n`);
}

/** {{Limitation Act 1963, Art. 14}} -> a source chip, drawn as written. */
export function sourceTags(html: string): string {
  return html.replace(/\{\{([^}]+)\}\}/g, (_, raw: string) => `<span class="cl">${esc(raw.trim())}</span>`);
}

/** A source tag: letters, digits and plain punctuation, 2 to 60 characters. */
export function sourceTagOk(tag: string): boolean {
  return /^[\p{L}\p{N}\p{M} .,()'’&/:–-]{2,60}$/u.test(tag.trim());
}
