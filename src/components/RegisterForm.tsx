"use client";

import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import Icon from "./Icon";
import CallUs from "./CallUs";
import { Reveal } from "../lib/reveal";
import { usePresence } from "../lib/usePresence";
import { useSubmissionId } from "../lib/submissionId";
import { SITE_TYPES } from "../data/content";
import { useLang } from "../i18n/client";
import { pathFor, type Dict, type Lang } from "../i18n/lang";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The enrolment form: the one interactive part of /register. The page around it
 * (header, heading, footer) is server HTML; see `FormShell.tsx`.
 *
 * `r` is this page's words, in the language of the URL. `originalTerms` is the
 * English agreement, given only on a page that is not already in the language
 * the agreement was signed in (the terms dialog offers it as the original).
 */
export default function RegisterForm({
  r,
  originalTerms,
}: {
  r: Dict["register"];
  originalTerms?: Dict["register"]["terms"];
}) {
  const { lang } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [siteType, setSiteType] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  // Refused for coming too often, which "please try again" would not fix.
  const [busy, setBusy] = useState(false);
  // The same form pressed again carries the same id, so if a send is cut off
  // and the dealer presses Submit again, the team's admin list shows one
  // registration and not two. A form changed since the last try gets a new
  // one, so a correction is never taken for a replay.
  const submissionIdFor = useSubmissionId();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fields = {
      name: String(fd.get("name") ?? "").trim(),
      mobile: String(fd.get("mobile") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      siteType,
      pumpName: String(fd.get("pumpName") ?? "").trim(),
      sapCode: String(fd.get("sapCode") ?? "").trim(),
      agree: agreed,
    };
    const payload = { ...fields, submissionId: submissionIdFor(fields) };

    setBusy(false);
    setStatus("submitting");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setBusy(res.status === 429);
        throw new Error(data.error || `Enrolment failed (${res.status})`);
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // The API answers in English and its messages are generic, so the page
      // shows its own message in the language on screen. The real one is kept
      // for the console.
      console.error("[enroll]", err);
      setStatus("error");
    }
  }

  return (
    <>
      {/* form */}
      <section id="enrol" aria-label={r.sectionAria} className="bg-paper-warm">
        <div className="wrap-narrow py-12 sm:py-16 md:py-20">
          <Reveal>
            <p className="text-[15px] text-ink-soft">
              {r.requiredLead} <span className="text-gold-600">*</span> {r.requiredTail}
            </p>
          </Reveal>

          <div className="enter mt-5" style={{ "--rise-y": "16px", "--dur": "0.6s", "--d": "0.05s" } as CSSProperties}>
            {status === "success" ? (
              <SuccessCard r={r} lang={lang} />
            ) : (
              <form onSubmit={handleSubmit} aria-label={r.formAria} className="card p-5 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={r.fields.name.label}
                    name="name"
                    placeholder={r.fields.name.placeholder}
                    required
                  />
                  <Field
                    label={r.fields.mobile.label}
                    name="mobile"
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9+\s\-]{10,15}"
                    placeholder={r.fields.mobile.placeholder}
                    required
                  />
                  <Field
                    label={r.fields.email.label}
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder={r.fields.email.placeholder}
                    className="sm:col-span-2"
                  />
                </div>

                {/* Site type */}
                <fieldset className="mt-5">
                  <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                    {r.siteTypeLegend} <span className="text-gold-600">*</span>
                  </legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {SITE_TYPES.map((value) => (
                      <label
                        key={value}
                        className={
                          "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-200 " +
                          (siteType === value
                            ? "border-navy-700 bg-navy-50"
                            : "border-ink-hairline bg-white hover:border-navy-300")
                        }
                      >
                        <input
                          type="radio"
                          name="siteType"
                          value={value}
                          required
                          checked={siteType === value}
                          onChange={() => setSiteType(value)}
                          className="h-4 w-4 accent-navy-700"
                        />
                        <span className="text-[15px] font-medium text-ink">{r.siteTypes[value]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label={r.fields.pumpName.label}
                    name="pumpName"
                    placeholder={r.fields.pumpName.placeholder}
                  />
                  <Field
                    label={r.fields.sapCode.label}
                    name="sapCode"
                    placeholder={r.fields.sapCode.placeholder}
                    required
                  />
                </div>

                {/* Agreement — clicking the link opens the T&C modal (not toggling the box) */}
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-ink-hairline bg-white p-4">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    aria-label={r.agreeAria}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-navy-700"
                  />
                  <span className="text-[14.5px] leading-[1.55] text-ink-soft">
                    {r.agreeLead}{" "}
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="font-semibold text-navy-700 underline decoration-navy-300 underline-offset-2 transition-colors hover:decoration-navy-700"
                    >
                      {r.termsLink}
                    </button>
                    {r.agreeTail} <span className="text-gold-600">*</span>
                  </span>
                </div>

                {status === "error" && (
                  <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-gold-300 bg-gold-50 p-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950">
                      <Icon name="siren" size={14} />
                    </span>
                    <p className="text-[14px] leading-[1.5] text-ink-soft">
                      {busy ? r.errorBusy : r.errorGeneric}{" "}
                      <CallUs
                        label={r.errorCallLink}
                        className="link-quiet font-semibold text-navy-700 align-baseline"
                      />
                      {r.errorEnd}
                    </p>
                  </div>
                )}

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="order-2 text-[13px] text-ink-muted sm:order-1">
                    {r.privacy}
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
                      r.submitting
                    ) : (
                      <>
                        {r.submit} <Icon name="arrow" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <TermsModal
        r={r}
        originalTerms={originalTerms}
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        onAgree={() => { setAgreed(true); setTermsOpen(false); }}
      />
    </>
  );
}

function TermsModal({
  r,
  originalTerms,
  open,
  onClose,
  onAgree,
}: {
  r: Dict["register"];
  originalTerms?: Dict["register"]["terms"];
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}) {
  /* A translation of a contract is not the contract. Where the page is not
     already in the language the agreement was signed in, the modal says so
     and offers the original clauses; `bindingNotice` is empty on the page
     that is already binding, and then there is nothing to offer. */
  const courtesy = r.bindingNotice !== "";
  const [original, setOriginal] = useState(false);
  const clauses = courtesy && original && originalTerms ? originalTerms : r.terms;

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

  // stays on the page for its closing animation after `open` is false
  const { mounted, leaving } = usePresence(open, 320);

  return (
    <>
      {mounted && (
        <div
          className="sheet-fade fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          data-leaving={leaving ? "" : undefined}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

          {/* panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            className="sheet-rise relative flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-white shadow-lift sm:max-h-[82vh] sm:max-w-2xl sm:rounded-3xl"
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4 border-b border-ink-hairline px-5 py-4 sm:px-7 sm:py-5">
              <div>
                <p className="eyebrow">{r.termsEyebrow}</p>
                <h2 id="terms-title" className="mt-2 font-display text-[22px] font-semibold leading-tight text-ink sm:text-[26px]">
                  {r.termsTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={r.close}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-hairline text-ink-soft transition-colors hover:border-navy-300 hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* scrollable clauses */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
              {courtesy && (
                <div className="mb-5 flex flex-col gap-3 rounded-xl border border-ink-hairline bg-paper-warm p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[13.5px] leading-[1.6] text-ink-muted">{r.bindingNotice}</p>
                  <button
                    type="button"
                    onClick={() => setOriginal((v) => !v)}
                    aria-pressed={original}
                    className="shrink-0 self-start font-semibold text-navy-700 underline decoration-navy-300 underline-offset-4 transition-colors hover:decoration-navy-700 sm:self-auto"
                  >
                    {original ? r.showHindi : r.showEnglish}
                  </button>
                </div>
              )}
              <ol className="space-y-0" lang={courtesy && original ? "en" : undefined}>
                {clauses.map((clause, i) => (
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
                {r.annexureLead}{" "}
                <strong className="font-semibold text-ink">Annexure&nbsp;I</strong>
                {r.annexureTail}{" "}
                <CallUs
                  label={r.annexureCallLink}
                  className="font-semibold text-navy-700 align-baseline"
                />
                {r.annexureEnd}
              </p>
            </div>

            {/* footer actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-ink-hairline px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7 sm:py-5">
              <button type="button" onClick={onClose} className="btn-ghost w-full sm:w-auto">
                {r.close}
              </button>
              <button type="button" onClick={onAgree} className="btn-primary w-full sm:w-auto">
                {r.agreeContinue} <Icon name="check" size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SuccessCard({ r, lang }: { r: Dict["register"]; lang: Lang }) {
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-ok/30 bg-ok-tint p-6 sm:p-9">
      <div className="flex items-center gap-2.5 text-ok">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-white">
          <Icon name="check" size={17} strokeWidth={2.4} />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">{r.success.badge}</span>
      </div>
      <p className="mt-5 font-display text-[23px] font-semibold leading-tight text-ink sm:text-[26px]">
        {r.success.heading}
      </p>
      <p className="mt-3 max-w-prose2 text-[15.5px] leading-[1.6] text-ink-soft sm:text-[16px]">
        {/* The opening hours sit inside the sentence, not on the end of it, so
            each language can place them where it reads best. */}
        {r.success.bodyLead.replace("{hours}", r.hours)}{" "}
        <CallUs
          label={r.success.callLink}
          className="link-quiet font-semibold text-navy-700 align-baseline"
        />
        {r.success.bodyEnd}
      </p>
      <Link href={pathFor(lang)} className="btn-ghost mt-7 w-full sm:w-auto">
        {r.backToHome}
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
