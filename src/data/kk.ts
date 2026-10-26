/* Khata Kavach: the facts about the page that do not change with the language. */

/** The page's address (English; the Hindi twin is under /hi). */
export const KK_PATH = "/khata-kavach" as const;

/** The two apps as they open in a phone's browser today. Android apps are not on Google Play yet. */
export const KK_APPS = {
  pump: "https://khata-pump.mdgservices.in",
  transporter: "https://khata-transporter.mdgservices.in",
  /** Where a pump owner sets up his own pump: the Pump app's sign-up (no call needed since 22 Oct 2026). */
  signup: "https://khata-pump.mdgservices.in/signup",
} as const;

/** One app screen: a small WebP cut from the product's own demo data (made-up names, made-up trucks). */
export type KkScreen = { src: string; width: number; height: number };

const screen = (name: string): KkScreen => ({ src: `/kk/screens/${name}.webp`, width: 480, height: 1040 });

/**
 * The screens each language shows. The English page shows the English app, the Hindi page the Hindi one.
 * All ten are the Pump and Transporter apps (480x1040 WebP) with one made-up pump, "Sharma Fuels" (the demo app
 * shows "Demo Pump" in its header, so the alt texts say "the demo pump"), and two made-up transporters, Sharma
 * Roadlines and Gupta Transport. `pump` is the Pump app, `transporter` the Transporter app.
 *
 * English: hero = the fill screen for UP00 SH 1001 of Sharma Roadlines ("You can fill", 200 L of diesel and
 * Rs 17,524 typed in, a photo of the truck attached); pump[0] = Today (credit given today, due on bills, this
 * month); pump[1] = Sharma Roadlines' page (owed against the limit, Record a payment, its bills);
 * transporter[0] = the request screen (Litres / Rupees / Full tank, Diesel or Petrol, quick litre amounts);
 * transporter[1] = the Bills tab (due on bills, one unpaid bill).
 *
 * Hindi: hero = the green screen for UP00 SH 1001 ("भर सकते हो", 200 L डीज़ल, लिमिट में बचा); pump[0] = Today;
 * pump[1] = the Bills page (बिलों के बाकी, one unpaid bill and one paid); transporter[0] = the Transporter home
 * with the "बिलों के बाकी" card; transporter[1] = one bill open (UPI से भरो, PDF देखो).
 */
export const KK_SCREENS = {
  en: {
    hero: screen("pump-en-fill"),
    pump: [screen("pump-en-today"), screen("pump-en-transporter")],
    transporter: [screen("transporter-en-request"), screen("transporter-en-bills")],
  },
  hi: {
    hero: screen("pump-hi-green"),
    pump: [screen("pump-hi-today"), screen("pump-hi-bills")],
    transporter: [screen("transporter-hi-home"), screen("transporter-hi-bill")],
  },
} as const;

/** The three made-up trucks in the nozzle demo. Each is one light. */
export const KK_DEMO = [
  { light: "go", plate: "UP00 SH 1001" },
  { light: "stop", plate: "UP00 SH 1004" },
  { light: "wait", plate: "UP00 GT 2002" },
] as const;

export type KkLight = (typeof KK_DEMO)[number]["light"];

/** The anchors on the page, in order. */
export const KK_ANCHORS = { how: "how", pump: "pump", transporter: "transporter", faq: "faq", start: "start" } as const;
