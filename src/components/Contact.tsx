import { useState, type FormEvent } from "react";

export default function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-ink-hairline bg-paper"
    >
      <div className="wrap-full relative py-24 md:py-36">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8" data-reveal>
            <p className="eyebrow">Get in touch</p>
            <h2
              className="mt-5 text-mega text-ink"
              style={{ fontSize: "clamp(40px, 6.8vw, 108px)" }}
            >
              The simplest way
              <br />
              <span className="text-seal">is to call.</span>
            </h2>
          </div>
          <div className="md:col-span-4" data-reveal style={{ ["--reveal-delay" as any]: "100ms" }}>
            <p className="max-w-prose2 text-[17px] leading-[1.55] text-ink-soft md:text-[19px]">
              A real person picks up, speaks with you in your language,
              and tells you honestly whether we can help.
            </p>
          </div>
        </div>

        {/* The phone is the hero */}
        <a
          href="tel:18003456512"
          className="mt-16 block border-t border-ink-hairline pt-10 md:mt-24 md:pt-12"
          data-reveal
          style={{ ["--reveal-delay" as any]: "180ms" }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
            <div className="mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Toll free <span className="mx-2 text-ink-faint">·</span> <span className="deva normal-case text-[14px] tracking-normal text-seal">नि:शुल्क</span>
            </div>
            <div className="mono text-[12px] uppercase tracking-[0.22em] text-ink-muted">
              9 am – 9 pm, every day
            </div>
          </div>

          <div
            className="num-serif tabular-nums mt-6 text-ink"
            style={{ fontSize: "clamp(54px, 11vw, 168px)", lineHeight: 0.94, letterSpacing: "-0.04em" }}
          >
            <span className="text-seal">1800</span>
            <span className="text-ink-faint mx-1">·</span>
            345
            <span className="text-ink-faint mx-1">·</span>
            6512
          </div>
        </a>

        {/* Alt: form disclosure */}
        <div className="mt-16 grid items-start gap-8 border-t border-ink-hairline pt-10 md:mt-20 md:grid-cols-12 md:gap-14 md:pt-12">
          <div className="md:col-span-5">
            <p className="eyebrow">Or send a number</p>
            <h3
              className="mt-4 text-display text-ink"
              style={{ fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.12 }}
            >
              Prefer we call you?
            </h3>
            <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.55] text-ink-soft">
              Drop your number. A team member will call back within an
              hour, 9am to 9pm.
            </p>
            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="btn-ghost mt-6"
              >
                Leave my number
                <ArrowDown />
              </button>
            )}
          </div>

          <div className="md:col-span-7">
            <div
              className="disclose"
              data-open={showForm}
              aria-hidden={!showForm}
            >
              <div>
                {!sent ? (
                  <form onSubmit={handleSubmit} aria-labelledby="callback-heading">
                    <h4 id="callback-heading" className="sr-only">Request a callback</h4>
                    <div className="grid gap-6">
                      <Field label="Your name" name="name" placeholder="Ramesh Kumar" />
                      <Field label="Pump / Outlet name" name="outlet" placeholder="Sai Petroleums, Aligarh" />
                      <Field
                        label="Phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        pattern="[0-9+\s\-]{10,15}"
                        placeholder="+91 9XXXXXXXXX"
                        required
                      />
                      <label className="block">
                        <span className="mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
                          Anything we should know? (Optional)
                        </span>
                        <textarea
                          name="message"
                          rows={3}
                          placeholder="For example, which OMC, or what you need help with."
                          className="mt-3 w-full border border-ink-hairline bg-paper px-4 py-3.5 text-[16px] text-ink outline-none transition-colors duration-200 focus:border-seal"
                          style={{ borderRadius: 2, transitionTimingFunction: "var(--ease-out-quart)" }}
                        />
                      </label>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-[13px] text-ink-muted">
                        We will never share your number.
                      </p>
                      <button type="submit" className="btn-seal">
                        Request callback
                        <ArrowRight />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div role="status" aria-live="polite">
                    <div className="flex items-center gap-3 text-seal">
                      <CheckMark />
                      <span className="mono text-[11px] font-medium uppercase tracking-[0.22em]">
                        Received
                      </span>
                    </div>
                    <p
                      className="mt-4 text-display text-ink"
                      style={{ fontSize: "clamp(24px, 2.8vw, 36px)", lineHeight: 1.08 }}
                    >
                      Thank you. We will be in touch shortly.
                    </p>
                    <p className="mt-3 max-w-prose2 text-[16px] leading-[1.55] text-ink-soft">
                      A member of the team usually calls back within an
                      hour. If you cannot wait,
                      <a href="tel:18003456512" className="ml-1 link-quiet font-medium text-seal">
                        call us directly
                      </a>.
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
}: {
  label: string;
  name: string;
  type?: string;
  inputMode?: "tel" | "text" | "email" | "search" | "url" | "numeric";
  pattern?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
        {label}
        {required && <span className="ml-1 text-seal">*</span>}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full border border-ink-hairline bg-paper px-4 py-3.5 text-[16px] text-ink outline-none transition-colors duration-200 focus:border-seal"
        style={{ borderRadius: 2, transitionTimingFunction: "var(--ease-out-quart)" }}
      />
    </label>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
