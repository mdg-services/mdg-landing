import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon";
import { useT } from "../i18n";
import { EASE } from "../lib/anim";
import { onCallChoiceRequested, requestAssistCall, requestCallChoice } from "../lib/assistCall";
import { TOLL_FREE } from "../lib/tollFree";
import { ASSIST_BOT_SRC } from "./assist/assets";

/**
 * "Call us", everywhere on the site: a handset that never scrolls away, and
 * the two calls it offers.
 *
 * ── Why two calls ──────────────────────────────────────────────────────────
 *
 * The toll-free line puts the dealer through to a person on his own phone,
 * which is what most dealers mean by "call". The assistant's call happens in
 * the tab and needs no phone at all, which is what a visitor at a desk wants.
 * Both are free to him, so the sheet offers both rather than guessing.
 *
 * ── Why the handset floats ─────────────────────────────────────────────────
 *
 * On a phone the page's own "Call us" sits in the hero and is gone after the
 * first scroll; the assistant's launcher stays, but it reads as "ask a
 * question". So a labelled handset stays in the same corner: stacked above the
 * launcher on a phone, where the thumb already is, and in the opposite corner
 * on a desktop, where the assistant's card opens over the launcher's corner.
 *
 * ── `?call=1` ──────────────────────────────────────────────────────────────
 *
 * The film pages send "talk to us now" here. A phone will not dial or play a
 * voice for a page that merely loaded, so the sheet opens on arrival and the
 * call itself is one tap.
 */
export default function CallSheet() {
  const t = useT();
  // Read once, as the page first draws; the address bar is tidied after.
  const [open, setOpen] = useState(hasCallParam);
  /** Came from a film page asking to talk: the handset says so until it is used. */
  const [arrived, setArrived] = useState(hasCallParam);
  const firstRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => onCallChoiceRequested(() => setOpen(true)), []);
  useEffect(dropCallParam, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const talkHere = () => {
    setOpen(false);
    setArrived(false);
    requestAssistCall();
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => {
            setArrived(false);
            requestCallChoice();
          }}
          aria-label={t.ui.callUsAria}
          className={
            "group fixed bottom-[88px] right-5 z-[60] inline-flex h-12 items-center gap-2 rounded-full bg-navy-700 pl-4 pr-5 " +
            "text-[15px] font-semibold text-white shadow-lift ring-2 ring-inset ring-gold-400/70 transition-transform duration-150 " +
            "hover:bg-navy-800 active:scale-95 sm:bottom-6 sm:left-6 sm:right-auto sm:h-14 sm:pl-5 sm:pr-6"
          }
        >
          {arrived && !stillMotion() && <span aria-hidden className="assist-halo" />}
          <Icon name="phone" size={18} aria-hidden className="text-gold-400" />
          <span>{arrived ? t.ui.callNow : t.ui.callUs}</span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="call-sheet"
            className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="absolute inset-0 bg-navy-950/60" onClick={close} aria-hidden />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="call-sheet-title"
              className="relative w-full max-w-md rounded-t-3xl bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 text-ink shadow-lift sm:rounded-3xl sm:p-7"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="call-sheet-title" className="text-[22px] font-bold leading-tight">
                    {t.ui.callSheetTitle}
                  </h2>
                  <p className="mt-1 text-[15px] text-ink-muted">{t.ui.callSheetLead}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.ui.closeSheet}
                  className="grid h-11 w-11 flex-none place-items-center rounded-full border border-ink-hairline text-ink-soft hover:bg-paper-warm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                <a
                  ref={firstRef}
                  href={TOLL_FREE.href}
                  onClick={() => setArrived(false)}
                  className="flex items-center gap-4 rounded-2xl bg-navy-700 px-4 py-4 text-white transition-colors hover:bg-navy-800"
                >
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-gold-400 text-navy-950">
                    <Icon name="phone" size={22} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-navy-100">{t.ui.tollFree}</span>
                    <span className="block whitespace-nowrap text-[24px] font-bold leading-tight tracking-tight">
                      {TOLL_FREE.display}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-navy-100">{t.ui.tollFreeNote}</span>
                  </span>
                </a>

                <button
                  type="button"
                  onClick={talkHere}
                  className="flex items-center gap-4 rounded-2xl border border-ink-hairline bg-white px-4 py-4 text-left transition-colors hover:border-navy-300 hover:bg-navy-50"
                >
                  <img
                    src={ASSIST_BOT_SRC}
                    alt=""
                    aria-hidden
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-none select-none"
                    draggable={false}
                  />
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold">{t.ui.talkHere}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">{t.ui.talkHereNote}</span>
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function hasCallParam(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("call") === "1";
  } catch {
    return false;
  }
}

/** Drop `?call=1` once honoured, so a reload or a shared link does not reopen the sheet. */
function dropCallParam(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("call")) return;
    url.searchParams.delete("call");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  } catch {
    /* a locked-down browser: the parameter simply stays */
  }
}

function stillMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
