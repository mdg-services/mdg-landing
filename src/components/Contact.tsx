"use client";

import Icon from "./Icon";
import StoreButtons from "./StoreButtons";
import { requestCallChoice } from "../lib/assistCall";
import { TOLL_FREE } from "../lib/tollFree";
import { Reveal } from "../lib/reveal";
import { useT } from "../i18n/client";
import type { Dict } from "../i18n/lang";

export default function Contact({ c }: { c: Dict["contact"] }) {
  const { ui } = useT();

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

        {/* the app: registering happens inside it, never on this page */}
        <div className="mt-14 grid items-center gap-8 border-t border-ink-hairline pt-12 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-6">
            <p className="eyebrow">{c.appEyebrow}</p>
            <h3 className="mt-5 font-display text-[24px] font-semibold leading-tight text-ink md:text-[28px]">
              {c.appHeading}
            </h3>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.6] text-ink-soft">{c.appNote}</p>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-6">
            <StoreButtons from="contact" appStoreAria={ui.getAppStoreAria} playAria={ui.getAppAria} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
