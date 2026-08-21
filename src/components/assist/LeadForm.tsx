import { useEffect, useRef, useState, type FormEvent, type Ref } from "react";
import Icon from "../Icon";
import { normaliseMobile } from "../../lib/assistApi";
import type { AssistDict } from "./dict";
import type { AssistLeadField } from "../../types/assist";

/**
 * Name, place, mobile. The three things that turn a question into somebody
 * the team can ring back.
 *
 * The mobile is checked here against the same rule the server applies,
 * `^[6-9]\d{9}$`, because a visitor on a slow connection should be told their
 * number is short before they wait for a round trip to say so.
 *
 * When this form is asking for a callback it reads the number back and waits
 * for a yes. A callback promised to a misheard number is worse than no
 * callback at all, which is why the confirmation is a step rather than a
 * checkbox.
 */

export interface LeadValues {
  name: string;
  place: string;
  mobile: string;
}

export default function LeadForm({
  d,
  phone,
  escalate,
  focusField,
  initial,
  onSubmit,
  onCancel,
}: {
  d: AssistDict;
  phone: string;
  /** True when this is a request for a person to call, not just a detail. */
  escalate: boolean;
  focusField?: AssistLeadField;
  initial?: Partial<LeadValues>;
  /** Throws to signal failure; the message shown is this form's own. */
  onSubmit: (values: LeadValues & { mobile: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<LeadValues>({
    name: initial?.name ?? "",
    place: initial?.place ?? "",
    mobile: initial?.mobile ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(focusField === "mobile-confirm");
  const [sending, setSending] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const target =
      focusField === "place" ? placeRef : focusField === "name" ? nameRef : mobileRef;
    target.current?.focus();
  }, [focusField]);

  const normalised = normaliseMobile(values.mobile);

  function set<K extends keyof LeadValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setError(null);
  }

  async function send(mobile: string) {
    setSending(true);
    setError(null);
    try {
      await onSubmit({ ...values, mobile });
    } catch {
      setError(d.lead.failed.replace("{phone}", phone));
      setConfirming(false);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const wantsMobile = escalate || values.mobile.trim() !== "";
    if (wantsMobile && !normalised) {
      setError(d.lead.mobileInvalid);
      mobileRef.current?.focus();
      return;
    }
    if (escalate && values.name.trim() === "") {
      setError(d.lead.nameRequired);
      nameRef.current?.focus();
      return;
    }
    if (!escalate && !normalised && values.name.trim() === "" && values.place.trim() === "") {
      setError(d.lead.nameRequired);
      nameRef.current?.focus();
      return;
    }

    if (escalate && normalised) {
      setConfirming(true);
      return;
    }
    void send(normalised ?? "");
  }

  if (confirming && normalised) {
    return (
      <div className="rounded-2xl border border-navy-200 bg-navy-50 p-4">
        <p className="font-display text-[16px] font-semibold text-ink">{d.lead.confirmTitle}</p>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-soft">
          {d.lead.confirmBody.replace("{mobile}", normalised)}
        </p>
        {error && (
          <p role="alert" className="mt-3 text-[13px] leading-[1.5] text-gold-700">
            {error}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={sending}
            onClick={() => void send(normalised)}
            className={
              "btn-primary !min-h-[44px] !px-5 !text-[14px]" +
              (sending ? " pointer-events-none opacity-70" : "")
            }
          >
            {sending ? d.lead.sending : d.lead.confirmYes}
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirming(false);
              window.setTimeout(() => mobileRef.current?.focus(), 0);
            }}
            className="btn-ghost !min-h-[44px] !px-5 !text-[14px]"
          >
            {d.lead.confirmEdit}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={d.lead.title}
      className="rounded-2xl border border-ink-hairline bg-paper-warm p-4"
    >
      <p className="font-display text-[16px] font-semibold text-ink">{d.lead.title}</p>
      <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-soft">{d.lead.intro}</p>

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
          ref={placeRef}
          label={d.lead.place}
          value={values.place}
          onChange={(v) => set("place", v)}
          placeholder={d.lead.placePlaceholder}
          autoComplete="address-level2"
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
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[13px] leading-[1.5] text-gold-700">
          {error}
        </p>
      )}

      <p className="mt-3 text-[12.5px] leading-[1.5] text-ink-muted">{d.lead.privacy}</p>

      <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={sending}
          className={
            "btn-primary !min-h-[44px] !px-5 !text-[14px]" +
            (sending ? " pointer-events-none opacity-70" : "")
          }
        >
          {sending ? (
            d.lead.sending
          ) : (
            <>
              {d.lead.submit} <Icon name="arrow" size={15} />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost !min-h-[44px] !px-5 !text-[14px]"
        >
          {d.lead.cancel}
        </button>
      </div>
    </form>
  );
}

function Field({
  ref,
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
}: {
  ref?: Ref<HTMLInputElement>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  inputMode?: "tel" | "text" | "numeric";
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </span>
      <input
        ref={ref}
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-ink-hairline bg-white px-3.5 py-2.5 text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500"
      />
      {hint && <span className="mt-1 block text-[12px] text-ink-muted">{hint}</span>}
    </label>
  );
}
