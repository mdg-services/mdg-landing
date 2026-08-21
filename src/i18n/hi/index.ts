import type { Dict } from "../lang";
import { meta } from "./meta";
import { ui } from "./ui";
import { nav } from "./nav";
import { hero } from "./hero";
import { marquee } from "./marquee";
import { numbers } from "./numbers";
import { problem } from "./problem";
import { services } from "./services";
import { extras } from "./extras";
import { why } from "./why";
import { mission } from "./mission";
import { process } from "./process";
import { training } from "./training";
import { membership } from "./membership";
import { contact } from "./contact";
import { faq } from "./faq";
import { footer } from "./footer";
import { register } from "./register";
import { assist } from "./assist";

/** Every visible string on mdgservices.in, in Hindi.
 *
 * Plain spoken Hindi, the way the support desk actually talks to a dealer.
 * Not the newspaper register, and not word-for-word from the English: where
 * a sentence reads better rebuilt, it is rebuilt. Portal names (SDMS, DSR,
 * Dhruva), brand names and codes stay in Latin script, because that is how a
 * dealer sees them on every screen they already use. */
export const hi: Dict = {
  meta,
  ui,
  nav,
  hero,
  marquee,
  numbers,
  problem,
  services,
  extras,
  why,
  mission,
  process,
  training,
  membership,
  contact,
  faq,
  footer,
  register,
  assist,
};
