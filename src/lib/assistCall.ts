/**
 * "Call us" from anywhere on the page.
 *
 * The site used to print a toll-free number in seven places. It now offers the
 * call itself: the assistant is already on every page, already knows how to
 * hold a spoken conversation, and a call that starts in the tab costs the
 * visitor nothing and reaches somebody who can answer straight away.
 *
 * The signal is a plain DOM event rather than a store or a context. The
 * assistant panel is behind a `lazy()` boundary that most visitors never load,
 * and a shared context would drag it into the main bundle — which is exactly
 * the kilobyte-on-2G cost the widget is built to avoid. An event costs nothing
 * and reaches a listener that may not exist yet.
 */

export const ASSIST_CALL_EVENT = "mdg:assist-call";

/**
 * Ask the assistant to open and start dialling.
 *
 * Safe to call before the widget has mounted and safe to call twice: the
 * widget de-duplicates, and a call already in progress simply stays up.
 */
export function requestAssistCall(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ASSIST_CALL_EVENT));
}

/** Listen for the above. Returns the unsubscribe, for an effect's cleanup. */
export function onAssistCallRequested(handler: () => void): () => void {
  window.addEventListener(ASSIST_CALL_EVENT, handler);
  return () => window.removeEventListener(ASSIST_CALL_EVENT, handler);
}
