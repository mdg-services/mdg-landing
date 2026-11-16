/**
 * Where the Dealer Kavach app is, on both phones. The one place these two
 * addresses are written for the site: the home page, /register, /start, the
 * footer and the film pages all read them from here, so a dealer is only ever
 * sent to an app store and never to a form of ours.
 */
export const PLAY_STORE = "https://play.google.com/store/apps/details?id=in.mdgservices.dealerkavach";
/** App Store id 6828100923; India only, free. */
export const APP_STORE = "https://apps.apple.com/in/app/dealer-kavach/id6828100923";

/** Apple's logo, drawn in a 73 × 73 square. Used on the App Store button. */
export const APPLE_MARK_PATH =
  "M47.1,11.5 C49.9,8.5 51.4,4.3 51.2,0.1 C47.4,0.1 42.9,2.3 40.2,5.6 C38,8.3 35.7,12.5 36.5,16.8 C40.4,17.3 44.7,14.8 47.1,11.5 L47.1,11.5 Z M50.8,17.7 C44.9,17.7 39.7,21 36.9,21 C34,21 29.8,17.5 25,17.7 C18.8,17.8 13.1,21.5 9.9,26.9 C7.7,30.8 6.8,35.3 6.8,39.9 C6.9,48.7 10.4,57.9 14.4,63.7 C17.5,68.2 21,72.9 26,72.9 C30.5,72.9 32.2,69.9 38,69.9 C43.4,69.9 45.2,72.9 49.9,72.9 C54.8,72.9 58.1,68.4 61.1,63.9 C64.8,58.7 66,53.7 66.2,53.6 C66,53.6 56.6,49.8 56.3,38.9 C56.3,29.4 64,25.1 64.3,24.9 C60.1,18.4 53.3,17.7 50.8,17.7 L50.8,17.7 Z";

/** Google Play's four-colour mark, drawn in a 24 × 24 square. */
export const PLAY_MARK_PATHS = [
  ["#00a0ff", "M3.6 2.3c-.3.3-.4.7-.4 1.2v17c0 .5.1.9.4 1.2l9.5-9.7z"],
  ["#ffbc00", "m16.3 15.3-3.2-3.3 3.2-3.3 3.9 2.2c1.1.6 1.1 1.6 0 2.2z"],
  ["#ff3a44", "m16.3 15.3-3.2-3.3-9.5 9.7c.4.4 1 .4 1.6.1z"],
  ["#00d26a", "M16.3 8.7 5.2 2.2c-.6-.4-1.2-.3-1.6.1l9.5 9.7z"],
] as const;
