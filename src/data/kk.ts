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

/**
 * The screens each language shows. The English page shows the English app, the Hindi page the Hindi one.
 * All ten are the Business and Customer apps with one made-up business, "Sharma Traders" (Diesel by the litre,
 * Cement by the bag), and two made-up customers, Sharma Roadlines and Gupta Transport. The keys `pump` and
 * `transporter` are kept because the page components use them: `pump` is the Business app, `transporter` the Customer app.
 *
 * English: hero = the sale form for UP00 SH 1005 (50 bags of Cement, Rs 20,250, a photo of the vehicle attached);
 * pump[0] = Today (credit given today, Due on bills, this month); pump[1] = Sharma Roadlines' page (owed against the
 * limit, Record a payment, its Bills); transporter[0] = the request screen (Bags / Rupees / As needed, Diesel, Petrol
 * or Cement, 10/20/50/100 bags); transporter[1] = the Bills tab (Due on bills, one unpaid bill).
 *
 * Hindi: hero = the green screen for UP00 SH 1005 ("माल दे सकते हो", 50 बोरी सीमेंट, credit left); pump[0] = Today;
 * pump[1] = the Bills page (बिलों के बाकी, one unpaid bill and one paid); transporter[0] = the Customer home with the
 * "बिलों के बाकी" card; transporter[1] = one bill open (UPI से भरो, PDF देखो).
 */
export const KK_SCREENS = {
  en: {
    hero: screen("business-en-sale"),
    pump: [screen("business-en-today"), screen("business-en-customer")],
    transporter: [screen("customer-en-request"), screen("customer-en-bills")],
  },
  hi: {
    hero: screen("business-hi-green"),
    pump: [screen("business-hi-today"), screen("business-hi-bills")],
    transporter: [screen("customer-hi-home"), screen("customer-hi-bill")],
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
