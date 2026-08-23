import Icon from "./Icon";
import { useT } from "../i18n";
import { requestAssistCall } from "../lib/assistCall";

/**
 * "Call us" — the control that replaced the toll-free number.
 *
 * The number used to appear in seven places. Every one of them is now this:
 * a handset that starts a spoken conversation in the tab. It costs the
 * visitor no call charges, works from a desk without a phone in reach, and
 * reaches something that answers on the first ring.
 *
 * Three shapes, because the places it sits are three different shapes — an
 * icon alone in the navbar, a quiet line of text inside a paragraph, and a
 * button where a call-to-action belongs. They are variants of one component
 * rather than three components so that the wording, the label and the
 * behaviour cannot drift apart across the page.
 */

type Variant =
  /** Icon only. The navbar, where there is no room for words. */
  | "icon"
  /** Handset and label, inline, inheriting the surrounding type. */
  | "inline"
  /** A real button. Hero, membership, the contact card. */
  | "button";

export default function CallUs({
  variant = "inline",
  className = "",
  label,
}: {
  variant?: Variant;
  className?: string;
  /** Override the wording where the sentence around it needs something else. */
  label?: string;
}) {
  const t = useT();
  const text = label ?? t.ui.callUs;

  const base =
    "inline-flex items-center gap-2 transition-colors duration-200 " +
    // A handset is a small target and this is the site's main way of reaching
    // somebody, so it never gets smaller than a thumb.
    (variant === "icon" ? "h-11 w-11 justify-center rounded-full " : "");

  return (
    <button
      type="button"
      onClick={requestAssistCall}
      aria-label={t.ui.callUsAria}
      title={variant === "icon" ? t.ui.callUsAria : undefined}
      className={base + className}
    >
      <Icon name="phone" size={variant === "button" ? 17 : 16} aria-hidden />
      {variant !== "icon" && <span>{text}</span>}
    </button>
  );
}
