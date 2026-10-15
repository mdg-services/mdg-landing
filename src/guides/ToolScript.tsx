"use client";

import { useEffect } from "react";

/**
 * Runs a tool page's own script (guide/tools/<id>.js) once the page is in the
 * browser. The calculator or checklist is plain HTML in the page's Markdown;
 * its script finds that HTML by id and wires it up, so it must not run before
 * React has finished with the page, and must not run twice on the same page.
 *
 * It also does one thing the tool scripts do not: after a calculator's button
 * (`id` ending in `-go`) is pressed, or Enter is pressed in one of its boxes,
 * it brings the result into view. On a phone the result starts below the fold,
 * and without this it looks as if nothing happened.
 */
export default function ToolScript({ code }: { code: string }) {
  useEffect(() => {
    const tool = document.querySelector<HTMLElement>(".tool");
    if (!tool) return;
    // The script runs once per tool. Already wired means React's development
    // double-run, or a page shown again: then only the listeners below are put back.
    let el: HTMLScriptElement | undefined;
    if (tool.dataset.wired !== "1") {
      tool.dataset.wired = "1";
      el = document.createElement("script");
      el.text = code;
      document.body.appendChild(el);
    }

    const shown = (e: HTMLElement) => e.getClientRects().length > 0;
    /** The tool's own handler has already run: this listener sits on the box around the button. */
    const showResult = () => {
      const result = [...tool.querySelectorAll<HTMLElement>('[id$="-err"], [id$="-out"]')].find(shown);
      if (!result) return;
      const r = result.getBoundingClientRect();
      // already fully in view below the sticky header: leave the page where it is
      if (r.top >= 72 && r.bottom <= window.innerHeight) return;
      const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      result.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
      if (!result.hasAttribute("tabindex")) result.setAttribute("tabindex", "-1");
      result.focus({ preventScroll: true });
    };
    const onClick = (e: Event) => {
      const button = (e.target as HTMLElement | null)?.closest("button");
      if (button && /-go$/.test(button.id)) showResult();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.target as HTMLElement | null)?.tagName === "INPUT") showResult();
    };
    tool.addEventListener("click", onClick);
    tool.addEventListener("keydown", onKey);
    return () => {
      tool.removeEventListener("click", onClick);
      tool.removeEventListener("keydown", onKey);
      el?.remove();
    };
  }, [code]);
  return null;
}
