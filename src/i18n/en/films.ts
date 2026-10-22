/* The home page's film section: the two films on /film/short and /film, for a
   visitor who came to the site on their own rather than from a WhatsApp invite.
   Outcomes only. The films themselves are in Hindi in both languages.

   `{min}` and `{chapters}` are filled in from src/film/films.json, so a re-cut
   film never leaves an old running time on the home page. */
export const films = {
  sectionAria: "Our films",
  eyebrow: "Watch the film",
  heading: "See what Dealer's Kavach does for your pump.",
  intro: "Two films in Hindi, with Hindi subtitles. They play on any phone, no app needed.",
  short: {
    title: "In 40 seconds",
    note: "The quick look",
  },
  full: {
    title: "The full film",
    note: "{min} minutes, {chapters} chapters",
  },
};
