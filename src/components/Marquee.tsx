const items = [
  "SDMS Compliance",
  "MDG Compliance",
  "Inspection Support",
  "Document Reminders",
  "Automation Support",
  "Web Portal Support",
  "XTRA Campaigns",
  "DOD & Stock Punctuality",
  "Digital Payment Reconciliation",
  "Cyber Security",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-navy/5 bg-cream py-4">
      <div className="flex animate-[scroll_30s_linear_infinite] gap-12 whitespace-nowrap text-sm font-semibold text-navy/70">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
