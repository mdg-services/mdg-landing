import type { SVGProps } from "react";

export type IconName =
  | "doc" | "gauge" | "clipboard" | "bell" | "cpu" | "globe" | "gift"
  | "fuel" | "grad" | "card" | "siren" | "wallet" | "lock" | "shield"
  | "phone" | "arrow" | "arrowDown" | "plus" | "check" | "spark" | "pump";

const P: Record<IconName, string[]> = {
  doc: ["M14 3v4a1 1 0 0 0 1 1h4", "M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M9 13h6M9 17h6"],
  gauge: ["M12 13l3.5-3.5", "M4 18a8 8 0 1 1 16 0", "M4 18h16"],
  clipboard: ["M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z", "M8 6H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2", "M8.5 13.5l2 2 4-4"],
  bell: ["M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"],
  cpu: ["M7 7h10v10H7z", "M9.5 9.5h5v5h-5z", "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2"],
  globe: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M3 12h18", "M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"],
  gift: ["M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z", "M3 7h18v4H3z", "M12 7v14", "M12 7S10.5 3 8 4s-.5 3 4 3M12 7s1.5-4 4-3 .5 3-4 3"],
  fuel: ["M6 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16", "M4 21h13", "M15 9h2.5A1.5 1.5 0 0 1 19 10.5V16a2 2 0 0 0 2 2", "M21 12V8.5L19 6.5", "M8.5 8h4"],
  grad: ["M12 4 2 9l10 5 10-5-10-5z", "M6 11.5V16c0 1.3 2.7 3 6 3s6-1.7 6-3v-4.5", "M22 9v5"],
  card: ["M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z", "M2 10h20", "M6 14h4"],
  siren: ["M7 18v-5a5 5 0 0 1 10 0v5", "M5 21h14", "M5 18h14", "M12 3v2M4.5 7 6 8.5M19.5 7 18 8.5"],
  wallet: ["M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1", "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6", "M16.5 13.5h.01"],
  lock: ["M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z", "M8 11V8a4 4 0 0 1 8 0v3", "M12 15v2"],
  shield: ["M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z", "M9 12l2 2 4-4"],
  phone: ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"],
  arrow: ["M5 12h14m0 0-6-6m6 6-6 6"],
  arrowDown: ["M12 5v14m0 0-6-6m6 6 6-6"],
  plus: ["M12 5v14M5 12h14"],
  check: ["M4 12.5l5 5L20 6.5"],
  spark: ["M12 3v4M12 17v4M3 12h4M17 12h4", "M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4z"],
  pump: ["M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14", "M8 8h4", "M15 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-2-2"],
};

export default function Icon({
  name,
  size = 22,
  ...props
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {P[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
