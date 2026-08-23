/* ─────────────────────────────────────────────────────────────
   The assistant widget.

   Every visible string in `src/components/assist/**` comes from
   here. The widget answers a dealer who is standing on a
   forecourt with one hand on a phone, so the sentences are short
   and the buttons say what happens next.

   One rule runs through all of it: this assistant exists so that
   fewer people have to ring the office, so it never offers the
   toll-free number while it is answering. A dead end offers a
   callback, which still keeps the call off the inbound line. The
   number appears only where nothing else can work: the assistant
   is unreachable, it could not answer at all, or every live line
   is taken. Even there it comes second, under the callback.

   `{n}`, `{mobile}` and `{time}` are filled in where
   they are used, so each language can put them where the
   sentence wants them.
   ───────────────────────────────────────────────────────────── */

export const assist = {
  /** The floating button. The only assistant string a visitor sees
      before they tap it, so it says what it does. */
  launcher: {
    aria: "Ask MDG a question",
    close: "Close the assistant",
    /** Beside the button on a phone, where the panel does not open itself. */
    invite: "Ask us anything",
  },

  panel: {
    title: "Ask MDG",
    subtitle: "Type it, speak it, or talk to us live.",
    close: "Close",
    langAria: "Answer language",
    loading: "Opening",
    /** Shown above the first message, so nobody has to guess what to ask. */
    greeting:
      "Ask me anything about the marketing guidelines, or about what MDG Services does. I answer in Hindi or English.",
    /** The three ways in, spelled out under the greeting. */
    hint: "Type below, tap the mic and speak, or tap Talk live for a real conversation.",
  },

  chat: {
    /** Above a spoken question, so a misheard word is obvious straight away. */
    heard: "What we heard",
    heardNote: "Not what you said? Type it below instead.",
    /* ── The spoken answer, played as a voice note ── */
    voicePlay: "Play the spoken answer",
    voicePause: "Pause",
    voiceSeek: "Move through the spoken answer",
    /** The player takes itself away rather than sitting there dead. */
    voiceFailed: "The spoken answer would not play. The words above say the same thing.",
    thinking: "Thinking",
    /** The live region while nothing is happening. */
    ready: "Ready",
  },

  composer: {
    placeholder: "Type your question",
    /** Types itself into the empty box, so nobody has to guess what to ask. */
    typedHint: "What is mdgservices?",
    aria: "Your question",
    sendAria: "Send the question",
    /** Only appears once they are near the limit. */
    charsLeft: "{n} left",
    tooLong: "Please keep it under 600 characters.",
  },

  voice: {
    tap: "Tap to speak",
    tapAria: "Tap to speak your question",
    preparing: "Getting the microphone ready",
    recording: "Listening. Tap again to send.",
    /** Sits in the composer while the microphone is open. */
    listening: "Listening…",
    secondsLeft: "{n}s left",
    stopAria: "Stop and send",
    tooShort: "That was too short. Tap the microphone and speak.",
    silent: "We could not hear anything. Check the microphone and try again.",
  },

  /* ── Microphone permission. Never a file picker, never the camera. ── */
  mic: {
    deniedTitle: "The browser blocked the microphone",
    deniedBody:
      "Your browser did not let this page use the microphone. Allow it in the browser's site settings and try again, or just type your question here.",
    missingTitle: "No microphone found",
    missingBody: "This device does not seem to have a microphone. Type your question here instead.",
    unsupportedTitle: "This browser cannot record",
    unsupportedBody:
      "This browser will not let a web page record sound. Type your question here instead.",
    busyTitle: "The microphone is in use",
    busyBody:
      "Another app seems to be holding the microphone. Close it and try again, or type your question here.",
    typeInstead: "Type instead",
  },

  /* ── The live call ── */
  call: {
    /** This is the browser call, not our phone number. It has been mistaken
        for the latter, hence the wording and the waveform glyph. */
    start: "Talk live",
    startAria: "Talk to the assistant out loud",
    /** The chip that sits on the call for the whole of it. The assistant also
        says the recording notice out loud the moment the call connects, so
        there is nothing to tap through and nothing hidden. */
    recording: "Recording",

    connecting: "Connecting\u2026",
    listening: "Listening\u2026",
    thinking: "Thinking\u2026",
    speaking: "Speaking",
    ended: "The call has ended",

    /** Under the status, while the line is quiet and waiting. */
    justTalk: "Just talk. There is no button to hold.",
    elapsedAria: "Time on this call",

    mute: "Mute",
    unmute: "Unmute",
    muteAria: "Turn the microphone off",
    unmuteAria: "Turn the microphone back on",
    muted: "Microphone off",

    /** Hands free is the call. Holding a button is the way out of a noisy
        forecourt, offered quietly and never in the way. */
    trouble: "Trouble hearing you? Hold to talk",
    handsFree: "Back to hands free",
    talk: "Hold to talk",
    talkAria: "Hold this button and talk",
    release: "Let go when you have finished",
    /** Shown only in the last three minutes. */
    remaining: "{time} left",
    end: "End call",
    endAria: "End the call",

    /** Handshake refusals, each one distinct. */
    refusedUnauthorized:
      "This conversation has timed out. Close the window and open it again to start a fresh one.",
    refusedBlocked:
      "We could not connect that call. Leave your number and a person will ring you back.",
    refusedCapacity: "All our lines are busy right now.",
    refusedCapacityBody:
      "Only a few calls can run at the same time. Leave your number and a person will ring you back.",
    refusedDisabled:
      "Live calls are switched off at the moment. Type your question here, or leave your number for a callback.",
    refusedGeneric:
      "We could not connect the call. Type your question here, or leave your number and a person will ring you back.",
    lost: "The connection dropped. Trying to get back.",
    /** After the retries have run out. Shown on the "call ended" card. */
    lostForGood: "We could not get the connection back, so the call has ended.",

    endedTitle: "Call ended",
    /** Plain words for every reason the server can give. */
    reasons: {
      visitorLeft: "You ended the call.",
      inactivity: "The call ended because there was no sound for a while.",
      maxDuration: "We reached the time limit for one call.",
      maxTurns: "We covered a lot in that call.",
      speechBudget: "We reached the limit for one call.",
      abuse: "The call was ended.",
      blocked: "The call was ended.",
      error: "Something went wrong and the call stopped.",
      capacity: "The line was needed elsewhere.",
      shutdown: "Our system is restarting.",
    },
  },

  /* ── Lead capture and escalation ── */
  lead: {
    open: "Ask for a callback",
    openAria: "Leave your number for a callback",
    title: "Shall we call you back?",
    intro: "Leave your number and a team member calls back within the hour, 9am to 9pm.",
    name: "Your name",
    namePlaceholder: "Ramesh Kumar",
    place: "Your place",
    placePlaceholder: "Aligarh",
    mobile: "Mobile number",
    mobilePlaceholder: "9XXXXXXXXX",
    mobileHint: "10 digits, starting with 6, 7, 8 or 9.",
    mobileInvalid: "Please enter a 10 digit mobile number starting with 6, 7, 8 or 9.",
    nameRequired: "Please write your name.",
    submit: "Send",
    sending: "Sending",
    cancel: "Not now",
    privacy: "We will never share your number.",

    /** The number is read back before anything is promised. */
    confirmTitle: "Is this number right?",
    confirmBody: "We will call you on {mobile}.",
    confirmYes: "Yes, call me on that",
    confirmEdit: "Change the number",

    savedTitle: "Got it",
    savedBody: "Thank you. A team member will call you shortly.",
    savedBodyLead: "Thank you. That is saved.",
    failed: "We could not send that. Please try again in a moment.",
  },

  /* ── When the assistant cannot help, a person still can ── */
  fallback: {
    title: "Let us get a person on it",
    body: "Leave your number and somebody rings you back, usually within the hour.",
    /** Under the callback offer, never above it, and never on a good answer. */
    callLead: "Or talk to somebody",
    callAction: "Call us now",
    hours: "9am to 9pm, every day",
    callAria: "Call MDG Services from this page, free",
  },

  errors: {
    rateLimited: "One moment. That was a little quick for us. Please try again in a few seconds.",
    turnLimit: "We have covered a lot here. Shall we have someone call you?",
    disabled:
      "The assistant is resting right now. Leave your number and we will call you back.",
    blocked: "We could not answer that here. Leave your number and we will call you back.",
    callCapacity: "All our lines are busy right now.",
    tooLarge: "That recording was too long to send. Please keep it under a minute.",
    /** The old conversation was closed and a fresh one could not be opened either. */
    conversationEnded: "That conversation has ended. Ask again and we will start a fresh one.",
    network:
      "We could not reach our system. Check your connection and try again, or leave your number and we will call you back.",
    generic:
      "Something went wrong. Please try again, or leave your number and we will call you back.",
  },
};
