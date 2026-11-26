import { APP_STORE, APPLE_MARK_PATH, PLAY_MARK_PATHS, PLAY_STORE } from "../lib/appStores";

/**
 * The two ways to get the Dealer Kavach app: the App Store on an iPhone, Google
 * Play on an Android phone. Both always show, side by side, so a dealer never
 * has to guess which is his; each opens the store's own page, where he
 * installs the app and registers inside it. Nothing here collects anything.
 *
 * `from` tags the Play link, so Google Play's install figures show which part
 * of the site the install came from (`new_pump` for New Pump Guide, ADR 0058).
 * `stack` keeps the two buttons one above the other at every width, for a
 * narrow box such as the assistant's panel, where side by side they would not
 * fit even on a wide screen. The store names stay in English in both
 * languages: that is how each store prints them on a phone.
 */
export default function StoreButtons({
  from,
  appStoreAria,
  playAria,
  className = "",
  stack = false,
}: {
  /** A short word for where this row sits (home, footer, register …). */
  from: string;
  appStoreAria: string;
  playAria: string;
  className?: string;
  stack?: boolean;
}) {
  const play = new URL(PLAY_STORE);
  play.searchParams.set("referrer", `utm_source=website&utm_medium=store_button&utm_campaign=${from}`);
  const base =
    "group inline-flex min-h-[56px] w-full items-center gap-3 " + (stack ? "" : "sm:w-auto ") + "rounded-xl bg-black px-5 py-2.5 text-left text-white ring-1 ring-white/25 transition-transform duration-200 hover:-translate-y-0.5 hover:ring-white/60";
  return (
    <div className={"flex flex-col gap-3 " + (stack ? "" : "sm:flex-row ") + className}>
      <a href={APP_STORE} target="_blank" rel="noopener" aria-label={appStoreAria} data-store="app-store" className={base}>
        <svg width="26" height="26" viewBox="0 0 73 73" fill="currentColor" aria-hidden>
          <path d={APPLE_MARK_PATH} />
        </svg>
        <span className="flex flex-col leading-none">
          <span className="text-[11px] font-medium tracking-wide">Download on the</span>
          <span className="mt-1 text-[22px] font-semibold tracking-tight">App Store</span>
        </span>
      </a>
      <a href={play.toString()} target="_blank" rel="noopener" aria-label={playAria} data-store="google-play" className={base}>
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
          {PLAY_MARK_PATHS.map(([fill, d]) => (
            <path key={fill} fill={fill} d={d} />
          ))}
        </svg>
        <span className="flex flex-col leading-none">
          <span className="text-[11px] font-medium uppercase tracking-wide">Get it on</span>
          <span className="mt-1 text-[22px] font-semibold tracking-tight">Google Play</span>
        </span>
      </a>
    </div>
  );
}
