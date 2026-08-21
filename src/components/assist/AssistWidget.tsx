import { Suspense, lazy, useState } from "react";
import { useT } from "../../i18n";

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
 */

const AssistPanel = lazy(() => import("./AssistPanel"));

export default function AssistWidget() {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? t.assist.launcher.close : t.assist.launcher.aria}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full bg-navy-700 px-4 py-3 text-[14px] font-semibold text-white shadow-lift transition-colors duration-200 hover:bg-navy-800 sm:bottom-6 sm:right-6"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          {open ? (
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M21 12a8 8 0 0 1-8 8H8l-4 3 1-4.6A8 8 0 1 1 21 12z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        {t.assist.launcher.label}
      </button>

      {open && (
        <Suspense
          fallback={
            <p
              role="status"
              className="fixed bottom-20 right-5 z-[70] rounded-full border border-ink-hairline bg-white px-4 py-2 text-[13px] text-ink-muted shadow-card sm:bottom-24 sm:right-6"
            >
              {t.assist.panel.loading}
            </p>
          }
        >
          <AssistPanel onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
