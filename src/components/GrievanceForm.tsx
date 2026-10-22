"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import Icon from "./Icon";
import CallUs from "./CallUs";
import { Reveal } from "../lib/reveal";
import { useSubmissionId } from "../lib/submissionId";
import { onMobileInput, toMobile } from "../lib/mobile";
import { GRIEVANCE_CATEGORIES } from "../data/content";
import { useLang, useT } from "../i18n/client";
import { pathFor, type Dict, type Lang } from "../i18n/lang";

type Status = "idle" | "submitting" | "success" | "error";

/** What the server answered: the number the person is given, and whether an email went with it. */
type Sent = { ref: string; emailed: boolean; email: string };

/** The server's own limits on what was written, kept here so the boxes can show them. */
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 3000;
const NAME_MAX = 120;
const OUTLET_MAX = 160;
const EMAIL_MAX = 200;

/** The boxes the server can name when it turns a grievance back, and the page has a line for. */
const NAMED_FIELDS = ["email", "mobile", "message"] as const;
type NamedField = (typeof NAMED_FIELDS)[number];

/**
 * The grievance form: the one interactive part of /grievance. The page around
 * it (header, heading, footer) is server HTML; see `FormShell.tsx`.
 *
 * `g` is this page's words, in the language of the URL.
 */
export default function GrievanceForm({ g }: { g: Dict["grievance"] }) {
  const { lang } = useLang();
  const { ui } = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [tooShort, setTooShort] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  // The box the server said it did not accept, if it named one.
  const [problem, setProblem] = useState<NamedField | null>(null);
  // Refused for coming too often, which "please try again" would not fix.
  const [busy, setBusy] = useState(false);
  // The same form pressed again carries the same id, so the server finds the
  // grievance a cut-off first try already saved. A form changed since the
  // last try gets a new one, so a correction is never taken for a replay.
  const submissionIdFor = useSubmissionId();
  // When the page opened, on this device's own clock: the server drops a form
  // sent faster than a person could have filled it in.
  const openedAt = useRef(0);
  const messageBox = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // The one rule the browser cannot check: it counts spaces, the server does not.
    if (message.trim().length < MESSAGE_MIN) {
      setTooShort(true);
      messageBox.current?.focus();
      return;
    }

    const fd = new FormData(e.currentTarget);
    const mobile = String(fd.get("mobile") ?? "").trim();
    const fields = {
      name: String(fd.get("name") ?? "").trim(),
      // As ten plain digits, however it was typed; the box's own check has
      // already stopped anything that is not a mobile.
      mobile: toMobile(mobile) ?? mobile,
      email: String(fd.get("email") ?? "").trim(),
      outlet: String(fd.get("outlet") ?? "").trim(),
      category,
      message: message.trim(),
      // The language on screen is the language the reply email is written in.
      lang,
    };
    const payload = {
      submissionId: submissionIdFor(fields),
      ...fields,
      // The hidden box, and how long the page has been open: the server
      // turns back a request a script filled in.
      website: String(fd.get("website") ?? ""),
      elapsed: Math.round(performance.now() - openedAt.current),
    };

    setProblem(null);
    setBusy(false);
    setStatus("submitting");
    try {
      const res = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        ref?: unknown;
        emailed?: unknown;
        error?: string;
        issues?: Record<string, string[] | undefined>;
      };
      if (!res.ok || !data.ok) {
        // A 400 that names a box gets a line about that box, besides the
        // generic note. The words come from this page, in its language; the
        // server's are English and are kept for the console.
        if (res.status === 400) setProblem(NAMED_FIELDS.find((f) => data.issues?.[f]?.length) ?? null);
        setBusy(res.status === 429);
        throw new Error(data.error || `Grievance failed (${res.status})`);
      }
      // The number is what the person is told they now have. An answer that
      // says ok without one is not a saved grievance, so it is an error here.
      if (typeof data.ref !== "string" || !data.ref) throw new Error("Grievance answer had no number");
      setSent({ ref: data.ref, emailed: data.emailed === true, email: payload.email });
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // The API answers in English and its messages are generic, so the page
      // shows its own message in the language on screen. The real one is kept
      // for the console.
      console.error("[grievance]", err);
      setStatus("error");
    }
  }

  return (
    <>
      {/* form */}
      <section id="grievance" aria-label={g.sectionAria} className="bg-paper-warm">
        <div className="wrap-narrow py-12 sm:py-16 md:py-20">
          <Reveal>
            <p className="text-[15px] text-ink-soft">
              {g.requiredLead} <span className="text-gold-600">*</span> {g.requiredTail}
            </p>
          </Reveal>

          <div className="enter mt-5" style={{ "--rise-y": "16px", "--dur": "0.6s", "--d": "0.05s" } as CSSProperties}>
            {status === "success" && sent ? (
              <SuccessCard sent={sent} g={g} lang={lang} />
            ) : (
              <form
                onSubmit={handleSubmit}
                onInput={onMobileInput("mobile", ui.mobileInvalid)}
                aria-label={g.formAria}
                className="card p-5 sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={g.fields.name.label}
                    name="name"
                    autoComplete="name"
                    placeholder={g.fields.name.placeholder}
                    maxLength={NAME_MAX}
                    required
                  />
                  <Field
                    label={g.fields.mobile.label}
                    name="mobile"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={g.fields.mobile.placeholder}
                    required
                  />
                  <Field
                    label={g.fields.email.label}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    // A dot in the domain, which the browser's own email check lets by.
                    pattern="[^@\s]+@[^@\s]+\.[A-Za-z]{2,}"
                    placeholder={g.fields.email.placeholder}
                    hint={g.fields.email.hint}
                    maxLength={EMAIL_MAX}
                    required
                    className="sm:col-span-2"
                  />
                  <Field
                    label={g.fields.outlet.label}
                    name="outlet"
                    placeholder={g.fields.outlet.placeholder}
                    hint={g.fields.outlet.hint}
                    maxLength={OUTLET_MAX}
                    className="sm:col-span-2"
                  />
                </div>

                {/* What it is about */}
                <fieldset className="mt-5">
                  <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                    {g.categoryLegend} <span className="text-gold-600">*</span>
                  </legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {GRIEVANCE_CATEGORIES.map((value) => (
                      <label
                        key={value}
                        className={
                          "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-200 " +
                          (category === value
                            ? "border-navy-700 bg-navy-50"
                            : "border-ink-hairline bg-white hover:border-navy-300")
                        }
                      >
                        <input
                          type="radio"
                          name="category"
                          value={value}
                          required
                          checked={category === value}
                          onChange={() => setCategory(value)}
                          className="h-4 w-4 shrink-0 accent-navy-700"
                        />
                        <span className="text-[15px] font-medium text-ink">{g.categories[value]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* What happened */}
                <MessageBox
                  boxRef={messageBox}
                  value={message}
                  onChange={(v) => {
                    setMessage(v);
                    if (tooShort) setTooShort(false);
                  }}
                  tooShort={tooShort}
                  g={g}
                />

                {/* A box no person sees or can reach. Programs that fill in
                    every box they find fill this one too. Not displayed, so
                    the browser's autofill leaves it empty as well. */}
                <div hidden>
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {status === "error" && (
                  <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-gold-300 bg-gold-50 p-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950">
                      <Icon name="siren" size={14} />
                    </span>
                    <p className="text-[14px] leading-[1.5] text-ink-soft">
                      {busy ? g.errorBusy : g.errorGeneric}{" "}
                      <CallUs
                        label={g.errorCallLink}
                        className="link-quiet font-semibold text-navy-700 align-baseline"
                      />
                      {g.errorEnd}
                      {problem && <span className="mt-1 block font-medium text-ink">{g.errorField[problem]}</span>}
                    </p>
                  </div>
                )}

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="order-2 text-[13px] text-ink-muted sm:order-1">{g.privacy}</p>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={
                      "btn-primary order-1 w-full sm:order-2 sm:w-auto" +
                      (status === "submitting" ? " pointer-events-none opacity-70" : "")
                    }
                  >
                    {status === "submitting" ? (
                      g.submitting
                    ) : (
                      <>
                        {g.submit} <Icon name="arrow" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function SuccessCard({ sent, g, lang }: { sent: Sent; g: Dict["grievance"]; lang: Lang }) {
  const s = g.success;
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-ok/30 bg-ok-tint p-6 sm:p-9">
      <div className="flex items-center gap-2.5 text-ok">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-white">
          <Icon name="check" size={17} strokeWidth={2.4} />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">{s.badge}</span>
      </div>
      <p className="mt-5 font-display text-[23px] font-semibold leading-tight text-ink sm:text-[26px]">
        {s.heading}
      </p>

      {/* The number the person gives when they call or write. Selectable, so
          it can be copied; set large because it is the one thing to keep. */}
      <div className="mt-6 rounded-xl border border-ok/30 bg-white p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          {s.numberLabel}
        </p>
        <p className="mt-2 select-all break-all font-mono text-[32px] font-bold leading-none tracking-[0.04em] text-navy-700 sm:text-[40px]">
          {sent.ref}
        </p>
        <p className="mt-4 text-[15px] leading-[1.6] text-ink-soft">
          {(sent.emailed ? s.emailed : s.notEmailed).replace("{email}", sent.email)} {s.keep}
        </p>
      </div>

      <p className="mt-6 max-w-prose2 text-[15.5px] leading-[1.6] text-ink-soft sm:text-[16px]">
        {s.bodyLead}{" "}
        <CallUs label={s.callLink} className="link-quiet font-semibold text-navy-700 align-baseline" />
        {s.bodyEnd}
      </p>
      <Link href={pathFor(lang)} className="btn-ghost mt-7 w-full sm:w-auto">
        {g.backToHome}
      </Link>
    </div>
  );
}

/** The long box: what happened, with a live count and its own "too short" note. */
function MessageBox({
  boxRef,
  value,
  onChange,
  tooShort,
  g,
}: {
  g: Dict["grievance"];
  boxRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  tooShort: boolean;
}) {
  const noteId = useId();
  return (
    <div className="mt-5">
      <label className="block">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          {g.fields.message.label}
          <span className="ml-1 text-gold-600">*</span>
        </span>
        <textarea
          ref={boxRef}
          name="message"
          rows={6}
          required
          maxLength={MESSAGE_MAX}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={g.fields.message.placeholder}
          aria-describedby={noteId}
          aria-invalid={tooShort}
          className={
            "mt-2.5 block w-full resize-y rounded-xl border bg-white px-4 py-3.5 text-[16px] leading-[1.55] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500 " +
            (tooShort ? "border-gold-500" : "border-ink-hairline")
          }
        />
      </label>
      {/* Outside the label, so neither the count nor the note becomes part of
          the box's name for a screen reader. */}
      <div id={noteId} className="mt-2 flex items-start justify-between gap-4 text-[13px] text-ink-muted">
        <span aria-live="polite" className={tooShort ? "font-medium text-gold-700" : ""}>
          {tooShort ? g.messageShort : ""}
        </span>
        <span className="num shrink-0">
          {g.messageCount.replace("{n}", String(value.length)).replace("{max}", String(MESSAGE_MAX))}
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  inputMode,
  autoComplete,
  pattern,
  placeholder,
  hint,
  maxLength,
  required,
  className,
}: {
  label: ReactNode;
  name: string;
  type?: string;
  inputMode?: "tel" | "text" | "email" | "search" | "url" | "numeric";
  autoComplete?: string;
  pattern?: string;
  placeholder?: string;
  /** A line under the box saying why it is asked for. */
  hint?: string;
  maxLength?: number;
  required?: boolean;
  className?: string;
}) {
  const hintId = useId();
  return (
    <div className={className}>
      <label className="block">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          {label}
          {required && <span className="ml-1 text-gold-600">*</span>}
        </span>
        <input
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          pattern={pattern}
          maxLength={maxLength}
          required={required}
          placeholder={placeholder}
          aria-describedby={hint ? hintId : undefined}
          className="mt-2.5 w-full rounded-xl border border-ink-hairline bg-white px-4 py-3.5 text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500"
        />
      </label>
      {/* Outside the label, so the hint is not read out as part of the box's name. */}
      {hint && (
        <p id={hintId} className="mt-2 text-[13px] text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
