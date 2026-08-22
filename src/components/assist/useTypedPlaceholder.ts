import { useEffect, useState } from "react";

/**
 * A question that types itself into the empty composer.
 *
 * An empty box with "Type your question" in it tells a dealer what the box is
 * for. It does not tell them what this thing can answer, and a visitor who does
 * not know what to ask asks nothing. So the box asks the first question for
 * them, one character at a time, holds it long enough to read, clears, and
 * offers it again.
 *
 * It stops for good the moment the visitor touches the field. Text moving
 * underneath somebody who is trying to type is the worst thing a placeholder
 * can do, and there is no second chance at it: once they are typing, this is
 * their box, not ours.
 *
 * A reader who has asked their system for less movement gets the finished
 * sentence and no animation at all — the same information, sitting still.
 *
 * Characters, not code units: a Devanagari line is full of combining marks and
 * `Array.from` keeps each one attached to the letter it belongs to.
 */

/** Per character. Fast enough to be read as typing, slow enough to read. */
const TYPE_MS = 55;
/** Once the whole question is up, long enough to take it in. */
const HOLD_MS = 2_000;
/** Blank, before it starts over. */
const GAP_MS = 800;
/** Let the panel land before anything starts moving inside it. */
const START_MS = 600;

export function useTypedPlaceholder(text: string, still: boolean): string {
  /**
   * The sentence being typed is stored WITH the sentence it belongs to. The
   * panel has its own language toggle, so `text` changes under this hook, and
   * a half-typed English line left standing in a Hindi box for the first
   * moment would be the one thing anybody noticed about it.
   */
  const [typed, setTyped] = useState({ text, shown: "" });

  useEffect(() => {
    if (still) return;

    const chars = Array.from(text);
    let timer = 0;
    let cut = 0;
    let holding = false;

    const step = () => {
      if (holding) {
        holding = false;
        cut = 0;
        setTyped({ text, shown: "" });
        timer = window.setTimeout(step, GAP_MS);
        return;
      }
      cut += 1;
      setTyped({ text, shown: chars.slice(0, cut).join("") });
      if (cut >= chars.length) {
        holding = true;
        timer = window.setTimeout(step, HOLD_MS);
        return;
      }
      timer = window.setTimeout(step, TYPE_MS);
    };

    timer = window.setTimeout(step, START_MS);
    return () => window.clearTimeout(timer);
  }, [text, still]);

  if (still) return text;
  return typed.text === text ? typed.shown : "";
}
