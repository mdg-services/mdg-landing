"use client";

import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import CallUs from "./CallUs";
import { requestCallChoice } from "../lib/assistCall";
import { postCallback } from "../lib/callback";
import { TOLL_FREE } from "../lib/tollFree";
import { Reveal } from "../lib/reveal";
import { onMobileInput, toMobile } from "../lib/mobile";
import { useT } from "../i18n/client";
import type { Dict } from "../i18n/lang";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact({ c }: { c: Dict["contact"] }) {
  const { ui } = useT();
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") ?? "").trim();
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      // As ten plain digits, however it was typed; the box's own check has
      // already stopped anything that is not a mobile.
      phone: toMobile(phone) ?? phone,
      outlet: String(fd.get("outlet") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      // The hidden box: the server quietly drops a request a script filled in.
      website: String(fd.get("website") ?? ""),
    };

    setStatus("submitting");
    try {
      await postCallback(payload);
      setStatus("success");
    } catch (err) {
      // The API answers in English and both of its messages are generic, so
      // the page shows its own message in the language on screen. The real
      // one is kept for the console.
      console.error("[callback]", err);
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="border-t border-ink-hairline bg-white">
      <div className="wrap-full py-24 md:py-32">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <p className="eyebrow">{c.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-mega text-ink" style={{ fontSize: "clamp(38px, 6.2vw, 96px)" }}>
                {c.headingLead} <br />
                <span className="text-navy-700">{c.headingAccent}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="md:col-span-4">
            <p className="max-w-prose2 text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">
              {c.intro}
            </p>
          </Reveal>
        </div>

        {/* phone hero */}
        <Reveal delay={0.1}>
          {/* This card used to be the toll-free number, set enormous. The act
              of calling is what is set enormous now; the tap opens the call
              choice — the toll-free line or the assistant in the tab — and
              the number sits under the heading for anyone dialling by hand. */}
          <button
            type="button"
            onClick={requestCallChoice}
            className="group mt-14 block w-full rounded-3xl border border-ink-hairline bg-navy-950 p-8 text-left text-white transition-shadow duration-300 hover:shadow-navy md:mt-16 md:p-12"
          >
            <div aria-hidden className="pointer-events-none relative">
              <div className="absolute inset-0 -m-8 bg-grid-dark opacity-30 md:-m-12" />
            </div>
            <div className="relative flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-navy-200">
                {c.tollFree} <span className="mx-1.5 text-white/30">·</span>{" "}
                <span className="deva normal-case text-gold-300">{c.tollFreeDeva}</span>
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-navy-200">{c.hours}</span>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-5 md:gap-7">
              <span
                aria-hidden
                className="grid shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950 transition-transform duration-300 group-hover:scale-105"
                style={{ width: "clamp(64px, 12vw, 104px)", height: "clamp(64px, 12vw, 104px)" }}
              >
                <Icon name="phone" size={40} />
              </span>
              <span
                className="min-w-0 font-semibold text-white"
                style={{ fontSize: "clamp(30px, 6vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
              >
                {c.callHeading}
              </span>
            </div>
            <div className="relative mt-4 whitespace-nowrap text-[22px] font-semibold tracking-tight text-gold-300 md:text-[28px]">
              {TOLL_FREE.display}
            </div>
            <div className="relative mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-gold-300">
              {c.tapToCall}{" "}
              <Icon name="arrow" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        </Reveal>

        {/* callback form */}
        <div className="mt-14 grid items-start gap-8 border-t border-ink-hairline pt-12 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">{c.callbackEyebrow}</p>
            <h3 className="mt-5 font-display text-[24px] font-semibold leading-tight text-ink md:text-[28px]">
              {c.callbackHeading}
            </h3>
            <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.6] text-ink-soft">
              {/* The opening hours sit inside the sentence, not on the end of
                  it, so each language can place them where it reads best. */}
              {c.callbackNote.replace("{hours}", c.hoursLower)}
            </p>
            {!showForm && (
              <button type="button" onClick={() => setShowForm(true)} className="btn-ghost mt-6">
                {c.leaveNumber} <Icon name="arrowDown" size={16} />
              </button>
            )}
          </Reveal>

          <div className="md:col-span-7">
            <div className="disclose" data-open={showForm} aria-hidden={!showForm}>
              <div>
                {status !== "success" ? (
                  <form onSubmit={handleSubmit} onInput={onMobileInput("phone", ui.mobileInvalid)} aria-label={c.formAria}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label={c.fields.name.label}
                        name="name"
                        placeholder={c.fields.name.placeholder}
                        required
                      />
                      <Field
                        label={c.fields.outlet.label}
                        name="outlet"
                        placeholder={c.fields.outlet.placeholder}
                      />
                      <Field
                        label={c.fields.phone.label}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        placeholder={c.fields.phone.placeholder}
                        required
                        className="sm:col-span-2"
                      />
                    </div>
                    {/* A box no person sees or can reach. Programs that fill in
                        every box they find fill this one too. Not displayed,
                        so the browser's autofill leaves it empty as well. */}
                    <div hidden>
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </div>
                    {status === "error" && (
                      <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-gold-300 bg-gold-50 p-4">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950">
                          <Icon name="siren" size={14} />
                        </span>
                        <p className="text-[14px] leading-[1.5] text-ink-soft">
                          {c.errorGeneric}{" "}
                          <CallUs
                            label={c.errorCallLink}
                            className="link-quiet font-semibold text-navy-700 align-baseline"
                          />
                          {c.errorEnd}
                        </p>
                      </div>
                    )}
                    <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="order-2 text-[13px] text-ink-muted sm:order-1">{c.privacy}</p>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className={"btn-primary order-1 w-full sm:order-2 sm:w-auto" + (status === "submitting" ? " pointer-events-none opacity-70" : "")}
                      >
                        {status === "submitting" ? (
                          c.submitting
                        ) : (
                          <>
                            {c.submit} <Icon name="arrow" size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div role="status" aria-live="polite" className="rounded-2xl border border-ok/30 bg-ok-tint p-7">
                    <div className="flex items-center gap-2.5 text-ok">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-ok text-white">
                        <Icon name="check" size={15} strokeWidth={2.4} />
                      </span>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">{c.success.badge}</span>
                    </div>
                    <p className="mt-4 font-display text-[22px] font-semibold leading-tight text-ink">
                      {c.success.heading}
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">
                      {c.success.bodyLead}{" "}
                      <CallUs
                        label={c.success.callLink}
                        className="link-quiet font-semibold text-navy-700 align-baseline"
                      />
                      {c.success.bodyEnd}
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
  placeholder,
  required,
  className,
}: {
  label: string;
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
        {required && <span className="ml-1 text-gold-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        className="mt-2.5 w-full rounded-xl border border-ink-hairline bg-paper-warm px-4 py-3.5 text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500 focus:bg-white"
      />
    </label>
  );
}
