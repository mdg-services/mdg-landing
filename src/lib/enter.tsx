import type { CSSProperties, ReactNode } from "react";

/**
 * A rise for text on the first screen of a page: the same movement as
 * `Reveal` (see lib/reveal.tsx), but in CSS, so it plays as the page paints
 * instead of waiting for the page's JavaScript.
 *
 * It rises without fading: the words are fully there from the first frame,
 * which is what a phone on a slow line should see first and what the browser
 * counts as the page's main content as soon as it paints (a fade-in from
 * nothing is counted only once it is visible, a moment later). `Reveal` is for
 * what sits further down, where waiting for the reader to scroll is the point.
 */
export function Enter({
  children,
  delay = 0,
  y = 18,
  duration = 0.7,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={`enter-solid ${className}`}
      style={{ "--d": `${delay}s`, "--rise-y": `${y}px`, "--dur": `${duration}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
