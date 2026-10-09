/**
 * The toll-free line, and the only place on the site that knows it.
 *
 * In August 2026 the number left the page entirely and every "Call us" started
 * the assistant's spoken call instead. It came back in October because a
 * dealer who has just watched the film wants a person on the line, and a
 * number his phone can dial is the shortest way to one. It still lives here,
 * behind the call choice (`components/CallSheet.tsx`), rather than in BRAND,
 * so it cannot creep back onto the page as loose text.
 *
 * The confirmation email prints the same number from `server/emails/layout.ts`.
 */
export const TOLL_FREE = {
  /** As printed. Non-breaking hyphens keep it on one line on a narrow phone. */
  display: "1800‑891‑3496",
  href: "tel:18008913496",
} as const;
