import { useRef } from "react";

/**
 * One id for one filled-in form. If a send is cut off and the visitor presses
 * Send again, the second try carries the same id, and the server can tell it
 * is the same form and not a second one.
 *
 * `crypto.randomUUID` only exists on secure pages, so an older phone or an
 * embedded browser falls back to a time-and-random string. Both fit the
 * server's rule: letters, digits, `-` and `_`, 8 to 64 characters.
 */
export function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
}

/**
 * The id to send with the form as it stands now. Ask with what is about to be
 * sent (without the timing fields, which change on every press): the same
 * content gets the same id as the last attempt, so a cut-off send can be
 * pressed again and is recognised as the same form. Different content gets a
 * new id, so a corrected retry is never mistaken for a replay of the first
 * and handed that one's answer.
 */
export function useSubmissionId(): (content: unknown) => string {
  const last = useRef<{ key: string; id: string } | null>(null);
  return (content) => {
    const key = JSON.stringify(content);
    if (last.current?.key !== key) last.current = { key, id: newSubmissionId() };
    return last.current.id;
  };
}
