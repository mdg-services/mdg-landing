"use client";

import { useState, type FormEvent } from "react";
import CallUs from "../CallUs";
import Icon from "../Icon";
import { KK_ANCHORS, KK_APPS } from "../../data/kk";
import { postCallback } from "../../lib/callback";
import { onMobileInput, toMobile } from "../../lib/mobile";
import { useT } from "../../i18n/client";
import type { Dict } from "../../i18n/lang";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The way in: call, or leave a number and say who you are (a pump owner or a
 * transporter). The form posts to the site's existing call-back route; the
 * product and the role travel in its message line ("Khata Kavach · Pump
 * owner"), so the team knows which call this is. Nothing on the server
 * changed for it. The role tag is always English, because the team reads it.
 *
 * Its words are passed in by the page: this file ships to the browser and the
 * two dictionaries must not.
 */
export default function KkCta({
  t,
  contact,
}: {
  t: Dict["kk"]["cta"];
  contact: Pick<Dict["contact"], "errorGeneric" | "errorCallLink" | "errorEnd" | "submitting" | "privacy" | "success">;
}) {
  const { ui } = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [role, setRole] = useState<"pump" | "transporter">("pump");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const tag = role === "pump" ? t.roleTagPump : t.roleTagTransporter;
    const phone = String(fd.get("phone") ?? "").trim();
    setStatus("submitting");
    try {
      await postCallback({
        name: String(fd.get("name") ?? "").trim(),
        // As ten plain digits, however it was typed; the box's own check has
        // already stopped anything that is not a mobile.
        phone: toMobile(phone) ?? phone,
        outlet: String(fd.get("outlet") ?? "").trim(),
        message: `Khata Kavach · ${tag}`,
        website: String(fd.get("website") ?? ""),
      });
      setStatus("success");
    } catch (err) {
      console.error("[callback]", err);
      setStatus("error");
    }
  }

  const input =
    "mt-2 block min-h-[52px] w-full rounded-xl bg-white px-4 text-[17px] text-kk-ink outline-none placeholder:text-kk-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-kk-siyahi";

  return (
    <section id={KK_ANCHORS.start} aria-labelledby="kk-start" className="scroll-mt-20 bg-kk-siyahi text-white">
      <div className="wrap-full grid gap-12 py-24 md:grid-cols-12 md:gap-14 md:py-32">
        <div className="md:col-span-6">
          <h2
            id="kk-start"
            className="text-balance font-bold !text-white"
            style={{ fontSize: "clamp(34px, 4.8vw, 62px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
          >
            {t.heading}
          </h2>
          <p className="mt-6 max-w-[30rem] text-[19px] leading-[1.55] text-kk-cream md:text-[21px]">{t.sub}</p>
          <div className="mt-8">
            <CallUs variant="button" label={t.callLabel} className="kk-btn-light w-full sm:w-auto [&_svg]:text-kk-siyahi" />
          </div>
          <div className="mt-10">
            <p className="text-[17px] text-kk-cream">{t.alreadyLabel}</p>
            <div className="mt-1 flex flex-col items-start sm:flex-row sm:gap-8">
              <a href={KK_APPS.pump} target="_blank" rel="noopener" className="kk-link text-white">
                {t.openPump}
              </a>
              <a href={KK_APPS.transporter} target="_blank" rel="noopener" className="kk-link text-white">
                {t.openTransporter}
              </a>
            </div>
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="rounded-[1.75rem] bg-kk-cream p-6 text-kk-ink md:p-9">
            {status !== "success" ? (
              <form onSubmit={onSubmit} onInput={onMobileInput("phone", ui.mobileInvalid)} aria-labelledby="kk-form-title">
                <h3 id="kk-form-title" className="text-[26px] font-bold leading-tight text-kk-ink md:text-[30px]">
                  {t.formTitle}
                </h3>

                <fieldset className="mt-6">
                  <legend className="text-[17px] font-semibold text-kk-soft">{t.roleLabel}</legend>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(
                      [
                        ["pump", t.rolePump],
                        ["transporter", t.roleTransporter],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={
                          "kk-chip flex min-h-[52px] cursor-pointer items-center justify-center rounded-xl px-2 text-center text-[16px] font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kk-siyahi " +
                          (role === value ? "bg-kk-siyahi text-white" : "bg-white text-kk-ink")
                        }
                      >
                        <input
                          type="radio"
                          name="role"
                          value={value}
                          checked={role === value}
                          onChange={() => setRole(value)}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="mt-5 block text-[17px] font-semibold text-kk-soft">
                  {t.fieldName}
                  <input name="name" required autoComplete="name" className={input} />
                </label>
                <label className="mt-5 block text-[17px] font-semibold text-kk-soft">
                  {t.fieldPhone}
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="9XXXXXXXXX"
                    className={input}
                  />
                </label>
                <label className="mt-5 block text-[17px] font-semibold text-kk-soft">
                  {t.fieldOutlet}
                  <input name="outlet" className={input} />
                </label>

                {/* A box no person sees. Programs that fill in every box they find fill this one too. */}
                <div hidden>
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {status === "error" && (
                  <p role="alert" className="mt-5 rounded-xl bg-white p-4 text-[16px] leading-[1.5] text-kk-ink">
                    {contact.errorGeneric}{" "}
                    <CallUs label={contact.errorCallLink} className="font-semibold text-kk-siyahi underline underline-offset-4" />
                    {contact.errorEnd}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={"kk-btn-primary mt-7 w-full " + (status === "submitting" ? "pointer-events-none opacity-70" : "")}
                >
                  {status === "submitting" ? contact.submitting : t.submit}
                </button>
                <p className="mt-4 text-[15px] text-kk-soft">{contact.privacy}</p>
              </form>
            ) : (
              <div role="status" aria-live="polite" className="kk-stamp">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-kk-siyahi text-white">
                  <Icon name="check" size={22} strokeWidth={2.4} />
                </span>
                <p className="mt-5 text-[26px] font-bold leading-tight text-kk-ink">{contact.success.heading}</p>
                <p className="mt-3 text-[18px] leading-[1.55] text-kk-soft">
                  {contact.success.bodyLead}{" "}
                  <CallUs label={contact.success.callLink} className="font-semibold text-kk-siyahi underline underline-offset-4" />
                  {contact.success.bodyEnd}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
