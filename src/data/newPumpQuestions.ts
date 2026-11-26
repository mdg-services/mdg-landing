/**
 * The questions hub, /new-pump/questions (ADR 0059 §6): which questions it
 * lists, in which group and order, and which Petrol pump guide page answers
 * each one in full. The words (question and short answer) are per language in
 * src/i18n/<lang>/newPumpQuestions.ts, keyed by the ids below, so the order and
 * the guide links are written once for every language.
 *
 * `guide` is a page id of the Petrol pump guide (pump-guide/inventory.ts). The
 * page links to it only while it is live (src/guides/model.ts `target`), so a
 * page whose day has not come never becomes a dead link here.
 */
export const NEW_PUMP_QUESTION_GROUPS = [
  {
    id: "who",
    questions: [
      { id: "who-can-apply", guide: "dealership-eligibility" },
      { id: "age-and-education", guide: "dealership-eligibility" },
      { id: "with-a-job", guide: "dealership-eligibility" },
      { id: "company-or-firm", guide: "dealership-apply-as-firm" },
      { id: "reserved-categories", guide: "dealership-reservation" },
      { id: "ex-servicemen", guide: "dealership-ex-servicemen" },
      { id: "private-brand", guide: "dealership-private-petrol-pump" },
    ],
  },
  {
    id: "land",
    questions: [
      { id: "land-size", guide: "site-land-size" },
      { id: "without-land", guide: "dealership-without-land" },
      { id: "land-groups", guide: "dealership-land-groups" },
      { id: "agricultural-land", guide: "site-agricultural-land" },
      { id: "land-lease", guide: "site-lease" },
      { id: "highway-permission", guide: "site-highway-access" },
      { id: "offer-land", guide: "site-offer-land-to-oil-company" },
    ],
  },
  {
    id: "money",
    questions: [
      { id: "cost", guide: "money" },
      { id: "documents", guide: "dealership-eligibility" },
      { id: "application-form", guide: "dealership-application-form" },
      { id: "loan-or-subsidy", guide: "money-loan-schemes" },
      { id: "dealer-commission", guide: "money-commission" },
    ],
  },
  {
    id: "licences",
    questions: [
      { id: "licences-and-nocs", guide: "licences" },
      { id: "peso-licence", guide: "licences-peso" },
      { id: "cng-pump", guide: "dealership-cng-pump" },
      { id: "mini-pump", guide: "dealership-mini-petrol-pump" },
    ],
  },
  {
    id: "selection",
    questions: [
      { id: "reading-the-advertisement", guide: "dealership-reading-advertisement" },
      { id: "draw-or-bidding", guide: "dealership-process" },
      { id: "interview", guide: "dealership-interview" },
      { id: "draw-result", guide: "dealership-draw-result" },
      { id: "letter-of-intent", guide: "dealership-letter-of-intent" },
      { id: "after-the-loi", guide: "dealership-appointment-and-commissioning" },
      { id: "how-long", guide: "dealership-process" },
      { id: "pay-an-agent", guide: "dealership" },
    ],
  },
] as const;

export type NewPumpQuestionGroup = (typeof NEW_PUMP_QUESTION_GROUPS)[number]["id"];
export type NewPumpQuestionId = (typeof NEW_PUMP_QUESTION_GROUPS)[number]["questions"][number]["id"];

/**
 * Guide pages written in the same piece of work as this hub (ADR 0059 §6), at
 * the address the plan gives them. Used only while the guide's own page list
 * does not know the id yet: once it does, the guide's own address and release
 * day decide the link, as for every other page.
 */
export const PLANNED_GUIDE_PATHS: Record<string, string> = {
  "dealership-private-petrol-pump": "/petrol-pump/dealership/private-petrol-pump/",
  "dealership-without-land": "/petrol-pump/dealership/without-own-land/",
  "dealership-land-groups": "/petrol-pump/dealership/land-group-1-and-group-2/",
  "site-offer-land-to-oil-company": "/petrol-pump/site/offer-land-to-an-oil-company/",
  "dealership-application-form": "/petrol-pump/dealership/application-form/",
  "money-loan-schemes": "/petrol-pump/money/government-loan-schemes/",
  "dealership-cng-pump": "/petrol-pump/dealership/cng-station-dealership/",
  "dealership-mini-petrol-pump": "/petrol-pump/dealership/mini-petrol-pump/",
  "dealership-reading-advertisement": "/petrol-pump/dealership/reading-the-advertisement/",
  "dealership-interview": "/petrol-pump/dealership/is-there-an-interview/",
  "dealership-draw-result": "/petrol-pump/dealership/draw-of-lots-and-result/",
  "dealership-letter-of-intent": "/petrol-pump/dealership/letter-of-intent/",
  "dealership-appointment-and-commissioning": "/petrol-pump/dealership/appointment-and-commissioning/",
};
