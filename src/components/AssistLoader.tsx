"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onAssistCallRequested } from "../lib/assistCall";

/**
 * The assistant is on every page but nobody has to pay for it up front: the
 * launcher, the panel, the recorder and the socket library are all fetched
 * after the page has settled (the browser is idle) or the first time the
 * visitor touches the page, whichever comes first. It never renders on the
 * server, and it is a separate download, so none of it is in the page's first
 * bundle.
 *
 * "Call us" can arrive before the widget has loaded (the visitor taps the
 * call sheet's "Talk on this page" as their very first touch). The widget
 * cannot hear an event it was not there for, so this remembers it and hands it
 * over as the widget starts.
 */
const AssistWidget = dynamic(() => import("./assist/AssistWidget"), { ssr: false });

const WAKE_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
/** The longest to wait for an idle moment before loading anyway. */
const IDLE_TIMEOUT_MS = 3_000;

export default function AssistLoader() {
  const [ready, setReady] = useState(false);
  const [callAsked, setCallAsked] = useState(false);

  useEffect(() => {
    if (ready) return;
    const wake = () => setReady(true);
    for (const e of WAKE_EVENTS) window.addEventListener(e, wake, { once: true, passive: true });
    // Safari has no requestIdleCallback; a short timer stands in for it.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(wake, { timeout: IDLE_TIMEOUT_MS })
      : window.setTimeout(wake, 1_500);
    const unsubscribe = onAssistCallRequested(() => {
      setCallAsked(true);
      setReady(true);
    });
    return () => {
      for (const e of WAKE_EVENTS) window.removeEventListener(e, wake);
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      unsubscribe();
    };
  }, [ready]);

  return ready ? <AssistWidget startWithCall={callAsked} /> : null;
}
