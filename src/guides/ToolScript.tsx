"use client";

import { useEffect } from "react";

/**
 * Runs a tool page's own script (guide/tools/<id>.js) once the page is in the
 * browser. The calculator or checklist is plain HTML in the page's Markdown;
 * its script finds that HTML by id and wires it up, so it must not run before
 * React has finished with the page, and must not run twice on the same page.
 */
export default function ToolScript({ code }: { code: string }) {
  useEffect(() => {
    const tool = document.querySelector<HTMLElement>(".tool");
    // Already wired: React's development double-run, or a page shown again.
    if (!tool || tool.dataset.wired === "1") return;
    tool.dataset.wired = "1";
    const el = document.createElement("script");
    el.text = code;
    document.body.appendChild(el);
    return () => {
      el.remove();
    };
  }, [code]);
  return null;
}
