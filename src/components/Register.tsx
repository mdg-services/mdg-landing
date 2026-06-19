import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LogoChip } from "./Brand";
import Icon from "./Icon";
import Footer from "./Footer";
import { Reveal } from "../lib/motion";
import { EASE } from "../lib/anim";
import { BRAND, TERMS, SITE_TYPES } from "../data/content";

type Status = "idle" | "submitting" | "success" | "error";

export default function Register() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [siteType, setSiteType] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      mobile: String(fd.get("mobile") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      siteType,
      pumpName: String(fd.get("pumpName") ?? "").trim(),
      sapCode: String(fd.get("sapCode") ?? "").trim(),
      agree: agreed,
    };

    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* slim header */}
      <header className="sticky top-0 z-40 border-b border-ink-hairline bg-paper/85 backdrop-blur">
        <div className="wrap-wide flex h-16 items-center justify-between md:h-[72px]">
          <Link to="/" className="flex items-center gap-2.5" aria-label="MDG Services home">
            <LogoChip size={36} />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[14px] font-bold tracking-tight text-ink">MDG Services</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                Dealer's <span className="deva normal-case tracking-normal text-navy-700">कवच</span>
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/" className="link-quiet hidden text-[14px] font-medium text-ink-soft hover:text-ink sm:inline">
              ← Back to home
            </Link>
            <a href={BRAND.phoneHref} className="inline-flex items-center gap-2 num text-[13.5px] font-semibold text-ink sm:text-[14px]">
              <Icon name="phone" size={15} className="text-navy-700" />
              1800&#8209;345&#8209;6512
            </a>
          </div>
        </div>
      </header>

      {/* hero band */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-20 h-[22rem] w-[22rem] rounded-full sm:h-[26rem] sm:w-[26rem]"
          style={{ background: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)" }}
        />
        <div className="wrap-wide relative py-12 sm:py-16 md:py-20">
          <Reveal>
            <p className="eyebrow-light">
              Dealer enrolment <span className="text-white/30">·</span>{" "}
              <span className="deva normal-case text-gold-300">नामांकन</span>
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 text-mega text-white" style={{ fontSize: "clamp(34px, 6vw, 72px)" }}>
              Register your dealership.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-[16px] leading-[1.6] text-navy-100 sm:text-[18px]">
              A few details and you're in. Pick the site that fits your pump — we
              confirm the services and lock your pricing in writing before we
              begin.
            </p>
          </Reveal>
        </div>
      </section>

      {/* form */}
      <section id="enrol" aria-label="Enrolment form" className="bg-paper-warm">
        <div className="wrap-narrow py-12 sm:py-16 md:py-20">
          <Reveal>
            <p className="text-[15px] text-ink-soft">
              Fields marked <span className="text-gold-600">*</span> are required.
            </p>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="mt-5"
          >
            {status === "success" ? (
              <SuccessCard />
            ) : (
              <form onSubmit={handleSubmit} aria-label="Dealer enrolment" className="card p-5 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
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
                <fieldset className="mt-5">
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

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="Pump Name" name="pumpName" placeholder="Your pump's name" />
                  <Field label="SAP Code" name="sapCode" placeholder="Your SAP code" required />
                </div>

                {/* Agreement — clicking the link opens the T&C modal (not toggling the box) */}
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-ink-hairline bg-white p-4">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    aria-label="I agree to the Terms and Conditions"
                    className="mt-0.5 h-5 w-5 shrink-0 accent-navy-700"
                  />
                  <span className="text-[14.5px] leading-[1.55] text-ink-soft">
                    I have read and agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="font-semibold text-navy-700 underline decoration-navy-300 underline-offset-2 transition-colors hover:decoration-navy-700"
                    >
                      Terms &amp; Conditions
                    </button>
                    . <span className="text-gold-600">*</span>
                  </span>
                </div>

                {status === "error" && (
                  <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-gold-300 bg-gold-50 p-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950">
                      <Icon name="siren" size={14} />
                    </span>
                    <p className="text-[14px] leading-[1.5] text-ink-soft">
                      {errorMsg}{" "}
                      <a href={BRAND.phoneHref} className="link-quiet font-semibold text-navy-700">
                        Or call {BRAND.phone}
                      </a>
                      .
                    </p>
                  </div>
                )}

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="order-2 text-[13px] text-ink-muted sm:order-1">
                    We will never share your details.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={
                      "btn-primary order-1 w-full sm:order-2 sm:w-auto" +
                      (status === "submitting" ? " pointer-events-none opacity-70" : "")
                    }
                  >
                    {status === "submitting" ? (
                      "Submitting…"
                    ) : (
                      <>
                        Submit <Icon name="arrow" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} onAgree={() => { setAgreed(true); setTermsOpen(false); }} />
    </div>
  );
}

function TermsModal({
  open,
  onClose,
  onAgree,
}: {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

          {/* panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            className="relative flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-white shadow-lift sm:max-h-[82vh] sm:max-w-2xl sm:rounded-3xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4 border-b border-ink-hairline px-5 py-4 sm:px-7 sm:py-5">
              <div>
                <p className="eyebrow">The agreement</p>
                <h2 id="terms-title" className="mt-2 font-display text-[22px] font-semibold leading-tight text-ink sm:text-[26px]">
                  Terms &amp; Conditions
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-hairline text-ink-soft transition-colors hover:border-navy-300 hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* scrollable clauses */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
              <ol className="space-y-0">
                {TERMS.map((clause, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-ink-hairline py-4 first:border-t-0 first:pt-0 sm:gap-x-5"
                  >
                    <span className="num text-[14px] font-bold text-navy-300">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-[14.5px] leading-[1.7] text-ink-soft sm:text-[15px]">{clause}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 rounded-xl bg-paper-warm p-4 text-[13.5px] leading-[1.6] text-ink-muted">
                Services and rates are set out in <strong className="font-semibold text-ink">Annexure&nbsp;– I</strong>;
                anything outside it is negotiated between both parties. Questions before you sign?{" "}
                <a href={BRAND.phoneHref} className="font-semibold text-navy-700">Call {BRAND.phone}</a>.
              </p>
            </div>

            {/* footer actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-ink-hairline px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7 sm:py-5">
              <button type="button" onClick={onClose} className="btn-ghost w-full sm:w-auto">
                Close
              </button>
              <button type="button" onClick={onAgree} className="btn-primary w-full sm:w-auto">
                I agree &amp; continue <Icon name="check" size={16} strokeWidth={2.2} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessCard() {
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-ok/30 bg-ok-tint p-6 sm:p-9">
      <div className="flex items-center gap-2.5 text-ok">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-white">
          <Icon name="check" size={17} strokeWidth={2.4} />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">Enrolment received</span>
      </div>
      <p className="mt-5 font-display text-[23px] font-semibold leading-tight text-ink sm:text-[26px]">
        Thank you — your details are with us.
      </p>
      <p className="mt-3 max-w-prose2 text-[15.5px] leading-[1.6] text-ink-soft sm:text-[16px]">
        A team member will call to confirm your services and pricing, usually
        within the hour ({BRAND.hours.toLowerCase()}). Can't wait?{" "}
        <a href={BRAND.phoneHref} className="link-quiet font-semibold text-navy-700">
          Call us directly
        </a>
        .
      </p>
      <Link to="/" className="btn-ghost mt-7 w-full sm:w-auto">
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
