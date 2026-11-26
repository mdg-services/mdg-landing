/* The Kavach Shuruaat blocks on pages that are about something else (ADR 0059
   §6): the guides, the tools, the hubs, home, pricing, about, contact and the
   Khata Kavach page. One component draws them (components/ShuruaatBlock.tsx);
   these are its words.

   Rules, because many of these sit on the Petrol pump guide, which is held to
   its own forbidden words (pump-guide/README.md) and labels every sales line an
   advertisement:
   - Never promise or imply a dealership, a licence, an approval or an income.
     The oil company selects dealers; say so where there is room.
   - Never "first month free": there is no free month (ADR 0058 §13.2).
   - The price comes in as {newPumpPrice}, filled from NEW_PUMP, never typed.
   - Plain words, and nothing that assumes who the reader is. */
export const shuruaat = {
  /** The label on every block inside a guide page. */
  ad: "Advertisement",

  /** One line after the first section of every Petrol pump guide page. */
  strip: {
    text: "Have a question about this? Ask in Kavach Shuruaat, in the Dealer Kavach app.",
    link: "Ask your question",
  },

  /** Near the end of the MDG guides, the tools and the density pages. */
  box: {
    title: "Planning a new petrol pump, or know someone who is?",
    text: "Kavach Shuruaat, in the Dealer Kavach app, answers questions about opening a petrol pump from the official rule books, in Hindi or English, for {newPumpPrice} + GST a month. It explains the rules; the oil company decides who becomes a dealer.",
    link: "Ask in Kavach Shuruaat",
  },

  /** One line near the end of the Khata Kavach pages. */
  line: {
    text: "Planning a new petrol pump?",
    link: "Ask your questions in Kavach Shuruaat",
  },

  /** A card on home, pricing, about, contact, the Khata Kavach page, the guide hubs. */
  card: {
    kicker: "For anyone planning a petrol pump",
    title: "Questions about opening a petrol pump? Ask in Kavach Shuruaat.",
    text: "Land, highway distances, licences, dealer selection, building the pump: Kavach Shuruaat, in the Dealer Kavach app, answers from the official rule books, in Hindi or English. {newPumpPrice} + GST a month. It does not get anyone a dealership; the oil company selects dealers.",
    link: "Ask in Kavach Shuruaat",
    more: "What it is and what it costs",
  },

  /** llms.txt: the questions page (/new-pump/questions). */
  llms: {
    questionsTitle: "Questions people ask before opening a petrol pump",
    questionsText:
      "About 30 short answers on opening a petrol pump in India (who can apply, land and site, money and documents, licences and permissions, selection and after), each linked to the guide page that answers it in full. Ask anything further in Kavach Shuruaat.",
  },
};
