import CallUs from "../components/CallUs";
import FormShell from "../components/FormShell";
import StoreButtons from "../components/StoreButtons";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";

/**
 * /register and /hi/register: where a dealer is sent to get the Dealer Kavach
 * app. Registering happens inside the app, so there is no form on this page:
 * the two store buttons, the three steps, and the toll-free line for questions.
 * The address stays because older WhatsApp invites, emails and search results
 * still point at it.
 */
export default function RegisterPage({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const r = t.register;
  return (
    <FormShell
      lang={lang}
      route="/register"
      backLabel={r.backToHome}
      eyebrow={r.eyebrow}
      eyebrowDeva={r.eyebrowDeva}
      heading={r.heading}
      intro={r.intro}
      extra={
        <>
          <span className="block">
            <StoreButtons from="register" appStoreAria={r.appStoreAria} playAria={r.playAria} className="mb-6" />
          </span>
          {r.appLead}{" "}
          <CallUs
            label={r.appLink}
            className="font-semibold text-gold-300 underline decoration-gold-300/40 underline-offset-4 hover:decoration-gold-300"
          />
        </>
      }
    >
      <section aria-labelledby="register-steps" className="bg-white">
        <div className="wrap-wide py-14 sm:py-20">
          <h2 id="register-steps" className="eyebrow">
            {r.stepsHeading}
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {r.steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-ink-hairline bg-paper-warm p-7">
                <span className="num text-[26px] font-semibold text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-[22px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[14px] text-ink-muted">{r.computerNote}</p>
        </div>
      </section>
    </FormShell>
  );
}
