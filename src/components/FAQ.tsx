import { useState } from "react";
import SectionHeader from "./SectionHeader";
import { Reveal } from "../lib/motion";
import { FAQS } from "../data/content";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-label="Common questions" className="bg-paper-warm">
      <div className="wrap-full py-24 md:py-32">
        <SectionHeader
          eyebrow="Plain answers"
          title={
            <>
              A few questions, <span className="text-navy-700">plainly answered.</span>
            </>
          }
          intro="Didn't find yours? Call the number above or write to us — we answer in plain Hindi or English, no template."
        />

        <div className="mt-14 md:mt-16">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className="border-t border-ink-hairline">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-7 text-left"
                  >
                    <span className="num text-[15px] font-semibold text-navy-300">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[18px] font-semibold leading-tight text-ink md:text-[22px]">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className="grid h-9 w-9 place-items-center rounded-full border border-ink-hairline bg-white text-navy-700 transition-colors group-hover:border-navy-300"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        fill="none"
                        style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 280ms var(--ease-out-expo)" }}
                      >
                        <path d="M9 2.5v13M2.5 9h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div id={`faq-${i}`} className="disclose" data-open={isOpen} aria-hidden={!isOpen}>
                    <div>
                      <p className="max-w-[68ch] pb-8 pl-[2.6rem] text-[15.5px] leading-[1.65] text-ink-soft md:text-[17px]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
          <div className="border-t border-ink-hairline" />
        </div>
      </div>
    </section>
  );
}
