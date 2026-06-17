import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { EASE, VIEWPORT } from "./anim";

/* Single in-view fade-up. */
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
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Container that staggers its variant-driven children into view. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}
