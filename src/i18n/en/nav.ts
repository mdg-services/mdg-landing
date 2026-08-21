import type { NavId } from "../../data/content";

export const nav = {
  items: {
    services: "The app",
    why: "Why us",
    process: "How it works",
    membership: "Pricing",
  } satisfies Record<NavId, string>,
};
