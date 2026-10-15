import FormShell from "../components/FormShell";
import RegisterForm from "../components/RegisterForm";
import { BRAND } from "../data/content";
import { en } from "../i18n/en";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";

/** /register and /hi/register: the dealer enrolment form. */
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
          {r.appLead}{" "}
          <a
            href={BRAND.playStore}
            target="_blank"
            rel="noopener"
            className="whitespace-nowrap font-semibold text-gold-300 underline decoration-gold-300/40 underline-offset-4 hover:decoration-gold-300"
          >
            {r.appLink} →
          </a>
        </>
      }
    >
      <RegisterForm r={r} originalTerms={r.bindingNotice !== "" ? en.register.terms : undefined} />
    </FormShell>
  );
}
