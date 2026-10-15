"use client";

import { useEffect } from "react";

/**
 * Switches on font families that must not compete with the first paint.
 *
 * `classNames` are next/font variable classes (the ones that define
 * `--font-tiro` and `--font-noto-deva`). They go on <html> once the page has
 * loaded and the browser is idle; until then every use of those variables falls
 * back to the device's own font (the stacks in tailwind.config.js say so), and
 * the files are not asked for. A page with no scripts keeps the device's font,
 * and so does a visitor on a 2G or save-data connection.
 */
export default function LateFonts({ classNames }: { classNames: string }) {
  useEffect(() => {
    const classes = classNames.split(" ").filter(Boolean);
    if (!classes.length) return;
    // A dealer on a 2G link, or one who asked the browser to save data, keeps
    // the device's own Devanagari for the few words: the two files are ~185 kB.
    const link = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (link && (link.saveData || /^(slow-)?2g$/.test(link.effectiveType ?? ""))) return;
    const hasIdle = typeof window.requestIdleCallback === "function";
    let pending = 0;
    const apply = () => document.documentElement.classList.add(...classes);
    const onLoad = () => {
      // Safari has no requestIdleCallback; a short timer stands in for it.
      pending = hasIdle ? window.requestIdleCallback(apply, { timeout: 2_000 }) : window.setTimeout(apply, 200);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      if (pending) {
        if (hasIdle) window.cancelIdleCallback(pending);
        else window.clearTimeout(pending);
      }
    };
  }, [classNames]);
  return null;
}
