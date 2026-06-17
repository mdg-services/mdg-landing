import type { ReactNode } from "react";
import { Reveal } from "../lib/motion";

export default function SectionHeader({
  eyebrow,
  title,
  intro,
  light = false,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={"grid items-end gap-8 md:grid-cols-12 " + (className ?? "")}>
      <div className="md:col-span-8">
        <Reveal>
          <p className={light ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            className={"mt-6 text-balance text-display " + (light ? "text-white" : "text-ink")}
            style={{ fontSize: "clamp(33px, 5vw, 64px)" }}
          >
            {title}
          </h2>
        </Reveal>
      </div>
      {intro && (
        <Reveal delay={0.12} className="md:col-span-4">
          <p
            className={
              "max-w-prose2 text-[16px] leading-[1.6] md:text-[17px] " +
              (light ? "text-navy-100" : "text-ink-soft")
            }
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
