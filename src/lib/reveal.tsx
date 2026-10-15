import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll reveals, in CSS.
 *
 * An element marked `data-reveal` (or `data-item`, one of a group that comes in
 * one after another) fades up as it scrolls into view. The marking is plain
 * HTML the server writes; the one small script that watches for it is
 * `RevealObserver`, and until that script runs nothing is hidden, so a page
 * read without scripts shows all of its words.
 *
 * How it moves is in index.css (the "Scroll reveals" block). The variables an
 * element can set: `--d` delay, `--ry` how far it rises from, `--rx` how far it
 * slides from the side, `--rs` the scale it grows from.
 */

type Vars = Record<`--${string}`, string | number>;

const vars = (v: Vars, style?: CSSProperties) => ({ ...v, ...style }) as CSSProperties;

/** A single fade-up as the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div data-reveal="" className={className} style={vars({ "--d": `${delay}s`, "--ry": `${y}px` }, style)}>
      {children}
    </div>
  );
}

/**
 * The attributes for one item of a group that comes in one after another:
 * `<div {...item(i, 0.08)}>`. `i` is its place, `gap` the seconds between
 * neighbours, `delay` the wait before the first.
 */
export function item(i: number, gap = 0.08, delay = 0, extra?: Vars & CSSProperties) {
  return { "data-item": "", style: vars({ "--d": `${(delay + i * gap).toFixed(3)}s`, ...extra }) };
}

/** Attributes for something that animates on its own, in a named way ("pop", "line-y", "line-x", "x"). */
export function reveal(kind: "pop" | "line-y" | "line-x" | "x", extra?: Vars & CSSProperties) {
  return { "data-reveal": kind, style: vars({ ...extra }) };
}
