/**
 * One rule for a phone number on this site: the forms in the browser, the
 * assistant, and the server's own check all use it, so a number one of them
 * accepts is never turned back by another.
 *
 * The number has to be a 10-digit Indian mobile, the only kind the team rings
 * back and the only kind WhatsApp reaches. It may be typed however a person
 * types it: in Hindi digits (a Hindi keyboard gives ९४६७४६६९६३), or in the
 * digits of the other Indian scripts, with spaces, dashes, dots or brackets,
 * with +91 or 91 in front, or with the 0 used for calling from another state.
 *
 * The film pages carry their own copy of the same rule (src/film/player.ts),
 * because that script is built separately and kept small.
 */

/** A 10-digit Indian mobile number, as the team receives it. */
export const MOBILE_RE = /^[6-9]\d{9}$/;

/**
 * Where zero sits in each script whose digits a phone keyboard in India can
 * type: Latin, Arabic-Indic and Persian, Devanagari, Bengali, Gurmukhi,
 * Gujarati, Odia, Tamil, Telugu, Kannada, Malayalam, and the full-width digits
 * some keyboards send. Unicode keeps each script's ten digits together, zero
 * first. Listed rather than matched with `\p{Nd}`: that pattern is a syntax
 * error on older phone browsers and would stop the whole page's script.
 */
const ZEROS = [
  0x30, 0x660, 0x6f0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xff10,
];

/** Marks that only space a number out, and are dropped. */
const SEPARATORS = /[\s\-.()]/;

/**
 * The 10-digit mobile that `raw` names, or null when it names none.
 *
 * A letter or any other mark makes it null rather than being skipped:
 * "98765o4321" is a typo, and the person should be asked to look again.
 * A country code or the leading 0 comes off only when it is extra:
 * "9123456789" is itself a mobile number.
 */
export function toMobile(raw: string): string | null {
  let digits = "";
  for (const ch of raw) {
    const cp = ch.codePointAt(0) ?? 0;
    const zero = ZEROS.find((z) => cp >= z && cp <= z + 9);
    if (zero !== undefined) digits += String(cp - zero);
    else if (ch === "+") digits += ch;
    else if (!SEPARATORS.test(ch)) return null;
  }
  const local = digits.replace(/^(?:\+?91|0)(?=\d{10}$)/, "");
  return MOBILE_RE.test(local) ? local : null;
}

/**
 * Keep a phone box's own check in step with the rule, for a form that lets
 * the browser stop it and say what is wrong. Call it on every change to the
 * box. An empty box is left to `required`, which has its own message.
 * `message` is in the language on screen.
 */
export function checkMobileBox(box: HTMLInputElement, message: string): void {
  const value = box.value.trim();
  box.setCustomValidity(value === "" || toMobile(value) ? "" : message);
}

/**
 * A form's `onInput`: keeps the phone box called `name` in step with the rule
 * while the person types, so pressing Send on a wrong number stops at that box
 * with `message` instead of reaching the server.
 */
export function onMobileInput(name: string, message: string) {
  return (e: { target: EventTarget | null }) => {
    const box = e.target;
    if (box instanceof HTMLInputElement && box.name === name) checkMobileBox(box, message);
  };
}
