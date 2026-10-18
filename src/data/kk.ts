/* Khata Kavach: the facts about the page that do not change with the language. */

/** The page's address (English; the Hindi twin is under /hi). */
export const KK_PATH = "/khata-kavach" as const;

/** The two apps as they open in a phone's browser today. Android apps are not on Google Play yet. */
export const KK_APPS = {
  pump: "https://khata-pump.mdgservices.in",
  transporter: "https://khata-transporter.mdgservices.in",
} as const;

/** One app screen: a small WebP cut from the product's own demo data (made-up names, made-up trucks). */
export type KkScreen = { src: string; width: number; height: number };

const screen = (name: string): KkScreen => ({ src: `/kk/screens/${name}.webp`, width: 480, height: 1040 });

/** The screens each language shows. The English page shows the English app, the Hindi page the Hindi one. */
export const KK_SCREENS = {
  en: {
    hero: screen("pump-en-form"),
    pump: [screen("pump-en-today"), screen("pump-en-transporter")],
    transporter: [screen("fleet-en-request"), screen("fleet-en-account")],
  },
  hi: {
    hero: screen("pump-hi-green"),
    pump: [screen("pump-hi-today"), screen("pump-hi-transporters")],
    transporter: [screen("fleet-hi-home"), screen("fleet-hi-requests")],
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
