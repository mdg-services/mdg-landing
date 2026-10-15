"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/useReducedMotion";

export default function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1500,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  // The server (and anyone without scripts) gets the real figure. Only when the
  // figure turns out to be below the fold does the browser park it at 0, out
  // of sight, so it can count up as it arrives.
  const [val, setVal] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !("IntersectionObserver" in window)) return;
    let raf = 0;
    let parked = false;
    const count = () => {
      const start = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 4);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setVal(to * ease(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!parked) {
          // First report: already on screen, so leave the real figure alone.
          parked = true;
          if (entry.isIntersecting) {
            io.disconnect();
            return;
          }
          setVal(0);
          return;
        }
        if (!entry.isIntersecting) return;
        io.disconnect();
        count();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, reduce]);

  const formatted = val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
