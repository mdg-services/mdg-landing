import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { Reveal } from "../lib/motion";
import { BRAND } from "../data/content";

export default function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="border-t border-ink-hairline bg-white">
      <div className="wrap-full py-24 md:py-32">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <p className="eyebrow">Get in touch</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-mega text-ink" style={{ fontSize: "clamp(38px, 6.2vw, 96px)" }}>
                The simplest way
                <br />
                <span className="text-navy-700">is to call.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="md:col-span-4">
            <p className="max-w-prose2 text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">
              A real person picks up, speaks with you in your language, and tells
              you honestly whether we can help.
            </p>
          </Reveal>
        </div>

        {/* phone hero */}
        <Reveal delay={0.1}>
          <a
            href={BRAND.phoneHref}
            className="group mt-14 block rounded-3xl border border-ink-hairline bg-navy-950 p-8 text-white transition-shadow duration-300 hover:shadow-navy md:mt-16 md:p-12"
          >
            <div aria-hidden className="pointer-events-none relative">
              <div className="absolute inset-0 -m-8 bg-grid-dark opacity-30 md:-m-12" />
            </div>
            <div className="relative flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-navy-200">
                Toll free <span className="mx-1.5 text-white/30">·</span>{" "}
                <span className="deva normal-case text-gold-300">नि:शुल्क</span>
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-navy-200">{BRAND.hours}</span>
            </div>
            <div
              className="num relative mt-6 font-semibold text-white"
              style={{ fontSize: "clamp(46px, 10vw, 150px)", lineHeight: 0.94, letterSpacing: "-0.04em" }}
            >
              <span className="text-gold-400">1800</span>
              <span className="mx-1.5 text-white/30">·</span>345
              <span className="mx-1.5 text-white/30">·</span>6512
            </div>
            <div className="relative mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-gold-300">
              Tap to call <Icon name="arrow" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </a>
        </Reveal>

        {/* callback form */}
        <div className="mt-14 grid items-start gap-8 border-t border-ink-hairline pt-12 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">Prefer a callback?</p>
            <h3 className="mt-5 font-display text-[24px] font-semibold leading-tight text-ink md:text-[28px]">
              Drop your number, we'll call you back.
            </h3>
            <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.6] text-ink-soft">
              A team member calls back within the hour, {BRAND.hours.toLowerCase()}.
            </p>
            {!showForm && (
              <button type="button" onClick={() => setShowForm(true)} className="btn-ghost mt-6">
                Leave my number <Icon name="arrowDown" size={16} />
              </button>
            )}
          </Reveal>

          <div className="md:col-span-7">
            <div className="disclose" data-open={showForm} aria-hidden={!showForm}>
              <div>
                {!sent ? (
                  <form onSubmit={handleSubmit} aria-label="Request a callback">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Your name" name="name" placeholder="Ramesh Kumar" />
                      <Field label="Pump / outlet" name="outlet" placeholder="Sai Petroleums, Aligarh" />
                      <Field
                        label="Phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        pattern="[0-9+\s\-]{10,15}"
                        placeholder="+91 9XXXXXXXXX"
                        required
                        className="sm:col-span-2"
                      />
                    </div>
                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-[13px] text-ink-muted">We will never share your number.</p>
                      <button type="submit" className="btn-primary">
                        Request callback <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div role="status" aria-live="polite" className="rounded-2xl border border-ok/30 bg-ok-tint p-7">
                    <div className="flex items-center gap-2.5 text-ok">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-ok text-white">
                        <Icon name="check" size={15} strokeWidth={2.4} />
                      </span>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">Received</span>
                    </div>
                    <p className="mt-4 font-display text-[22px] font-semibold leading-tight text-ink">
                      Thank you — we'll be in touch shortly.
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">
                      A team member usually calls within the hour. Can't wait?{" "}
                      <a href={BRAND.phoneHref} className="link-quiet font-semibold text-navy-700">
                        Call us directly
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  inputMode,
  pattern,
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  inputMode?: "tel" | "text" | "email" | "search" | "url" | "numeric";
  pattern?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={"block " + (className ?? "")}>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
        {label}
        {required && <span className="ml-1 text-gold-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        required={required}
        placeholder={placeholder}
        className="mt-2.5 w-full rounded-xl border border-ink-hairline bg-paper-warm px-4 py-3.5 text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500 focus:bg-white"
      />
    </label>
  );
}
