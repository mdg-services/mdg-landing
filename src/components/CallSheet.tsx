"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Icon from "./Icon";
import { useT } from "../i18n/client";
import { usePresence } from "../lib/usePresence";
import { useOnGuides } from "../lib/onGuides";
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
  const onGuides = useOnGuides();
  // `?call=1` is read once, as the page first draws; the address bar is tidied
  // after. The server render never sees it (it renders the closed sheet), and
  // useSyncExternalStore lets the browser switch to the open one without a
  // hydration mismatch.
  const asked = useSyncExternalStore(subscribeNever, hasCallParam, () => false);
  const [dismissed, setDismissed] = useState(false);
  const [opened, setOpened] = useState(false);
  const open = opened || (asked && !dismissed);
  const setOpen = useCallback((next: boolean) => {
    setOpened(next);
    if (!next) setDismissed(true);
  }, []);
  /** Came from a film page asking to talk: the handset says so until it is used. */
  const [arrivedGone, setArrivedGone] = useState(false);
  const arrived = asked && !arrivedGone;
  const clearArrived = () => setArrivedGone(true);
  const firstRef = useRef<HTMLAnchorElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  /** The floating handset, unmounted while the sheet is open: focus comes back to it. */
  const floatRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => onCallChoiceRequested(() => setOpen(true)), [setOpen]);
  useEffect(dropCallParam, []);

  const close = useCallback(() => setOpen(false), [setOpen]);

  /* ── While open: the keyboard stays inside, the page holds still, and the
     assistant's card does not open itself behind it ─────────────────────── */
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const body = document.body;
    const overflow = body.style.overflow;
    body.style.overflow = "hidden";
    body.dataset.callSheet = "open";
    firstRef.current?.focus({ preventScroll: true });
    // Capture phase on document: the sheet is the top dialog, so its Escape and
    // Tab must not reach the assistant panel's own handler (also on document).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      const el = dialogRef.current;
      if (e.key !== "Tab" || !el) return;
      e.stopPropagation();
      const focusable = el.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !el.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !el.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      body.style.overflow = overflow;
      delete body.dataset.callSheet;
      // Back to whatever opened it; the floating handset is re-created on
      // close, so an opener that was the old handset (or nothing, on a
      // ?call=1 arrival) falls back to the new one.
      // Synchronous on purpose: the assistant panel, when "talk here" opens it
      // in this same commit, takes the focused element as its own opener.
      // eslint-disable-next-line react-hooks/exhaustive-deps -- the NEW handset is wanted, not the one at open
      const back = opener && opener !== document.body && opener.isConnected ? opener : floatRef.current;
      back?.focus({ preventScroll: true });
    };
  }, [open, close]);

  /* ── Android's Back closes the sheet instead of leaving the site ───────── */
  useEffect(() => {
    if (!open) return;
    let popped = false;
    try {
      window.history.pushState({ ...(window.history.state || {}), callSheet: true }, "");
    } catch {
      return;
    }
    const onPop = () => {
      popped = true;
      close();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // closed some other way: take back the entry the sheet added
      if (!popped && window.history.state?.callSheet) window.history.back();
    };
  }, [open, close]);

  // The sheet stays on the page for its closing animation (0.32 s) after `open` is false.
  const { mounted, leaving } = usePresence(open, 320);

  const talkHere = () => {
    setOpen(false);
    clearArrived();
    requestAssistCall();
  };

  return (
    <>
      {!open && (
        <button
          ref={floatRef}
          type="button"
          onClick={() => {
            clearArrived();
            requestCallChoice();
          }}
          aria-label={`${arrived ? t.ui.callNow : t.ui.callUs}, ${t.ui.callUsNote}`}
          className={
            "group fixed bottom-[88px] right-5 z-[60] inline-flex h-12 items-center gap-2 rounded-full bg-navy-700 pl-4 pr-5 " +
            "text-[15px] font-semibold text-white shadow-lift ring-2 ring-inset ring-gold-400/70 transition-transform duration-150 " +
            "hover:bg-navy-800 active:scale-95 sm:bottom-6 sm:left-6 sm:right-auto sm:h-14 sm:pl-5 sm:pr-6" +
            // A reading page on a phone: just the handset, so it covers less of the text.
            (onGuides ? " max-sm:w-12 max-sm:justify-center max-sm:px-0" : "")
          }
        >
          {arrived && !stillMotion() && <span aria-hidden className="assist-halo" />}
          <Icon name="phone" size={18} aria-hidden className="text-gold-400" />
          <span className={onGuides ? "max-sm:hidden" : undefined}>{arrived ? t.ui.callNow : t.ui.callUs}</span>
        </button>
      )}

      {mounted && (
          <div
            className="sheet-fade fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
            data-leaving={leaving ? "" : undefined}
          >
            <div className="absolute inset-0 bg-navy-950/60" onClick={close} aria-hidden />
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="call-sheet-title"
              className="sheet-rise relative w-full max-w-md rounded-t-3xl bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 text-ink shadow-lift sm:rounded-3xl sm:p-7"
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
                  onClick={clearArrived}
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
                  <Image
                    src={ASSIST_BOT_SRC}
                    alt=""
                    unoptimized
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
            </div>
          </div>
        )}
    </>
  );
}

/** The address bar is read once and never changes under us, so there is nothing to subscribe to. */
function subscribeNever(): () => void {
  return () => {};
}

let callParam: boolean | null = null;

/**
 * Whether the page was opened with `?call=1`. Read once and remembered: the
 * address bar is tidied straight after (`dropCallParam`), and the sheet must not
 * close itself because the parameter it opened for has gone.
 */
function hasCallParam(): boolean {
  if (callParam === null) {
    try {
      callParam = new URLSearchParams(window.location.search).get("call") === "1";
    } catch {
      callParam = false;
    }
  }
  return callParam;
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
