"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches for `data-reveal` / `data-item` elements (lib/reveal.tsx) and lets
 * them in as they scroll into view.
 *
 * What is already on screen when this runs is left alone: it has been in front
 * of the reader since the first paint, and hiding it now only to fade it back
 * would be a flicker. What is below is hidden (the `reveal-on` class on <html>
 * switches that on) and shown, once, as it comes within an eighth of the
 * screen's bottom edge. A reader who asked for less motion sees everything.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-item]"));
    if (!all.length || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const below: HTMLElement[] = [];
    const fold = window.innerHeight * 0.88;
    for (const el of all) {
      if (el.getBoundingClientRect().top < fold) el.classList.add("in");
      else below.push(el);
    }
    if (!("IntersectionObserver" in window)) {
      for (const el of below) el.classList.add("in");
      return;
    }
    document.documentElement.classList.add("reveal-on");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    for (const el of below) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
