/**
 * Builds the two film watch pages, /film and /film/short, as plain static
 * HTML with their CSS and JS inlined, plus a self-hosted copy of hls.js that
 * only browsers without native HLS ever fetch.
 *
 * Each page is built twice: Hindi, the default because the films are in Hindi,
 * and English (files under film/en and film/short/en). Only /film and
 * /film/short are ever served: proxy.ts picks the file from ?lang= or the
 * site's mdg_lang cookie, and vercel.json redirects /film/en to /film?lang=en,
 * so a shared link stays one link and the switch always reaches the server.
 *
 * Not part of the React app: a dealer on a cheap phone on 2G should see the
 * poster and the first seconds of the film before the SPA would even have
 * downloaded. Budget: HTML + inline CSS/JS <= 21 kB gzipped per page. It was
 * 15 kB until the WhatsApp reply, the speed button and the form's errors, then
 * the owner's card design, and then a screen for each thing to do with settings
 * and sharing as sheets (22 Oct 2026). On 12 Nov 2026 the WhatsApp reply and the
 * call-back form came out: the one action is Start services (the app), and the
 * toll-free number stays in sight;
 * 1 kB is about 33 ms at 250 kbps, against the poster and the ~120 kB hls.js
 * that decide the first frame. The stills themselves load lazily, below the fold.
 *
 * Updating a film = package a new version (marketing/films/web/package.mjs),
 * paste its film.json into src/film/films.json, rebuild, deploy. A film whose
 * version is still null renders a "coming soon" page instead of a player.
 *
 * The beacon endpoint comes from FILM_BEACON_URL at build time (defaults to
 * production); point it at a local stub to test.
 */
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { minify, transformWithOxc } from "vite";
import { APP_STORE, APPLE_MARK_PATH, PLAY_MARK_PATHS, PLAY_STORE } from "../src/lib/appStores";

type FilmId = "kavach" | "kavach-short";
type Lang = "hi" | "en";
const LANGS: Lang[] = ["hi", "en"];
interface FilmJson {
  film: FilmId;
  title: string;
  version: string | null;
  duration?: number;
  base?: string;
  hls?: string;
  /** master playlists for the browser's own player, by network: 720p / 540p / 360p first */
  playlists?: { hd: string; sd: string; lite: string };
  mp4?: string;
  poster?: string;
  captions?: string;
  chapters?: Array<{ t: number; title: string }>;
  ladder?: number[];
  /** the film in more than one language: one picture, a sound track + captions each (Hindi first) */
  audio?: FilmAudio[];
}
interface FilmAudio {
  lang: string;
  /** the language's name in its own script, as the picker shows it */
  name: string;
  hls: string;
  playlists: { hd: string; sd: string; lite: string };
  mp4: string;
  captions: string;
}
export interface FilmPageFile {
  fileName: string;
  source: string;
}

const SITE = "https://mdgservices.in";
const MEDIA_ORIGIN = "https://mdg-films.s3.ap-south-1.amazonaws.com";
const DEFAULT_BEACON = "https://api.mdgservices.in/api/v1/films/beacon";
/** The Dealer Kavach app on Google Play, tagged so Play's install figures show the film page. */
const PLAY_URL = `${PLAY_STORE}&referrer=${encodeURIComponent("utm_source=film&utm_medium=page&utm_campaign=app_screen")}`;
/** Same number as src/lib/tollFree.ts; this script is not part of the app, so it is not imported. */
const TOLL_FREE_TEL = "tel:18008913496";
const TOLL_FREE_SHOWN = "1800-891-3496";
/** The day both films went up on these pages, for search engines' video results. */
const PUBLISHED = "2026-10-04T00:00:00+05:30";
/** A running time as schema.org wants it: 1589.7 s -> "PT26M30S". */
const isoDuration = (s: number) => {
  const all = Math.round(s);
  return `PT${Math.floor(all / 60)}M${all % 60}S`;
};

/* What each page says about its film. Outcomes only. */
const PAGES: Record<FilmId, { path: string; kind: "full" | "short"; og: string }> = {
  kavach: { path: "/film", kind: "full", og: "/film/og-kavach.jpg" },
  "kavach-short": { path: "/film/short", kind: "short", og: "/film/og-kavach-short.jpg" },
};

/** Every word on the page, in both languages. The film itself, and its subtitles, stay Hindi. */
const T = {
  hi: {
    locale: "hi_IN",
    // films.json carries the Hindi titles
    title: { kavach: "", "kavach-short": "" } as Record<FilmId, string>,
    desc: {
      kavach: (m: number) => `पंप का रोज़ का काग़ज़ी काम — समय पर, बिना भागदौड़। ${m} मिनट की फ़िल्म।`,
      "kavach-short": () => "डीलर कवच आपके पंप के लिए क्या करता है — 40 सेकंड में देखिए।",
    } as Record<FilmId, (m: number) => string>,
    soon: {
      kavach: "पूरी फ़िल्म यहाँ बहुत जल्द आएगी।",
      "kavach-short": "डीलर कवच की 40 सेकंड की फ़िल्म यहाँ बहुत जल्द आएगी। तब तक पूरी फ़िल्म देखिए।",
    } as Record<FilmId, string>,
    comingSoon: "जल्द आ रहा है",
    privacy: "गोपनीयता",
    langAria: "भाषा",
    full: (m: number) => `पूरी फ़िल्म देखें · ${m} मिनट`,
    fullSoon: (m: number) => `पूरी फ़िल्म देखें (${m} मिनट) →`,
    start: "सेवाएँ शुरू करें",
    startSub: "ऐप लीजिए, उसी में रजिस्टर कीजिए",
    startPill: "सेवाएँ शुरू करें",
    endAsk: "पसंद आया? ऐप में शुरू कीजिए",
    questions: "कोई सवाल? टोल-फ़्री कॉल कीजिए",
    friend: "दोस्त को फ़िल्म भेजें",
    friendShort: "दोस्त को भेजें",
    settings: "सेटिंग",
    loading: "फ़िल्म साफ़ तस्वीर में आ रही है",
    back: "10 सेकंड पीछे",
    fwd: "10 सेकंड आगे",
    pause: "रोकें",
    sound: "आवाज़",
    fs: "पूरी स्क्रीन",
    seek: "फ़िल्म में आगे या पीछे जाएँ",
    wait: "रुकिए…",
    soundOn: "आवाज़ चालू करें",
    pickTitle: "फ़िल्म किस भाषा में देखेंगे?",
    pickSub: "भाषा चुनते ही फ़िल्म आवाज़ के साथ चलेगी",
    filmLang: "फ़िल्म की भाषा",
    resume: "पिछली बार <b></b> तक देखी थी, वहीं से चलाएँ",
    play: "फ़िल्म चलाएँ",
    err: "फ़िल्म नहीं चल पाई",
    errHow: "इंटरनेट देखकर फिर कोशिश करें।",
    retry: "फिर कोशिश करें",
    replay: "फिर से देखें",
    share: "भेजें",
    speed: "रफ़्तार",
    subs: "सबटाइटल",
    on: "चालू",
    off: "बंद",
    pic: "तस्वीर",
    auto: "अपने-आप",
    lite: "कम डेटा",
    chapters: "अध्याय",
    chapterCount: (n: number) => `${n} अध्याय`,
    inFull: "पूरी फ़िल्म में",
    next: "बात करने के और तरीके",
    goBack: "पीछे जाएँ",
    close: "बंद करें",
    callUs: "हमें कॉल करें",
    appGet: "डीलर कवच ऐप लीजिए",
    appOn: "App Store और Google Play पर उपलब्ध",
    appPts: [
      ["मिनटों में रजिस्टर करें", "अपना खाता बनाइए और शुरू कीजिए।"],
      ["सब कुछ एक जगह", "रिकॉर्ड रखिए, नज़र रखिए, नियमों का पालन कीजिए।"],
      ["सुरक्षित और भरोसेमंद", "आपका डेटा हमारे पास सुरक्षित रहता है।"],
    ],
    about: "फ़िल्म के बारे में",
    aboutTitle: "डीलर कवच के बारे में",
    aboutText: "पेट्रोल पंप डीलरों की रोज़ की चुनौतियों पर एक सच्ची नज़र, और MDG Services कैसे आपके पंप का काम आसानी, सटीकता और भरोसे के साथ संभालने में मदद करती है।",
    shareTitle: "दोस्त को यह फ़िल्म भेजें",
    shareSub: "WhatsApp से भेजें, या लिंक कॉपी करके कहीं भी भेजें।",
    shareWa: "WhatsApp पर भेजें",
    copyLink: "लिंक कॉपी करें",
    email: "ईमेल",
    more: "और",
    tollTitle: "टोल-फ़्री नंबर पर कॉल करें",
    tollHours: "सुबह 9 से रात 9, हर दिन",
    appTitle: "ऐप डाउनलोड करें",
    appSub: "App Store या Google Play से लें, उसी में रजिस्टर करें",
    /** what the player says at run time */
    run: {
      play: "चलाएँ",
      pause: "रोकें",
      wait: "रुकिए…",
      offline: "इंटरनेट बंद है, जुड़ते ही चलेगी",
      slow: "इंटरनेट धीमा है, बस थोड़ी देर और…",
      speed: "रफ़्तार",
      tapChange: "बदलने के लिए दबाएँ",
      restart: "शुरू से, आवाज़ के साथ",
      copied: "लिंक कॉपी हो गया",
    },
  },
  en: {
    locale: "en_IN",
    title: { kavach: "Dealer's कवच: the full film", "kavach-short": "Dealer's कवच in 40 seconds" } as Record<FilmId, string>,
    desc: {
      kavach: (m: number) => `Your pump's daily paperwork, on time and without the running around. A ${m}-minute film in Hindi.`,
      "kavach-short": () => "What Dealer's कवच does for your pump, in 40 seconds. In Hindi.",
    } as Record<FilmId, (m: number) => string>,
    soon: {
      kavach: "The full film is coming here very soon.",
      "kavach-short": "The 40-second film is coming here very soon. Until then, watch the full film.",
    } as Record<FilmId, string>,
    comingSoon: "Coming soon",
    privacy: "Privacy",
    langAria: "Language",
    full: (m: number) => `Full film · ${m} min`,
    fullSoon: (m: number) => `Watch the full film (${m} min) →`,
    start: "Start services",
    startSub: "Get the app, register in it",
    startPill: "Start services",
    endAsk: "Liked it? Start in the app",
    questions: "Any question? Call toll-free",
    friend: "Send the film to a friend",
    friendShort: "Send to a friend",
    settings: "Settings",
    loading: "Loading the film in a clear picture",
    back: "Back 10 seconds",
    fwd: "Forward 10 seconds",
    pause: "Pause",
    sound: "Sound",
    fs: "Full screen",
    seek: "Move through the film",
    wait: "Loading…",
    soundOn: "Turn sound on",
    pickTitle: "Which language would you like the film in?",
    pickSub: "The film plays with sound as soon as you choose",
    filmLang: "Film language",
    resume: "You stopped at <b></b>. Continue from there",
    play: "Play the film",
    err: "The film couldn't play",
    errHow: "Check your internet and try again.",
    retry: "Try again",
    replay: "Watch again",
    share: "Share",
    speed: "Speed",
    subs: "Subtitles",
    on: "On",
    off: "Off",
    pic: "Picture",
    auto: "Auto",
    lite: "Save data",
    chapters: "Chapters",
    chapterCount: (n: number) => `${n} chapters`,
    inFull: "In the full film",
    next: "Other ways to reach us",
    goBack: "Back",
    close: "Close",
    callUs: "Call us",
    appGet: "Get the Dealer Kavach app",
    appOn: "Available on the App Store and Google Play",
    appPts: [
      ["Register in minutes", "Create your account and get started."],
      ["Everything in one place", "Track, record and stay compliant."],
      ["Secure and reliable", "Your data stays safe with us."],
    ],
    about: "About",
    aboutTitle: "About Dealer's कवच",
    aboutText: "A real look at the everyday challenges of petrol pump dealers, and how MDG Services helps you run your pump with ease, accuracy and trust.",
    shareTitle: "Send this film to a friend",
    shareSub: "Share it on WhatsApp, or copy the link to share it anywhere.",
    shareWa: "Share on WhatsApp",
    copyLink: "Copy link",
    email: "Email",
    more: "More",
    tollTitle: "Call our toll-free number",
    tollHours: "9am to 9pm, every day",
    appTitle: "Download the app",
    appSub: "Get it on the App Store or Google Play and register in it",
    run: {
      play: "Play",
      pause: "Pause",
      wait: "Loading…",
      offline: "No internet. It will play when you're back online.",
      slow: "Slow internet, nearly there…",
      speed: "Speed",
      tapChange: "tap to change",
      restart: "From the start, with sound",
      copied: "Link copied",
    },
  },
};
type Words = (typeof T)["hi"];

/** The full film's chapter names in English, by their Hindi name; one not listed stays Hindi. */
const CHAPTER_EN: Record<string, string> = {
  "शुरुआत": "Opening",
  "डीलर की असली चुनौतियाँ": "A dealer's real challenges",
  "आपकी परछाई": "Your shadow",
  "रोज़ की निगरानी": "Watching every day",
  "रिकॉर्ड का मिलान": "Matching the records",
  "पंप असेसमेंट पॉइंट सिस्टम": "Pump Assessment Point System",
  "चौबीसों घंटे साथ": "With you round the clock",
  "फ़ीस": "Fees",
  "प्रीमियम सेवाएँ": "Premium services",
  "कंपनी के काम, हमारे ज़िम्मे": "Company tasks, on us",
  "आपका डेटा, आपका": "Your data stays yours",
  "जुड़िए": "Join us",
};
// NFC on both sides: the same Hindi letter can be stored two ways
const chapterName = (lang: Lang, t: string) => (lang === "en" && CHAPTER_EN[t.normalize("NFC")]) || t;

const ICON = {
  sound:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
  muted:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm11.3.7 1.4-1.4 2.3 2.3 2.3-2.3 1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zm7 0h4v15h-4z"/></svg>',
  fs: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9V4h5v2H6v3zm11-5h5v5h-2V6h-3zM4 15h2v3h3v2H4zm14 0h2v5h-5v-2h3z"/></svg>',
  unfs: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4h2v5H4V7h3zm8 0h2v3h3v2h-5zM4 15h5v5H7v-3H4zm11 0h5v2h-3v3h-2z"/></svg>',
  replay:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.7 7.4c.3-.5.6-.5.9-.5h.6c.2 0 .5 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.6.8c-.2.2-.2.4 0 .7.6 1 1.4 1.8 2.4 2.4.3.2.5.1.7 0l.8-.9c.2-.2.4-.2.6-.1l2 1c.3.1.4.3.4.5 0 .6-.2 1.3-.7 1.7-.6.5-1.5.8-2.5.5-1.3-.4-3-1.2-4.4-2.7-1.5-1.5-2.3-3-2.6-4.2-.2-.9 0-1.8.4-2.4z" fill="currentColor"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  /** Apple's logo, for the App Store button */
  apple: `<svg viewBox="0 0 73 73" fill="currentColor" aria-hidden="true"><path d="${APPLE_MARK_PATH}"/></svg>`,
  /** a phone: the app */
  app: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm-5 21a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zM17 18H7V5h10z"/></svg>',
  /** Google Play's own four-colour mark, for the "get the app" row */
  play4: `<svg viewBox="0 0 24 24" aria-hidden="true">${PLAY_MARK_PATHS.map(([fill, d]) => `<path fill="${fill}" d="${d}"/>`).join("")}</svg>`,
  arrow: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
  join: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2zm9 4c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.9 12A3.1 3.1 0 0 1 7 8.9h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m21.9 4.3-3.2 15.2c-.2 1-.9 1.3-1.7.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.2l-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.3z"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3h-4.2a3 3 0 0 0-5.6 0H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-2 14-4-4 1.4-1.4 2.6 2.6 6.6-6.6L18 9z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5zm-2 16-4-4 1.4-1.4 2.6 2.6 6.6-6.6L18 9z"/></svg>',
  share:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.5a3 3 0 0 0 0-1.4l6.7-3.5A3 3 0 1 0 15 7l-6.7 3.5a3 3 0 1 0 0 3L15 17a3 3 0 1 0 3-1z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** a 10-second skip: the replay arrow, mirrored for forward, with the number inside */
const skip = (id: string, dir: -1 | 1, label: string) =>
  `<button type="button" class="sk" id="${id}" aria-label="${label}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"${dir > 0 ? ' style="transform:scaleX(-1)"' : ""}><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg><span>10</span></button>`;
const seg = (label: string, id: string, items: Array<[string, string, string]>, hidden = false) =>
  `<div class="set" id="${id}"${hidden ? " hidden" : ""}><span>${label}</span><div class="seg" role="group" aria-label="${label}">${items
    .map(([attr, val, text]) => `<button type="button" ${attr}="${val}" aria-pressed="false">${text}</button>`)
    .join("")}</div></div>`;
const mmss = (t: number) => {
  const s = Math.floor(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const minifyCss = (css: string) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

async function playerJs(root: string): Promise<string> {
  const file = path.join(root, "src/film/player.ts");
  // es2018: phones a few Chrome versions old still run it (no ?. or ??), and
  // object spread stays native so no runtime helper import sneaks in
  const ts = await transformWithOxc(readFileSync(file, "utf8"), file, { target: "es2018" });
  const out = await minify("player.js", ts.code, { compress: { target: "es2018" }, mangle: true });
  if (out.errors?.length) throw new Error(`film player minify: ${JSON.stringify(out.errors[0])}`);
  // the type-only import makes the source a module; the empty marker it leaves is dropped
  const code = out.code.replace(/export\s*\{\s*\};?\s*$/, "");
  if (/(^|[;\s])(import|export)[\s{"'*]/.test(code)) throw new Error("film player: output must be a plain script, found import/export");
  // never let the inline script close its own <script> element
  return code.replace(/<\/script/gi, "<\\/script").trim();
}

function hlsJs(root: string): { fileName: string; source: string } {
  const req = createRequire(path.join(root, "package.json"));
  const pkg = JSON.parse(readFileSync(req.resolve("hls.js/package.json"), "utf8")) as { version: string };
  const src = readFileSync(req.resolve("hls.js/dist/hls.light.min.js"), "utf8").replace(/\n\/\/# sourceMappingURL=.*$/m, "");
  return { fileName: `film/hls-${pkg.version}.js`, source: src };
}

export async function buildFilmPages(opts: { root: string; beaconUrl?: string }): Promise<FilmPageFile[]> {
  const { root } = opts;
  const beacon = opts.beaconUrl || process.env.FILM_BEACON_URL || DEFAULT_BEACON;
  // FILMS_JSON: build the pages from another film list (a local trial package), never for a deploy
  const films = JSON.parse(readFileSync(process.env.FILMS_JSON || path.join(root, "src/film/films.json"), "utf8")) as Record<FilmId, FilmJson>;
  const css = minifyCss(readFileSync(path.join(root, "src/film/page.css"), "utf8"));
  const js = await playerJs(root);
  const hls = hlsJs(root);
  const fullMin = Math.round((films.kavach.duration || 0) / 60);

  const files: FilmPageFile[] = [hls];
  for (const id of Object.keys(PAGES) as FilmId[]) {
    const f = films[id];
    const p = PAGES[id];
    const live = !!(f && f.version && f.base && f.duration);
    for (const lang of LANGS) {
      const html = page({ f, p, lang, live, css, js, beacon, hlsSrc: `/${hls.fileName}`, fullMin, peek: peek(films.kavach, lang), root });
      files.push({ fileName: `${p.path.slice(1)}/${lang === "hi" ? "" : `${lang}/`}index.html`, source: html });
    }
  }
  return files;
}

/** What the short's end screen promises is in the full film: four of its own chapter names. */
function peek(full: FilmJson, lang: Lang): string[] {
  const ch = full.chapters || [];
  return [1, 2, 3, 7].map((i) => ch[i] && chapterName(lang, ch[i].title)).filter((t): t is string => !!t);
}

/** gzipped byte size of each generated page, for the build log. */
export function pageSizes(files: FilmPageFile[]): string {
  return files
    .filter((f) => f.fileName.endsWith(".html"))
    .map((f) => `${f.fileName} ${(Buffer.byteLength(f.source) / 1024).toFixed(1)} kB, ${(gzipSync(f.source, { level: 9 }).length / 1024).toFixed(1)} kB gz`)
    .join("; ");
}

function page(a: {
  f: FilmJson;
  p: (typeof PAGES)[FilmId];
  lang: Lang;
  live: boolean;
  css: string;
  js: string;
  beacon: string;
  hlsSrc: string;
  fullMin: number;
  peek: string[];
  /** the project root, to find the chapter stills */
  root: string;
}): string {
  const { f, p, lang, live, js } = a;
  // the "coming soon" card's rules only matter while a film is not published
  const css = live ? a.css.replace(/\.soon[^{]*\{[^}]*\}/g, "") : a.css;
  const w: Words = T[lang];
  const url = SITE + p.path;
  /** this language's own address: /film for Hindi, /film?lang=en for English */
  const self = lang === "hi" ? url : `${url}?lang=${lang}`;
  const title = w.title[f.film] || f.title;
  const desc = w.desc[f.film](a.fullMin);
  const poster = live ? `${f.base}/${f.poster}` : "";
  /* The film as a search engine reads it, so the page can come up as a video
     result for someone who has never heard of us. */
  const video = live
    ? `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        description: desc,
        thumbnailUrl: [poster, SITE + p.og],
        uploadDate: PUBLISHED,
        duration: isoDuration(f.duration || 0),
        contentUrl: `${f.base}/${f.mp4}`,
        inLanguage: "hi",
        publisher: { "@type": "Organization", name: "MDG Services", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/film/mark.png` } },
      }).replace(/</g, "\\u003c")}</script>\n`
    : "";
  /* Hindi unless the visitor chose otherwise. A choice made on the site before
     the mdg_lang cookie existed lives only in localStorage: honour it once,
     through ?lang=, which also sets the cookie for every later visit. */
  const follow = `<script>(function(){try{var l=localStorage.getItem("mdg.lang"),s=location.search;if(l=="${lang === "hi" ? "en" : "hi"}"&&!/[?&]lang=(hi|en)(&|$)/.test(s)&&!/(^|;\\s*)mdg_lang=(hi|en)/.test(document.cookie)){window.__mdgLeaving=1;var r=document.referrer;if(r&&r.indexOf(location.host+"/film")<0)sessionStorage.setItem("mdg_ref",r);var q=s.slice(1).split("&").filter(function(x){return x&&x.indexOf("lang=")});q.push("lang="+l);location.replace("${p.path}?"+q.join("&")+location.hash)}}catch(e){}})()</script>`;
  /* Both languages always on screen, the live one filled, as on the rest of the site. */
  const toggle = `<nav class="lang" aria-label="${w.langAria}">${LANGS.map(
    (l) =>
      `<a data-lang="${l}" lang="${l}" href="${p.path}?lang=${l}"${l === lang ? ' aria-current="true"' : ""}>${l === "hi" ? "हिंदी" : "EN"}</a>`,
  ).join("")}</nav>`;
  const head = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${follow}
<title>${esc(title)} · MDG Services</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="hi" href="${url}">
<link rel="alternate" hreflang="en" href="${url}?lang=en">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta name="theme-color" content="#101133">
<link rel="icon" type="image/png" href="/film/mark.png">
<meta property="og:type" content="video.other">
<meta property="og:site_name" content="MDG Services">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${self}">
<meta property="og:image" content="${SITE}${p.og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${w.locale}">
<meta name="twitter:card" content="summary_large_image">
${video}${live ? `<link rel="preconnect" href="${MEDIA_ORIGIN}" crossorigin>\n<link rel="preload" as="image" href="${poster}" crossorigin="anonymous" fetchpriority="high">\n` : ""}<style>${css}</style>
</head><body>
<header><a href="/" aria-label="MDG Services"><img src="/film/mark.png" width="32" height="32" alt=""></a><div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div>${toggle}</header>
<main>`;
  const foot = `<footer><a href="/">mdgservices.in</a> · <a href="/privacy">${w.privacy}</a></footer>`;

  if (!live) {
    // the film is still being made: a calm placeholder, and the way to the full film
    return `${head}
<div class="stage"><div class="soon"><img src="/film/mark.png" width="72" height="72" alt=""><b>${w.comingSoon}</b><p>${esc(w.soon[f.film])}</p>${p.kind === "short" ? `<a class="btn pri" id="full" href="/film">${w.fullSoon(a.fullMin)}</a>` : ""}</div></div>
${foot}</main>
<script>(function(){var a=document.getElementById("full"),r=new URLSearchParams(location.search).get("r");if(a&&r&&/^[A-Za-z0-9_-]{1,32}$/.test(r))a.href="/film?r="+r})()</script>
</body></html>
`;
  }

  /* More than one language: the film starts muted behind a card of the languages, each in its own script; the tap
     that picks one also turns the sound on. One language: the gold "sound on" pill, as before. */
  const langs: FilmAudio[] = f.audio && f.audio.length ? f.audio : [{ lang: "hi", name: "हिन्दी", hls: f.hls || "", playlists: f.playlists || { hd: "", sd: "", lite: "" }, mp4: f.mp4 || "", captions: f.captions || "" }];
  const multi = langs.length > 1;
  const tracks = langs.map((l, i) => `<track kind="captions" srclang="${l.lang}" label="${esc(l.name)}"${i ? "" : " default"} src="${f.base}/${l.captions}">`).join("");
  const picker = multi
    ? `<div class="pick" id="snd" data-pick hidden role="dialog" aria-labelledby="pick-t"><div class="card"><b id="pick-t">${w.pickTitle}</b><div class="opts">${langs
        .map((l) => `<button type="button" data-al="${l.lang}" lang="${l.lang}">${esc(l.name)}</button>`)
        .join("")}</div><p>${ICON.sound}${w.pickSub}</p></div></div>`
    : `<button type="button" class="snd" id="snd" hidden>${ICON.sound}${w.soundOn}</button>`;
  const chapterList = (f.chapters || []).map((c) => ({ t: c.t, title: chapterName(lang, c.title) }));
  // From the chapter on fees on, the full film has said what it does and what
  // it costs: from there the controls carry a small "tell us on WhatsApp" too.
  const fees = (f.chapters || []).find((c) => c.title.normalize("NFC") === "फ़ीस".normalize("NFC"));
  const cfg = {
    film: f.film, title, duration: f.duration, base: f.base, hls: f.hls, playlists: f.playlists, mp4: f.mp4,
    captions: f.captions, audio: multi ? langs : undefined, chapters: chapterList, beacon: a.beacon, hlsJs: a.hlsSrc, url, kind: p.kind, lang, s: w.run,
    lateAt: p.kind === "full" && fees ? fees.t : 0,
  };
  // Start services is the one main action, and it never opens a form of ours:
  // /start sends an iPhone to the App Store and an Android phone to Google Play,
  // and a computer to /register, which shows both buttons. The player adds the
  // share code to the address (the data-reg mark), so the tap is counted.
  const startHref = `/start?lang=${lang}`;
  const start = (cls: string) =>
    `<a class="${cls}" data-reg href="${startHref}"><i class="dot">${ICON.app}</i><span><b>${w.start}</b><small>${w.startSub}</small></span></a>`;
  // The toll-free number, in sight on the first screen: a plain line that dials.
  const callRow = `<a class="callrow" href="${TOLL_FREE_TEL}">${ICON.phone}<span>${w.questions}</span><b>${TOLL_FREE_SHOWN}</b></a>`;
  // Sharing the film opens its own sheet: WhatsApp, a copied link, and the
  // other apps. A quiet link with a share arrow, never green.
  const share = (cls: string, text: string) =>
    `<a class="${cls}" data-open="v-share" href="https://wa.me/">${ICON.share}${text}</a>`;
  const fullBtn = (cls: string) =>
    `<a class="${cls}" data-full href="/film?from=short">${ICON.play}${w.full(a.fullMin)}</a>`;
  /** A card that leads somewhere: a tinted circle with its mark, the words, a chevron. */
  const way = (attrs: string, tone: string, icon: string, title: string, lines: string) =>
    `<a class="way" ${attrs}><i class="dot ${tone}">${icon}</i><div><b>${title}</b>${lines}</div></a>`;
  /*
   * One screen for each thing a dealer can do, each with a way back: call us,
   * leave a number, the thank-you, the app. Over the page, not new pages, so
   * the film keeps its place; the phone's Back button closes them (player.ts).
   * Settings and sharing are sheets over the film.
   */
  const view = (id: string, title: string, body: string, sheet = false) =>
    `<div class="view${sheet ? " sheet" : ""}" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-t" hidden><div class="pane"><div class="bar">${
      sheet
        ? `<b id="${id}-t">${title}</b><button type="button" class="ic x" data-close aria-label="${w.close}">${ICON.x}</button>`
        : `<button type="button" class="ic" data-close aria-label="${w.goBack}">${ICON.arrow}</button><b id="${id}-t">${title}</b>`
    }</div>${body}</div></div>`;
  const store = (href: string, icon: string, small: string, name: string) =>
    `<a class="btn store" data-reg href="${href}" target="_blank" rel="noopener">${icon}<span><small>${small}</small><b>${name}</b></span></a>`;
  const appView = view(
    "v-app",
    w.appTitle,
    `<div class="box"><div class="head"><i class="dot dark">${ICON.app}</i><div><b>${w.appGet}</b><span>${w.appOn}</span></div></div>${store(APP_STORE, ICON.apple, "Download on the", "App Store")}${store(PLAY_URL, ICON.play4, "GET IT ON", "Google Play")}</div>
<ul class="box pts">${w.appPts.map(([t, d], i) => `<li><i class="dot lilac">${[ICON.join, ICON.clip, ICON.shield][i]}</i><div><b>${t}</b><span>${d}</span></div></li>`).join("")}</ul>
${callRow}`,
  );
  const setView = view(
    "v-set",
    w.settings,
    `<div class="sets">${seg(w.speed, "speed", [["data-rate", "1", "1x"], ["data-rate", "1.2", "1.2x"], ["data-rate", "1.5", "1.5x"]])}${multi ? seg(w.filmLang, "al", langs.map((l) => ["data-al", l.lang, esc(l.name)] as [string, string, string])) : ""}${seg(w.subs, "subs", [["data-cc", "1", w.on], ["data-cc", "0", w.off]])}${seg(w.pic, "qual", [["data-q", "auto", w.auto], ["data-q", "hd", "HD"], ["data-q", "lite", w.lite]], true)}</div>${share("btn line", w.friend)}`,
    true,
  );
  const app = (attrs: string, tone: string, icon: string, label: string, tag = "a") =>
    `<${tag} ${attrs}><i class="dot ${tone}">${icon}</i>${label}</${tag}>`;
  const shareView = view(
    "v-share",
    w.shareTitle,
    `<p class="lead">${w.shareSub}</p><a class="btn wa" data-wa href="https://wa.me/" target="_blank" rel="noopener">${ICON.wa}${w.shareWa}</a><button type="button" class="btn line" id="copy">${ICON.link}<span>${w.copyLink}</span></button>
<div class="apps">${app('data-wa href="https://wa.me/" target="_blank" rel="noopener"', "g", ICON.wa, "WhatsApp")}${app('id="tg" href="https://t.me/" target="_blank" rel="noopener"', "tg", ICON.tg, "Telegram")}${app('id="em" href="mailto:"', "em", ICON.mail, w.email)}${app('type="button" id="more"', "dark", ICON.dots, w.more, "button")}</div>`,
    true,
  );
  const next = `<section class="next" id="next"><h2>${w.next}</h2>
${way(`href="${TOLL_FREE_TEL}"`, "gold", ICON.phone, w.callUs, `<strong>${TOLL_FREE_SHOWN}</strong><span>${w.tollHours}</span>`)}
${way(`data-open="v-app" href="${startHref}"`, "dark", ICON.app, w.appTitle, `<span>${w.appSub}</span>`)}</section>`;
  // the end of either film: Start services first, then the next film or the toll-free line, then again / share
  const endBody =
    p.kind === "short"
      ? `<b class="ask">${w.inFull}</b><ul class="peek">${a.peek.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>${start("btn start")}${fullBtn("btn alt")}`
      : `<b class="ask">${w.endAsk}</b>${start("btn start")}${callRow}`;
  // A still from the film at each chapter, cut by scripts/film-chapter-stills.sh
  // into public/film/ch/<film>-<n>.webp. Below the fold, so they load lazily
  // and never compete with the poster; a chapter without one simply has none.
  const has = (file: string) => existsSync(path.join(a.root, "public/film/ch", file));
  const still = (i: number) =>
    has(`${f.film}-${i}.webp`)
      ? `<img src="/film/ch/${f.film}-${i}.webp" width="96" height="60" loading="lazy" decoding="async" alt="">`
      : "";
  const chapterRows = `<p class="meta">${mmss(f.duration || 0)} · ${w.chapterCount(chapterList.length)}</p><ol>${chapterList
    .map(
      (c, i) =>
        `<li><button type="button" data-t="${c.t}"><i class="pl">${ICON.play}</i><span class="tt"><span>${mmss(c.t)}</span><b>${esc(c.title)}</b></span>${still(i)}</button></li>`,
    )
    .join("")}</ol>`;
  const about = `<div class="box about"><div class="head"><i class="dot gold">${ICON.user}</i><b>${w.aboutTitle}</b></div><p>${w.aboutText}</p>${
    has("kavach-about.webp") ? `<img src="/film/ch/kavach-about.webp" width="540" height="300" loading="lazy" decoding="async" alt="">` : ""
  }</div>`;
  // Chapters and About as two tabs on the full film; the short has only About.
  const info = chapterList.length
    ? `<section class="info ch"><div class="tabs" role="tablist"><button type="button" role="tab" id="t-ch" aria-controls="p-ch" aria-selected="true">${w.chapters}</button><button type="button" role="tab" id="t-ab" aria-controls="p-ab" aria-selected="false">${w.about}</button></div><div id="p-ch" role="tabpanel" aria-labelledby="t-ch">${chapterRows}</div><div id="p-ab" role="tabpanel" aria-labelledby="t-ab" hidden>${about}</div></section>`
    : `<section class="info">${about}</section>`;
  return `${head}
<div class="stage" id="stage">
<video id="v" playsinline preload="auto" controls crossorigin="anonymous" poster="${poster}" aria-label="${esc(title)}">${tracks}</video>
<div class="load" id="load" hidden><b id="loadmsg">${w.loading}</b><i></i></div>
<div class="ui" id="ui">
<span class="hd" id="hd" hidden>HD</span>
<div class="mid">${skip("back", -1, w.back)}<button type="button" class="pp" id="pp" aria-label="${w.pause}">${ICON.pause}${ICON.play}</button>${skip("fwd", 1, w.fwd)}</div>
<div class="low">${p.kind === "full" ? `<a class="wpill" data-reg href="${startHref}">${ICON.app}${w.startPill}</a>` : ""}<p class="now" id="chap"></p><div class="row"><span class="time" id="time">0:00 / ${mmss(f.duration || 0)}</span><button type="button" class="rate" id="rate" data-open="v-set">1.2x</button><button type="button" class="ic" id="mute" aria-label="${w.sound}">${ICON.sound}${ICON.muted}</button><button type="button" class="ic" id="fs" aria-label="${w.fs}">${ICON.fs}${ICON.unfs}</button></div>
<div class="seek"><div class="ticks" id="ticks"></div><input type="range" id="seek" min="0" max="${f.duration}" step="0.1" value="0" aria-label="${w.seek}"></div></div>
</div>
<div class="mini"></div>
<div class="nudge" id="nl">${w.back}</div><div class="nudge r" id="nr">${w.fwd}</div><div class="nudge c" id="nc">${w.run.restart}</div>
<div class="wait" id="wait" hidden><i></i><b id="waitmsg">${w.wait}</b></div>
${picker}
<button type="button" class="resume" id="resume" hidden>${ICON.play}<span>${w.resume}</span></button>
<button type="button" class="big" id="big" hidden><span>${ICON.play}</span>${w.play}</button>
<div class="err" id="err" hidden><b>${w.err}</b><p>${w.errHow}</p><button type="button" class="btn pri" id="retry">${ICON.replay}${w.retry}</button></div>
<div class="end" id="end" role="group" aria-label="${esc(title)}" aria-live="polite" hidden>${endBody}<div class="two"><button type="button" class="lnk" id="replay">${ICON.replay}${w.replay}</button>${share("lnk", w.friendShort)}</div></div>
</div>
<div class="act">${start("btn start")}${p.kind === "short" ? fullBtn("btn alt") : ""}${callRow}</div>
${next}
${info}
${foot}</main>
${appView}${setView}${shareView}
<script type="application/json" id="cfg">${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>
<script>${js}</script>
</body></html>
`;
}
