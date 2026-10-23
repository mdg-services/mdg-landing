"use client";

import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import Icon from "./Icon";
import CallUs from "./CallUs";
import { Reveal } from "../lib/reveal";
import { usePresence } from "../lib/usePresence";
import { useSubmissionId } from "../lib/submissionId";
import { onMobileInput, toMobile } from "../lib/mobile";
import { SITE_TYPES } from "../data/content";
import { useLang, useT } from "../i18n/client";
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
  const { ui } = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [siteType, setSiteType] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  // Refused for coming too often, which "please try again" would not fix.
  const [busy, setBusy] = useState(false);
  // What is wrong with the two password boxes, shown under the one it is about.
  const [passwordProblem, setPasswordProblem] = useState<PasswordProblem | null>(null);
  // The same form pressed again carries the same id, so if a send is cut off
  // and the dealer presses Submit again, the team's admin list shows one
  // registration and not two. A form changed since the last try gets a new
  // one, so a correction is never taken for a replay.
  const submissionIdFor = useSubmissionId();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const mobile = String(fd.get("mobile") ?? "").trim();
    // Exactly as typed: a password with a space at either end is a password.
    const password = String(fd.get("password") ?? "");
    const problem = passwordProblemOf(password, String(fd.get("passwordConfirm") ?? ""));
    if (problem) {
      setPasswordProblem(problem);
      const box = form.elements.namedItem(problem === "short" ? "password" : "passwordConfirm");
      if (box instanceof HTMLInputElement) box.focus();
      return;
    }
    const fields = {
      name: String(fd.get("name") ?? "").trim(),
      // As ten plain digits, however it was typed; the box's own check has
      // already stopped anything that is not a mobile.
      mobile: toMobile(mobile) ?? mobile,
      email: String(fd.get("email") ?? "").trim(),
      siteType,
      pumpName: String(fd.get("pumpName") ?? "").trim(),
      sapCode: String(fd.get("sapCode") ?? "").trim(),
      agree: agreed,
      // The one tick also agrees to the WhatsApp messages about the account,
      // and the label next to it says so.
      consentWhatsApp: agreed,
      password,
      lang,
      // The film link's code, when the dealer came from one, so the team can
      // see which message brought them. Only a well-formed one is sent.
      ref: refFromAddress(),
    };
    // The password is part of what makes two attempts "the same form" (in
    // memory only, never sent): a corrected password is a new registration to
    // the API, not a replay of the first.
    const payload = { ...fields, submissionId: submissionIdFor(fields) };

    setBusy(false);
    setPasswordProblem(null);
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
              <form
                // POST, never the browser's default GET: on a slow phone a tap
                // can land before this page's script has loaded, and a GET would
                // put the chosen password in the address, the history and the
                // host's access log. With POST nothing typed reaches a URL.
                method="post"
                onSubmit={handleSubmit}
                onInput={onMobileInput("mobile", ui.mobileInvalid)}
                aria-label={r.formAria}
                className="card p-5 sm:p-8"
              >
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

                {/* The password the dealer signs in to the app with. Chosen
                    here so nobody at MDG ever has to make one or pass one on. */}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <PasswordField
                    r={r}
                    label={r.fields.password.label}
                    name="password"
                    placeholder={r.fields.password.placeholder}
                    hint={r.fields.password.hint}
                    problem={passwordProblem === "short" ? r.passwordShort : undefined}
                    onType={() => setPasswordProblem(null)}
                    className="sm:col-span-2"
                  />
                  <PasswordField
                    r={r}
                    label={r.fields.passwordConfirm.label}
                    name="passwordConfirm"
                    placeholder={r.fields.passwordConfirm.placeholder}
                    problem={passwordProblem === "mismatch" ? r.passwordMismatch : undefined}
                    onType={() => setPasswordProblem(null)}
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
        // The call choice's layer (CallSheet.tsx): above the assistant's
        // launcher (z-70), which on a phone otherwise sat on this sheet's
        // Close button. The call choice still opens over it from the "call
        // us" link in the clauses, because it comes later on the page.
        <div
          className="sheet-fade fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
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
      {/* The one promise, with no time in it: when the team calls is theirs to
          say. Then what comes after, in order. */}
      <p className="mt-3 max-w-prose2 text-[15.5px] font-semibold leading-[1.6] text-ink sm:text-[16px]">
        {r.success.promise}
      </p>
      <p className="mt-2 max-w-prose2 text-[15.5px] leading-[1.6] text-ink-soft sm:text-[16px]">
        {r.success.next}
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

type PasswordProblem = "short" | "mismatch";

/** What is wrong with the two password boxes, or null when they are fine. The server keeps the same minimum. */
function passwordProblemOf(password: string, again: string): PasswordProblem | null {
  if (password.length < 8) return "short";
  if (password !== again) return "mismatch";
  return null;
}

/**
 * The film link's share code (`?r=`) this page was opened with, when it is one
 * the API will take. Read when the form is sent, not when the page is drawn:
 * the page is built once and the code is the visitor's own.
 */
function refFromAddress(): string | undefined {
  try {
    const code = new URLSearchParams(window.location.search).get("r");
    return code && /^[A-Za-z0-9_-]{1,32}$/.test(code) ? code : undefined;
  } catch {
    return undefined;
  }
}

/**
 * A password box with a Show / Hide button inside it. It is an ordinary
 * uncontrolled field (the form reads it from its `FormData`), so the value
 * stays in the browser until Submit; only the box's type flips. Browsers are
 * told it is a NEW password, so they offer to save it rather than fill it in.
 */
function PasswordField({
  r,
  label,
  name,
  placeholder,
  hint,
  problem,
  onType,
  className,
}: {
  r: Dict["register"];
  label: ReactNode;
  name: string;
  placeholder?: string;
  hint?: string;
  problem?: string;
  onType: () => void;
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className={"block " + (className ?? "")}>
      <label>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          {label}
          <span className="ml-1 text-gold-600">*</span>
        </span>
        <span className="relative mt-2.5 block">
          <input
            name={name}
            type={shown ? "text" : "password"}
            required
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={placeholder}
            aria-invalid={problem ? true : undefined}
            aria-describedby={problem ? `${name}-problem` : undefined}
            onInput={onType}
            className={
              "w-full rounded-xl border bg-white py-3.5 pl-4 pr-20 text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500 " +
              (problem ? "border-gold-500" : "border-ink-hairline")
            }
          />
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-pressed={shown}
            aria-label={shown ? r.passwordHideAria : r.passwordShowAria}
            className="absolute inset-y-0 right-0 px-4 text-[14px] font-semibold text-navy-700 underline decoration-navy-300 underline-offset-2 transition-colors hover:decoration-navy-700"
          >
            {shown ? r.passwordHide : r.passwordShow}
          </button>
        </span>
      </label>
      {problem ? (
        <p id={`${name}-problem`} role="alert" className="mt-2 text-[13.5px] font-medium text-gold-700">
          {problem}
        </p>
      ) : hint ? (
        <p className="mt-2 text-[13px] leading-[1.5] text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  inputMode,
  placeholder,
  required,
  className,
}: {
  label: ReactNode;
  name: string;
  type?: string;
  inputMode?: "tel" | "text" | "email" | "search" | "url" | "numeric";
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
        required={required}
        placeholder={placeholder}
        className="mt-2.5 w-full rounded-xl border border-ink-hairline bg-white px-4 py-3.5 text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500"
      />
    </label>
  );
}
