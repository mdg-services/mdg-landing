import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { LogoChip } from "./Brand";
import Icon from "./Icon";
import Footer from "./Footer";
import { Reveal, Stagger } from "../lib/motion";
import { itemUp, EASE } from "../lib/anim";
import { BRAND, TERMS, SITE_TYPES } from "../data/content";

export default function Register() {
  const [sent, setSent] = useState(false);
  const [siteType, setSiteType] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* slim header */}
      <header className="sticky top-0 z-50 border-b border-ink-hairline bg-paper/85 backdrop-blur">
        <div className="wrap-wide flex h-16 items-center justify-between md:h-18">
          <Link to="/" className="flex items-center gap-3" aria-label="MDG Services home">
            <LogoChip size={38} />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[14px] font-bold tracking-tight text-ink">MDG Services</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                Dealer's <span className="deva normal-case tracking-normal text-navy-700">कवच</span>
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="link-quiet hidden text-[14px] font-medium text-ink-soft hover:text-ink sm:inline">
              ← Back to home
            </Link>
            <a href={BRAND.phoneHref} className="inline-flex items-center gap-2 num text-[14px] font-semibold text-ink">
              <Icon name="phone" size={15} className="text-navy-700" /> {BRAND.phone}
            </a>
          </div>
        </div>
      </header>

      {/* hero band */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-24 h-[26rem] w-[26rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)" }}
        />
        <div className="wrap-wide relative py-16 md:py-20">
          <Reveal>
            <p className="eyebrow-light">
              Dealer enrolment <span className="text-white/30">·</span>{" "}
              <span className="deva normal-case text-gold-300">नामांकन</span>
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-mega text-white" style={{ fontSize: "clamp(38px, 6vw, 76px)" }}>
              Terms &amp; Conditions
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.6] text-navy-100 md:text-[19px]">
              The agreement between you (the Dealer) and MDG Services (the Service
              Provider). Please read it, then enrol below — onboarding begins once
              you accept and submit your details.
            </p>
          </Reveal>
        </div>
      </section>

      {/* terms */}
      <section aria-label="Terms and conditions" className="bg-white">
        <div className="wrap-wide py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="md:sticky md:top-24">
                <p className="eyebrow">The agreement</p>
                <h2 className="mt-5 text-display text-ink" style={{ fontSize: "clamp(26px, 3vw, 36px)" }}>
                  Ten clauses, in plain order.
                </h2>
                <p className="mt-5 max-w-prose2 text-[15px] leading-[1.6] text-ink-soft">
                  Services and rates are set out in <strong className="font-semibold text-ink">Annexure&nbsp;– I</strong>;
                  anything outside it is negotiated between both parties. Questions
                  before you sign?{" "}
                  <a href={BRAND.phoneHref} className="link-quiet font-semibold text-navy-700">
                    Call {BRAND.phone}
                  </a>
                  .
                </p>
              </div>
            </div>

            <Stagger gap={0.05} className="md:col-span-8">
              <ol className="space-y-0">
                {TERMS.map((clause, i) => (
                  <motion.li
                    key={i}
                    variants={itemUp}
                    className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-ink-hairline py-6 first:border-t-0 first:pt-0"
                  >
                    <span className="num text-[15px] font-bold text-navy-300">{String(i + 1).padStart(2, "0")}</span>
                    <p className="max-w-[68ch] text-[15.5px] leading-[1.7] text-ink-soft">{clause}</p>
                  </motion.li>
                ))}
              </ol>
            </Stagger>
          </div>
        </div>
      </section>

      {/* form */}
      <section id="enrol" aria-label="Enrolment form" className="border-t border-ink-hairline bg-paper-warm">
        <div className="wrap-narrow py-20 md:py-24">
          <Reveal>
            <p className="eyebrow">Enrol now</p>
            <h2 className="mt-5 text-display text-ink" style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}>
              Register your dealership.
            </h2>
            <p className="mt-4 max-w-prose2 text-[16px] leading-[1.6] text-ink-soft">
              A few details to get started. Fields marked <span className="text-gold-600">*</span> are required.
            </p>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mt-10"
          >
            {sent ? (
              <SuccessCard />
            ) : (
              <form onSubmit={handleSubmit} aria-label="Dealer enrolment" className="card p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Your Name" name="name" placeholder="Ramesh Kumar" required />
                  <Field
                    label="Your Mobile"
                    name="mobile"
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9+\s\-]{10,15}"
                    placeholder="Your mobile number"
                    required
                  />
                  <Field
                    label="Your Email"
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder="Enter your email"
                    className="sm:col-span-2"
                  />
                </div>

                {/* Site type */}
                <fieldset className="mt-6" aria-required>
                  <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                    Site type <span className="text-gold-600">*</span>
                  </legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {SITE_TYPES.map((t) => (
                      <label
                        key={t}
                        className={
                          "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-200 " +
                          (siteType === t
                            ? "border-navy-700 bg-navy-50"
                            : "border-ink-hairline bg-white hover:border-navy-300")
                        }
                      >
                        <input
                          type="radio"
                          name="siteType"
                          value={t}
                          required
                          checked={siteType === t}
                          onChange={() => setSiteType(t)}
                          className="h-4 w-4 accent-navy-700"
                        />
                        <span className="text-[15px] font-medium text-ink">{t}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <Field label="Pump Name" name="pumpName" placeholder="Your pump's name" />
                  <Field label="SAP Code" name="sapCode" placeholder="Your SAP code" required />
                </div>

                {/* Agreement */}
                <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-ink-hairline bg-white p-4">
                  <input type="checkbox" name="agree" required className="mt-0.5 h-5 w-5 accent-navy-700" />
                  <span className="text-[14.5px] leading-[1.55] text-ink-soft">
                    I have read and <span className="font-semibold text-ink">agree to the Terms &amp; Conditions</span>{" "}
                    set out above. <span className="text-gold-600">*</span>
                  </span>
                </label>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-[13px] text-ink-muted">We will never share your details.</p>
                  <button type="submit" className="btn-primary">
                    Submit <Icon name="arrow" size={16} />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SuccessCard() {
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-ok/30 bg-ok-tint p-7 sm:p-9">
      <div className="flex items-center gap-2.5 text-ok">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-white">
          <Icon name="check" size={17} strokeWidth={2.4} />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">Enrolment received</span>
      </div>
      <p className="mt-5 font-display text-[26px] font-semibold leading-tight text-ink">
        Thank you — your details are with us.
      </p>
      <p className="mt-3 max-w-prose2 text-[16px] leading-[1.6] text-ink-soft">
        A team member will call to confirm your services and pricing, usually
        within the hour ({BRAND.hours.toLowerCase()}). Can't wait?{" "}
        <a href={BRAND.phoneHref} className="link-quiet font-semibold text-navy-700">
          Call us directly
        </a>
        .
      </p>
      <Link to="/" className="btn-ghost mt-7">
        Back to home
      </Link>
    </div>
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
  label: ReactNode;
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
        {required && <span className="ml-1 text-gold-600">*</span>}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        required={required}
        placeholder={placeholder}
        className="mt-2.5 w-full rounded-xl border border-ink-hairline bg-white px-4 py-3.5 text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500"
      />
    </label>
  );
}
