import { useState } from "react";

const faqs = [
  {
    q: "Which OMC dealerships do you work with?",
    a: "All three majors: IndianOil, BPCL, HPCL. Cooperative-grade outlets too. Single-pump dealerships and multi-outlet operators are both welcome.",
  },
  {
    q: "Do I have to switch from my current paperwork team?",
    a: "No. Most dealers start by handing us one or two problem areas first, then expand once the cycle settles. We run alongside your existing setup during onboarding.",
  },
  {
    q: "How fast can you start?",
    a: "Onboarding completes within seven days from the day pricing is locked. The first inspection and filing cycle usually clears within two weeks.",
  },
  {
    q: "What happens at midnight on a Sunday when something breaks?",
    a: "Our on-call line stays open 9am to 9pm, seven days a week. Out-of-hours issues are logged and acknowledged within the hour; major incidents get a same-night call back.",
  },
  {
    q: "How is pricing decided?",
    a: "Pricing depends on which services you pick, the size of the outlet, and the volume of paperwork. It is locked in writing before we start, and does not rise mid-contract.",
  },
  {
    q: "Do you sign an NDA?",
    a: "Yes, before we look at any of your documents. We can also work under your dealership's own confidentiality framework if you have one.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      aria-label="Common questions"
      className="bg-paper border-t border-ink-hairline"
    >
      <div className="wrap-full py-24 md:py-36">
        <header className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8" data-reveal>
            <p className="eyebrow">Plain answers</p>
            <h2
              className="mt-5 text-display text-ink"
              style={{ fontSize: "clamp(36px, 5.4vw, 72px)" }}
            >
              A few questions, <span className="text-seal">plainly answered.</span>
            </h2>
          </div>
          <div className="md:col-span-4" data-reveal style={{ ["--reveal-delay" as any]: "100ms" }}>
            <p className="max-w-prose2 text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">
              Did not find yours? Call the number below or write to us. We
              answer in plain Hindi or English, no template.
            </p>
          </div>
        </header>

        <ul className="mt-16 md:mt-20">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={f.q}
                data-reveal
                style={{ ["--reveal-delay" as any]: `${i * 60}ms` }}
                className="border-t border-ink-hairline"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-6 py-8 text-left md:py-10"
                >
                  <span
                    className="text-display text-ink"
                    style={{ fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1.1 }}
                  >
                    <span className="num-serif tabular-nums mr-5 text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center text-ink-soft"
                  >
                    <Plus open={isOpen} />
                  </span>
                </button>
                <div
                  id={`faq-${i}`}
                  className="disclose"
                  data-open={isOpen}
                  aria-hidden={!isOpen}
                >
                  <div>
                    <div className="grid grid-cols-[1fr_auto] gap-6 pb-10 md:pb-12">
                      <p className="max-w-[64ch] text-[16px] leading-[1.6] text-ink-soft md:text-[18px] md:pl-[3.6em]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="border-t border-ink-hairline" />
        </ul>
      </div>
    </section>
  );
}

function Plus({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        transform: open ? "rotate(45deg)" : "rotate(0deg)",
        transition: "transform 280ms var(--ease-out-expo)",
      }}
    >
      <path d="M9 2.5v13M2.5 9h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
