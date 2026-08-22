/**
 * The sound the panel makes when it opens.
 *
 * Synthesised rather than shipped. A short blip is a few lines of arithmetic
 * and no bytes at all, and this site is built for a phone on 2G: an audio file
 * for a 60ms sound would be the single most wasteful request on the page.
 *
 * Two rules, and both are about not being rude:
 *
 *   - It is quiet and it is short. A tenth of a second, well under the volume
 *     of anything else the phone is playing.
 *   - It never throws and it never complains. A browser will not let a page
 *     make a sound before the visitor has touched it, and the panel opens by
 *     itself on a desktop, so the automatic open simply attempts it and
 *     swallows the refusal. An opening the visitor asked for is a gesture, so
 *     that one is heard.
 *
 * The context is closed straight afterwards. Browsers cap how many a page may
 * hold, and leaving one open for a sound that has finished would spend one of
 * a handful for nothing.
 */

/** Peak gain. Low on purpose: a notification, not an alarm. */
const PEAK = 0.05;
/** How long the whole thing lasts. */
const DECAY_S = 0.09;

export function playPop(): void {
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    // Suspended until a gesture in most browsers. Ask, and do not care about
    // the answer: a refused resume leaves a silent context we close below.
    void ctx.resume?.().catch(() => undefined);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // A triangle reads as soft where a square reads as an alert, and the small
    // upward slide is what makes it a "pop" rather than a beep.
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(PEAK, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + DECAY_S);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + DECAY_S + 0.02);

    osc.onended = () => {
      void ctx.close().catch(() => undefined);
    };
    // `onended` does not fire on a context that never started, so the close is
    // also armed on a timer. Closing twice is harmless; leaking one is not.
    window.setTimeout(() => void ctx.close().catch(() => undefined), 400);
  } catch {
    /* no sound, no consequence */
  }
}
