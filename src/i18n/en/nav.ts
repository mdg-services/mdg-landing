import type { NavId } from "../../data/content";

export const nav = {
  items: {
    services: "The app",
    why: "Why us",
    process: "How it works",
    membership: "Pricing",
  } satisfies Record<NavId, string>,
  /** The guides to the oil companies' dealer rules (/guides/). */
  guides: "Guides",
  /** The home page's film section (#film): the two films on /film/short and /film. */
  film: "Film",
  /* The two apps. "Products" opens a small menu with both. */
  products: "Products",
  productsAria: "Our apps",
  dealerKavach: { name: "Dealer's Kavach", note: "Paperwork and filings" },
  khata: { name: "Khata Kavach", note: "Credit fuel for transporters" },
  /** New Pump Guide (ADR 0058): a feature of the Dealer Kavach app for people planning a pump. */
  newPump: { name: "Kavach Shuruaat", note: "For people opening a petrol pump" },
};
