# Adding a language to mdgservices.in

The site speaks three languages today: English (`/`), Hindi (`/hi`) and Odia
(`/or`). Everything that makes a language a language is in a few named places,
and one command tells you which of them you have not done yet:

```bash
npm run lang:check
```

It prints one plain line per missing step and exits with an error, so a half
finished language cannot ship. `npm run lang:check -- --report` prints the same
without failing.

## What a language is made of

| Part | Where | Who writes it |
|---|---|---|
| The entry: name, prefix, codes, month names, word allowance | `src/i18n/languages.ts` | you, 5 minutes |
| Every sentence of the site (about 110 kB of English) | `src/i18n/<code>/*.ts` | a translator; the shape is checked by TypeScript |
| The terms translators must use | `src/i18n/<code>/GLOSSARY.md` | you, copied from the nearest language |
| The font for the script | `src/fonts/<code>.ts` + one line in `src/fonts/index.ts` | you, copy `or.ts` |
| Guide pages (optional, a hand-picked set) | `guide/content/<code>/`, `pump-guide/content/<code>/`, `kk-guide/content/<code>/` | a translator |
| The words around guide pages | `guide/copy.<code>.ts`, `pump-guide/copy.<code>.ts` | a translator |
| Which guide pages exist in it, and the day they go live | `guide/translations.ts` | you |

The pages, the language switch, the search-engine tags, the sitemap, `llms.txt`,
the release gate and the not-found page need **no new files**: they read the
list above. The route files are shared (`app/[lang]/…`).

## Steps

1. **Register it.** Add an entry to `LANGUAGES` in `src/i18n/languages.ts`
   (copy `or`). Set `indic: true` for an Indian script (it turns on the taller
   lines and untracked letters in `index.css`), `script` to a regular expression
   for one letter of the script, `months`, `wordFactor` and the switch texts.
2. **Wire the four places that must be spelled out** (Next.js reads them as
   plain text, so they cannot import the list; `lang:check` tells you if you
   forget):
   - `proxy.ts`: the matcher reads `"/:lang(hi|or)/…"`, add the prefix;
   - `next.config.ts`: `LANG_PREFIXES`;
   - `src/i18n/server.ts`: import the dictionary and add it to `DICTS`;
   - `scripts/lang-check.ts`: import the dictionary next to `hi` and `or`.
3. **Font.** Copy `src/fonts/or.ts` to `src/fonts/<code>.ts`, swap in the
   script's Google font (check it exists in `next/font/google`), add its
   variable to `tailwind.config.js` `fontFamily` in the same way as
   `--font-noto-odia`, and list it in `src/fonts/index.ts`.
4. **Words.** Copy `src/i18n/or/GLOSSARY.md`, adjust, then translate each file
   of `src/i18n/en/` into `src/i18n/<code>/` with the same name, typed
   `: typeof EN` as the Hindi files are (see `src/i18n/hi/ui.ts`). Copy
   `src/i18n/or/index.ts`. `npx tsc --noEmit` fails on a missing key and
   `npm run lang:check` fails on a changed number, link or `{placeholder}`, an
   empty string, a list of the wrong length, or a sentence left in English.
5. **Guide pages (optional).** Write the pages as `<collection>/content/<code>/<id>.md`
   (the rules are in `guide/README.md`), add their ids to a new entry in
   `guide/translations.ts` with the day they go live, and write the words
   around them in `guide/copy.<code>.ts` / `pump-guide/copy.<code>.ts` (copy
   `copy.or.ts`) and merge them in `src/guides/collections.ts`. These pages are
   not on the daily drip: they go live together and move no other page.
   `npm run guide -- check` checks them.
6. **Check and ship.** `npm run lang:check`, `npx tsc --noEmit`, `npm run build`,
   then the usual `vercel --prod --yes --force`. Hreflang tags, the sitemap and
   `llms.txt` pick the language up by themselves. Pages go in the sitemap the
   day they are live; Google finds them from there.

## Rules that hold for every language

- **The URL decides the language.** `/or/about` is Odia, always. The proxy only
  ever sends a visitor from an English address to a twin (cookie, `?lang=`, or
  the browser's language); an address with a prefix stays.
- **Only claim what is true.** The apps (Dealer's Kavach, Khata Kavach) and the
  help desk answer in Hindi and English. Odia and later languages are pages and
  guides; structured data keeps `availableLanguage` and the apps' `inLanguage`
  at what the apps and the desk really do (`src/seo/graph.ts`). Change those only
  when that changes.
- **The English page is the reference.** Guides say it on every page; legal
  pages say the English binds (`docs.bindingNotice`).
- **A native reader must go through a new language before it is promoted.**
  Odia is live without one: see `src/i18n/or/REVIEW.md` for what a machine
  check found and what is still unsure.
- **The film** is separate: its voice and captions per language live in
  `marketing/films/` (see the film notes there). A new site language does not
  change the film.
