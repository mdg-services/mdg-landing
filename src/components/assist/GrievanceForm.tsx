import { useEffect, useRef, useState, type FormEvent } from "react";
import Icon from "../Icon";
import { Field } from "./LeadForm";
import { grievanceCategoryLabels, type AssistDict } from "./dict";
import { AssistError, fileGrievance, normaliseMobile } from "../../lib/assistApi";
import { useSubmissionId } from "../../lib/submissionId";
import { GRIEVANCE_CATEGORIES, type GrievanceCategory } from "../../data/content";
import type { AssistGrievanceResult, AssistLang } from "../../types/assist";

/**
 * A complaint about MDG itself, filed as a grievance.
 *
 * It sits where the lead form sits and looks like it. It is a form rather than
 * a few questions in the chat because a grievance needs five things the chat
 * cannot gather reliably one sentence at a time: a name, a number the team can
 * ring, what it is about, what happened, and an optional address to write to.
 *
 * Nothing here is a success until the server hands back a number. The website
 * emails the person their grievance number; this does not, so the number on
 * the screen is the visitor's only receipt, and a card that said "done" without
 * one would be a promise nobody could ever check.
 *
 * The limits are the server's own (`assistGrievanceSchema`): a message of 10 to
 * 3000 characters, a name of up to 80, an email that is empty or valid.
 */

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 3000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;

/** What the form opens with. All of it can be changed before sending. */
export interface GrievanceStart {
  name: string;
  mobile: string;
  /** Empty when nobody has said what it is about. The visitor then picks. */
  category: GrievanceCategory | "";
  message: string;
}

/** The two boxes worth remembering for the next form in the same conversation. */
export interface GrievanceGiven {
  name: string;
  mobile: string;
}

export default function GrievanceForm({
  d,
  lang,
  initial,
  onFiled,
  onCancel,
}: {
  d: AssistDict;
  lang: AssistLang;
  initial: GrievanceStart;
  /** Called only with a number in hand. */
  onFiled: (result: AssistGrievanceResult, given: GrievanceGiven) => void;
  onCancel: () => void;
}) {
  const g = d.grievance;
  const [values, setValues] = useState({ ...initial, email: "" });
  /** A box that failed the form's own check, with the sentence to show. */
  const [problem, setProblem] = useState<string | null>(null);
  /** The server did not take it: over the cap, or anything else. */
  const [refused, setRefused] = useState<"limit" | "failed" | null>(null);
  const [sending, setSending] = useState(false);
  // The same content pressed again carries the same id, so a send that was cut
  // off is recognised by the server and answered with the number it already
  // gave. Changed content gets a new id, so a correction is never taken for a
  // replay of the first try.
  const submissionIdFor = useSubmissionId();

  const rootRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Opens at its own top, then puts the cursor on the first thing still
    // missing. When everything is already filled in (the offer card hands over
    // the visitor's own words) the cursor goes to the button, so a phone's
    // keyboard does not leap up over a form somebody only has to read.
    rootRef.current?.scrollIntoView({ block: "start" });
    const target =
      initial.name.trim() === ""
        ? nameRef
        : !normaliseMobile(initial.mobile)
          ? mobileRef
          : initial.category === ""
            ? categoryRef
            : initial.message.trim() === ""
              ? messageRef
              : submitRef;
    target.current?.focus({ preventScroll: true });
  }, [initial]);

  const labels = grievanceCategoryLabels(lang);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setProblem(null);
  }

  /** Says what is wrong with one box, and puts the cursor in it. */
  function complain(text: string, target: { current: HTMLElement | null }) {
    setProblem(text);
    target.current?.focus();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const name = values.name.trim();
    const mobile = normaliseMobile(values.mobile);
    const email = values.email.trim();
    const message = values.message.trim();

    // In the order the boxes are on the screen, so the first one complained
    // about is the first one to fix.
    if (name === "") return complain(d.lead.nameRequired, nameRef);
    if (!mobile) return complain(d.lead.mobileInvalid, mobileRef);
    if (email !== "" && !EMAIL_RE.test(email)) return complain(g.emailInvalid, emailRef);
    if (values.category === "") return complain(g.categoryRequired, categoryRef);
    if (message.length < MESSAGE_MIN) return complain(g.messageShort, messageRef);

    const fields = {
      name,
      mobile,
      // Empty is left out altogether rather than sent as a blank.
      email: email === "" ? undefined : email,
      category: values.category,
      message,
    };

    setSending(true);
    setRefused(null);
    setProblem(null);
    try {
      const result = await fileGrievance({ submissionId: submissionIdFor(fields), ...fields }, lang);
      // An answer without a number is not a registered grievance, whatever else
      // it says. Treated as a failure so the visitor is sent to the website
      // instead of being told it worked.
      if (typeof result?.ref !== "string" || result.ref === "") throw new Error("no number");
      onFiled(result, { name, mobile });
    } catch (err) {
      setRefused(err instanceof AssistError && err.code === "GRIEVANCE_LIMIT" ? "limit" : "failed");
      setSending(false);
    }
  }

  return (
    <form
      ref={rootRef}
      onSubmit={handleSubmit}
      aria-label={g.title}
      // The checks above are the form's own, in the visitor's language. The
      // browser's would pop up in whichever language the browser speaks.
      noValidate
      // Room above it when it scrolls to the top of the list, so its rounded
      // corner is not cut by the header's rule.
      className="scroll-mt-3 rounded-2xl border border-ink-hairline bg-paper-warm p-4"
    >
      <p className="font-display text-[16px] font-semibold text-ink">{g.title}</p>
      <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-soft">{g.intro}</p>

      <div className="mt-3.5 grid gap-3">
        <Field
          ref={nameRef}
          label={d.lead.name}
          value={values.name}
          onChange={(v) => set("name", v)}
          placeholder={d.lead.namePlaceholder}
          autoComplete="name"
          maxLength={80}
        />
        <Field
          ref={mobileRef}
          label={d.lead.mobile}
          value={values.mobile}
          onChange={(v) => set("mobile", v)}
          placeholder={d.lead.mobilePlaceholder}
          autoComplete="tel-national"
          inputMode="numeric"
          type="tel"
          maxLength={15}
          hint={d.lead.mobileHint}
        />
        <Field
          ref={emailRef}
          label={g.email}
          value={values.email}
          onChange={(v) => set("email", v)}
          placeholder={g.emailPlaceholder}
          autoComplete="email"
          inputMode="email"
          type="email"
          maxLength={200}
          hint={g.emailHint}
        />

        <label className="block">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-muted">
            {g.category}
          </span>
          <select
            ref={categoryRef}
            value={values.category}
            onChange={(e) => set("category", e.target.value as GrievanceCategory | "")}
            className={
              "mt-1.5 w-full rounded-xl border border-ink-hairline bg-white px-3 py-2.5 text-[16px] outline-none transition-colors duration-200 focus:border-navy-500 " +
              (values.category === "" ? "text-ink-faint" : "text-ink")
            }
          >
            <option value="">{g.categoryChoose}</option>
            {GRIEVANCE_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {labels[value]}
              </option>
            ))}
          </select>
        </label>

        <div>
          <label className="block">
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-muted">
              {g.message}
            </span>
            <textarea
              ref={messageRef}
              value={values.message}
              rows={5}
              maxLength={MESSAGE_MAX}
              placeholder={g.messagePlaceholder}
              onChange={(e) => set("message", e.target.value)}
              className="mt-1.5 block w-full resize-y rounded-xl border border-ink-hairline bg-white px-3.5 py-2.5 text-[16px] leading-[1.5] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500"
            />
          </label>
          {/* Outside the label, so the count is not read out as part of the
              box's name. */}
          <p className="num mt-1 text-right text-[12px] text-ink-muted">
            {g.messageCount
              .replace("{n}", String(values.message.length))
              .replace("{max}", String(MESSAGE_MAX))}
          </p>
        </div>
      </div>

      {problem && (
        <p role="alert" className="mt-3 text-[13px] leading-[1.5] text-gold-700">
          {problem}
        </p>
      )}

      {/* Refused, or not taken. Either way the website's own page is the other
          way to the same team, so the visitor is never left with a dead end.
          It opens in a new tab: on a phone this panel covers the page, and
          going to it here would lose what has been written. */}
      {refused && (
        <div
          role="alert"
          // The button that was just pressed is under this, and on a phone the
          // line it pushed in may be below the fold.
          ref={(el) => el?.scrollIntoView({ block: "nearest" })}
          className="mt-3 rounded-xl border border-gold-300 bg-gold-50 p-3"
        >
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            {refused === "limit" ? g.limit : g.failed}
          </p>
          <p className="mt-1 text-[13px] leading-[1.55] text-ink-soft">
            {g.websiteLead}{" "}
            <a
              href="/grievance"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy-700 underline decoration-navy-300 underline-offset-4"
            >
              {g.websiteLink}
            </a>
          </p>
        </div>
      )}

      <p className="mt-3 text-[12.5px] leading-[1.5] text-ink-muted">{g.privacy}</p>

      <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
        <button
          ref={submitRef}
          type="submit"
          disabled={sending}
          className={
            "btn-primary !min-h-[44px] !px-5 !text-[14px]" +
            (sending ? " pointer-events-none opacity-70" : "")
          }
        >
          {sending ? (
            g.sending
          ) : (
            <>
              {g.submit} <Icon name="arrow" size={15} />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost !min-h-[44px] !px-5 !text-[14px]"
        >
          {g.cancel}
        </button>
      </div>
    </form>
  );
}

/**
 * The number, set large, with what to do with it.
 *
 * One component for every place it appears: under the reply that registered
 * it, inside the "call ended" card, on its own once that card is gone, and on
 * the live call itself where the surface is dark. It is the one thing the
 * visitor has to keep, so it is selectable, and it is the same words wherever
 * they meet it.
 */
export function GrievanceNumber({
  d,
  refs,
  tone = "card",
}: {
  d: AssistDict;
  refs: string[];
  /** `card` stands alone, `inline` sits inside another card, `dark` is for the call. */
  tone?: "card" | "inline" | "dark";
}) {
  const g = d.grievance;
  const dark = tone === "dark";
  return (
    <div
      role="status"
      className={
        tone === "card"
          ? "rounded-2xl border border-ok/30 bg-ok-tint p-3.5"
          : tone === "inline"
            ? "mt-3 rounded-xl border border-ok/30 bg-white p-3"
            : "rounded-xl border border-gold-400/40 bg-white/5 px-4 py-3 text-center"
      }
    >
      <p
        className={
          "font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] " +
          (dark ? "text-gold-300" : "text-ink-muted")
        }
      >
        {refs.length > 1 ? g.numbersLabel : g.numberLabel}
      </p>
      <p
        className={
          "mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[28px] font-bold leading-none tracking-[0.04em] " +
          (dark ? "justify-center text-white" : "text-navy-700")
        }
      >
        {refs.map((ref) => (
          <span key={ref} className="select-all">
            {ref}
          </span>
        ))}
      </p>
      <p
        className={
          "mt-2.5 text-[13.5px] leading-[1.6] " + (dark ? "text-navy-100" : "text-ink-soft")
        }
      >
        {g.filedNote}
      </p>
    </div>
  );
}
