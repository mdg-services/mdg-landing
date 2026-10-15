import { useEffect, useState } from "react";

/**
 * Lets a dialog play its closing animation before it leaves the page.
 *
 * Give it whether the dialog is open and how long its exit takes (ms). It
 * answers whether to keep the dialog mounted, and whether it is on its way out
 * (so the dialog can switch to its exit animation with `data-leaving`).
 */
export function usePresence(open: boolean, exitMs: number): { mounted: boolean; leaving: boolean } {
  const [mounted, setMounted] = useState(open);

  // opening: mounted straight away, during the render that sees `open`
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const id = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(id);
  }, [open, mounted, exitMs]);

  return { mounted: open || mounted, leaving: !open && mounted };
}
