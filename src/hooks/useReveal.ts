import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-reveal-x], [data-reveal-pop], [data-reveal-clip], [data-counter]";

export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (!els.length) return;

    const startCounter = (el: HTMLElement) => {
      const target = Number(el.dataset.counter || "0");
      const duration = Number(el.dataset.counterDuration || "1400");
      const decimals = Number(el.dataset.counterDecimals || "0");
      const prefix = el.dataset.counterPrefix || "";
      const suffix = el.dataset.counterSuffix || "";
      const start = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 4); // out-quart
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const v = target * ease(t);
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => {
        el.classList.add("is-visible");
        if (el.hasAttribute("data-counter")) startCounter(el);
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("is-visible");
            if (el.hasAttribute("data-counter")) startCounter(el);
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
