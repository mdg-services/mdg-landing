import bot from "./assist-bot.png";

/**
 * The assistant's face. It is imported from this folder rather than served from
 * `public/`: the build gives it a name made from its contents
 * (/_next/static/media/assist-bot.<hash>.png) and a one-year cache, so it is
 * fetched once and never asked about again. The same string works from the
 * launcher and from the panel, one file cached for both.
 *
 * 192px square, palette PNG, 4.5KB. The launcher draws it at 48 CSS px, so
 * that covers a 3x screen without shipping a photograph to a 2G phone.
 */
export const ASSIST_BOT_SRC: string = bot.src;
