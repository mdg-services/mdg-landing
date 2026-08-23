import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useT } from "../../i18n";
import { ASSIST_BOT_SRC } from "./assets";

/**
 * The launcher, and nothing else.
 *
 * This is the only part of the assistant that ships in the main bundle, and
 * it is deliberately tiny: a button, a label and a `lazy()` call. The visitor
 * this site is built for is a pump owner on a low-end Android phone on 2G,
 * and they should not pay a single kilobyte for a feature they never tap.
 *
 * The panel, the recorder and `socket.io-client` are three separate
 * downloads, fetched in that order only as far as the visitor actually goes:
 * opening the panel does not fetch the call, and loading the page does not
 * fetch the panel.
 *
 * ── Why it opens itself, and only on a big screen ──────────────────────────
 *
 * The whole point of this assistant is that a dealer asks it instead of
 * ringing the office, and nobody asks a button they did not notice. So on a
 * desktop, where the panel is a card in the corner and the page carries on
 * behind it, it opens on its own a moment after the page has settled.
 *
 * On a phone it does not, and that is a deliberate choice rather than a
 * shortcut. The mobile panel is the whole screen: it covers the pitch, it
 * locks the page behind it so nothing scrolls, and it takes the keyboard.
 * Opening that on arrival would make "close this" the first thing a visitor
 * has to do, and it would pull the panel chunk and the config request down
 * over 2G before the hero has even painted. Instead the phone gets a louder
 * launcher: the same round button with one line of invitation beside it.
 *
 * Either way, closing it means closing it. The dismissal is remembered for
 * the tab, so moving between the landing page and the enrolment form does not
 * re-open what somebody has already waved away.
 */

const AssistPanel = lazy(() => import("./AssistPanel"));

/** Remembered per tab. Not per browser: a new visit is a new conversation. */
const DISMISS_KEY = "mdg-assist-dismissed";
/**
 * Long enough for the hero to paint, short enough that the panel is part of
 * arriving rather than an interruption a second later.
 */
const AUTO_OPEN_MS = 1_000;
/** Tailwind's `sm`. Below this the panel is a full sheet, not a card. */
const CARD_WIDTH_PX = 640;

export default function AssistWidget() {
  const t = useT();
  const [open, setOpen] = useState(false);
  /**
   * True only while the panel is showing because it opened itself. It decides
   * whether the panel grabs the keyboard and claims to be modal, because a
   * dialog nobody asked for must do neither.
   */
  const [uninvited, setUninvited] = useState(false);
  const [dismissed, setDismissed] = useState(() => wasDismissed());

  useEffect(() => {
    // Read straight from storage rather than from state, so this effect has
    // nothing to depend on and runs exactly once, on arrival.
    if (wasDismissed() || window.innerWidth < CARD_WIDTH_PX) return;
    const id = window.setTimeout(() => {
      setOpen(true);
      setUninvited(true);
    }, AUTO_OPEN_MS);
    return () => window.clearTimeout(id);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setUninvited(false);
    setDismissed(true);
    remember();
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }
    setOpen(true);
    setUninvited(false);
  }, [open, close]);

  // The invitation is for the phone, where nothing opens by itself. It is
  // part of the button rather than a bubble beside it, so there is one tap
  // target and it does one thing.
  const inviting = !open && !dismissed;

  return (
    <>
      <button
        type="button"
        aria-label={open ? t.assist.launcher.close : t.assist.launcher.aria}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggle}
        className="group fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full transition-transform duration-150 active:scale-95 sm:bottom-6 sm:right-6"
      >
        {inviting && (
          <span className="max-w-[62vw] truncate rounded-full border border-ink-hairline bg-white px-3.5 py-2 text-[13px] font-semibold leading-none text-ink shadow-card sm:hidden">
            {t.assist.launcher.invite}
          </span>
        )}
        {/* The launcher gives the panel its shape: it squashes as the card
            comes out of this corner, so the two read as one movement rather
            than as a button and a card that happen to be next to each other. */}
        <span
          key={open ? "open" : "shut"}
          className={
            "relative grid h-14 w-14 place-items-center rounded-full shadow-lift ring-2 ring-inset ring-gold-400/70 transition-colors duration-200 " +
            // Shut, the button is the assistant's face on a white disc. Open,
            // it goes back to being a navy close button, so the X is never
            // asked to carry a face's worth of detail at 22px.
            (open
              ? "bg-navy-700 text-white group-hover:bg-navy-800 assist-launch"
              : "bg-white group-hover:bg-navy-50")
          }
        >
          {/* A gold ring that swells out of the button, three times, then
              rests. Three is enough to catch an eye and few enough not to
              become a blinking thing in the corner of somebody's reading. */}
          {inviting && !stillMotion() && <span aria-hidden className="assist-halo" />}
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            /* Eager, not lazy: this is the one image on the page that has to
               be there the moment the corner is looked at. */
            <img
              src={ASSIST_BOT_SRC}
              alt=""
              aria-hidden
              width={44}
              height={44}
              decoding="async"
              /* 44 inside a 52px well (the ring eats 2px a side). Any larger
                 and the bubble's own blue ring kisses the gold one and the
                 button reads as two rings rather than as a face. */
              className="h-11 w-11 select-none"
              draggable={false}
            />
          )}
        </span>
      </button>

      {open && (
        <Suspense
          fallback={
            <p
              role="status"
              className="fixed bottom-24 right-5 z-[70] rounded-full border border-ink-hairline bg-white px-4 py-2 text-[13px] text-ink-muted shadow-card sm:right-6"
            >
              {t.assist.panel.loading}
            </p>
          }
        >
          <AssistPanel onClose={close} takeFocus={!uninvited} />
        </Suspense>
      )}
    </>
  );
}

/** Storage can throw outright in a locked-down browser, so every read is a try. */
function wasDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function remember() {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* a private window that will not store: it simply asks again next page */
  }
}

/** True when the reader has asked their system for less movement. */
function stillMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
