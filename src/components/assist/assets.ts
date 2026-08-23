/**
 * The assistant's face. Lives in `public/` like the other brand marks, so the
 * path is root-absolute and the same string works from the launcher and from
 * the panel — one file, fetched once, cached for both.
 *
 * 192px square, palette PNG, 4.5KB. The launcher draws it at 48 CSS px, so
 * that covers a 3x screen without shipping a photograph to a 2G phone.
 */
export const ASSIST_BOT_SRC = "/assist-bot.png";
